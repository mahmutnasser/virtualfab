import React from 'react';
import ExpandableSection from '../ui/ExpandableSection';

export interface EngineeringStepData {
  title: string;
  category: string;
  summary: string;
  sourceBadge: string;
  columns: Array<{
    title: string;
    sourceBadge?: string;
    description: string;
  }>;
  physicsFormula?: {
    label: string;
    formula: string;
    explanation: string;
  };
  processWindow: Array<{
    parameter: string;
    targetValue: string;
    tolerance: string;
  }>;
}

export const ENGINEERING_STEP_DATA: Record<string, EngineeringStepData> = {
  deposition: {
    title: 'Engineering View • Film Deposition Mechanics',
    category: 'Material Synthesis',
    summary:
      'In semiconductor fabrication, Deposition introduces dielectric, semiconducting, or conductive thin films onto the wafer without consuming the underlying substrate.',
    sourceBadge: '[SRC-FAB-PROCESS-01]',
    columns: [
      {
        title: 'Chemical Vapor Deposition (CVD)',
        sourceBadge: '[SRC-DEPOSITION-01]',
        description:
          'Precursor gases (e.g. SiH₄ + N₂O) react chemically on the heated wafer surface at ~300°C–800°C to grow solid films with conformal coverage across complex topologies.',
      },
      {
        title: 'Atomic Layer Deposition (ALD)',
        sourceBadge: '[SRC-DEVICE-ADV-01]',
        description:
          'Pulsed sequential self-limiting surface reactions deposit material one atomic monolayer at a time, achieving sub-nanometer thickness uniformity and defect prevention.',
      },
    ],
    physicsFormula: {
      label: 'Surface Reaction Growth Kinetics (Arrhenius Law)',
      formula: 'R = R₀ · exp(-Eₐ / k_B T)',
      explanation:
        'In the reaction-rate limited regime at moderate temperatures, deposition rate R increases exponentially with temperature T, governed by activation energy Eₐ.',
    },
    processWindow: [
      { parameter: 'Chamber Pressure', targetValue: '2.5 Torr', tolerance: '±0.1 Torr' },
      { parameter: 'Wafer Temperature', targetValue: '350°C', tolerance: '±2.5°C' },
      { parameter: 'SiH₄ / N₂O Gas Ratio', targetValue: '1 : 20', tolerance: '±1.0%' },
      { parameter: 'Target Thickness', targetValue: '100.0 nm', tolerance: '±1.5 nm' },
    ],
  },
  coat: {
    title: 'Engineering View • Spin-Coating Fluid Dynamics',
    category: 'Polymer Rheology',
    summary:
      'Spin-coating dispenses liquid photoresist polymer dissolved in casting solvent onto the center of a rapidly rotating wafer, utilizing centrifugal balance to yield sub-nanometer thickness uniformity.',
    sourceBadge: '[SRC-FAB-PROCESS-01]',
    columns: [
      {
        title: 'Centrifugal Thinning & Emslie Model',
        sourceBadge: '[SRC-SEMICON-MFG-01]',
        description:
          'Rotational acceleration (2000–4000 RPM) forces fluid outward against viscous drag. Film thinning transitions from fluid flow to evaporation-driven mass loss as viscosity increases exponentially.',
      },
      {
        title: 'Soft-Bake & Edge Bead Removal (EBR)',
        sourceBadge: '[SRC-FAB-PROCESS-01]',
        description:
          'A post-coat thermal bake (90°C–110°C) drives off ~85% of casting solvents to freeze polymer density. Solvent dispensing at the outer 2 mm edge removes thick beads before chuck contact.',
      },
    ],
    physicsFormula: {
      label: 'Emslie-Bonner-Peck Film Thickness Scaling',
      formula: 'h_final ∝ ω^(-1/2) · η^(1/3)',
      explanation:
        'Final resist thickness h_final scales inversely with the square root of angular velocity ω and directly with polymer viscosity η.',
    },
    processWindow: [
      { parameter: 'Spin Speed', targetValue: '3200 RPM', tolerance: '±5 RPM' },
      { parameter: 'Resist Viscosity', targetValue: '18.5 cP', tolerance: '±0.5 cP' },
      { parameter: 'Soft-Bake Hotplate', targetValue: '100°C', tolerance: '±0.5°C' },
      { parameter: 'Coated Thickness', targetValue: '300.0 nm', tolerance: '±2.0 nm' },
    ],
  },
  lithography: {
    title: 'Engineering View • Optical Lithography & Rayleigh Limits',
    category: 'Wave Optics & Photochemistry',
    summary:
      'Projection lithography reduces quartz reticle layout patterns 4× through high numerical aperture immersion lenses, transferring circuit imagery into light-sensitive photoacid generators (PAG).',
    sourceBadge: '[SRC-LITHO-EUV-01]',
    columns: [
      {
        title: 'Rayleigh Resolution Scaling',
        sourceBadge: '[SRC-LITHO-EUV-01]',
        description:
          'Diffraction limits the smallest resolvable pitch. Shorter exposure wavelengths (193 nm DUV or 13.5 nm EUV) and water-immersion optics (NA = 1.35) enable sub-micron patterning.',
      },
      {
        title: 'Chemically Amplified Resist (CAR)',
        sourceBadge: '[SRC-METROLOGY-01]',
        description:
          'Each absorbed UV photon generates an acid catalyst H⁺. During post-exposure bake, one acid molecule catalytically cleaves hundreds of blocking groups, boosting chemical contrast.',
      },
    ],
    physicsFormula: {
      label: 'Rayleigh Diffraction Criterion',
      formula: 'CD = k₁ · (λ / NA)   |   DOF = k₂ · (λ / NA²)',
      explanation:
        'Critical dimension CD scales with exposure wavelength λ over numerical aperture NA. Process factor k₁ is optimized with optical proximity correction (OPC).',
    },
    processWindow: [
      { parameter: 'Exposure Wavelength', targetValue: '193.3 nm (ArF)', tolerance: '±0.05 nm' },
      { parameter: 'Numerical Aperture (NA)', targetValue: '1.35 (Immersion)', tolerance: 'Fixed optic' },
      { parameter: 'Exposure Dose', targetValue: '24.5 mJ/cm²', tolerance: '±0.2 mJ/cm²' },
      { parameter: 'Defocus / Focus Offset', targetValue: '0.0 nm', tolerance: '±15.0 nm' },
    ],
  },
  develop: {
    title: 'Engineering View • Aqueous Development & ADI Metrology',
    category: 'Chemical Kinetics & Inspection',
    summary:
      'Aqueous alkaline developer (2.38% TMAH) selectively dissolves deprotected positive resist regions, sculpturing the 3D relief stencil mask before irreversible substrate etching.',
    sourceBadge: '[SRC-PROCESS-CONTROL-01]',
    columns: [
      {
        title: 'Deprotection Contrast & Dissolution',
        sourceBadge: '[SRC-METROLOGY-01]',
        description:
          'Tetramethylammonium hydroxide (TMAH) penetrates exposed polymer chains. A steep non-linear dissolution rate contrast (R_max / R_min > 10,000) prevents unexposed resist erosion.',
      },
      {
        title: 'After-Develop Inspection (ADI) Rework Window',
        sourceBadge: '[SRC-PROCESS-CONTROL-01]',
        description:
          'CD-SEM measures feature width and optical overlay checks alignment. Because the dielectric is unetched, defective wafers can be stripped and reworked with zero material yield loss.',
      },
    ],
    physicsFormula: {
      label: 'Mack Kinetic Dissolution Rate Model',
      formula: 'R(M) = R_max · [(a + 1)(1 - M)ⁿ / (a + (1 - M)ⁿ)] + R_min',
      explanation:
        'Dissolution rate R is a non-linear function of remaining inhibitor concentration M, steepening the resist sidewall profile angle toward 90°.',
    },
    processWindow: [
      { parameter: 'Developer Normality', targetValue: '0.26 N (2.38% TMAH)', tolerance: '±0.005 N' },
      { parameter: 'Puddle Time', targetValue: '45.0 s', tolerance: '±0.5 s' },
      { parameter: 'Reworkability Status', targetValue: '100% Reworkable', tolerance: 'Pre-etch window' },
      { parameter: 'ADI Critical Dimension', targetValue: '45.0 nm', tolerance: '±1.5 nm' },
    ],
  },
  etch: {
    title: 'Engineering View • Reactive Ion Etching & Plasma Physics',
    category: 'Plasma Transport & Surface Chemistry',
    summary:
      'In a low-pressure vacuum chamber, radiofrequency (RF) plasma generates energetic ions and reactive neutral radicals that directionally sculpt the exposed dielectric down to the silicon substrate.',
    sourceBadge: '[SRC-FAB-PROCESS-01]',
    columns: [
      {
        title: 'Anisotropic Ion-Assisted Etching (RIE)',
        sourceBadge: '[SRC-SEMICON-MFG-01]',
        description:
          'RF electric bias accelerates positive ions (e.g. CF₃⁺) normal to the wafer. Directional ion bombardment clears trench bottoms while leaving vertical sidewalls undamaged.',
      },
      {
        title: 'Etch Selectivity & Stop Interfaces',
        sourceBadge: '[SRC-PROCESS-CONTROL-01]',
        description:
          'Selectivity ratio S = ER_oxide / ER_resist must exceed 4:1 to prevent resist burnout. Fluorocarbon polymer passivation coats sidewalls to achieve strictly vertical profiles.',
      },
    ],
    physicsFormula: {
      label: 'Etch Profile Anisotropy',
      formula: 'A = 1 - (v_lateral / v_vertical)  ≈ 0.98',
      explanation:
        'Anisotropy A approaches 1 when vertical ion etch rate overwhelmingly dominates isotropic chemical lateral etching, creating vertical trench walls.',
    },
    processWindow: [
      { parameter: 'Chamber Vacuum Pressure', targetValue: '15.0 mTorr', tolerance: '±0.5 mTorr' },
      { parameter: 'RF Bias Power', targetValue: '250 W', tolerance: '±5 W' },
      { parameter: 'Etch Gas Chemistry', targetValue: 'CF₄ / CHF₃ / Ar', tolerance: 'Mass flow locked' },
      { parameter: 'AEI Trench Depth', targetValue: '100.0 nm', tolerance: '±2.0 nm' },
    ],
  },
  strip: {
    title: 'Engineering View • Oxygen Plasma Ashing & Surface Clean',
    category: 'Surface Cleanliness & Contamination Control',
    summary:
      'Dry oxygen plasma ashing oxidizes the sacrificial organic photoresist into volatile gases, followed by wet chemical cleans to leave permanent, atomically clean dielectric structures.',
    sourceBadge: '[SRC-FAB-PROCESS-01]',
    columns: [
      {
        title: 'Downstream Oxygen Plasma Ashing',
        sourceBadge: '[SRC-SEMICON-MFG-01]',
        description:
          'Microwave plasma dissociates molecular O₂ into atomic oxygen radicals O*. Radicals combust hydrocarbon resist chains into CO, CO₂, and H₂O vapor with zero substrate loss.',
      },
      {
        title: 'Wet SPM Clean & Surface Readiness',
        sourceBadge: '[SRC-FAB-PROCESS-01]',
        description:
          'Piranha clean (H₂SO₄ : H₂O₂) removes trace polymers and heavy metals. The cleanly patterned SiO₂ structure is rinsed, dried, and inspected for subsequent interconnect metal deposition.',
      },
    ],
    physicsFormula: {
      label: 'Radical Oxidation Combustion Reaction',
      formula: 'C_x H_y (polymer) + O* → CO₂ ↑ + H₂O ↑',
      explanation:
        'Ashing volatilizes solid organic photoresist polymers into gaseous effluents pumped out of the vacuum chamber, completely uncovering the permanent microstructure.',
    },
    processWindow: [
      { parameter: 'Microwave Ashing Power', targetValue: '1200 W', tolerance: '±20 W' },
      { parameter: 'Wafer Chuck Temperature', targetValue: '220°C', tolerance: '±3°C' },
      { parameter: 'Oxygen Radical Flow', targetValue: '2500 sccm O₂', tolerance: '±25 sccm' },
      { parameter: 'Resist Residue Defect Spec', targetValue: '< 0.02 defects/cm²', tolerance: 'Pass standard' },
    ],
  },
};

