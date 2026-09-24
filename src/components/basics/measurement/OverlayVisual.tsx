import React, { useState } from 'react';

export const OverlayVisual: React.FC = () => {
  const [overlayMode, setOverlayMode] = useState<'aligned' | 'slight' | 'more'>('aligned');

  // Offset in pixels for registration visual
  const offsetX = overlayMode === 'aligned' ? 0 : overlayMode === 'slight' ? 14 : 32;
  const offsetY = overlayMode === 'aligned' ? 0 : overlayMode === 'slight' ? -9 : 22;

  // Illustrative scenario error values in nanometers
  const dxNm = overlayMode === 'aligned' ? '0.0' : overlayMode === 'slight' ? '+2.4' : '+6.8';
  const dyNm = overlayMode === 'aligned' ? '0.0' : overlayMode === 'slight' ? '-1.8' : '+5.2';

  const modeLabel =
    overlayMode === 'aligned'
      ? 'Aligned (Zero Error)'
      : overlayMode === 'slight'
      ? 'Slightly Offset'
      : 'Severe Offset';

  const statusColor = overlayMode === 'aligned' ? '#00A6A6' : overlayMode === 'slight' ? '#D97706' : '#DC2626';

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00A6A6] block">
            04 · Metrology &amp; Process Control
          </span>
          <h4
            className="text-lg font-bold text-[#102A43]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Layer-to-Layer Overlay
          </h4>
        </div>
        <div className="text-left sm:text-right">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
            {modeLabel}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
            Illustrative scenario: Box-in-Box mark
          </span>
        </div>
      </div>

      {/* Main Visual: Substantially Enlarged Semiconductor Box-in-Box Target */}
      <div className="w-full h-[240px] sm:h-[280px] flex items-center justify-center relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden p-2">
        <svg
          viewBox="0 0 440 260"
          className="w-full h-full"
          role="img"
          aria-label="Substantially enlarged Box-in-Box overlay registration mark"
        >
          {/* Subtle Metrology Reticle Crosshairs */}
          <line x1="30" y1="130" x2="410" y2="130" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4,4" />
          <line x1="220" y1="20" x2="220" y2="240" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4,4" />

          {/* 1. Existing Layer Outer Box Target (Layer N-1) */}
          <rect
            x="110"
            y="40"
            width="220"
            height="180"
            rx="6"
            fill="none"
            stroke="#0284C7"
            strokeWidth="4"
          />
          <text x="125" y="65" fill="#0284C7" fontSize="11" fontFamily="monospace" fontWeight="bold">
            LAYER N-1 TARGET (ETCHED)
          </text>

          {/* Target Center Optical Reticle */}
          <circle cx="220" cy="130" r="4.5" fill="#0284C7" />

          {/* 2. New Layer Inner Box Alignment Mark (Layer N) */}
          <g className="transition-all duration-300">
            <rect
              x={165 + offsetX}
              y={85 + offsetY}
              width="110"
              height="90"
              rx="4"
              fill={overlayMode === 'aligned' ? '#00A6A6' : statusColor}
              fillOpacity="0.18"
              stroke={overlayMode === 'aligned' ? '#00A6A6' : statusColor}
              strokeWidth="3.5"
            />
            {/* New Layer Mark Center Point */}
            <circle cx={220 + offsetX} cy={130 + offsetY} r="4" fill={statusColor} />

            <text
              x={175 + offsetX}
              y={108 + offsetY}
              fill="#102A43"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              LAYER N (RESIST)
            </text>

            {/* Error Displacement Vector Arrow (Active when offset > 0) */}
            {overlayMode !== 'aligned' && (
              <g>
                <line
                  x1="220"
                  y1="130"
                  x2={220 + offsetX}
                  y2={130 + offsetY}
                  stroke={statusColor}
                  strokeWidth="2.5"
                  strokeDasharray="2,2"
                />
                <circle cx={220 + offsetX} cy={130 + offsetY} r="3" fill={statusColor} />
                <text
                  x={220 + offsetX + (offsetX > 0 ? 8 : -8)}
                  y={130 + offsetY - 8}
                  fill={statusColor}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor={offsetX > 0 ? 'start' : 'end'}
                >
                  Δ ({dxNm}, {dyNm}) nm
                </text>
              </g>
            )}
          </g>

          {/* Center concentric alignment indicator */}
          {overlayMode === 'aligned' && (
            <text x="220" y="160" textAnchor="middle" fill="#00A6A6" fontSize="11" fontFamily="monospace" fontWeight="bold">
              ✓ CONCENTRIC (ΔX = 0, ΔY = 0)
            </text>
          )}
        </svg>

        {/* Minimal Bottom Live Vector Readout */}
        <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-500 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200">
          <span>Registration Mark: Box-in-Box</span>
          <span className="font-semibold text-slate-800">
            Illustrative: ΔX = {dxNm} nm, ΔY = {dyNm} nm
          </span>
        </div>
      </div>

      {/* Scenario Controls */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setOverlayMode('aligned')}
          className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
            overlayMode === 'aligned'
              ? 'bg-cyan-50/80 border-[#00A6A6] text-[#102A43] shadow-xs font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00A6A6]" />
            <span className="text-xs font-bold">Aligned</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Concentric centers</span>
        </button>

        <button
          type="button"
          onClick={() => setOverlayMode('slight')}
          className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
            overlayMode === 'slight'
              ? 'bg-amber-50/80 border-amber-500 text-amber-950 shadow-xs font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold">Slightly Offset</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Minor shift (tolerable)</span>
        </button>

        <button
          type="button"
          onClick={() => setOverlayMode('more')}
          className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
            overlayMode === 'more'
              ? 'bg-red-50/80 border-red-500 text-red-950 shadow-xs font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-bold">More Offset</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Severe error (via fail)</span>
        </button>
      </div>
    </div>
  );
};

export default OverlayVisual;
