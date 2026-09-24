import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244';
const PUBLIC_PLATES = 'C:/Users/Utente/Desktop/Virtual Fab/virtual-fab/public/images/plates';

async function build() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Read images as base64
  function getBase64(filePath) {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${data.toString('base64')}`;
  }

  const overviewB64 = getBase64(path.join(PUBLIC_PLATES, 'fab_overview.jpg'));
  const depB64 = getBase64(path.join(ARTIFACT_DIR, 'visual-targets/deposition.png'));
  const lithoB64 = getBase64(path.join(ARTIFACT_DIR, 'visual-targets/lithography.png'));
  const metroB64 = getBase64(path.join(ARTIFACT_DIR, 'visual-targets/metrology-adi.png'));
  const trackB64 = getBase64(path.join(ARTIFACT_DIR, 'clean_track_system_1790107545549.jpg'));
  const etchB64 = getBase64(path.join(ARTIFACT_DIR, 'clean_etch_tool_1790107565883.jpg'));

  await page.setContent('<html><body><canvas id="c"></canvas></body></html>');

  const plates = await page.evaluate(async (data) => {
    function loadImg(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    const [imgOverview, imgDep, imgLitho, imgMetro, imgTrack, imgEtch] = await Promise.all([
      loadImg(data.overviewB64),
      loadImg(data.depB64),
      loadImg(data.lithoB64),
      loadImg(data.metroB64),
      loadImg(data.trackB64),
      loadImg(data.etchB64),
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Helper: blend machine on left with master cleanroom on right
    // machineWidth: where the machine ends (e.g. 1150)
    // blendWidth: feather width (e.g. 150)
    function blendMachineWithMaster(machineImg, machineWidth = 1150, blendWidth = 160) {
      ctx.clearRect(0, 0, 1920, 1080);
      // 1. Draw master overview background
      ctx.drawImage(imgOverview, 0, 0, 1920, 1080);

      // 2. Draw machine on a temporary canvas with horizontal feather mask
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 1920;
      tempCanvas.height = 1080;
      const tctx = tempCanvas.getContext('2d');

      // Draw machine
      tctx.drawImage(machineImg, 0, 0, 1920, 1080);

      // Mask out the right side using destination-in gradient
      tctx.globalCompositeOperation = 'destination-in';
      const grad = tctx.createLinearGradient(machineWidth - blendWidth, 0, machineWidth, 0);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      tctx.fillStyle = grad;
      tctx.fillRect(machineWidth - blendWidth, 0, blendWidth, 1080);
      tctx.clearRect(machineWidth, 0, 1920 - machineWidth, 1080);

      // Also mask top 80px if machineImg has top header bar
      // Draw onto main canvas
      ctx.drawImage(tempCanvas, 0, 0);

      return canvas.toDataURL('image/jpeg', 0.95);
    }

    // 1. Deposition clean plate
    // In visual-targets/deposition.png, machine spans from x=150 to ~1200, y=100 to 980
    // Header bar is at y: 0..85. Let's composite master cleanroom ceiling over top 90px if needed.
    const depClean = blendMachineWithMaster(imgDep, 1180, 180);

    // 2. Lithography clean plate
    const lithoClean = blendMachineWithMaster(imgLitho, 1240, 180);

    // 3. Metrology clean plate
    const metroClean = blendMachineWithMaster(imgMetro, 1120, 160);

    // 4. Start Wafer Handling plate
    // Frame the wafer handling chuck and load port from imgOverview
    ctx.clearRect(0, 0, 1920, 1080);
    // Draw master overview
    ctx.drawImage(imgOverview, 0, 0, 1920, 1080);
    // Zoom slightly into the left foreground wafer chuck & load ports
    // source: x=0, y=200, w=1500, h=880 -> dest: 0, 0, 1920, 1080
    ctx.drawImage(imgOverview, 0, 180, 1550, 900, 0, 0, 1920, 1080);
    const startClean = canvas.toDataURL('image/jpeg', 0.95);

    // 5. Track clean plate (already in master cleanroom!)
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(imgTrack, 0, 0, 1920, 1080);
    const trackClean = canvas.toDataURL('image/jpeg', 0.95);

    // 6. Etch clean plate (already in master cleanroom!)
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(imgEtch, 0, 0, 1920, 1080);
    const etchClean = canvas.toDataURL('image/jpeg', 0.95);

    // 7. Strip clean plate
    // In semiconductor cleanroom, photoresist strip tool is an enclosed cabinet tool.
    // We create a distinct, method-neutral strip tool in the master cleanroom bay by taking
    // the clean modular tool from imgEtch, and giving it opaque white paneling, amber FOUP doors,
    // and status light tower.
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(imgEtch, 0, 0, 1920, 1080);

    // Overlay amber tint on the dual load port windows
    // Load ports are at approx x: 530 to 860, y: 520 to 650
    ctx.save();
    ctx.fillStyle = 'rgba(217, 119, 6, 0.45)'; // cleanroom amber
    ctx.fillRect(530, 520, 160, 125);
    ctx.fillRect(705, 520, 160, 125);
    // Add specular highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(540, 530, 140, 20);
    ctx.fillRect(715, 530, 140, 20);
    ctx.restore();

    // Replace window in center door with solid white panel with seams
    ctx.save();
    ctx.fillStyle = '#f0f3f6';
    ctx.fillRect(1040, 420, 115, 170);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(1040, 420, 115, 170);
    // Dark handle
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(1135, 510, 8, 45);
    ctx.restore();
    const stripClean = canvas.toDataURL('image/jpeg', 0.95);

    // 8. Overview master clean plate
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.drawImage(imgOverview, 0, 0, 1920, 1080);
    const overviewClean = canvas.toDataURL('image/jpeg', 0.95);

    return {
      overview: overviewClean,
      start: startClean,
      deposition: depClean,
      track: trackClean,
      lithography: lithoClean,
      metrology: metroClean,
      etch: etchClean,
      strip: stripClean,
    };
  }, { overviewB64, depB64, lithoB64, metroB64, trackB64, etchB64 });

  // Save the 8 individual clean environment plates
  for (const [key, dataUrl] of Object.entries(plates)) {
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const buf = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(path.join(ARTIFACT_DIR, `coherent_plate_${key}.jpg`), buf);
    console.log(`Saved coherent_plate_${key}.jpg (${buf.length} bytes)`);
  }

  await browser.close();
}

build();
