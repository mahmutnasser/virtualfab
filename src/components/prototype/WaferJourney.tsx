import { useEffect, useState } from 'react';
import { applyMockDeposition, INITIAL_BARE_WAFER } from '../../types/wafer';
import { isWebGLAvailable } from '../fab/three/webgl-detect';
import WaferMotion3D from './WaferMotion3D';
import './WaferJourney.css';

const scenes = [
  { title: 'Inside the FOUP', description: 'A bare silicon wafer waits in its carrier. Its surface is smooth and unpatterned.', location: 'CARRIER', image: '01-foup' },
  { title: 'Travelling through the fab', description: 'The FOUP rides the overhead transport system toward the deposition tool.', location: 'CLEANROOM', image: '02-transport' },
  { title: 'Arriving at the tool', description: 'The carrier docks at the load port. The wafer stays protected until transfer.', location: 'LOAD PORT', image: '03-dock' },
  { title: 'Wafer transfer', description: 'A handling robot removes one bare wafer and carries it into the tool.', location: 'HANDLER', image: '04-transfer' },
  { title: 'Inside the chamber', description: 'The bare wafer enters from the transfer opening and settles onto the process chuck.', location: 'CHAMBER', image: '05-chamber' },
  { title: 'Blanket deposition', description: 'Cutaway view: illustrative gas flow accompanies a continuous silicon dioxide film forming on the wafer.', location: 'PROCESS', image: '06-deposition' },
  { title: 'Look closer', description: 'The same pale blue film sits above silicon. Thickness is exaggerated so you can see it.', location: 'CROSS-SECTION', image: '07-cross-section' },
  { title: 'Return to carrier', description: 'The handler returns the coated wafer to its slot. The continuous oxide film stays on the wafer.', location: 'CARRIER', image: '08-return' },
] as const;
const durations = [7, 8, 7, 8, 7, 9, 9, 8];
const imageUrl = (index: number) => `/images/journey/${scenes[index].image}.webp`;
const motionBackgrounds: Partial<Record<number, string>> = {
  1: '/images/journey/02-transport-empty.webp',
  2: '/images/journey/03-dock-empty.webp',
  3: '/images/journey/04-transfer-empty.webp',
  4: '/images/journey/05-chamber-empty.webp',
  5: '/images/journey/05-chamber-empty.webp',
  7: '/images/journey/08-return-empty.webp',
};
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

function MovingEquipment({ scene, progress }: { scene: number; progress: number }) {
  if (scene === 1) {
    const move = smooth((progress - .04) / .82);
    return <img className="journey-actor journey-transport" src="/images/journey/02-overhead-vehicle.webp" alt=""
      style={{ left: '46.5%', top: '-3.5%', width: '30.3%', transform: `translate3d(${(move - 1) * 55}%, ${(1 - move) * 12}%, 0) scale(${.83 + move * .17})` }} />;
  }
  if (scene === 2) {
    const move = smooth((progress - .1) / .76);
    return <img className="journey-actor journey-docking" src="/images/journey/03-foup-cutout.webp" alt=""
      style={{ left: '0.3%', top: '18%', width: '52%', transform: `translate3d(${(move - 1) * 75}%, 0, 0)` }} />;
  }
  if (scene === 3) {
    const reach = smooth((progress - .12) / .72);
    return <img className="journey-actor journey-transfer" src="/images/journey/04-handler-wafer.webp" alt=""
      style={{ left: '8%', top: '29%', width: '78%', transform: `translate3d(${(reach - 1) * 68}%, 0, 0)` }} />;
  }
  return null;
}

function ProcessChamber({ scene, progress }: { scene: number; progress: number }) {
  const entering = scene === 4;
  const placement = entering ? smooth((progress - .08) / .7) : 1;
  const film = entering ? 0 : smooth((progress - .28) / .55);
  const processActive = !entering && progress > .12 && progress < .9;
  const zoom = entering ? 1 : 1 + smooth((progress - .84) / .16) * .55;
  const position = `translate3d(${(1 - placement) * 110}%, ${(1 - placement) * -8}%, 0)`;
  return <div className="journey-chamber-view" style={{ transform: `scale(${zoom})` }} aria-hidden="true">
    <div className="journey-chamber-background" />
    <img className="journey-chamber-wafer journey-bare-wafer" src="/images/journey/05-bare-wafer.webp" alt="" style={{ transform: position }} />
    {!entering && <>
      <img className="journey-chamber-wafer journey-coated-wafer" src="/images/journey/06-coated-wafer.webp" alt="" style={{ opacity: film }} />
      {processActive && Array.from({ length: 12 }, (_, index) => {
        const phase = (progress * 3.7 + index * .19) % 1;
        return <span key={index} className="journey-gas-particle" style={{ left: `${30 + index * 3.65}%`, top: `${29 + phase * 26}%`, opacity: .15 + (1 - Math.abs(phase - .5) * 2) * .35 }} />;
      })}
    </>}
  </div>;
}

