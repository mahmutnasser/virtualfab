import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
  });

  try {
    console.log('--- Launching Desktop Context (1280x800) ---');
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    console.log('Navigating to http://127.0.0.1:5173/ ...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.waitForSelector('canvas', { timeout: 15000 });
    await page.waitForTimeout(1500);

    // 1. Capture Desktop Navigator (showing all 10 uncropped steps on desktop)
    console.log('Capturing vf010_5_navigator.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_5_navigator.png') });

    const stationsToCapture = [
      { id: 'coat', label: 'Coat Resist', file: 'vf010_5_track_coat.png' },
      { id: 'develop', label: 'Develop', file: 'vf010_5_track_develop.png' },
      { id: 'etch', label: 'Etch', file: 'vf010_5_etch.png' },
      { id: 'strip', label: 'Strip', file: 'vf010_5_strip.png' },
      { id: 'aei', label: 'AEI Inspection', file: 'vf010_5_metrology_aei.png' },
      { id: 'repeat', label: 'Repeat', file: 'vf010_5_repeat.png' },
    ];

    for (const item of stationsToCapture) {
      console.log(`Navigating to station: ${item.label} (${item.id}) ...`);
      const pill = page.locator(`button[aria-label*="${item.label}"]`).first();
      await pill.click({ force: true });
      await page.waitForSelector('[data-testid="station-panel"]', { timeout: 15000 });
      // Allow Three.js plate cross-fade and camera interpolation to settle
      await page.waitForTimeout(2000);

      const filePath = path.join(ARTIFACT_DIR, item.file);
      console.log(`Capturing ${item.file} ...`);
      await page.screenshot({ path: filePath });
    }

    await context.close();

    console.log('--- Launching Mobile Context (390x844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    console.log('Navigating to http://127.0.0.1:5173/ for Mobile Overview ...');
    await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await mobilePage.waitForSelector('canvas', { timeout: 15000 });
    await mobilePage.waitForTimeout(2000);

    const mobileFilePath = path.join(ARTIFACT_DIR, 'vf010_5_mobile.png');
    console.log('Capturing vf010_5_mobile.png ...');
    await mobilePage.screenshot({ path: mobileFilePath });

    await mobileContext.close();
    console.log('ALL 8 VF-010.5 VISUAL CHECKPOINT CAPTURES COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Capture error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

capture();
