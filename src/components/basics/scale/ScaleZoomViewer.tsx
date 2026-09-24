import React, { useState, useRef } from 'react';

export type ScaleStage = 'wafer' | 'field' | 'die' | 'feature';

export interface ScaleStageInfo {
  id: ScaleStage;
  label: string;
  levelNumber: number;
  scaleMetric: string;
  headline: string;
  definition: string;
  callout: string;
  details: string;
  dimensions: string;
}

export const SCALE_STAGES: ScaleStageInfo[] = [
  {
    id: 'wafer',
    label: 'Wafer',
    levelNumber: 1,
    scaleMetric: '300 mm (~12 inches)',
    headline: 'The Silicon Substrate Baseline',
    definition:
      'A wafer is a thin, round slice of semiconductor—usually high-purity monocrystalline silicon—on which many chips are manufactured at the same time.',
    callout: 'Hundreds of individual chips are fabricated simultaneously on a single silicon substrate.',
    details:
      'Standard advanced fabrication utilizes 300 mm diameter monocrystalline wafers (~775 µm thick) cut from single-crystal Czochralski ingots. The polished surface serves as the foundation for the entire device stack.',
    dimensions: 'Diameter: 300 mm · Thickness: ~775 µm (Silicon substrate)',
  },
  {
    id: 'field',
    label: 'Exposure Field',
    levelNumber: 2,
    scaleMetric: 'Conceptual ~26 × 33 mm',
    headline: 'The Scanner Step-and-Scan Window',
    definition:
      'An exposure field is the rectangular area of the wafer patterned during one lithography exposure pass.',
    callout: 'Lithography scanners step across the wafer, printing one exposure field per exposure shot.',
    details:
      'Lithography scanners project the reticle master pattern down onto one exposure field at a time. In our illustrative example, the field is portrait-oriented (26 mm X × 33 mm Y) and contains exactly 6 dies arranged in 2 columns and 3 rows.',
    dimensions: 'Illustrative scenario value: 26 mm (X) × 33 mm (Y) · 2×3 die grid (6 dies total)',
  },
  {
    id: 'die',
    label: 'Die (Chip)',
    levelNumber: 3,
    scaleMetric: 'Conceptual ~8 × 10 mm',
    headline: 'The Independent Functional Integrated Circuit',
    definition:
      'A die is one individual integrated-circuit area on the wafer. Its function depends on the product being manufactured.',
    callout:
      'A die is one individual integrated-circuit area on the wafer. Its function depends on the product being manufactured.',
    details:
      'In this illustrative example, each exposure field contains 6 dies (2 dies in X by 3 dies in Y). After wafer-level manufacturing and probe testing, the wafer is diced along scribe lanes to separate the individual dies for packaging.',
    dimensions: 'Illustrative scenario value: ~8–10 mm (X) × ~8–10 mm (Y) · Separated along scribe lanes',
  },
  {
    id: 'feature',
    label: 'Nanoscale Feature',
    levelNumber: 4,
    scaleMetric: 'Nanoscale (sub-micron to ~10 nm)',
    headline: 'Transistors, Vias & Microscopic Interconnects',
    definition:
      'A feature is a small physical structure that forms part of the chip, such as a transistor gate fin, contact via, or metal interconnect line.',
    callout: 'Billions of nanoscale features switch currents and route electrical signals.',
    details:
      'Advanced microchips contain billions of individual 3D features—such as FinFET or nanosheet channels, insulating oxide barriers, and multi-tier copper wires. Precise dimensional control at this scale determines chip performance.',
    dimensions: 'Illustrative scenario value: nanometer scale (<100 nm down to ~10 nm) · Conceptual microscopic view',
  },
];

export interface ScaleZoomViewerProps {
  initialStage?: ScaleStage;
  onNavigateToFab?: () => void;
  className?: string;
}

