import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const userMediaDir = 'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\3615d0ab-9175-4907-ba08-c449e8cda244\\.user_uploaded';
const outputDir = path.join(process.cwd(), 'public', 'images', 'basics');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Copy raw authoritative files directly
const copies = [
  { src: 'media_1790249936300.jpg', dest: 'wafer-hierarchy-full.jpg' },
  { src: 'media_1790249936408.jpg', dest: 'patterning-flow-full.jpg' },
  { src: 'media_1790249936371.jpg', dest: 'sem-cd-full.jpg' },
];

for (const c of copies) {
  const srcPath = path.join(userMediaDir, c.src);
  const destPath = path.join(outputDir, c.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${c.src} -> ${c.dest}`);
  } else {
    console.error(`Missing source ${srcPath}`);
  }
}

// 2. Crop individual high-resolution components using Playwright + Canvas
async function cropAssets() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });

  // Function to crop an image rectangle and save to disk
  async function cropRect(sourcePath, rect, destFileName) {
    const base64Data = fs.readFileSync(sourcePath).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Data}`;

    const croppedBase64 = await page.evaluate(async ({ url, crop }) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = crop.w;
          canvas.height = crop.h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
          resolve(canvas.toDataURL('image/png').split(',')[1]);
        };
        img.src = url;
      });
    }, { url: dataUrl, crop: rect });

    const buffer = Buffer.from(croppedBase64, 'base64');
    fs.writeFileSync(path.join(outputDir, destFileName), buffer);
    console.log(`Cropped and saved: ${destFileName} (${rect.w}x${rect.h})`);
  }

  const p1 = path.join(userMediaDir, 'media_1790249936300.jpg'); // 1024x768
  const p2 = path.join(userMediaDir, 'media_1790249936408.jpg'); // 1024x768
  const p3 = path.join(userMediaDir, 'media_1790249936371.jpg'); // 1024x768

  // Cropping Hierarchy components from p1
  // - Top Wafer Disc alone
  await cropRect(p1, { x: 10, y: 125, w: 320, h: 420 }, 'wafer-300mm-hero.png');
  // - Exposure Field
  await cropRect(p1, { x: 420, y: 140, w: 180, h: 410 }, 'field-exposure-6die.png');
  // - Single Die (Chip)
  await cropRect(p1, { x: 695, y: 140, w: 235, h: 410 }, 'die-chip-microprocessor.png');
  // - Top half continuous composition (wafer -> field -> die)
  await cropRect(p1, { x: 0, y: 110, w: 1024, h: 450 }, 'wafer-field-die-panorama.png');

  // Cropping Patterning blocks from p2 (6 steps)
  // Step 1: Resist coat
  await cropRect(p2, { x: 20, y: 390, w: 180, h: 260 }, 'pattern-step1-coat.png');
  // Step 2: Expose (includes reticle & UV beam)
  await cropRect(p2, { x: 175, y: 280, w: 180, h: 370 }, 'pattern-step2-expose.png');
  // Step 3: Chemistry change
  await cropRect(p2, { x: 355, y: 400, w: 165, h: 250 }, 'pattern-step3-chem.png');
  // Step 4: Develop
  await cropRect(p2, { x: 515, y: 400, w: 165, h: 250 }, 'pattern-step4-develop.png');
  // Step 5: Etch
  await cropRect(p2, { x: 675, y: 400, w: 160, h: 250 }, 'pattern-step5-etch.png');
  // Step 6: Strip
  await cropRect(p2, { x: 830, y: 400, w: 170, h: 250 }, 'pattern-step6-strip.png');
  // Full 6-block strip panorama (without top header text or bottom cards)
  await cropRect(p2, { x: 10, y: 270, w: 1004, h: 390 }, 'patterning-strip-panorama.png');

  // Cropping SEM CD components from p3
  // Top main SEM trench view
  await cropRect(p3, { x: 330, y: 0, w: 694, h: 600 }, 'sem-cd-trench-main.png');
  // Comparison cards (Target, Narrower, Wider)
  await cropRect(p3, { x: 30, y: 670, w: 290, h: 230 }, 'sem-cd-target.png');
  await cropRect(p3, { x: 365, y: 670, w: 290, h: 230 }, 'sem-cd-narrower.png');
  await cropRect(p3, { x: 680, y: 670, w: 290, h: 230 }, 'sem-cd-wider.png');

  await browser.close();
  console.log('All crops completed successfully!');
}

cropAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
