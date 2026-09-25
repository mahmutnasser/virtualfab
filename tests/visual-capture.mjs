import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop capture
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  // Go to app
  await page.goto('http://127.0.0.1:5173/');
  await page.waitForLoadState('networkidle');

  // Click "Explore Virtual Fab" or navigate to virtual fab
  const enterFabBtn = page.getByRole('button', { name: /Explore Virtual Fab/i });
  if (await enterFabBtn.isVisible()) {
    await enterFabBtn.click();
    await page.waitForTimeout(500);
  }

  // Open station 'repeat' directly via store injection with patterned wafer from Cycle 1
  await page.evaluate(() => {
    localStorage.setItem('SILICON_JOURNEY_FAB_V2', JSON.stringify({
      schemaVersion: 2,
      fabProgress: {
        setupCompleted: true,
        completedOperationIds: ['deposition', 'coat', 'lithography', 'develop', 'etch', 'strip'],
        completedCheckpointIds: ['adi', 'aei'],
        selectedNodeId: 'repeat'
      },
      completedStepIds: ['deposition', 'coat', 'lithography', 'develop', 'etch', 'strip'],
      selectedNodeId: 'repeat',
      wafer: {
        currentStepId: 'strip',
        layers: [
          {
            id: 'silicon-substrate',
            material: 'silicon',
            name: 'Silicon Substrate (Si)',
            chemicalFormula: 'Si',
            thicknessNm: 775000,
            thicknessLabel: '~775 µm',
            relativeHeight: 40,
            presenceMask: Array(16).fill(true),
            color: '#5A6B7C',
            patternType: 'crosshatch'
          },
          {
            id: 'oxide-film',
            material: 'oxide',
            name: 'Silicon Dioxide (SiO₂)',
            chemicalFormula: 'SiO₂',
            thicknessNm: 100,
            thicknessLabel: '~100 nm (illustrative)',
            relativeHeight: 32,
            presenceMask: [
              true, true, true, true,
              false, false, false, false,
              false, false, false, false,
              true, true, true, true,
            ],
            color: '#93C5FD',
            patternType: 'dots'
          }
        ]
      }
    }));
  });

  // Reload to pick up state
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Click station repeat in process map
  const repeatPill = page.getByText(/Multi-Layer & Repeat|Repeat/i).first();
  if (await repeatPill.isVisible()) {
    await repeatPill.click();
    await page.waitForTimeout(400);
  }

  // Look for "Open in Wafer Lab" button
  const launchLabBtn = page.getByRole('button', { name: /Open Wafer Lab|Launch Multi-Layer Wafer Lab/i });
  if (await launchLabBtn.isVisible()) {
    await launchLabBtn.click();
    await page.waitForTimeout(600);
  }

  // Capture pre-execution (prediction phase)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'multilayer_01_prediction_desktop.png'),
    fullPage: true,
  });

  // Select prediction option
  const predOption = page.getByRole('radio', { name: /A single layer cannot route overlapping electrical signals/i });
  if (await predOption.isVisible()) {
    await predOption.click();
    await page.waitForTimeout(300);
  }

  // Click "Build Multi-Layer Interconnect Stack"
  const runBtn = page.getByRole('button', { name: /Build Multi-Layer Interconnect Stack/i });
  if (await runBtn.isVisible()) {
    await runBtn.click();
    await page.waitForTimeout(1000);
  }

  // Capture post-execution multi-layer 3D stack
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'multilayer_02_executed_stack_desktop.png'),
    fullPage: true,
  });

  // Click on "M1 & CMP" inspector tab
  const m1Tab = page.getByRole('tab', { name: /M1 & CMP/i });
  if (await m1Tab.isVisible()) {
    await m1Tab.click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'multilayer_03_m1_cmp_highlight_desktop.png'),
      fullPage: true,
    });
  }

  // Click on "ILD & Vias" inspector tab
  const ildTab = page.getByRole('tab', { name: /ILD & Vias/i });
  if (await ildTab.isVisible()) {
    await ildTab.click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'multilayer_04_ild_vias_highlight_desktop.png'),
      fullPage: true,
    });
  }

  // Click on "M2 Routing" inspector tab
  const m2Tab = page.getByRole('tab', { name: /M2 Routing/i });
  if (await m2Tab.isVisible()) {
    await m2Tab.click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'multilayer_05_m2_routing_highlight_desktop.png'),
      fullPage: true,
    });
  }

  // 2. Mobile viewport capture
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://127.0.0.1:5173/#fab');
  await mobilePage.waitForLoadState('networkidle');

  await mobilePage.evaluate(() => {
    localStorage.setItem('SILICON_JOURNEY_FAB_V2', JSON.stringify({
      schemaVersion: 2,
      machineState: 'WAFER_LAB_PREDICTING',
      fabProgress: {
        setupCompleted: true,
        completedOperationIds: ['deposition', 'coat', 'lithography', 'develop', 'etch', 'strip'],
        completedCheckpointIds: ['adi', 'aei'],
        selectedNodeId: 'repeat'
      },
      completedStepIds: ['deposition', 'coat', 'lithography', 'develop', 'etch', 'strip'],
      selectedNodeId: 'repeat',
      selectedStepId: 'repeat',
      isProcessExecuted: true,
      wafer: {
        currentStepId: 'repeat',
        layers: [
          {
            id: 'silicon-substrate',
            material: 'silicon',
            name: 'Silicon Substrate (Si)',
            chemicalFormula: 'Si',
            thicknessNm: 775000,
            thicknessLabel: '~775 µm',
            relativeHeight: 40,
            presenceMask: Array(16).fill(true),
            color: '#5A6B7C',
            patternType: 'crosshatch'
          },
          {
            id: 'oxide-film',
            material: 'oxide',
            name: 'Silicon Dioxide (SiO₂)',
            chemicalFormula: 'SiO₂',
            thicknessNm: 100,
            thicknessLabel: '~100 nm (illustrative)',
            relativeHeight: 32,
            presenceMask: [
              true, true, true, true,
              false, false, false, false,
              false, false, false, false,
              true, true, true, true,
            ],
            color: '#93C5FD',
            patternType: 'dots'
          },
          {
            id: 'metal-m1',
            material: 'metal',
            name: 'Metal 1 Plugs & Contacts (Cu)',
            chemicalFormula: 'Cu',
            thicknessNm: 150,
            thicknessLabel: '~150 nm (illustrative)',
            relativeHeight: 36,
            presenceMask: Array(16).fill(true),
            color: '#D97706',
            patternType: 'stripes'
          },
          {
            id: 'oxide-ild',
            material: 'oxide',
            name: 'Inter-Layer Dielectric (ILD)',
            chemicalFormula: 'SiO₂',
            thicknessNm: 100,
            thicknessLabel: '~100 nm (illustrative)',
            relativeHeight: 32,
            presenceMask: Array(16).fill(true),
            color: '#B0D4E8',
            patternType: 'dots'
          },
          {
            id: 'metal-m2',
            material: 'metal',
            name: 'Metal 2 Interconnects (Cu)',
            chemicalFormula: 'Cu',
            thicknessNm: 200,
            thicknessLabel: '~200 nm (illustrative)',
            relativeHeight: 32,
            presenceMask: [
              false, true, true, true,
              true, false, true, true,
              true, true, false, true,
              true, true, true, false,
            ],
            color: '#F59E0B',
            patternType: 'stripes'
          }
        ]
      }
    }));
  });
  await mobilePage.reload();
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.waitForTimeout(600);
  console.log('Mobile buttons found:', await mobilePage.locator('button').allInnerTexts());

  const mobileLaunch = mobilePage.getByRole('button', { name: /Launch Multi-Layer Wafer Lab|Open Wafer Lab/i });
  if (await mobileLaunch.count() > 0) {
    await mobileLaunch.scrollIntoViewIfNeeded();
    await mobileLaunch.click();
    await mobilePage.waitForTimeout(800);
    console.log('Clicked mobileLaunch! New buttons:', await mobilePage.locator('button').allInnerTexts());
  }

  const mPred = mobilePage.getByRole('radio', { name: /A single layer cannot route overlapping electrical signals/i });
  if (await mPred.count() > 0) {
    await mPred.scrollIntoViewIfNeeded();
    await mPred.click();
    await mobilePage.waitForTimeout(300);

    const mRun = mobilePage.getByRole('button', { name: /Build Multi-Layer Interconnect Stack/i });
    if (await mRun.count() > 0) {
      await mRun.scrollIntoViewIfNeeded();
      await mRun.click();
      await mobilePage.waitForTimeout(1000);
    }
  }

  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await mobilePage.waitForTimeout(300);

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'multilayer_06_mobile_stack_top.png'),
  });

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'multilayer_06_mobile_stack.png'),
    fullPage: true,
  });

  await browser.close();
  console.log('Captures completed successfully.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
