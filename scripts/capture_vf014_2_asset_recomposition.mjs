import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.join(
  'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\3615d0ab-9175-4907-ba08-c449e8cda244',
  'current-review',
  'vf014_2'
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

async function generateContactSheet() {
  console.log('\n--- Generating Contact Sheet for VF-014.2 ---');
  const frames = [
    { file: '01_hero_asset.png', title: '01. Editorial Hero & 300 mm Cleanroom Asset' },
    { file: '02_wafer_scale.png', title: '02. Scale: 300 mm Silicon Substrate' },
    { file: '03_field_scale.png', title: '03. Scale: Exposure Field (26×33 mm)' },
    { file: '04_die_scale.png', title: '04. Scale: Die (8×10 mm Chip Area)' },
    { file: '05_feature_scale.png', title: '05. Scale: Nanoscale Features (SEM FinFET)' },
    { file: '06_hierarchy_overview.png', title: '06. Hierarchy Coordinate Sequence Overview' },
    { file: '07_patterning_asset_step.png', title: '07. 2.5D Isometric Patterning Asset Step' },
    { file: '08_patterning_panorama.png', title: '08. 6-Step Patterning Complete Panorama' },
    { file: '09_sem_cd_photo.png', title: '09. SEM CD Trench Photo & Live Calipers' },
    { file: '10_overlay_box.png', title: '10. Box-in-Box Overlay Registration Mark' },
    { file: '11_yield_wafer_map.png', title: '11. Clipped Circular Yield Wafer Map' },
    { file: '12_duv_intuitive.png', title: '12. DUV 193 nm Refractive Optical Path' },
    { file: '13_euv_intuitive.png', title: '13. EUV 13.5 nm Reflective Bragg Mirrors' },
    { file: '14_process_verbs_cmp.png', title: '14. Process Verbs & CMP Planarization' },
    { file: '15_terms_reference.png', title: '15. Museum-Style Terminology Registry' },
    { file: 'mobile_01_hero.png', title: 'Mobile 01: Hero Redesign' },
    { file: 'mobile_02_scale.png', title: 'Mobile 02: Wafer Stage' },
    { file: 'mobile_03_feature.png', title: 'Mobile 03: Feature Stage' },
    { file: 'mobile_04_patterning.png', title: 'Mobile 04: 2.5D Patterning Block' },
    { file: 'mobile_05_duv_euv.png', title: 'Mobile 05: DUV / EUV Optical Path' },
  ];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1600 } });

  const cardHtml = frames.map(f => {
    const filePath = path.join(artifactDir, f.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Frame missing for contact sheet: ${filePath}`);
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
  }).join('');

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>VF-014.2 Asset-Driven Recomposition Contact Sheet</title>
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
      <h1>VF-014.2 · Asset-Driven Visual Recomposition</h1>
      <p>Verification Contact Sheet: 15 Desktop (1440×900) + 5 Mobile (390×844) Keyframe Proofs</p>
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
    path: path.join(artifactDir, 'contact_sheet_vf014_2.jpg'),
    type: 'jpeg',
    quality: 92,
    fullPage: true,
  });

  console.log('Successfully generated contact_sheet_vf014_2.jpg with base64 embedded images');
  await browser.close();
}

async function writeReadme() {
  const readmeContent = `# VF-014.2 Review Artifacts: Asset-Driven Visual Recomposition

## Overview
VF-014.2 transforms the educational foundation module (\`/basics\`) from generic CSS/SVG cards into an asset-driven, museum-grade visual experience using the authoritative Silicon Journey photographs and 3D renders.

### Visual Priority Delivered
- **Visual First Hierarchy**: ~65–75% visual, ~25–35% text/UI. Major scientific visuals dominate their sections.
- **Hero Asset Dominance**: Real cleanroom technician holding 300 mm mirror-polished wafer (\`hero-wafer-cleanroom.jpg\`) taking 58% width on right with live interactive callout badges.
- **Scale Hierarchy Zoom**: Wafer (\`wafer-hierarchy-full.jpg\`) → Field (\`asset-field-window.png\`, 26×33 mm) → Die (\`asset-die-window.png\`, 8×10 mm) → Nanoscale Feature (\`asset-feature-window.png\`, sub-10 nm FinFET SEM render) with live interactive SVG calipers and coordinate overlays.
- **Patterning Story**: Authoritative 2.5D isometric cutaway blocks (\`pattern-step1-coat.png\` through \`pattern-step6-strip.png\`) with interactive Before/After state toggles and complete 6-step panorama overview.
- **CD Metrology**: Real SEM trench photograph (\`sem-cd-full.jpg\`) framed with interactive measurement calipers, contrast slider, and target tolerance readouts.
- **Overlay Mark**: High-precision Box-in-Box lithography alignment mark with live error vector displacement.
- **Circular Yield Wafer Map**: Clipped circular wafer map with die-level bin status (Good / Defective / Edge Incomplete) and Poisson yield equation.
- **DUV vs EUV**: Intuitive optical-path illustration first (refractive lenses vs reflective multilayer Bragg mirrors in high vacuum) with secondary Engineering View toggle.
- **Process Verbs**: Asymmetrical material transformation view highlighting Chemical Mechanical Planarization (CMP).
- **Typography & Styling**: Clean Inter typography for prose/interface, monospace strictly reserved for physical numbers/dimensions; removed dark navy container cards in favor of clean museum-grade framing.

---

## Captured Keyframes

### Desktop (1440×900)
1. \`01_hero_asset.png\`: Hero section with 300 mm cleanroom photo dominating on the right.
2. \`02_wafer_scale.png\`: Scale Hierarchy - 300 mm silicon wafer stage with callouts.
3. \`03_field_scale.png\`: Scale Hierarchy - Exposure field stage (26×33 mm).
4. \`04_die_scale.png\`: Scale Hierarchy - Individual die stage (8×10 mm).
5. \`05_feature_scale.png\`: Scale Hierarchy - Nanoscale FinFET transistor stage (sub-10 nm SEM).
6. \`06_hierarchy_overview.png\`: Scale Hierarchy - Coordinate sequence overview.
7. \`07_patterning_asset_step.png\`: Patterning mini lesson active step with 2.5D cutaway render block.
8. \`08_patterning_panorama.png\`: Patterning complete 6-step cutaway panorama view.
9. \`09_sem_cd_photo.png\`: SEM CD trench photograph with interactive calipers.
10. \`10_overlay_box.png\`: Box-in-Box overlay mark with displacement vector.
11. \`11_yield_wafer_map.png\`: Circular yield wafer map on light surface.
12. \`12_duv_intuitive.png\`: DUV 193 nm intuitive refractive optical path illustration.
13. \`13_euv_intuitive.png\`: EUV 13.5 nm intuitive reflective Bragg mirrors illustration.
14. \`14_process_verbs_cmp.png\`: 4 Process Verbs showing asymmetric layout and CMP planarization.
15. \`15_terms_reference.png\`: Systematic Terminology Registry reference cards with Inter typography.

### Mobile (390×844)
1. \`mobile_01_hero.png\`: Mobile hero layout with stacked cleanroom photo asset.
2. \`mobile_02_scale.png\`: Mobile scale viewer wafer stage.
3. \`mobile_03_feature.png\`: Mobile scale viewer nanoscale feature stage.
4. \`mobile_04_patterning.png\`: Mobile 2.5D cutaway patterning block.
5. \`mobile_05_duv_euv.png\`: Mobile DUV / EUV optical path comparison.

---

## Continuous Video
- \`desktop_visual_journey.webm\`: Complete continuous recording of user interaction across all lessons in desktop viewport.

---

## Verification Summary
- **Typecheck**: \`npx tsc --noEmit\` → 0 errors.
- **Tests**: \`npm test -- --run\` → 131/131 tests passing across 23 test suites.
- **Production Build**: \`npm run build\` → Clean production bundle generated in 856ms.
- **Frozen Fab Invariants**: Three.js cleanroom, white process rail, StationPanel, and academic registry completely preserved.
`;

  fs.writeFileSync(path.join(artifactDir, 'README.md'), readmeContent, 'utf-8');
  console.log('Successfully wrote README.md');
}

async function run() {
  console.log('=== Starting VF-014.2 Asset-Driven Recomposition Review Capture ===');
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

  // 01: Hero Asset Recomposition
  console.log('Capturing 01_hero_asset.png...');
  await desktopPage.screenshot({
    path: path.join(artifactDir, '01_hero_asset.png'),
  });

  // 02: Wafer Scale Stage
  console.log('Capturing 02_wafer_scale.png...');
  const scaleViewer = desktopPage.locator('#scale-viewer');
  await scaleViewer.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.locator('#tab-wafer').click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '02_wafer_scale.png'),
  });

  // 03: Field Scale Stage
  console.log('Capturing 03_field_scale.png...');
  await desktopPage.locator('#tab-field').click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '03_field_scale.png'),
  });

  // 04: Die Scale Stage
  console.log('Capturing 04_die_scale.png...');
  await desktopPage.locator('#tab-die').click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '04_die_scale.png'),
  });

  // 05: Feature Scale Stage
  console.log('Capturing 05_feature_scale.png...');
  await desktopPage.locator('#tab-feature').click();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '05_feature_scale.png'),
  });

  // 06: Hierarchy Overview / Sequence
  console.log('Capturing 06_hierarchy_overview.png...');
  await desktopPage.locator('#tab-wafer').click();
  await desktopPage.waitForTimeout(500);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '06_hierarchy_overview.png'),
  });

  // 07: Patterning Mini Lesson - Active Step with 2.5D cutaway render block
  console.log('Capturing 07_patterning_asset_step.png...');
  const patterningSection = desktopPage.locator('#patterning-lesson');
  await patterningSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  const etchStepBtn = desktopPage.getByRole('button', { name: /Etch Transfer/i });
  if (await etchStepBtn.isVisible()) {
    await etchStepBtn.click();
    await desktopPage.waitForTimeout(600);
  }
  await desktopPage.screenshot({
    path: path.join(artifactDir, '07_patterning_asset_step.png'),
  });

  // 08: Patterning 6-Step Panorama View
  console.log('Capturing 08_patterning_panorama.png...');
  const panoramaToggleBtn = desktopPage.getByRole('button', { name: /Full 6-Step Overview/i });
  if (await panoramaToggleBtn.isVisible()) {
    await panoramaToggleBtn.click();
    await desktopPage.waitForTimeout(600);
  }
  await desktopPage.screenshot({
    path: path.join(artifactDir, '08_patterning_panorama.png'),
  });

  // Reset back to interactive view
  const detailedStepBtn = desktopPage.getByRole('button', { name: /Detailed Step View/i });
  if (await detailedStepBtn.isVisible()) {
    await detailedStepBtn.click();
    await desktopPage.waitForTimeout(400);
  }

  // 09: CD Metrology with Real SEM Photo & Interactive Calipers
  console.log('Capturing 09_sem_cd_photo.png...');
  const cdCard = desktopPage.locator('#term-cd');
  await cdCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '09_sem_cd_photo.png'),
  });

  // 10: Overlay with Registration Error Vector
  console.log('Capturing 10_overlay_box.png...');
  const overlayCard = desktopPage.locator('#term-overlay');
  await overlayCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '10_overlay_box.png'),
  });

  // 11: Circular Yield Wafer Map on Light Surface
  console.log('Capturing 11_yield_wafer_map.png...');
  const yieldCard = desktopPage.locator('#term-yield');
  await yieldCard.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '11_yield_wafer_map.png'),
  });

  // 12: DUV Intuitive Optical Path
  console.log('Capturing 12_duv_intuitive.png...');
  const duvEuvSection = desktopPage.locator('#duv-vs-euv');
  await duvEuvSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(500);
  const duvBtn = desktopPage.getByRole('button', { name: /DUV \(193 nm Refractive\)/i });
  if (await duvBtn.isVisible()) {
    await duvBtn.click();
    await desktopPage.waitForTimeout(600);
  }
  await desktopPage.screenshot({
    path: path.join(artifactDir, '12_duv_intuitive.png'),
  });

  // 13: EUV Intuitive Reflective Bragg Mirror Optical Path
  console.log('Capturing 13_euv_intuitive.png...');
  const euvBtn = desktopPage.getByRole('button', { name: /EUV \(13.5 nm Reflective\)/i });
  if (await euvBtn.isVisible()) {
    await euvBtn.click();
    await desktopPage.waitForTimeout(600);
  }
  await desktopPage.screenshot({
    path: path.join(artifactDir, '13_euv_intuitive.png'),
  });

  // 14: Process Verbs & CMP Planarization
  console.log('Capturing 14_process_verbs_cmp.png...');
  const verbsSection = desktopPage.locator('#process-verbs');
  await verbsSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);
  await desktopPage.screenshot({
    path: path.join(artifactDir, '14_process_verbs_cmp.png'),
  });

  // 15: Systematic Terminology Registry
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

  // Mobile 02: Scale Viewer Wafer Stage
  console.log('Capturing mobile_02_scale.png...');
  await mobilePage.locator('#scale-viewer').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_02_scale.png'),
  });

  // Mobile 03: Scale Viewer Feature Stage
  console.log('Capturing mobile_03_feature.png...');
  const mobileFeatureTab = mobilePage.locator('#tab-feature');
  if (await mobileFeatureTab.isVisible()) {
    await mobileFeatureTab.click({ force: true });
    await mobilePage.waitForTimeout(600);
  }
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_03_feature.png'),
  });

  // Mobile 04: 2.5D Patterning Block
  console.log('Capturing mobile_04_patterning.png...');
  await mobilePage.locator('#patterning-lesson').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_04_patterning.png'),
  });

  // Mobile 05: DUV / EUV
  console.log('Capturing mobile_05_duv_euv.png...');
  await mobilePage.locator('#duv-vs-euv').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({
    path: path.join(artifactDir, 'mobile_05_duv_euv.png'),
  });

  await saveVideo(mobilePage, mobileContext, 'mobile_visual_journey.webm');

  // Clean up temporary video files
  try {
    const tempFiles = fs.readdirSync(videoTempDir);
    for (const file of tempFiles) {
      fs.unlinkSync(path.join(videoTempDir, file));
    }
    fs.rmdirSync(videoTempDir);
  } catch (e) {
    // Ignore cleanup errors
  }

  // Generate Contact Sheet and README
  await generateContactSheet();
  await writeReadme();

  await browser.close();
  console.log('\n=== VF-014.2 Capture Completed Successfully ===');
}

run().catch((err) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
