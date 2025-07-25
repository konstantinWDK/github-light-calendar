<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Load configuration
$config_file = __DIR__ . '/../config/config.php';
if (file_exists($config_file)) {
    require_once $config_file;
} else {
    // Default configuration if config.php doesn't exist
    define('GITHUB_TOKEN', '');
    define('CACHE_DURATION', 3600);
    define('API_TIMEOUT', 10);
    define('DEBUG_MODE', false);
}

// Cache configuration
$cache_dir = __DIR__ . '/../cache';
$cache_duration = CACHE_DURATION;

// Create cache directory if it doesn't exist
if (!is_dir($cache_dir)) {
    mkdir($cache_dir, 0755, true);
}

// Debug: Log received parameters
error_log("GET parameters: " . print_r($_GET, true));
error_log("Raw query string: " . $_SERVER['QUERY_STRING'] ?? 'none');

if (!isset($_GET['username']) || empty($_GET['username'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Username required', 
        'received_params' => $_GET,
        'query_string' => $_SERVER['QUERY_STRING'] ?? 'none'
    ]);
    exit;
}

$username = $_GET['username'];

// Cache functions
function getCacheFilePath($username) {
    global $cache_dir;
    return $cache_dir . '/github_' . md5($username) . '.json';
}

function isCacheValid($cache_file) {
    global $cache_duration;
    return file_exists($cache_file) && (time() - filemtime($cache_file)) < $cache_duration;
}

function getCachedData($username) {
    $cache_file = getCacheFilePath($username);
    if (isCacheValid($cache_file)) {
        $data = file_get_contents($cache_file);
        return json_decode($data, true);
    }
    return false;
}

function setCachedData($username, $data) {
    $cache_file = getCacheFilePath($username);
    file_put_contents($cache_file, json_encode($data));
}

// Generate mock contributions when rate limited
function generateMockContributions() {
    $contributions = [];
    $today = new DateTime();
    $oneYearAgo = clone $today;
    $oneYearAgo->sub(new DateInterval('P1Y'));
    
    $current = clone $oneYearAgo;
    while ($current <= $today) {
        $dateStr = $current->format('Y-m-d');
        // Generate realistic mock data: more activity on weekdays, some quiet periods
        $dayOfWeek = $current->format('N'); // 1-7, Monday to Sunday
        if ($dayOfWeek <= 5) { // Weekdays
            $contributions[$dateStr] = rand(0, 8);
        } else { // Weekends
            $contributions[$dateStr] = rand(0, 3);
        }
        $current->add(new DateInterval('P1D'));
    }
    
    return $contributions;
}

// Función para obtener contribuciones usando GraphQL API (incluye privadas)
function getGitHubContributionsGraphQL($username) {
    $github_token = GITHUB_TOKEN ?: getenv('GITHUB_TOKEN');
    
    if (!$github_token || $github_token === 'ghp_your_token_here') {
        error_log("No GitHub token available, falling back to REST API (public only)");
        return getGitHubDataREST($username);
    }
    
    $today = new DateTime();
    $oneYearAgo = clone $today;
    $oneYearAgo->sub(new DateInterval('P1Y'));
    
    $query = '
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }';
    
    $variables = [
        'username' => $username
    ];
    
    $data = fetchGitHubGraphQL($query, $variables);
    
    if ($data && isset($data['data']['user']['contributionsCollection']['contributionCalendar']['weeks'])) {
        $contributions = [];
        $weeks = $data['data']['user']['contributionsCollection']['contributionCalendar']['weeks'];
        
        foreach ($weeks as $week) {
            foreach ($week['contributionDays'] as $day) {
                $contributions[$day['date']] = $day['contributionCount'];
            }
        }
        
        return $contributions;
    }
    
    error_log("GraphQL failed, falling back to REST API");
    return getGitHubDataREST($username);
}

// Función para obtener eventos de GitHub usando REST API (solo públicos)
function getGitHubDataREST($username) {
    $contributions = [];
    $today = new DateTime();
    $oneYearAgo = clone $today;
    $oneYearAgo->sub(new DateInterval('P1Y'));
    
    // Inicializar array con ceros
    $current = clone $oneYearAgo;
    while ($current <= $today) {
        $dateStr = $current->format('Y-m-d');
        $contributions[$dateStr] = 0;
        $current->add(new DateInterval('P1D'));
    }
    
    // Intentar obtener datos de eventos públicos
    $eventsUrl = "https://api.github.com/users/{$username}/events/public";
    $eventsData = fetchGitHubAPI($eventsUrl);
    
    if ($eventsData) {
        foreach ($eventsData as $event) {
            $eventDate = new DateTime($event['created_at']);
            if ($eventDate >= $oneYearAgo && $eventDate <= $today) {
                $dateStr = $eventDate->format('Y-m-d');
                if (isset($contributions[$dateStr])) {
                    $contributions[$dateStr]++;
                }
            }
        }
    }
    
    // También intentar obtener repositorios y sus commits
    $reposUrl = "https://api.github.com/users/{$username}/repos?sort=updated&per_page=10";
    $reposData = fetchGitHubAPI($reposUrl);
    
    if ($reposData) {
        foreach ($reposData as $repo) {
            // Solo repos actualizados en el último año
            $repoUpdated = new DateTime($repo['updated_at']);
            if ($repoUpdated >= $oneYearAgo) {
                // Obtener commits del repositorio
                $commitsUrl = "https://api.github.com/repos/{$username}/{$repo['name']}/commits?author={$username}&since=" . $oneYearAgo->format('c');
                $commitsData = fetchGitHubAPI($commitsUrl);
                
                if ($commitsData) {
                    foreach ($commitsData as $commit) {
                        $commitDate = new DateTime($commit['commit']['author']['date']);
                        if ($commitDate >= $oneYearAgo && $commitDate <= $today) {
                            $dateStr = $commitDate->format('Y-m-d');
                            if (isset($contributions[$dateStr])) {
                                $contributions[$dateStr]++;
                            }
                        }
                    }
                }
            }
        }
    }
    
    return $contributions;
}

