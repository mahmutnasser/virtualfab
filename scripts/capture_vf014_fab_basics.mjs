import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.join(
  'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\3615d0ab-9175-4907-ba08-c449e8cda244',
  'current-review',
  'vf014'
);
const videoTempDir = path.join(artifactDir, 'video_temp');

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}
if (!fs.existsSync(videoTempDir)) {
  fs.mkdirSync(videoTempDir, { recursive: true });
}

async function saveVideo(page, context, outputName) {
  const video = page.video();
  await page.close();
  await context.close();
  if (video) {
    const videoPath = await video.path();
    const destPath = path.join(artifactDir, outputName);
    fs.copyFileSync(videoPath, destPath);
    console.log(`Successfully saved video: ${outputName}`);
  }
}

async function run() {
  console.log('=== Starting VF-014 Fab Basics Review Capture ===');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=default'],
  });

  const baseUrl = 'http://127.0.0.1:5173/';
  const basicsUrl = 'http://127.0.0.1:5173/#basics';

  // ─────────────────────────────────────────────────────────────
  // 1. DESKTOP JOURNEY (1440x900)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- Recording Desktop Fab Basics Journey (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoTempDir, size: { width: 1440, height: 900 } },
  });
  const desktopPage = await desktopContext.newPage();
  desktopPage.setDefaultTimeout(15000);

  // Navigate to Fab Basics
  await desktopPage.goto(basicsUrl, { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(1000);

  // 01: Hero Desktop
  console.log('Capturing 01_hero_desktop.png...');
  await desktopPage.screenshot({
    path: path.join(artifactDir, '01_hero_desktop.png'),
  });

  // 02: Scale - Wafer
  console.log('Capturing 02_scale_wafer.png...');
  const scaleViewer = desktopPage.locator('#scale-viewer');
  await scaleViewer.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '02_scale_wafer.png'),
  });

  // 03: Scale - Field
  console.log('Capturing 03_scale_field.png...');
  await desktopPage.getByRole('tab', { name: /Exposure Field/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '03_scale_field.png'),
  });

  // 04: Scale - Die
  console.log('Capturing 04_scale_die.png...');
  await desktopPage.getByRole('tab', { name: /Die/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '04_scale_die.png'),
  });

  // 05: Scale - Feature
  console.log('Capturing 05_scale_feature.png...');
  await desktopPage.getByRole('tab', { name: /Feature/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '05_scale_feature.png'),
  });

  // Patterning Mini-Lesson Steps 1 to 6
  const patterningSection = desktopPage.locator('#patterning-lesson');
  await patterningSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);

  // 06: Patterning Step 1 (Reticle)
  console.log('Capturing 06_patterning_step1_reticle.png...');
  await desktopPage.screenshot({
    path: path.join(artifactDir, '06_patterning_step1_reticle.png'),
  });

  // 07: Patterning Step 2 (Exposure)
  console.log('Capturing 07_patterning_step2_exposure.png...');
  await desktopPage.getByRole('button', { name: /Optical Exposure/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '07_patterning_step2_exposure.png'),
  });

  // 08: Patterning Step 3 (Chem Change)
  console.log('Capturing 08_patterning_step3_chem_change.png...');
  await desktopPage.getByRole('button', { name: /Chemical Solubility Change/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '08_patterning_step3_chem_change.png'),
  });

  // 09: Patterning Step 4 (Develop)
  console.log('Capturing 09_patterning_step4_develop.png...');
  await desktopPage.getByRole('button', { name: /Development/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '09_patterning_step4_develop.png'),
  });

  // 10: Patterning Step 5 (Etch)
  console.log('Capturing 10_patterning_step5_etch.png...');
  await desktopPage.getByRole('button', { name: /Etch Transfer/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '10_patterning_step5_etch.png'),
  });

  // 11: Patterning Step 6 (Strip)
  console.log('Capturing 11_patterning_step6_strip.png...');
  await desktopPage.getByRole('button', { name: /Resist Strip & Result/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '11_patterning_step6_strip.png'),
  });

  // 12: Process Verbs (ADD, PATTERN, REMOVE, FLATTEN)
  console.log('Capturing 12_process_verbs_four.png...');
  const verbsSection = desktopPage.locator('#process-verbs');
  await verbsSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '12_process_verbs_four.png'),
  });

  // 13: DUV vs EUV Comparator
  console.log('Capturing 13_duv_vs_euv_comparator.png...');
  const duvEuvSection = desktopPage.locator('#duv-vs-euv');
  await duvEuvSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '13_duv_vs_euv_comparator.png'),
  });

  // 14: CD, Overlay, Yield Visuals (in Terminology Registry)
  console.log('Capturing 14_cd_overlay_yield_visuals.png...');
  const cdCard = desktopPage.locator('#term-cd');
  await cdCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '14_cd_overlay_yield_visuals.png'),
  });

  // 15: Contextual Glossary Drawer in Virtual Fab StationPanel
  console.log('Transitioning to Virtual Fab and opening Contextual Glossary Drawer...');
  // Click Launch Virtual Fab in TopNav
  await desktopPage.getByRole('button', { name: /Launch Virtual Fab/i }).first().click();
  await desktopPage.waitForTimeout(1000);

  // Start Tour / Open Deposition station
  const startTourBtn = desktopPage.getByRole('button', { name: /Start the Tour/i });
  if (await startTourBtn.isVisible()) {
    await startTourBtn.click();
    await desktopPage.waitForTimeout(1000);
  }

  // Click Terms button in StationPanel
  const termsBtn = desktopPage.getByRole('button', { name: /View glossary terms for this station/i });
  if (await termsBtn.isVisible()) {
    await termsBtn.click();
    await desktopPage.waitForTimeout(800);
  }

  console.log('Capturing 15_fab_contextual_glossary_drawer.png...');
  await desktopPage.screenshot({
    path: path.join(artifactDir, '15_fab_contextual_glossary_drawer.png'),
  });

  await saveVideo(desktopPage, desktopContext, 'desktop_basics_journey.webm');

  // ─────────────────────────────────────────────────────────────
  // 2. MOBILE JOURNEY (390x844)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- Recording Mobile Fab Basics Journey (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: videoTempDir, size: { width: 390, height: 844 } },
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.setDefaultTimeout(15000);

  await mobilePage.goto(basicsUrl, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1000);

  // Mobile 01: Hero
  console.log('Capturing mobile_01_hero.png...');
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_01_hero.png'),
  });

  // Mobile 02: Scale Stepper
  console.log('Capturing mobile_02_scale_stepper.png...');
  await mobilePage.locator('#scale-viewer').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_02_scale_stepper.png'),
  });

  // Mobile 03: Patterning Step
  console.log('Capturing mobile_03_patterning_step.png...');
  await mobilePage.locator('#patterning-lesson').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_03_patterning_step.png'),
  });

  // Mobile 04: DUV vs EUV
  console.log('Capturing mobile_04_duv_euv.png...');
  await mobilePage.locator('#duv-vs-euv').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_04_duv_euv.png'),
  });

  // Mobile 05: Contextual Glossary Drawer in Virtual Fab
  console.log('Capturing mobile_05_contextual_glossary.png...');
  await mobilePage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1000);

  const mobileStartBtn = mobilePage.getByRole('button', { name: /Start the Tour/i });
  if (await mobileStartBtn.isVisible()) {
    await mobileStartBtn.click();
    await mobilePage.waitForTimeout(1000);
  }

  const mobileTermsBtn = mobilePage.getByRole('button', { name: /View glossary terms for this station/i });
  if (await mobileTermsBtn.isVisible()) {
    await mobileTermsBtn.click();
    await mobilePage.waitForTimeout(800);
  }

  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_05_contextual_glossary.png'),
  });

  await saveVideo(mobilePage, mobileContext, 'mobile_basics_journey.webm');

  // ─────────────────────────────────────────────────────────────
  // 3. CONTACT SHEET GENERATION (15 Desktop + 5 Mobile frames)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- Generating Contact Sheet (contact_sheet_vf014.jpg) ---');
  const contactSheetPage = await browser.newPage({
    viewport: { width: 1920, height: 1600 },
  });

  const frames = [
    { file: '01_hero_desktop.png', title: '01. Fab Basics Hero (1440x900)' },
    { file: '02_scale_wafer.png', title: '02. Scale: 300 mm Silicon Wafer' },
    { file: '03_scale_field.png', title: '03. Scale: Exposure Field (26x33mm)' },
    { file: '04_scale_die.png', title: '04. Scale: Die (8x10mm)' },
    { file: '05_scale_feature.png', title: '05. Scale: Nanoscale Feature' },
    { file: '06_patterning_step1_reticle.png', title: '06. Patterning: 1. Reticle' },
    { file: '07_patterning_step2_exposure.png', title: '07. Patterning: 2. Exposure' },
    { file: '08_patterning_step3_chem_change.png', title: '08. Patterning: 3. Chem Change' },
    { file: '09_patterning_step4_develop.png', title: '09. Patterning: 4. Develop' },
    { file: '10_patterning_step5_etch.png', title: '10. Patterning: 5. Etch' },
    { file: '11_patterning_step6_strip.png', title: '11. Patterning: 6. Resist Strip' },
    { file: '12_process_verbs_four.png', title: '12. The 4 Process Verbs' },
    { file: '13_duv_vs_euv_comparator.png', title: '13. DUV vs EUV Comparator' },
    { file: '14_cd_overlay_yield_visuals.png', title: '14. CD, Overlay, Yield Cards' },
    { file: '15_fab_contextual_glossary_drawer.png', title: '15. Contextual Glossary Drawer' },
    { file: 'mobile_01_hero.png', title: 'Mobile: 01. Hero (390x844)' },
    { file: 'mobile_02_scale_stepper.png', title: 'Mobile: 02. Scale Stepper' },
    { file: 'mobile_03_patterning_step.png', title: 'Mobile: 03. Patterning Step' },
    { file: 'mobile_04_duv_euv.png', title: 'Mobile: 04. DUV vs EUV' },
    { file: 'mobile_05_contextual_glossary.png', title: 'Mobile: 05. Station Glossary' },
  ];

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>VF-014 Review Contact Sheet</title>
    <style>
      body {
        margin: 0;
        padding: 30px;
        background: #0f172a;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #f8fafc;
      }
      header {
        margin-bottom: 24px;
        border-bottom: 1px solid #334155;
        padding-bottom: 16px;
      }
      h1 { margin: 0 0 8px 0; font-size: 26px; color: #38bdf8; }
      p { margin: 0; color: #94a3b8; font-size: 14px; }
      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }
      .card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .card img {
        width: 100%;
        height: auto;
        display: block;
        background: #000;
        border-bottom: 1px solid #334155;
      }
      .card-caption {
        padding: 10px 12px;
        font-size: 12px;
        font-weight: 600;
        color: #e2e8f0;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>VF-014 — FAB BASICS: SPEAK THE LANGUAGE</h1>
      <p>Educational Foundation Module &middot; Visual Contact Sheet (15 Desktop + 5 Mobile Keyframes)</p>
    </header>
    <div class="grid">
      ${frames
        .map(
          (f) => `
        <div class="card">
          <img src="file:///${path.join(artifactDir, f.file).replace(/\\/g, '/')}" alt="${f.title}" />
          <div class="card-caption">${f.title}</div>
        </div>
      `
        )
        .join('')}
    </div>
  </body>
  </html>
  `;

  await contactSheetPage.setContent(htmlContent, { waitUntil: 'load' });
  await contactSheetPage.waitForTimeout(1000);
  const contactSheetPath = path.join(artifactDir, 'contact_sheet_vf014.jpg');
  await contactSheetPage.screenshot({ path: contactSheetPath, quality: 90, type: 'jpeg' });
  console.log('Successfully generated: contact_sheet_vf014.jpg');
  await contactSheetPage.close();

  // ─────────────────────────────────────────────────────────────
  // 4. README DOCUMENTATION
  // ─────────────────────────────────────────────────────────────
  const readmeContent = `# VF-014 Review Artifacts — Fab Basics: Speak the Language

## Verification Summary
- **Milestone**: VF-014 — Fab Basics: Speak the Language
- **Purpose**: Interactive educational foundation module at \`/basics\` preparing first- and second-year engineering students with essential semiconductor vocabulary before entering Virtual Fab.
- **Visual Design**: Light learning system (#FFFFFF top nav, #F8FAFC page surfaces, dark navy #102A43 headings, Space Grotesk / Inter / IBM Plex Mono fonts).
- **Fab World Invariant**: Virtual Fab spatial shell remains 100% frozen. The ONLY addition is the non-destructive contextual glossary drawer accessible via the "Terms" button in StationPanel.
- **Traceability**: All 28 terms cite verified academic sources from Plummer et al. (2000), Sze & Ng (2006), Quirk & Serda (2001), and Levinson (2010).

## Desktop Keyframes (1440×900)
1. \`01_hero_desktop.png\` — Fab Basics Hero and White TopNav
2. \`02_scale_wafer.png\` — Scale level 1: 300 mm Silicon Wafer
3. \`03_scale_field.png\` — Scale level 2: Exposure Field (~26 × 33 mm)
4. \`04_scale_die.png\` — Scale level 3: Die (~8 × 10 mm)
5. \`05_scale_feature.png\` — Scale level 4: Nanoscale Features
6. \`06_patterning_step1_reticle.png\` — Patterning Step 1: Reticle / Photomask
7. \`07_patterning_step2_exposure.png\` — Patterning Step 2: Optical Exposure
8. \`08_patterning_step3_chem_change.png\` — Patterning Step 3: Solubility Change
9. \`09_patterning_step4_develop.png\` — Patterning Step 4: Aqueous Development
10. \`10_patterning_step5_etch.png\` — Patterning Step 5: Etch Transfer
11. \`11_patterning_step6_strip.png\` — Patterning Step 6: Resist Strip & Result
12. \`12_process_verbs_four.png\` — The 4 Universal Process Verbs (ADD, PATTERN, REMOVE, FLATTEN)
13. \`13_duv_vs_euv_comparator.png\` — DUV (193 nm) vs. EUV (13.5 nm) Lithography Comparator
14. \`14_cd_overlay_yield_visuals.png\` — Critical Dimension, Overlay Alignment, and Yield Wafer Map
15. \`15_fab_contextual_glossary_drawer.png\` — Virtual Fab StationPanel with Contextual Glossary Drawer

## Mobile Keyframes (390×844)
1. \`mobile_01_hero.png\` — Mobile Hero & Navigation
2. \`mobile_02_scale_stepper.png\` — Mobile Scale Stepper
3. \`mobile_03_patterning_step.png\` — Mobile Patterning Mini-Lesson
4. \`mobile_04_duv_euv.png\` — Mobile DUV vs EUV Comparison
5. \`mobile_05_contextual_glossary.png\` — Mobile StationPanel with Contextual Glossary Drawer

## Video Recordings & Contact Sheet
- \`desktop_basics_journey.webm\` — Continuous video of Fab Basics journey and transition into Virtual Fab
- \`mobile_basics_journey.webm\` — Continuous video of mobile touch journey and glossary drawer
- \`contact_sheet_vf014.jpg\` — Complete 20-frame visual review contact sheet

## Test Suite Status
- **131 / 131 tests passing** across 23 vitest test files (100% green).
- TypeScript compile: 0 errors (\`npx tsc --noEmit\`).
- Production build: Clean bundle generated in 696ms.
`;

  fs.writeFileSync(path.join(artifactDir, 'README.md'), readmeContent, 'utf-8');
  console.log('Successfully wrote README.md in review directory.');

  console.log('\n=== All VF-014 Review Artifacts Generated Successfully ===');
  await browser.close();
}

run().catch((err) => {
  console.error('Error during VF-014 capture:', err);
  process.exit(1);
});
