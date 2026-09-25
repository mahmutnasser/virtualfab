import React, { useState, useRef } from 'react';

export type ScaleStage = 'wafer' | 'field' | 'die' | 'layer' | 'feature';

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
    callout: 'Repeating patterned fields across a 300 mm wafer contain many individual dies.',
    details:
      'This cleanroom view shows a patterned 300 mm wafer. The colorful diffraction reveals repeated structures across its surface.',
    dimensions: 'Diameter: 300 mm · Thickness: ~775 µm (Silicon substrate)',
  },
  {
    id: 'field',
    label: 'Exposure Field',
    levelNumber: 2,
    scaleMetric: 'Exposure area varies by scanner',
    headline: 'The Scanner Step-and-Scan Window',
    definition:
      'An exposure field is the rectangular area of the wafer patterned during one lithography exposure pass.',
    callout: 'Lithography scanners step across the wafer, printing one exposure field per exposure shot.',
    details:
      'Scanners expose one field at a time. This image illustrates a field containing four dies in two columns and two rows; field size and die count vary with the product and process.',
    dimensions: 'Illustrative layout: 2 columns × 2 rows · Dimensions vary by product',
  },
  {
    id: 'die',
    label: 'Die (Chip)',
    levelNumber: 3,
    scaleMetric: 'Product-dependent size',
    headline: 'The Independent Functional Integrated Circuit',
    definition:
      'A die is one individual integrated-circuit area on the wafer. Its function depends on the product being manufactured.',
    callout: 'The upper-right die in the four-die field is highlighted as one individual chip area.',
    details:
      'The successive insets show the wafer, a four-die field, and one highlighted die. This is an illustrative hierarchy, rather than a pixel-exact optical crop. After wafer-level processing and testing, dies are separated along scribe lanes before packaging.',
    dimensions: 'Die size varies by design · Separated along scribe lanes',
  },
  {
    id: 'layer',
    label: 'Layer',
    levelNumber: 4,
    scaleMetric: 'Thin films and patterned structures',
    headline: 'Structures Built in Successive Layers',
    definition:
      'A layer is material deposited or formed across the wafer, then often patterned into useful device or interconnect structures.',
    callout: 'The cutaway reveals the material interfaces of a three-fin gate structure.',
    details:
      'The conceptual cutaway distinguishes silicon fins and substrate, trench isolation, a thin gate dielectric, and the gate material. The next view shows the complete feature. These drawn interfaces and thicknesses are not metrology data.',
    dimensions: 'Illustrative gate cross section · Thicknesses and spacing are not to scale',
  },
  {
    id: 'feature',
    label: 'Nanoscale Feature',
    levelNumber: 5,
    scaleMetric: 'Nanoscale (sub-micron to ~10 nm)',
    headline: 'A Three-Fin Transistor Feature',
    definition:
      'A feature is a small physical structure that forms part of the chip, such as a transistor gate fin, contact via, or metal interconnect line.',
    callout: 'The same gate structure is shown intact: three silicon fins pass beneath a transverse gate.',
    details:
      'Within the patterned layers, the fins form channels while the gate crosses over them. This microscopy-inspired rendering explains their arrangement; it is not a measurement from an instrument.',
    dimensions: 'Illustrative nanoscale geometry · Not to scale',
  },
];

