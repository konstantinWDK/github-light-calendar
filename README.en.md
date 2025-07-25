# GitHub Light Calendar

[🇪🇸 Español](README.md) | 🇺🇸 English

A lightweight, customizable GitHub contributions calendar widget that can be easily embedded into any website.

## 📁 Project Structure

```
github-light-calendar/
├── src/                    # Source JavaScript files
│   └── github-calendar.js  # Main library file
├── css/                    # Stylesheets
│   └── github-calendar.css # Calendar styles
├── server/                 # Backend proxy
│   └── github-proxy.php    # GitHub API proxy
├── config/                 # Configuration files
│   ├── config.php          # Your private config (gitignored)
│   └── config.example.php  # Example configuration
├── examples/              # Usage examples
│   ├── example.html       # Local development example
│   └── cdn-example.html   # CDN usage example
├── docs/                  # Documentation
│   └── SETUP.md          # Setup instructions
├── cache/                 # Auto-generated cache (gitignored)
└── README.md             # This file
```

## ✨ Features

- 🎨 Lightweight and customizable
- 📱 Responsive design
- 🔄 Automatic caching (1 hour)
- 🛡️ Rate limit protection with fallback
- 🌐 CDN ready
- 🔒 Secure token management

## 🚀 Quick Start

### CDN Usage (Recommended)
```html
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
<div id="calendar"></div>
<script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
<script>
GitHubCalendar('#calendar', 'your-username', {
    proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php'
});
</script>
```

### Local Development Setup

#### Prerequisites
- PHP 7.0 or higher
- Web server (Apache, Nginx, or local dev server)
- Write permissions for cache directory

#### Installation Steps
1. **Clone or download the repository**
   ```bash
   git clone https://github.com/konstantinWDK/github-light-calendar.git
   cd github-light-calendar
   ```

2. **Set up configuration**
   ```bash
   cp config/config.example.php config/config.php
   ```

3. **Create cache directory**
   ```bash
   mkdir -p cache
   chmod 755 cache
   ```

4. **Configure your GitHub token (optional but recommended)**
   Edit `config/config.php` and add your GitHub token:
   ```php
   define('GITHUB_TOKEN', 'ghp_your_actual_token_here');
   ```

5. **Local HTML usage**
   ```html
   <link rel="stylesheet" href="css/github-calendar.css">
   <div id="calendar"></div>
   <script src="src/github-calendar.js"></script>
   <script>
   GitHubCalendar('#calendar', 'your-username', {
       proxy: 'server/github-proxy.php'
   });
   </script>
   ```

### 📋 Complete Live Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Calendar - Example</title>
    <link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
</head>
<body>
    <h2>GitHub Contributions Calendar</h2>
    <div id="calendar"></div>
    
    <script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
    <script>
        GitHubCalendar('#calendar', 'KonstantinWDK', {
            proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php',
            responsive: true,
            tooltips: true,
            summary_text: 'contributions in the last year'
        });
    </script>
