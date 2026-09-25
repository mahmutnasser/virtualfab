import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.join(
  'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\3615d0ab-9175-4907-ba08-c449e8cda244',
  'current-review',
  'vf014_3'
);
const videoTempDir = path.join(artifactDir, 'video_temp');

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}
if (!fs.existsSync(videoTempDir)) {
  fs.mkdirSync(videoTempDir, { recursive: true });
}

async function generateContactSheet() {
  console.log('\n--- Generating Contact Sheet for VF-014.3 ---');
  const frames = [
    { file: '01_wafer.png', title: '01. Scale: 300 mm Silicon Wafer' },
    { file: '02_field_2x3.png', title: '02. Scale: 26×33 mm Field (2×3 Dies)' },
    { file: '03_die_full.png', title: '03. Scale: Full Die (4 Edges Scribe Lanes)' },
    { file: '04_feature_large.png', title: '04. Scale: Large 3D FinFET Feature' },
    { file: '05_patterning_coat.png', title: '05. Patterning 1: Resist Coat' },
    { file: '06_patterning_exposure.png', title: '06. Patterning 2: Optical Exposure' },
    { file: '07_patterning_develop.png', title: '07. Patterning 4: Aqueous Develop' },
    { file: '08_patterning_etch.png', title: '08. Patterning 5: Etch Transfer' },
    { file: '09_patterning_strip.png', title: '09. Patterning 6: Resist Strip' },
    { file: '10_cd.png', title: '10. CD: SEM Feature & Live Caliper' },
    { file: '11_overlay.png', title: '11. Overlay: Enlarged Box-in-Box Mark' },
    { file: '12_yield.png', title: '12. Yield: Enlarged Circular Wafer Map' },
    { file: '13_duv_default.png', title: '13. DUV: Intuitive Optical Architecture' },
    { file: '14_duv_engineering.png', title: '14. DUV: Engineering Schematic View' },
    { file: '15_euv_default.png', title: '15. EUV: Intuitive Reflective Architecture' },
    { file: '16_euv_engineering.png', title: '16. EUV: Engineering Schematic View' },
    { file: '17_process_add.png', title: '17. Verb: ADD (Film Deposition)' },
    { file: '18_process_flatten.png', title: '18. Verb: FLATTEN (CMP Planarization)' },
    { file: 'mobile_01_wafer.png', title: 'Mobile 01: Wafer Scale' },
    { file: 'mobile_02_field.png', title: 'Mobile 02: 2×3 Field Scale' },
    { file: 'mobile_03_die.png', title: 'Mobile 03: Full Die Scale' },
    { file: 'mobile_04_feature.png', title: 'Mobile 04: Large Feature' },
    { file: 'mobile_05_patterning.png', title: 'Mobile 05: Patterning Block' },
    { file: 'mobile_06_cd.png', title: 'Mobile 06: CD SEM Visual' },
    { file: 'mobile_07_duv.png', title: 'Mobile 07: DUV Optical Path' },
  ];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1800 } });

  const cardHtml = frames
    .map((f) => {
      const filePath = path.join(artifactDir, f.file);
      if (!fs.existsSync(filePath)) {
        console.warn(`Frame missing: ${filePath}`);
        return '';
      }
      const base64 = fs.readFileSync(filePath).toString('base64');
      return `
      <div class="card">
        <img src="data:image/png;base64,${base64}" alt="${f.title}">
        <div class="caption">
          <span class="tag">${f.file.startsWith('mobile') ? 'MOBILE' : 'DESKTOP'}</span>
          ${f.title}
        </div>
      </div>
    `;
    })
    .join('');

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>VF-014.3 Reference Usage Correction & Visual Scale Pass</title>
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
      <h1>VF-014.3 · Reference-Asset Usage Correction &amp; Visual Scale Pass</h1>
      <p>Verification Contact Sheet: 18 Desktop (1440×900) + 7 Mobile (390×844) Keyframe Proofs</p>
    </header>
    <div class="grid">
      ${cardHtml}
    </div>
  </body>
  </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(artifactDir, 'contact_sheet_vf014_3.jpg'),
    type: 'jpeg',
    quality: 92,
    fullPage: true,
  });

  console.log('Successfully generated contact_sheet_vf014_3.jpg');
  await browser.close();
}

