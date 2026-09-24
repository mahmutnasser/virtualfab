import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.join(
  'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\3615d0ab-9175-4907-ba08-c449e8cda244',
  'current-review',
  'vf010_6'
);
if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=default'],
  });

  const disableAnimationsCSS = `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `;

  try {
    // ─────────────────────────────────────────────────────────────
    // 1. DESKTOP CAPTURES (1440x900)
    // ─────────────────────────────────────────────────────────────
    console.log('--- Launching Desktop Browser (1440x900) ---');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.setDefaultTimeout(20000);

    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.addStyleTag({ content: disableAnimationsCSS });

    await page.waitForSelector('[data-testid="fab-viewport-3d"]');
    await page.waitForSelector('canvas');
    await page.waitForTimeout(1500);

    // 01_overview.png
    console.log('Capturing: 01_overview.png');
    await page.screenshot({ path: path.join(artifactDir, '01_overview.png') });

    // Process step IDs to capture in order
    const stationSteps = [
      { id: 'start', filename: '02_start.png', title: 'Start Wafer' },
      { id: 'deposition', filename: '03_deposition.png', title: '1. Deposition' },
      { id: 'coat', filename: '04_coat.png', title: '2. Coat Resist' },
      { id: 'lithography', filename: '05_lithography.png', title: '3. Lithography' },
      { id: 'develop', filename: '06_develop.png', title: '4. Develop' },
      { id: 'adi', filename: '07_adi.png', title: '◇ ADI Inspection' },
      { id: 'etch', filename: '08_etch.png', title: '5. Etch' },
      { id: 'aei', filename: '09_aei.png', title: '◇ AEI Inspection' },
      { id: 'strip', filename: '10_strip.png', title: '6. Strip Resist' },
      { id: 'repeat', filename: '11_repeat.png', title: '↺ Repeat' },
    ];

    for (const step of stationSteps) {
      console.log(`Navigating to ${step.title} (${step.id})...`);
      await page.evaluate((stepId) => {
        const store = window.__virtualFabStore?.getState();
        if (store) {
          store.openStation(stepId);
        }
      }, step.id);

      // Allow plate texture to load and Three.js scene to settle
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(artifactDir, step.filename) });
      console.log(`Captured: ${step.filename}`);
    }

    // 14_full_process_navigator.png
    console.log('Capturing: 14_full_process_navigator.png');
    // Switch to overview so full track is completely visible
    await page.evaluate(() => window.__virtualFabStore?.getState().returnToFab());
    await page.waitForTimeout(600);
    const navTrack = page.locator('nav[aria-label="Process Overview Track"]').first();
    await navTrack.screenshot({ path: path.join(artifactDir, '14_full_process_navigator.png') });
    console.log('Captured: 14_full_process_navigator.png');

    await page.close();

    // ─────────────────────────────────────────────────────────────
    // 2. MOBILE CAPTURES (390x844)
    // ─────────────────────────────────────────────────────────────
    console.log('--- Launching Mobile Browser (390x844) ---');
    const mobilePage = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    mobilePage.setDefaultTimeout(20000);

    await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await mobilePage.evaluate(() => localStorage.clear());
    await mobilePage.reload({ waitUntil: 'domcontentloaded' });
    await mobilePage.addStyleTag({ content: disableAnimationsCSS });

    await mobilePage.waitForSelector('[data-testid="fab-viewport-3d"]');
    await mobilePage.waitForSelector('canvas');
    await mobilePage.waitForTimeout(1500);

    // 12_mobile_overview.png
    console.log('Capturing: 12_mobile_overview.png');
    await mobilePage.screenshot({ path: path.join(artifactDir, '12_mobile_overview.png') });

    // 13_mobile_station_focus.png (Deposition)
    console.log('Capturing: 13_mobile_station_focus.png');
    await mobilePage.evaluate(() => {
      window.__virtualFabStore?.getState().openStation('deposition');
    });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: path.join(artifactDir, '13_mobile_station_focus.png') });

    await mobilePage.close();

    // ─────────────────────────────────────────────────────────────
    // 3. GENERATE CONTACT SHEET (contact_sheet_vf010_6.jpg)
    // ─────────────────────────────────────────────────────────────
    console.log('--- Generating Desktop Contact Sheet ---');
    const contactPage = await browser.newPage({ viewport: { width: 1920, height: 1650 } });

    const imagesToInclude = [
      { name: '01_overview.png', label: '01 · Fab Overview (Unified Cleanroom)' },
      { name: '02_start.png', label: '02 · Start Wafer (FOUP / Load Port)' },
      { name: '03_deposition.png', label: '03 · 1 Deposition (PECVD Bay)' },
      { name: '04_coat.png', label: '04 · 2 Coat Resist (Track Bay)' },
      { name: '05_lithography.png', label: '05 · 3 Lithography (Scanner Bay)' },
      { name: '06_develop.png', label: '06 · 4 Develop (Track Bay Shared)' },
      { name: '07_adi.png', label: '07 · ◇ ADI Inspection (Metrology Bay)' },
      { name: '08_etch.png', label: '08 · 5 Etch (Plasma Etcher Bay)' },
      { name: '09_aei.png', label: '09 · ◇ AEI Inspection (Metrology Bay Shared)' },
      { name: '10_strip.png', label: '10 · 6 Strip Resist (Ashing Bay)' },
      { name: '11_repeat.png', label: '11 · ↺ Repeat (Process Loop / Return)' },
    ];

    const cardsHtml = imagesToInclude.map((img) => {
      const imgPath = path.join(artifactDir, img.name);
      const b64 = fs.readFileSync(imgPath).toString('base64');
      return `
        <div style="background: #102a43; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
          <div style="padding: 10px 16px; background: #0c1e33; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: #f8fafc;">${img.label}</span>
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #00a6a6;">${img.name}</span>
          </div>
          <img src="data:image/png;base64,${b64}" style="width: 100%; display: block;" />
        </div>
      `;
    }).join('\n');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 32px;
            background: #081524;
            color: #f8fafc;
            font-family: 'Space Grotesk', sans-serif;
          }
          .header {
            margin-bottom: 24px;
            border-bottom: 1px solid rgba(255,255,255,0.12);
            padding-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .title {
            font-size: 26px;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 6px 0;
          }
          .subtitle {
            font-size: 13px;
            color: #94a3b8;
            margin: 0;
          }
          .badge {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 12px;
            color: #00a6a6;
            background: rgba(0, 166, 166, 0.12);
            padding: 6px 14px;
            border-radius: 6px;
            border: 1px solid rgba(0, 166, 166, 0.35);
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">Virtual Fab — VF-010.6 One Fab Visual Coherence Pass</h1>
            <p class="subtitle">Complete runtime verification across 11 canonical desktop states using approved photographic environment plates.</p>
          </div>
          <div class="badge">LIVE RUNTIME • 1440×900 • 11 STATIONS</div>
        </div>
        <div class="grid">
          ${cardsHtml}
        </div>
      </body>
      </html>
    `;

    await contactPage.setContent(htmlContent, { waitUntil: 'load' });
    await contactPage.waitForTimeout(1500);

    const contactSheetPath = path.join(artifactDir, 'contact_sheet_vf010_6.jpg');
    await contactPage.screenshot({
      path: contactSheetPath,
      type: 'jpeg',
      quality: 92,
      fullPage: true,
    });
    console.log(`Generated contact sheet: contact_sheet_vf010_6.jpg`);

    await contactPage.close();
    console.log('=== All VF-010.6 captures completed successfully ===');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
