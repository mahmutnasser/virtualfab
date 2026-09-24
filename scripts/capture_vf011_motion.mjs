import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.join(
  'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\3615d0ab-9175-4907-ba08-c449e8cda244',
  'current-review',
  'vf011'
);
const videoTempDir = path.join(artifactDir, 'video_temp');

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}
if (!fs.existsSync(videoTempDir)) {
  fs.mkdirSync(videoTempDir, { recursive: true });
}

async function waitForIdleTransition(page, expectedView, expectedStep, timeout = 15000) {
  let selector = '#vf-root[data-transition-state="idle"]';
  if (expectedView) selector += `[data-active-view="${expectedView}"]`;
  if (expectedStep) selector += `[data-selected-step="${expectedStep}"]`;
  try {
    await page.waitForSelector(selector, { timeout });
  } catch (err) {
    const currentState = await page.evaluate(() => {
      const root = document.getElementById('vf-root');
      return {
        transitionState: root?.getAttribute('data-transition-state'),
        activeView: root?.getAttribute('data-active-view'),
        selectedStep: root?.getAttribute('data-selected-step'),
      };
    }).catch(() => null);
    throw new Error(
      `Failed waiting for selector "${selector}". Current DOM state: ${JSON.stringify(currentState)}. Original error: ${err.message}`
    );
  }
}

async function saveVideo(page, context, outputName) {
  const video = page.video();
  await page.close();
  await context.close();
  if (video) {
    const videoPath = await video.path();
    const destPath = path.join(artifactDir, outputName);
    fs.copyFileSync(videoPath, destPath);
    console.log(`Successfully saved: ${outputName}`);
  }
}