function ReturnToCarrier({ progress }: { progress: number }) {
  const insertion = smooth((progress - .04) / .65);
  const release = smooth((progress - .68) / .16);
  return <div className="journey-return-view" aria-hidden="true">
    <div className="journey-return-background" />
    <img className="journey-return-handler" src="/images/journey/08-return-handler.webp" alt=""
      style={{ transform: `translate3d(${(1 - insertion) * 26}%, ${(insertion - 1) * 3}%, 0)`, opacity: 1 - release }} />
    <div className="journey-return-seated" style={{ opacity: smooth((progress - .68) / .16) }} />
  </div>;
}

export default function WaferJourney() {
  const [scene, setScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [inspection, setInspection] = useState(false);
  const [wafer, setWafer] = useState(INITIAL_BARE_WAFER);
  const [threeMode, setThreeMode] = useState(false);
  const [webglSupported] = useState(isWebGLAvailable);
  const coated = wafer.layers.some(layer => layer.id === 'oxide-film');

  const select = (index: number) => {
    setScene(index);
    setProgress(0);
    setPlaying(false);
    setInspection(false);
    setWafer(index >= 6 ? applyMockDeposition(INITIAL_BARE_WAFER) : INITIAL_BARE_WAFER);
  };
  const next = () => {
    if (scene < scenes.length - 1) {
      setScene(scene + 1);
      setProgress(0);
      setInspection(false);
      if (scene >= 5) setWafer(applyMockDeposition(INITIAL_BARE_WAFER));
    } else setPlaying(false);
  };
  const replay = () => {
    setScene(0);
    setProgress(0);
    setInspection(false);
    setWafer(INITIAL_BARE_WAFER);
    setPlaying(true);
  };
  useEffect(() => {
    if (!playing || inspection) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = Math.min((now - previous) / 1000, .2);
      previous = now;
      setProgress(current => Math.min(1, current + elapsed / durations[scene]));
    }, 50);
    return () => window.clearInterval(timer);
  }, [playing, inspection, scene]);
  useEffect(() => {
    if (scene === 5 && progress >= .82 && !coated) setWafer(applyMockDeposition(INITIAL_BARE_WAFER));
    if (progress >= 1 && playing) {
      if (scene === scenes.length - 1) setPlaying(false);
      else { setScene(current => current + 1); setProgress(0); }
    }
  }, [scene, progress, playing, coated]);
  useEffect(() => {
    // Prepare adjacent plates before the transition, avoiding a flash on first view.
    [scene, Math.min(scene + 1, scenes.length - 1)].forEach(index => {
      const image = new Image(); image.src = motionBackgrounds[index] ?? imageUrl(index);
    });
    if (scene >= 3 && scene <= 5) {
      ['/images/journey/05-bare-wafer.webp', '/images/journey/06-coated-wafer.webp', imageUrl(5)].forEach(source => {
        const image = new Image(); image.src = source;
      });
    }
    if (scene >= 6) {
      ['/images/journey/08-return-empty.webp', '/images/journey/08-return-handler.webp', '/images/journey/08-return-seated.webp'].forEach(source => {
        const image = new Image(); image.src = source;
      });
    }
  }, [scene]);
  const threeScene = threeMode && (scene === 3 || scene === 4 || scene === 5 || scene === 7);

  return <main id="main-content" className="journey">
    <header className="journey-header"><a href="/#fab">← Virtual Fab</a><span>WAFER JOURNEY / DEPOSITION</span><span>EXPERIENCE PROTOTYPE</span></header>
    <div className="journey-stage">
      {!threeScene && (scene === 7 ? <ReturnToCarrier progress={progress} /> : scene === 4 || scene === 5 ? <ProcessChamber scene={scene} progress={progress} /> :
        <div key={scene} className="journey-plate is-current" style={{ backgroundImage: `url(${motionBackgrounds[scene] ?? imageUrl(scene)})`, transform: scene >= 1 && scene <= 3 ? undefined : `scale(${1.025 + progress * .055}) translate3d(${(progress - .5) * (scene % 2 ? -1.2 : 1.2)}%, 0, 0)` }} aria-hidden="true" />)}
      {threeMode && <div className="journey-three-stage" style={{ opacity: threeScene ? 1 : 0, pointerEvents: threeScene ? 'auto' : 'none', transform: scene === 5 ? `scale(${1 + smooth((progress - .84) / .16) * .55})` : undefined }}>
        {scene === 3 && <div className="journey-three-background" style={{ backgroundImage: `url(${motionBackgrounds[3]})` }} />}
        {(scene === 4 || scene === 5) && <div className="journey-chamber-background" />}
        {scene === 7 && <div className="journey-return-background" />}
        <WaferMotion3D scene={scene} progress={progress} coated={coated} onUnavailable={() => setThreeMode(false)} />
        {scene === 7 && <div className="journey-return-seated" style={{ opacity: smooth((progress - .68) / .16) }} />}
      </div>}
      {!threeScene && <MovingEquipment scene={scene} progress={progress} />}
      {!threeScene && scene >= 1 && scene <= 5 && <div className="journey-process-reveal" style={{ backgroundImage: `url(${imageUrl(scene)})`, opacity: scene === 5 ? smooth((progress - .42) / .46) : smooth((progress - .88) / .12) }} aria-hidden="true" />}
      <div className="journey-vignette" />
      <div className="journey-top"><span className="journey-tag">{scenes[scene].location}</span><span className="journey-tag">WAFER 01 · {coated ? 'Si + SiO₂' : 'BARE Si'}</span></div>
      <div className="journey-copy" aria-live="polite"><div className="journey-count">{String(scene + 1).padStart(2, '0')} / 08</div><h1>{scenes[scene].title}</h1><p>{scenes[scene].description}</p></div>
      {inspection && <div className="journey-inspect" role="dialog" aria-label="Wafer inspection"><button onClick={() => setInspection(false)} aria-label="Close wafer inspection">×</button><h2>Wafer state</h2><div className="journey-disc" style={{ background: coated ? '#B0D4E8' : '#929ca4' }} /><p>{coated ? 'Continuous silicon dioxide film on silicon. No pattern has been made.' : 'Polished bare silicon. No deposited film or circuit pattern.'}</p><div className="journey-section">{coated && <div className="journey-oxide">SiO₂ · illustrative thin film</div>}<div className="journey-silicon">Si · substrate</div></div></div>}
    </div>
    <div className="journey-controls"><div className="journey-buttons"><button className="journey-primary" onClick={() => { if (scene === 7 && progress === 1) replay(); else setPlaying(!playing); }}>{playing ? 'Pause' : scene === 7 && progress === 1 ? 'Replay journey' : 'Play journey'}</button><button onClick={next} disabled={scene === 7}>Next scene →</button><button onClick={() => { setInspection(!inspection); setPlaying(false); }}>Inspect wafer</button><button aria-pressed={threeMode} disabled={!webglSupported} onClick={() => setThreeMode(value => !value)}>{threeMode ? '3D motion: On' : '3D motion: Off'}</button></div><label className="journey-scrub-label" htmlFor="journey-scrub">Scene progress <span>{Math.round(progress * 100)}%</span></label><input id="journey-scrub" className="journey-scrub" type="range" min="0" max="100" value={Math.round(progress * 100)} onChange={event => { const value = Number(event.target.value) / 100; setProgress(value); if (scene === 5) setWafer(value >= .82 ? applyMockDeposition(INITIAL_BARE_WAFER) : INITIAL_BARE_WAFER); }} aria-label={`Scrub ${scenes[scene].title}`} /><div className="journey-progress"><div style={{ width: `${((scene + progress) / scenes.length) * 100}%` }} /></div><nav aria-label="Journey scenes">{scenes.map((item, index) => <button key={item.image} className={index === scene ? 'active' : ''} onClick={() => select(index)} title={item.title} aria-label={`Scene ${index + 1}: ${item.title}`}>{String(index + 1).padStart(2, '0')}</button>)}</nav></div>
    <div className="journey-note">Cinematic concept visualization · representative equipment · simplified deposition · film thickness exaggerated</div>
  </main>;
}
