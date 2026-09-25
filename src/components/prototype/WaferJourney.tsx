import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { applyMockDeposition, INITIAL_BARE_WAFER, type WaferState } from '../../types/wafer';
import './WaferJourney.css';

const chapters = [
  { title: 'Inside the FOUP', detail: 'A bare, unpatterned silicon wafer waits in its carrier.', location: 'FOUP' },
  { title: 'Overhead transport', detail: 'The carrier moves through the cleanroom toward the deposition tool.', location: 'AMHS' },
  { title: 'Dock at the tool', detail: 'The FOUP arrives at the load port.', location: 'LOAD PORT' },
  { title: 'Wafer transfer', detail: 'A robot takes one wafer from the carrier into the tool.', location: 'HANDLER' },
  { title: 'Inside the chamber', detail: 'The wafer rests on the process chuck.', location: 'CHAMBER' },
  { title: 'Blanket deposition', detail: 'An illustrative oxide film forms uniformly across the exposed silicon surface.', location: 'CHAMBER' },
  { title: 'Look closer', detail: 'The same oxide film is visible above the silicon in cross-section. Thickness is exaggerated for clarity.', location: 'CROSS-SECTION' },
  { title: 'Return to carrier', detail: 'The coated wafer returns to the FOUP. Its new film stays with it.', location: 'FOUP' },
] as const;
const duration = [7, 8, 7, 8, 7, 9, 9, 8];
const oxideColor = '#B0D4E8';

function box(w: number, h: number, d: number, color: number, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, metalness: .25, roughness: .48 }));
  mesh.position.set(x, y, z);
  return mesh;
}

