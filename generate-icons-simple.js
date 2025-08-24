// This is a simpler version that just copies the existing SVG to the public directory
// You'll need to manually create the other icon sizes using an online tool
// and place them in the public/icons directory

import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the public/icons directory exists
const publicIconsDir = join(__dirname, 'public', 'icons');
if (!existsSync(publicIconsDir)) {
  mkdirSync(publicIconsDir, { recursive: true });
}

// Copy the main SVG to the public directory
try {
  const sourceSvg = join(__dirname, 'icons', 'icon.svg');
  const destSvg = join(publicIconsDir, 'icon-512x512.svg');
  copyFileSync(sourceSvg, destSvg);
  console.log(`Copied ${sourceSvg} to ${destSvg}`);
  
  console.log('\nPlease manually create the following icon sizes and place them in the public/icons directory:');
  console.log('- icon-192x192.png');
  console.log('- icon-512x512.png');
  console.log('- icon-144x144.png');
  console.log('- icon-96x96.png');
  console.log('- icon-72x72.png');
  console.log('- icon-48x48.png');
  console.log('- favicon.ico (32x32)');
  console.log('\nYou can use an online tool like https://realfavicongenerator.net/ to generate these files from your SVG.');
} catch (error) {
  console.error('Error copying icon files:', error);
  process.exit(1);
}