async function run() {
  console.log('=== Starting VF-014.3 Review Capture ===');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=default'],
  });

  const basicsUrl = 'http://127.0.0.1:5173/#basics';

  // ─────────────────────────────────────────────────────────────
  // 1. DESKTOP JOURNEY (1440x900)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- Capturing 18 Desktop Keyframes (1440x900) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const desktopPage = await desktopContext.newPage();
  desktopPage.setDefaultTimeout(15000);

  await desktopPage.goto(basicsUrl, { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(1000);

  const scaleViewer = desktopPage.locator('#scale-viewer');
  await scaleViewer.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(400);

  // 01: Wafer
  console.log('Capturing 01_wafer.png...');
  await desktopPage.locator('#tab-wafer').click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '01_wafer.png') });

  // 02: Field 2x3
  console.log('Capturing 02_field_2x3.png...');
  await desktopPage.locator('#tab-field').click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '02_field_2x3.png') });

  // 03: Die Full
  console.log('Capturing 03_die_full.png...');
  await desktopPage.locator('#tab-die').click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '03_die_full.png') });

  // 04: Feature Large
  console.log('Capturing 04_feature_large.png...');
  await desktopPage.locator('#tab-feature').click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '04_feature_large.png') });

  // Patterning Section
  const patterningSection = desktopPage.locator('#patterning-lesson');
  await patterningSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(400);

  // 05: Patterning Coat (Step 1)
  console.log('Capturing 05_patterning_coat.png...');
  await desktopPage.getByRole('button', { name: /Resist Coat/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '05_patterning_coat.png') });

  // 06: Patterning Exposure (Step 2)
  console.log('Capturing 06_patterning_exposure.png...');
  await desktopPage.getByRole('button', { name: /Optical Exposure/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '06_patterning_exposure.png') });

  // 07: Patterning Develop (Step 4)
  console.log('Capturing 07_patterning_develop.png...');
  await desktopPage.getByRole('button', { name: /Aqueous Development/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '07_patterning_develop.png') });

  // 08: Patterning Etch (Step 5)
  console.log('Capturing 08_patterning_etch.png...');
  await desktopPage.getByRole('button', { name: /Etch Transfer/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '08_patterning_etch.png') });

  // 09: Patterning Strip (Step 6)
  console.log('Capturing 09_patterning_strip.png...');
  await desktopPage.getByRole('button', { name: /Resist Strip/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '09_patterning_strip.png') });

  // 10: CD
  console.log('Capturing 10_cd.png...');
  const cdCard = desktopPage.locator('#term-cd');
  await cdCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '10_cd.png') });

  // 11: Overlay
  console.log('Capturing 11_overlay.png...');
  const overlayCard = desktopPage.locator('#term-overlay');
  await overlayCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '11_overlay.png') });

  // 12: Yield
  console.log('Capturing 12_yield.png...');
  const yieldCard = desktopPage.locator('#term-yield');
  await yieldCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '12_yield.png') });

  // DUV / EUV Section
  const duvEuvSection = desktopPage.locator('#duv-vs-euv');
  await duvEuvSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);

  // 13: DUV Default
  console.log('Capturing 13_duv_default.png...');
  await duvEuvSection.getByRole('button', { name: /DUV \(193 nm Refractive\)/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '13_duv_default.png') });

  // 14: DUV Engineering
  console.log('Capturing 14_duv_engineering.png...');
  const engViewBtn = duvEuvSection.getByRole('button', { name: /Engineering View/i });
  if (await engViewBtn.isVisible()) {
    await engViewBtn.click();
    await desktopPage.waitForTimeout(500);
  }
  await desktopPage.screenshot({ path: path.join(artifactDir, '14_duv_engineering.png') });

  // 15: EUV Default
  console.log('Capturing 15_euv_default.png...');
  // Toggle back to intuitive view
  const intuitiveBtn = duvEuvSection.getByRole('button', { name: /Intuitive View/i });
  if (await intuitiveBtn.isVisible()) {
    await intuitiveBtn.click();
    await desktopPage.waitForTimeout(300);
  }
  await duvEuvSection.getByRole('button', { name: /EUV \(13.5 nm Reflective\)/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '15_euv_default.png') });

  // 16: EUV Engineering
  console.log('Capturing 16_euv_engineering.png...');
  const engViewBtnEuv = duvEuvSection.getByRole('button', { name: /Engineering View/i });
  if (await engViewBtnEuv.isVisible()) {
    await engViewBtnEuv.click();
    await desktopPage.waitForTimeout(500);
  }
  await desktopPage.screenshot({ path: path.join(artifactDir, '16_euv_engineering.png') });

  // Process Verbs Section
  const verbsSection = desktopPage.locator('#process-verbs');
  await verbsSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);

  // 17: Process ADD
  console.log('Capturing 17_process_add.png...');
  await desktopPage.getByRole('button', { name: /ADD/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '17_process_add.png') });

  // 18: Process FLATTEN
  console.log('Capturing 18_process_flatten.png...');
  await desktopPage.getByRole('button', { name: /FLATTEN/i }).click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({ path: path.join(artifactDir, '18_process_flatten.png') });

  await desktopPage.close();
  await desktopContext.close();

  // ─────────────────────────────────────────────────────────────
  // 2. MOBILE JOURNEY (390x844)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- Capturing 7 Mobile Keyframes (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.setDefaultTimeout(15000);

  await mobilePage.goto(basicsUrl, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1000);

  // mobile_01_wafer
  console.log('Capturing mobile_01_wafer.png...');
  await mobilePage.locator('#scale-viewer').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(artifactDir, 'mobile_01_wafer.png') });

  // mobile_02_field
  console.log('Capturing mobile_02_field.png...');
  await mobilePage.locator('#tab-field').click({ force: true });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(artifactDir, 'mobile_02_field.png') });

  // mobile_03_die
  console.log('Capturing mobile_03_die.png...');
  await mobilePage.locator('#tab-die').click({ force: true });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(artifactDir, 'mobile_03_die.png') });

  // mobile_04_feature
  console.log('Capturing mobile_04_feature.png...');
  await mobilePage.locator('#tab-feature').click({ force: true });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(artifactDir, 'mobile_04_feature.png') });

  // mobile_05_patterning
  console.log('Capturing mobile_05_patterning.png...');
  await mobilePage.locator('#patterning-lesson').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(artifactDir, 'mobile_05_patterning.png') });

  // mobile_06_cd
  console.log('Capturing mobile_06_cd.png...');
  await mobilePage.locator('#term-cd').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(artifactDir, 'mobile_06_cd.png') });

  // mobile_07_duv
  console.log('Capturing mobile_07_duv.png...');
  await mobilePage.locator('#duv-vs-euv').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(artifactDir, 'mobile_07_duv.png') });

  await mobilePage.close();
  await mobileContext.close();

  // Generate Contact Sheet
  await generateContactSheet();
  await browser.close();

  console.log('\n=== VF-014.3 Review Capture Complete ===');
}

run().catch((err) => {
  console.error('Fatal error during VF-014.3 capture:', err);
  process.exit(1);
});
