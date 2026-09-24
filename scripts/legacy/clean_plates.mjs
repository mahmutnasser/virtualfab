import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const userUploadedDir = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244/.user_uploaded';
const outputDir = 'c:/Users/Utente/Desktop/Virtual Fab/virtual-fab/public/images/plates';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Inspect dimensions
  const depBuffer = fs.readFileSync(path.join(userUploadedDir, 'media_1790100866745.jpg'));
  const lithoBuffer = fs.readFileSync(path.join(userUploadedDir, 'media_1790100866775.jpg'));
  const overviewBuffer = fs.readFileSync(path.join(userUploadedDir, 'media_1790100885356.jpg'));

  await page.setContent(`
    <canvas id="c"></canvas>
  `);

  // Helper to load image to canvas
  const processImage = async (base64Data, type) => {
    return await page.evaluate(async ({ base64, type }) => {
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + base64;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.getElementById('c');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const W = img.width;
      const H = img.height;

      // Inpaint/clean top header and process navigator:
      // In the target images, the header/nav occupies y = 0 to y = H * 0.18.
      // For deposition, the machine top is near center y = H * 0.20.
      // The left region (x: 0 to W * 0.35) and right region (x: W * 0.55 to W) have pure ceiling up to y = H * 0.22.
      const headerH = Math.round(H * 0.185);

      if (type === 'deposition') {
        // Sample pure ceiling from the left side above B3 column
        const sampleX = Math.round(W * 0.02);
        const sampleY = Math.round(H * 0.185);
        const sampleW = Math.round(W * 0.32);
        const sampleH = Math.round(H * 0.08);

        // Tile the genuine ceiling pattern across the top
        for (let x = 0; x < W; x += sampleW) {
          const w = Math.min(sampleW, W - x);
          for (let y = headerH; y >= 0; y -= sampleH) {
            const destY = Math.max(0, y - sampleH);
            const destH = y - destY;
            ctx.drawImage(canvas, sampleX, sampleY, w, destH, x, destY, w, destH);
          }
        }
      } else {
        // Lithography has wide unobstructed ceiling above the scanner
        const ceilingSampleY = Math.round(H * 0.19);
        const ceilingSampleH = Math.round(H * 0.08);
        for (let y = headerH; y >= 0; y -= ceilingSampleH) {
          const destY = Math.max(0, y - ceilingSampleH);
          const destH = y - destY;
          ctx.drawImage(canvas, 0, ceilingSampleY, W, destH, 0, destY, W, destH);
        }
      }

      // Add a subtle top ambient room-lighting gradient to match cleanroom ceiling light falloff
      const topGrad = ctx.createLinearGradient(0, 0, 0, headerH + 20);
      topGrad.addColorStop(0, 'rgba(235, 240, 245, 0.25)');
      topGrad.addColorStop(1, 'rgba(235, 240, 245, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, headerH + 20);

      // Clean the right 35% where the live React StationPanel sits
      const panelLeft = Math.round(W * 0.65);
      const panelWidth = W - panelLeft;

      // In the target image, the right area has the StationPanel mockup.
      // We sample the cleanroom background adjacent to the panel (from x = panelLeft - 100 to panelLeft)
      // or build a cleanroom background extension with smooth floor/wall perspective.
      // First, get ambient colors from top (ceiling), middle (cleanroom wall/equipment), and bottom (floor)
      const grad = ctx.createLinearGradient(panelLeft, 0, W, 0);
      grad.addColorStop(0, 'rgba(12, 30, 51, 0)');
      grad.addColorStop(0.2, 'rgba(12, 30, 51, 0.85)');
      grad.addColorStop(1, 'rgba(12, 30, 51, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(panelLeft, 0, panelWidth, H);

      // Also ensure the right edge is 100% dark solid fab background matching the App background
      const solidRight = Math.round(W * 0.72);
      ctx.fillStyle = '#0c1e33';
      ctx.fillRect(solidRight, 0, W - solidRight, H);

      // Blend boundary between solidRight and panelLeft
      const blendGrad = ctx.createLinearGradient(panelLeft, 0, solidRight, 0);
      blendGrad.addColorStop(0, 'rgba(12, 30, 51, 0)');
      blendGrad.addColorStop(1, 'rgba(12, 30, 51, 1)');
      ctx.fillStyle = blendGrad;
      ctx.fillRect(panelLeft, 0, solidRight - panelLeft, H);

      return canvas.toDataURL('image/jpeg', 0.94);
    }, { base64: base64Data, type });
  };

  console.log('Cleaning deposition plate...');
  const cleanDepData = await processImage(depBuffer.toString('base64'), 'deposition');
  const depBase64 = cleanDepData.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync(path.join(outputDir, 'deposition.jpg'), Buffer.from(depBase64, 'base64'));

  console.log('Cleaning lithography plate...');
  const cleanLithoData = await processImage(lithoBuffer.toString('base64'), 'lithography');
  const lithoBase64 = cleanLithoData.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync(path.join(outputDir, 'lithography.jpg'), Buffer.from(lithoBase64, 'base64'));

  await browser.close();
  console.log('Done cleaning plates!');
}

main().catch(console.error);
