import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';
const PUBLIC_PLATES = 'C:/Users/Utente/Desktop/Virtual Fab/virtual-fab/public/images/plates';

async function testCleanPlate() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  function getBase64(filePath) {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${data.toString('base64')}`;
  }

  const overviewB64 = getBase64(path.join(PUBLIC_PLATES, 'fab_overview.jpg'));
  const depB64 = getBase64(path.join(ARTIFACT_DIR, 'visual-targets/deposition.png'));
  const lithoB64 = getBase64(path.join(ARTIFACT_DIR, 'visual-targets/lithography.png'));
  const metroB64 = getBase64(path.join(ARTIFACT_DIR, 'visual-targets/metrology-adi.png'));

  await page.setContent('<html><body><canvas id="c"></canvas></body></html>');

  const result = await page.evaluate(async (data) => {
    function loadImg(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    const [imgOverview, imgDep, imgLitho, imgMetro] = await Promise.all([
      loadImg(data.overviewB64),
      loadImg(data.depB64),
      loadImg(data.lithoB64),
      loadImg(data.metroB64),
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    function createCleanPlate(machineImg, splitX = 1220, featherW = 160) {
      ctx.clearRect(0, 0, 1920, 1080);

      // 1. Draw master cleanroom background
      ctx.drawImage(imgOverview, 0, 0, 1920, 1080);

      // 2. Prepare machine on temp canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 1920;
      tempCanvas.height = 1080;
      const tctx = tempCanvas.getContext('2d');

      // Draw the machine image
      tctx.drawImage(machineImg, 0, 0, 1920, 1080);

      // Mask out:
      // a) Top UI header bar (y: 0 to 110)
      // b) Right UI station panel (x: splitX to 1920)
      tctx.globalCompositeOperation = 'destination-in';

      // Keep everything inside [0..splitX] on X and [130..1080] on Y
      // We create a 2D mask
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = 1920;
      maskCanvas.height = 1080;
      const mctx = maskCanvas.getContext('2d');

      // Fill solid white
      mctx.fillStyle = '#ffffff';
      mctx.fillRect(0, 0, 1920, 1080);

      // Top fade: fade from y=100 (alpha 0) to y=150 (alpha 1)
      const topGrad = mctx.createLinearGradient(0, 95, 0, 150);
      topGrad.addColorStop(0, 'rgba(0,0,0,1)'); // will be subtracted
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      mctx.globalCompositeOperation = 'destination-out';
      mctx.fillStyle = '#000000';
      mctx.fillRect(0, 0, 1920, 95); // completely clear top 95px
      mctx.fillStyle = topGrad;
      mctx.fillRect(0, 95, 1920, 55); // feather

      // Right fade: fade from splitX - featherW (alpha 1) to splitX (alpha 0)
      const rightGrad = mctx.createLinearGradient(splitX - featherW, 0, splitX, 0);
      rightGrad.addColorStop(0, 'rgba(0,0,0,0)');
      rightGrad.addColorStop(1, 'rgba(0,0,0,1)'); // will be subtracted
      mctx.fillStyle = '#000000';
      mctx.fillRect(splitX, 0, 1920 - splitX, 1080); // completely clear right of splitX
      mctx.fillStyle = rightGrad;
      mctx.fillRect(splitX - featherW, 0, featherW, 1080); // feather

      // Apply mask to tempCanvas
      tctx.drawImage(maskCanvas, 0, 0);

      // 3. Draw masked machine over master cleanroom
      ctx.drawImage(tempCanvas, 0, 0);

      return canvas.toDataURL('image/jpeg', 0.95);
    }

    return {
      dep: createCleanPlate(imgDep, 1220, 160),
      litho: createCleanPlate(imgLitho, 1260, 160),
      metro: createCleanPlate(imgMetro, 1160, 150),
    };
  }, { overviewB64, depB64, lithoB64, metroB64 });

  for (const [key, dataUrl] of Object.entries(result)) {
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const buf = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(path.join(ARTIFACT_DIR, `test_clean_${key}.jpg`), buf);
    console.log(`Saved test_clean_${key}.jpg`);
  }

  await browser.close();
}

testCleanPlate();