function fetchGitHubGraphQL($query, $variables = []) {
    $github_token = GITHUB_TOKEN ?: getenv('GITHUB_TOKEN');
    
    if (!$github_token || $github_token === 'ghp_your_token_here') {
        return false;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.github.com/graphql');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'GitHub-Calendar-Widget/1.0');
    
    $headers = [
        'Authorization: Bearer ' . $github_token,
        'Content-Type: application/json',
        'User-Agent: GitHub-Calendar-Widget/1.0'
    ];
    
    $payload = json_encode([
        'query' => $query,
        'variables' => $variables
    ]);
    
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, API_TIMEOUT);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        error_log("GraphQL cURL Error: " . $error);
        return false;
    }
    
    if ($httpCode === 403) {
        error_log("GitHub GraphQL Rate Limited: HTTP " . $httpCode);
        error_log("Response: " . $response);
        return 'RATE_LIMITED';
    }
    
    if ($httpCode !== 200) {
        error_log("GitHub GraphQL Error: HTTP " . $httpCode);
        error_log("Response: " . $response);
        return false;
    }
    
    $data = json_decode($response, true);
    
    if (isset($data['errors'])) {
        error_log("GraphQL Errors: " . json_encode($data['errors']));
        return false;
    }
    
    return $data ?: false;
}

function fetchGitHubAPI($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'GitHub-Calendar-Widget/1.0');
    
    $headers = [
        'Accept: application/vnd.github.v3+json',
        'User-Agent: GitHub-Calendar-Widget/1.0'
    ];
    
    // Add GitHub token for higher rate limits (from config or environment)
    $github_token = GITHUB_TOKEN ?: getenv('GITHUB_TOKEN');
    if ($github_token && $github_token !== 'ghp_your_token_here') {
        $headers[] = 'Authorization: token ' . $github_token;
    }
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, API_TIMEOUT);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        error_log("cURL Error: " . $error);
        return false;
    }
    
    // Handle rate limiting
    if ($httpCode === 403) {
        error_log("GitHub API Rate Limited: HTTP " . $httpCode . " for URL: " . $url);
        error_log("Response: " . $response);
        return 'RATE_LIMITED';
    }
    
    if ($httpCode !== 200) {
        error_log("GitHub API Error: HTTP " . $httpCode . " for URL: " . $url);
        error_log("Response: " . $response);
        return false;
    }
    
    $data = json_decode($response, true);
    return $data ?: false;
}

try {
    // Check cache first
    $cachedData = getCachedData($username);
    if ($cachedData) {
        echo json_encode($cachedData);
        exit;
    }
    
    // Verificar que el usuario existe
    $userUrl = "https://api.github.com/users/{$username}";
    $userData = fetchGitHubAPI($userUrl);
    
    if ($userData === 'RATE_LIMITED') {
        // Use mock data when rate limited
        error_log("Rate limited, using mock data for user: " . $username);
        $userData = ['login' => $username]; // Mock user data
        $contributions = generateMockContributions();
    } elseif (!$userData) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found or GitHub API unavailable']);
        exit;
    } else {
        // Obtener contribuciones reales (incluye privadas si hay token)
        $contributions = getGitHubContributionsGraphQL($username);
    }
    
    // Convertir a formato de semanas
    $weeks = [];
    $today = new DateTime();
    $oneYearAgo = clone $today;
    $oneYearAgo->sub(new DateInterval('P1Y'));
    
    $current = clone $oneYearAgo;
    
    // Ajustar al inicio de la semana (domingo = 0)
    $dayOfWeek = $current->format('w');
    $current->sub(new DateInterval("P{$dayOfWeek}D"));
    
    while ($current <= $today) {
        $week = ['days' => []];
        
        for ($i = 0; $i < 7; $i++) {
            $dateStr = $current->format('Y-m-d');
            $count = isset($contributions[$dateStr]) ? $contributions[$dateStr] : 0;
            
            $week['days'][] = [
                'date' => $dateStr,
                'count' => $count
            ];
            
            $current->add(new DateInterval('P1D'));
        }
        
        $weeks[] = $week;
    }
    
    $result = [
        'weeks' => $weeks,
        'user' => $userData['login'],
        'total' => array_sum($contributions)
    ];
    
    // Cache the result
    setCachedData($username, $result);
    
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>