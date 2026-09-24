import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';
const platesDir = 'c:/Users/Utente/Desktop/Virtual Fab/virtual-fab/public/images/plates';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent('<canvas id="c"></canvas>');

  // 1. Process Metrology plate from visual-targets/metrology-adi.png
  console.log('Processing metrology.jpg from visual-targets/metrology-adi.png ...');
  const metroPath = path.join(artifactDir, 'visual-targets/metrology-adi.png');
  const metroBuf = fs.readFileSync(metroPath);
  const cleanMetroBase64 = await page.evaluate(async (base64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + base64;
    await new Promise((r) => (img.onload = r));

    const canvas = document.getElementById('c');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const W = img.width;
    const H = img.height;

    // Clean top header and process navigator pills (y: 0 to H * 0.185)
    // The ceiling directly above the metrology tool is at y: H * 0.19 to H * 0.28
    const ceilingSampleY = Math.round(H * 0.19);
    const ceilingSampleH = Math.round(H * 0.08);
    const headerH = Math.round(H * 0.185);

    for (let y = headerH; y >= 0; y -= ceilingSampleH) {
      const destY = Math.max(0, y - ceilingSampleH);
      const destH = y - destY;
      ctx.drawImage(canvas, 0, ceilingSampleY, W, destH, 0, destY, W, destH);
    }

    // Blend top light falloff
    const topGrad = ctx.createLinearGradient(0, 0, 0, headerH + 20);
    topGrad.addColorStop(0, 'rgba(235, 240, 245, 0.25)');
    topGrad.addColorStop(1, 'rgba(235, 240, 245, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, W, headerH + 20);

    // Clean right 35% where live React StationPanel sits
    const panelLeft = Math.round(W * 0.65);
    const solidRight = Math.round(W * 0.72);
    const blendGrad = ctx.createLinearGradient(panelLeft, 0, solidRight, 0);
    blendGrad.addColorStop(0, 'rgba(12, 30, 51, 0)');
    blendGrad.addColorStop(1, 'rgba(12, 30, 51, 1)');
    ctx.fillStyle = blendGrad;
    ctx.fillRect(panelLeft, 0, solidRight - panelLeft, H);

    ctx.fillStyle = '#0c1e33';
    ctx.fillRect(solidRight, 0, W - solidRight, H);

    return canvas.toDataURL('image/jpeg', 0.94);
  }, metroBuf.toString('base64'));

  const metroData = cleanMetroBase64.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync(path.join(platesDir, 'metrology.jpg'), Buffer.from(metroData, 'base64'));
  console.log('Saved metrology.jpg');

  // Helper to blend right 35% of an image for clean StationPanel placement
  const blendRightSide = async (inputPath, outputPath) => {
    const buf = fs.readFileSync(inputPath);
    const outBase64 = await page.evaluate(async (base64) => {
      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + base64;
      await new Promise((r) => (img.onload = r));

      const canvas = document.getElementById('c');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const W = img.width;
      const H = img.height;
      const panelLeft = Math.round(W * 0.65);
      const solidRight = Math.round(W * 0.74);

      const blendGrad = ctx.createLinearGradient(panelLeft, 0, solidRight, 0);
      blendGrad.addColorStop(0, 'rgba(12, 30, 51, 0)');
      blendGrad.addColorStop(1, 'rgba(12, 30, 51, 1)');
      ctx.fillStyle = blendGrad;
      ctx.fillRect(panelLeft, 0, solidRight - panelLeft, H);

      ctx.fillStyle = '#0c1e33';
      ctx.fillRect(solidRight, 0, W - solidRight, H);

      return canvas.toDataURL('image/jpeg', 0.94);
    }, buf.toString('base64'));

    const data = outBase64.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(outputPath, Buffer.from(data, 'base64'));
  };

  // 2. Start Handling
  console.log('Processing start_handling.jpg ...');
  await blendRightSide(
    path.join(artifactDir, 'start_handling_1790105138992.jpg'),
    path.join(platesDir, 'start_handling.jpg')
  );
  console.log('Saved start_handling.jpg');

  // 3. Coat / Develop Track
  console.log('Processing coat_develop_track.jpg ...');
  await blendRightSide(
    path.join(artifactDir, 'coat_develop_track_1790105085635.jpg'),
    path.join(platesDir, 'coat_develop_track.jpg')
  );
  console.log('Saved coat_develop_track.jpg');

  // 4. Etch
  console.log('Processing etch.jpg ...');
  await blendRightSide(
    path.join(artifactDir, 'etch_station_1790105120967.jpg'),
    path.join(platesDir, 'etch.jpg')
  );
  console.log('Saved etch.jpg');

  // 5. Strip
  console.log('Processing strip.jpg ...');
  await blendRightSide(
    path.join(artifactDir, 'strip_station_1790105104325.jpg'),
    path.join(platesDir, 'strip.jpg')
  );
  console.log('Saved strip.jpg');

  // 6. Mobile Overview
  console.log('Processing mobile_overview.jpg ...');
  fs.copyFileSync(
    path.join(artifactDir, 'mobile_overview_1790105171763.jpg'),
    path.join(platesDir, 'mobile_overview.jpg')
  );
  console.log('Saved mobile_overview.jpg');

  await browser.close();
  console.log('ALL PLATES PROCESSED SUCCESSFULLY!');
}

main().catch(console.error);
