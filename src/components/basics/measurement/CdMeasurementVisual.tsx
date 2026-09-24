import React, { useState } from 'react';

export const CdMeasurementVisual: React.FC = () => {
  const [cdMode, setCdMode] = useState<'target' | 'narrower' | 'wider'>('target');

  const statusLabel =
    cdMode === 'target'
      ? 'Target CD (Nominal)'
      : cdMode === 'narrower'
      ? 'Narrower than Target'
      : 'Wider than Target';
  const statusColor = cdMode === 'target' ? '#00A6A6' : cdMode === 'narrower' ? '#D97706' : '#DC2626';

  // Dynamic caliper width based on mode
  const cdValue = cdMode === 'target' ? '18.0 nm' : cdMode === 'narrower' ? '14.2 nm' : '22.4 nm';
  const trenchHalfWidth = cdMode === 'target' ? 36 : cdMode === 'narrower' ? 26 : 48;
  const leftCaliperX = 250 - trenchHalfWidth;
  const rightCaliperX = 250 + trenchHalfWidth;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00A6A6] block">
            04 · Metrology &amp; Inspection
          </span>
          <h4
            className="text-lg font-bold text-[#102A43]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Critical Dimension (CD) Metrology
          </h4>
        </div>
        <div className="text-left sm:text-right">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
            {statusLabel}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
            Illustrative scenario value: ~18 nm target
          </span>
        </div>
      </div>

      {/* Main Visual: Clean High-Resolution SEM Trench SVG (75–85% of Component) */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-md bg-slate-950 flex flex-col items-center justify-center p-3">
        <svg
          viewBox="0 0 500 240"
          className="w-full h-[220px] sm:h-[260px]"
          role="img"
          aria-label="Scanning Electron Microscope SEM trench Critical Dimension measurement visual"
        >
          <defs>
            {/* SEM Grayscale Texture Gradients */}
            <linearGradient id="semFloorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="semPillarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="20%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="semEdgeGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>

          {/* Trench Bottom Floor (Deep Dark Inelastic Region) */}
          <rect x="0" y="0" width="500" height="240" fill="url(#semFloorGrad)" />

          {/* Left SEM Fin / Pillar */}
          <path
            d={`M 0 30 Q 80 25 ${leftCaliperX} 30 L ${leftCaliperX} 210 Q 80 215 0 210 Z`}
            fill="url(#semPillarGrad)"
          />
          {/* Left Edge Secondary Electron Brightness Edge */}
          <line
            x1={leftCaliperX}
            y1="30"
            x2={leftCaliperX}
            y2="210"
            stroke="#F8FAFC"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Right SEM Fin / Pillar */}
          <path
            d={`M ${rightCaliperX} 30 Q 380 25 500 30 L 500 210 Q 380 215 ${rightCaliperX} 210 Z`}
            fill="url(#semPillarGrad)"
          />
          {/* Right Edge Secondary Electron Brightness Edge */}
          <line
            x1={rightCaliperX}
            y1="30"
            x2={rightCaliperX}
            y2="210"
            stroke="#F8FAFC"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* LIVE METROLOGY SVG OVERLAY */}
          {/* Left Measurement Boundary (Vertical Dashed Cyan) */}
          <line
            x1={leftCaliperX}
            y1="10"
            x2={leftCaliperX}
            y2="230"
            stroke={statusColor}
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />

          {/* Right Measurement Boundary (Vertical Dashed Cyan) */}
          <line
            x1={rightCaliperX}
            y1="10"
            x2={rightCaliperX}
            y2="230"
            stroke={statusColor}
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />

          {/* Double-Headed CD Caliper Bracket (<------------>) */}
          <g>
            {/* Horizontal Arrow Line */}
            <line
              x1={leftCaliperX + 4}
              y1="120"
              x2={rightCaliperX - 4}
              y2="120"
              stroke={statusColor}
              strokeWidth="2.5"
            />
            {/* Left Arrow Head */}
            <polyline
              points={`${leftCaliperX + 10},114 ${leftCaliperX + 3},120 ${leftCaliperX + 10},126`}
              fill="none"
              stroke={statusColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Right Arrow Head */}
            <polyline
              points={`${rightCaliperX - 10},114 ${rightCaliperX - 3},120 ${rightCaliperX - 10},126`}
              fill="none"
              stroke={statusColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Central CD Value Badge */}
            <rect
              x="200"
              y="98"
              width="100"
              height="24"
              rx="6"
              fill="#0F172A"
              stroke={statusColor}
              strokeWidth="1"
            />
            <text
              x="250"
              y="114"
              textAnchor="middle"
              fill="#F8FAFC"
              fontSize="12"
              fontFamily="monospace"
              fontWeight="bold"
            >
              CD = {cdValue}
            </text>
          </g>

          {/* Live SEM Detector Annotation */}
          <text x="18" y="24" fill="#94A3B8" fontSize="10" fontFamily="monospace">
            CD-SEM TOP-DOWN PROJECTION · DETECTOR: SE2
          </text>
        </svg>

        {/* Live Bottom Dimension Annotation */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 pt-2 border-t border-slate-800">
          <span className="text-cyan-300 font-semibold">Trench Space Dimension</span>
          <span>Illustrative scenario value: {cdValue}</span>
        </div>
      </div>

      {/* Scenario Controls */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setCdMode('target')}
          className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
            cdMode === 'target'
              ? 'bg-cyan-50/80 border-[#00A6A6] text-[#102A43] shadow-xs font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00A6A6]" />
            <span className="text-xs font-bold">Target</span>
          </div>
          <span className="text-[11px] text-slate-500 block">In-specification (~18 nm)</span>
        </button>

        <button
          type="button"
          onClick={() => setCdMode('narrower')}
          className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
            cdMode === 'narrower'
              ? 'bg-amber-50/80 border-amber-500 text-amber-950 shadow-xs font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold">Narrower</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Under-dimensioned (~14.2 nm)</span>
        </button>

        <button
          type="button"
          onClick={() => setCdMode('wider')}
          className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
            cdMode === 'wider'
              ? 'bg-red-50/80 border-red-500 text-red-950 shadow-xs font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-bold">Wider</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Over-dimensioned (~22.4 nm)</span>
        </button>
      </div>
    </div>
  );
};

export default CdMeasurementVisual;
