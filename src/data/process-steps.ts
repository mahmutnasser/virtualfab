import {
  type QuestionConfig,
  DEPOSITION_PREDICTION_QUESTION,
  DEPOSITION_INTERPRETATION_QUESTION,
} from '../types/prediction';
import type { MaterialKind } from '../engine/types';
import { type TypedFact, normalizeCanonicalNodeId } from '../types/process';

export interface LessonScenarioDefinition {
  material: MaterialKind;
  displayName: string;
  chemicalFormula?: string;
  illustrativeThicknessNm?: number;
  notToScale: boolean;
  tone?: 'positive' | 'negative';
  technique?: string;
  educationalAssumption: string;
}

export interface ProcessStepData {
  id: string;
  order: 'start' | number | 'checkpoint' | 'repeat';
  stepNumber?: number; // 1..6 for canonical numbered steps
  isCheckpoint?: boolean;
  checkpointKind?: 'ADI' | 'AEI';
  name: string;
  shortName?: string;
  subtitle: string;
  stationId: string;
  stationName: string;
  description: string;
  whyThisStep: string;
  typedFacts?: TypedFact[];
  keyFacts: {
    material: string;
    thickness: string;
    toolType: string;
  };
  lessonScenario?: LessonScenarioDefinition;
  sourceIds: string[];
  predictionQuestion?: QuestionConfig;
  interpretationQuestion?: QuestionConfig;
}

