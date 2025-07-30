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
- 🔐 **Private contributions support** (with proper token)
- 📝 **Customizable Markdown templates** (GitHub Profile style)

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

### Local Development
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

### 📋 Live Example

**🎨 [View Markdown Templates Demo](https://webdesignerk.com/g-calendar/examples/template-example.html)** - Functional example showing all templates

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
</head>
<body>
    <div id="github-calendar"></div>
    
    <script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
    <script>
        GitHubCalendar('#github-calendar', 'KonstantinWDK', {
            proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php',
            responsive: true,
            tooltips: true
        });
    </script>
</body>
</html>
```

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

1. Copy `config/config.example.php` to `config/config.php`
2. Add your GitHub token:
   ```php
   define('GITHUB_TOKEN', 'your_github_token_here');
   ```

### 🔒 GitHub Token Setup (Required for Private Contributions)

To display **private contributions** in your calendar:

1. **Create a Personal Access Token** at https://github.com/settings/tokens
2. **Select Scopes**:
   - For public repositories only: No special scopes needed
   - **For private contributions: Check `user` scope** ✅
3. **Add token to config.php**:
   ```php
   define('GITHUB_TOKEN', 'ghp_your_actual_token_here');
   ```

**Without a token with `user` scope, only public contributions will be displayed.**

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
  proxy: 'https://your-domain.com/server/github-proxy.php',
  summary_text: 'commits this year',
  tooltips: true,
  responsive: true
});

// Multiple calendars
GitHubCalendar('#calendar1', 'user1', { proxy: 'server/github-proxy.php' });
GitHubCalendar('#calendar2', 'user2', { proxy: 'server/github-proxy.php' });
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

## 📊 API Limits & Data Access

- **Without token**: 60 requests/hour, **public contributions only**
- **With token (no `user` scope)**: 5,000 requests/hour, **public contributions only**
- **With token (`user` scope)**: 5,000 requests/hour, **includes private contributions** ✅
- **Automatic cache**: Reduces API calls significantly (1 hour cache)

### 🔍 Data Sources:
- **Public contributions**: REST API + Public events
- **Private contributions**: GraphQL API (requires `user` scope token)

## 🔍 Testing the proxy

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

### Common Issues:

**❌ Calendar not showing:**
- Check if `id` matches selector (`#calendar` needs `id="calendar"`)
- Verify proxy URL is accessible
- Check browser console for errors

**❌ "Loading..." shows forever:**
- Test proxy URL directly: `your-proxy.php?username=your-username`
- Check server PHP version (7.0+ required)
- Verify internet connection to GitHub API

**❌ No data showing:**
- Make sure username is correct and case-sensitive
- Check if GitHub profile is public
- Verify user has public contributions
- **For private contributions**: Ensure token has `user` scope

**❌ CORS errors:**
- Ensure you're using the proxy parameter
- Check proxy is on same domain or CORS configured

### 🔍 Debug Mode:

```javascript
GitHubCalendar('#calendar', 'username', {
  proxy: 'your-proxy.php'
}).catch(error => {
  console.error('Calendar Error:', error);
});
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
```

---

Made with ❤️ by [WebDesignerK](https://webdesignerk.com) | [Live Demo](https://webdesignerk.com/g-calendar/examples/template-example.html)