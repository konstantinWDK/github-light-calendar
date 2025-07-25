# GitHub Calendar Setup

## Uso Básico (Sin Token)
```html
<link rel="stylesheet" href="https://webdesignerk.com/g-calendar/css/github-calendar.css">
<div id="calendar"></div>
<script src="https://webdesignerk.com/g-calendar/src/github-calendar.js"></script>
<script>
GitHubCalendar('#calendar', 'username', {
    proxy: 'https://webdesignerk.com/g-calendar/server/github-proxy.php'
});
</script>
```

## Límites de API
- **Sin token**: 60 requests/hora por IP
- **Con token**: 5,000 requests/hora

## Configurar Token GitHub (Opcional)

### 1. Crear Personal Access Token
1. Ve a GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. NO necesitas permisos especiales (déjalo sin seleccionar nada)
4. Copia el token generado

### 2. Configurar en el Servidor

**Opción A: Archivo config.php (Recomendado)**
1. Copia `config/config.example.php` a `config/config.php`
2. Edita el archivo y agrega tu token:
```php
define('GITHUB_TOKEN', 'tu_token_aquí');
```

**Opción B: Variable de entorno**
```bash
export GITHUB_TOKEN="github_pat_xxxxxxxxxxxxxxxxxxxx"
```

**Opción C: .htaccess**
```apache
SetEnv GITHUB_TOKEN "github_pat_xxxxxxxxxxxxxxxxxxxx"
```

## Cache Automático
- Los datos se cachean por 1 hora automáticamente
- El cache se guarda en `/cache/`
- Asegúrate que la carpeta tenga permisos de escritura

## Fallback Automático
Si se alcanza el límite de API:
- Se usan datos mock realistas
- El calendario sigue funcionando
- Se muestra un patrón de contribuciones simulado