</body>
</html>
```

### 🎯 Minimal Example (Copy & Paste)

```html
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
<div id="calendar"></div>
<script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
<script>
GitHubCalendar('#calendar', 'your-github-username', {
    proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php'
});
</script>
```

**Just change `'your-github-username'` to your actual username!**

## 🔄 Migration from Previous Version

**OLD CDN URLs (deprecated):**
```html
<!-- ❌ OLD - Don't use these anymore -->
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/github-calendar.min.css">
<script src="https://webdesignerk.com/g-calendar/github-calendar.min.js"></script>
<script>
GitHubCalendar('#calendar', 'username', {
    proxy: 'https://webdesignerk.com/g-calendar/github-proxy.php'
});
</script>
```

**NEW CDN URLs (current):**
```html
<!-- ✅ NEW - Use these instead -->
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
<script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
<script>
GitHubCalendar('#calendar', 'username', {
    proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php'
});
</script>
```

### Changes Made:
- `github-calendar.min.css` → `css/github-calendar.css`
- `github-calendar.min.js` → `src/github-calendar.js`  
- `github-proxy.php` → `server/github-proxy.php`

## ⚙️ Configuration

### Server Configuration

1. **Copy configuration file**
   ```bash
   cp config/config.example.php config/config.php
   ```

2. **Configure GitHub Token (Optional but Recommended)**
   
   **Method 1: Configuration file (Recommended)**
   Edit `config/config.php`:
   ```php
   define('GITHUB_TOKEN', 'ghp_your_actual_token_here');
   ```
   
   **Method 2: Environment variable**
   ```bash
   export GITHUB_TOKEN="ghp_your_actual_token_here"
   ```
   
   **Method 3: .htaccess (Apache)**
   ```apache
   SetEnv GITHUB_TOKEN "ghp_your_actual_token_here"
   ```

3. **Other configuration options in config.php**
   ```php
   // Cache duration (default: 1 hour)
   define('CACHE_DURATION', 3600);
   
   // API timeout (default: 10 seconds)
   define('API_TIMEOUT', 10);
   
   // Debug mode (default: false)
   define('DEBUG_MODE', false);
   ```

### How to Get GitHub Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "GitHub Calendar Widget")
4. **No special permissions needed** (leave all checkboxes unchecked for public repos)
5. Click "Generate token"
6. Copy the generated token and add it to your configuration

### Configuration Options

```javascript
GitHubCalendar('#calendar', 'username', {
  responsive: true,           // Enable responsive design
  tooltips: true,            // Show tooltips on hover
  summary_text: 'contributions in the last year',  // Custom summary text
  proxy: '',                 // Proxy URL for CORS handling (REQUIRED)
  global_stats: true,        // Show total contributions count
  cache: true               // Enable caching
});
```

### 📋 Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `selector` | String/Element | ✅ Yes | CSS selector (`#id` or `.class`) or DOM element |
| `username` | String | ✅ Yes | GitHub username (case-sensitive) |
| `options` | Object | ❌ No | Configuration options |

### 🔧 Available Options

| Option | Type | Default | Required | Description |
|--------|------|---------|----------|-------------|
| `responsive` | Boolean | `true` | ❌ | Enable responsive design |
| `tooltips` | Boolean | `true` | ❌ | Show interactive tooltips on hover |
| `summary_text` | String | `'contributions in the last year'` | ❌ | Custom summary text |
| `global_stats` | Boolean | `true` | ❌ | Show total contributions count |
| `cache` | Boolean | `true` | ❌ | Enable data caching |
| `proxy` | String | `''` | ✅ **Yes** | Proxy URL (required for production) |

### 💡 Usage Examples

```javascript
// Basic usage
GitHubCalendar('#calendar', 'KonstantinWDK');

// With custom options
GitHubCalendar('#calendar', 'KonstantinWDK', {
  proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php',
  summary_text: 'commits this year',
  tooltips: true,
  responsive: true
});

// Multiple calendars
GitHubCalendar('#calendar1', 'user1', { 
  proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php' 
});
GitHubCalendar('#calendar2', 'user2', { 
  proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php' 
});
```

## API Methods

```javascript
// Initialize calendar
var calendar = GitHubCalendar(".calendar", "username", options);

// Reload the calendar data
calendar.reload();

// Destroy the calendar instance
calendar.destroy();
```

## 📊 API Limits & Caching

### GitHub API Rate Limits
- **Without token**: 60 requests/hour per IP
- **With token**: 5,000 requests/hour per token
- **Automatic fallback**: Mock data when rate limited

### Intelligent Caching System
- **Cache duration**: 1 hour by default (configurable)
- **Cache location**: `/cache/` directory 
- **Cache format**: JSON files with MD5 hashed usernames
- **Auto-cleanup**: Expired cache files are automatically refreshed
- **Benefits**: 
  - Dramatically reduces API calls
  - Faster load times for repeat visits
  - Better user experience during high traffic

### Fallback & Mock Data
When GitHub API is unavailable or rate limited, the library automatically:
- 🔄 Switches to realistic mock contribution data
- 📊 Generates patterns based on typical developer activity
- ⚡ Maintains calendar functionality without errors
- 🎯 Shows weekday vs weekend activity patterns

