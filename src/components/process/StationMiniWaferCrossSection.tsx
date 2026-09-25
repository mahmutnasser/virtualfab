import React from 'react';
import type { StationTelemetry } from '../../data/station-telemetry';

export interface StationMiniWaferCrossSectionProps {
  telemetry: StationTelemetry;
  className?: string;
}

export const StationMiniWaferCrossSection: React.FC<StationMiniWaferCrossSectionProps> = ({
  telemetry,
  className = '',
}) => {
  const { waferLayers, waferStateDescription } = telemetry;

  return (
    <div className={`p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 shadow-inner flex flex-col gap-2 ${className}`.trim()}>
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Wafer State Preview
        </span>
        <span className="text-slate-400 text-[10px]">Cross-Section</span>
      </div>

      {/* SVG Cross Section Schematic */}
      <div className="relative w-full h-16 rounded-lg overflow-hidden bg-slate-950/70 border border-slate-800 flex items-center justify-center">
        <svg
          viewBox="0 0 320 80"
          className="w-full h-full"
          role="img"
          aria-label={waferStateDescription}
        >
          <defs>
            <linearGradient id="miniSubstrateGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="miniOxideGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="miniResistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <pattern id="miniGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Background grid */}
          <rect width="320" height="80" fill="url(#miniGrid)" />

          {/* Substrate Base (Silicon) */}
          <rect x="10" y="52" width="300" height="24" rx="2" fill="url(#miniSubstrateGrad)" stroke="#64748b" strokeWidth="0.75" />
          <text x="160" y="67" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="600">
            Silicon Substrate (Si · 775 µm)
          </text>

          {/* Layer 1: Oxide Film */}
          {waferLayers.oxide && !waferLayers.etched && (
            <rect x="10" y="38" width="300" height="14" rx="1" fill="url(#miniOxideGrad)" stroke="#7dd3fc" strokeWidth="0.75" />
          )}

          {/* Layer 1 Etched: Patterned Oxide Ribs */}
          {waferLayers.oxide && waferLayers.etched && (
            <g fill="url(#miniOxideGrad)" stroke="#7dd3fc" strokeWidth="0.75">
              <rect x="10" y="38" width="50" height="14" rx="1" />
              <rect x="90" y="38" width="60" height="14" rx="1" />
              <rect x="180" y="38" width="60" height="14" rx="1" />
              <rect x="270" y="38" width="40" height="14" rx="1" />
            </g>
          )}

          {/* Layer 2: Photoresist (Continuous) */}
          {waferLayers.resist && !waferLayers.patterned && (
            <rect x="10" y="20" width="300" height="18" rx="1" fill="url(#miniResistGrad)" stroke="#fcd34d" strokeWidth="0.75" />
          )}

          {/* Layer 2: Photoresist Patterned (Developed gaps or exposure) */}
          {waferLayers.resist && waferLayers.patterned && (
            <g fill="url(#miniResistGrad)" stroke="#fcd34d" strokeWidth="0.75">
              <rect x="10" y="20" width="50" height="18" rx="1" />
              <rect x="90" y="20" width="60" height="18" rx="1" />
              <rect x="180" y="20" width="60" height="18" rx="1" />
              <rect x="270" y="20" width="40" height="18" rx="1" />
              {/* If lithography before develop: show exposed translucent segments */}
              {telemetry.stepId === 'lithography' && (
                <g fill="#f59e0b" fillOpacity="0.4" stroke="#fbbf24" strokeDasharray="2,2">
                  <rect x="60" y="20" width="30" height="18" />
                  <rect x="150" y="20" width="30" height="18" />
                  <rect x="240" y="20" width="30" height="18" />
                </g>
              )}
            </g>
          )}

          {/* Etched trench markers or arrows */}
          {waferLayers.etched && (
            <g stroke="#38bdf8" strokeWidth="1" strokeDasharray="1,2" fill="none">
              <line x1="75" y1="52" x2="75" y2="40" />
              <line x1="165" y1="52" x2="165" y2="40" />
              <line x1="255" y1="52" x2="255" y2="40" />
            </g>
          )}

          {/* Step-specific annotation badge */}
          {telemetry.stepId === 'deposition' && (
            <text x="160" y="47" textAnchor="middle" fill="#f0f9ff" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Deposited Film: SiO₂ (100 nm)
            </text>
          )}
          {telemetry.stepId === 'coat' && (
            <text x="160" y="32" textAnchor="middle" fill="#78350f" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Photoresist Polymer (300 nm)
            </text>
          )}
          {telemetry.stepId === 'lithography' && (
            <text x="160" y="14" textAnchor="middle" fill="#fde047" fontSize="8" fontFamily="monospace" fontWeight="bold">
              193 nm DUV Pattern Exposure ↓
            </text>
          )}
          {telemetry.stepId === 'develop' && (
            <text x="160" y="14" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Pattern Windows Cleared (TMAH)
            </text>
          )}
          {telemetry.stepId === 'adi' && (
            <text x="160" y="14" textAnchor="middle" fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold">
              CD-SEM Stencil Metrology (Pass)
            </text>
          )}
          {telemetry.stepId === 'etch' && (
            <text x="160" y="14" textAnchor="middle" fill="#f87171" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Anisotropic Plasma Trench Etch ↓
            </text>
          )}
          {telemetry.stepId === 'aei' && (
            <text x="160" y="14" textAnchor="middle" fill="#4ade80" fontSize="8" fontFamily="monospace" fontWeight="bold">
              AEI Metrology · Trench Profile In-Spec
            </text>
          )}
          {telemetry.stepId === 'strip' && (
            <text x="160" y="28" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
              Resist Stripped · Functional SiO₂ Pattern
            </text>
          )}
        </svg>
      </div>

      <p className="text-[11px] font-body text-slate-300 leading-snug">
        {waferStateDescription}
      </p>
    </div>
  );
};

export default StationMiniWaferCrossSection;
