import { describe, it, expect } from 'vitest';
import {
  applyProcess,
  createBareWafer,
  canExecuteStep,
  validateProcessAction,
  canExecuteScenarioStep,
} from '../../src/engine/process-engine';
import {
  OXIDE_DEPOSITED_LAYER,
  PHOTORESIST_LAYER,
  SIMULATION_MASK_SEGMENTS,
  validateLayerInvariants,
  type WaferState,
  type MaterialLayer,
} from '../../src/engine/types';

describe('ProcessEngine (Task VF-008 & Scientific Scope Refinements)', () => {
  describe('Separation of Generic Action vs Scenario Sequence Validation', () => {
    it('generic engine does not claim deposition-after-resist is physically impossible', () => {
      const bare = createBareWafer();
      const waferWithResist: WaferState = {
        currentStepId: 'coat',
        layers: [
          bare.layers[0],
          { ...PHOTORESIST_LAYER, presenceMask: Array(16).fill(true) },
        ],
      };

      // In a generic physical engine, depositing thin film over resist (e.g. lift-off) is a valid modeled action
      const genericResult = validateProcessAction(waferWithResist, {
        type: 'deposit',
        material: 'metal',
      });
      expect(genericResult.allowed).toBe(true);
    });

    it('scenario validator rejects deposition-after-resist for the current Silicon Journey cycle', () => {
      const bare = createBareWafer();
      const waferWithResist: WaferState = {
        currentStepId: 'coat',
        layers: [
          bare.layers[0],
          { ...PHOTORESIST_LAYER, presenceMask: Array(16).fill(true) },
        ],
      };

      const scenarioResult = canExecuteScenarioStep(waferWithResist, {
        type: 'deposit',
        material: 'oxide',
      });
      expect(scenarioResult.allowed).toBe(false);
      expect(scenarioResult.reason).toMatch(/simplified patterning cycle expects the dielectric film to be deposited before photoresist/i);
    });

    it('generic engine allows spin-coating resist directly on bare silicon substrate', () => {
      const bare = createBareWafer();
      const genericResult = validateProcessAction(bare, {
        type: 'coat-resist',
        tone: 'positive',
      });
      expect(genericResult.allowed).toBe(true);
    });

    it('scenario validator requires deposition before resist coating for Silicon Journey cycle', () => {
      const bare = createBareWafer();
      const scenarioResult = canExecuteScenarioStep(bare, {
        type: 'coat-resist',
        tone: 'positive',
      });
      expect(scenarioResult.allowed).toBe(false);
      expect(scenarioResult.reason).toMatch(/expects the dielectric film to be deposited before photoresist/i);
    });

    it('generic engine allows inspection with photoresist present (e.g. resist profile / CD-SEM inspection)', () => {
      const bare = createBareWafer();
      const waferWithResist: WaferState = {
        currentStepId: 'develop',
        layers: [
          bare.layers[0],
          { ...OXIDE_DEPOSITED_LAYER, presenceMask: Array(16).fill(true) },
          { ...PHOTORESIST_LAYER, presenceMask: Array(16).fill(true) },
        ],
      };

      const genericResult = validateProcessAction(waferWithResist, {
        type: 'inspect',
      });
      expect(genericResult.allowed).toBe(true);
    });

    it('scenario validator enforces ADI requires developed resist before inspection', () => {
      const bare = createBareWafer();
      const waferWithUndevelopedResist: WaferState = {
        currentStepId: 'coat',
        layers: [
          bare.layers[0],
          { ...OXIDE_DEPOSITED_LAYER, presenceMask: Array(16).fill(true) },
          { ...PHOTORESIST_LAYER, presenceMask: Array(16).fill(true) },
        ],
      };

      const scenarioResult = canExecuteScenarioStep(waferWithUndevelopedResist, {
        type: 'inspect',
        checkpoint: 'ADI',
      });
      expect(scenarioResult.allowed).toBe(false);
      expect(scenarioResult.reason).toMatch(/requires photoresist to be developed/i);
    });

    it('scenario validator enforces AEI requires etched film before inspection', () => {
      const bare = createBareWafer();
      const waferBeforeEtch: WaferState = {
        currentStepId: 'develop',
        layers: [
          bare.layers[0],
          { ...OXIDE_DEPOSITED_LAYER, presenceMask: Array(16).fill(true) },
        ],
      };

      const scenarioResult = canExecuteScenarioStep(waferBeforeEtch, {
        type: 'inspect',
        checkpoint: 'AEI',
      });
      expect(scenarioResult.allowed).toBe(false);
      expect(scenarioResult.reason).toMatch(/requires etching to be completed/i);
    });

    it('canExecuteStep honors enforceScenarioSequence option', () => {
      const bare = createBareWafer();
      const waferWithResist: WaferState = {
        currentStepId: 'coat',
        layers: [
          bare.layers[0],
          { ...PHOTORESIST_LAYER, presenceMask: Array(16).fill(true) },
        ],
      };

      // By default, enforces scenario sequence (rejects deposition after resist)
      expect(canExecuteStep(waferWithResist, { type: 'deposit', material: 'oxide' }).allowed).toBe(false);

      // When enforceScenarioSequence: false, permits generic physical deposition
      expect(canExecuteStep(waferWithResist, { type: 'deposit', material: 'oxide' }, { enforceScenarioSequence: false }).allowed).toBe(true);
    });
  });

  describe('Individual Transformations (applyProcess)', () => {
    it('Step 1 (Deposition): successfully deposits uniform oxide film', () => {
      const bare = createBareWafer();
      const result = applyProcess(bare, {
        type: 'deposit',
        material: 'oxide',
        thicknessNm: 120,
      });

      expect(result.valid).toBe(true);
      expect(result.nextState.currentStepId).toBe('deposition');
      expect(result.nextState.layers).toHaveLength(2);

      const oxide = result.nextState.layers[1];
      expect(oxide.material).toBe('oxide');
      expect(oxide.thicknessNm).toBe(120);
      expect(oxide.presenceMask).toHaveLength(SIMULATION_MASK_SEGMENTS);
      expect(oxide.presenceMask.every(Boolean)).toBe(true);
      expect(oxide.exposureMask).toBeUndefined(); // Invariant: no exposureMask on oxide
    });

    it('Step 2 (Coat Resist): spin-coats uniform unexposed positive photoresist', () => {
      const bare = createBareWafer();
      const deposited = applyProcess(bare, { type: 'deposit', material: 'oxide' }).nextState;

      const result = applyProcess(deposited, {
        type: 'coat-resist',
        tone: 'positive',
        thicknessNm: 300,
      });

      expect(result.valid).toBe(true);
      expect(result.nextState.currentStepId).toBe('coat');
      expect(result.nextState.layers).toHaveLength(3);

      const resist = result.nextState.layers[2];
      expect(resist.material).toBe('photoresist');
      expect(resist.thicknessNm).toBe(300);
      expect(resist.presenceMask.every(Boolean)).toBe(true);
      expect(resist.exposureMask).toBeDefined();
      expect(resist.exposureMask).toHaveLength(SIMULATION_MASK_SEGMENTS);
      expect(resist.exposureMask!.every((val) => val === false)).toBe(true); // Unexposed baseline
    });

    it('Step 3 (Lithography / Expose): records photochemical latent image without altering presenceMask', () => {
      const bare = createBareWafer();
      const deposited = applyProcess(bare, { type: 'deposit', material: 'oxide' }).nextState;
      const coated = applyProcess(deposited, { type: 'coat-resist', tone: 'positive' }).nextState;

      // Optical exposure pattern: expose center segments [6, 7, 8, 9]
      const mask = Array(SIMULATION_MASK_SEGMENTS).fill(false);
      mask[6] = true;
      mask[7] = true;
      mask[8] = true;
      mask[9] = true;

      const result = applyProcess(coated, {
        type: 'expose',
        exposureMask: mask,
      });

      expect(result.valid).toBe(true);
      expect(result.nextState.currentStepId).toBe('lithography');

      const resist = result.nextState.layers[2];
      // Latent image recorded
      expect(resist.exposureMask).toEqual(mask);
      // Physical layer NOT yet dissolved during exposure
      expect(resist.presenceMask.every(Boolean)).toBe(true);
    });

    it('Step 4 (Develop): dissolves exposed positive-tone resist segments', () => {
      const bare = createBareWafer();
      const deposited = applyProcess(bare, { type: 'deposit', material: 'oxide' }).nextState;
      const coated = applyProcess(deposited, { type: 'coat-resist', tone: 'positive' }).nextState;

      const exposureMask = Array(SIMULATION_MASK_SEGMENTS).fill(false);
      exposureMask[6] = true;
      exposureMask[7] = true;
      exposureMask[8] = true;
      exposureMask[9] = true;

      const exposed = applyProcess(coated, {
        type: 'expose',
        exposureMask,
      }).nextState;

      const result = applyProcess(exposed, { type: 'develop' });
      expect(result.valid).toBe(true);
      expect(result.nextState.currentStepId).toBe('develop');

      const resist = result.nextState.layers[2];
      // In positive resist, exposed segments dissolve: presence becomes false at [6, 7, 8, 9]
      expect(resist.presenceMask[6]).toBe(false);
      expect(resist.presenceMask[7]).toBe(false);
      expect(resist.presenceMask[8]).toBe(false);
      expect(resist.presenceMask[9]).toBe(false);
      // Unexposed segments remain intact
      expect(resist.presenceMask[0]).toBe(true);
      expect(resist.presenceMask[5]).toBe(true);
      expect(resist.presenceMask[10]).toBe(true);
    });

    it('Step 5 (Etch): transfers resist-defined openings into the underlying film without claiming universal anisotropic laws', () => {
      const bare = createBareWafer();
      const deposited = applyProcess(bare, { type: 'deposit', material: 'oxide' }).nextState;
      const coated = applyProcess(deposited, { type: 'coat-resist', tone: 'positive' }).nextState;

      const exposureMask = Array(SIMULATION_MASK_SEGMENTS).fill(false);
      exposureMask[4] = true;
      exposureMask[5] = true;

      const exposed = applyProcess(coated, { type: 'expose', exposureMask }).nextState;
      const developed = applyProcess(exposed, { type: 'develop' }).nextState;

      const result = applyProcess(developed, { type: 'etch' });
      expect(result.valid).toBe(true);
      expect(result.nextState.currentStepId).toBe('etch');

      // Method-neutral wording
      expect(result.changes[0].description).toMatch(/Transferred resist-defined openings into the target/i);
      expect(result.feedback[0]).toMatch(/Transferred resist-defined openings/i);

      const oxide = result.nextState.layers.find((l) => l.material === 'oxide')!;
      expect(oxide.presenceMask[4]).toBe(false);
      expect(oxide.presenceMask[5]).toBe(false);
      expect(oxide.presenceMask[0]).toBe(true);
    });

    it('Step 6 (Strip): is method-neutral and does not claim plasma ashing or permanent film', () => {
      const bare = createBareWafer();
      const deposited = applyProcess(bare, { type: 'deposit', material: 'oxide' }).nextState;
      const coated = applyProcess(deposited, { type: 'coat-resist', tone: 'positive' }).nextState;
      const exposureMask = Array(SIMULATION_MASK_SEGMENTS).fill(false);
      exposureMask[4] = true;
      const exposed = applyProcess(coated, { type: 'expose', exposureMask }).nextState;
      const developed = applyProcess(exposed, { type: 'develop' }).nextState;
      const etched = applyProcess(developed, { type: 'etch' }).nextState;

      const result = applyProcess(etched, { type: 'strip' });
      expect(result.valid).toBe(true);
      expect(result.nextState.currentStepId).toBe('strip');

      // Method-neutral verification:
      expect(result.changes[0].description).not.toMatch(/plasma ashing/i);
      expect(result.changes[0].description).toMatch(/Removed the remaining modeled photoresist layer/i);
      expect(result.changes[0].description).not.toMatch(/permanent/i);
      expect(result.feedback[0]).toMatch(/revealing the patterned SiO₂ example film/i);

      // Photoresist layer is gone
      expect(result.nextState.layers.some((l) => l.material === 'photoresist')).toBe(false);
      expect(result.nextState.layers).toHaveLength(2);
    });

    it('Metrology Checkpoints (ADI and AEI): non-destructive educational comparison without predictive semiconductor metrics', () => {
      const bare = createBareWafer();
      const deposited = applyProcess(bare, { type: 'deposit', material: 'oxide' }).nextState;
      const coated = applyProcess(deposited, { type: 'coat-resist', tone: 'positive' }).nextState;
      const exposureMask = Array(SIMULATION_MASK_SEGMENTS).fill(false);
      exposureMask[6] = true;
      exposureMask[7] = true;
      const exposed = applyProcess(coated, { type: 'expose', exposureMask }).nextState;
      const developed = applyProcess(exposed, { type: 'develop' }).nextState;

      // Inspect matching pattern
      const targetPattern = Array(SIMULATION_MASK_SEGMENTS).fill(true);
      targetPattern[6] = false;
      targetPattern[7] = false;

      // 1. ADI (After Develop Inspection) Checkpoint
      const adiResult = applyProcess(developed, {
        type: 'inspect',
        checkpoint: 'ADI',
        targetPattern,
      });

      expect(adiResult.valid).toBe(true);
      expect(adiResult.nextState.currentStepId).toBe('adi');
      expect(adiResult.changes).toHaveLength(0); // Non-destructive!
      expect(adiResult.nextState.layers).toEqual(developed.layers); // Does not mutate layers
      expect(adiResult.inspection?.checkpoint).toBe('ADI');
      expect(adiResult.inspection?.inspectedLayerMaterial).toBe('photoresist');
      expect(adiResult.inspection?.result).toBe('match');
      expect(adiResult.inspection?.differingSegments).toEqual([]);
      expect(adiResult.inspection?.conceptualFeedback).toMatch(/ADI Checkpoint Passed/i);
      expect(adiResult.feedback[0]).not.toMatch(/yield|overlay|defect density|process capability/i);

      // Proceed to Etch
      const etched = applyProcess(developed, { type: 'etch' }).nextState;

      // 2. AEI (After Etch Inspection) Checkpoint
      const aeiResult = applyProcess(etched, {
        type: 'inspect',
        checkpoint: 'AEI',
        targetPattern,
      });

      expect(aeiResult.valid).toBe(true);
      expect(aeiResult.nextState.currentStepId).toBe('aei');
      expect(aeiResult.changes).toHaveLength(0); // Non-destructive!
      expect(aeiResult.nextState.layers).toEqual(etched.layers); // Does not mutate layers
      expect(aeiResult.inspection?.checkpoint).toBe('AEI');
      expect(aeiResult.inspection?.inspectedLayerMaterial).toBe('oxide');
      expect(aeiResult.inspection?.result).toBe('match');
      expect(aeiResult.inspection?.differingSegments).toEqual([]);
      expect(aeiResult.inspection?.conceptualFeedback).toMatch(/AEI Checkpoint Passed/i);

      // Inspect mismatch case at AEI
      const mismatchedPattern = Array(SIMULATION_MASK_SEGMENTS).fill(true); // expects no openings
      const mismatchResult = applyProcess(etched, {
        type: 'inspect',
        checkpoint: 'AEI',
        targetPattern: mismatchedPattern,
      });

      expect(mismatchResult.inspection?.result).toBe('mismatch');
      expect(mismatchResult.inspection?.differingSegments).toEqual([6, 7]);
    });
  });

  describe('Full Patterning Cycle Trace with Interleaved Metrology (Deterministic E2E)', () => {
    it('successfully traces bare silicon through complete sequence: Start -> Deposition -> Coat -> Litho -> Develop -> [ADI] -> Etch -> [AEI] -> Strip', () => {
      // 0. Start Wafer
      const state0 = createBareWafer();
      expect(state0.currentStepId).toBe('start');
      expect(state0.layers).toHaveLength(1);
      expect(state0.layers[0].material).toBe('silicon');

      // 1. Deposition
      const res1 = applyProcess(state0, { type: 'deposit', material: 'oxide', thicknessNm: 100 });
      expect(res1.valid).toBe(true);
      const state1 = res1.nextState;
      expect(state1.currentStepId).toBe('deposition');
      expect(state1.layers).toHaveLength(2);

      // 2. Coat Resist
      const res2 = applyProcess(state1, { type: 'coat-resist', tone: 'positive', thicknessNm: 300 });
      expect(res2.valid).toBe(true);
      const state2 = res2.nextState;
      expect(state2.currentStepId).toBe('coat');
      expect(state2.layers).toHaveLength(3);

      // 3. Lithography / Expose
      const exposureStencil = Array(SIMULATION_MASK_SEGMENTS).fill(false);
      exposureStencil[7] = true;
      exposureStencil[8] = true;
      const res3 = applyProcess(state2, { type: 'expose', exposureMask: exposureStencil });
      expect(res3.valid).toBe(true);
      const state3 = res3.nextState;
      expect(state3.currentStepId).toBe('lithography');

      // 4. Develop
      const res4 = applyProcess(state3, { type: 'develop' });
      expect(res4.valid).toBe(true);
      const state4 = res4.nextState;
      expect(state4.currentStepId).toBe('develop');
      expect(state4.layers[2].presenceMask[7]).toBe(false);
      expect(state4.layers[2].presenceMask[8]).toBe(false);

      // [ADI METROLOGY CHECKPOINT] (Non-destructive, before etch)
      const targetPattern = Array(SIMULATION_MASK_SEGMENTS).fill(true);
      targetPattern[7] = false;
      targetPattern[8] = false;
      const resAdi = applyProcess(state4, { type: 'inspect', checkpoint: 'ADI', targetPattern });
      expect(resAdi.valid).toBe(true);
      expect(resAdi.nextState.currentStepId).toBe('adi');
      expect(resAdi.inspection?.checkpoint).toBe('ADI');
      expect(resAdi.inspection?.result).toBe('match');
      expect(resAdi.changes).toHaveLength(0); // Non-destructive

      // 5. Etch
      const res5 = applyProcess(state4, { type: 'etch' });
      expect(res5.valid).toBe(true);
      const state5 = res5.nextState;
      expect(state5.currentStepId).toBe('etch');
      expect(state5.layers[1].presenceMask[7]).toBe(false);
      expect(state5.layers[1].presenceMask[8]).toBe(false);

      // [AEI METROLOGY CHECKPOINT] (Non-destructive, post-etch)
      const resAei = applyProcess(state5, { type: 'inspect', checkpoint: 'AEI', targetPattern });
      expect(resAei.valid).toBe(true);
      expect(resAei.nextState.currentStepId).toBe('aei');
      expect(resAei.inspection?.checkpoint).toBe('AEI');
      expect(resAei.inspection?.result).toBe('match');
      expect(resAei.changes).toHaveLength(0); // Non-destructive

      // 6. Strip
      const res6 = applyProcess(state5, { type: 'strip' });
      expect(res6.valid).toBe(true);
      const state6 = res6.nextState;
      expect(state6.currentStepId).toBe('strip');
      expect(state6.layers).toHaveLength(2);
      expect(state6.layers.some((l) => l.material === 'photoresist')).toBe(false);

      // Verify layer states are all immutable across history
      expect(state0.layers).toHaveLength(1);
      expect(state1.layers).toHaveLength(2);
      expect(state2.layers).toHaveLength(3);
      expect(state4.layers).toHaveLength(3);
      expect(state5.layers).toHaveLength(3);
      expect(state6.layers).toHaveLength(2);
    });
  });

  describe('Domain Invariants Enforcement', () => {
    it('rejects exposureMask assigned to non-photoresist layers', () => {
      const illegalOxideLayer: MaterialLayer = {
        ...OXIDE_DEPOSITED_LAYER,
        exposureMask: Array(16).fill(false),
      };

      expect(() => validateLayerInvariants(illegalOxideLayer)).toThrow(
        /strictly scoped to 'photoresist' materials/i,
      );
    });

    it('rejects mask length not equal to SIMULATION_MASK_SEGMENTS', () => {
      const invalidMaskLayer: MaterialLayer = {
        ...PHOTORESIST_LAYER,
        presenceMask: [true, false], // Invalid length
      };

      expect(() => validateLayerInvariants(invalidMaskLayer)).toThrow(
        /presenceMask must have length 16/i,
      );
    });

    it('rejects negative layer thickness', () => {
      const negativeLayer: MaterialLayer = {
        ...PHOTORESIST_LAYER,
        thicknessNm: -50,
      };

      expect(() => validateLayerInvariants(negativeLayer)).toThrow(
        /thickness cannot be negative/i,
      );
    });
  });
});
