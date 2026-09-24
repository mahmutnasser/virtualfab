import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  try {
    // 1. Desktop captures
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    console.log('Navigating to http://127.0.0.1:5173/ ...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for Three.js render and camera damping

    // Screenshot 1: Overview
    console.log('Capturing vf010_2_overview.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_2_overview.png') });

    // Click "Start the Tour" or step 1 "Deposition" pill to focus Deposition
    console.log('Navigating to Deposition Station Focus ...');
    const startTourBtn = page.locator('button:has-text("Start the Tour")').first();
    if (await startTourBtn.isVisible()) {
      await startTourBtn.click();
    } else {
      await page.locator('button[aria-label*="Deposition"]').first().click();
    }
    await page.waitForSelector('[data-testid="station-panel"]', { timeout: 10000 });
    await page.waitForTimeout(2000); // Allow camera damping to complete
    console.log('Capturing vf010_2_deposition.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_2_deposition.png') });

    // Screenshot 3: Track system (Coat step)
    console.log('Navigating to Track (Coat Resist) ...');
    const coatPill = page.locator('button[aria-label*="Coat"]').first();
    await coatPill.click();
    await page.waitForTimeout(2500);
    console.log('Capturing vf010_2_track.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_2_track.png') });

    // Screenshot 4: Lithography scanner
    console.log('Navigating to Lithography Scanner ...');
    const lithoPill = page.locator('button[aria-label*="Lithography"]').first();
    await lithoPill.click();
    await page.waitForTimeout(2500);
    console.log('Capturing vf010_2_lithography.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_2_lithography.png') });

    // Screenshot 5: Metrology station (ADI Inspection)
    console.log('Navigating to Metrology (ADI) ...');
    const adiPill = page.locator('button[aria-label*="ADI"]').first();
    await adiPill.click();
    await page.waitForTimeout(2500);
    console.log('Capturing vf010_2_metrology.png ...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_2_metrology.png') });

    await context.close();

    // Screenshot 6: Mobile viewport
    console.log('Launching mobile context 390x844 ...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForSelector('canvas', { timeout: 10000 });
    await mobilePage.waitForTimeout(2000);
    console.log('Capturing vf010_2_mobile.png ...');
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_2_mobile.png') });
    await mobileContext.close();

    // Screenshot 7: Fallback (?webgl=false)
    console.log('Launching fallback context (?webgl=false) ...');
    const fallbackContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    });
    const fallbackPage = await fallbackContext.newPage();
    await fallbackPage.goto('http://127.0.0.1:5173/?webgl=false', { waitUntil: 'domcontentloaded' });
    await fallbackPage.waitForSelector('[data-testid="fab-viewport-fallback"]', { timeout: 8000 });
    await fallbackPage.waitForTimeout(1000);
    console.log('Capturing vf010_2_fallback.png ...');
    await fallbackPage.screenshot({ path: path.join(ARTIFACT_DIR, 'vf010_2_fallback.png') });
    await fallbackContext.close();

    console.log('ALL 7 CAPTURES SUCCESSFUL!');
  } catch (err) {
    console.error('Capture error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

capture();
