import React, { useState } from 'react';

export interface PatterningStep {
  stepNumber: number;
  id: string;
  name: string;
  shortSummary: string;
  whatHappens: string;
  whyExists: string;
  failureMode: string;
  beforeLabel: string;
  afterLabel: string;
}

export const PATTERNING_STEPS: PatterningStep[] = [
  {
    stepNumber: 1,
    id: 'coat',
    name: '1. Resist Coat',
    shortSummary: 'Spin-coat a continuous photosensitive polymer film across the wafer.',
    whatHappens:
      'Liquid photoresist is dispensed onto the center of the spinning wafer (illustrative scenario: 2000–4000 RPM) to create a continuous photoresist film across the wafer surface (illustrative thickness: ~50–500 nm) over the underlying dielectric layer.',
    whyExists:
      'Silicon dioxide and metal films cannot be directly shaped with light; photoresist acts as a temporary, light-sensitive recording medium.',
    failureMode:
      'Thickness non-uniformity across the wafer causes focus variations during lithography; particulates trapped in the resist cause pinhole defects.',
    beforeLabel: 'Before Coating (Bare Dielectric Surface)',
    afterLabel: 'After Coating (Continuous Resist Film)',
  },
  {
    stepNumber: 2,
    id: 'exposure',
    name: '2. Optical Exposure',
    shortSummary: 'Project circuit pattern through reticle reduction optics into resist.',
    whatHappens:
      'Ultraviolet photons (e.g. 193 nm DUV or 13.5 nm EUV) pass through the transparent apertures of the photomask reticle, projecting a reduced optical pattern into the photoresist without removing any material.',
    whyExists:
      'Transfers the master circuit pattern from the reticle onto the wafer at extreme nanometer resolution.',
    failureMode:
      'Under-exposure produces undersized openings; over-exposure causes critical features to erode or collapse; optical defocus blurs edges.',
    beforeLabel: 'Before Exposure (Uniform Resist Film)',
    afterLabel: 'Latent Image Formed (UV Light Patterned)',
  },
  {
    stepNumber: 3,
    id: 'chem-change',
    name: '3. Chemical Solubility Change',
    shortSummary: 'Photochemical reaction renders exposed resist soluble in developer.',
    whatHappens:
      'Photon absorption generates acid via Photoacid Generators (PAG). During post-exposure bake, thermal energy catalytically cleaves polymer solubility inhibitors, making exposed regions chemically soluble.',
    whyExists:
      'Establishes a steep chemical contrast boundary so liquid developer can selectively dissolve exposed from unexposed areas.',
    failureMode:
      'Excessive acid diffusion blurs feature boundaries; acid loss to underlying substrate causes resist "footing".',
    beforeLabel: 'Latent Acid Pattern (Pre-Bake)',
    afterLabel: 'Soluble Acid-Cleaved Polymer (Post-Bake)',
  },
  {
    stepNumber: 4,
    id: 'develop',
    name: '4. Aqueous Development',
    shortSummary: 'Developer solution dissolves exposed resist, revealing the 3D stencil mask.',
    whatHappens:
      'Aqueous alkaline developer (TMAH) dissolves and rinses away the acid-cleaved positive resist, leaving unexposed resist structures that form a protective physical stencil over the dielectric.',
    whyExists:
      'Etch plasma requires physical access to target dielectric material beneath while preserving protected regions.',
    failureMode:
      'Resist scumming (residue left at feature bottom) prevents etching; capillary force during rinse drying causes high-aspect-ratio pattern collapse.',
    beforeLabel: 'Before Develop (Continuous Resist)',
    afterLabel: 'After Develop (3D Resist Stencil Formed)',
  },
  {
    stepNumber: 5,
    id: 'etch',
    name: '5. Etch Transfer',
    shortSummary: 'Reactive plasma directionally removes dielectric through resist openings.',
    whatHappens:
      'In a vacuum chamber, reactive ion etch (RIE) plasma accelerates energetic ions vertically into the wafer. Exposed dielectric is chemically and physically etched away; resist protects the material beneath.',
    whyExists:
      'Photoresist is only a temporary polymer; the permanent functional layer (silicon dioxide, nitride, or metal) must be physically sculpted.',
    failureMode:
      'Insufficient etch selectivity erodes the resist stencil before reaching depth; non-directional etching creates severe undercut.',
    beforeLabel: 'Before Etch (Unetched Dielectric Under Stencil)',
    afterLabel: 'After Etch (Dielectric Etched to Substrate)',
  },
  {
    stepNumber: 6,
    id: 'strip',
    name: '6. Resist Strip & Result',
    shortSummary: 'Sacrificial photoresist is removed, leaving the permanent microfeature.',
    whatHappens:
      'Oxygen plasma ashing and wet chemical cleans strip away the sacrificial resist polymer. The cleanly patterned functional dielectric structures remain bonded to the silicon substrate.',
    whyExists:
      'Photoresist is an organic polymer; leaving it on the wafer would contaminate subsequent high-temperature furnace, implantation, or metal deposition steps.',
    failureMode:
      'Carbonized resist polymer residues left behind cause contact open defects or interfacial delamination on subsequent layers.',
    beforeLabel: 'Before Strip (Resist Still Present on Features)',
    afterLabel: 'After Strip (Permanent Patterned Dielectric)',
  },
];

