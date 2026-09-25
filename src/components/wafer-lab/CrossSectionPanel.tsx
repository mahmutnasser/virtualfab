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

  // Derive layer presence
  const hasOxide = waferState.layers.some(
    (l) => ('material' in l ? l.material === 'oxide' : l.type === 'oxide') || l.id === 'oxide-film',
  );
  const hasResist = waferState.layers.some(
    (l) => ('material' in l ? l.material === 'photoresist' : l.type === 'photoresist') || l.id === 'photoresist-film',
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

      {/* Main SVG Cross-Section Renderer */}
      <div className="my-4 flex items-center justify-center relative">
        <WaferCrossSectionSVG
          waferState={waferState}
          showMetrologyCalipers={inspectionMode}
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
              <span className="text-[10px] text-slate-400 block uppercase">Dielectric (SiO₂)</span>
              <span className={`font-bold ${hasOxide ? 'text-teal-600' : 'text-slate-400'}`}>
                {hasOxide ? '100.0 nm' : '0.0 nm'}
              </span>
              <span className="text-[10px] text-slate-500 block">n = 1.46 (PECVD)</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Photoresist (PR)</span>
              <span className={`font-bold ${hasResist ? 'text-indigo-600' : 'text-slate-400'}`}>
                {hasResist ? '300.0 nm' : '0.0 nm'}
              </span>
              <span className="text-[10px] text-slate-500 block">n = 1.68 (193nm)</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Profile & Uniformity</span>
              <span className="font-bold text-slate-800">θ = 89.4°</span>
              <span className="text-[10px] text-slate-500 block">3σ = 1.1 nm</span>
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