export const ScaleZoomViewer: React.FC<ScaleZoomViewerProps> = ({
  initialStage = 'wafer',
  onNavigateToFab,
  className = '',
}) => {
  const [currentStage, setCurrentStage] = useState<ScaleStage>(initialStage);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showFeatureEngineering, setShowFeatureEngineering] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentIndex = SCALE_STAGES.findIndex((s) => s.id === currentStage);
  const currentInfo = SCALE_STAGES[currentIndex];

  const handleNext = () => {
    if (currentIndex < SCALE_STAGES.length - 1) {
      setCurrentStage(SCALE_STAGES[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentStage(SCALE_STAGES[currentIndex - 1].id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCurrentStage('wafer');
    } else if (e.key === 'End') {
      e.preventDefault();
      setCurrentStage('feature');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  return (
    <section
      id="scale-viewer"
      ref={containerRef}
      role="region"
      aria-label="Interactive scale viewer: Wafer to Feature zoom sequence"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a6a6] select-none ${className}`.trim()}
    >
      {/* SECTION HEADER & STEPPER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#00A6A6] tracking-wider uppercase bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200/60">
              01 · Understanding Scale
            </span>
            <span className="text-xs text-slate-500 font-medium">Continuous semiconductor zoom</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A43]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            From 300 mm Silicon to Nanoscale Features
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl font-body">
            Explore how an entire 300 mm silicon wafer divides into exposure fields, individual dies, and nanoscale transistors.
          </p>
        </div>

        {/* Stepper Tabs */}
        <div
          role="tablist"
          aria-label="Scale stages"
          className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start lg:self-center"
        >
          {SCALE_STAGES.map((stage) => {
            const isSelected = stage.id === currentStage;
            return (
              <button
                key={stage.id}
                role="tab"
                id={`tab-${stage.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${stage.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setCurrentStage(stage.id)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl font-body font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white text-[#102A43] shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                }`}
                type="button"
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-[#102A43] text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {stage.levelNumber}
                </span>
                <span>{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN VIEWPORT: VISUAL FIRST (75–90% VISUAL OCCUPANCY IN PANE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-2">
        
        {/* DOMINANT VISUAL CONTAINER (Col 7 / 12) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center p-4 sm:p-6">
          
          {/* ======================================================== */}
          {/* STAGE 1: 300 mm Silicon Wafer */}
          {/* ======================================================== */}
          {currentStage === 'wafer' && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src="/images/basics/hero-wafer-cleanroom.jpg"
                alt="300 mm monocrystalline silicon wafer showing vibrant rainbow diffraction pattern in cleanroom"
                className="w-full h-full max-h-[420px] object-contain rounded-2xl"
              />
              {/* Live Overlay: Highlighting the Exposure Field window with accurate 26:33 portrait ratio */}
              {/* On 300 mm wafer: Width ~8.7% of wafer, Height ~11% of wafer */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[56%] aspect-square flex items-center justify-center">
                  <div
                    className="absolute border-2 border-[#00A6A6] bg-cyan-400/25 rounded-xs shadow-[0_0_14px_rgba(0,166,166,0.8)] animate-pulse flex items-center justify-center"
                    style={{
                      right: '27%',
                      top: '35%',
                      width: '8.7%',
                      height: '11.0%',
                    }}
                  >
                    <span className="text-[9px] font-mono text-cyan-200 bg-slate-900/95 px-1.5 py-0.5 rounded-xs absolute -top-5.5 whitespace-nowrap border border-cyan-500/40">
                      Exposure Field (~26×33 mm)
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg text-white font-mono text-xs border border-white/10">
                <span className="text-[#00A6A6] font-bold">1/4</span> 300 mm Substrate Baseline
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2: Exposure Field (Rebuilt: 26×33 mm portrait, 2×3 dies) */}
          {/* ======================================================== */}
          {currentStage === 'field' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center py-2">
              {/* Field Stage Header Badge */}
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg text-white font-mono text-xs border border-white/10 z-10">
                <span className="text-[#00A6A6] font-bold">2/4</span> Exposure Field · 2×3 Die Arrangement
              </div>

              {/* Exposure Field SVG: Occupies 75–90% of available vertical/horizontal pane */}
              <div className="relative w-full max-w-[320px] aspect-[26/33] rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-2xl bg-slate-950 p-3 flex flex-col">
                {/* Field Measurement Indicators (Top & Side) */}
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 pb-1.5 border-b border-cyan-500/30">
                  <span>← 26 mm (X) →</span>
                  <span className="text-slate-400 text-[10px]">Step-and-Scan Area</span>
                </div>

                {/* 2 Columns × 3 Rows = 6 Dies Grid with Scribe Lanes */}
                <div className="grid grid-cols-2 grid-rows-3 gap-2 flex-1 my-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
                  {[
                    { id: 1, name: 'Die 1', highlight: false },
                    { id: 2, name: 'Die 2', highlight: false },
                    { id: 3, name: 'Die 3', highlight: false },
                    { id: 4, name: 'Die 4', highlight: true }, // Highlighted to foreshadow Die Stage
                    { id: 5, name: 'Die 5', highlight: false },
                    { id: 6, name: 'Die 6', highlight: false },
                  ].map((d) => (
                    <div
                      key={d.id}
                      className={`relative rounded-lg p-2 flex flex-col justify-between overflow-hidden transition-all ${
                        d.highlight
                          ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-2 border-cyan-400 shadow-[0_0_12px_rgba(0,166,166,0.5)]'
                          : 'bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/60'
                      }`}
                    >
                      {/* Microscopic IC Texture inside each die */}
                      <div className="absolute inset-0 opacity-25 pointer-events-none">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <pattern id={`die-pattern-${d.id}`} width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M 0 4 L 8 4 M 4 0 L 4 8" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
                          </pattern>
                          <rect width="100%" height="100%" fill={`url(#die-pattern-${d.id})`} />
                        </svg>
                      </div>

                      {/* Die Content Representation */}
                      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                        <span className={d.highlight ? 'text-cyan-300 font-bold' : 'text-slate-400 font-semibold'}>
                          {d.name}
                        </span>
                        {d.highlight && (
                          <span className="text-[8px] bg-cyan-400 text-slate-950 font-bold px-1 rounded-xs">
                            NEXT STAGE
                          </span>
                        )}
                      </div>

                      {/* Circuit Block Layout Sketch */}
                      <div className="relative z-10 grid grid-cols-2 gap-1 my-0.5">
                        <div className="h-3 bg-blue-500/20 border border-blue-400/30 rounded-xs" />
                        <div className="h-3 bg-indigo-500/20 border border-indigo-400/30 rounded-xs" />
                        <div className="h-3 bg-cyan-500/20 border border-cyan-400/30 rounded-xs" />
                        <div className="h-3 bg-slate-700/40 border border-slate-600/30 rounded-xs" />
                      </div>

                      {/* Perimeter bond pads */}
                      <div className="relative z-10 flex justify-between text-[8px] text-slate-500 font-mono">
                        <span>~13×11 mm</span>
                        {d.highlight && <span className="text-cyan-400 font-bold">● Zoom</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scribe Lane & Height Indicator */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  <span>Subtle scribe lanes (streets)</span>
                  <span className="text-cyan-300 font-semibold">↕ ~33 mm (Y)</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 3: Die (Chip) — One Complete Die with 4 Edges */}
          {/* ======================================================== */}
          {currentStage === 'die' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center py-2">
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg text-white font-mono text-xs border border-white/10 z-10">
                <span className="text-[#00A6A6] font-bold">3/4</span> Single Complete Die · Scribe Edges Visible
              </div>

              {/* Complete Die Container (75–85% of visual pane) */}
              <div className="relative w-full max-w-[380px] aspect-[13/11] rounded-2xl overflow-hidden border-2 border-amber-400/70 shadow-2xl bg-slate-950 p-3.5 flex flex-col justify-between">
                {/* Outer Scribe Lane Margin & Label */}
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 border-b border-amber-500/30 pb-1.5">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Complete Silicon Die Layout
                  </span>
                  <span className="text-slate-400 text-[10px]">~13 mm (X) × ~11 mm (Y)</span>
                </div>

                {/* Main Die Body with Peripheral I/O Pads and Internal Architecture */}
                <div className="relative flex-1 my-2 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-xl border border-slate-700/80 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
                  {/* Peripheral Bond Pads (All 4 Edges) */}
                  <div className="flex justify-between gap-1 mb-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="w-2 h-1.5 bg-amber-300/80 rounded-xs border border-amber-200/50" />
                    ))}
                  </div>

                  {/* Core Architecture Layout */}
                  <div className="grid grid-cols-12 gap-2 my-auto">
                    {/* CPU / Logic Cores */}
                    <div className="col-span-7 grid grid-cols-2 gap-1.5 p-2 bg-blue-950/40 rounded-lg border border-blue-500/30">
                      <div className="h-8 bg-blue-500/20 rounded border border-blue-400/40 flex items-center justify-center text-[9px] font-mono text-blue-200 font-bold">
                        CORE 0
                      </div>
                      <div className="h-8 bg-blue-500/20 rounded border border-blue-400/40 flex items-center justify-center text-[9px] font-mono text-blue-200 font-bold">
                        CORE 1
                      </div>
                      <div className="h-8 bg-blue-500/20 rounded border border-blue-400/40 flex items-center justify-center text-[9px] font-mono text-blue-200 font-bold">
                        CORE 2
                      </div>
                      <div className="h-8 bg-blue-500/20 rounded border border-blue-400/40 flex items-center justify-center text-[9px] font-mono text-blue-200 font-bold">
                        CORE 3
                      </div>
                    </div>

                    {/* Shared SRAM Cache & Interconnect */}
                    <div className="col-span-5 flex flex-col justify-between gap-1.5 p-2 bg-indigo-950/40 rounded-lg border border-indigo-500/30">
                      <div className="h-7 bg-indigo-500/20 rounded border border-indigo-400/40 flex items-center justify-center text-[9px] font-mono text-indigo-200 font-semibold">
                        L3 CACHE
                      </div>
                      <div className="h-7 bg-cyan-500/20 rounded border border-cyan-400/40 flex items-center justify-center text-[9px] font-mono text-cyan-200 font-semibold">
                        MEM CTRL
                      </div>
                    </div>
                  </div>

                  {/* Bottom Peripheral Bond Pads */}
                  <div className="flex justify-between gap-1 mt-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="w-2 h-1.5 bg-amber-300/80 rounded-xs border border-amber-200/50" />
                    ))}
                  </div>
                </div>

                {/* Scribe Lane Dicing Clarification */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
                  <span>Diced along scribe lanes into standalone chip</span>
                  <span className="text-amber-300 font-medium">All 4 Edges Defined</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 4: Nanoscale Feature — Large 3D FinFET View */}
          {/* ======================================================== */}
          {currentStage === 'feature' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center py-2">
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg text-white font-mono text-xs border border-white/10 z-10 flex items-center gap-2">
                <span className="text-[#00A6A6] font-bold">4/4</span>
                <span>Nanoscale 3D FinFET Transistor</span>
              </div>

              {/* Engineering Toggle Button */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={() => setShowFeatureEngineering(!showFeatureEngineering)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all cursor-pointer"
                >
                  {showFeatureEngineering ? '← Visual View' : 'Engineering View →'}
                </button>
              </div>

              {/* 3D FinFET SVG Architecture (Occupies 75–90% of Visual Pane) */}
              <div className="relative w-full max-w-[440px] aspect-[4/3] rounded-2xl overflow-hidden border border-cyan-400/50 shadow-2xl bg-slate-950 p-4 flex flex-col justify-between">
                <svg
                  viewBox="0 0 440 280"
                  className="w-full h-full"
                  role="img"
                  aria-label="3D FinFET Transistor Architecture cutaway"
                >
                  <defs>
                    <linearGradient id="finSubstrateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                    <linearGradient id="finChannelGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>
                    <linearGradient id="finGateGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#4F46E5" />
                    </linearGradient>
                  </defs>

                  {/* Silicon Substrate Base */}
                  <polygon points="40,210 240,160 400,210 200,260" fill="url(#finSubstrateGrad)" stroke="#475569" strokeWidth="1" />
                  <polygon points="40,210 200,260 200,275 40,225" fill="#1E293B" />
                  <polygon points="200,260 400,210 400,225 200,275" fill="#0F172A" />

                  {/* 3D Vertical Silicon Fin Channels (Source to Drain) */}
                  {/* Fin 1 */}
                  <polygon points="120,185 160,175 160,115 120,125" fill="url(#finChannelGrad)" opacity="0.9" />
                  <polygon points="160,175 280,205 280,145 160,115" fill="#0369A1" />
                  <polygon points="120,125 160,115 280,145 240,155" fill="#7DD3FC" />

                  {/* 3D Transverse Metal Gate (Wraps around the Fin on 3 Sides) */}
                  <polygon points="180,145 220,135 220,70 180,80" fill="url(#finGateGrad)" />
                  <polygon points="220,135 260,145 260,80 220,70" fill="#4338CA" />
                  <polygon points="180,80 220,70 260,80 220,90" fill="#A5B4FC" />

                  {/* Source & Drain Contact Pads */}
                  <circle cx="140" cy="140" r="10" fill="#34D399" opacity="0.8" />
                  <text x="140" y="143" textAnchor="middle" fill="#064E3B" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    SOURCE
                  </text>
                  <circle cx="260" cy="175" r="10" fill="#34D399" opacity="0.8" />
                  <text x="260" y="178" textAnchor="middle" fill="#064E3B" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    DRAIN
                  </text>

                  {/* Gate Label */}
                  <text x="220" y="60" textAnchor="middle" fill="#C7D2FE" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    METAL GATE
                  </text>
                  <line x1="220" y1="64" x2="220" y2="72" stroke="#818CF8" strokeWidth="1.5" />

                  {/* Engineering View Dimensions Overlay */}
                  {showFeatureEngineering && (
                    <g className="animate-fade-in font-mono text-[10px]">
                      {/* Gate Length Lg */}
                      <line x1="180" y1="74" x2="220" y2="64" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2,2" />
                      <text x="200" y="55" fill="#FDE047" textAnchor="middle" fontWeight="bold">
                        Lg ≈ 12 nm
                      </text>

                      {/* Fin Height Hfin */}
                      <line x1="110" y1="125" x2="110" y2="185" stroke="#38BDF8" strokeWidth="1.5" />
                      <line x1="106" y1="125" x2="114" y2="125" stroke="#38BDF8" strokeWidth="1.5" />
                      <line x1="106" y1="185" x2="114" y2="185" stroke="#38BDF8" strokeWidth="1.5" />
                      <text x="100" y="158" fill="#38BDF8" textAnchor="end" fontWeight="bold">
                        Hfin ≈ 42 nm
                      </text>

                      {/* Fin Width Wfin */}
                      <line x1="240" y1="158" x2="280" y2="148" stroke="#34D399" strokeWidth="1.5" strokeDasharray="2,2" />
                      <text x="270" y="165" fill="#34D399" textAnchor="start" fontWeight="bold">
                        Wfin ≈ 7 nm
                      </text>
                    </g>
                  )}
                </svg>

                {/* Restrained Note as Required */}
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span className="text-cyan-300 font-semibold">3D FinFET Architecture</span>
                  <span className="text-slate-400">Conceptual microscopic view — not to scale</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* EXPLANATORY CONTENT (Col 5 / 12) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-left">
            
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00A6A6] uppercase tracking-wider">
              <span>Level 0{currentInfo.levelNumber}</span>
              <span>·</span>
              <span>{currentInfo.label}</span>
            </div>

            <h3
              className="text-2xl font-bold text-[#102A43] leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {currentInfo.headline}
            </h3>

            <p className="text-xs font-semibold text-slate-500 font-mono">
              {currentInfo.label} ({currentInfo.scaleMetric})
            </p>

            {/* Key Takeaway */}
            <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-100 text-slate-800 text-sm">
              <span className="text-xs font-bold text-[#00A6A6] uppercase tracking-wider block mb-1">
                Key Physical Takeaway
              </span>
              <p className="font-medium text-slate-700 leading-snug">
                {currentInfo.callout}
              </p>
            </div>

            {/* Educational Description */}
            <p className="text-sm text-slate-600 leading-relaxed font-body">
              {currentInfo.definition}
            </p>

            <p className="text-xs text-slate-500 leading-relaxed font-body">
              {currentInfo.details}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 font-mono">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Physical Dimension:</span>
              <span className="text-slate-800 font-medium">{currentInfo.dimensions}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous scale level"
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            >
              ← Previous Level
            </button>

            <span className="text-xs font-mono text-slate-400">
              Level {currentIndex + 1} of {SCALE_STAGES.length}
            </span>

            {currentIndex < SCALE_STAGES.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next scale level"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#102A43] hover:bg-[#1B3D5E] text-white transition-all shadow-xs cursor-pointer"
              >
                Next Level →
              </button>
            ) : (
              <button
                type="button"
                onClick={onNavigateToFab}
                aria-label="Experience scale in Virtual Fab"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#00A6A6] hover:bg-[#008F8F] text-white transition-all shadow-xs cursor-pointer"
              >
                Experience in Virtual Fab →
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ScaleZoomViewer;
