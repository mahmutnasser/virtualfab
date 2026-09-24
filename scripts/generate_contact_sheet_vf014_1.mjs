import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.join(
  'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\3615d0ab-9175-4907-ba08-c449e8cda244',
  'current-review',
  'vf014_1'
);

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

async function generateContactSheet() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1600 } });

  const cardHtml = frames.map(f => {
    const filePath = path.join(artifactDir, f.file);
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
      ${cardHtml}
    </div>
  </body>
  </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(artifactDir, 'contact_sheet_vf014_1.jpg'),
    type: 'jpeg',
    quality: 92,
    fullPage: true,
  });

  console.log('Successfully generated contact_sheet_vf014_1.jpg with base64 embedded images');
  await browser.close();
}

generateContactSheet().catch(err => {
  console.error(err);
  process.exit(1);
});
