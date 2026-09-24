import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    console.log('1. Navigating to http://127.0.0.1:5173/ for Overview ...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.waitForSelector('canvas', { timeout: 15000 });
    await page.waitForSelector('[data-testid="runtime-diagnostic-badge"]', { timeout: 15000 });
    // Let Three.js render frames with rotating magenta cube
    await page.waitForTimeout(2000);

    console.log('Capturing vf010_3_runtime_overview.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_3_runtime_overview.png') });

    console.log('2. Navigating to Deposition Station ...');
    const startTourBtn = page.locator('button:has-text("Start the Tour")').first();
    if (await startTourBtn.isVisible()) {
      await startTourBtn.click();
    } else {
      await page.locator('button[aria-label*="Deposition"]').first().click();
    }
    await page.waitForSelector('[data-testid="station-panel"]', { timeout: 15000 });
    await page.waitForTimeout(2000);

    console.log('Capturing vf010_3_runtime_deposition.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_3_runtime_deposition.png') });

    console.log('3. Navigating to Lithography Station ...');
    const lithoPill = page.locator('button[aria-label*="Lithography"]').first();
    await lithoPill.click();
    await page.waitForTimeout(2000);

    console.log('Capturing vf010_3_runtime_lithography.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_3_runtime_lithography.png') });

    await context.close();
    console.log('ALL RUNTIME PROOF SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Capture error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

capture();
