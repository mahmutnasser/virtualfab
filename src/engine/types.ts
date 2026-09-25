/**
 * SIMULATION SPATIAL DISCRETIZATION CONTRACT:
 *
 * 16 discrete spatial segments across the wafer diameter represent a conceptual
 * spatial discretization for this educational simulation.
 *
 * IMPORTANT SCIENTIFIC NOTICE:
 * 16 segments are NOT:
 * - physical resolution
 * - feature count
 * - die count
 * - scanner resolution
 * - predictive process geometry
 *
 * The UI must NEVER display "16 segments" as though it were a physical
 * semiconductor property.
 */
export const SIMULATION_MASK_SEGMENTS = 16;

export type MaterialKind =
  | 'silicon'
  | 'oxide'
  | 'photoresist'
  | 'metal'
  | 'nitride'
  | 'other';

export interface MaterialLayer {
  id: string;
  material: MaterialKind;
  name: string;
  chemicalFormula?: string;
  thicknessNm?: number;
  thicknessLabel: string;
  relativeHeight: number; // visual height in SVG units
  presenceMask: boolean[]; // 16 discrete conceptual spatial segments
  /**
   * Exposure state is strictly scoped to photosensitive photoresist layers.
   * Invariant: Must remain undefined for non-resist materials (silicon, oxide, metal, etc.).
   */
  exposureMask?: boolean[];
  color: string;
  patternType?: 'crosshatch' | 'dots' | 'stripes';
}

export interface WaferState {
  currentStepId: string;
  layers: MaterialLayer[];
}

export type MaterialTransformAction =
  | {
      type: 'deposit';
      material: MaterialKind;
      thicknessNm?: number;
      scenarioOptions?: {
        displayName?: string;
        formula?: string;
        illustrativeThicknessNm?: number;
      };
    }
  | {
      type: 'coat-resist';
      tone: 'positive'; // Explicit educational assumption for this learning cycle
      thicknessNm?: number;
    }
  | {
      type: 'expose';
      exposureMask: boolean[]; // 16-segment optical exposure stencil
    }
  | {
      type: 'develop';
    }
  | {
      type: 'etch';
      targetLayerId?: string;
    }
  | {
      type: 'strip';
    }
  | {
      type: 'build-multilayer';
      metalMaterial?: 'copper' | 'tungsten';
    };

export type MetrologyCheckpointKind = 'ADI' | 'AEI';

export interface MetrologyCheckpointDefinition {
  id: string; // 'adi' | 'aei'
  checkpointKind: MetrologyCheckpointKind;
  name: string;
  shortName: string;
  stage: 'post-develop' | 'post-etch';
  targetLayerMaterial: 'photoresist' | 'oxide';
  stationId: string;
  description: string;
  whyThisCheckpoint: string;
  sourceIds: string[];
}

export type ProcessControlAction = {
  type: 'inspect';
  checkpoint?: MetrologyCheckpointKind;
  targetPattern?: boolean[];
};

export type ProcessAction = MaterialTransformAction | ProcessControlAction;

export interface ProcessChange {
  layerId: string;
  changeType: 'added' | 'removed' | 'modified';
  description: string;
}

export interface MetrologyInspectionData {
  checkpoint: MetrologyCheckpointKind;
  result: 'match' | 'mismatch';
  inspectedLayerMaterial: MaterialKind;
  differingSegments: number[];
  conceptualFeedback: string;
}

export interface ProcessResult {
  valid: boolean;
  previousState: WaferState;
  nextState: WaferState;
  changes: ProcessChange[];
  feedback: string[];
  inspection?: MetrologyInspectionData;
}

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates domain invariants on a single material layer.
 * Enforces mask length and exposureMask material scoping.
 */
export function validateLayerInvariants(layer: MaterialLayer): void {
  if (layer.presenceMask.length !== SIMULATION_MASK_SEGMENTS) {
    throw new Error(
      `[SIMULATION INVARIANT VIOLATION] presenceMask must have length ${SIMULATION_MASK_SEGMENTS}, got ${layer.presenceMask.length}`,
    );
  }

  if (layer.exposureMask !== undefined) {
    if (layer.material !== 'photoresist') {
      throw new Error(
        `[SCIENTIFIC SCOPE VIOLATION] exposureMask is strictly scoped to 'photoresist' materials. Layer '${layer.id}' of material '${layer.material}' cannot have an exposureMask.`,
      );
    }
    if (layer.exposureMask.length !== SIMULATION_MASK_SEGMENTS) {
      throw new Error(
        `[SIMULATION INVARIANT VIOLATION] exposureMask must have length ${SIMULATION_MASK_SEGMENTS}, got ${layer.exposureMask.length}`,
      );
    }
  }

  if (layer.thicknessNm !== undefined && layer.thicknessNm < 0) {
    throw new Error(
      `[PHYSICAL INVARIANT VIOLATION] layer thickness cannot be negative: ${layer.thicknessNm} nm`,
    );
  }
}

/**
 * Canonical material layer templates.
 * Scenario-specific illustrative dimensions are provided as default examples.
 */
