import React, { useState } from 'react';

export interface ProcessVerb {
  id: string;
  verb: string;
  categoryName: string;
  tagline: string;
  color: string;
  bgLight: string;
  borderColor: string;
  examples: string[];
  scientificMechanism: string;
  whyCrucial: string;
}

export const PROCESS_VERBS: ProcessVerb[] = [
  {
    id: 'add',
    verb: 'ADD',
    categoryName: 'Deposition & Growth',
    tagline: 'Deposit new material film across the wafer surface',
    color: '#0284C7',
    bgLight: '#F0F9FF',
    borderColor: '#BAE6FD',
    examples: ['CVD (Chemical Vapor Deposition)', 'PVD (Sputter Metallization)', 'ALD (Atomic Layer Deposition)', 'Thermal Oxidation'],
    scientificMechanism:
      'Gaseous chemical precursors react or metal targets are physically sputtered to deposit atomic monolayers or nanometer-scale insulating, semiconducting, or conducting films across the wafer.',
    whyCrucial:
      'Microchips are three-dimensional stacks of dozens of layers; every functional level requires precise film thickness, high density, and uniform material composition.',
  },
  {
    id: 'pattern',
    verb: 'PATTERN',
    categoryName: 'Lithography & Track',
    tagline: 'Define where materials belong using light and photoresist',
    color: '#7C3AED',
    bgLight: '#F5F3FF',
    borderColor: '#DDD6FE',
    examples: ['Resist Spin Coating', 'DUV / EUV Exposure', 'Post-Exposure Bake', 'Aqueous TMAH Development'],
    scientificMechanism:
      'Photosensitive polymers record reduced optical light patterns projected through photomasks, creating chemical solubility boundaries that dissolve into protective 3D stencils.',
    whyCrucial:
      'Lithography is the dimensional throttle that determines minimum transistor feature size, gate density, and layer-to-layer overlay accuracy.',
  },
  {
    id: 'remove',
    verb: 'REMOVE',
    categoryName: 'Etch & Clean',
    tagline: 'Carve away unwanted material to transfer the pattern',
    color: '#DC2626',
    bgLight: '#FEF2F2',
    borderColor: '#FECACA',
    examples: ['Reactive Ion Etch (RIE)', 'Inductively Coupled Plasma (ICP)', 'Wet Chemical Cleans', 'Oxygen Plasma Strip'],
    scientificMechanism:
      'Energetic ions accelerated by an RF bias physically sputter target atoms while reactive radicals form volatile gas byproducts that are pumped away under vacuum.',
    whyCrucial:
      'Transforms temporary 2D light stencils into permanent 3D trenches, gate fins, and contact vias in solid dielectric or metal films.',
  },
  {
    id: 'flatten',
    verb: 'FLATTEN',
    categoryName: 'Chemical Mechanical Planarization (CMP)',
    tagline: 'Restore global planarity across complex topography',
    color: '#D97706',
    bgLight: '#FFFBEB',
    borderColor: '#FDE68A',
    examples: ['Interlayer Dielectric (ILD) Polish', 'Tungsten Contact CMP', 'Copper Dual-Damascene Polish', 'Post-CMP Scrub'],
    scientificMechanism:
      'Chemical slurry containing abrasive silica or alumina nanoparticles micro-etches surface topography while a rotating polyurethane pad mechanically polishes high spots flat.',
    whyCrucial:
      'Advanced lithography lenses have extremely shallow depth of focus (<100 nm). Without CMP planarization, uneven topography would accumulate and cause subsequent layers to defocus.',
  },
];

