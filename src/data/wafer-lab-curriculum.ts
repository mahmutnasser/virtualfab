import type { QuestionConfig } from '../types/prediction';
import type { ProcessAction } from '../engine/types';
import { normalizeCanonicalNodeId } from '../types/process';

export interface StepCurriculumItem {
  id: string;
  stepNumber?: number;
  totalSteps?: number;
  isCheckpoint?: boolean;
  checkpointKind?: 'ADI' | 'AEI';
  title: string;
  subtitle: string;
  stationName: string;
  keyIdea: string;
  runButtonLabel: string;
  runningAnnouncement: string;
  finishedAnnouncement: string;
  nextStepId: string;
  nextStepLabel: string;
  defaultAction: ProcessAction;
  predictionQuestion?: QuestionConfig;
  predictionComparisons?: Record<string, { predicted: string; comparison: string }>;
  interpretationQuestion?: QuestionConfig;
  checkpointConfig?: {
    checkpointKind: 'ADI' | 'AEI';
    targetLayer: string;
    description: string;
    reworkable: boolean;
    reworkExplanation: string;
    inspectionMetrics: Array<{ label: string; spec: string; status: 'pass' | 'warning' | 'fail' }>;
  };
}

// ─────────────────────────────────────────────────────────────
// 1. DEPOSITION
// ─────────────────────────────────────────────────────────────
export const DEPOSITION_CURRICULUM: StepCurriculumItem = {
  id: 'deposition',
  stepNumber: 1,
  totalSteps: 6,
  title: 'Deposition',
  subtitle: 'Adding a thin film of material across the wafer surface',
  stationName: 'Deposition tool · CVD example',
  keyIdea:
    'Deposition builds the layer stack by adding thin films to the wafer. Some deposited films are only nanometers thick.',
  runButtonLabel: 'Run Deposition',
  runningAnnouncement: 'Running chemical vapor deposition chamber...',
  finishedAnnouncement:
    'Deposition completed. A thin film of silicon dioxide has been deposited across the wafer surface.',
  nextStepId: 'coat',
  nextStepLabel: 'Continue to Coat Resist',
  defaultAction: {
    type: 'deposit',
    material: 'oxide',
    thicknessNm: 100,
  },
  predictionQuestion: {
    id: 'q_deposition_prediction',
    prompt: 'What will deposition change on the wafer?',
    subtext: 'Select what happens physically to the wafer before running the equipment.',
    correctOptionId: 'opt_add_layer',
    options: [
      { id: 'opt_add_layer', label: 'Adds a material layer across the surface' },
      { id: 'opt_remove_mat', label: 'Removes material from the surface' },
      { id: 'opt_pattern_light', label: 'Defines a pattern using light' },
      { id: 'opt_remove_resist', label: 'Removes photoresist' },
    ],
    feedbackByOptionId: {
      opt_add_layer:
        'Correct! In this simplified process model, deposition adds a thin film of material across the wafer surface.',
      opt_remove_mat:
        'Not quite. Material removal occurs during etching, not deposition.',
      opt_pattern_light:
        'Not quite. Transferring patterns using light is the role of photolithography.',
      opt_remove_resist:
        'Not quite. Removing photoresist occurs during the photoresist strip step.',
    },
  },
  predictionComparisons: {
    opt_add_layer: {
      predicted: 'Adds a material layer across the surface',
      comparison:
        'Your prediction matched the physical result: in this simplified process model, deposition added a dielectric thin film across the wafer surface without altering the substrate.',
    },
    opt_remove_mat: {
      predicted: 'Removes material from the surface',
      comparison:
        'You predicted material removal. In this simplified process model, deposition adds material; material removal is performed in Step 5 (Etch).',
    },
    opt_pattern_light: {
      predicted: 'Defines a pattern using light',
      comparison:
        'You predicted optical patterning. In this simplified process model, deposition adds a blank continuous film. Circuit patterns are exposed in Step 3 (Lithography).',
    },
    opt_remove_resist: {
      predicted: 'Removes photoresist',
      comparison:
        'You predicted resist removal. In reality, photoresist is not applied until Step 2 (Coat Resist) and stripped in Step 6 (Strip).',
    },
  },
  interpretationQuestion: {
    id: 'interp_deposition_blanket',
    prompt:
      'In this simplified patterning cycle, why is the example film deposited across the wafer before selective patterning?',
    subtext: 'Consider the sequence of semiconductor manufacturing steps.',
    correctOptionId: 'interp_blanket_additive',
    options: [
      {
        id: 'interp_blanket_additive',
        label:
          'This example uses blanket deposition; lithography defines the pattern and a later etch selectively removes material.',
      },
      {
        id: 'interp_covers_all',
        label:
          'Transistors cover the entire substrate surface with no gaps between active regions.',
      },
      {
        id: 'interp_cannot_control',
        label:
          'Chamber vapor flow cannot be directed toward specific wafer regions.',
      },
    ],
    feedbackByOptionId: {
      interp_blanket_additive:
        'Correct! This example uses blanket deposition; lithography defines the pattern and a later etch selectively removes material.',
      interp_covers_all:
        'Not quite. Microchips contain vast spaces between individual transistors and interconnected lines.',
      interp_cannot_control:
        'Not quite. Deposition chambers control vapor flow with extreme precision, but are intentionally engineered for broad surface coverage.',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// 2. COAT RESIST
// ─────────────────────────────────────────────────────────────
export const COAT_RESIST_CURRICULUM: StepCurriculumItem = {
  id: 'coat',
  stepNumber: 2,
  totalSteps: 6,
  title: 'Coat Resist',
  subtitle: 'Applying a photosensitive polymer (photoresist) across the wafer',
  stationName: 'Coater / Developer Track System',
  keyIdea:
    'Spin-coating dispenses liquid photoresist onto a rotating wafer to form a uniform, light-sensitive coating only hundreds of nanometers thick.',
  runButtonLabel: 'Run Coat Resist',
  runningAnnouncement: 'Spin-coating photosensitive resist polymer and softbaking wafer...',
  finishedAnnouncement:
    'Coat resist completed. A uniform photoresist layer has been applied across the dielectric thin film.',
  nextStepId: 'lithography',
  nextStepLabel: 'Continue to Lithography',
  defaultAction: {
    type: 'coat-resist',
    tone: 'positive',
    thicknessNm: 300,
  },
  predictionQuestion: {
    id: 'q_coat_prediction',
    prompt: 'What will coat resist do to the wafer?',
    subtext: 'Select what happens physically during spin-coating.',
    correctOptionId: 'opt_coat_uniform_layer',
    options: [
      {
        id: 'opt_coat_uniform_layer',
        label: 'Applies an even layer of photosensitive polymer across the wafer',
      },
      {
        id: 'opt_coat_dissolve',
        label: 'Dissolves the underlying dielectric film',
      },
      {
        id: 'opt_coat_selective',
        label: 'Selectively deposits resist only where circuit wires will be',
      },
      {
        id: 'opt_coat_etch',
        label: 'Etches micro-trenches into the silicon substrate',
      },
    ],
    feedbackByOptionId: {
      opt_coat_uniform_layer:
        'Correct! Centrifugal spin coating spreads a uniform liquid photoresist film across the entire wafer surface.',
      opt_coat_dissolve:
        'Not quite. The dielectric film is chemically stable and is not dissolved by resist application.',
      opt_coat_selective:
        'Not quite. Spin coating applies a continuous blanket layer. Selective patterning happens later during lithography.',
      opt_coat_etch:
        'Not quite. Coating adds a protective polymer; material removal happens during Step 5 (Etch).',
    },
  },
  predictionComparisons: {
    opt_coat_uniform_layer: {
      predicted: 'Applies an even layer of photosensitive polymer across the wafer',
      comparison:
        'Your prediction matched the physical result: spin coating created an ultra-smooth, uniform blanket photoresist layer over the dielectric film.',
    },
    opt_coat_dissolve: {
      predicted: 'Dissolves the underlying dielectric film',
      comparison:
        'You predicted film dissolution. In reality, photoresist is designed for high chemical compatibility and coats harmlessly over the dielectric.',
    },
    opt_coat_selective: {
      predicted: 'Selectively deposits resist only where circuit wires will be',
      comparison:
        'You predicted selective deposition. Spin coating is a blanket process; selective patterning occurs in the next step via optical lithography.',
    },
    opt_coat_etch: {
      predicted: 'Etches micro-trenches into the silicon substrate',
      comparison:
        'You predicted trench etching. Coating is an additive step; etching occurs later in Step 5.',
    },
  },
  interpretationQuestion: {
    id: 'interp_coat_blanket',
    prompt:
      'Why is photoresist applied as a uniform blanket coating across the entire wafer surface?',
    subtext: 'Consider how nanoscale patterns are created in semiconductor manufacturing.',
    correctOptionId: 'interp_coat_blanket_canvas',
    options: [
      {
        id: 'interp_coat_blanket_canvas',
        label:
          'Spin coating provides a flat, continuous photosensitive canvas ready for optical pattern projection.',
      },
      {
        id: 'interp_coat_permanent_insulator',
        label:
          'Photoresist forms a permanent insulating layer that stays inside the finished microprocessor.',
      },
      {
        id: 'interp_coat_conductive',
        label:
          'Photoresist is an electrically conductive metal that connects transistors together.',
      },
    ],
    feedbackByOptionId: {
      interp_coat_blanket_canvas:
        'Correct! Spin coating creates an ultra-smooth, uniform photosensitive canvas ready for optical pattern transfer.',
      interp_coat_permanent_insulator:
        'Not quite. Photoresist is a temporary sacrificial mask that will be completely removed in Step 6 (Strip).',
      interp_coat_conductive:
        'Not quite. Photoresist is an organic polymer used solely for temporary optical masking.',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// 3. LITHOGRAPHY / EXPOSURE
// ─────────────────────────────────────────────────────────────
export const LITHOGRAPHY_CURRICULUM: StepCurriculumItem = {
  id: 'lithography',
  stepNumber: 3,
  totalSteps: 6,
  title: 'Lithography / Exposure',
  subtitle: 'Projecting circuit patterns into photoresist with precision ultraviolet light',
  stationName: 'Lithography Scanner · DUV/EUV examples',
  keyIdea:
    'Exposure uses UV photons and a photomask reticle to alter the chemical solubility of the photoresist, creating an invisible "latent image" without removing any material yet.',
  runButtonLabel: 'Run Exposure',
  runningAnnouncement: 'Aligning wafer reticle and scanning ultraviolet light exposure...',
  finishedAnnouncement:
    'Lithography exposure completed. A photochemical latent image has formed in the photoresist.',
  nextStepId: 'develop',
  nextStepLabel: 'Continue to Develop',
  defaultAction: {
    type: 'expose',
    exposureMask: [
      false, false, false, false,
      true, true, true, true,
      true, true, true, true,
      false, false, false, false,
    ],
  },
  predictionQuestion: {
    id: 'q_litho_prediction',
    prompt: 'What will exposure change in the photoresist?',
    subtext: 'Consider what ultraviolet light does to photosensitive polymer.',
    correctOptionId: 'opt_litho_latent',
    options: [
      {
        id: 'opt_litho_latent',
        label: 'Alters chemical solubility in exposed regions without removing material yet',
      },
      {
        id: 'opt_litho_burn',
        label: 'Vaporizes and burns away the exposed resist immediately',
      },
      {
        id: 'opt_litho_etch',
        label: 'Etches deep grooves into the silicon substrate',
      },
      {
        id: 'opt_litho_add_metal',
        label: 'Deposits copper circuit lines onto the resist surface',
      },
    ],
    feedbackByOptionId: {
      opt_litho_latent:
        'Correct! UV photons induce a photochemical reaction creating a "latent image"—polymer solubility changes, but no material is removed yet.',
      opt_litho_burn:
        'Not quite. Exposure does not ablate or burn resist; it photochemically alters chemical solubility.',
      opt_litho_etch:
        'Not quite. Light exposure only sensitizes the resist; etching occurs later in Step 5 using reactive plasma.',
      opt_litho_add_metal:
        'Not quite. Lithography transfers optical patterns; metal deposition is a separate process.',
    },
  },
  predictionComparisons: {
    opt_litho_latent: {
      predicted: 'Alters chemical solubility in exposed regions without removing material yet',
      comparison:
        'Your prediction matched the physical result: the exposed photoresist contains a photochemical latent image with altered solubility, while the physical layer remains continuous.',
    },
    opt_litho_burn: {
      predicted: 'Vaporizes and burns away the exposed resist immediately',
      comparison:
        'You predicted instant vaporization. In photolithography, exposure only triggers a photochemical change; physical material removal requires developer solution.',
    },
    opt_litho_etch: {
      predicted: 'Etches deep grooves into the silicon substrate',
      comparison:
        'You predicted substrate etching. Lithography only patterns the photoresist; the substrate is untouched until Step 5 (Etch).',
    },
    opt_litho_add_metal: {
      predicted: 'Deposits copper circuit lines onto the resist surface',
      comparison:
        'You predicted metal deposition. Lithography is strictly a pattern exposure process, not metal deposition.',
    },
  },
  interpretationQuestion: {
    id: 'interp_litho_latent',
    prompt:
      'Why is the exposed pattern inside the photoresist called a "latent image"?',
    subtext: 'Think about the distinction between exposure and development.',
    correctOptionId: 'interp_litho_chemical_stencil',
    options: [
      {
        id: 'interp_litho_chemical_stencil',
        label:
          'A photochemical change has occurred, but the physical stencil is only revealed during development.',
      },
      {
        id: 'interp_litho_invisible_permanent',
        label:
          'The pattern remains permanently invisible and is never physically opened.',
      },
      {
        id: 'interp_litho_substrate_defect',
        label:
          'It represents an unintended optical defect in the silicon substrate.',
      },
    ],
    feedbackByOptionId: {
      interp_litho_chemical_stencil:
        'Correct! Just like analog film photography, exposure creates an invisible chemical latent image that must be developed to form a physical stencil.',
      interp_litho_invisible_permanent:
        'Not quite. The latent image will be physically revealed in the very next step (Develop).',
      interp_litho_substrate_defect:
        'Not quite. The latent image is the intended, high-precision circuit pattern.',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// 4. DEVELOP
// ─────────────────────────────────────────────────────────────
export const DEVELOP_CURRICULUM: StepCurriculumItem = {
  id: 'develop',
  stepNumber: 4,
  totalSteps: 6,
  title: 'Develop',
  subtitle: 'Dissolving exposed resist to reveal the physical stencil mask',
  stationName: 'Coater / Developer Track System',
  keyIdea:
    'Aqueous developer chemical dissolves the exposed positive photoresist regions, opening physical windows down to the dielectric while unexposed resist remains as a protective shield.',
  runButtonLabel: 'Run Developer',
  runningAnnouncement: 'Applying aqueous developer solution and spinning wafer dry...',
  finishedAnnouncement:
    'Development completed. Exposed photoresist has been dissolved, opening the stencil mask.',
  nextStepId: 'adi',
  nextStepLabel: 'Proceed to ADI Inspection',
  defaultAction: {
    type: 'develop',
  },
  predictionQuestion: {
    id: 'q_dev_prediction',
    prompt: 'What will developer solution do to the exposed wafer?',
    subtext: 'Consider how developer interacts with positive-tone photoresist.',
    correctOptionId: 'opt_dev_dissolve_exposed',
    options: [
      {
        id: 'opt_dev_dissolve_exposed',
        label: 'Dissolves exposed resist regions, opening stencil windows down to the dielectric',
      },
      {
        id: 'opt_dev_dissolve_all',
        label: 'Dissolves all photoresist across the entire wafer surface',
      },
      {
        id: 'opt_dev_dissolve_dielectric',
        label: 'Dissolves the dielectric film while keeping all resist intact',
      },
      {
        id: 'opt_dev_harden_all',
        label: 'Hardens the resist without removing any material',
      },
    ],
    feedbackByOptionId: {
      opt_dev_dissolve_exposed:
        'Correct! In positive-tone resist, developer selectively dissolves exposed polymer chains, opening windows through to the dielectric.',
      opt_dev_dissolve_all:
        'Not quite. Only the exposed regions become soluble; unexposed resist remains as a protective mask.',
      opt_dev_dissolve_dielectric:
        'Not quite. Developer chemical (e.g. aqueous TMAH) selectively attacks soluble polymer, not inorganic dielectrics.',
      opt_dev_harden_all:
        'Not quite. Developer actively washes away soluble polymer to open the stencil.',
    },
  },
  predictionComparisons: {
    opt_dev_dissolve_exposed: {
      predicted: 'Dissolves exposed resist regions, opening stencil windows down to the dielectric',
      comparison:
        'Your prediction matched the physical result: exposed photoresist was washed away, forming open stencil windows that reveal the dielectric underneath.',
    },
    opt_dev_dissolve_all: {
      predicted: 'Dissolves all photoresist across the entire wafer surface',
      comparison:
        'You predicted total resist removal. In reality, only exposed regions dissolve; unexposed resist remains to protect selected areas during etching.',
    },
    opt_dev_dissolve_dielectric: {
      predicted: 'Dissolves the dielectric film while keeping all resist intact',
      comparison:
        'You predicted dielectric dissolution. Developer only dissolves exposed organic resist; dielectric is etched in Step 5 (Etch).',
    },
    opt_dev_harden_all: {
      predicted: 'Hardens the resist without removing any material',
      comparison:
        'You predicted hardening without removal. Development specifically washes away exposed resist to open a physical stencil.',
    },
  },
  interpretationQuestion: {
    id: 'interp_dev_stencil',
    prompt: 'What is the physical outcome of the development step?',
    subtext: 'Observe the cross-section of the wafer after develop.',
    correctOptionId: 'interp_dev_stencil_formed',
    options: [
      {
        id: 'interp_dev_stencil_formed',
        label:
          'A physical stencil mask is formed in the resist, exposing underlying dielectric where etching should occur.',
      },
      {
        id: 'interp_dev_permanent_device',
        label:
          'The dielectric has been etched into final transistor shapes.',
      },
      {
        id: 'interp_dev_bare_silicon',
        label:
          'The entire wafer has been stripped down to bare silicon.',
      },
    ],
    feedbackByOptionId: {
      interp_dev_stencil_formed:
        'Correct! Development reveals a high-resolution polymer stencil that will guide selective etching in Step 5.',
      interp_dev_permanent_device:
        'Not quite. The dielectric film underneath is still intact; etching hasn\'t occurred yet.',
      interp_dev_bare_silicon:
        'Not quite. Both the dielectric layer and unexposed photoresist remain present.',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// ◇ ADI INSPECTION (After-Develop Inspection Checkpoint)
// ─────────────────────────────────────────────────────────────
export const ADI_CURRICULUM: StepCurriculumItem = {
  id: 'adi',
  isCheckpoint: true,
  checkpointKind: 'ADI',
  title: 'ADI Inspection',
  subtitle: 'Non-destructive after-develop metrology and defect inspection',
  stationName: 'Metrology / Inspection Bay',
  keyIdea:
    'Conceptual inspection of the developed resist pattern before etch. Pattern dimensions, placement, and defects may be evaluated; whether rework is possible depends on the process.',
  runButtonLabel: 'Run ADI Inspection',
  runningAnnouncement: 'Scanning wafer with high-resolution inspection system...',
  finishedAnnouncement:
    'ADI Inspection completed: Photoresist pattern dimensions and placement evaluated.',
  nextStepId: 'etch',
  nextStepLabel: 'Continue to Etch',
  defaultAction: {
    type: 'inspect',
    checkpoint: 'ADI',
  },
  checkpointConfig: {
    checkpointKind: 'ADI',
    targetLayer: 'Photoresist Stencil Mask',
    description:
      'Conceptual inspection of the developed resist pattern before etch. Pattern dimensions, placement, and defects may be evaluated; whether rework is possible depends on the process.',
    reworkable: true,
    reworkExplanation:
      'Conceptual inspection of the developed resist pattern before etch. Pattern dimensions, placement, and defects may be evaluated; whether rework is possible depends on the process.',
    inspectionMetrics: [
      { label: 'Pattern Dimensions', spec: 'Target specification', status: 'pass' },
      { label: 'Overlay Placement', spec: 'Within alignment budget', status: 'pass' },
      { label: 'Resist Opening / Defects', spec: 'Evaluated clean opening', status: 'pass' },
    ],
  },
  interpretationQuestion: {
    id: 'interp_adi_rework',
    prompt: 'Why is After-Develop Inspection (ADI) performed before etching?',
    subtext: 'Evaluate the economic and process control rationale.',
    correctOptionId: 'interp_adi_rework_allowed',
    options: [
      {
        id: 'interp_adi_rework_allowed',
        label:
          'If patterning or alignment errors are found, resist can be stripped and recoated without permanent wafer damage.',
      },
      {
        id: 'interp_adi_etch_speed',
        label:
          'It measures how quickly plasma will travel through the vacuum chamber.',
      },
      {
        id: 'interp_adi_permanent_test',
        label:
          'It permanently cures the resist so it can never be removed again.',
      },
    ],
    feedbackByOptionId: {
      interp_adi_rework_allowed:
        'Correct! Conceptual inspection of the developed resist pattern before etch evaluates pattern dimensions, placement, and defects. In suitable processes, resist may be stripped and reworked before irreversible etching.',
      interp_adi_etch_speed:
        'Not quite. Metrology inspects geometric dimensions and alignment, not chamber gas dynamics.',
      interp_adi_permanent_test:
        'Not quite. Photoresist must always remain strippable after etch.',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// 5. ETCH
// ─────────────────────────────────────────────────────────────
export const ETCH_CURRICULUM: StepCurriculumItem = {
  id: 'etch',
  stepNumber: 5,
  totalSteps: 6,
  title: 'Etch',
  subtitle: 'Selectively removing dielectric film through open resist windows',
  stationName: 'Reactive Ion Etch (RIE) System',
  keyIdea:
    'In this simplified directional dry-etch example, exposed dielectric is removed through the resist openings.',
  runButtonLabel: 'Run Etch',
  runningAnnouncement: 'Igniting reactive fluorocarbon plasma and etching dielectric film...',
  finishedAnnouncement:
    'Etch completed. Dielectric film has been selectively etched down to the silicon substrate in open windows.',
  nextStepId: 'aei',
  nextStepLabel: 'Proceed to AEI Inspection',
  defaultAction: {
    type: 'etch',
  },
  predictionQuestion: {
    id: 'q_etch_prediction',
    prompt: 'What will the etch process remove from the wafer?',
    subtext: 'Observe the resist stencil and underlying dielectric.',
    correctOptionId: 'opt_etch_selective_film',
    options: [
      {
        id: 'opt_etch_selective_film',
        label: 'Removes dielectric film only where the resist stencil is open',
      },
      {
        id: 'opt_etch_remove_substrate',
        label: 'Digs deep trenches into the entire silicon substrate',
      },
      {
        id: 'opt_etch_remove_resist_only',
        label: 'Removes only the photoresist and leaves the dielectric unchanged',
      },
      {
        id: 'opt_etch_blanket',
        label: 'Uniformly removes 50 nm across all layers simultaneously',
      },
    ],
    feedbackByOptionId: {
      opt_etch_selective_film:
        'Correct! Reactive plasma chemistry selectively etches the dielectric film through the open resist windows down to the substrate.',
      opt_etch_remove_substrate:
        'Not quite. Etch chemistries are selective and stop on the underlying silicon substrate without gouging it.',
      opt_etch_remove_resist_only:
        'Not quite. Resist removal is done in Step 6 (Strip). Etch targets the functional dielectric layer.',
      opt_etch_blanket:
        'Not quite. The photoresist shields covered dielectric areas from being etched.',
    },
  },
  predictionComparisons: {
    opt_etch_selective_film: {
      predicted: 'Removes dielectric film only where the resist stencil is open',
      comparison:
        'Your prediction matched the physical result: dielectric film was selectively etched away in the open windows, while resist protected covered areas.',
    },
    opt_etch_remove_substrate: {
      predicted: 'Digs deep trenches into the entire silicon substrate',
      comparison:
        'You predicted substrate etching. In this step, the etch chemistry selectively stops on the silicon substrate.',
    },
    opt_etch_remove_resist_only: {
      predicted: 'Removes only the photoresist and leaves the dielectric unchanged',
      comparison:
        'You predicted resist removal. Resist removal is performed in the next step (Strip); etch transfers the pattern into the dielectric.',
    },
    opt_etch_blanket: {
      predicted: 'Uniformly removes 50 nm across all layers simultaneously',
      comparison:
        'You predicted blanket removal. Etch is highly anisotropic and selective, removing dielectric only through the stencil mask.',
    },
  },
  interpretationQuestion: {
    id: 'interp_etch_mask',
    prompt: 'What was the purpose of the photoresist during the etch step?',
    subtext: 'Examine the remaining layers in the cross section.',
    correctOptionId: 'interp_etch_protective_mask',
    options: [
      {
        id: 'interp_etch_protective_mask',
        label:
          'It acted as a sacrificial barrier, protecting selected dielectric regions while open areas were etched.',
      },
      {
        id: 'interp_etch_chemical_catalyst',
        label:
          'It chemically accelerated the etch rate of the silicon substrate.',
      },
      {
        id: 'interp_etch_permanent_insulator',
        label:
          'It melted into the dielectric to improve electrical insulation.',
      },
    ],
    feedbackByOptionId: {
      interp_etch_protective_mask:
        'Correct! The photoresist acts as a sacrificial shield (mask). Because the etchant attacks dielectric faster than resist, the stencil pattern transfers directly into the dielectric film.',
      interp_etch_chemical_catalyst:
        'Not quite. Photoresist is inert to the etching reaction and serves strictly as a mechanical and chemical barrier.',
      interp_etch_permanent_insulator:
        'Not quite. Photoresist is organic and must be completely stripped in the next step.',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// ◇ AEI INSPECTION (After-Etch Inspection Checkpoint)
// ─────────────────────────────────────────────────────────────
export const AEI_CURRICULUM: StepCurriculumItem = {
  id: 'aei',
  isCheckpoint: true,
  checkpointKind: 'AEI',
  title: 'AEI Inspection',
  subtitle: 'Non-destructive post-etch metrology and film pattern verification',
  stationName: 'Metrology / Inspection Bay',
  keyIdea:
    'Post-etch patterned dielectric; photoresist remains until Strip. AEI is non-destructive and does not modify wafer layers.',
  runButtonLabel: 'Run AEI Inspection',
  runningAnnouncement: 'Executing post-etch critical dimension and depth metrology scan...',
  finishedAnnouncement:
    'AEI Inspection completed: Etched dielectric pattern depth and sidewall profiles match specifications.',
  nextStepId: 'strip',
  nextStepLabel: 'Continue to Strip',
  defaultAction: {
    type: 'inspect',
    checkpoint: 'AEI',
  },
  checkpointConfig: {
    checkpointKind: 'AEI',
    targetLayer: 'Etched Dielectric Film (SiO₂)',
    description:
      'Post-etch patterned dielectric; photoresist remains until Strip. AEI is non-destructive and does not modify wafer layers.',
    reworkable: false,
    reworkExplanation:
      'Post-etch patterned dielectric; photoresist remains until Strip. AEI is non-destructive and does not modify wafer layers.',
    inspectionMetrics: [
      { label: 'Etch Depth', spec: '100 nm (Target)', status: 'pass' },
      { label: 'Dielectric Critical Dimension', spec: 'Within ± 1.0 nm', status: 'pass' },
      { label: 'Sidewall Verticality', spec: '88°–90° profile', status: 'pass' },
    ],
  },
  interpretationQuestion: {
    id: 'interp_aei_permanence',
    prompt: 'What does After-Etch Inspection (AEI) verify?',
    subtext: 'Compare AEI against the earlier ADI checkpoint.',
    correctOptionId: 'interp_aei_permanent_transfer',
    options: [
      {
        id: 'interp_aei_permanent_transfer',
        label:
          'Verifies that the pattern was faithfully transferred into the dielectric film within tolerance.',
      },
      {
        id: 'interp_aei_rework_allowed',
        label:
          'Confirms whether the dielectric film can be easily wiped off and recoated if defective.',
      },
      {
        id: 'interp_aei_vacuum_seal',
        label:
          'Checks whether the vacuum seals on the etch chamber are leaking air.',
      },
    ],
    feedbackByOptionId: {
      interp_aei_permanent_transfer:
        'Correct! AEI confirms that critical dimensions (CD), sidewall angles, and etch depth meet tight nanoscale specifications.',
      interp_aei_rework_allowed:
        'Not quite. Material has been etched away from the dielectric film and cannot be simply wiped off.',
      interp_aei_vacuum_seal:
        'Not quite. AEI is an optical/electron-beam wafer inspection, not equipment pressure maintenance.',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// 6. STRIP
// ─────────────────────────────────────────────────────────────
export const STRIP_CURRICULUM: StepCurriculumItem = {
  id: 'strip',
  stepNumber: 6,
  totalSteps: 6,
  title: 'Strip',
  subtitle: 'Completely removing sacrificial photoresist mask from the wafer',
  stationName: 'Resist Strip Station',
  keyIdea:
    'Photoresist removed; patterned underlying dielectric remains.',
  runButtonLabel: 'Run Resist Strip',
  runningAnnouncement: 'Igniting oxygen plasma asher and cleaning wafer surface...',
  finishedAnnouncement:
    'Resist strip completed. Photoresist removed; patterned underlying dielectric remains.',
  nextStepId: 'repeat',
  nextStepLabel: 'View Patterning Cycle Summary',
  defaultAction: {
    type: 'strip',
  },
  predictionQuestion: {
    id: 'q_strip_prediction',
    prompt: 'What will the strip process remove from the wafer?',
    subtext: 'Consider the final state needed before building the next layer.',
    correctOptionId: 'opt_strip_remove_resist',
    options: [
      {
        id: 'opt_strip_remove_resist',
        label: 'Completely removes sacrificial photoresist, leaving only patterned dielectric',
      },
      {
        id: 'opt_strip_remove_dielectric',
        label: 'Removes the patterned dielectric and leaves only photoresist',
      },
      {
        id: 'opt_strip_remove_silicon',
        label: 'Strips the top layer of silicon substrate',
      },
      {
        id: 'opt_strip_remove_all',
        label: 'Strips all material layers back to an empty carrier',
      },
    ],
    feedbackByOptionId: {
      opt_strip_remove_resist:
        'Correct! Oxygen plasma ashing or solvent strip dissolves and burns away the organic photoresist, leaving cleanly patterned dielectric features on silicon.',
      opt_strip_remove_dielectric:
        'Not quite. The dielectric film is the permanent functional structure we worked hard to pattern!',
      opt_strip_remove_silicon:
        'Not quite. The monocrystalline silicon substrate remains completely intact.',
      opt_strip_remove_all:
        'Not quite. Only the temporary photoresist mask is removed.',
    },
  },
  predictionComparisons: {
    opt_strip_remove_resist: {
      predicted: 'Completely removes sacrificial photoresist, leaving only patterned dielectric',
      comparison:
        'Your prediction matched the physical result: all photoresist has been stripped away, leaving a clean, permanently patterned dielectric film on the silicon substrate.',
    },
    opt_strip_remove_dielectric: {
      predicted: 'Removes the patterned dielectric and leaves only photoresist',
      comparison:
        'You predicted dielectric removal. Dielectric is the permanent functional layer; photoresist is the sacrificial mask that was stripped.',
    },
    opt_strip_remove_silicon: {
      predicted: 'Strips the top layer of silicon substrate',
      comparison:
        'You predicted substrate stripping. The silicon substrate provides the solid foundation and is preserved throughout processing.',
    },
    opt_strip_remove_all: {
      predicted: 'Strips all material layers back to an empty carrier',
      comparison:
        'You predicted complete layer removal. Only the sacrificial photoresist is removed, leaving the patterned circuit film intact.',
    },
  },
  interpretationQuestion: {
    id: 'interp_strip_organic',
    prompt: 'Why must all photoresist be removed before subsequent fabrication steps?',
    subtext: 'Think about cleanroom purity and subsequent high-temperature manufacturing.',
    correctOptionId: 'interp_strip_organic_contamination',
    options: [
      {
        id: 'interp_strip_organic_contamination',
        label:
          'Photoresist is an organic polymer that degrades and contaminates high-temperature furnaces and future deposition steps.',
      },
      {
        id: 'interp_strip_too_heavy',
        label:
          'Photoresist adds too much physical weight to the wafer.',
      },
      {
        id: 'interp_strip_changes_color',
        label:
          'Photoresist changes the visual color of the chip package.',
      },
    ],
    feedbackByOptionId: {
      interp_strip_organic_contamination:
        'Correct! Organic photoresist cannot withstand the high temperatures (400°C–1000°C) of subsequent processing. Leaving residual polymer would ruin device yields.',
      interp_strip_too_heavy:
        'Not quite. A nanometer-thin polymer film weighs virtually nothing.',
      interp_strip_changes_color:
        'Not quite. Microscopic chip features are enclosed in opaque ceramic or resin packages.',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// ↺ REPEAT / MULTI-LAYER INTERCONNECT CYCLE
// ─────────────────────────────────────────────────────────────
export const REPEAT_CURRICULUM: StepCurriculumItem = {
  id: 'repeat',
  title: 'Multi-Layer Interconnects & Repeat',
  subtitle:
    'Building 3D metallization stacks, vias, and CMP planarization',
  stationName: 'Cleanroom Interconnect Loop',
  keyIdea:
    'Transistors alone cannot compute; they must be wired together. Microprocessors contain up to 15–20 stacked metallization layers. Each metallization level repeats deposition, lithography, etch, metal fill (copper damascene / electroplating), and chemical-mechanical planarization (CMP).',
  runButtonLabel: 'Build Multi-Layer Interconnect Stack',
  runningAnnouncement: 'Executing copper electroplating, CMP planarization, and multi-layer metallization cycle...',
  finishedAnnouncement: 'Multi-layer interconnect stack completed: 3D metallization and inter-layer dielectrics integrated.',
  nextStepId: 'deposition',
  nextStepLabel: 'Begin New Patterning Cycle',
  defaultAction: {
    type: 'build-multilayer',
  },
  predictionQuestion: {
    id: 'q_repeat_prediction',
    prompt: "Why can't a modern microchip function with only a single patterned layer?",
    subtext: 'Consider how billions of transistors must communicate without signal short-circuits.',
    correctOptionId: 'opt_multi_3d_routing',
    options: [
      {
        id: 'opt_multi_3d_routing',
        label:
          'A single layer cannot route overlapping electrical signals without short-circuiting; multi-layer interconnects provide 3D wiring.',
      },
      {
        id: 'opt_multi_air_pressure',
        label:
          'A single layer is too thin to withstand atmospheric air pressure inside computers.',
      },
      {
        id: 'opt_multi_heatsink_weight',
        label:
          'Additional layers are added only to give the chip physical weight for heatsink mounting.',
      },
      {
        id: 'opt_multi_electron_exhaust',
        label:
          'Single-layer chips run out of available valence electrons after one hour of operation.',
      },
    ],
    feedbackByOptionId: {
      opt_multi_3d_routing:
        'Correct! Transistors alone cannot compute without complex interconnection networks. 10 to 20+ layers of copper wiring provide 3D routing to connect billions of transistors without electrical short-circuits.',
      opt_multi_air_pressure:
        'Not quite. Silicon wafers and microchips are structurally solid and operate in vacuum or standard atmosphere without collapsing.',
      opt_multi_heatsink_weight:
        'Not quite. Nanometer-thin layers add virtually zero physical mass; heatsinks are clamped via mechanical package brackets.',
      opt_multi_electron_exhaust:
        'Not quite. Circuits operate via continuous electron flow driven by an external power supply.',
    },
  },
  predictionComparisons: {
    opt_multi_3d_routing: {
      predicted: 'A single layer cannot route overlapping electrical signals without short-circuiting',
      comparison:
        'Your prediction matched physical reality: the multi-layer cycle constructed 3D copper interconnects (M1, Vias, and M2) separated by low-k inter-layer dielectric (ILD) to route signals without shorts.',
    },
    opt_multi_air_pressure: {
      predicted: 'A single layer is too thin to withstand atmospheric air pressure',
      comparison:
        'You predicted atmospheric pressure protection. In reality, multiple layers are added strictly for electrical circuit routing; structural stability is provided by the 775 µm bulk silicon substrate.',
    },
    opt_multi_heatsink_weight: {
      predicted: 'Additional layers are added only to give the chip physical weight',
      comparison:
        'You predicted physical weight addition. Multi-layer interconnect stacks are only a few micrometers thick total; they provide 3D signal routing.',
    },
    opt_multi_electron_exhaust: {
      predicted: 'Single-layer chips run out of available valence electrons',
      comparison:
        'You predicted electron exhaustion. Circuits do not consume electrons; multiple layers provide 3D wiring pathways for high-speed signal flow.',
    },
  },
  interpretationQuestion: {
    id: 'interp_repeat_cmp',
    prompt: 'Why is Chemical-Mechanical Planarization (CMP) essential between multi-layer interconnect cycles?',
    subtext: 'Consider optical lithography depth of focus and topography buildup across multiple layers.',
    correctOptionId: 'interp_cmp_dof',
    options: [
      {
        id: 'interp_cmp_dof',
        label:
          'CMP creates an atomically flat optical surface so scanner lenses can maintain depth of focus (DoF) for subsequent lithography layers.',
      },
      {
        id: 'interp_cmp_socket_glue',
        label:
          'CMP permanently bonds the silicon substrate to the motherboard chip socket.',
      },
      {
        id: 'interp_cmp_resistance',
        label:
          'CMP increases electrical resistance in the copper wires to generate thermal heat.',
      },
    ],
    feedbackByOptionId: {
      interp_cmp_dof:
        'Correct! Without CMP polishing, uneven layer topography compounds with each step, quickly exceeding the scanner\'s narrow depth of focus (DoF ~50–100 nm) and causing severe lithographic defocus defects.',
      interp_cmp_socket_glue:
        'Not quite. CMP is an internal wafer polishing process before dicing and packaging.',
      interp_cmp_resistance:
        'Not quite. Interconnect engineering strives to minimize electrical resistance (R) and capacitance (C) to reduce signal delay.',
    },
  },
};

// ─────────────────────────────────────────────────────────────
// CURRICULUM REGISTRY & LOOKUP
// ─────────────────────────────────────────────────────────────
export const WAFER_LAB_CURRICULUM_REGISTRY: Record<string, StepCurriculumItem> = {
  deposition: DEPOSITION_CURRICULUM,
  coat: COAT_RESIST_CURRICULUM,
  lithography: LITHOGRAPHY_CURRICULUM,
  develop: DEVELOP_CURRICULUM,
  adi: ADI_CURRICULUM,
  etch: ETCH_CURRICULUM,
  aei: AEI_CURRICULUM,
  strip: STRIP_CURRICULUM,
  repeat: REPEAT_CURRICULUM,
};

export function getStepCurriculum(stepId: string): StepCurriculumItem {
  const normalized = normalizeCanonicalNodeId(stepId);
  if (!normalized) {
    return DEPOSITION_CURRICULUM;
  }
  return WAFER_LAB_CURRICULUM_REGISTRY[normalized] ?? DEPOSITION_CURRICULUM;
}