export const CANONICAL_PROCESS_STEPS_DATA: ProcessStepData[] = [
  {
    id: 'start',
    order: 'start',
    name: 'Start wafer',
    subtitle: 'A bare wafer enters the fab',
    stationId: 'EQ-START-01',
    stationName: 'Wafer Load / FOUP Handling',
    description:
      'A bare silicon wafer enters the simplified fabrication cycle.',
    whyThisStep:
      'In this simplified journey, fabrication begins with a polished silicon wafer that provides the starting substrate.',
    typedFacts: [
      { label: 'Substrate material', value: 'Monocrystalline Silicon (Si)' },
      { label: 'Wafer format', value: '300 mm example wafer' },
    ],
    keyFacts: {
      material: 'Monocrystalline Silicon (Si)',
      thickness: '775 µm substrate (illustrative)',
      toolType: 'Wafer Load / FOUP Handling',
    },
    lessonScenario: {
      material: 'silicon',
      displayName: 'Silicon Substrate',
      chemicalFormula: 'Si',
      illustrativeThicknessNm: 775000,
      notToScale: true,
      educationalAssumption: 'Standard 300 mm monocrystalline silicon wafer foundation.',
    },
    sourceIds: ['SRC-FAB-PROCESS-01'],
  },
  {
    id: 'deposition',
    order: 1,
    stepNumber: 1,
    name: 'Deposition',
    subtitle: 'Add thin films of materials',
    stationId: 'EQ-DEP-01',
    stationName: 'Deposition tool · CVD example',
    description: 'Add a thin film of material across the wafer surface.',
    whyThisStep:
      'Before we can define a pattern, we need a material layer on the wafer that can later be selectively removed.',
    typedFacts: [
      { label: 'Example film', value: 'Silicon Dioxide (SiO₂)' },
      { label: 'Illustrative thickness', value: '~100 nm (not to scale)' },
    ],
    keyFacts: {
      material: 'Silicon Dioxide (SiO₂)',
      thickness: '~100 nm (illustrative, not to scale)',
      toolType: 'Deposition tool · CVD example',
    },
    lessonScenario: {
      material: 'oxide',
      displayName: 'Silicon Dioxide',
      chemicalFormula: 'SiO₂',
      illustrativeThicknessNm: 100,
      notToScale: true,
      technique: 'Chemical Vapor Deposition (CVD)',
      educationalAssumption:
        'In this simplified example, blanket deposition adds a dielectric film across the wafer surface.',
    },
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-DEPOSITION-01', 'SRC-DEVICE-ADV-01'],
    predictionQuestion: DEPOSITION_PREDICTION_QUESTION,
    interpretationQuestion: DEPOSITION_INTERPRETATION_QUESTION,
  },
  {
    id: 'coat',
    order: 2,
    stepNumber: 2,
    name: 'Coat Resist',
    subtitle: 'Apply photoresist',
    stationId: 'EQ-TRACK-01',
    stationName: 'Coater / Developer Track System',
    description: 'Spin-coat a photosensitive resist layer across the wafer.',
    whyThisStep:
      'Photoresist acts as a temporary light-sensitive stencil that can be patterned with ultraviolet light.',
    typedFacts: [
      { label: 'Example resist', value: 'Positive Photoresist Polymer' },
      { label: 'Resist tone', value: 'Positive tone (exposed areas become soluble)' },
    ],
    keyFacts: {
      material: 'Positive Photoresist Polymer',
      thickness: '~300 nm (illustrative)',
      toolType: 'Coater / Developer Track System',
    },
    lessonScenario: {
      material: 'photoresist',
      displayName: 'Positive Photoresist Polymer',
      chemicalFormula: 'PR',
      illustrativeThicknessNm: 300,
      notToScale: true,
      tone: 'positive',
      technique: 'Centrifugal Spin-Coating with Hot Plate Softbake',
      educationalAssumption:
        'Positive-tone resist assumption: exposed regions become soluble in developer.',
    },
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-METROLOGY-01'],
  },
  {
    id: 'lithography',
    order: 3,
    stepNumber: 3,
    name: 'Lithography / Exposure',
    subtitle: 'Pattern with light',
    stationId: 'EQ-LITHO-01',
    stationName: 'Lithography Scanner · DUV/EUV examples',
    description:
      'Expose nanoscale circuit designs onto the photoresist through a precision photomask reticle.',
    whyThisStep:
      'Light exposure alters the chemical solubility of the photoresist, transferring the circuit stencil.',
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
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-METROLOGY-01'],
  },
  {
    id: 'develop',
    order: 4,
    stepNumber: 4,
    name: 'Develop',
    subtitle: 'Reveal the pattern',
    stationId: 'EQ-TRACK-01',
    stationName: 'Coater / Developer Track System',
    description:
      'Developer removes the exposed regions of the positive-tone resist in this simplified example.',
    whyThisStep:
      'Developing reveals the pattern stencil so the underlying material can be selectively etched.',
    typedFacts: [
      { label: 'Resist tone', value: 'Positive tone' },
      { label: 'What development changes', value: 'Removes exposed resist, revealing underlying film' },
    ],
    keyFacts: {
      material: 'Aqueous Developer Solution (TMAH)',
      thickness: 'Chemical rinse & post-bake',
      toolType: 'Coater / Developer Track System',
    },
    sourceIds: ['SRC-FAB-PROCESS-01'],
  },
  {
    id: 'adi',
    order: 'checkpoint',
    isCheckpoint: true,
    checkpointKind: 'ADI',
    name: 'ADI Inspection',
    subtitle: 'After develop inspection',
    stationId: 'EQ-METRO-01',
    stationName: 'Metrology / Inspection Bay',
    description:
      'Conceptual inspection of the developed resist pattern before etch.',
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
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-METROLOGY-01', 'SRC-PROCESS-CONTROL-01'],
  },
  {
    id: 'etch',
    order: 5,
    stepNumber: 5,
    name: 'Etch',
    subtitle: 'Remove material',
    stationId: 'EQ-ETCH-01',
    stationName: 'Reactive Ion Etch (RIE) System',
    description:
      'In this simplified directional dry-etch example, exposed dielectric is removed through the resist openings.',
    whyThisStep:
      'Etching transfers the pattern directly into the functional material layer on the wafer.',
    typedFacts: [
      { label: 'Target film', value: 'Silicon Dioxide (SiO₂)' },
      { label: 'Example process', value: 'Directional dry etch' },
    ],
    keyFacts: {
      material: 'Fluorocarbon Plasma (CF₄ / CHF₃)',
      thickness: 'Directional anisotropic etching',
      toolType: 'Reactive Ion Etch (RIE) System',
    },
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-DEPOSITION-01'],
  },
  {
    id: 'aei',
    order: 'checkpoint',
    isCheckpoint: true,
    checkpointKind: 'AEI',
    name: 'AEI Inspection',
    subtitle: 'After etch inspection',
    stationId: 'EQ-METRO-01',
    stationName: 'Metrology / Inspection Bay',
    description:
      'Conceptually compare the transferred film pattern with the expected pattern.',
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
    sourceIds: ['SRC-FAB-PROCESS-01', 'SRC-METROLOGY-01', 'SRC-PROCESS-CONTROL-01'],
  },
  {
    id: 'strip',
    order: 6,
    stepNumber: 6,
    name: 'Strip',
    subtitle: 'Remove resist',
    stationId: 'EQ-STRIP-01',
    stationName: 'Resist Strip Station',
    description:
      'Photoresist has served its purpose as a temporary mask, so the remaining resist is removed before later processing.',
    whyThisStep:
      'Photoresist removed; patterned underlying dielectric remains.',
    typedFacts: [
      { label: 'Material removed', value: 'Residual photoresist mask' },
      { label: 'Layer remaining', value: 'Patterned underlying dielectric remains' },
    ],
    keyFacts: {
      material: 'Photoresist Removal & Clean',
      thickness: 'Complete organic removal',
      toolType: 'Resist Strip Station',
    },
    sourceIds: ['SRC-FAB-PROCESS-01'],
  },
  {
    id: 'repeat',
    order: 'repeat',
    name: 'Repeat',
    subtitle: 'Build many layers',
    stationId: 'EQ-START-01',
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
          'One simplified patterned dielectric layer is complete. Many repeated patterning and layer-building cycles create more complex device structures.',
      },
    ],
    keyFacts: {
      material: 'Interconnects, Dielectrics, Vias',
      thickness: 'Multilevel metallization',
      toolType: 'Full Automated Fab Line',
    },
    sourceIds: ['SRC-FAB-PROCESS-01'],
  },
];

export function getProcessStep(stepId: string): ProcessStepData | undefined {
  const normalized = normalizeCanonicalNodeId(stepId);
  if (!normalized) return undefined;
  return CANONICAL_PROCESS_STEPS_DATA.find((s) => s.id === normalized);
}