**Mock data features:**
- Realistic contribution patterns (more activity on weekdays)
- Random but believable contribution counts
- Full year of data coverage
- Seamless user experience

## 🔍 Testing the Proxy

Test your proxy by visiting: `https://webdesignerk.com/g-calendar/server/github-proxy.php?username=KonstantinWDK`

You should see JSON data with contribution information.

## 📖 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Examples](examples/) - Working examples

## 🎨 Custom Styling

The calendar uses CSS classes that you can customize:

```css
.github-calendar {
  /* Main calendar container */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.github-calendar-graph-svg {
  /* SVG container */
  border: 1px solid #e1e4e8;
  border-radius: 6px;
}

.github-calendar-day {
  /* Individual day squares */
  cursor: pointer;
}

.github-calendar-square-0 { fill: #ebedf0; }
.github-calendar-square-1 { fill: #9be9a8; }
.github-calendar-square-2 { fill: #40c463; }
.github-calendar-square-3 { fill: #30a14e; }
.github-calendar-square-4 { fill: #216e39; }

.github-calendar-tooltip {
  /* Tooltip styling */
  background: #2d3748;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
}
```

## 🛠️ Troubleshooting

### Common Issues & Solutions

**❌ Calendar not showing:**
- ✅ Check if `id` matches selector (`#calendar` needs `id="calendar"`)
- ✅ Verify proxy URL is accessible and returns JSON
- ✅ Check browser console for JavaScript errors
- ✅ Ensure CSS file is loaded properly

**❌ "Loading..." shows forever:**
- ✅ Test proxy URL directly: `your-proxy.php?username=your-username`
- ✅ Check server PHP version (7.0+ required)
- ✅ Verify internet connection to GitHub API
- ✅ Check PHP error logs for detailed information

**❌ No data showing or empty calendar:**
- ✅ Make sure username is correct and case-sensitive
- ✅ Verify GitHub profile is public
- ✅ Check if user has public contributions in the last year
- ✅ Test with a known active GitHub user first

**❌ CORS errors:**
- ✅ Ensure you're using the proxy parameter correctly
- ✅ Check proxy is on same domain or CORS configured
- ✅ Verify proxy PHP file has proper CORS headers

**❌ Server errors (500, 403):**
- ✅ Check cache directory exists and has write permissions
- ✅ Verify config.php exists and has valid syntax  
- ✅ Check PHP error logs for specific error messages
- ✅ Ensure GitHub token (if used) is valid

### 🔍 Debug & Testing

**Enable debug mode in config.php:**
```php
define('DEBUG_MODE', true);
```

**Test proxy directly:**
```bash
curl "https://your-domain.com/server/github-proxy.php?username=octocat"
```

**JavaScript debugging:**
```javascript
GitHubCalendar('#calendar', 'username', {
  proxy: 'your-proxy.php'
}).catch(error => {
  console.error('Calendar Error:', error);
});
```

**Check cache directory:**
```bash
ls -la cache/
# Should show JSON files like: github_abc123.json
```

## 📄 License

MIT License - feel free to use in your projects, both personal and commercial.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup:
```bash
git clone https://github.com/konstantinWDK/github-light-calendar.git
cd github-light-calendar

# Set up configuration
cp config/config.example.php config/config.php

# Create cache directory with proper permissions
mkdir -p cache
chmod 755 cache

# Start local development server (PHP)
php -S localhost:8000

# Or using Python
python -m http.server 8000

# Test the library
open http://localhost:8000/examples/
```

## 💬 Support & Community

- 🐛 **Bug Reports**: [Create an issue](https://github.com/konstantinWDK/github-light-calendar/issues)
- 💡 **Feature Requests**: [Create an issue](https://github.com/konstantinWDK/github-light-calendar/issues)
- 📧 **Contact**: [WebDesignerK](https://webdesignerk.com)
- 🌟 **Give us a star** if this project helped you!

---

Made with ❤️ by [WebDesignerK](https://webdesignerk.com) | [Live Demo](https://webdesignerk.com/)