const SCALE_IMAGES: Record<ScaleStage, { src: string; alt: string }> = {
  wafer: {
    src: '/images/basics/hero-wafer-cleanroom.jpg',
    alt: 'Patterned silicon wafer held by gloved hands inside a cleanroom',
  },
  field: {
    src: '/images/basics/wafer-field-zoom.jpg',
    alt: 'Patterned wafer with a magnified inset illustrating a four-die exposure field',
  },
  die: {
    src: '/images/basics/wafer-field-die-hierarchy.jpg',
    alt: 'Patterned wafer, four-die field, and highlighted individual die in successive insets',
  },
  feature: {
    src: '/images/basics/scale/04_feature_finfet.jpg',
    alt: 'Microscopy-inspired rendering of three silicon fins crossed by a transverse FinFET gate',
  },
  layer: {
    src: '/images/basics/scale/05_layer_gate_cutaway.jpg',
    alt: 'Conceptual cross section of the same three-fin transistor, showing fin and gate material interfaces',
  },
};

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
      aria-label="Interactive scale viewer: Wafer to Nanoscale Feature zoom sequence"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`scroll-mt-24 rounded-3xl border border-[#DCE5F2] bg-white p-5 sm:p-9 shadow-sm flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5] select-none ${className}`.trim()}
    >
      {/* SECTION HEADER & STEPPER */}
      <div className="flex flex-col gap-5 border-b border-[#DCE5F2] pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#145DB4] tracking-wider uppercase bg-[#EAF2FF] px-3 py-1 rounded-full border border-[#DCE5F2]">
              01 · Explore Scale
            </span>
            <span className="text-xs text-slate-500 font-medium">Illustrative semiconductor scale journey</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A43]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            From wafer to the smallest structures
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl font-body">
            Choose a stage to see what changes and why it matters.
          </p>
        </div>

        {/* Stepper Tabs */}
        <div
          role="tablist"
          aria-label="Scale stages"
          className="flex items-center gap-2 max-w-full overflow-x-auto pb-1 self-start"
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
                className={`min-h-[44px] shrink-0 px-3.5 py-1.5 rounded-xl border font-body font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#F2F7FF] border-[#166FE5] text-[#173348]'
                    : 'bg-white border-[#DCE5F2] text-slate-600 hover:text-[#145DB4] hover:border-[#B8D1F7]'
                }`}
                type="button"
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-[#166FE5] text-white' : 'bg-[#EAF2FF] text-[#145DB4]'
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
      <div
        role="tabpanel"
        id={`panel-${currentStage}`}
        aria-labelledby={`tab-${currentStage}`}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-1"
      >
        
        {/* All five images remain mounted for a 300 ms crossfade between stages. */}
        <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[460px] rounded-2xl overflow-hidden border border-[#DCE5F2] bg-[#EDF3FA]">
          {SCALE_STAGES.map((stage) => (
            <div
              key={stage.id}
              aria-hidden={stage.id !== currentStage}
              className={`absolute inset-0 flex items-center justify-center p-3 sm:p-5 transition-opacity duration-300 motion-reduce:duration-0 ${
                stage.id === currentStage ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="relative w-full max-w-[740px] aspect-video max-h-[420px]">
                <img
                  src={SCALE_IMAGES[stage.id].src}
                  alt={stage.id === currentStage ? SCALE_IMAGES[stage.id].alt : ''}
                  className="absolute inset-0 w-full h-full object-contain rounded-2xl"
                  decoding="async"
                />

              </div>
            </div>
          ))}

          <div className="absolute z-20 top-3 left-3 max-w-[calc(100%-7rem)] rounded-lg border border-[#DCE5F2] bg-white/95 px-3 py-2 text-xs font-mono text-[#173348] backdrop-blur-md pointer-events-none shadow-sm">
            <span className="font-bold text-[#145DB4]">{currentIndex + 1}/5</span> {currentInfo.label}
            {currentStage === 'field' && <span> · 2×2 dies</span>}
          </div>

          {currentStage === 'feature' && (
            <button
              type="button"
              onClick={() => setShowFeatureEngineering((visible) => !visible)}
              aria-pressed={showFeatureEngineering}
              className="absolute z-20 top-3 right-3 min-h-[44px] px-3 rounded-lg text-xs font-mono bg-white/95 hover:bg-[#EAF2FF] text-[#145DB4] border border-[#DCE5F2] cursor-pointer shadow-sm"
            >
              {showFeatureEngineering ? 'Hide details' : 'Show details'}
            </button>
          )}

          {currentStage === 'feature' && showFeatureEngineering && (
            <div className="absolute z-20 bottom-12 left-3 right-3 sm:right-auto rounded-lg border border-[#DCE5F2] bg-white/95 px-3 py-2 text-xs text-[#173348] backdrop-blur-md shadow-sm">
              Three silicon fin channels pass beneath one transverse gate. Geometry is illustrative.
            </div>
          )}

          {(currentStage === 'feature' || currentStage === 'layer') && (
            <p className="absolute z-20 bottom-3 left-3 right-3 text-center text-[11px] text-[#173348] font-mono bg-white/90 rounded-md py-1 mx-auto max-w-md">
              Microscopy-inspired conceptual 3D rendering — not raw instrument data.
            </p>
          )}
        </div>

        {/* EXPLANATORY CONTENT (Col 5 / 12) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-left">
            
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#145DB4] uppercase tracking-wider">
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
            <div className="p-4 rounded-xl bg-[#EAF2FF] border border-[#DCE5F2] text-slate-800 text-sm">
              <span className="text-xs font-bold text-[#145DB4] uppercase tracking-wider block mb-1">
                What to notice
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
              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
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
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold bg-[#166FE5] hover:bg-[#145DB4] text-white transition-all shadow-xs cursor-pointer"
              >
                Next Level →
              </button>
            ) : (
              <button
                type="button"
                onClick={onNavigateToFab}
                aria-label="Experience scale in Virtual Fab"
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold bg-[#166FE5] hover:bg-[#145DB4] text-white transition-all shadow-xs cursor-pointer"
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
