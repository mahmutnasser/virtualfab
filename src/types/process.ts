export type ProcessStepStatus = 'completed' | 'active' | 'upcoming' | 'locked';

export interface TypedFact {
  label: string;
  value: string;
}

export interface ProcessStep {
  id: string;
  order: 'start' | number | 'checkpoint' | 'repeat';
  stepNumber?: number; // 1..6 for canonical numbered steps; undefined for setup/checkpoints/repeat
  isCheckpoint?: boolean;
  checkpointKind?: 'ADI' | 'AEI';
  name: string;
  shortName?: string;
  subtitle: string;
  stationName: string;
  description: string;
  whyThisStep: string;
  typedFacts?: TypedFact[];
  keyFacts?: {
    material?: string;
    thickness?: string;
    toolType?: string;
  };
  status: ProcessStepStatus;
}

export const CANONICAL_PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'start',
    order: 'start',
    name: 'Start wafer',
    subtitle: 'A bare wafer enters the fab',
    stationName: 'Wafer Load / FOUP Handling',
    description: 'A bare silicon wafer enters the simplified fabrication cycle.',
    whyThisStep: 'In this simplified journey, fabrication begins with a polished silicon wafer that provides the starting substrate.',
    typedFacts: [
      { label: 'Substrate material', value: 'Monocrystalline Silicon (Si)' },
      { label: 'Wafer format', value: '300 mm example wafer' },
    ],
    keyFacts: {
      material: 'Monocrystalline Silicon (Si)',
      thickness: '775 µm substrate',
      toolType: 'Automated Material Handling (AMHS) Load Port',
    },
    status: 'completed',
  },
  {
    id: 'deposition',
    order: 1,
    stepNumber: 1,
    name: 'Deposition',
    subtitle: 'Add thin films of materials',
    stationName: 'Deposition tool · CVD example',
    description: 'Add a thin film of material across the wafer surface.',
    whyThisStep: 'Before we can define a pattern, we need a material layer on the wafer that can later be selectively removed.',
    typedFacts: [
      { label: 'Example film', value: 'Silicon Dioxide (SiO₂)' },
      { label: 'Illustrative thickness', value: '~100 nm (not to scale)' },
    ],
    keyFacts: {
      material: 'Silicon Dioxide (SiO₂)',
      thickness: '~100 nm (illustrative, not to scale)',
      toolType: 'Deposition tool · CVD example',
    },
    status: 'active',
  },
  {
    id: 'coat',
    order: 2,
    stepNumber: 2,
    name: 'Coat Resist',
    subtitle: 'Apply photoresist',
    stationName: 'Coater / Developer Track System',
    description: 'Spin-coat a photosensitive resist layer across the wafer.',
    whyThisStep: 'Photoresist acts as a temporary light-sensitive stencil that can be patterned with ultraviolet light.',
    typedFacts: [
      { label: 'Example resist', value: 'Positive Photoresist Polymer' },
      { label: 'Resist tone', value: 'Positive tone (exposed areas become soluble)' },
    ],
    keyFacts: {
      material: 'Positive Photoresist Polymer',
      thickness: '~300 nm',
      toolType: 'Coater / Developer Track System',
    },
    status: 'upcoming',
  },
  {
    id: 'lithography',
    order: 3,
    stepNumber: 3,
    name: 'Lithography / Exposure',
    subtitle: 'Pattern with light',
    stationName: 'Lithography Scanner · DUV/EUV examples',
    description: 'Expose nanoscale circuit designs onto the photoresist through a precision photomask reticle.',
    whyThisStep: 'Light exposure alters the chemical solubility of the photoresist, transferring the circuit stencil.',
    typedFacts: [
      { label: 'Exposure concept', value: 'Pattern transfer with ultraviolet light' },
      { label: 'Reticle concept', value: 'Precision quartz photomask' },
      { label: 'Resist tone', value: 'Positive tone (solubility altered)' },
    ],
    keyFacts: {
      material: 'UV Photons & Photomask Reticle',
      thickness: 'DUV or EUV exposure examples',
      toolType: 'Lithography Scanner · DUV/EUV examples',
    },
    status: 'upcoming',
  },
  {
    id: 'develop',
    order: 4,
    stepNumber: 4,
    name: 'Develop',
    subtitle: 'Reveal the pattern',
    stationName: 'Coater / Developer Track System',
    description: 'Developer removes the exposed regions of the positive-tone resist in this simplified example.',
    whyThisStep: 'Developing reveals the pattern stencil so the underlying material can be selectively etched.',
    typedFacts: [
      { label: 'Resist tone', value: 'Positive tone' },
      { label: 'What development changes', value: 'Removes exposed resist, revealing underlying film' },
    ],
    keyFacts: {
      material: 'Aqueous Developer Solution (TMAH)',
      thickness: 'Chemical rinse & post-bake',
      toolType: 'Coater / Developer Track System',
    },
    status: 'upcoming',
  },
  {
    id: 'adi',
    order: 'checkpoint',
    isCheckpoint: true,
    checkpointKind: 'ADI',
    name: 'ADI Inspection',
    subtitle: 'After develop inspection',
    stationName: 'Metrology / Inspection Bay',
    description: 'Conceptual inspection of the developed resist pattern before etch.',
    whyThisStep:
      'Conceptual inspection of the developed resist pattern before etch. Pattern dimensions, placement, and defects may be evaluated; whether rework is possible depends on the process.',
    typedFacts: [
      { label: 'Checkpoint target', value: 'Developed photoresist stencil' },
      { label: 'What is compared', value: 'Resist pattern vs. reticle target before etch' },
    ],
    keyFacts: {
      material: 'Developed Photoresist Stencil',
      thickness: 'Conceptual pattern check',
      toolType: 'Metrology / Inspection Bay',
    },
    status: 'upcoming',
  },
  {
    id: 'etch',
    order: 5,
    stepNumber: 5,
    name: 'Etch',
    subtitle: 'Remove material',
    stationName: 'Reactive Ion Etch (RIE) System',
    description:
      'In this simplified directional dry-etch example, exposed dielectric is removed through the resist openings.',
    whyThisStep: 'Etching transfers the pattern directly into the functional material layer on the wafer.',
    typedFacts: [
      { label: 'Target film', value: 'Silicon Dioxide (SiO₂)' },
      { label: 'Example process', value: 'Directional dry etch' },
    ],
    keyFacts: {
      material: 'Fluorocarbon Plasma (CF₄ / CHF₃)',
      thickness: 'Directional anisotropic etching',
      toolType: 'Reactive Ion Etch (RIE) System',
    },
    status: 'upcoming',
  },
  {
    id: 'aei',
    order: 'checkpoint',
    isCheckpoint: true,
    checkpointKind: 'AEI',
    name: 'AEI Inspection',
    subtitle: 'After etch inspection',
    stationName: 'Metrology / Inspection Bay',
    description: 'Conceptually compare the transferred film pattern with the expected pattern.',
    whyThisStep:
      'Post-etch patterned dielectric; photoresist remains until Strip. AEI is non-destructive and does not modify wafer layers.',
    typedFacts: [
      { label: 'Checkpoint target', value: 'Etched dielectric pattern' },
      { label: 'What is compared', value: 'Transferred pattern vs. expected pattern' },
    ],
    keyFacts: {
      material: 'Patterned Dielectric Film',
      thickness: 'Conceptual pattern-transfer check',
      toolType: 'Metrology / Inspection Bay',
    },
    status: 'upcoming',
  },
  {
    id: 'strip',
    order: 6,
    stepNumber: 6,
    name: 'Strip',
    subtitle: 'Remove resist',
    stationName: 'Resist Strip Station',
    description:
      'Photoresist has served its purpose as a temporary mask, so the remaining resist is removed before later processing.',
    whyThisStep: 'Photoresist removed; patterned underlying dielectric remains.',
    typedFacts: [
      { label: 'Material removed', value: 'Residual photoresist mask' },
      { label: 'Layer remaining', value: 'Patterned underlying dielectric remains' },
    ],
    keyFacts: {
      material: 'Photoresist Removal & Clean',
      thickness: 'Complete organic removal',
      toolType: 'Resist Strip Station',
    },
    status: 'upcoming',
  },
  {
    id: 'repeat',
    order: 'repeat',
    name: 'Repeat',
    subtitle: 'Build many layers',
    stationName: 'Cleanroom Interconnect Loop',
    description:
      'One simplified patterned dielectric layer is complete. Many repeated patterning and layer-building cycles create more complex device structures.',
    whyThisStep:
      'One simplified patterned dielectric layer is complete. Many repeated patterning and layer-building cycles create more complex device structures.',
    typedFacts: [
      { label: 'Repetition scope', value: 'Multi-layer patterning cycles' },
      {
        label: 'Layer integration',
        value:
          'One simplified patterned dielectric layer is complete. Many repeated patterning cycles create complex device structures',
      },
    ],
    keyFacts: {
      material: 'Interconnects, Dielectrics, Vias',
      thickness: 'Multilevel metallization',
      toolType: 'Full Automated Fab Line',
    },
    status: 'upcoming',
  },
];

/**
 * Normalizes unambiguous legacy aliases to single canonical node IDs.
 * Generic physical equipment concepts like 'metrology' are NOT unique process nodes
 * and will return null to prevent silently choosing between ADI or AEI.
 */
export function normalizeCanonicalNodeId(id: string): string | null {
  switch (id) {
    case 'coat-resist':
    case 'coat':
      return 'coat';
    case 'adi-inspection':
    case 'adi':
      return 'adi';
    case 'aei-inspection':
    case 'aei':
      return 'aei';
    case 'start':
    case 'deposition':
    case 'lithography':
    case 'develop':
    case 'etch':
    case 'strip':
    case 'repeat':
      return id;
    case 'metrology':
      // Generic equipment/category concept shared by both adi and aei;
      // not a unique curriculum or process node. Never silently choose ADI or AEI.
      return null;
    default:
      return null;
  }
}
