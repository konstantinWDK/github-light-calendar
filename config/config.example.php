<?php
/**
 * GitHub Calendar Configuration Example
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to 'config.php'
 * 2. Replace the placeholder values with your actual configuration
 * 3. The config.php file is automatically ignored by git for security
 */

// GitHub Personal Access Token (required for private contributions)
// Create at: https://github.com/settings/tokens
// For public repositories only: no special permissions needed
// For private contributions: check 'user' scope when creating the token
// Leave empty to use without token (60 requests/hour limit, public only)
define('GITHUB_TOKEN', 'ghp_your_actual_token_here');

// Cache settings
define('CACHE_DURATION', 3600); // 1 hour in seconds (3600 = 1 hour)

// API settings
define('API_TIMEOUT', 10); // seconds to wait for GitHub API response
define('MAX_RETRIES', 3);   // not implemented yet

// Debug mode (set to false in production)
define('DEBUG_MODE', false); // set to true to enable error logging