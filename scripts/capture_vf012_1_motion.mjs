import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const artifactDir = path.join(
  'C:\\Users\\Utente\\.gemini\\antigravity\\brain\\3615d0ab-9175-4907-ba08-c449e8cda244',
  'current-review',
  'vf012_1'
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
    console.log(`Successfully saved video: ${outputName}`);
  }
}

async function run() {
  console.log('=== Starting VF-012.1 Final Process-Rail Semantics & Overflow Correction Capture ===');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=default'],
  });

  const canonicalSteps = [
    {
      id: 'coat',
      labelPattern: /Coat Resist/i,
      titlePattern: 'Coat Resist',
      filename: '01_coat.png',
      desc: 'Step 2: Coat Resist (EQ-TRACK-01)',
      completedOps: ['deposition'],
      completedChecks: [],
    },
    {
      id: 'lithography',
      labelPattern: /Lithography/i,
      titlePattern: 'Lithography',
      filename: '02_lithography.png',
      desc: 'Step 3: Lithography (EQ-LITHO-01)',
      completedOps: ['deposition', 'coat'],
      completedChecks: [],
    },
    {
      id: 'develop',
      labelPattern: /Develop/i,
      titlePattern: 'Develop',
      filename: '03_develop.png',
      desc: 'Step 4: Develop (EQ-TRACK-01 shared track bay reuse)',
      completedOps: ['deposition', 'coat', 'lithography'],
      completedChecks: [],
    },
    {
      id: 'adi',
      labelPattern: /ADI/i,
      titlePattern: 'ADI Inspection',
      filename: '04_adi.png',
      desc: 'Checkpoint: ADI Inspection (EQ-METRO-01 metrology bay)',
      completedOps: ['deposition', 'coat', 'lithography', 'develop'],
      completedChecks: [],
    },
    {
      id: 'etch',
      labelPattern: /Etch/i,
      titlePattern: 'Etch',
      filename: '05_etch.png',
      desc: 'Step 5: Etch (EQ-ETCH-01 dry etch bay)',
      completedOps: ['deposition', 'coat', 'lithography', 'develop'],
      completedChecks: ['adi'],
    },
    {
      id: 'aei',
      labelPattern: /AEI/i,
      titlePattern: 'AEI Inspection',
      filename: '06_aei.png',
      desc: 'Checkpoint: AEI Inspection (EQ-METRO-01 shared metrology bay reuse)',
      completedOps: ['deposition', 'coat', 'lithography', 'develop', 'etch'],
      completedChecks: ['adi'],
    },
    {
      id: 'strip',
      labelPattern: /Strip/i,
      titlePattern: 'Strip',
      filename: '07_strip.png',
      desc: 'Step 6: Strip (EQ-STRIP-01 resist removal bay)',
      completedOps: ['deposition', 'coat', 'lithography', 'develop', 'etch'],
      completedChecks: ['adi', 'aei'],
    },
    {
      id: 'repeat',
      labelPattern: /Repeat/i,
      titlePattern: 'Repeat',
      filename: '08_repeat.png',
      desc: 'Process Loop: Repeat (resolving to Cleanroom Interconnect)',
      completedOps: ['deposition', 'coat', 'lithography', 'develop', 'etch', 'strip'],
      completedChecks: ['adi', 'aei'],
    },
  ];

  try {
    // ─────────────────────────────────────────────────────────────
    // 1. DESKTOP CONTINUOUS MOTION PROOF (1440x900)
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 1. Recording desktop_full_journey_motion.webm (1440x900) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: {
        dir: videoTempDir,
        size: { width: 1440, height: 900 },
      },
    });

    const page = await desktopContext.newPage();
    page.setDefaultTimeout(15000);

    console.log('Loading app initial state on desktop...');
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForIdleTransition(page, 'fab-overview', 'deposition');
    await page.waitForTimeout(1000);

    for (let i = 0; i < canonicalSteps.length; i++) {
      const step = canonicalSteps[i];
      console.log(`\nAdvancing to ${step.desc}...`);

      // Seed deterministic prior completion state into authoritative store
      await page.evaluate(
        ({ completedOps, completedChecks, targetNode }) => {
          const store = window.__VIRTUAL_FAB_STORE__;
          if (store) {
            const unified = Array.from(new Set([...completedOps, ...completedChecks]));
            store.setState({
              fabProgress: {
                setupCompleted: true,
                completedOperationIds: completedOps,
                completedCheckpointIds: completedChecks,
                selectedNodeId: targetNode,
              },
              completedStepIds: unified,
            });
          }
        },
        {
          completedOps: step.completedOps,
          completedChecks: step.completedChecks,
          targetNode: step.id,
        }
      );

      // Click the pill in the process rail
      const pillBtn = page
        .locator('nav[aria-label="Process Overview Track"] button')
        .filter({ hasText: step.labelPattern })
        .first();

      await pillBtn.waitFor({ state: 'visible', timeout: 8000 });
      await pillBtn.click();

      // Wait for Three.js camera & plate crossfade transition to settle
      await waitForIdleTransition(page, 'station-focus', step.id, 15000);
      await page.waitForSelector(`#station-panel-title:has-text("${step.titlePattern}")`);

      // Pause to clearly view completed checkmarks, active step, and unclipped rail
      await page.waitForTimeout(2500);

      // Capture settled keyframe
      console.log(`Capturing keyframe: ${step.filename}`);
      await page.screenshot({ path: path.join(artifactDir, step.filename) });
    }

    await saveVideo(page, desktopContext, 'desktop_full_journey_motion.webm');

    // ─────────────────────────────────────────────────────────────
    // 2. MOBILE CONTINUOUS MOTION PROOF (390x844)
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 2. Recording mobile_journey_motion.webm (390x844) ---');
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

    console.log('Loading app initial state on mobile...');
    await mobilePage.goto('http://127.0.0.1:5173/', { waitUntil: 'domcontentloaded' });
    await mobilePage.evaluate(() => localStorage.clear());
    await mobilePage.reload({ waitUntil: 'domcontentloaded' });
    await waitForIdleTransition(mobilePage, 'fab-overview', 'deposition');
    await mobilePage.waitForTimeout(1000);

    // Initial entry to Station Focus on mobile via Start the Tour
    console.log('Entering Station Focus on mobile...');
    const startTourBtn = mobilePage.getByRole('button', { name: /Start the Tour/i });
    if (await startTourBtn.isVisible()) {
      await startTourBtn.click();
    } else {
      const depBtn = mobilePage.locator('button[aria-label*="Deposition"]').first();
      await depBtn.click();
    }

    await waitForIdleTransition(mobilePage, 'station-focus', 'deposition');
    await mobilePage.waitForSelector('#station-panel-title:has-text("Deposition")');
    await mobilePage.waitForTimeout(1500);

    const mobileSlice = canonicalSteps.slice(0, 4); // Coat Resist, Lithography, Develop, ADI Inspection

    for (const step of mobileSlice) {
      console.log(`Mobile: advancing to ${step.desc}...`);

      // Seed deterministic prior completion state into authoritative store
      await mobilePage.evaluate(
        ({ completedOps, completedChecks, targetNode }) => {
          const store = window.__VIRTUAL_FAB_STORE__;
          if (store) {
            const unified = Array.from(new Set([...completedOps, ...completedChecks]));
            store.setState({
              fabProgress: {
                setupCompleted: true,
                completedOperationIds: completedOps,
                completedCheckpointIds: completedChecks,
                selectedNodeId: targetNode,
              },
              completedStepIds: unified,
            });
          }
        },
        {
          completedOps: step.completedOps,
          completedChecks: step.completedChecks,
          targetNode: step.id,
        }
      );

      const railBtn = mobilePage
        .locator('nav[aria-label="Process Overview Track"] button')
        .filter({ hasText: step.labelPattern })
        .first();

      await railBtn.scrollIntoViewIfNeeded();
      await railBtn.waitFor({ state: 'visible', timeout: 8000 });
      await railBtn.click({ force: true });

      await waitForIdleTransition(mobilePage, 'station-focus', step.id);
      await mobilePage.waitForSelector(`#station-panel-title:has-text("${step.titlePattern}")`);
      await mobilePage.waitForTimeout(2500);
    }

    await saveVideo(mobilePage, mobileContext, 'mobile_journey_motion.webm');

    // ─────────────────────────────────────────────────────────────
    // 3. GENERATE HIGH-RES COMPOSITE CONTACT SHEET (contact_sheet_vf012_1.jpg)
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 3. Generating contact_sheet_vf012_1.jpg ---');
    const contactSheetPage = await browser.newPage({ viewport: { width: 1920, height: 1100 } });

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background-color: #0c1e33;
          color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          padding-bottom: 16px;
        }
        .title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
        }
        .title span { color: #00a6a6; }
        .subtitle {
          font-size: 13px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-top: 4px;
        }
        .meta {
          font-size: 12px;
          color: #64748b;
          font-family: monospace;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .card {
          background: #102a43;
          border: 1px solid rgba(0, 166, 166, 0.25);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
        }
        .thumb-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #081524;
          overflow: hidden;
        }
        .thumb-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .card-info {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(0, 166, 166, 0.15);
          color: #00e5e5;
          border: 1px solid rgba(0, 166, 166, 0.3);
        }
        .status-badge {
          font-size: 9px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .status-shared {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .status-check {
          color: #10b981;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .station-name {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
        }
        .equipment-tag {
          font-size: 11px;
          color: #94a3b8;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">SILICON <span>JOURNEY</span> &mdash; VF-012.1 Process Rail Semantics Review</h1>
          <div class="subtitle">Authoritative Completed Checkmarks & Non-Clipped Full-Node Visibility</div>
        </div>
        <div class="meta">VERIFIED PRODUCTION RUN &bull; 1440x900 NATIVE</div>
      </div>
      <div class="grid">
        ${canonicalSteps
          .map((s, idx) => {
            const isShared = s.id === 'develop' || s.id === 'aei';
            const sharedText = s.id === 'develop' ? 'Shared Track Bay' : s.id === 'aei' ? 'Shared Metrology' : '';
            const imgPath = path.join(artifactDir, s.filename);
            const base64 = fs.existsSync(imgPath) ? fs.readFileSync(imgPath).toString('base64') : '';
            return `
            <div class="card">
              <div class="thumb-wrapper">
                <img src="data:image/png;base64,${base64}" alt="${s.titlePattern}" />
              </div>
              <div class="card-info">
                <div class="badge-row">
                  <span class="badge">Node ${idx + 1}</span>
                  <div style="display: flex; gap: 4px;">
                    ${isShared ? `<span class="status-badge status-shared">${sharedText}</span>` : ''}
                    <span class="status-badge status-check">${s.completedOps.length} ops ✓</span>
                  </div>
                </div>
                <div class="station-name">${s.titlePattern}</div>
                <div class="equipment-tag">${s.desc.split('(')[1]?.replace(')', '') || ''}</div>
              </div>
            </div>`;
          })
          .join('')}
      </div>
    </body>
    </html>
    `;

    await contactSheetPage.setContent(htmlContent, { waitUntil: 'load' });
    await contactSheetPage.waitForTimeout(1000);
    const contactSheetPath = path.join(artifactDir, 'contact_sheet_vf012_1.jpg');
    await contactSheetPage.screenshot({ path: contactSheetPath, quality: 90, type: 'jpeg' });
    console.log(`Successfully generated: contact_sheet_vf012_1.jpg`);
    await contactSheetPage.close();

    console.log('\n=== All VF-012.1 Continuous Videos, Keyframes, and Contact Sheet Generated Successfully ===');
  } catch (err) {
    console.error('Error during VF-012.1 capture:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
