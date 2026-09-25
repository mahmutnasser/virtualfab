import React, { useState } from 'react';
import WaferCrossSectionSVG, { type SupportedWaferState } from './WaferCrossSectionSVG';
import LayerLegend from './LayerLegend';
import ScaleNotice from './ScaleNotice';

export interface CrossSectionPanelProps {
  waferState: SupportedWaferState;
  stepId?: string;
  className?: string;
}

export const CrossSectionPanel: React.FC<CrossSectionPanelProps> = ({
  waferState,
  stepId = 'deposition',
  className = '',
}) => {
  const [inspectionMode, setInspectionMode] = useState<boolean>(false);
  const [stackLevel, setStackLevel] = useState<'all' | 'level1' | 'level2' | 'level3' | 'level4'>('all');

  // Derive layer presence
  const hasOxide = waferState.layers.some(
    (l) => ('material' in l ? l.material === 'oxide' : l.type === 'oxide') || l.id === 'oxide-film',
  );
  const hasResist = waferState.layers.some(
    (l) => ('material' in l ? l.material === 'photoresist' : l.type === 'photoresist') || l.id === 'photoresist-film',
  );
  const hasMetal = waferState.layers.some(
    (l) => ('material' in l ? l.material === 'metal' : l.type === 'metal') || l.id.startsWith('metal-'),
  );

  // Step-specific primary inspection target label
  const stepTargetMap: Record<string, string> = {
    deposition: 'Thin Film Thickness (Spectroscopic Ellipsometry)',
    coat: 'Resist Thickness & Uniformity (Reflectometry)',
    lithography: 'Latent Image Overlay & Dose Alignment',
    develop: 'After-Develop Critical Dimension (CD-SEM)',
    adi: 'After-Develop Critical Dimension (CD-SEM)',
    etch: 'Trench Depth & Profile Angle (Cross-Sectional SEM)',
    aei: 'Trench Depth & Profile Angle (Cross-Sectional SEM)',
    strip: 'Resist Residue & Surface Particle Metrology',
    repeat: 'Multilevel Interconnect Stack & CMP Planarity Metrology',
  };
  const activeInspectionLabel = stepTargetMap[stepId.toLowerCase()] || 'Inline Layer Metrology';

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 lg:p-6 shadow-sm flex flex-col justify-between ${className}`.trim()}
    >
      {/* Top Header of Diagram with Mode Toggle & Scale Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#00a6a6] font-bold block">
            SCIENTIFIC CROSS-SECTION
          </span>
          <h2 className="font-display text-lg font-bold text-slate-900 mt-0.5">
            Wafer Layer Architecture
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Toggle: Architecture vs Metrology Inspection */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setInspectionMode(false)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                !inspectionMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Architecture
            </button>
            <button
              type="button"
              onClick={() => setInspectionMode(true)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                inspectionMode
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A6A6]" />
              <span>Metrology Calipers</span>
            </button>
          </div>

          <ScaleNotice />
        </div>
      </div>

      {/* Multi-Layer Stack Inspector Tabs */}
      {hasMetal && (
        <div className="mt-3 p-2 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              3D Layer Stack Inspector
            </span>
            <span className="font-mono text-[10px] text-amber-600 font-semibold">
              Copper Damascene & CMP Stack
            </span>
          </div>
          <div role="tablist" aria-label="3D Layer Stack Levels" className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              role="tab"
              aria-selected={stackLevel === 'all'}
              onClick={() => setStackLevel('all')}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                stackLevel === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Full 3D Stack
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={stackLevel === 'level2'}
              onClick={() => setStackLevel('level2')}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                stackLevel === 'level2'
                  ? 'bg-[#B45309] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              M1 & CMP
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={stackLevel === 'level3'}
              onClick={() => setStackLevel('level3')}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                stackLevel === 'level3'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              ILD & Vias
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={stackLevel === 'level4'}
              onClick={() => setStackLevel('level4')}
              className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                stackLevel === 'level4'
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              M2 Routing
            </button>
          </div>
        </div>
      )}

      {/* Main SVG Cross-Section Renderer */}
      <div className="my-4 flex items-center justify-center relative">
        <WaferCrossSectionSVG
          waferState={waferState}
          showMetrologyCalipers={inspectionMode}
          highlightLevel={stackLevel}
        />
      </div>

      {/* Metrology & Inspection Telemetry Card (Active in Metrology Mode) */}
      {inspectionMode ? (
        <div className="pt-3 border-t border-slate-100 font-mono text-xs animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-slate-500 font-semibold text-[11px] uppercase">
              {activeInspectionLabel}
            </span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              IN SPEC • 100% PASS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Substrate Z</span>
              <span className="font-bold text-slate-800">775.0 µm</span>
              <span className="text-[10px] text-slate-500 block">Si [100] bulk</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">
                {hasMetal ? 'Inter-Layer ILD' : 'Dielectric (SiO₂)'}
              </span>
              <span className={`font-bold ${hasOxide || hasMetal ? 'text-teal-600' : 'text-slate-400'}`}>
                {hasMetal ? '100.0 nm' : hasOxide ? '100.0 nm' : '0.0 nm'}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {hasMetal ? 'k = 2.7 (Low-k)' : 'n = 1.46 (PECVD)'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">
                {hasMetal ? 'Metal 1 (Cu)' : 'Photoresist (PR)'}
              </span>
              <span className={`font-bold ${hasMetal ? 'text-amber-600' : hasResist ? 'text-indigo-600' : 'text-slate-400'}`}>
                {hasMetal ? '150.0 nm' : hasResist ? '300.0 nm' : '0.0 nm'}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {hasMetal ? 'CMP Δz < 2nm' : 'n = 1.68 (193nm)'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">
                {hasMetal ? 'Metal 2 Routing' : 'Profile & Uniformity'}
              </span>
              <span className={`font-bold ${hasMetal ? 'text-amber-600' : 'text-slate-800'}`}>
                {hasMetal ? '200.0 nm' : 'θ = 89.4°'}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {hasMetal ? 'Via AR = 3.5:1' : '3σ = 1.1 nm'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Bottom Material Legend in Architecture Mode */
        <div className="pt-3 border-t border-slate-100">
          <LayerLegend layers={waferState.layers} />
        </div>
      )}
    </div>
  );
};

export default CrossSectionPanel;
