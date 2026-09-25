import React, { useState } from 'react';

export const DuvEuvComparator: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<'duv' | 'euv'>('euv');
  const [showEngineeringView, setShowEngineeringView] = useState<boolean>(false);

  return (
    <section
      id="duv-vs-euv"
      aria-labelledby="duv-euv-heading"
      className="scroll-mt-24 rounded-3xl border border-[#DCE5F2] bg-white p-5 sm:p-9 shadow-sm"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#145DB4] tracking-wider uppercase bg-[#EAF2FF] px-3 py-1 rounded-full border border-[#DCE5F2]">
              03 · Optical Architecture
            </span>
            <span className="text-xs text-slate-500 font-medium">193 nm Refractive vs. 13.5 nm Reflective</span>
          </div>
          <h2
            id="duv-euv-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A43]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            DUV vs. EUV Lithography
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl font-body">
            Compare how DUV and EUV lithography use very different optical architectures.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start lg:self-center">
          <button
            type="button"
            onClick={() => setSelectedTech('duv')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedTech === 'duv'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>DUV (193 nm Refractive)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTech('euv')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedTech === 'euv'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>EUV (13.5 nm Reflective)</span>
          </button>
        </div>
      </div>

      {/* OPTICAL PATH VISUAL CONTAINER */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md mb-8">
        
        {/* Schematic Subheader with View Switcher */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4 text-xs font-mono">
          <span className="text-slate-200 font-bold uppercase tracking-wider flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: selectedTech === 'duv' ? '#38BDF8' : '#818CF8' }}
            />
            {selectedTech === 'duv'
              ? 'DUV OPTICAL PATH · REFRACTIVE TRANSMISSION'
              : 'EUV OPTICAL PATH · ALL-REFLECTIVE HIGH VACUUM'}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-bold" style={{ color: selectedTech === 'duv' ? '#38BDF8' : '#C084FC' }}>
              {selectedTech === 'duv' ? 'Wavelength λ = 193 nm' : 'Wavelength λ = 13.5 nm'}
            </span>
            <button
              type="button"
              onClick={() => setShowEngineeringView(!showEngineeringView)}
              className="text-[11px] font-mono text-cyan-300 hover:text-cyan-200 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg cursor-pointer border border-slate-700 transition-all"
            >
              {showEngineeringView ? '← Intuitive View' : 'Engineering View →'}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. DEFAULT LEARNER VIEW: LARGE, SIMPLE SHAPES, FEW LABELS */}
        {/* ======================================================== */}
        {!showEngineeringView && (
          <div className="w-full h-[280px] sm:h-[320px] flex items-center justify-center">
            {selectedTech === 'duv' ? (
              /* DUV INTUITIVE VIEW: SOURCE → REFRACTIVE OPTICS → RETICLE → WAFER */
              <svg
                viewBox="0 0 760 260"
                className="w-full h-full"
                role="img"
                aria-label="Intuitive DUV refractive optical path: Source to lenses to reticle to wafer"
              >
                <defs>
                  <linearGradient id="duvBeam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="lensGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7DD3FC" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                </defs>

                {/* 1. SOURCE BLOCK */}
                <rect x="40" y="80" width="120" height="100" rx="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="100" cy="112" r="14" fill="#38BDF8" />
                <text x="100" y="142" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                  ArF LASER
                </text>
                <text x="100" y="158" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  λ = 193 nm
                </text>

                {/* BEAM 1: SOURCE → LENSES */}
                <polygon points="160,110 260,70 260,190 160,150" fill="url(#duvBeam)" />

                {/* 2. REFRACTIVE GLASS LENSES */}
                <rect x="250" y="45" width="110" height="170" rx="20" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4,4" />
                <ellipse cx="285" cy="130" rx="16" ry="65" fill="url(#lensGrad)" opacity="0.85" />
                <ellipse cx="325" cy="130" rx="16" ry="65" fill="url(#lensGrad)" opacity="0.85" />
                <text x="305" y="238" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="bold">
                  REFRACTIVE OPTICS
                </text>

                {/* BEAM 2: LENSES → RETICLE */}
                <polygon points="345,90 435,75 435,185 345,170" fill="url(#duvBeam)" />

                {/* 3. TRANSMISSIVE RETICLE (PHOTOMASK) */}
                <rect x="435" y="60" width="18" height="140" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                {/* Absorber chrome bands */}
                <rect x="435" y="95" width="18" height="20" fill="#0F172A" />
                <rect x="435" y="145" width="18" height="20" fill="#0F172A" />
                <text x="444" y="40" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">
                  RETICLE MASK
                </text>

                {/* BEAM 3: RETICLE → WAFER (CONVERGING 4× FOCUS) */}
                <polygon points="455,80 640,122 640,138 455,180" fill="url(#duvBeam)" opacity="0.9" />

                {/* 4. SILICON WAFER */}
                <rect x="640" y="50" width="22" height="160" rx="6" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
                {/* Resist coat */}
                <rect x="640" y="50" width="6" height="160" rx="2" fill="#A855F7" />
                <text x="651" y="235" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">
                  WAFER
                </text>

                {/* Simple Stage Flow Text at Bottom */}
                <text x="380" y="255" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
                  Light passes straight through transmissive lenses and photomask onto the wafer
                </text>
              </svg>
            ) : (
              /* EUV INTUITIVE VIEW: SOURCE → REFLECTIVE OPTICS → REFLECTIVE MASK → WAFER */
              <svg
                viewBox="0 0 760 260"
                className="w-full h-full"
                role="img"
                aria-label="Intuitive EUV reflective optical path: Source to reflective mirrors to reflective mask to wafer"
              >
                <defs>
                  <linearGradient id="euvBeam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* High Vacuum Chamber Outline */}
                <rect x="25" y="20" width="710" height="220" rx="20" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6,4" />
                <text x="45" y="42" fill="#64748B" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  HIGH VACUUM ENVIRONMENT (NO AIR / NO GLASS ABSORPTION)
                </text>

                {/* 1. EUV PLASMA SOURCE */}
                <rect x="45" y="80" width="110" height="100" rx="16" fill="#1E293B" stroke="#F43F5E" strokeWidth="2.5" />
                <circle cx="100" cy="112" r="14" fill="#F43F5E" />
                <text x="100" y="142" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                  Sn Plasma
                </text>
                <text x="100" y="158" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  λ = 13.5 nm
                </text>

                {/* BEAM: SOURCE TO COLLECTOR MIRROR */}
                <polygon points="155,118 240,60 240,200" fill="url(#euvBeam)" opacity="0.6" />

                {/* 2. CURVED REFLECTIVE COLLECTOR MIRROR */}
                <path d="M 240,50 Q 275,130 240,210" fill="none" stroke="#818CF8" strokeWidth="7" strokeLinecap="round" />
                <text x="255" y="235" textAnchor="middle" fill="#818CF8" fontSize="12" fontWeight="bold">
                  MIRRORS
                </text>

                {/* BOUNCING BEAM TO REFLECTIVE MASK */}
                <polygon points="255,130 420,55 450,55" fill="url(#euvBeam)" />

                {/* 3. REFLECTIVE PHOTOMASK (TOP) */}
                <rect x="380" y="35" width="110" height="18" rx="4" fill="#E2E8F0" stroke="#818CF8" strokeWidth="2" />
                {/* Absorber pattern */}
                <rect x="405" y="47" width="15" height="6" fill="#0F172A" />
                <rect x="445" y="47" width="15" height="6" fill="#0F172A" />
                <text x="435" y="24" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">
                  REFLECTIVE MASK
                </text>

                {/* BOUNCING BEAM TO PROJECTION MIRROR */}
                <polygon points="435,53 520,185 540,185" fill="url(#euvBeam)" opacity="0.8" />

                {/* 4. PROJECTION OPTICS MIRROR (BOTTOM) */}
                <path d="M 505,200 Q 535,175 565,200" fill="none" stroke="#818CF8" strokeWidth="7" strokeLinecap="round" />

                {/* FINAL REFLECTED BEAM TO WAFER */}
                <polygon points="535,185 640,120 640,140" fill="url(#euvBeam)" opacity="0.9" />

                {/* 5. SILICON WAFER */}
                <rect x="640" y="50" width="22" height="160" rx="6" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
                <rect x="640" y="50" width="6" height="160" rx="2" fill="#A855F7" />
                <text x="651" y="235" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold">
                  WAFER
                </text>

                <text x="380" y="255" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
                  All optical elements reflect 13.5 nm EUV light using multilayer Mo/Si mirrors in vacuum
                </text>
              </svg>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ENGINEERING VIEW: DETAILED SCHEMATICS & SPECIFICATIONS */}
        {/* ======================================================== */}
        {showEngineeringView && (
          <div className="w-full h-[280px] sm:h-[320px] flex items-center justify-center">
            {selectedTech === 'duv' ? (
              /* DUV ENGINEERING SCHEMATIC */
              <svg viewBox="0 0 700 240" className="w-full h-full" role="img" aria-label="DUV Lithography engineering optical schematic">
                <rect x="20" y="90" width="110" height="60" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="75" y="118" textAnchor="middle" fill="#38BDF8" fontSize="10" fontFamily="'IBM Plex Mono', monospace" fontWeight="bold">
                  ArF LASER
                </text>
                <text x="75" y="132" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                  λ = 193 nm
                </text>

                <line x1="130" y1="120" x2="180" y2="120" stroke="#38BDF8" strokeWidth="4" strokeOpacity="0.8" />

                <ellipse cx="200" cy="120" rx="14" ry="45" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="200" y="60" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="'IBM Plex Mono', monospace">
                  Illuminator Lens
                </text>

                <polygon points="214,100 270,80 270,160 214,140" fill="#38BDF8" fillOpacity="0.25" />

                <rect x="270" y="70" width="10" height="100" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                <rect x="270" y="95" width="10" height="15" fill="#0F172A" />
                <rect x="270" y="130" width="10" height="15" fill="#0F172A" />
                <text x="275" y="55" textAnchor="middle" fill="#E2E8F0" fontSize="9" fontFamily="'IBM Plex Mono', monospace" fontWeight="bold">
                  Quartz Mask (4×)
                </text>

                <polygon points="280,80 340,70 340,170 280,160" fill="#38BDF8" fillOpacity="0.25" />

                <rect x="340" y="55" width="140" height="130" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                <ellipse cx="370" cy="120" rx="12" ry="48" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="1.5" />
                <ellipse cx="410" cy="120" rx="12" ry="52" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="1.5" />
                <ellipse cx="450" cy="120" rx="12" ry="46" fill="#0284C7" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="1.5" />
                <text x="410" y="42" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="'IBM Plex Mono', monospace" fontWeight="bold">
                  Refractive Optics Barrel
                </text>
                <text x="410" y="200" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                  Fused Silica &amp; CaF₂ Lenses (4× reduction)
                </text>

                <polygon points="480,105 570,118 570,122 480,135" fill="#38BDF8" fillOpacity="0.5" />

                <rect x="555" y="112" width="15" height="16" fill="#0284C7" fillOpacity="0.6" stroke="#38BDF8" strokeWidth="1" />
                <text x="562" y="100" textAnchor="middle" fill="#38BDF8" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                  H₂O (n=1.44)
                </text>

                <rect x="570" y="60" width="12" height="120" rx="2" fill="#64748B" stroke="#CBD5E1" strokeWidth="1" />
                <rect x="570" y="60" width="3" height="120" fill="#7C3AED" />
                <text x="615" y="115" textAnchor="start" fill="#CBD5E1" fontSize="9" fontFamily="'IBM Plex Mono', monospace" fontWeight="bold">
                  WAFER RESIST
                </text>

                <text x="350" y="225" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="'IBM Plex Mono', monospace">
                  Path: 193 nm Laser → Quartz Mask → Lens Column → Immersion Water → Wafer (Air/N₂)
                </text>
              </svg>
            ) : (
              /* EUV ENGINEERING SCHEMATIC */
              <svg viewBox="0 0 700 240" className="w-full h-full" role="img" aria-label="EUV Lithography engineering optical schematic in high vacuum">
                <rect x="15" y="25" width="670" height="185" rx="8" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />
                <text x="30" y="42" fill="#64748B" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                  HIGH VACUUM CHAMBER ENVIRONMENT (&lt; 10⁻³ Pa)
                </text>

                <g>
                  <circle cx="65" cy="115" r="7" fill="#F43F5E" />
                  <line x1="20" y1="115" x2="58" y2="115" stroke="#F43F5E" strokeWidth="2" strokeDasharray="2 2" />
                  <text x="65" y="95" textAnchor="middle" fill="#FDA4AF" fontSize="8" fontFamily="'IBM Plex Mono', monospace" fontWeight="bold">
                    Sn Plasma
                  </text>
                  <text x="65" y="138" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="'IBM Plex Mono', monospace">
                    50k droplets/s
                  </text>
                </g>

                <path d="M 95,65 Q 115,115 95,165" fill="none" stroke="#818CF8" strokeWidth="4" />
                <text x="105" y="180" textAnchor="middle" fill="#818CF8" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                  Collector Mirror
                </text>

                <line x1="65" y1="115" x2="105" y2="90" stroke="#C084FC" strokeWidth="2" strokeOpacity="0.7" />
                <line x1="65" y1="115" x2="105" y2="140" stroke="#C084FC" strokeWidth="2" strokeOpacity="0.7" />
                <polygon points="105,90 200,120 105,140" fill="#C084FC" fillOpacity="0.15" />

                <circle cx="200" cy="120" r="4" fill="#C084FC" />
                <text x="200" y="140" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                  Intermediate Focus
                </text>

                <polygon points="200,120 310,65 340,65" fill="#C084FC" fillOpacity="0.2" />

                <rect x="290" y="55" width="70" height="10" rx="1" fill="#E2E8F0" stroke="#818CF8" strokeWidth="1" />
                <rect x="305" y="55" width="10" height="10" fill="#0F172A" />
                <rect x="330" y="55" width="15" height="10" fill="#0F172A" />
                <text x="325" y="48" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="'IBM Plex Mono', monospace" fontWeight="bold">
                  Reflective Mask (Mo/Si)
                </text>

                <path d="M 325,65 L 430,120 L 400,170 L 480,135 L 560,120" fill="none" stroke="#C084FC" strokeWidth="3" strokeOpacity="0.8" />

                <path d="M 425,100 Q 435,120 425,140" fill="none" stroke="#818CF8" strokeWidth="3" />
                <path d="M 410,155 Q 395,170 410,185" fill="none" stroke="#818CF8" strokeWidth="3" />
                <path d="M 470,120 Q 485,135 470,150" fill="none" stroke="#818CF8" strokeWidth="3" />
                <text x="450" y="195" textAnchor="middle" fill="#818CF8" fontSize="8" fontFamily="'IBM Plex Mono', monospace">
                  Bragg Mirrors (Mo/Si multilayer pairs)
                </text>

                <rect x="570" y="60" width="12" height="120" rx="2" fill="#64748B" stroke="#CBD5E1" strokeWidth="1" />
                <rect x="570" y="60" width="3" height="120" fill="#7C3AED" />
                <text x="615" y="115" textAnchor="start" fill="#CBD5E1" fontSize="9" fontFamily="'IBM Plex Mono', monospace" fontWeight="bold">
                  WAFER RESIST
                </text>

                <text x="350" y="225" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="'IBM Plex Mono', monospace">
                  Path: LPP Plasma → Collector → IF → Reflective Mask → Projection Mirrors → Wafer (Vacuum)
                </text>
              </svg>
            )}
          </div>
        )}
      </div>

      {/* COMPARISON SPECIFICATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DUV Column */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            selectedTech === 'duv'
              ? 'bg-blue-50/40 border-blue-300 shadow-sm'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#102A43] font-sans">
              DUV (Deep Ultraviolet)
            </h3>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md">
              193 nm (ArF)
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-5 leading-relaxed font-body">
            DUV uses 193 nm light produced by an Argon Fluoride (ArF) excimer laser. The light passes through transmissive quartz lenses and quartz photomasks in an inert nitrogen environment.
          </p>

          <dl className="space-y-3 text-xs border-t border-slate-200/80 pt-4">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-500 font-medium">Light Source</dt>
              <dd className="font-semibold text-slate-900 font-mono">ArF Excimer Laser (193 nm)</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-500 font-medium">Optical Transmission</dt>
              <dd className="font-semibold text-slate-900 font-mono">Transmissive (Fused silica &amp; CaF₂)</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-500 font-medium">Reticle Architecture</dt>
              <dd className="font-semibold text-slate-900 font-mono">Transmissive quartz plate with chrome</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-slate-500 font-medium">Ambient Environment</dt>
              <dd className="font-semibold text-slate-900 font-mono">Purged nitrogen / atmospheric air</dd>
            </div>
          </dl>
        </div>

        {/* EUV Column */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            selectedTech === 'euv'
              ? 'bg-indigo-50/40 border-indigo-300 shadow-sm'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#102A43] font-sans">
              EUV (Extreme Ultraviolet)
            </h3>
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-md">
              13.5 nm (Soft X-ray)
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-5 leading-relaxed font-body">
            EUV uses 13.5 nm light generated by vaporizing microscopic molten tin droplets with a high-power CO₂ laser. Because EUV is absorbed by air and glass, the entire optical path uses reflective mirrors in high vacuum.
          </p>

          <dl className="space-y-3 text-xs border-t border-slate-200/80 pt-4">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-500 font-medium">Light Source</dt>
              <dd className="font-semibold text-slate-900 font-mono">Laser-Produced Tin Plasma (13.5 nm)</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-500 font-medium">Optical Transmission</dt>
              <dd className="font-semibold text-slate-900 font-mono">Reflective (Mo/Si multilayer Bragg mirrors)</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-500 font-medium">Reticle Architecture</dt>
              <dd className="font-semibold text-slate-900 font-mono">Reflective Mo/Si mask with absorber</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-slate-500 font-medium">Ambient Environment</dt>
              <dd className="font-semibold text-slate-900 font-mono">High vacuum (&lt; 10⁻³ Pa)</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default DuvEuvComparator;
