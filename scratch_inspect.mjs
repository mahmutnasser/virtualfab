import { chromium } from '@playwright/test';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const files = [
    'public/images/cleanroom-bg.jpg',
    'public/images/plates/fab_overview.jpg',
    'public/images/plates/deposition.jpg',
    'public/images/plates/lithography.jpg',
    'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244/visual-targets/metrology-adi.png',
    'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244/visual-targets/fallback.png',
  ];
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const buf = fs.readFileSync(f);
    const mime = f.endsWith('.png') ? 'image/png' : 'image/jpeg';
    await page.setContent(`<img id="i" src="data:${mime};base64,${buf.toString('base64')}">`);
    const dims = await page.evaluate(() => ({
      w: document.getElementById('i').naturalWidth,
      h: document.getElementById('i').naturalHeight,
    }));
    console.log(f, dims);
  }
  await browser.close();
}
main().catch(console.error);
