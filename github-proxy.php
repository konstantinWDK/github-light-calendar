<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if (!isset($_GET['username'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Username required']);
    exit;
}

$username = $_GET['username'];

// Función para obtener eventos de GitHub usando múltiples endpoints
function getGitHubData($username) {
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

function fetchGitHubAPI($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'GitHub-Calendar-Widget/1.0');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/vnd.github.v3+json',
        'User-Agent: GitHub-Calendar-Widget/1.0'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        error_log("cURL Error: " . $error);
        return false;
    }
    
    if ($httpCode !== 200) {
        error_log("GitHub API Error: HTTP " . $httpCode . " for URL: " . $url);
        return false;
    }
    
    $data = json_decode($response, true);
    return $data ?: false;
}

try {
    // Verificar que el usuario existe
    $userUrl = "https://api.github.com/users/{$username}";
    $userData = fetchGitHubAPI($userUrl);
    
    if (!$userData) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found or GitHub API unavailable']);
        exit;
    }
    
    // Obtener contribuciones
    $contributions = getGitHubData($username);
    
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
    
    echo json_encode([
        'weeks' => $weeks,
        'user' => $userData['login'],
        'total' => array_sum($contributions)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>