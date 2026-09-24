import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';
const PUBLIC_PLATES = 'C:/Users/Utente/Desktop/Virtual Fab/virtual-fab/public/images/plates';

async function generateCleanPlates() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  function getBase64(filePath) {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${data.toString('base64')}`;
  }

  const overviewB64 = getBase64(path.join(PUBLIC_PLATES, 'fab_overview.jpg'));
  const startB64 = getBase64(path.join(ARTIFACT_DIR, 'start_handling_1790105138992.jpg'));
  const depB64 = getBase64(path.join(ARTIFACT_DIR, 'visual-targets/deposition.png'));
  const trackB64 = getBase64(path.join(ARTIFACT_DIR, 'clean_track_system_1790107545549.jpg'));
  const lithoB64 = getBase64(path.join(ARTIFACT_DIR, 'visual-targets/lithography.png'));
  const metroB64 = getBase64(path.join(ARTIFACT_DIR, 'visual-targets/metrology-adi.png'));
  const etchB64 = getBase64(path.join(ARTIFACT_DIR, 'clean_etch_tool_1790107565883.jpg'));
  const stripRawB64 = getBase64(path.join(ARTIFACT_DIR, 'photoreal_strip_tool_1790106282792.jpg'));

  await page.setContent('<html><body><canvas id="c"></canvas></body></html>');

  const processed = await page.evaluate(async (data) => {
    function loadImg(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    const [
      imgOverview,
      imgStart,
      imgDep,
      imgTrack,
      imgLitho,
      imgMetro,
      imgEtch,
      imgStripRaw
    ] = await Promise.all([
      loadImg(data.overviewB64),
      loadImg(data.startB64),
      loadImg(data.depB64),
      loadImg(data.trackB64),
      loadImg(data.lithoB64),
      loadImg(data.metroB64),
      loadImg(data.etchB64),
      loadImg(data.stripRawB64)
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // ── Function to inpaint/composite tool into master fab ──
    // Clears the top UI bar (y: 0 to 110) with feather to 145
    // Clears the right UI card (x: splitX to 1920) with feather of featherW
    function cleanAndComposite(machineImg, splitX, featherW = 160) {
      ctx.clearRect(0, 0, 1920, 1080);
      // Base: master cleanroom
      ctx.drawImage(imgOverview, 0, 0, 1920, 1080);

      // Temp canvas with machine
      const temp = document.createElement('canvas');
      temp.width = 1920;
      temp.height = 1080;
      const tctx = temp.getContext('2d');
      tctx.drawImage(machineImg, 0, 0, 1920, 1080);

      // Mask canvas (alpha channel)
      const mask = document.createElement('canvas');
      mask.width = 1920;
      mask.height = 1080;
      const mctx = mask.getContext('2d');

      // 1. Fill solid white (fully visible)
      mctx.fillStyle = '#ffffff';
      mctx.fillRect(0, 0, 1920, 1080);

      // 2. Remove top UI bar completely (y: 0 to 112) with vertical feather to 148
      mctx.globalCompositeOperation = 'destination-out';
      mctx.fillStyle = '#000000';
      mctx.fillRect(0, 0, 1920, 112); // completely cut top 112px

      const topGrad = mctx.createLinearGradient(0, 112, 0, 148);
      topGrad.addColorStop(0, 'rgba(0,0,0,1)');
      topGrad.addColorStop(1, 'rgba(0,0,0,0)');
      mctx.fillStyle = topGrad;
      mctx.fillRect(0, 112, 1920, 36);

      // 3. Remove right UI card (x: splitX to 1920) with horizontal feather
      mctx.fillStyle = '#000000';
      mctx.fillRect(splitX, 0, 1920 - splitX, 1080); // completely cut right of splitX

      const rightGrad = mctx.createLinearGradient(splitX - featherW, 0, splitX, 0);
      rightGrad.addColorStop(0, 'rgba(0,0,0,0)');
      rightGrad.addColorStop(1, 'rgba(0,0,0,1)');
      mctx.fillStyle = rightGrad;
      mctx.fillRect(splitX - featherW, 0, featherW, 1080);

      // Apply mask to temp
      tctx.globalCompositeOperation = 'destination-in';
      tctx.drawImage(mask, 0, 0);

      // Draw onto master cleanroom
      ctx.drawImage(temp, 0, 0);

      return canvas.toDataURL('image/jpeg', 0.96);
    }

    // 1. Overview (master cleanroom)
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(imgOverview, 0, 0, 1920, 1080);
    const plateOverview = canvas.toDataURL('image/jpeg', 0.96);

    // 2. Start (Wafer Load / FOUP Handling)
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(imgStart, 0, 0, 1920, 1080);
    const plateStart = canvas.toDataURL('image/jpeg', 0.96);

    // 3. Deposition (CVD cluster tool)
    const plateDep = cleanAndComposite(imgDep, 1220, 160);

    // 4. Track (Coater / Developer Track System)
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(imgTrack, 0, 0, 1920, 1080);
    const plateTrack = canvas.toDataURL('image/jpeg', 0.96);

    // 5. Lithography (DUV/EUV monolithic scanner)
    const plateLitho = cleanAndComposite(imgLitho, 1250, 160);

    // 6. Metrology (Inline optical inspection tool)
    const plateMetro = cleanAndComposite(imgMetro, 1140, 150);

    // 7. Etch (Reactive Ion Etch plasma system)
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(imgEtch, 0, 0, 1920, 1080);
    const plateEtch = canvas.toDataURL('image/jpeg', 0.96);

    // 8. Strip (Photoresist Strip Station)
    // Composite imgStripRaw: remove the walking person on right by blending into imgOverview from x=1150
    // and make the process chamber window solid opaque white cleanroom panels
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(imgOverview, 0, 0, 1920, 1080);

    const stripTemp = document.createElement('canvas');
    stripTemp.width = 1920;
    stripTemp.height = 1080;
    const sctx = stripTemp.getContext('2d');
    sctx.drawImage(imgStripRaw, 0, 0, 1920, 1080);

    // Replace the purple plasma glow window with solid opaque white cleanroom door panels
    // Window is at approx x: 575 to 625, y: 350 to 570
    sctx.fillStyle = '#f1f4f8';
    sctx.fillRect(575, 350, 52, 220);
    sctx.strokeStyle = '#cbd5e1';
    sctx.lineWidth = 1.5;
    sctx.strokeRect(575, 350, 52, 220);
    // Dark recessed handle
    sctx.fillStyle = '#334155';
    sctx.fillRect(618, 440, 5, 40);

    // Mask stripTemp: keep left up to x=1160, feather 1160..1320
    const stripMask = document.createElement('canvas');
    stripMask.width = 1920;
    stripMask.height = 1080;
    const smctx = stripMask.getContext('2d');
    smctx.fillStyle = '#ffffff';
    smctx.fillRect(0, 0, 1920, 1080);

    smctx.globalCompositeOperation = 'destination-out';
    smctx.fillStyle = '#000000';
    smctx.fillRect(1320, 0, 600, 1080); // cut walking person

    const stripGrad = smctx.createLinearGradient(1160, 0, 1320, 0);
    stripGrad.addColorStop(0, 'rgba(0,0,0,0)');
    stripGrad.addColorStop(1, 'rgba(0,0,0,1)');
    smctx.fillStyle = stripGrad;
    smctx.fillRect(1160, 0, 160, 1080);

    stripTemp.getContext('2d').globalCompositeOperation = 'destination-in';
    stripTemp.getContext('2d').drawImage(stripMask, 0, 0);

    ctx.drawImage(stripTemp, 0, 0);
    const plateStrip = canvas.toDataURL('image/jpeg', 0.96);

    return {
      overview: plateOverview,
      start: plateStart,
      deposition: plateDep,
      track: plateTrack,
      lithography: plateLitho,
      metrology: plateMetro,
      etch: plateEtch,
      strip: plateStrip,
    };
  }, {
    overviewB64,
    startB64,
    depB64,
    trackB64,
    lithoB64,
    metroB64,
    etchB64,
    stripRawB64
  });

  // Save the 8 individual clean environment plates into artifacts and public/images/plates/
  for (const [key, dataUrl] of Object.entries(processed)) {
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const buf = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(path.join(ARTIFACT_DIR, `vf010_6_clean_${key}.jpg`), buf);
    console.log(`Saved vf010_6_clean_${key}.jpg (${buf.length} bytes)`);
  }

  // Also build the CONTACT SHEET:
  // Overview | Start | Deposition | Track | Lithography | Metrology | Etch | Strip
  // 4 columns x 2 rows, or 8 in a row
  // 4 columns x 2 rows (each thumbnail 960x540 -> contact sheet 3840x1080 or 1920x1080)
  // Let's create a 4x2 grid on a 2560x1440 canvas with subtle clean labels (Tool Name only, no app UI)
  const contactSheetDataUrl = await page.evaluate(async (plates) => {
    function loadImg(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    const items = [
      { id: 'overview', title: '1. Overview (Cleanroom Aisle)', img: await loadImg(plates.overview) },
      { id: 'start', title: '2. Start (Wafer Load / FOUP Handling)', img: await loadImg(plates.start) },
      { id: 'deposition', title: '3. Deposition (CVD Cluster Tool)', img: await loadImg(plates.deposition) },
      { id: 'track', title: '4. Track (Coater / Developer System)', img: await loadImg(plates.track) },
      { id: 'lithography', title: '5. Lithography (DUV/EUV Scanner)', img: await loadImg(plates.lithography) },
      { id: 'metrology', title: '6. Metrology (Inline ADI/AEI Inspection)', img: await loadImg(plates.metrology) },
      { id: 'etch', title: '7. Etch (Dry Plasma RIE System)', img: await loadImg(plates.etch) },
      { id: 'strip', title: '8. Strip (Photoresist Strip Station)', img: await loadImg(plates.strip) },
    ];

    // Grid: 4 columns x 2 rows
    // Canvas: 2560 x 1440
    // Each cell: 640 x 360, image 610 x 320, padding 15px
    const c = document.createElement('canvas');
    c.width = 2560;
    c.height = 1520;
    const g = c.getContext('2d');

    // Clean neutral dark background for contact sheet presentation
    g.fillStyle = '#0a1017';
    g.fillRect(0, 0, 2560, 1520);

    // Header title banner
    g.fillStyle = '#ffffff';
    g.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    g.fillText('SILICON JOURNEY — ONE FAB VISUAL COHERENCE CONTACT SHEET (VF-010.6)', 50, 48);

    g.fillStyle = '#64748b';
    g.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    g.fillText('Physical Fab Consistency Evaluation • Single Cleanroom Environment • Zero Application UI • Natural 28-35mm Perspective', 50, 78);

    const cellW = 595;
    const cellH = 335;
    const startX = 50;
    const startY = 110;
    const gapX = 35;
    const gapY = 40;

    for (let i = 0; i < items.length; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = startX + col * (cellW + gapX);
      const y = startY + row * (cellH + gapY + 30);

      // Card frame
      g.strokeStyle = '#1e293b';
      g.lineWidth = 1;
      g.strokeRect(x - 2, y - 2, cellW + 4, cellH + 4);

      // Draw image
      g.drawImage(items[i].img, x, y, cellW, cellH);

      // Caption below image
      g.fillStyle = '#38bdf8';
      g.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      g.fillText(items[i].title, x, y + cellH + 24);
    }

    return c.toDataURL('image/jpeg', 0.95);
  }, processed);

  const csBase64 = contactSheetDataUrl.replace(/^data:image\/jpeg;base64,/, '');
  const csBuf = Buffer.from(csBase64, 'base64');
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'vf010_6_contact_sheet.jpg'), csBuf);
  console.log(`Saved vf010_6_contact_sheet.jpg (${csBuf.length} bytes)`);

  await browser.close();
}

generateCleanPlates();
