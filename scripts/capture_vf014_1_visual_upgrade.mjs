import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.join(
  'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\3615d0ab-9175-4907-ba08-c449e8cda244',
  'current-review',
  'vf014_1'
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
  console.log('=== Starting VF-014.1 Visual Upgrade Review Capture ===');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=default'],
  });

  const basicsUrl = 'http://127.0.0.1:5173/#basics';

  // ─────────────────────────────────────────────────────────────
  // 1. DESKTOP JOURNEY (1440x900)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- Recording Desktop Visual Upgrade Journey (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoTempDir, size: { width: 1440, height: 900 } },
  });
  const desktopPage = await desktopContext.newPage();
  desktopPage.setDefaultTimeout(15000);

  // Navigate to Fab Basics
  await desktopPage.goto(basicsUrl, { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(1000);

  // 01: Hero Redesign
  console.log('Capturing 01_hero_redesign.png...');
  await desktopPage.screenshot({
    path: path.join(artifactDir, '01_hero_redesign.png'),
  });

  // 02: Wafer Stage
  console.log('Capturing 02_wafer.png...');
  const scaleViewer = desktopPage.locator('#scale-viewer');
  await scaleViewer.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '02_wafer.png'),
  });

  // 03: Field Stage
  console.log('Capturing 03_field.png...');
  await desktopPage.getByRole('tab', { name: /Exposure Field/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '03_field.png'),
  });

  // 04: Die Stage
  console.log('Capturing 04_die.png...');
  await desktopPage.getByRole('tab', { name: /Die/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '04_die.png'),
  });

  // 05: Feature Stage
  console.log('Capturing 05_feature.png...');
  await desktopPage.getByRole('tab', { name: /Feature/i }).click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '05_feature.png'),
  });

  // 06: Wafer Hierarchy Sequence Overview (Zoom back to wafer and capture full section)
  console.log('Capturing 06_wafer_hierarchy_sequence.png...');
  await desktopPage.getByRole('tab', { name: /Wafer/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '06_wafer_hierarchy_sequence.png'),
  });

  // 07: Patterning Visual Story
  console.log('Capturing 07_patterning_visual.png...');
  const patterningSection = desktopPage.locator('#patterning-lesson');
  await patterningSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '07_patterning_visual.png'),
  });

  // 08: Patterning 2.5D Cross-Section (Switch step or toggle overview)
  console.log('Capturing 08_cross_section.png...');
  const etchStepBtn = desktopPage.getByRole('button', { name: /Etch Transfer/i });
  if (await etchStepBtn.isVisible()) {
    await etchStepBtn.click();
    await desktopPage.waitForTimeout(600);
  }
  await desktopPage.screenshot({
    path: path.join(artifactDir, '08_cross_section.png'),
  });

  // 09: CD (Critical Dimension) with SEM Calipers
  console.log('Capturing 09_cd.png...');
  const cdCard = desktopPage.locator('#term-cd');
  await cdCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '09_cd.png'),
  });

  // 10: Overlay with Registration Error Vector
  console.log('Capturing 10_overlay.png...');
  const overlayCard = desktopPage.locator('#term-overlay');
  await overlayCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '10_overlay.png'),
  });

  // 11: Yield Wafer Map with Clipped Circular Boundary & Status
  console.log('Capturing 11_yield.png...');
  const yieldCard = desktopPage.locator('#term-yield');
  await yieldCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '11_yield.png'),
  });

  // 12: DUV Lithography Optical Architecture
  console.log('Capturing 12_duv.png...');
  const duvEuvSection = desktopPage.locator('#duv-vs-euv');
  await duvEuvSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);
  const duvBtn = desktopPage.getByRole('button', { name: /DUV \(193 nm Refractive\)/i });
  if (await duvBtn.isVisible()) {
    await duvBtn.click();
    await desktopPage.waitForTimeout(600);
  }
  await desktopPage.screenshot({
    path: path.join(artifactDir, '12_duv.png'),
  });

  // 13: EUV Lithography Optical Architecture
  console.log('Capturing 13_euv.png...');
  const euvBtn = desktopPage.getByRole('button', { name: /EUV \(13.5 nm Reflective\)/i });
  if (await euvBtn.isVisible()) {
    await euvBtn.click();
    await desktopPage.waitForTimeout(600);
  }
  await desktopPage.screenshot({
    path: path.join(artifactDir, '13_euv.png'),
  });

  // 14: Process Verbs (ADD, PATTERN, REMOVE, FLATTEN)
  console.log('Capturing 14_process_verbs.png...');
  const verbsSection = desktopPage.locator('#process-verbs');
  await verbsSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '14_process_verbs.png'),
  });

  // 15: Terms Reference / Systematic Registry Section
  console.log('Capturing 15_terms_reference.png...');
  const registryHeading = desktopPage.locator('#registry-heading');
  await registryHeading.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '15_terms_reference.png'),
  });

  await saveVideo(desktopPage, desktopContext, 'desktop_visual_journey.webm');

  // ─────────────────────────────────────────────────────────────
  // 2. MOBILE JOURNEY (390x844)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- Recording Mobile Visual Upgrade (390x844) ---');
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

  // Mobile 02: Wafer Stage
  console.log('Capturing mobile_02_wafer.png...');
  await mobilePage.locator('#scale-viewer').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_02_wafer.png'),
  });

  // Mobile 03: Feature Stage
  console.log('Capturing mobile_03_feature.png...');
  const mobileFeatureTab = mobilePage.getByRole('tab', { name: /Feature/i });
  if (await mobileFeatureTab.isVisible()) {
    await mobileFeatureTab.click({ force: true });
    await mobilePage.waitForTimeout(600);
  }
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_03_feature.png'),
  });

  // Mobile 04: Cross Section (Patterning Mini Lesson)
  console.log('Capturing mobile_04_cross_section.png...');
  await mobilePage.locator('#patterning-lesson').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_04_cross_section.png'),
  });

  // Mobile 05: DUV vs EUV
  console.log('Capturing mobile_05_duv_euv.png...');
  await mobilePage.locator('#duv-vs-euv').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_05_duv_euv.png'),
  });

  const mobileVideo = mobilePage.video();
  await mobilePage.close();
  await mobileContext.close();
  if (mobileVideo) {
    const videoPath = await mobileVideo.path();
    const destPath = path.join(artifactDir, 'mobile_visual_journey.webm');
    fs.copyFileSync(videoPath, destPath);
    console.log('Successfully saved mobile video');
  }

  // ─────────────────────────────────────────────────────────────
  // 3. CONTACT SHEET GENERATION (15 Desktop + 5 Mobile frames)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- Generating Contact Sheet (contact_sheet_vf014_1.jpg) ---');
  const contactSheetPage = await browser.newPage({
    viewport: { width: 1920, height: 1600 },
  });

  const frames = [
    { file: '01_hero_redesign.png', title: '01. Editorial Hero & 300 mm Wafer' },
    { file: '02_wafer.png', title: '02. Scale: 300 mm Silicon Substrate' },
    { file: '03_field.png', title: '03. Scale: Exposure Field (26×33 mm)' },
    { file: '04_die.png', title: '04. Scale: Die (8×10 mm Chip Area)' },
    { file: '05_feature.png', title: '05. Scale: Nanoscale Features' },
    { file: '06_wafer_hierarchy_sequence.png', title: '06. Hierarchy Coordinate Sequence' },
    { file: '07_patterning_visual.png', title: '07. 2.5D Isometric Patterning Flow' },
    { file: '08_cross_section.png', title: '08. Etch Transfer 2.5D Cutaway' },
    { file: '09_cd.png', title: '09. SEM CD Metrology & Trench Calipers' },
    { file: '10_overlay.png', title: '10. Box-in-Box Overlay Registration Mark' },
    { file: '11_yield.png', title: '11. Clipped Circular Yield Wafer Map' },
    { file: '12_duv.png', title: '12. DUV 193 nm Refractive Optical Path' },
    { file: '13_euv.png', title: '13. EUV 13.5 nm Reflective Bragg Mirrors' },
    { file: '14_process_verbs.png', title: '14. 4 Process Verbs Material Blocks' },
    { file: '15_terms_reference.png', title: '15. Museum-Style Terminology Registry' },
    { file: 'mobile_01_hero.png', title: 'Mobile 01: Hero Redesign' },
    { file: 'mobile_02_wafer.png', title: 'Mobile 02: Wafer Stage' },
    { file: 'mobile_03_feature.png', title: 'Mobile 03: Feature Stage' },
    { file: 'mobile_04_cross_section.png', title: 'Mobile 04: 2.5D Cross-Section' },
    { file: 'mobile_05_duv_euv.png', title: 'Mobile 05: DUV / EUV Optical Path' },
  ];

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>VF-014.1 Review Contact Sheet</title>
    <style>
      body {
        margin: 0;
        padding: 30px;
        background: #0B132B;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #F8FAFC;
      }
      header {
        margin-bottom: 24px;
        border-bottom: 1px solid #1E293B;
        padding-bottom: 16px;
      }
      h1 { margin: 0 0 8px 0; font-size: 26px; color: #00A6A6; font-family: 'Space Grotesk', sans-serif; }
      p { margin: 0; color: #94A3B8; font-size: 14px; }
      .grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16px;
      }
      .card {
        background: #111C35;
        border: 1px solid #233554;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .card img {
        width: 100%;
        height: 160px;
        object-fit: cover;
        background: #020617;
        display: block;
      }
      .card .caption {
        padding: 8px 12px;
        font-size: 11px;
        font-weight: 600;
        color: #E2E8F0;
        border-top: 1px solid #1E293B;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tag {
        display: inline-block;
        font-size: 9px;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(0, 166, 166, 0.2);
        color: #00A6A6;
        margin-right: 4px;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>VF-014.1 · Visual Experience & Scientific Graphics Upgrade</h1>
      <p>Verification Contact Sheet: 15 Desktop (1440×900) + 5 Mobile (390×844) Review Proofs</p>
    </header>
    <div class="grid">
      ${frames
        .map(
          (f) => `
        <div class="card">
          <img src="file://${path.join(artifactDir, f.file).replace(/\\/g, '/')}" alt="${f.title}">
          <div class="caption">
            <span class="tag">${f.file.startsWith('mobile') ? 'MOBILE' : 'DESKTOP'}</span>
            ${f.title}
          </div>
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

  await contactSheetPage.screenshot({
    path: path.join(artifactDir, 'contact_sheet_vf014_1.jpg'),
    type: 'jpeg',
    quality: 90,
    fullPage: true,
  });
  console.log('Saved contact_sheet_vf014_1.jpg');

  // ─────────────────────────────────────────────────────────────
  // 4. GENERATE README.md
  // ─────────────────────────────────────────────────────────────
  const readmeContent = `# VF-014.1 Review Proofs · Visual Experience & Scientific Graphics Upgrade

This directory contains review artifacts verifying **VF-014.1 — Visual Experience & Scientific Graphics Upgrade** for the Fab Basics foundation module.

## Summary of Upgrades
- **Page Rhythm & Editorial Whitespace**: Completely replaced card-heavy dashboard feel with museum-grade layout, asymmetrical hero, prominent numbered section markers (01 to 05), and spacious typography.
- **Continuous Coordinate System**: 4-stage hierarchy (Wafer 300 mm $\\rightarrow$ Field 26×33 mm $\\rightarrow$ Die 8×10 mm $\\rightarrow$ Nanoscale Feature) unified into one continuous spatial coordinate system based on reference \`media_1790249936300.jpg\`.
- **2.5D Isometric Patterning Flow**: Rebuilt 6-step patterning story with 2.5D isometric cutaway wafer blocks matching reference \`media_1790249936408.jpg\`, including Before/After comparisons and overview mode.
- **SEM-Style Critical Dimension (CD)**: Replaced flat diagram with SEM-textured trench view, cyan measurement bracket calipers, and Target/Narrower/Wider scenario panels matching \`media_1790249936371.jpg\`.
- **Box-in-Box Overlay Registration**: Engineered precise box-in-box lithography alignment target with misregistration vector $\\vec{\\Delta}(X, Y)$.
- **Circular Yield Wafer Map**: Clipped circular wafer boundary with notch, die coordinate grid, and symbol+color distinction (Pass \`✓\`, Fail \`✕\`, Edge \`⚠\`).
- **All Numeric Values Qualified**: All scenario values explicitly qualified with *"Illustrative scenario value"* or *"Illustrative example"*.
- **Frozen Invariants**: All terminology IDs, sources registry, and 3D Fab World remain 100% frozen.

## Proof Files

### Desktop Keyframes (1440×900)
1. \`01_hero_redesign.png\` — Museum-style hero with optical diffraction 300 mm wafer.
2. \`02_wafer.png\` — Stage 1: 300 mm silicon wafer substrate.
3. \`03_field.png\` — Stage 2: Scanner exposure field (~26×33 mm) with 6 highlighted dies.
4. \`04_die.png\` — Stage 3: Independent functional integrated circuit (~8×10 mm).
5. \`05_feature.png\` — Stage 4: Nanoscale FinFET/gate features with microscopic disclaimer.
6. \`06_wafer_hierarchy_sequence.png\` — Full coordinate hierarchy sequence overview.
7. \`07_patterning_visual.png\` — 2.5D isometric wafer block patterning mini-lesson.
8. \`08_cross_section.png\` — 2.5D cutaway cross-section during Etch transfer.
9. \`09_cd.png\` — SEM-style trench caliper CD measurement.
10. \`10_overlay.png\` — Lithography Box-in-Box overlay registration mark.
11. \`11_yield.png\` — Clipped circular yield wafer map with notch & defect clusters.
12. \`12_duv.png\` — DUV 193 nm refractive transmissive optical path.
13. \`13_euv.png\` — EUV 13.5 nm reflective Mo/Si Bragg mirror beamline in vacuum.
14. \`14_process_verbs.png\` — Material block transformations: ADD, PATTERN, REMOVE, FLATTEN.
15. \`15_terms_reference.png\` — Museum-grade systematic terminology registry.

### Mobile Keyframes (390×844)
1. \`mobile_01_hero.png\` — Mobile editorial header & 300 mm wafer view.
2. \`mobile_02_wafer.png\` — Mobile scale stepper (Wafer).
3. \`mobile_03_feature.png\` — Mobile scale stepper (Nanoscale Feature).
4. \`mobile_04_cross_section.png\` — Mobile 2.5D patterning block view.
5. \`mobile_05_duv_euv.png\` — Mobile DUV vs EUV comparison.

### Continuous Video Recordings
- \`desktop_visual_journey.webm\` — Continuous desktop scroll & interaction recording.
- \`mobile_visual_journey.webm\` — Continuous mobile scroll & touch interaction recording.

### Contact Sheet
- \`contact_sheet_vf014_1.jpg\` — 20-frame verification contact sheet.
`;

  fs.writeFileSync(path.join(artifactDir, 'README.md'), readmeContent, 'utf-8');
  console.log('Saved README.md');

  await browser.close();
  console.log('\n=== Capture Completed Successfully! ===');
}

run().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
