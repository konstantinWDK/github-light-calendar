# GitHub Light Calendar

🇪🇸 Español | [🇺🇸 English](README.en.md)

Un widget ligero y personalizable del calendario de contribuciones de GitHub que puede ser fácilmente integrado en cualquier sitio web.

## 📁 Estructura del Proyecto

```
github-light-calendar/
├── src/                    # Archivos JavaScript fuente
│   └── github-calendar.js  # Archivo principal de la librería
├── css/                    # Hojas de estilo
│   └── github-calendar.css # Estilos del calendario
├── server/                 # Proxy del backend
│   └── github-proxy.php    # Proxy de la API de GitHub
├── config/                 # Archivos de configuración
│   ├── config.php          # Tu configuración privada (ignorado por git)
│   └── config.example.php  # Configuración de ejemplo
├── examples/              # Ejemplos de uso
│   ├── example.html       # Ejemplo para desarrollo local
│   └── cdn-example.html   # Ejemplo de uso con CDN
├── docs/                  # Documentación
│   └── SETUP.md          # Instrucciones de configuración
├── cache/                 # Cache auto-generado (ignorado por git)
└── README.md             # Este archivo
```

## ✨ Características

- 🎨 Ligero y personalizable
- 📱 Diseño responsivo
- 🔄 Cache automático (1 hora)
- 🛡️ Protección contra límites de API con fallback
- 🌐 Listo para CDN
- 🔒 Gestión segura de tokens
- 🔐 **Soporte para contribuciones privadas** (con token apropiado)

## 🚀 Inicio Rápido

### Uso con CDN (Recomendado)
```html
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
<div id="calendar"></div>
<script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
<script>
GitHubCalendar('#calendar', 'tu-usuario', {
    proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php'
});
</script>
```

### Desarrollo Local
```html
<link rel="stylesheet" href="css/github-calendar.css">
<div id="calendar"></div>
<script src="src/github-calendar.js"></script>
<script>
GitHubCalendar('#calendar', 'tu-usuario', {
    proxy: 'server/github-proxy.php'
});
</script>
```

### 📋 Ejemplo en Vivo

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

## 🔄 Migración de Versión Anterior

**URLs CDN ANTIGUAS (obsoletas):**
```html
<!-- ❌ ANTIGUAS - No usar más -->
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/github-calendar.min.css">
<script src="https://webdesignerk.com/g-calendar/github-calendar.min.js"></script>
<script>
GitHubCalendar('#calendar', 'username', {
    proxy: 'https://webdesignerk.com/g-calendar/github-proxy.php'
});
</script>
```

**URLs CDN NUEVAS (actuales):**
```html
<!-- ✅ NUEVAS - Usar estas en su lugar -->
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
<script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
<script>
GitHubCalendar('#calendar', 'username', {
    proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php'
});
</script>
```

### Cambios Realizados:
- `github-calendar.min.css` → `css/github-calendar.css`
- `github-calendar.min.js` → `src/github-calendar.js`  
- `github-proxy.php` → `server/github-proxy.php`

## ⚙️ Configuración

1. Copia `config/config.example.php` a `config/config.php`
2. Añade tu token de GitHub:
   ```php
   define('GITHUB_TOKEN', 'tu_token_github_aqui');
   ```

### 🔒 Configuración del Token de GitHub (Requerido para Contribuciones Privadas)

Para mostrar **contribuciones privadas** en tu calendario:

1. **Crea un Personal Access Token** en https://github.com/settings/tokens
2. **Selecciona Scopes**:
   - Solo para repositorios públicos: No se necesitan scopes especiales
   - **Para contribuciones privadas: Marca el scope `user`** ✅
3. **Añade el token a config.php**:
   ```php
   define('GITHUB_TOKEN', 'ghp_tu_token_real_aqui');
   ```

**Sin un token con scope `user`, solo se mostrarán las contribuciones públicas.**

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

### 📋 Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `selector` | String/Element | ✅ Sí | Selector CSS (`#id` o `.class`) o elemento DOM |
| `username` | String | ✅ Sí | Nombre de usuario de GitHub (sensible a mayúsculas) |
| `options` | Object | ❌ No | Opciones de configuración |

### 🔧 Opciones Disponibles

| Opción | Tipo | Por Defecto | Requerido | Descripción |
|--------|------|---------|----------|-------------|
| `responsive` | Boolean | `true` | ❌ | Habilitar diseño responsivo |
| `tooltips` | Boolean | `true` | ❌ | Mostrar tooltips interactivos al pasar cursor |
| `summary_text` | String | `'contributions in the last year'` | ❌ | Texto de resumen personalizado |
| `global_stats` | Boolean | `true` | ❌ | Show total contributions count |
| `cache` | Boolean | `true` | ❌ | Enable data caching |
| `proxy` | String | `''` | ✅ **Yes** | Proxy URL (required for production) |

### 💡 Ejemplos de Uso

```javascript
// Uso básico
GitHubCalendar('#calendar', 'KonstantinWDK');

// Con opciones personalizadas
GitHubCalendar('#calendar', 'KonstantinWDK', {
  proxy: 'https://tu-dominio.com/server/github-proxy.php',
  summary_text: 'commits este año',
  tooltips: true,
  responsive: true
});

// Múltiples calendarios
GitHubCalendar('#calendar1', 'usuario1', { proxy: 'server/github-proxy.php' });
GitHubCalendar('#calendar2', 'usuario2', { proxy: 'server/github-proxy.php' });
```

## Métodos de la API

```javascript
// Inicializar calendario
var calendar = GitHubCalendar(".calendar", "usuario", options);

// Recargar los datos del calendario
calendar.reload();

// Destruir la instancia del calendario
calendar.destroy();
```

## 📊 Límites de API y Acceso a Datos

- **Sin token**: 60 peticiones/hora, **solo contribuciones públicas**
- **Con token (sin scope `user`)**: 5,000 peticiones/hora, **solo contribuciones públicas**
- **Con token (scope `user`)**: 5,000 peticiones/hora, **incluye contribuciones privadas** ✅
- **Cache automático**: Reduce significativamente las llamadas a la API (cache de 1 hora)

### 🔍 Fuentes de Datos:
- **Contribuciones públicas**: REST API + Eventos públicos
- **Contribuciones privadas**: GraphQL API (requiere token con scope `user`)

## 🔍 Probando el proxy

Prueba tu proxy visitando: `https://webdesignerk.com/g-calendar/server/github-proxy.php?username=KonstantinWDK`

Deberías ver datos JSON con información de contribuciones.

## 📖 Documentación

- [Guía de Configuración](docs/SETUP.md) - Instrucciones detalladas de configuración
- [Ejemplos](examples/) - Ejemplos funcionales

## 🎨 Estilos Personalizados

El calendario usa clases CSS que puedes personalizar:

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

## 💬 Support & Community

- 🐛 **Bug Reports**: [Create an issue](https://github.com/konstantinWDK/github-light-calendar/issues)
- 💡 **Feature Requests**: [Create an issue](https://github.com/konstantinWDK/github-light-calendar/issues)
- 📧 **Contact**: [WebDesignerK](https://webdesignerk.com)
- 🌟 **Give us a star** if this project helped you!

---

Made with ❤️ by [WebDesignerK](https://webdesignerk.com) | [Live Demo](https://webdesignerk.com/g-calendar/)