export const ProcessVerbsStrip: React.FC = () => {
  const [activeVerbId, setActiveVerbId] = useState<string>('add');
  const activeVerb = PROCESS_VERBS.find((v) => v.id === activeVerbId) || PROCESS_VERBS[0];

  return (
    <section
      id="process-verbs"
      aria-labelledby="process-verbs-heading"
      className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#00A6A6] tracking-wider uppercase bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200/60">
              04 · The Four Verbs
            </span>
            <span className="text-xs text-slate-500 font-medium">Foundational material operations</span>
          </div>
          <h2
            id="process-verbs-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A43]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            How Chips Are Built: The 4 Process Verbs
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl font-body">
            Virtually every complex integrated circuit is fabricated by repeatedly executing four core physical actions.
          </p>
        </div>

        {/* 4 Verb Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start lg:self-center">
          {PROCESS_VERBS.map((v) => {
            const isActive = v.id === activeVerbId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVerbId(v.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-[#102A43] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: v.color }}
                />
                <span>{v.verb}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ASYMMETRICAL 2-COLUMN VIEW (VISUAL DOMINANT ON LIGHT SURFACE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Dominant Visual Transformation (Col 7 / 12) on Light Surface */}
        <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center border border-slate-200/80 shadow-xs relative min-h-[360px] sm:min-h-[420px]">
          
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-200 pb-3 text-xs">
            <span
              className="font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: activeVerb.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeVerb.color }} />
              {activeVerb.verb} · {activeVerb.categoryName}
            </span>
            <span className="text-slate-500 font-medium">Physical Material Transformation</span>
          </div>

          <div className="w-full max-w-[480px] h-[250px] sm:h-[290px] flex items-center justify-center relative">
            
            {/* VERB 1: ADD (Deposition / Growth) */}
            {activeVerb.id === 'add' && (
              <svg viewBox="0 0 460 250" className="w-full h-full" role="img" aria-label="ADD deposition process illustration">
                <defs>
                  <linearGradient id="depGasFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Precursor Gas Inflow Atoms */}
                <g fill="#0284C7">
                  <circle cx="120" cy="40" r="5" opacity="0.8" />
                  <circle cx="180" cy="30" r="4" opacity="0.6" />
                  <circle cx="230" cy="50" r="5" opacity="0.9" />
                  <circle cx="290" cy="35" r="4" opacity="0.7" />
                  <circle cx="340" cy="45" r="5" opacity="0.8" />
                </g>

                {/* Downward Inflow Arrows */}
                <path d="M 140,45 L 140,95 M 230,55 L 230,95 M 320,45 L 320,95" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="4,3" />
                <polygon points="135,95 140,105 145,95" fill="#0284C7" />
                <polygon points="225,95 230,105 235,95" fill="#0284C7" />
                <polygon points="315,95 320,105 325,95" fill="#0284C7" />

                <text x="230" y="28" fill="#0284C7" fontSize="12" fontWeight="bold" textAnchor="middle">
                  VAPOR PRECURSOR ATOMS (CVD / ALD)
                </text>

                {/* Growing Added Film (Cyan Dielectric/Metal) */}
                <rect x="50" y="115" width="360" height="40" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
                <text x="230" y="140" fill="#0C4A6E" fontSize="12" fontWeight="bold" textAnchor="middle">
                  NEWLY DEPOSITED FILM LAYER
                </text>

                {/* Silicon Substrate Base */}
                <rect x="50" y="155" width="360" height="65" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="1" />
                <text x="230" y="193" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">
                  SILICON WAFER SUBSTRATE
                </text>
              </svg>
            )}

            {/* VERB 2: PATTERN (Lithography) */}
            {activeVerb.id === 'pattern' && (
              <svg viewBox="0 0 460 250" className="w-full h-full" role="img" aria-label="PATTERN lithography process illustration">
                <defs>
                  <linearGradient id="lightCone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* Reticle Mask Floating Above */}
                <rect x="90" y="20" width="280" height="26" rx="4" fill="#E2E8F0" stroke="#7C3AED" strokeWidth="1.5" />
                <rect x="150" y="20" width="45" height="26" fill="#0F172A" />
                <rect x="265" y="20" width="45" height="26" fill="#0F172A" />
                <text x="230" y="37" fill="#0F172A" fontSize="10" fontWeight="bold" textAnchor="middle">
                  RETICLE PHOTOMASK
                </text>

                {/* UV Exposure Beams */}
                <polygon points="90,46 150,46 135,115 75,115" fill="url(#lightCone)" />
                <polygon points="195,46 265,46 280,115 180,115" fill="url(#lightCone)" />
                <polygon points="310,46 370,46 385,115 325,115" fill="url(#lightCone)" />

                {/* Photoresist Layer with Latent Pattern */}
                <rect x="50" y="115" width="360" height="40" rx="4" fill="#A855F7" stroke="#7E22CE" strokeWidth="1.5" />
                {/* Exposed Latent Stripes */}
                <rect x="180" y="115" width="100" height="40" fill="#FDE047" opacity="0.85" />
                <text x="230" y="140" fill="#713F12" fontSize="11" fontWeight="bold" textAnchor="middle">
                  LATENT CHEMICAL EXPOSURE
                </text>

                {/* Underlying Material */}
                <rect x="50" y="155" width="360" height="65" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="1" />
                <text x="230" y="193" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">
                  UNDERLYING FILM & SUBSTRATE
                </text>
              </svg>
            )}

            {/* VERB 3: REMOVE (Etch) */}
            {activeVerb.id === 'remove' && (
              <svg viewBox="0 0 460 250" className="w-full h-full" role="img" aria-label="REMOVE plasma etch process illustration">
                {/* Reactive Ion Plasma Beam */}
                <path d="M 180,25 L 180,105 M 280,25 L 280,105" stroke="#DC2626" strokeWidth="2.5" strokeDasharray="4,2" />
                <polygon points="175,105 180,115 185,105" fill="#DC2626" />
                <polygon points="275,105 280,115 285,105" fill="#DC2626" />
                <text x="230" y="45" fill="#DC2626" fontSize="12" fontWeight="bold" textAnchor="middle">
                  DIRECTIONAL RIE PLASMA IONS ↓
                </text>

                {/* Standing Protective Resist Stencil Blocks */}
                <rect x="50" y="95" width="90" height="35" rx="2" fill="#9333EA" stroke="#7E22CE" />
                <rect x="195" y="95" width="70" height="35" rx="2" fill="#9333EA" stroke="#7E22CE" />
                <rect x="320" y="95" width="90" height="35" rx="2" fill="#9333EA" stroke="#7E22CE" />

                {/* Etched Dielectric with Carved Trench Openings */}
                <path
                  d="M 50,130 L 140,130 L 140,175 L 195,175 L 195,130 L 265,130 L 265,175 L 320,175 L 320,130 L 410,130 L 410,180 L 50,180 Z"
                  fill="#0284C7"
                  stroke="#0369A1"
                  strokeWidth="1.5"
                />
                <text x="168" y="160" fill="#DC2626" fontSize="10" fontWeight="bold">
                  ETCHED
                </text>
                <text x="293" y="160" fill="#DC2626" fontSize="10" fontWeight="bold">
                  ETCHED
                </text>

                {/* Silicon Substrate Base */}
                <rect x="50" y="180" width="360" height="45" rx="2" fill="#334155" stroke="#1E293B" />
                <text x="230" y="208" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">
                  SILICON SUBSTRATE
                </text>
              </svg>
            )}

            {/* VERB 4: FLATTEN (CMP Planarization) */}
            {activeVerb.id === 'flatten' && (
              <svg viewBox="0 0 460 250" className="w-full h-full" role="img" aria-label="FLATTEN CMP planarization process illustration">
                {/* Rotating CMP Polishing Pad Carrier */}
                <rect x="90" y="25" width="280" height="38" rx="6" fill="#475569" stroke="#334155" strokeWidth="2" />
                <text x="230" y="49" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ROTATING POLISHING PAD (DOWNFORCE ↓)
                </text>

                {/* Chemical Abrasive Slurry Film */}
                <rect x="70" y="68" width="320" height="18" rx="3" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                <text x="230" y="81" fill="#92400E" fontSize="9" fontWeight="bold" textAnchor="middle">
                  CHEMICAL-MECHANICAL SLURRY INTERFACE
                </text>

                {/* Planarized Topography: Left side rough/high, right side polished completely flat */}
                <path
                  d="M 50,120 L 150,105 L 180,125 L 220,100 L 260,110 L 410,110 L 410,165 L 50,165 Z"
                  fill="#F59E0B"
                  stroke="#D97706"
                  strokeWidth="1.5"
                />
                <line x1="260" y1="85" x2="260" y2="165" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="140" y="145" fill="#78350F" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Pre-CMP Rough Topography
                </text>
                <text x="335" y="145" fill="#78350F" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ✓ Post-CMP Planar Flat
                </text>

                {/* Silicon Substrate Base */}
                <rect x="50" y="165" width="360" height="55" rx="2" fill="#334155" stroke="#1E293B" />
                <text x="230" y="198" fill="#F8FAFC" fontSize="11" fontWeight="bold" textAnchor="middle">
                  SILICON WAFER SUBSTRATE
                </text>
              </svg>
            )}
          </div>
        </div>

        {/* Verb Explanation (Col 5 / 12) in Clean Inter Typography */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: activeVerb.color }}>
              <span>Verb Action</span>
              <span>·</span>
              <span>{activeVerb.categoryName}</span>
            </div>
            <h3
              className="text-2xl font-bold text-[#102A43]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {activeVerb.verb}: {activeVerb.tagline}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Scientific Mechanism */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-[#102A43] block mb-1">
                How It Physically Works:
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-body">
                {activeVerb.scientificMechanism}
              </p>
            </div>

            {/* Why Crucial */}
            <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-100">
              <span className="text-xs font-bold text-[#00A6A6] block mb-1">
                Why It Is Crucial in Manufacturing:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-body">
                {activeVerb.whyCrucial}
              </p>
            </div>

            {/* Industry Equipment Examples */}
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Common Fab Process Examples:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeVerb.examples.map((ex, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-sans px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProcessVerbsStrip;
