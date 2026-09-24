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

    console.log('Navigating to http://127.0.0.1:5173/ ...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 10000 });
    // Wait for plate texture to load and render
    await page.waitForTimeout(1500);

    // 1. Capture Fab Overview
    console.log('Capturing vf010_3_overview.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_3_overview.png') });

    // 2. Navigate to Deposition Station Focus
    console.log('Navigating to Deposition Station Focus ...');
    const startTourBtn = page.locator('button:has-text("Start the Tour")').first();
    if (await startTourBtn.isVisible()) {
      await startTourBtn.click();
    } else {
      await page.locator('button[aria-label*="Deposition"]').first().click();
    }
    await page.waitForSelector('[data-testid="station-panel"]', { timeout: 10000 });
    await page.waitForTimeout(1500);
    console.log('Capturing vf010_3_deposition.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_3_deposition.png') });

    // 3. Navigate to Lithography Scanner
    console.log('Navigating to Lithography Scanner ...');
    const lithoPill = page.locator('button[aria-label*="Lithography"]').first();
    await lithoPill.click();
    await page.waitForTimeout(1500);
    console.log('Capturing vf010_3_lithography.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_3_lithography.png') });

    await context.close();
    console.log('VF-010.3 CAPTURES COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Capture error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

capture();
