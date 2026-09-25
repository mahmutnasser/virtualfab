export interface ChamberTelemetryMetric {
  label: string;
  value: string;
  unit?: string;
  badge?: string;
}

export interface StationTelemetry {
  stepId: string;
  bayName: string;
  hardwareRef: string;
  toolCategory: string;
  chamberState: 'VACUUM READY' | 'ATMOSPHERIC LOAD' | 'TRACK READY' | 'PLASMA IDLE' | 'OPTICAL READY';
  metrics: ChamberTelemetryMetric[];
  waferStateDescription: string;
  waferLayers: {
    substrate: boolean;
    oxide: boolean;
    resist: boolean;
    patterned: boolean;
    etched: boolean;
  };
}

export const STATION_TELEMETRY_MAP: Record<string, StationTelemetry> = {
  start: {
    stepId: 'start',
    bayName: 'Bay 0 — Ingress / FOUP Load Port',
    hardwareRef: '300 mm Automated Material Handling System (AMHS) Load Port',
    toolCategory: 'Automated Material Handling',
    chamberState: 'ATMOSPHERIC LOAD',
    metrics: [
      { label: 'Substrate', value: '300 mm Si p-type ⟨100⟩' },
      { label: 'Wafer Thickness', value: '775 µm' },
      { label: 'Environment', value: 'Class 1 ISO Mini-environment' },
      { label: 'Carrier Type', value: 'FOUP (Front Opening Pod)' },
    ],
    waferStateDescription: 'Bare monocrystalline silicon wafer, prime double-side polished',
    waferLayers: {
      substrate: true,
      oxide: false,
      resist: false,
      patterned: false,
      etched: false,
    },
  },
  deposition: {
    stepId: 'deposition',
    bayName: 'Bay 1 — Dielectric & Thin Film Deposition',
    hardwareRef: 'Centura / Producer Platform CVD Multi-Chamber Tool',
    toolCategory: 'Chemical Vapor Deposition (CVD)',
    chamberState: 'VACUUM READY',
    metrics: [
      { label: 'Chamber Temp', value: '400 °C' },
      { label: 'Precursor Gas', value: 'SiH₄ + N₂O' },
      { label: 'Chamber Pressure', value: '2.5 Torr' },
      { label: 'Target Film', value: '100 nm SiO₂' },
    ],
    waferStateDescription: 'Continuous dielectric layer deposited uniformly across wafer',
    waferLayers: {
      substrate: true,
      oxide: true,
      resist: false,
      patterned: false,
      etched: false,
    },
  },
  coat: {
    stepId: 'coat',
    bayName: 'Bay 2 — Lithography Track & Bake',
    hardwareRef: 'Clean Track ACT 12 / Lithius Spin Coater Developer',
    toolCategory: 'Track Spin-Coater',
    chamberState: 'TRACK READY',
    metrics: [
      { label: 'Dispense Volume', value: '2.5 mL polymer' },
      { label: 'Spin Speed', value: '3,200 RPM' },
      { label: 'Softbake Temp', value: '100 °C (60 s)' },
      { label: 'Target Film', value: '300 nm Photoresist' },
    ],
    waferStateDescription: 'Uniform photosensitive resist polymer coated atop dielectric',
    waferLayers: {
      substrate: true,
      oxide: true,
      resist: true,
      patterned: false,
      etched: false,
    },
  },
  lithography: {
    stepId: 'lithography',
    bayName: 'Bay 3 — Photolithography Exposure',
    hardwareRef: 'Twinscan DUV/EUV Scanner Monolith Enclosure',
    toolCategory: 'Step-and-Scan Optical Projection',
    chamberState: 'OPTICAL READY',
    metrics: [
      { label: 'Light Source', value: '193 nm ArF Excimer Laser' },
      { label: 'Exposure Dose', value: '24.5 mJ/cm²' },
      { label: 'Reticle Mask', value: '4× Quartz Reticle' },
      { label: 'Target CD', value: '45 nm line / space' },
    ],
    waferStateDescription: 'Latent chemical solubility pattern projected into photoresist',
    waferLayers: {
      substrate: true,
      oxide: true,
      resist: true,
      patterned: true,
      etched: false,
    },
  },
  develop: {
    stepId: 'develop',
    bayName: 'Bay 2 — Lithography Track & Bake',
    hardwareRef: 'Clean Track ACT 12 / Lithius Spin Coater Developer',
    toolCategory: 'Aqueous Track Developer',
    chamberState: 'TRACK READY',
    metrics: [
      { label: 'Chemistry', value: '2.38% TMAH Solution' },
      { label: 'Puddle Time', value: '45 s static soak' },
      { label: 'Rinse / Dry', value: 'DI Water + N₂ Spin' },
      { label: 'Stencil Tone', value: 'Positive-tone Clear' },
    ],
    waferStateDescription: 'Exposed resist dissolved away, revealing dielectric surface openings',
    waferLayers: {
      substrate: true,
      oxide: true,
      resist: true,
      patterned: true,
      etched: false,
    },
  },
  adi: {
    stepId: 'adi',
    bayName: 'Bay 6 — Metrology, Inspection & Process Control',
    hardwareRef: 'Applied Materials VeritySEM / KLA Archer Inspector',
    toolCategory: 'Critical Dimension SEM (CD-SEM)',
    chamberState: 'VACUUM READY',
    metrics: [
      { label: 'Inspection Mode', value: 'Top-down CD-SEM' },
      { label: 'Target CD', value: '45 nm ± 2.5 nm' },
      { label: 'Overlay Error', value: '< 2.0 nm' },
      { label: 'Rework Status', value: 'Non-destructive / Pass' },
    ],
    waferStateDescription: 'Photoresist stencil verified for CD and overlay alignment before etching',
    waferLayers: {
      substrate: true,
      oxide: true,
      resist: true,
      patterned: true,
      etched: false,
    },
  },
  etch: {
    stepId: 'etch',
    bayName: 'Bay 4 — Plasma Etch & Pattern Transfer',
    hardwareRef: 'Lam Kiyo / Centris Plasma Dry Etch System',
    toolCategory: 'Reactive Ion Etching (ICP-RIE)',
    chamberState: 'PLASMA IDLE',
    metrics: [
      { label: 'Plasma Chemistry', value: 'CF₄ / CHF₃ / Ar' },
      { label: 'Chamber Pressure', value: '15 mTorr' },
      { label: 'RF Power', value: '850 W Source / 120 W Bias' },
      { label: 'Target Depth', value: '100 nm (Anisotropic)' },
    ],
    waferStateDescription: 'Dielectric film selectively etched through resist openings to substrate',
    waferLayers: {
      substrate: true,
      oxide: true,
      resist: true,
      patterned: true,
      etched: true,
    },
  },
  aei: {
    stepId: 'aei',
    bayName: 'Bay 6 — Metrology, Inspection & Process Control',
    hardwareRef: 'Applied Materials VeritySEM / KLA Archer Inspector',
    toolCategory: 'Post-Etch Metrology & Defectivity',
    chamberState: 'VACUUM READY',
    metrics: [
      { label: 'Inspection Mode', value: 'Cross-section / CD-SEM' },
      { label: 'Trench Width', value: '45 nm ± 1.8 nm' },
      { label: 'Sidewall Angle', value: '89.4° vertical' },
      { label: 'Trench Depth', value: '100 nm ± 2 nm' },
    ],
    waferStateDescription: 'Etched dielectric trenches verified for profile verticality and dimensions',
    waferLayers: {
      substrate: true,
      oxide: true,
      resist: true,
      patterned: true,
      etched: true,
    },
  },
  strip: {
    stepId: 'strip',
    bayName: 'Bay 5 — Photoresist Strip & Cleans',
    hardwareRef: 'Mattson / Novellus Microwave Oxygen Plasma Ash Chamber',
    toolCategory: 'Downstream Microwave Plasma Asher',
    chamberState: 'PLASMA IDLE',
    metrics: [
      { label: 'Plasma Gas', value: 'O₂ (1,200 sccm) + 5% N₂H₂' },
      { label: 'Platen Temp', value: '220 °C' },
      { label: 'Wet Clean', value: 'Dilute SPM / Piranha' },
      { label: 'Residual Resist', value: '0.0 nm (Clean Surface)' },
    ],
    waferStateDescription: 'All sacrificial photoresist stripped away, leaving functional dielectric pattern',
    waferLayers: {
      substrate: true,
      oxide: true,
      resist: false,
      patterned: true,
      etched: true,
    },
  },
  repeat: {
    stepId: 'repeat',
    bayName: 'Multi-layer Interconnect Integration',
    hardwareRef: 'Automated Track & Chamber Cluster Interconnect',
    toolCategory: '3D Layer Stacking',
    chamberState: 'TRACK READY',
    metrics: [
      { label: 'Current Layer', value: 'Layer 1 Complete' },
      { label: 'Next Cycle', value: 'Inter-Layer Dielectric (ILD)' },
      { label: 'Interconnect Stack', value: 'Via & Metal 1 Deposition' },
      { label: 'Total Fab Layers', value: '30–75+ typical' },
    ],
    waferStateDescription: 'Patterned layer ready to receive next dielectric and metallization sequence',
    waferLayers: {
      substrate: true,
      oxide: true,
      resist: false,
      patterned: true,
      etched: true,
    },
  },
};
