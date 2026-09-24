import React, { useState } from 'react';

export const YieldWaferMap: React.FC = () => {
  const [scenario, setScenario] = useState<'edge' | 'distributed' | 'cluster'>('edge');

  // 13x13 grid clipped to circular boundary
  const gridCoords = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
  const radius = 5.6;

  let totalCandidateDies = 0;
  let passingDies = 0;

  const dies: { r: number; c: number; x: number; y: number; isGood: boolean; isEdge: boolean }[] = [];

  gridCoords.forEach((r) => {
    gridCoords.forEach((c) => {
      const dist = Math.sqrt(r * r + c * c);
      if (dist <= radius) {
        totalCandidateDies++;
        let isGood = true;
        const isEdge = dist >= 4.8;

        if (scenario === 'edge') {
          // Edge-related defect pattern: dies near outer perimeter fail
          if (dist >= 4.4) isGood = false;
        } else if (scenario === 'distributed') {
          // Random point defect pattern
          const pseudoHash = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
          const rand = Math.abs(pseudoHash - Math.floor(pseudoHash));
          if (rand > 0.80) isGood = false;
        } else if (scenario === 'cluster') {
          // Localized defect cluster in upper-right quadrant
          if (r >= 1 && r <= 3 && c >= 1 && c <= 3) isGood = false;
        }

        if (isGood) passingDies++;

        dies.push({
          r,
          c,
          x: 180 + c * 24 - 10,
          y: 180 + r * 24 - 10,
          isGood,
          isEdge,
        });
      }
    });
  });

  const yieldPct = Math.round((passingDies / totalCandidateDies) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00A6A6] block">
            04 · Manufacturing Quality &amp; Sort
          </span>
          <h4
            className="text-lg font-bold text-[#102A43]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Wafer Yield Map
          </h4>
        </div>
        <div className="text-left sm:text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Yield: {yieldPct}% ({passingDies}/{totalCandidateDies} dies)
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
            Illustrative example (Not universal performance)
          </span>
        </div>
      </div>

      {/* Main Wafer Map: Substantially Enlarged Wafer Disc (Occupies Most of Pane) */}
      <div className="w-full h-[320px] sm:h-[360px] flex items-center justify-center relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden p-2">
        <svg
          viewBox="0 0 360 360"
          className="w-full h-full max-w-[340px]"
          role="img"
          aria-label="Substantially enlarged circular wafer yield map with symbol pass/fail indicators"
        >
          <defs>
            <clipPath id="waferMapClip">
              <circle cx="180" cy="180" r="162" />
            </clipPath>
          </defs>

          {/* Wafer Outer Rim / Chamfer Bevel */}
          <circle cx="180" cy="180" r="166" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />

          {/* Wafer Monocrystalline Silicon Disc */}
          <g clipPath="url(#waferMapClip)">
            <circle cx="180" cy="180" r="162" fill="#0F172A" />

            {/* Scribe Street Grid Lines */}
            {gridCoords.map((coord) => (
              <React.Fragment key={coord}>
                <line
                  x1={180 + coord * 24}
                  y1="10"
                  x2={180 + coord * 24}
                  y2="350"
                  stroke="#1E293B"
                  strokeWidth="1"
                />
                <line
                  x1="10"
                  y1={180 + coord * 24}
                  x2="350"
                  y2={180 + coord * 24}
                  stroke="#1E293B"
                  strokeWidth="1"
                />
              </React.Fragment>
            ))}

            {/* Individual Dies with Symbol + Color Representation */}
            {dies.map((die) => (
              <g key={`${die.r}-${die.c}`}>
                <rect
                  x={die.x}
                  y={die.y}
                  width="20"
                  height="20"
                  rx="3"
                  fill={die.isGood ? '#059669' : '#DC2626'}
                  stroke={die.isGood ? '#34D399' : '#F87171'}
                  strokeWidth="0.75"
                />
                {/* Symbol: Checkmark for pass, X for fail */}
                {die.isGood ? (
                  <path
                    d={`M ${die.x + 5} ${die.y + 10} L ${die.x + 9} ${die.y + 14} L ${die.x + 15} ${die.y + 6}`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d={`M ${die.x + 6} ${die.y + 6} L ${die.x + 14} ${die.y + 14} M ${die.x + 14} ${die.y + 6} L ${die.x + 6} ${die.y + 14}`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                )}
              </g>
            ))}

            {/* Wafer Alignment Notch at Bottom */}
            <path d="M 174 340 L 180 334 L 186 340 Z" fill="#E2E8F0" />
          </g>

          {/* Notch indicator text */}
          <text x="180" y="356" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
            ORIENTATION NOTCH
          </text>
        </svg>

        {/* Legend Overlay at Top Corner */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 text-[10px] font-mono shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 flex items-center justify-center text-white text-[9px]">✓</span>
            <span>Passing Die</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-800 font-semibold">
            <span className="w-3.5 h-3.5 rounded bg-red-600 flex items-center justify-center text-white text-[9px]">✕</span>
            <span>Defective Die</span>
          </div>
        </div>
      </div>

      {/* Scenario Controls Placed Beneath Wafer */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setScenario('edge')}
          className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
            scenario === 'edge'
              ? 'bg-cyan-50/80 border-[#00A6A6] text-[#102A43] shadow-xs font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="text-xs font-bold block mb-0.5">Edge Defect Loss</span>
          <span className="text-[11px] text-slate-500 block">Perimeter roll-off</span>
        </button>

        <button
          type="button"
          onClick={() => setScenario('distributed')}
          className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
            scenario === 'distributed'
              ? 'bg-cyan-50/80 border-[#00A6A6] text-[#102A43] shadow-xs font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="text-xs font-bold block mb-0.5">Random Particulates</span>
          <span className="text-[11px] text-slate-500 block">Poisson point defects</span>
        </button>

        <button
          type="button"
          onClick={() => setScenario('cluster')}
          className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
            scenario === 'cluster'
              ? 'bg-cyan-50/80 border-[#00A6A6] text-[#102A43] shadow-xs font-semibold'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="text-xs font-bold block mb-0.5">Cluster Defect</span>
          <span className="text-[11px] text-slate-500 block">Equipment scratch/drip</span>
        </button>
      </div>
    </div>
  );
};

export default YieldWaferMap;
