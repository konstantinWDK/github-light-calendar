# Migration Guide - New File Structure

## 🔄 What Changed?

We've reorganized the project structure to be more professional and maintainable. The functionality remains exactly the same, but file paths have changed.

## 📋 Quick Migration

### Before (Old CDN URLs):
```html
<!-- ❌ DEPRECATED - Don't use anymore -->
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/github-calendar.min.css">
<script src="https://webdesignerk.com/g-calendar/github-calendar.min.js"></script>
<script>
GitHubCalendar('#calendar', 'KonstantinWDK', {
    proxy: 'https://webdesignerk.com/g-calendar/github-proxy.php'
});
</script>
```

### After (New CDN URLs):
```html
<!-- ✅ CURRENT - Use these instead -->
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
<script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
<script>
GitHubCalendar('#calendar', 'KonstantinWDK', {
    proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php'
});
</script>
```

## 📁 File Path Changes

| Old Path | New Path | Status |
|----------|----------|---------|
| `github-calendar.min.css` | `css/github-calendar.css` | ✅ Active |
| `github-calendar.min.js` | `src/github-calendar.js` | ✅ Active |
| `github-proxy.php` | `server/github-proxy.php` | ✅ Active |

## 🚨 Important Notes

1. **Minified files removed**: We no longer provide `.min` versions. The original files are lightweight enough.

2. **No functionality changes**: All features, options, and methods work exactly the same.

3. **Backward compatibility**: Old URLs will continue to work for a transition period, but please update when possible.

## ✅ Migration Checklist

- [ ] Update CSS link to new path
- [ ] Update JavaScript script src to new path  
- [ ] Update proxy URL in GitHubCalendar options
- [ ] Test your calendar still works
- [ ] Remove any local copies of old .min files

## 🆘 Need Help?

If you encounter any issues during migration:
- Check the [README.md](README.md) for complete examples
- Test the new URLs in your browser first
- Contact us through GitHub issues

## 🎯 Benefits of New Structure

- Better organization for development
- Clearer separation of concerns
- Easier maintenance and updates
- Professional project structure