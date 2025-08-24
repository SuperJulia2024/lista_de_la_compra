import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the icons directory exists
const iconsDir = join(__dirname, 'public', 'icons');
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA
const iconSizes = [192, 512, 144, 96, 72, 48];

// Path to your source SVG
const sourceSvg = join(__dirname, 'icons', 'icon.svg');

// Generate each icon size
async function generateIcons() {
  try {
    for (const size of iconSizes) {
      const outputFile = join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(sourceSvg)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`Generated ${outputFile}`);
    }
    
    // Also generate favicon.ico
    await sharp(sourceSvg)
      .resize(32, 32)
      .toFile(join(iconsDir, 'favicon.ico'));
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
