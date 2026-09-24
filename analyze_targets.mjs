import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';

async function analyze() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Load fab_overview and deposition to check dimensions and layout
  const html = `
    <html>
      <body>
        <canvas id="c"></canvas>
      </body>
    </html>
  `;
  await page.setContent(html);

  const result = await page.evaluate(async (dir) => {
    function loadImg(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    const files = [
      'visual-targets/overview.png',
      'visual-targets/deposition.png',
      'visual-targets/lithography.png',
      'visual-targets/metrology-adi.png',
      'clean_track_system_1790107545549.jpg',
      'clean_etch_tool_1790107565883.jpg',
    ];

    const stats = [];
    for (const f of files) {
      // convert to file URL or data URL
      // We will read via fetch from local or base64
      stats.push({ name: f });
    }
    return stats;
  }, ARTIFACT_DIR);

  console.log(result);
  await browser.close();
}

analyze();