function JourneyScene({ chapter, progress, coated, look }: { chapter: number; progress: number; coated: boolean; look: number }) {
  const mount = useRef<HTMLDivElement>(null);
  const values = useRef({ chapter, progress, coated, look });
  values.current = { chapter, progress, coated, look };
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101e2b);
    scene.fog = new THREE.Fog(0x152839, 18, 52);
    const camera = new THREE.PerspectiveCamera(48, 1, .1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xe7f4ff, 0x334252, 2.1));
    const light = new THREE.DirectionalLight(0xffffff, 2.3);
    light.position.set(-5, 10, 7); scene.add(light);
    const floor = box(36, .14, 45, 0x647989, 0, -.25, -10); scene.add(floor);
    for (let i = -3; i <= 3; i++) {
      scene.add(box(.045, .012, 45, 0xa7bac4, i * 4.5, -.16, -10));
      const tool = new THREE.Group();
      const x = i % 2 === 0 ? -6.2 : 6.2;
      tool.position.set(x, 0, -i * 5 - 9);
      tool.add(box(3.3, 3.5, 3.5, 0xd6e2e8, 0, 1.7, 0));
      tool.add(box(2.5, .55, .06, 0x1d3444, 0, 2.8, 1.78));
      tool.add(box(1.9, 1.1, .12, 0x243d4c, 0, 1.35, 1.82));
      scene.add(tool);
    }
    scene.add(box(.16, .22, 46, 0x90aab6, 0, 5.6, -10));
    const carrier = new THREE.Group();
    carrier.add(box(2.35, .18, 1.5, 0xb4c8d0, 0, -.86, 0));
    carrier.add(box(2.35, .2, 1.5, 0xb4c8d0, 0, .86, 0));
    for (const x of [-1.12, 1.12]) carrier.add(box(.12, 1.65, 1.5, 0xb4c8d0, x, 0, 0));
    for (let slot = 0; slot < 5; slot++) {
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(.92, .92, .027, 56), new THREE.MeshStandardMaterial({ color: 0x899ba4, metalness: .5, roughness: .32 }));
      tray.position.y = -.63 + slot * .29; tray.scale.z = .63; carrier.add(tray);
    }
    carrier.add(box(.8, .35, .7, 0x859eaa, 0, 1.04, 0));
    scene.add(carrier);
    const wafer = new THREE.Group();
    const silicon = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, .065, 80), new THREE.MeshStandardMaterial({ color: 0x8c989f, metalness: .57, roughness: .27, side: THREE.DoubleSide }));
    wafer.add(silicon);
    const film = new THREE.Mesh(new THREE.CylinderGeometry(1.055, 1.055, .018, 80), new THREE.MeshStandardMaterial({ color: oxideColor, metalness: .13, roughness: .26, side: THREE.DoubleSide }));
    film.position.y = .048; wafer.add(film);
    const edge = new THREE.Mesh(new THREE.TorusGeometry(1.05, .017, 10, 80), new THREE.MeshStandardMaterial({ color: 0xd8e4e9 }));
    edge.rotation.x = Math.PI / 2; wafer.add(edge);
    scene.add(wafer);
    const chamber = new THREE.Group();
    chamber.add(box(4, .18, 4, 0x8599a4, 0, -.12, 0));
    chamber.add(box(3.1, .25, 3.1, 0x425967, 0, .12, 0));
    for (const x of [-2, 2]) for (const z of [-2, 2]) chamber.add(box(.12, 2, .12, 0xabc2cd, x, 1, z));
    const shower = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, .22, 64), new THREE.MeshStandardMaterial({ color: 0xb3c5cc, metalness: .55 }));
    shower.position.y = 2.15; chamber.add(shower);
    scene.add(chamber);
    const gas = new THREE.Group();
    const gasMat = new THREE.MeshBasicMaterial({ color: 0xaaddeb, transparent: true, opacity: .65 });
    for (let i = 0; i < 16; i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 8), gasMat);
      dot.position.set(Math.sin(i * 2.4) * 1.35, 1 + (i % 4) * .27, Math.cos(i * 2.4) * 1.35);
      gas.add(dot);
    }
    scene.add(gas);
    const section = new THREE.Group();
    section.add(box(5, 1.1, .85, 0x6b7b8d, 0, 0, 0));
    section.add(box(5, .18, .9, 0xb0d4e8, 0, .65, 0));
    scene.add(section);
    let frame = 0;
    const resize = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const { chapter: step, progress: t, coated, look } = values.current;
      const inChamber = step >= 4 && step <= 6;
      carrier.visible = step <= 3 || step === 7;
      carrier.position.set(0, step === 1 ? 3.8 : .9, step === 1 ? -7 + t * 12 : step === 2 ? -1.5 + t * 1.5 : 0);
      chamber.visible = inChamber;
      chamber.position.set(0, 0, 0);
      wafer.visible = step !== 6;
      wafer.position.set(step === 3 ? -1.6 + 1.6 * t : 0, step <= 2 || step === 7 ? carrier.position.y + .16 : step === 3 ? 1.05 - .7 * t : .32, step === 3 ? 1.2 - t : carrier.visible ? carrier.position.z : 0);
      wafer.rotation.set(0, 0, 0);
      film.visible = coated || (step === 5 && t > .57) || step >= 6;
      gas.visible = step === 5;
      gas.children.forEach((dot, i) => { dot.position.y = 1.6 - ((performance.now() * .00035 + i * .19) % 1) * 1.1; });
      section.visible = step === 6;
      if (step === 0) camera.position.set(.2, 1.15, 2.6);
      else if (step === 1) camera.position.set(2.8, 4.6, carrier.position.z + 5.5);
      else if (step === 2) camera.position.set(3.5, 2.8, 5.8);
      else if (step === 3) camera.position.set(2.7, 1.8, 3.8);
      else if (step === 6) camera.position.set(1, 1.1, 7);
      else camera.position.set(3.5, 2.8, 5.1);
      camera.position.x += look * .7;
      camera.lookAt(0, step === 6 ? .25 : step === 1 ? 2.6 : .65, step === 1 ? carrier.position.z : 0);
      renderer.render(scene, camera);
    };
    animate();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); scene.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : [m]).forEach(v => v.dispose()); } }); renderer.dispose(); host.removeChild(renderer.domElement); };
  }, []);
  return <div className="journey-canvas" ref={mount} aria-hidden="true" />;
}

