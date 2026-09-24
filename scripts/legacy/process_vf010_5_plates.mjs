import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';
const outputDir = 'c:/Users/Utente/Desktop/Virtual Fab/virtual-fab/public/images/plates';

const trackSrc = path.join(brainDir, 'photoreal_track_tool_1790106229866.jpg');
const etchSrc = path.join(brainDir, 'photoreal_etch_enclosed_1790106263574.jpg');
const stripSrc = path.join(brainDir, 'photoreal_strip_neutral_1790106301841.jpg');

async function processPlates() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');

  const processFile = async (srcPath, destName, options = {}) => {
    const buffer = fs.readFileSync(srcPath);
    const base64 = buffer.toString('base64');

    const resultBase64 = await page.evaluate(async ({ b64, opts }) => {
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + b64;
      await new Promise((r) => (img.onload = r));

      const canvas = document.getElementById('c');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const W = img.width;
      const H = img.height;

      // Inpaint any specific text rectangles (e.g. for strip)
      if (opts.inpaintBoxes) {
        for (const box of opts.inpaintBoxes) {
          const bx = Math.round(box.x * W);
          const by = Math.round(box.y * H);
          const bw = Math.round(box.w * W);
          const bh = Math.round(box.h * H);
          // sample from adjacent clear area
          const sx = Math.round(box.sampleX * W);
          const sy = Math.round(box.sampleY * H);
          ctx.drawImage(canvas, sx, sy, bw, bh, bx, by, bw, bh);
        }
      }

      // Smooth right-blend for right ~35%
      // Sample cleanroom background from far right ceiling/wall
      const startX = Math.round(W * 0.65);
      const grad = ctx.createLinearGradient(startX, 0, W, 0);
      grad.addColorStop(0, 'rgba(12, 31, 51, 0)');
      grad.addColorStop(0.35, 'rgba(12, 31, 51, 0.45)');
      grad.addColorStop(0.7, 'rgba(12, 31, 51, 0.85)');
      grad.addColorStop(1, 'rgba(12, 31, 51, 0.95)');

      ctx.fillStyle = grad;
      ctx.fillRect(startX, 0, W - startX, H);

      return canvas.toDataURL('image/jpeg', 0.92).replace(/^data:image\/jpeg;base64,/, '');
    }, { b64: base64, opts: options });

    const outBuffer = Buffer.from(resultBase64, 'base64');
    const destPath = path.join(outputDir, destName);
    fs.writeFileSync(destPath, outBuffer);
    console.log(`Saved: ${destPath} (${outBuffer.length} bytes)`);
  };

  console.log('Processing Track plate...');
  await processFile(trackSrc, 'coat_develop_track.jpg');

  console.log('Processing Etch plate...');
  await processFile(etchSrc, 'etch.jpg');

  console.log('Processing Strip plate...');
  await processFile(stripSrc, 'strip.jpg', {
    inpaintBoxes: [
      // Inpaint "PHOTOSTRIP 380" panel on top left
      { x: 0.30, y: 0.21, w: 0.08, h: 0.03, sampleX: 0.22, sampleY: 0.25 },
      // Inpaint small blue label
      { x: 0.44, y: 0.35, w: 0.04, h: 0.03, sampleX: 0.40, sampleY: 0.30 },
    ],
  });

  await browser.close();
  console.log('ALL PLATES PROCESSED SUCCESSFULLY!');
}

processPlates().catch(console.error);
