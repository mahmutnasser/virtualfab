import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

function getHash(filePath) {
  if (!fs.existsSync(filePath)) return 'FILE_NOT_FOUND';
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

const targetDir = 'C:/Users/Utente/.gemini/antigravity/brain/3615d0ab-9175-4907-ba08-c449e8cda244/visual-targets';
const runtimeDir = 'c:/Users/Utente/Desktop/Virtual Fab/virtual-fab/public/images/plates';

const pairs = [
  {
    name: 'Fab Overview',
    target: path.join(targetDir, 'overview.png'),
    runtime: path.join(runtimeDir, 'fab_overview.jpg'),
  },
  {
    name: 'Deposition Station',
    target: path.join(targetDir, 'deposition.png'),
    runtime: path.join(runtimeDir, 'deposition.jpg'),
  },
  {
    name: 'Lithography Scanner',
    target: path.join(targetDir, 'lithography.png'),
    runtime: path.join(runtimeDir, 'lithography.jpg'),
  },
  {
    name: 'WebGL Fallback Target',
    target: path.join(targetDir, 'fallback.png'),
    runtime: 'c:/Users/Utente/Desktop/Virtual Fab/virtual-fab/public/images/cleanroom-bg.jpg',
  },
];

console.log('=== SHA-256 VERIFICATION HASHES ===');
for (const p of pairs) {
  const targetHash = getHash(p.target);
  const runtimeHash = getHash(p.runtime);
  console.log(`\n[${p.name}]`);
  console.log(`  Target:  ${p.target}`);
  console.log(`  Hash:    ${targetHash}`);
  console.log(`  Runtime: ${p.runtime}`);
  console.log(`  Hash:    ${runtimeHash}`);
  console.log(`  Identical: ${targetHash === runtimeHash ? 'YES (ERROR)' : 'NO (DISTINCT ASSETS - VERIFIED)'}`);
}
