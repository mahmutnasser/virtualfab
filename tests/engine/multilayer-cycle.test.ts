import { describe, it, expect } from 'vitest';
import {
  applyProcess,
  createBareWafer,
  validateProcessAction,
  canExecuteScenarioStep,
} from '../../src/engine/process-engine';
import {
  createMultiLayerWaferState,
  validateLayerInvariants,
  SILICON_SUBSTRATE_LAYER,
  OXIDE_DEPOSITED_LAYER,
  type WaferState,
} from '../../src/engine/types';

describe('Multi-Layer Wafer Lab Cycle Engine & State (Option A)', () => {
  it('allows build-multilayer when oxide layer is present', () => {
    const waferWithOxide: WaferState = {
      currentStepId: 'strip',
      layers: [
        { ...SILICON_SUBSTRATE_LAYER },
        {
          ...OXIDE_DEPOSITED_LAYER,
          presenceMask: [
            false, true, true, false,
            false, true, true, false,
            false, true, true, false,
            false, true, true, false,
          ],
        },
      ],
    };

    const actionResult = validateProcessAction(waferWithOxide, {
      type: 'build-multilayer',
      metalMaterial: 'copper',
    });
    expect(actionResult.allowed).toBe(true);

    const scenarioResult = canExecuteScenarioStep(waferWithOxide, {
      type: 'build-multilayer',
    });
    expect(scenarioResult.allowed).toBe(true);
  });

  it('rejects build-multilayer when wafer has no base dielectric layer', () => {
    const bare = createBareWafer();
    const actionResult = validateProcessAction(bare, {
      type: 'build-multilayer',
    });
    expect(actionResult.allowed).toBe(false);
    expect(actionResult.reason).toMatch(/requires an underlying patterned dielectric/i);

    const scenarioResult = canExecuteScenarioStep(bare, {
      type: 'build-multilayer',
    });
    expect(scenarioResult.allowed).toBe(false);
  });

  it('applyProcess executes build-multilayer generating 5 layers with BEOL interconnects and CMP', () => {
    const initialWafer: WaferState = {
      currentStepId: 'strip',
      layers: [
        { ...SILICON_SUBSTRATE_LAYER },
        {
          ...OXIDE_DEPOSITED_LAYER,
          presenceMask: [
            false, true, true, false,
            false, true, true, false,
            false, true, true, false,
            false, true, true, false,
          ],
        },
      ],
    };

    const result = applyProcess(initialWafer, {
      type: 'build-multilayer',
      metalMaterial: 'copper',
    });

    expect(result.valid).toBe(true);
    expect(result.nextState.layers).toHaveLength(5);
    expect(result.nextState.currentStepId).toBe('repeat');

    const [sub, m0Oxide, m1, ild, m2] = result.nextState.layers;
    expect(sub.id).toBe('silicon-substrate');
    expect(m0Oxide.id).toBe('oxide-film');
    expect(m1.id).toBe('metal-m1');
    expect(m1.material).toBe('metal');
    expect(m1.chemicalFormula).toBe('Cu');
    expect(m1.name).toContain('Metal 1');
    expect(m1.thicknessNm).toBe(150);

    expect(ild.id).toBe('oxide-ild');
    expect(ild.material).toBe('oxide');
    expect(ild.name).toContain('Inter-Layer Dielectric');
    expect(ild.thicknessNm).toBe(100);

    expect(m2.id).toBe('metal-m2');
    expect(m2.material).toBe('metal');
    expect(m2.chemicalFormula).toBe('Cu');
    expect(m2.name).toContain('Metal 2');
    expect(m2.thicknessNm).toBe(200);

    // Verify all layer presenceMasks have 16 segments
    result.nextState.layers.forEach((layer) => {
      expect(layer.presenceMask).toHaveLength(16);
      expect(() => validateLayerInvariants(layer)).not.toThrow();
    });

    // Verify feedback mentions Dual-Damascene, CMP, and Cu
    expect(result.feedback).toBeDefined();
    expect(result.feedback[0]).toMatch(/metallization stack formed with copper damascene and CMP/i);
    expect(result.changes).toBeDefined();
    expect(result.changes.some((c) => c.description.includes('CMP'))).toBe(true);
  });

  it('supports alternative metal material such as tungsten', () => {
    const initialWafer: WaferState = {
      currentStepId: 'strip',
      layers: [
        { ...SILICON_SUBSTRATE_LAYER },
        {
          ...OXIDE_DEPOSITED_LAYER,
          presenceMask: Array(16).fill(true),
        },
      ],
    };

    const result = applyProcess(initialWafer, {
      type: 'build-multilayer',
      metalMaterial: 'tungsten',
    });

    expect(result.valid).toBe(true);
    const m1 = result.nextState.layers.find((l) => l.id === 'metal-m1');
    expect(m1).toBeDefined();
    expect(m1?.material).toBe('metal');
    expect(m1?.chemicalFormula).toBe('W');
    expect(m1?.name).toContain('Tungsten');
  });

  it('createMultiLayerWaferState produces valid default state with 5 layers and valid invariants', () => {
    const mlState = createMultiLayerWaferState();
    expect(mlState.currentStepId).toBe('repeat');
    expect(mlState.layers).toHaveLength(5);
    mlState.layers.forEach((layer) => {
      expect(() => validateLayerInvariants(layer)).not.toThrow();
    });
  });
});