async function run() {
  console.log('=== Starting VF-011 Final Motion Proof & Continuous Flow Capture ===');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=default'],
  });

  try {
    // ─────────────────────────────────────────────────────────────
    // 1. DESKTOP PROCEED MOTION (1440x900)
    // Continuous Flow: Overview → Deposition Station → Open Wafer Lab → prediction/process/interpretation → Continue → Coat Resist Station
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 1. Recording desktop_proceed_motion.webm (1440x900) ---');
    const desktopProceedContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: {
        dir: videoTempDir,
        size: { width: 1440, height: 900 },
      },
    });

    const page1 = await desktopProceedContext.newPage();
    page1.setDefaultTimeout(15000);

    // 1.1 Fab Overview
    console.log('1.1 Loading Fab Overview...');
    await page1.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await page1.evaluate(() => localStorage.clear());
    await page1.reload({ waitUntil: 'domcontentloaded' });

    await waitForIdleTransition(page1, 'fab-overview', 'deposition');
    await page1.waitForSelector('canvas');
    // Generous pause to observe refined floor perspective route overlay without floating machinery geometry
    await page1.waitForTimeout(2000);

    console.log('Capturing: overview_route_refined.png');
    await page1.screenshot({ path: path.join(artifactDir, 'overview_route_refined.png') });

    // 1.2 Transition to Deposition Station Focus
    console.log('1.2 Transitioning to Deposition Station Focus...');
    const exploreBtn = page1.getByRole('button', { name: /Explore the Process/i });
    if (await exploreBtn.isVisible()) {
      await exploreBtn.click();
    } else {
      const depPill = page1.getByRole('button', { name: /Step 1 of 6: Deposition/i });
      await depPill.click();
    }

    await waitForIdleTransition(page1, 'station-focus', 'deposition');
    await page1.waitForSelector('#station-panel-title:has-text("Deposition")');
    // Generous pause to clearly view white StationPanel and compact non-truncated process rail
    await page1.waitForTimeout(2500);

    console.log('Capturing: deposition_compact_rail.png');
    await page1.screenshot({ path: path.join(artifactDir, 'deposition_compact_rail.png') });

    // 1.3 Open Wafer Lab
    console.log('1.3 Opening Wafer Lab for Deposition...');
    const openLabBtn1 = page1.getByRole('button', { name: /Open Wafer Lab/i });
    await openLabBtn1.click();

    await page1.waitForSelector('#vf-root[data-active-view="wafer-lab"]', { timeout: 15000 });
    await page1.waitForSelector('h1:has-text("Deposition")');
    await page1.waitForTimeout(1800);

    // 1.4 Make prediction
    console.log('1.4 Making prediction...');
    const predictionOpt1 = page1.getByRole('radio', { name: /Adds a material layer across the surface/i });
    await predictionOpt1.click();
    await page1.waitForTimeout(1000);

    // 1.5 Run Deposition process
    console.log('1.5 Running Deposition process...');
    const runBtn1 = page1.getByRole('button', { name: /Run Deposition/i });
    await runBtn1.click();

    // 1.6 Answer interpretation question
    console.log('1.6 Answering interpretation question...');
    const interpOpt1 = page1.locator('button[role="radio"]:has-text("blanket deposition")');
    await interpOpt1.waitFor({ state: 'visible', timeout: 10000 });
    await page1.waitForTimeout(1200);
    await interpOpt1.click();

    // 1.7 Continue to Coat Resist Station
    console.log('1.7 Unlocking and clicking Continue to Coat Resist...');
    const continueBtn1 = page1.getByRole('button', { name: /Continue to Coat Resist/i });
    await continueBtn1.waitFor({ state: 'visible', timeout: 10000 });
    await page1.waitForTimeout(1500);
    await continueBtn1.click();

    // 1.8 Settle at Coat Resist Station Focus
    console.log('1.8 Transitioning to Coat Resist Station (EQ-TRACK-01)...');
    await waitForIdleTransition(page1, 'station-focus', 'coat');
    await page1.waitForSelector('#station-panel-title:has-text("Coat Resist")');
    await page1.waitForSelector('span:has-text("STEP 2 OF 6")');
    // Generous pause to clearly view completed checkmark on Step 1, active Step 2, and compact labels
    await page1.waitForTimeout(3000);

    console.log('Capturing: coat_compact_rail.png');
    await page1.screenshot({ path: path.join(artifactDir, 'coat_compact_rail.png') });

    await saveVideo(page1, desktopProceedContext, 'desktop_proceed_motion.webm');

    // ─────────────────────────────────────────────────────────────
    // 2. DESKTOP RETURN MOTION (1440x900)
    // Continuous Flow: Deposition → Wafer Lab → Return → Deposition, with Step 1 still incomplete
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 2. Recording desktop_return_motion.webm (1440x900) ---');
    const desktopReturnContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: {
        dir: videoTempDir,
        size: { width: 1440, height: 900 },
      },
    });

    const page2 = await desktopReturnContext.newPage();
    page2.setDefaultTimeout(15000);

    console.log('2.1 Loading Fab at Deposition Focus...');
    await page2.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await page2.evaluate(() => localStorage.clear());
    await page2.reload({ waitUntil: 'domcontentloaded' });

    await waitForIdleTransition(page2, 'fab-overview', 'deposition');
    const exploreBtn2 = page2.getByRole('button', { name: /Explore the Process/i });
    if (await exploreBtn2.isVisible()) {
      await exploreBtn2.click();
    } else {
      const depPill = page2.getByRole('button', { name: /Step 1 of 6: Deposition/i });
      await depPill.click();
    }
    await waitForIdleTransition(page2, 'station-focus', 'deposition');
    await page2.waitForSelector('#station-panel-title:has-text("Deposition")');
    await page2.waitForTimeout(1500);

    console.log('2.2 Entering Wafer Lab...');
    const openLabBtn2 = page2.getByRole('button', { name: /Open Wafer Lab/i });
    await openLabBtn2.click();
    await page2.waitForSelector('#vf-root[data-active-view="wafer-lab"]', { timeout: 15000 });
    await page2.waitForSelector('h1:has-text("Deposition")');
    await page2.waitForTimeout(2000);

    console.log('2.3 Returning to Station without completing step...');
    const returnBtn = page2.locator('button[aria-label*="Return to Deposition Station"], button[aria-label*="Return to Station"], button:has-text("Return to Station"), button:has-text("Back")').first();
    await returnBtn.click();

    await waitForIdleTransition(page2, 'station-focus', 'deposition');
    await page2.waitForSelector('#station-panel-title:has-text("Deposition")');

    // Verify Step 1 is still uncompleted
    const isStep1StillIncomplete = await page2.evaluate(() => {
      const step1Pill = document.querySelector('button[aria-label*="Step 1 of 6"]');
      return !(step1Pill?.getAttribute('aria-label')?.includes('completed') ?? false);
    });
    console.log(`Step 1 still incomplete verified: ${isStep1StillIncomplete}`);
    // Generous pause to demonstrate return branch settled at Deposition
    await page2.waitForTimeout(3000);

    await saveVideo(page2, desktopReturnContext, 'desktop_return_motion.webm');

    // ─────────────────────────────────────────────────────────────
    // 3. MOBILE PROCEED MOTION (390x844)
    // Continuous Flow: Overview → Deposition Station → Wafer Lab → Complete → Coat Resist
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 3. Recording mobile_proceed_motion.webm (390x844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      recordVideo: {
        dir: videoTempDir,
        size: { width: 390, height: 844 },
      },
    });

    const mobilePage = await mobileContext.newPage();
    mobilePage.setDefaultTimeout(15000);

    console.log('3.1 Loading Mobile Fab Overview...');
    await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await mobilePage.evaluate(() => localStorage.clear());
    await mobilePage.reload({ waitUntil: 'domcontentloaded' });

    await waitForIdleTransition(mobilePage, 'fab-overview', 'deposition');
    await mobilePage.waitForSelector('canvas');
    await mobilePage.waitForTimeout(2000);

    console.log('3.2 Navigating to Mobile Deposition Station Focus...');
    const mobileStartBtn = mobilePage.getByRole('button', { name: /Start the Tour/i });
    if (await mobileStartBtn.isVisible()) {
      await mobileStartBtn.click();
    } else {
      const mobileDepBtn = mobilePage.getByRole('button', { name: /Go to Deposition/i });
      await mobileDepBtn.click();
    }

    await waitForIdleTransition(mobilePage, 'station-focus', 'deposition');
    await mobilePage.waitForSelector('#station-panel-title:has-text("Deposition")');
    await mobilePage.waitForTimeout(2000);

    console.log('3.3 Opening Wafer Lab on mobile...');
    const mobileLabBtn = mobilePage.getByRole('button', { name: /Open Wafer Lab/i });
    await mobileLabBtn.click();
    await mobilePage.waitForSelector('#vf-root[data-active-view="wafer-lab"]', { timeout: 15000 });
    await mobilePage.waitForSelector('h1:has-text("Deposition")');
    await mobilePage.waitForTimeout(1500);

    console.log('3.4 Answering prediction & running process...');
    const mobilePred = mobilePage.getByRole('radio', { name: /Adds a material layer across the surface/i });
    await mobilePred.click();
    await mobilePage.waitForTimeout(800);

    const mobileRun = mobilePage.getByRole('button', { name: /Run Deposition/i });
    await mobileRun.click();

    const mobileInterp = mobilePage.locator('button[role="radio"]:has-text("blanket deposition")');
    await mobileInterp.waitFor({ state: 'visible', timeout: 10000 });
    await mobilePage.waitForTimeout(1000);
    await mobileInterp.click();

    console.log('3.5 Continuing to Coat Resist on mobile...');
    const mobileContinue = mobilePage.getByRole('button', { name: /Continue to Coat Resist/i });
    await mobileContinue.waitFor({ state: 'visible', timeout: 10000 });
    await mobilePage.waitForTimeout(1500);
    await mobileContinue.click();

    await waitForIdleTransition(mobilePage, 'station-focus', 'coat');
    await mobilePage.waitForSelector('#station-panel-title:has-text("Coat Resist")');
    await mobilePage.waitForTimeout(3000);

    await saveVideo(mobilePage, mobileContext, 'mobile_proceed_motion.webm');

    console.log('\n=== All Motion Proof Videos and Visual Captures Successfully Created ===');
  } catch (err) {
    console.error('Error during capture:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