export const SILICON_SUBSTRATE_LAYER: MaterialLayer = {
  id: 'silicon-substrate',
  material: 'silicon',
  name: 'Silicon Substrate',
  chemicalFormula: 'Si',
  thicknessNm: 775000,
  thicknessLabel: '775 µm substrate (illustrative)',
  relativeHeight: 110,
  presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  color: '#6B7B8D',
  patternType: 'crosshatch',
};

export const OXIDE_DEPOSITED_LAYER: MaterialLayer = {
  id: 'oxide-film',
  material: 'oxide',
  name: 'Silicon Dioxide',
  chemicalFormula: 'SiO₂',
  thicknessNm: 100,
  thicknessLabel: '~100 nm (illustrative)',
  relativeHeight: 40,
  presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  color: '#B0D4E8',
  patternType: 'dots',
};

export const PHOTORESIST_LAYER: MaterialLayer = {
  id: 'photoresist-layer',
  material: 'photoresist',
  name: 'Photoresist',
  chemicalFormula: 'Polymer (Positive Tone)',
  thicknessNm: 300,
  thicknessLabel: '~300 nm (illustrative)',
  relativeHeight: 35,
  presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  exposureMask: Array(SIMULATION_MASK_SEGMENTS).fill(false),
  color: '#E0A842',
  patternType: 'stripes',
};

/**
 * Canonical multi-layer interconnect templates.
 * Represent Back-End of Line (BEOL) metallization and planarization.
 */
export const METAL_M1_LAYER: MaterialLayer = {
  id: 'metal-m1',
  material: 'metal',
  name: 'Metal 1 Plugs & Contacts (Cu)',
  chemicalFormula: 'Cu',
  thicknessNm: 150,
  thicknessLabel: '~150 nm (illustrative)',
  relativeHeight: 36,
  presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  color: '#D97706',
  patternType: 'stripes',
};

export const DIELECTRIC_ILD_LAYER: MaterialLayer = {
  id: 'oxide-ild',
  material: 'oxide',
  name: 'Inter-Layer Dielectric (ILD)',
  chemicalFormula: 'SiO₂',
  thicknessNm: 100,
  thicknessLabel: '~100 nm (illustrative)',
  relativeHeight: 32,
  presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  color: '#B0D4E8',
  patternType: 'dots',
};

export const METAL_M2_LAYER: MaterialLayer = {
  id: 'metal-m2',
  material: 'metal',
  name: 'Metal 2 Interconnects (Cu)',
  chemicalFormula: 'Cu',
  thicknessNm: 200,
  thicknessLabel: '~200 nm (illustrative)',
  relativeHeight: 32,
  presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  color: '#F59E0B',
  patternType: 'stripes',
};

/**
 * Creates a multi-layer interconnect wafer state demonstrating 3D BEOL metallization.
 */
export function createMultiLayerWaferState(
  baseState?: WaferState,
  metalMaterial: 'copper' | 'tungsten' = 'copper',
): WaferState {
  const substrate = baseState?.layers.find((l) => l.material === 'silicon') ?? { ...SILICON_SUBSTRATE_LAYER };

  // Base patterned oxide layer: segments [4..11] etched open for contact windows
  const baseOxidePresence = Array(SIMULATION_MASK_SEGMENTS).fill(true);
  for (let i = 4; i <= 11; i++) {
    baseOxidePresence[i] = false;
  }
  const existingOxide = baseState?.layers.find((l) => l.material === 'oxide' && l.id === 'oxide-film');
  const oxide1: MaterialLayer = existingOxide
    ? {
        ...existingOxide,
        presenceMask: [...existingOxide.presenceMask],
      }
    : {
        ...OXIDE_DEPOSITED_LAYER,
        presenceMask: baseOxidePresence,
      };

  // M1 fills the contact openings and forms contact pads
  const m1: MaterialLayer = {
    ...METAL_M1_LAYER,
    material: 'metal',
    name: metalMaterial === 'tungsten' ? 'Metal 1 Contact Plugs (Tungsten W)' : METAL_M1_LAYER.name,
    chemicalFormula: metalMaterial === 'tungsten' ? 'W' : 'Cu',
    presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  };

  // ILD isolates M1
  const ild: MaterialLayer = {
    ...DIELECTRIC_ILD_LAYER,
    presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
  };

  // M2 forms upper routing lines with selective presence
  const m2Presence = Array(SIMULATION_MASK_SEGMENTS).fill(true);
  m2Presence[0] = false;
  m2Presence[5] = false;
  m2Presence[10] = false;
  m2Presence[15] = false;
  const m2: MaterialLayer = {
    ...METAL_M2_LAYER,
    presenceMask: m2Presence,
  };

  return {
    currentStepId: 'repeat',
    layers: [
      { ...substrate, presenceMask: [...substrate.presenceMask] },
      oxide1,
      m1,
      ild,
      m2,
    ],
  };
}

/**
 * Canonical bare silicon wafer substrate baseline.
 */
export const INITIAL_BARE_WAFER_STATE: WaferState = {
  currentStepId: 'start',
  layers: [{ ...SILICON_SUBSTRATE_LAYER }],
};


