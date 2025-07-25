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

### Configuración para Desarrollo Local

#### Requisitos Previos
- PHP 7.0 o superior
- Servidor web (Apache, Nginx, o servidor de desarrollo local)
- Permisos de escritura para el directorio cache

#### Pasos de Instalación
1. **Clona o descarga el repositorio**
   ```bash
   git clone https://github.com/konstantinWDK/github-light-calendar.git
   cd github-light-calendar
   ```

2. **Configura el archivo de configuración**
   ```bash
   cp config/config.example.php config/config.php
   ```

3. **Crea el directorio cache**
   ```bash
   mkdir -p cache
   chmod 755 cache
   ```

4. **Configura tu token de GitHub (opcional pero recomendado)**
   Edita `config/config.php` y añade tu token de GitHub:
   ```php
   define('GITHUB_TOKEN', 'ghp_your_actual_token_here');
   ```

5. **Uso en HTML local**
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

### 📋 Ejemplo Completo en Vivo

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Calendar - Ejemplo</title>
    <link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
</head>
<body>
    <h2>Calendario de Contribuciones de GitHub</h2>
    <div id="calendar"></div>
    
    <script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
    <script>
        GitHubCalendar('#calendar', 'KonstantinWDK', {
            proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php',
            responsive: true,
            tooltips: true,
            summary_text: 'contribuciones en el último año'
        });
    </script>
</body>
</html>
```

### 🎯 Ejemplo Mínimo (Copia y Pega)

```html
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
<div id="calendar"></div>
<script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
<script>
GitHubCalendar('#calendar', 'tu-usuario-github', {
    proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php'
});
</script>
```

**¡Solo cambia `'tu-usuario-github'` por tu nombre de usuario real!**

## 🔄 Migración desde Versión Anterior

**URLs CDN ANTIGUAS (obsoletas):**
```html
<!-- ❌ ANTIGUO - Ya no uses estos -->
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
<!-- ✅ NUEVO - Usa estos en su lugar -->
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

### Configuración del Servidor

1. **Copia el archivo de configuración**
   ```bash
   cp config/config.example.php config/config.php
   ```

2. **Configura el Token de GitHub (Opcional pero Recomendado)**
   
   **Método 1: Archivo de configuración (Recomendado)**
   Edita `config/config.php`:
   ```php
   define('GITHUB_TOKEN', 'ghp_your_actual_token_here');
   ```
   
   **Método 2: Variable de entorno**
   ```bash
   export GITHUB_TOKEN="ghp_your_actual_token_here"
   ```
   
   **Método 3: .htaccess (Apache)**
   ```apache
   SetEnv GITHUB_TOKEN "ghp_your_actual_token_here"
   ```

3. **Otras opciones de configuración en config.php**
   ```php
   // Duración del cache (por defecto: 1 hora)
   define('CACHE_DURATION', 3600);
   
   // Timeout de API (por defecto: 10 segundos)
   define('API_TIMEOUT', 10);
   
   // Modo debug (por defecto: false)
   define('DEBUG_MODE', false);
   ```

### Cómo Obtener un Token de GitHub

