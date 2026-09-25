import { useEffect, useState } from 'react';
import { applyMockDeposition, INITIAL_BARE_WAFER } from '../../types/wafer';
import './WaferJourney.css';

const scenes = [
  { title: 'Inside the FOUP', description: 'A bare silicon wafer waits in its carrier. Its surface is smooth and unpatterned.', location: 'CARRIER', image: '01-foup' },
  { title: 'Travelling through the fab', description: 'The FOUP rides the overhead transport system toward the deposition tool.', location: 'CLEANROOM', image: '02-transport' },
  { title: 'Arriving at the tool', description: 'The carrier docks at the load port. The wafer stays protected until transfer.', location: 'LOAD PORT', image: '03-dock' },
  { title: 'Wafer transfer', description: 'A handling robot removes one bare wafer and carries it into the tool.', location: 'HANDLER', image: '04-transfer' },
  { title: 'Inside the chamber', description: 'The bare wafer rests on the process chuck beneath the gas distribution head.', location: 'CHAMBER', image: '05-chamber' },
  { title: 'Blanket deposition', description: 'An illustrative silicon dioxide film forms across the wafer surface.', location: 'PROCESS', image: '06-deposition' },
  { title: 'Look closer', description: 'The same pale blue film sits above silicon. Thickness is exaggerated so you can see it.', location: 'CROSS-SECTION', image: '07-cross-section' },
  { title: 'Return to carrier', description: 'The coated wafer returns to the FOUP with its new film intact.', location: 'CARRIER', image: '08-return' },
] as const;
const durations = [7, 8, 7, 8, 7, 9, 9, 8];
const imageUrl = (index: number) => `/images/journey/${scenes[index].image}.webp`;

export default function WaferJourney() {
  const [scene, setScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [inspection, setInspection] = useState(false);
  const [wafer, setWafer] = useState(INITIAL_BARE_WAFER);
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
    if (scene === 5 && progress >= .58 && !coated) setWafer(applyMockDeposition(INITIAL_BARE_WAFER));
    if (progress >= 1 && playing) {
      if (scene === scenes.length - 1) setPlaying(false);
      else { setScene(current => current + 1); setProgress(0); }
    }
  }, [scene, progress, playing, coated]);
  useEffect(() => {
    // Prepare adjacent plates before the transition, avoiding a flash on first view.
    [scene, Math.min(scene + 1, scenes.length - 1)].forEach(index => {
      const image = new Image(); image.src = imageUrl(index);
    });
  }, [scene]);

  return <main id="main-content" className="journey">
    <header className="journey-header"><a href="/#fab">← Virtual Fab</a><span>WAFER JOURNEY / DEPOSITION</span><span>EXPERIENCE PROTOTYPE</span></header>
    <div className="journey-stage">
      <div key={scene} className="journey-plate is-current" style={{ backgroundImage: `url(${imageUrl(scene)})`, transform: `scale(${1.025 + progress * .055}) translate3d(${(progress - .5) * (scene % 2 ? -1.2 : 1.2)}%, 0, 0)` }} aria-hidden="true" />
      {scene === 5 && <div className="journey-process-reveal" style={{ backgroundImage: `url(${imageUrl(4)})`, opacity: Math.max(0, 1 - progress * 2.15) }} aria-hidden="true" />}
      <div className="journey-vignette" />
      <div className="journey-top"><span className="journey-tag">{scenes[scene].location}</span><span className="journey-tag">WAFER 01 · {coated ? 'Si + SiO₂' : 'BARE Si'}</span></div>
      <div className="journey-copy" aria-live="polite"><div className="journey-count">{String(scene + 1).padStart(2, '0')} / 08</div><h1>{scenes[scene].title}</h1><p>{scenes[scene].description}</p></div>
      {inspection && <div className="journey-inspect" role="dialog" aria-label="Wafer inspection"><button onClick={() => setInspection(false)} aria-label="Close wafer inspection">×</button><h2>Wafer state</h2><div className="journey-disc" style={{ background: coated ? '#B0D4E8' : '#929ca4' }} /><p>{coated ? 'Continuous silicon dioxide film on silicon. No pattern has been made.' : 'Polished bare silicon. No deposited film or circuit pattern.'}</p><div className="journey-section">{coated && <div className="journey-oxide">SiO₂ · illustrative thin film</div>}<div className="journey-silicon">Si · substrate</div></div></div>}
    </div>
    <div className="journey-controls"><div className="journey-buttons"><button className="journey-primary" onClick={() => { if (scene === 7 && progress === 1) select(0); else setPlaying(!playing); }}>{playing ? 'Pause' : scene === 7 && progress === 1 ? 'Replay journey' : 'Play journey'}</button><button onClick={next} disabled={scene === 7}>Next scene →</button><button onClick={() => { setInspection(!inspection); setPlaying(false); }}>Inspect wafer</button></div><div className="journey-progress"><div style={{ width: `${((scene + progress) / scenes.length) * 100}%` }} /></div><nav aria-label="Journey scenes">{scenes.map((item, index) => <button key={item.image} className={index === scene ? 'active' : ''} onClick={() => select(index)} title={item.title} aria-label={`Scene ${index + 1}: ${item.title}`}>{String(index + 1).padStart(2, '0')}</button>)}</nav></div>
    <div className="journey-note">Cinematic concept visualization · representative equipment · simplified deposition · film thickness exaggerated</div>
  </main>;
}