export interface PatterningAsset {
  after: string;
  before: string | null;
  altAfter: string;
  altBefore: string;
}

export const PATTERNING_ASSETS: PatterningAsset[] = [
  {
    after: '/images/basics/patterning-01-resist-coat.png',
    before: null,
    altAfter: 'After Coating: Continuous photoresist film over dielectric and silicon substrate',
    altBefore: 'Before Coating: Bare dielectric film over silicon substrate',
  },
  {
    after: '/images/basics/patterning-02-optical-exposure.png',
    before: '/images/basics/patterning-01-resist-coat.png',
    altAfter: 'Optical Exposure: UV light projecting reticle pattern into photoresist',
    altBefore: 'Before Exposure: Uniform photoresist film ready for patterning',
  },
  {
    after: '/images/basics/patterning-03-chemical-change.png',
    before: '/images/basics/patterning-02-optical-exposure.png',
    altAfter: 'Chemical Change: Exposed resist chemically altered and soluble',
    altBefore: 'Before Chemical Change: Latent optical exposure',
  },
  {
    after: '/images/basics/patterning-04-aqueous-development.png',
    before: '/images/basics/patterning-03-chemical-change.png',
    altAfter: 'Aqueous Development: Soluble resist dissolved away, revealing 3D stencil mask',
    altBefore: 'Before Development: Continuous resist with soluble regions',
  },
  {
    after: '/images/basics/patterning-05-etch-transfer.png',
    before: '/images/basics/patterning-04-aqueous-development.png',
    altAfter: 'Etch Transfer: Reactive plasma directionally etching dielectric down to substrate',
    altBefore: 'Before Etch: Unetched dielectric beneath photoresist stencil',
  },
  {
    after: '/images/basics/patterning-06-resist-strip.png',
    before: '/images/basics/patterning-05-etch-transfer.png',
    altAfter: 'Resist Strip: Sacrificial photoresist removed, permanent dielectric microstructure remains',
    altBefore: 'Before Strip: Sacrificial photoresist still covering etched dielectric',
  },
];

