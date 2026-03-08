import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Icon sizes needed (manifest + common favicon sizes)
const sizes = [16, 32, 72, 96, 120, 128, 144, 152, 180, 192, 384, 512];
const iconDir = path.join(__dirname, 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Generate solid-color PNG for each size
sizes.forEach(async (size) => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconDir, filename);
  // create a simple amber square
  const buffer = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: '#e3bf35',
    }
  })
    .png()
    .toBuffer();
  fs.writeFileSync(filepath, buffer);
  console.log(`Created ${filename}`);
});

console.log('Placeholder icons generated successfully!');