export interface EngineeringViewProps {
  stepId?: string;
  className?: string;
}

export const EngineeringView: React.FC<EngineeringViewProps> = ({
  stepId = 'deposition',
  className = '',
}) => {
  // Normalize stepId to match keys in ENGINEERING_STEP_DATA
  const normalizedId = stepId === 'adi' ? 'develop' : stepId === 'aei' ? 'etch' : stepId;
  const data = ENGINEERING_STEP_DATA[normalizedId] || ENGINEERING_STEP_DATA.deposition;

  return (
    <div className={className}>
      <ExpandableSection title={data.title} defaultOpen={false}>
        <div className="space-y-4 font-body text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
          
          {/* Header Summary with Category Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <p className="text-slate-700">
              {data.summary}
              <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {data.sourceBadge}
              </span>
            </p>
            <span className="shrink-0 self-start sm:self-center text-[10px] font-mono font-semibold uppercase tracking-wider text-[#00A6A6] bg-cyan-50 border border-cyan-200/60 px-2 py-0.5 rounded-full">
              {data.category}
            </span>
          </div>

          {/* Two-Column Deep-Dive */}
          <div className="grid sm:grid-cols-2 gap-3">
            {data.columns.map((col, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {col.title}
                  </span>
                  {col.sourceBadge && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {col.sourceBadge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-600 leading-relaxed block">
                  {col.description}
                </span>
              </div>
            ))}
          </div>

          {/* Physics Formula Box */}
          {data.physicsFormula && (
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-cyan-400 font-semibold">{data.physicsFormula.label}</span>
                <span className="text-slate-400 text-[10px]">Governing Relationship</span>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-amber-300 py-1 tracking-wide">
                {data.physicsFormula.formula}
              </div>
              <p className="text-[11px] text-slate-300 leading-normal font-body">
                {data.physicsFormula.explanation}
              </p>
            </div>
          )}

          {/* Real-World Equipment Process Window Table */}
          <div className="rounded-xl border border-slate-200/80 overflow-hidden text-left">
            <div className="bg-slate-100/80 px-3 py-1.5 border-b border-slate-200 text-[11px] font-mono font-semibold text-slate-700 flex items-center justify-between">
              <span>Standard Recipe Operating Window</span>
              <span className="text-[10px] text-slate-500 font-normal">Fab baseline</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white">
              {data.processWindow.map((item, idx) => (
                <div key={idx} className="p-2.5">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    {item.parameter}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">
                    {item.targetValue}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-600 block mt-0.5">
                    {item.tolerance}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </ExpandableSection>
    </div>
  );
};

export default EngineeringView;
