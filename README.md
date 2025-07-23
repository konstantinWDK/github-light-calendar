# GitHub Calendar Widget

A lightweight, responsive JavaScript library that allows you to embed GitHub-style contribution calendars into any website. Display your coding activity with the same visual appeal as GitHub profiles, complete with interactive tooltips, customizable themes, and mobile-friendly design. Perfect for portfolios, developer blogs, and showcasing your open-source contributions.

## Features

- 📊 Display GitHub contribution graphs anywhere
- 🎨 Customizable styling and themes
- 📱 Responsive design support
- 🛠️ Easy integration with any website
- 🔄 CORS proxy support for client-side requests
- 💾 Caching support for better performance

## Quick Start

### CDN Usage

```html
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/github-calendar.min.css">
<div class="calendar"></div>
<script src="https://webdesignerk.com/g-calendar/github-calendar.min.js"></script>
<script>
  GitHubCalendar(".calendar", "your-username", {
    proxy: "https://webdesignerk.com/g-calendar/github-proxy.php"
  });
</script>
```

### Local Installation

1. Download the files:
   - `github-calendar.min.css`
   - `github-calendar.min.js`
   - `github-proxy.php` (optional, for CORS handling)

2. Include them in your HTML:

```html
<link rel="stylesheet" href="path/to/github-calendar.min.css">
<div class="calendar"></div>
<script src="path/to/github-calendar.min.js"></script>
<script>
  GitHubCalendar(".calendar", "your-username");
</script>
```

## Configuration Options

```javascript
GitHubCalendar(".calendar", "username", {
  responsive: true,           // Enable responsive design
  tooltips: true,            // Show tooltips on hover
  summary_text: 'contributions in the last year',  // Custom summary text
  proxy: '',                 // Proxy URL for CORS handling
  global_stats: true,        // Show total contributions count
  cache: true               // Enable caching
});
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `selector` | String/Element | CSS selector or DOM element |
| `username` | String | GitHub username |
| `options` | Object | Configuration options (optional) |

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `responsive` | Boolean | `true` | Enable responsive design |
| `tooltips` | Boolean | `true` | Show tooltips on hover |
| `summary_text` | String | `'contributions in the last year'` | Summary text |
| `global_stats` | Boolean | `true` | Show total contributions |
| `cache` | Boolean | `true` | Enable caching |
| `proxy` | String | `''` | Proxy URL (if needed) |

## API Methods

```javascript
// Initialize calendar
var calendar = GitHubCalendar(".calendar", "username", options);

// Reload the calendar data
calendar.reload();

// Destroy the calendar instance
calendar.destroy();
```

## CORS Proxy

Due to CORS restrictions, you may need to use a proxy when making requests to GitHub's API from the browser. The included `github-proxy.php` file provides a simple PHP proxy solution.

### Setting up the proxy:

1. Upload `github-proxy.php` to your server
2. Configure the proxy URL in your options:

```javascript
GitHubCalendar(".calendar", "username", {
  proxy: "https://your-domain.com/path/to/github-proxy.php"
});
```

## Styling

The calendar uses CSS classes that you can customize:

```css
.calendar {
  /* Main calendar container */
}

.js-calendar-graph-svg {
  /* SVG container */
}

.ContributionCalendar-day {
  /* Individual day squares */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+

## Examples

Check out `example.html` for complete working examples including:
- Basic usage
- Custom configuration options
- Multiple calendar instances
- Different styling approaches

## License

MIT License - feel free to use in your projects.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please create an issue in the repository or contact the maintainer.