// Unified Isometric Material Block Component with identical geometry & perspective
const IsometricPatternBlock: React.FC<{
  stepIndex: number;
  showAfter: boolean;
  className?: string;
  isThumbnail?: boolean;
}> = ({ stepIndex, showAfter, className = '', isThumbnail = false }) => {
  const asset = PATTERNING_ASSETS[stepIndex];
  const imgSrc = showAfter ? asset?.after : asset?.before;
  const imgAlt = showAfter ? asset?.altAfter : asset?.altBefore;

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={imgAlt || `Step ${stepIndex + 1} Visual`}
        className={`w-full h-full object-contain rounded-xl ${className}`.trim()}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 520 380"
      className={`w-full h-full ${className}`.trim()}
      role="img"
      aria-label={`2.5D Isometric block representation for Step ${stepIndex + 1}`}
    >
      <defs>
        {/* Silicon Substrate Gradients */}
        <linearGradient id="isoSubstrateTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="isoSubstrateLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id="isoSubstrateRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Dielectric (SiO2) Gradients */}
        <linearGradient id="isoOxideTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="isoOxideLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="isoOxideRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Photoresist Gradients */}
        <linearGradient id="isoResistTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id="isoResistLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
        <linearGradient id="isoResistRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7E22CE" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>

        {/* UV Exposure Light Beam Gradient */}
        <linearGradient id="uvLightBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FACC15" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FACC15" stopOpacity="0.25" />
        </linearGradient>

        {/* Chemical Change Hatch Pattern */}
        <pattern id="chemHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#FDE047" strokeWidth="2.5" />
        </pattern>
      </defs>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. SILICON SUBSTRATE BASE (IDENTICAL ACROSS ALL 6 STEPS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Substrate Left Face */}
      <polygon points="120,240 260,310 260,345 120,275" fill="url(#isoSubstrateLeft)" stroke="#334155" strokeWidth="0.5" />
      {/* Substrate Right Face */}
      <polygon points="260,310 400,240 400,275 260,345" fill="url(#isoSubstrateRight)" stroke="#1E293B" strokeWidth="0.5" />
      {/* Substrate Top Surface */}
      <polygon points="260,170 400,240 260,310 120,240" fill="url(#isoSubstrateTop)" stroke="#475569" strokeWidth="0.5" />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. DIELECTRIC LAYER (SiO2) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* Steps 1..4: Solid continuous planar block */}
      {stepIndex < 4 && (
        <g id="solid-dielectric">
          <polygon points="120,205 260,275 260,310 120,240" fill="url(#isoOxideLeft)" />
          <polygon points="260,275 400,205 400,240 260,310" fill="url(#isoOxideRight)" />
          <polygon points="260,135 400,205 260,275 120,205" fill="url(#isoOxideTop)" />
        </g>
      )}

      {/* Step 5 (Etch) Before: Solid dielectric. After: Dielectric etched into 2 bars */}
      {stepIndex === 4 && !showAfter && (
        <g id="solid-dielectric-pre-etch">
          <polygon points="120,205 260,275 260,310 120,240" fill="url(#isoOxideLeft)" />
          <polygon points="260,275 400,205 400,240 260,310" fill="url(#isoOxideRight)" />
          <polygon points="260,135 400,205 260,275 120,205" fill="url(#isoOxideTop)" />
        </g>
      )}

      {/* Step 5 After & Step 6: 2 Patterned Dielectric Ridges standing on Substrate */}
      {(stepIndex === 5 || (stepIndex === 4 && showAfter)) && (
        <g id="patterned-dielectric">
          {/* Ridge 1 (Left-Center) */}
          <polygon points="150,220 205,247 205,282 150,255" fill="url(#isoOxideLeft)" />
          <polygon points="205,247 315,192 315,227 205,282" fill="url(#isoOxideRight)" />
          <polygon points="260,165 315,192 205,247 150,220" fill="url(#isoOxideTop)" />

          {/* Ridge 2 (Right-Center) */}
          <polygon points="235,262 290,289 290,324 235,297" fill="url(#isoOxideLeft)" />
          <polygon points="290,289 385,242 385,277 290,324" fill="url(#isoOxideRight)" />
          <polygon points="330,215 385,242 290,289 235,262" fill="url(#isoOxideTop)" />
        </g>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. PHOTORESIST LAYER / LITHOGRAPHY PHENOMENA */}
      {/* ───────────────────────────────────────────────────────────── */}
      
      {/* STEP 1: Resist Coat (Solid Purple Film) */}
      {stepIndex === 0 && showAfter && (
        <g id="step1-coated-resist">
          <polygon points="120,170 260,240 260,275 120,205" fill="url(#isoResistLeft)" />
          <polygon points="260,240 400,170 400,205 260,275" fill="url(#isoResistRight)" />
          <polygon points="260,100 400,170 260,240 120,170" fill="url(#isoResistTop)" />
        </g>
      )}

      {/* STEP 2: Optical Exposure (UV Light through Reticle Mask onto Resist) */}
      {stepIndex === 1 && (
        <g id="step2-exposure">
          {/* Base Resist */}
          <polygon points="120,170 260,240 260,275 120,205" fill="url(#isoResistLeft)" />
          <polygon points="260,240 400,170 400,205 260,275" fill="url(#isoResistRight)" />
          <polygon points="260,100 400,170 260,240 120,170" fill="url(#isoResistTop)" />

          {/* Photomask Reticle hovering above */}
          <g id="reticle-mask">
            <polygon points="140,40 280,110 380,60 240,-10" fill="#1E293B" stroke="#00A6A6" strokeWidth="1.5" />
            {/* Transparent Aperture Slits on Mask */}
            <polygon points="190,45 230,65 290,35 250,15" fill="#38BDF8" opacity="0.9" />
            <polygon points="245,72 275,87 325,62 295,47" fill="#38BDF8" opacity="0.9" />
            <text x="310" y="20" fill="#38BDF8" fontSize="11" fontFamily="monospace" fontWeight="bold">
              RETICLE MASK
            </text>
          </g>

          {/* Downward UV Light Columns */}
          <polygon points="190,45 230,65 230,225 190,205" fill="url(#uvLightBeam)" />
          <polygon points="230,65 290,35 290,195 230,225" fill="url(#uvLightBeam)" />

          <polygon points="245,72 275,87 275,247 245,232" fill="url(#uvLightBeam)" />
          <polygon points="275,87 325,62 325,222 275,247" fill="url(#uvLightBeam)" />

          {/* Latent Light Strips in Resist */}
          <polygon points="190,205 230,225 290,195 250,175" fill="#FEF08A" opacity="0.85" />
          <polygon points="245,232 275,247 325,222 295,207" fill="#FEF08A" opacity="0.85" />
        </g>
      )}

      {/* STEP 3: Chemical Solubility Change */}
      {stepIndex === 2 && (
        <g id="step3-chem-change">
          {/* Base Unexposed Resist (Remains Purple) */}
          <polygon points="120,170 260,240 260,275 120,205" fill="url(#isoResistLeft)" />
          <polygon points="260,240 400,170 400,205 260,275" fill="url(#isoResistRight)" />
          <polygon points="260,100 400,170 260,240 120,170" fill="url(#isoResistTop)" />

          {/* Chemically altered regions (Acid-cleaved, highly soluble) */}
          <polygon points="190,205 230,225 290,195 250,175" fill="url(#chemHatch)" stroke="#FDE047" strokeWidth="1" />
          <polygon points="245,232 275,247 325,222 295,207" fill="url(#chemHatch)" stroke="#FDE047" strokeWidth="1" />
          
          <polygon points="190,205 230,225 230,245 190,225" fill="#EAB308" opacity="0.7" />
          <polygon points="245,232 275,247 275,267 245,252" fill="#EAB308" opacity="0.7" />
        </g>
      )}

      {/* STEP 4: Aqueous Development (Soluble resist dissolved, stencil remains) */}
      {stepIndex === 3 && (
        <g id="step4-develop">
          {/* Standing Resist Ridge 1 */}
          <polygon points="150,185 205,212 205,247 150,220" fill="url(#isoResistLeft)" />
          <polygon points="205,212 315,157 315,192 205,247" fill="url(#isoResistRight)" />
          <polygon points="260,130 315,157 205,212 150,185" fill="url(#isoResistTop)" />

          {/* Standing Resist Ridge 2 */}
          <polygon points="235,227 290,254 290,289 235,262" fill="url(#isoResistLeft)" />
          <polygon points="290,254 385,207 385,242 290,289" fill="url(#isoResistRight)" />
          <polygon points="330,180 385,207 290,254 235,227" fill="url(#isoResistTop)" />
        </g>
      )}

      {/* STEP 5: Etch Transfer (Plasma downward etching uncovered dielectric) */}
      {stepIndex === 4 && (
        <g id="step5-etch">
          {/* Standing Resist Ridges acting as etch mask on top */}
          <polygon points="150,185 205,212 205,247 150,220" fill="url(#isoResistLeft)" />
          <polygon points="205,212 315,157 315,192 205,247" fill="url(#isoResistRight)" />
          <polygon points="260,130 315,157 205,212 150,185" fill="url(#isoResistTop)" />

          <polygon points="235,227 290,254 290,289 235,262" fill="url(#isoResistLeft)" />
          <polygon points="290,254 385,207 385,242 290,289" fill="url(#isoResistRight)" />
          <polygon points="330,180 385,207 290,254 235,227" fill="url(#isoResistTop)" />

          {/* Downward Reactive Plasma Ion Arrows */}
          <g stroke="#38BDF8" strokeWidth="2" strokeDasharray="3,3">
            <line x1="130" y1="120" x2="130" y2="185" markerEnd="url(#arrow)" />
            <line x1="220" y1="140" x2="220" y2="215" markerEnd="url(#arrow)" />
            <line x1="360" y1="110" x2="360" y2="175" markerEnd="url(#arrow)" />
          </g>
          <text x="110" y="115" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">
            RIE PLASMA IONS ↓
          </text>
        </g>
      )}

      {/* STEP 6: Resist Strip (Clean Patterned Dielectric Permanent Microstructure) */}
      {stepIndex === 5 && (
        <g id="step6-strip">
          {/* Resist is completely stripped; only permanent dielectric ridges remain (rendered above) */}
          <circle cx="260" cy="140" r="14" fill="#10B981" opacity="0.2" />
          <circle cx="260" cy="140" r="8" fill="#10B981" />
          <path d="M 256 140 L 259 143 L 265 137" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <text x="282" y="144" fill="#34D399" fontSize="11" fontFamily="monospace" fontWeight="bold">
            PERMANENT STRUCTURE
          </text>
        </g>
      )}

      {/* Step Title Watermark for Thumbnails */}
      {isThumbnail && (
        <rect x="0" y="0" width="520" height="380" fill="transparent" />
      )}
    </svg>
  );
};