1. Ve a [Configuración de GitHub → Configuración de desarrollador → Tokens de acceso personal](https://github.com/settings/tokens)
2. Haz clic en "Generate new token (classic)"
3. Dale un nombre (ej. "GitHub Calendar Widget")
4. **No necesitas permisos especiales** (deja todas las casillas sin marcar para repos públicos)
5. Haz clic en "Generate token"
6. Copia el token generado y añádelo a tu configuración

### Opciones de Configuración

```javascript
GitHubCalendar('#calendar', 'usuario', {
  responsive: true,           // Habilita diseño responsivo
  tooltips: true,            // Muestra tooltips al pasar el mouse
  summary_text: 'contribuciones en el último año',  // Texto de resumen personalizado
  proxy: '',                 // URL del proxy para manejar CORS (REQUERIDO)
  global_stats: true,        // Muestra el conteo total de contribuciones
  cache: true               // Habilita el cache
});
```

### 📋 Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| `selector` | String/Element | ✅ Sí | Selector CSS (`#id` o `.class`) o elemento DOM |
| `username` | String | ✅ Sí | Nombre de usuario de GitHub (sensible a mayúsculas) |
| `options` | Object | ❌ No | Opciones de configuración |

### 🔧 Opciones Disponibles

| Opción | Tipo | Por Defecto | Requerido | Descripción |
|--------|------|---------|----------|-------------|
| `responsive` | Boolean | `true` | ❌ | Habilita diseño responsivo |
| `tooltips` | Boolean | `true` | ❌ | Muestra tooltips interactivos al pasar el mouse |
| `summary_text` | String | `'contributions in the last year'` | ❌ | Texto de resumen personalizado |
| `global_stats` | Boolean | `true` | ❌ | Muestra el conteo total de contribuciones |
| `cache` | Boolean | `true` | ❌ | Habilita el cache de datos |
| `proxy` | String | `''` | ✅ **Sí** | URL del proxy (requerido para producción) |

### 💡 Ejemplos de Uso

```javascript
// Uso básico
GitHubCalendar('#calendar', 'KonstantinWDK');

// Con opciones personalizadas
GitHubCalendar('#calendar', 'KonstantinWDK', {
  proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php',
  summary_text: 'commits este año',
  tooltips: true,
  responsive: true
});

// Múltiples calendarios
GitHubCalendar('#calendar1', 'usuario1', { 
  proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php' 
});
GitHubCalendar('#calendar2', 'usuario2', { 
  proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php' 
});
```

## Métodos de API

```javascript
// Inicializar calendario
var calendar = GitHubCalendar(".calendar", "usuario", opciones);

// Recargar los datos del calendario
calendar.reload();

// Destruir la instancia del calendario
calendar.destroy();
```

## 📊 Límites de API y Cache

### Límites de la API de GitHub
- **Sin token**: 60 solicitudes/hora por IP
- **Con token**: 5,000 solicitudes/hora por token
- **Fallback automático**: Datos simulados cuando se alcanza el límite

### Sistema de Cache Inteligente
- **Duración del cache**: 1 hora por defecto (configurable)
- **Ubicación del cache**: Directorio `/cache/` 
- **Formato del cache**: Archivos JSON con nombres de usuario hasheados en MD5
- **Auto-limpieza**: Los archivos de cache expirados se refrescan automáticamente
- **Beneficios**: 
  - Reduce drásticamente las llamadas a la API
  - Tiempos de carga más rápidos en visitas repetidas
  - Mejor experiencia de usuario durante tráfico alto

### Fallback y Datos Simulados
Cuando la API de GitHub no está disponible o se alcanza el límite, la librería automáticamente:
- 🔄 Cambia a datos simulados realistas de contribuciones
- 📊 Genera patrones basados en actividad típica de desarrolladores
- ⚡ Mantiene la funcionalidad del calendario sin errores
- 🎯 Muestra patrones de actividad entre días laborables y fines de semana

**Características de los datos simulados:**
- Patrones de contribución realistas (más actividad en días laborables)
- Conteos de contribuciones aleatorios pero creíbles
- Cobertura completa de datos del año
- Experiencia de usuario fluida

## 🔍 Probar el Proxy

Prueba tu proxy visitando: `https://webdesignerk.com/g-calendar/server/github-proxy.php?username=KonstantinWDK`

Deberías ver datos JSON con información de contribuciones.

## 📖 Documentación

- [Guía de Configuración](docs/SETUP.md) - Instrucciones detalladas de configuración
- [Ejemplos](examples/) - Ejemplos funcionales

## 🎨 Estilos Personalizados

El calendario usa clases CSS que puedes personalizar:

```css
.github-calendar {
  /* Contenedor principal del calendario */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.github-calendar-graph-svg {
  /* Contenedor SVG */
  border: 1px solid #e1e4e8;
  border-radius: 6px;
}

.github-calendar-day {
  /* Cuadrados de días individuales */
  cursor: pointer;
}

.github-calendar-square-0 { fill: #ebedf0; }
.github-calendar-square-1 { fill: #9be9a8; }
.github-calendar-square-2 { fill: #40c463; }
.github-calendar-square-3 { fill: #30a14e; }
.github-calendar-square-4 { fill: #216e39; }

.github-calendar-tooltip {
  /* Estilos del tooltip */
  background: #2d3748;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
}
```

## 🛠️ Solución de Problemas

### Problemas Comunes y Soluciones

**❌ El calendario no se muestra:**
- ✅ Verifica que el `id` coincida con el selector (`#calendar` necesita `id="calendar"`)
- ✅ Verifica que la URL del proxy sea accesible y devuelva JSON
- ✅ Revisa la consola del navegador por errores de JavaScript
- ✅ Asegúrate de que el archivo CSS se cargue correctamente

**❌ "Loading..." se muestra para siempre:**
- ✅ Prueba la URL del proxy directamente: `tu-proxy.php?username=tu-usuario`
- ✅ Verifica la versión de PHP del servidor (7.0+ requerido)
- ✅ Verifica la conexión a internet con la API de GitHub
- ✅ Revisa los logs de error de PHP para información detallada

**❌ No se muestran datos o calendario vacío:**
- ✅ Asegúrate de que el nombre de usuario sea correcto y sensible a mayúsculas
- ✅ Verifica que el perfil de GitHub sea público
- ✅ Verifica si el usuario tiene contribuciones públicas en el último año
- ✅ Prueba primero con un usuario de GitHub conocido que sea activo

**❌ Errores de CORS:**
- ✅ Asegúrate de estar usando el parámetro proxy correctamente
- ✅ Verifica que el proxy esté en el mismo dominio o que CORS esté configurado
- ✅ Verifica que el archivo PHP del proxy tenga las cabeceras CORS apropiadas

**❌ Errores del servidor (500, 403):**
- ✅ Verifica que el directorio cache exista y tenga permisos de escritura
- ✅ Verifica que config.php exista y tenga sintaxis válida
- ✅ Revisa los logs de error de PHP para mensajes de error específicos
- ✅ Asegúrate de que el token de GitHub (si se usa) sea válido

### 🔍 Debug y Pruebas

**Habilitar modo debug en config.php:**
```php
define('DEBUG_MODE', true);
```

**Probar proxy directamente:**
```bash
curl "https://your-domain.com/server/github-proxy.php?username=octocat"
```

**Debug de JavaScript:**
```javascript
GitHubCalendar('#calendar', 'username', {
  proxy: 'your-proxy.php'
}).catch(error => {
  console.error('Calendar Error:', error);
});
```

**Verificar directorio cache:**
```bash
ls -la cache/
# Debería mostrar archivos JSON como: github_abc123.json
```

## 📄 Licencia

Licencia MIT - siéntete libre de usar en tus proyectos, tanto personales como comerciales.

## 🤝 Contribuir

¡Damos la bienvenida a las contribuciones! Así puedes ayudar:

1. **Haz Fork** del repositorio
2. **Crea** tu rama de funcionalidad (`git checkout -b feature/funcionalidad-increible`)
3. **Confirma** tus cambios (`git commit -m 'Agregar funcionalidad increíble'`)
4. **Sube** a la rama (`git push origin feature/funcionalidad-increible`)
5. **Abre** un Pull Request

### Configuración de Desarrollo:
```bash
git clone https://github.com/konstantinWDK/github-light-calendar.git
cd github-light-calendar

# Configurar archivos de configuración
cp config/config.example.php config/config.php

# Crear directorio cache con permisos adecuados
mkdir -p cache
chmod 755 cache

# Iniciar servidor de desarrollo local (PHP)
php -S localhost:8000

# O usando Python
python -m http.server 8000

# Probar la librería
open http://localhost:8000/examples/
```

## 💬 Soporte y Comunidad

- 🐛 **Reportar Bugs**: [Crear un issue](https://github.com/konstantinWDK/github-light-calendar/issues)
- 💡 **Solicitar Funcionalidades**: [Crear un issue](https://github.com/konstantinWDK/github-light-calendar/issues)
- 📧 **Contacto**: [WebDesignerK](https://webdesignerk.com)
- 🌟 **¡Danos una estrella** si este proyecto te ayudó!

---

Hecho con ❤️ por [WebDesignerK](https://webdesignerk.com) | [Demo en Vivo](https://webdesignerk.com/g-calendar/)