export default function WaferJourney() {
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [wafer, setWafer] = useState<WaferState>(INITIAL_BARE_WAFER);
  const [look, setLook] = useState(0);
  const [inspection, setInspection] = useState(false);
  const coated = wafer.layers.length > 1;
  const next = () => {
    setInspection(false);
    if (chapter < 7) {
      if (chapter >= 5) setWafer((current) => applyMockDeposition(current));
      setChapter(chapter + 1);
      setProgress(0);
    } else setPlaying(false);
  };
  const go = (index: number) => { setChapter(index); setProgress(0); setInspection(false); setPlaying(false); setWafer(index >= 6 ? applyMockDeposition(INITIAL_BARE_WAFER) : INITIAL_BARE_WAFER); };
  useEffect(() => {
    if (!playing || inspection) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now(); const dt = Math.min((now - previous) / 1000, .2); previous = now;
      setProgress(p => Math.min(1, p + dt / duration[chapter]));
    }, 50);
    return () => clearInterval(timer);
  }, [playing, chapter, inspection]);
  useEffect(() => {
    if (chapter === 5 && progress >= .6 && !coated) setWafer(applyMockDeposition(wafer));
    if (progress >= 1 && playing) {
      if (chapter === 7) setPlaying(false);
      else { setChapter(c => c + 1); setProgress(0); }
    }
  }, [chapter, progress, playing, coated, wafer]);
  return <main id="main-content" className="journey">
    <header className="journey-header"><a href="/#fab">← Virtual Fab</a><span>EXPERIENCE PROTOTYPE · DEPOSITION</span><span>01 / 01 JOURNEY</span></header>
    <div className="journey-stage"><JourneyScene chapter={chapter} progress={progress} coated={coated} look={look} />
      <div className="journey-vignette" />
      <div className="journey-top"><span className="journey-tag">{chapters[chapter].location}</span><span className="journey-tag">WAFER 01 · {coated ? 'Si + SiO₂' : 'BARE Si'}</span></div>
      <div className="journey-copy"><div className="journey-count">{String(chapter + 1).padStart(2, '0')} / 08</div><h1>{chapters[chapter].title}</h1><p>{chapters[chapter].detail}</p></div>
      {inspection && <div className="journey-inspect"><button onClick={() => setInspection(false)} aria-label="Close wafer inspection">×</button><h2>Wafer state</h2><div className="journey-disc" style={{ background: coated ? oxideColor : '#8c989f' }} /><p>{coated ? 'Continuous silicon dioxide film on silicon. No pattern has been made.' : 'Polished bare silicon. No deposited film or circuit pattern.'}</p><div className="journey-section">{coated && <div className="journey-oxide">SiO₂ · illustrative thin film</div>}<div className="journey-silicon">Si · substrate</div></div></div>}
    </div>
    <div className="journey-controls"><div className="journey-buttons"><button className="journey-primary" onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : chapter === 7 && progress === 1 ? 'Finished' : 'Play journey'}</button><button onClick={next} disabled={chapter === 7}>Next scene →</button><button onClick={() => { setInspection(!inspection); setPlaying(false); }}>Inspect wafer</button><button onClick={() => setLook(l => l === 0 ? 1 : l === 1 ? -1 : 0)} aria-label="Change camera angle">Look around ↔</button></div><div className="journey-progress"><div style={{ width: `${((chapter + progress) / 8) * 100}%` }} /></div><nav aria-label="Journey scenes">{chapters.map((c, i) => <button key={c.title} className={i === chapter ? 'active' : ''} onClick={() => go(i)} title={c.title} aria-label={`Scene ${i + 1}: ${c.title}`}>{String(i + 1).padStart(2, '0')}</button>)}</nav></div>
    <div className="journey-note">Concept visualization · representative equipment and simplified blanket deposition · film thickness exaggerated</div>
  </main>;
}