interface PatterningMiniLessonProps {
  onOpenFab?: () => void;
}

export const PatterningMiniLesson: React.FC<PatterningMiniLessonProps> = ({ onOpenFab }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [showAfter, setShowAfter] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'interactive' | 'sequence'>('interactive');

  const step = PATTERNING_STEPS[activeStepIndex];

  return (
    <section
      id="patterning-lesson"
      aria-labelledby="patterning-heading"
      className="scroll-mt-24 rounded-3xl border border-[#DCE5F2] bg-white p-5 sm:p-9 shadow-sm"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#145DB4] tracking-wider uppercase bg-[#EAF2FF] px-3 py-1 rounded-full border border-[#DCE5F2]">
              02 · Patterning Visual Story
            </span>
            <span className="text-xs text-slate-500 font-medium">Physical material transformation</span>
          </div>
          <h2
            id="patterning-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A43]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            How a Pattern Becomes Physical
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl font-body">
            Patterning uses light, chemistry, and selective removal to transfer a circuit layout into permanent material on the wafer.
          </p>
        </div>

        {/* View Mode Toggle: Single Step vs Full 6-Block Sequence */}
        <div className="flex items-center gap-1 bg-[#F2F7FF] p-1.5 rounded-2xl border border-[#DCE5F2] self-start lg:self-center">
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            aria-pressed={viewMode === 'interactive'}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'interactive'
                ? 'bg-white text-[#145DB4] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Detailed Step View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sequence')}
            aria-pressed={viewMode === 'sequence'}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'sequence'
                ? 'bg-white text-[#145DB4] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full 6-Step Overview
          </button>
        </div>
      </div>

      {/* STEP SELECTOR NAVIGATION */}
      <div className="mb-6 overflow-x-auto pb-2">
        <nav aria-label="Patterning steps" className="flex gap-2 min-w-max">
          {PATTERNING_STEPS.map((s, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveStepIndex(idx);
                  setViewMode('interactive');
                  setShowAfter(true);
                }}
                aria-current={isActive && viewMode === 'interactive' ? 'step' : undefined}
                className={`flex min-h-[44px] items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive && viewMode === 'interactive'
                    ? 'bg-[#EAF2FF] text-[#145DB4] border border-[#166FE5] font-semibold'
                    : 'bg-white text-slate-600 hover:bg-[#F2F7FF] hover:text-[#145DB4] border border-[#DCE5F2]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isActive && viewMode === 'interactive'
                      ? 'bg-[#166FE5] text-white'
                      : 'bg-[#EAF2FF] text-[#145DB4]'
                  }`}
                >
                  {idx + 1}
                </span>
                <span>{s.name.replace(/^\d+\.\s*/, '')}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* VIEW A: DETAILED STEP VIEW (VISUAL DOMINANT 65–80%) */}
      {viewMode === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Light image frame lets the material colors remain the focus. */}
          <div className="lg:col-span-7 bg-[#EDF3FA] rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center border border-[#DCE5F2] relative overflow-hidden min-h-[360px] sm:min-h-[440px]">
            
            {/* Top Bar: Step Label & Before/After Toggle */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#DCE5F2] pb-3 text-xs">
              <div className="flex items-center gap-2 font-mono text-[#145DB4] font-semibold">
                <span>Step {step.stepNumber} of {PATTERNING_STEPS.length}</span>
              </div>

              {/* Before / After Toggle */}
              <div className="flex items-center gap-1 bg-white border border-[#DCE5F2] rounded-xl p-1" role="group" aria-label="View material before or after this step">
                <button
                  type="button"
                  onClick={() => setShowAfter(false)}
                  aria-pressed={!showAfter}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    !showAfter ? 'bg-[#166FE5] text-white' : 'text-slate-600 hover:bg-[#EAF2FF]'
                  }`}
                >
                  Before
                </button>
                <button
                  type="button"
                  onClick={() => setShowAfter(true)}
                  aria-pressed={showAfter}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    showAfter ? 'bg-[#166FE5] text-white' : 'text-slate-600 hover:bg-[#EAF2FF]'
                  }`}
                >
                  After
                </button>
              </div>
            </div>

            {/* Clean Programmatic 2.5D Isometric Block SVG */}
            <div className="w-full max-w-[480px] h-[270px] sm:h-[310px] flex items-center justify-center relative">
              <IsometricPatternBlock stepIndex={activeStepIndex} showAfter={showAfter} />

              {/* Dynamic Status Pill */}
              <div className="absolute bottom-2 left-2 right-2 sm:right-auto bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-[#DCE5F2] text-xs font-mono text-[#173348] shadow-sm">
                {showAfter ? step.afterLabel : step.beforeLabel}
              </div>
            </div>

            {/* Material Legend & Color Convention Note */}
            <div className="w-full mt-3 pt-3 border-t border-[#DCE5F2] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#A855F7]" />
                <span>Photoresist (Purple convention)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#38BDF8]" />
                <span>Dielectric (SiO₂)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#475569]" />
                <span>Silicon Substrate</span>
              </div>
            </div>
          </div>

          {/* Right Explanation Column */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <span className="text-xs font-semibold text-[#145DB4] uppercase tracking-wider block mb-1">
                Operation {step.stepNumber} of {PATTERNING_STEPS.length}
              </span>
              <h3
                className="text-2xl font-bold text-[#102A43]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {step.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600 font-medium">
                {step.shortSummary}
              </p>
            </div>

            <div className="space-y-4">
              {/* Question 1: What is happening? */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#102A43] mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#166FE5]" />
                  <h4>What is Happening?</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-body">
                  {step.whatHappens}
                </p>
              </div>

              {/* Question 2: Why does it exist? */}
              <div className="p-4 rounded-xl bg-[#EAF2FF] border border-[#DCE5F2]">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#102A43] mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#166FE5]" />
                  <h4>Why Does This Step Exist?</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-body">
                  {step.whyExists}
                </p>
              </div>

              {/* Question 3: Failure Mode */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center gap-2 font-semibold text-xs text-amber-900 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h4>What If It Fails?</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-body">
                  {step.failureMode}
                </p>
              </div>
            </div>

            {onOpenFab && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenFab}
                  className="w-full min-h-[44px] py-3 rounded-xl bg-[#166FE5] hover:bg-[#145DB4] text-white font-body font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>See This Sequence in Virtual Fab</span>
                  <span className="font-mono text-sm">→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW B: ALL SIX PHYSICAL STAGES */}
      {viewMode === 'sequence' && (
        <div className="space-y-6">
          <div className="bg-[#EDF3FA] rounded-2xl p-4 sm:p-6 border border-[#DCE5F2]">
            <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-6 text-xs text-slate-600 border-b border-[#DCE5F2] pb-3">
              <span className="text-[#145DB4] font-semibold">Six stages, one material stack</span>
              <span>Conceptual sequence · select a stage for details</span>
            </div>
            
            {/* 6 Clean Isometric Blocks in a Unified Strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {PATTERNING_STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setViewMode('interactive');
                    setShowAfter(true);
                  }}
                  className="bg-white rounded-xl border border-[#DCE5F2] hover:border-[#166FE5] p-2.5 flex flex-col justify-between cursor-pointer transition-colors shadow-sm group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166FE5]"
                >
                  <div className="w-full aspect-[4/3] flex items-center justify-center">
                    <IsometricPatternBlock stepIndex={idx} showAfter={true} isThumbnail={true} />
                  </div>
                  <div className="pt-2 border-t border-[#DCE5F2] text-left">
                    <span className="text-[10px] font-mono text-[#145DB4] font-bold block">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#173348] group-hover:text-[#145DB4] block">
                      {s.name.replace(/^\d+\.\s*/, '')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PatterningMiniLesson;
