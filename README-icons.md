# Generación de Iconos para PWA

## Pasos para generar los iconos:

1. **Abrir el generador de iconos:**
   - Abre el archivo `generate-icons.html` en tu navegador
   - Esta página generará automáticamente todos los tamaños necesarios

2. **Descargar los iconos:**
   - Haz clic en "Descargar" para cada tamaño de icono
   - Guarda todos los archivos en la carpeta `icons/`

3. **Tamaños necesarios:**
   - 16x16, 32x32 (favicons)
   - 57x57, 60x60, 72x72, 76x76 (iOS)
   - 96x96, 114x114, 120x120, 128x128 (Android)
   - 144x144, 152x152, 180x180 (iPad)
   - 192x192, 384x384, 512x512 (PWA)

4. **Estructura de archivos:**
```
icons/
├── icon-16x16.png
├── icon-32x32.png
├── icon-57x57.png
├── icon-60x60.png
├── icon-72x72.png
├── icon-76x76.png
├── icon-96x96.png
├── icon-114x114.png
├── icon-120x120.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-180x180.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

## Alternativa: Iconos online

Si prefieres usar iconos online, puedes:

1. Visitar [Favicon.io](https://favicon.io/) o [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Subir el archivo `icons/icon.svg`
3. Descargar todos los tamaños generados
4. Colocarlos en la carpeta `icons/`

## Verificación

Una vez que tengas todos los iconos:

1. Abre la aplicación en tu móvil
2. Ve a "Añadir a pantalla de inicio" o "Instalar aplicación"
3. Deberías ver el icono personalizado en lugar del icono por defecto
