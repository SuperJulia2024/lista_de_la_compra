// Script para generar iconos para la PWA
// Necesitas tener Node.js instalado y ejecutar: node create-icons.js

const fs = require('fs');
const path = require('path');

// Crear directorio icons si no existe
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
}

// SVG base para el icono
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="128" fill="#4CAF50"/>
  
  <!-- Shopping cart -->
  <g transform="translate(96, 96)">
    <!-- Cart body -->
    <rect x="80" y="160" width="240" height="160" rx="20" fill="white" stroke="#2E7D32" stroke-width="12"/>
    
    <!-- Cart handle -->
    <rect x="120" y="120" width="160" height="40" rx="20" fill="white" stroke="#2E7D32" stroke-width="12"/>
    
    <!-- Cart wheels -->
    <circle cx="120" cy="320" r="24" fill="#2E7D32"/>
    <circle cx="280" cy="320" r="24" fill="#2E7D32"/>
    
    <!-- Shopping items -->
    <circle cx="140" cy="200" r="20" fill="#FFC107"/>
    <circle cx="200" cy="200" r="20" fill="#FF9800"/>
    <circle cx="260" cy="200" r="20" fill="#FF5722"/>
  </g>
  
  <!-- Checkmark -->
  <path d="M 360 200 L 380 220 L 420 180" stroke="white" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Guardar el SVG base
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);

console.log('✅ Icono SVG base creado en icons/icon.svg');
console.log('');
console.log('📋 Próximos pasos:');
console.log('1. Abre icons/icon.svg en tu navegador');
console.log('2. Haz clic derecho y "Guardar como" para descargarlo');
console.log('3. Ve a https://favicon.io/favicon-converter/');
console.log('4. Sube el archivo SVG descargado');
console.log('5. Descarga todos los tamaños de iconos');
console.log('6. Coloca todos los archivos .png en la carpeta icons/');
console.log('');
console.log('🎯 Tamaños necesarios:');
console.log('- 16x16, 32x32 (favicons)');
console.log('- 57x57, 60x60, 72x72, 76x76 (iOS)');
console.log('- 96x96, 114x114, 120x120, 128x128 (Android)');
console.log('- 144x144, 152x152, 180x180 (iPad)');
console.log('- 192x192, 384x384, 512x512 (PWA)');



