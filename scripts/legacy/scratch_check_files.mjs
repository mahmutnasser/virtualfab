import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const files = [
    path.join(ARTIFACT_DIR, 'visual-targets/overview.png'),
    path.join(ARTIFACT_DIR, 'visual-targets/deposition.png'),
    path.join(ARTIFACT_DIR, 'visual-targets/lithography.png'),
    path.join(ARTIFACT_DIR, 'visual-targets/metrology-adi.png'),
    path.join(ARTIFACT_DIR, 'clean_track_system_1790107545549.jpg'),
    path.join(ARTIFACT_DIR, 'clean_etch_tool_1790107565883.jpg'),
    'C:/Users/Utente/Desktop/Virtual Fab/virtual-fab/public/images/plates/fab_overview.jpg'
  ];

  for (const f of files) {
    if (fs.existsSync(f)) {
      const stat = fs.statSync(f);
      console.log(`Exists: ${path.basename(f)} (${stat.size} bytes)`);
    } else {
      console.log(`NOT found: ${f}`);
    }
  }

  await browser.close();
}

check();
