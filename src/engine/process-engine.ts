import {
  type WaferState,
  type ProcessAction,
  type ProcessResult,
  type ProcessChange,
  type ValidationResult,
  type MaterialLayer,
  type MetrologyInspectionData,
  SIMULATION_MASK_SEGMENTS,
  SILICON_SUBSTRATE_LAYER,
  OXIDE_DEPOSITED_LAYER,
  PHOTORESIST_LAYER,
  validateLayerInvariants,
} from './types';

/**
 * Generic action precondition validator.
 * Answers: "Can this modeled semiconductor action physically/logically operate on this modeled state?"
 * Does NOT enforce curriculum-specific sequencing or scenario assumptions.
 */
export function validateProcessAction(
  wafer: WaferState,
  action: ProcessAction,
): ValidationResult {
  // Substrate foundation check (universal physical requirement)
  const hasSubstrate = wafer.layers.some((l) => l.material === 'silicon');
  if (!hasSubstrate) {
    return {
      allowed: false,
      reason: 'Wafer has no silicon substrate foundation.',
    };
  }

  switch (action.type) {
    case 'deposit': {
      // In a generic engine, deposition can physically operate on substrate or existing layers
      return { allowed: true };
    }

    case 'coat-resist': {
      // Requires substrate and no existing photoresist layer already on top
      const hasResist = wafer.layers.some((l) => l.material === 'photoresist');
      if (hasResist) {
        return {
          allowed: false,
          reason: 'Photoresist is already coated on the wafer surface.',
        };
      }
      return { allowed: true };
    }

    case 'expose': {
      const resist = wafer.layers.find((l) => l.material === 'photoresist');
      if (!resist) {
        return {
          allowed: false,
          reason:
            'No photoresist layer found on the wafer. Spin-coat photoresist before optical exposure.',
        };
      }
      if (action.exposureMask.length !== SIMULATION_MASK_SEGMENTS) {
        return {
          allowed: false,
          reason: `Exposure mask must match simulation spatial discretization (${SIMULATION_MASK_SEGMENTS} segments).`,
        };
      }
      return { allowed: true };
    }

    case 'develop': {
      const resist = wafer.layers.find((l) => l.material === 'photoresist');
      if (!resist) {
        return {
          allowed: false,
          reason: 'No photoresist layer found to develop.',
        };
      }
      if (!resist.exposureMask || !resist.exposureMask.some(Boolean)) {
        return {
          allowed: false,
          reason:
            'Photoresist has not been exposed. Expose before developing.',
        };
      }
      return { allowed: true };
    }

    case 'etch': {
      const resist = wafer.layers.find((l) => l.material === 'photoresist');
      if (!resist) {
        return {
          allowed: false,
          reason: 'No photoresist mask present to guide selective etching.',
        };
      }
      const hasOpenings = resist.presenceMask.some((present) => !present);
      if (!hasOpenings) {
        return {
          allowed: false,
          reason:
            'Photoresist has no pattern openings. Develop photoresist before etching.',
        };
      }
      // Must have an underlying layer beneath resist
      const resistIndex = wafer.layers.findIndex((l) => l.material === 'photoresist');
      if (resistIndex <= 0) {
        return {
          allowed: false,
          reason: 'No underlying material layer found beneath photoresist to etch.',
        };
      }
      return { allowed: true };
    }

    case 'strip': {
      const hasResist = wafer.layers.some((l) => l.material === 'photoresist');
      if (!hasResist) {
        return {
          allowed: false,
          reason: 'No photoresist layer present on wafer to strip.',
        };
      }
      return { allowed: true };
    }

    case 'inspect': {
      if (action.checkpoint === 'ADI') {
        const hasResist = wafer.layers.some((l) => l.material === 'photoresist');
        if (!hasResist) {
          return {
            allowed: false,
            reason: 'ADI requires a photoresist layer on the wafer to inspect.',
          };
        }
      }
      return { allowed: true };
    }

    default:
      return { allowed: false, reason: 'Unsupported process action.' };
  }
}

/**
 * Scenario sequence validator for the Silicon Journey educational cycle.
 * Answers: "Is this the correct next operation in this educational sequence?"
 * Sequence: Start wafer -> 1 Deposition -> 2 Coat Resist -> 3 Lithography -> 4 Develop -> [ADI Checkpoint] -> 5 Etch -> [AEI Checkpoint] -> 6 Strip
 */
export function canExecuteScenarioStep(
  wafer: WaferState,
  action: ProcessAction,
): ValidationResult {
  // First verify generic action feasibility
  const genericCheck = validateProcessAction(wafer, action);
  if (!genericCheck.allowed) {
    return genericCheck;
  }

  // Educational cycle constraints
  switch (action.type) {
    case 'deposit': {
      const topLayer = wafer.layers[wafer.layers.length - 1];
      if (topLayer && topLayer.material === 'photoresist') {
        return {
          allowed: false,
          reason:
            'This simplified patterning cycle expects the dielectric film to be deposited before photoresist is applied.',
        };
      }
      const hasOxide = wafer.layers.some((l) => l.material === 'oxide');
      if (hasOxide) {
        return {
          allowed: false,
          reason:
            'An oxide film has already been deposited for this learning cycle.',
        };
      }
      return { allowed: true };
    }

    case 'coat-resist': {
      const hasOxide = wafer.layers.some((l) => l.material === 'oxide');
      if (!hasOxide) {
        return {
          allowed: false,
          reason:
            'This simplified patterning cycle expects the dielectric film to be deposited before photoresist is applied.',
        };
      }
      return { allowed: true };
    }

    case 'inspect': {
      const checkpoint =
        action.checkpoint ??
        (wafer.layers.some((l) => l.material === 'photoresist') ? 'ADI' : 'AEI');

      if (checkpoint === 'ADI') {
        const resist = wafer.layers.find((l) => l.material === 'photoresist');
        if (!resist) {
          return {
            allowed: false,
            reason: 'ADI requires a photoresist layer to inspect.',
          };
        }
        const hasOpenings = resist.presenceMask.some((p) => !p);
        if (!hasOpenings) {
          return {
            allowed: false,
            reason:
              'ADI (After Develop Inspection) requires photoresist to be developed before inspecting the pattern stencil.',
          };
        }
        return { allowed: true };
      }

      if (checkpoint === 'AEI') {
        const oxide = wafer.layers.find((l) => l.material === 'oxide');
        if (!oxide) {
          return {
            allowed: false,
            reason: 'AEI requires an etched dielectric film to inspect.',
          };
        }
        const hasEtchedOpenings = oxide.presenceMask.some((p) => !p);
        if (!hasEtchedOpenings) {
          return {
            allowed: false,
            reason:
              'AEI (After Etch Inspection) requires etching to be completed before inspecting pattern transfer.',
          };
        }
        return { allowed: true };
      }

      if (wafer.layers.length <= 1) {
        return {
          allowed: false,
          reason: 'Wafer has not undergone fabrication processing to inspect.',
        };
      }
      return { allowed: true };
    }

    default:
      return { allowed: true };
  }
}

/**
 * Combined entry point defaulting to scenario sequence enforcement.
 */
export function canExecuteStep(
  wafer: WaferState,
  action: ProcessAction,
  options?: { enforceScenarioSequence?: boolean },
): ValidationResult {
  if (options?.enforceScenarioSequence === false) {
    return validateProcessAction(wafer, action);
  }
  return canExecuteScenarioStep(wafer, action);
}

/**
 * Pure, deterministic process engine for semiconductor transformations.
 * Contract: Pure function (WaferState, ProcessAction) -> ProcessResult
 * Immutable: Never mutates incoming wafer state.
 */
export function applyProcess(
  currentState: WaferState,
  action: ProcessAction,
  options?: { enforceScenarioSequence?: boolean },
): ProcessResult {
  // 1. Validation check
  const validation = canExecuteStep(currentState, action, options);
  if (!validation.allowed) {
    return {
      valid: false,
      previousState: currentState,
      nextState: currentState,
      changes: [],
      feedback: [validation.reason ?? 'Process validation failed.'],
    };
  }

  // 2. Action execution with pure immutability
  switch (action.type) {
    case 'deposit': {
      const thickness =
        action.thicknessNm ??
        action.scenarioOptions?.illustrativeThicknessNm ??
        100;
      const displayName =
        action.scenarioOptions?.displayName ?? 'Silicon Dioxide';
      const formula = action.scenarioOptions?.formula ?? 'SiO₂';

      const newOxideLayer: MaterialLayer = {
        ...OXIDE_DEPOSITED_LAYER,
        name: displayName,
        chemicalFormula: formula,
        thicknessNm: thickness,
        thicknessLabel: `~${thickness} nm (illustrative)`,
        presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
      };

      const nextLayers = [
        ...currentState.layers.map((l) => ({
          ...l,
          presenceMask: [...l.presenceMask],
          exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
        })),
        newOxideLayer,
      ];

      const nextState: WaferState = {
        currentStepId: 'deposition',
        layers: nextLayers,
      };

      nextState.layers.forEach(validateLayerInvariants);

      const changes: ProcessChange[] = [
        {
          layerId: newOxideLayer.id,
          changeType: 'added',
          description: `Uniform ${newOxideLayer.thicknessLabel} ${displayName} (${formula}) thin film deposited across wafer surface.`,
        },
      ];

      return {
        valid: true,
        previousState: currentState,
        nextState,
        changes,
        feedback: [
          `A uniform thin film of ${displayName} (${formula}) has been added across the entire wafer surface.`,
        ],
      };
    }

    case 'coat-resist': {
      const thickness = action.thicknessNm ?? 300;
      const newResistLayer: MaterialLayer = {
        ...PHOTORESIST_LAYER,
        thicknessNm: thickness,
        thicknessLabel: `~${thickness} nm (illustrative)`,
        presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
        exposureMask: Array(SIMULATION_MASK_SEGMENTS).fill(false),
      };

      const nextLayers = [
        ...currentState.layers.map((l) => ({
          ...l,
          presenceMask: [...l.presenceMask],
          exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
        })),
        newResistLayer,
      ];

      const nextState: WaferState = {
        currentStepId: 'coat',
        layers: nextLayers,
      };

      nextState.layers.forEach(validateLayerInvariants);

      const changes: ProcessChange[] = [
        {
          layerId: newResistLayer.id,
          changeType: 'added',
          description: `Uniform positive photoresist film (${newResistLayer.thicknessLabel}) spin-coated across wafer.`,
        },
      ];

      return {
        valid: true,
        previousState: currentState,
        nextState,
        changes,
        feedback: [
          'A uniform layer of positive-tone photoresist has been spin-coated across the wafer.',
        ],
      };
    }

    case 'expose': {
      const nextLayers = currentState.layers.map((l) => {
        if (l.material === 'photoresist') {
          return {
            ...l,
            presenceMask: [...l.presenceMask],
            exposureMask: [...action.exposureMask],
          };
        }
        return {
          ...l,
          presenceMask: [...l.presenceMask],
          exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
        };
      });

      const nextState: WaferState = {
        currentStepId: 'lithography',
        layers: nextLayers,
      };

      nextState.layers.forEach(validateLayerInvariants);

      const exposedCount = action.exposureMask.filter(Boolean).length;
      const changes: ProcessChange[] = [
        {
          layerId: 'photoresist-layer',
          changeType: 'modified',
          description: `Optical UV exposure transferred reticle pattern into photoresist (${exposedCount} of ${SIMULATION_MASK_SEGMENTS} segments exposed).`,
        },
      ];

      return {
        valid: true,
        previousState: currentState,
        nextState,
        changes,
        feedback: [
          'Optical exposure complete. Light exposure has altered the polymer solubility in exposed regions.',
        ],
      };
    }

    case 'develop': {
      const resist = currentState.layers.find((l) => l.material === 'photoresist');
      const exposureMask = resist?.exposureMask ?? Array(SIMULATION_MASK_SEGMENTS).fill(false);

      // In positive resist: exposed regions become soluble in developer and dissolve
      const newResistPresence = exposureMask.map((exposed) => !exposed);

      const nextLayers = currentState.layers.map((l) => {
        if (l.material === 'photoresist') {
          return {
            ...l,
            presenceMask: newResistPresence,
            exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
          };
        }
        return {
          ...l,
          presenceMask: [...l.presenceMask],
          exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
        };
      });

      const nextState: WaferState = {
        currentStepId: 'develop',
        layers: nextLayers,
      };

      nextState.layers.forEach(validateLayerInvariants);

      const clearedCount = newResistPresence.filter((p) => !p).length;
      const changes: ProcessChange[] = [
        {
          layerId: 'photoresist-layer',
          changeType: 'modified',
          description: `Chemical developer dissolved soluble exposed resist, opening ${clearedCount} windows down to the oxide layer.`,
        },
      ];

      return {
        valid: true,
        previousState: currentState,
        nextState,
        changes,
        feedback: [
          'Development complete. Soluble exposed photoresist has dissolved, revealing target oxide regions.',
        ],
      };
    }

    case 'etch': {
      const resist = currentState.layers.find((l) => l.material === 'photoresist');
      const resistMask = resist?.presenceMask ?? Array(SIMULATION_MASK_SEGMENTS).fill(true);

      // Method-neutral transform: transfer resist openings into the target underlying film
      const nextLayers = currentState.layers.map((l) => {
        if (l.material === 'oxide') {
          return {
            ...l,
            presenceMask: l.presenceMask.map((present, i) => present && resistMask[i]),
            exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
          };
        }
        return {
          ...l,
          presenceMask: [...l.presenceMask],
          exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
        };
      });

      const nextState: WaferState = {
        currentStepId: 'etch',
        layers: nextLayers,
      };

      nextState.layers.forEach(validateLayerInvariants);

      const oxideLayer = nextLayers.find((l) => l.material === 'oxide');
      const removedCount = oxideLayer
        ? oxideLayer.presenceMask.filter((p) => !p).length
        : 0;

      const changes: ProcessChange[] = [
        {
          layerId: oxideLayer?.id ?? 'oxide-film',
          changeType: 'modified',
          description: `Transferred resist-defined openings into the target ${oxideLayer?.name ?? 'dielectric'} film (${removedCount} segments removed).`,
        },
      ];

      return {
        valid: true,
        previousState: currentState,
        nextState,
        changes,
        feedback: [
          'Etching complete. Transferred resist-defined openings into the target film in unprotected regions.',
        ],
      };
    }

    case 'strip': {
      const resist = currentState.layers.find((l) => l.material === 'photoresist');
      const nextLayers = currentState.layers
        .filter((l) => l.material !== 'photoresist')
        .map((l) => ({
          ...l,
          presenceMask: [...l.presenceMask],
          exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
        }));

      const nextState: WaferState = {
        currentStepId: 'strip',
        layers: nextLayers,
      };

      nextState.layers.forEach(validateLayerInvariants);

      const changes: ProcessChange[] = [
        {
          layerId: resist?.id ?? 'photoresist-layer',
          changeType: 'removed',
          description:
            'Removed the remaining modeled photoresist layer, leaving the patterned underlying film on the substrate.',
        },
      ];

      return {
        valid: true,
        previousState: currentState,
        nextState,
        changes,
        feedback: [
          'Photoresist strip complete. Removed the remaining modeled photoresist layer, revealing the patterned SiO₂ example film.',
        ],
      };
    }

    case 'inspect': {
      const checkpoint =
        action.checkpoint ??
        (currentState.layers.some((l) => l.material === 'photoresist') ? 'ADI' : 'AEI');
      const targetPattern = action.targetPattern;

      if (checkpoint === 'ADI') {
        // ADI (After Develop Inspection): inspects developed photoresist stencil before etch
        const resist = currentState.layers.find((l) => l.material === 'photoresist');
        const differingSegments: number[] = [];
        if (targetPattern && resist) {
          for (let i = 0; i < SIMULATION_MASK_SEGMENTS; i++) {
            if (resist.presenceMask[i] !== targetPattern[i]) {
              differingSegments.push(i);
            }
          }
        }

        const isMatch = differingSegments.length === 0;
        const inspectionData: MetrologyInspectionData = {
          checkpoint: 'ADI',
          result: isMatch ? 'match' : 'mismatch',
          inspectedLayerMaterial: 'photoresist',
          differingSegments,
          conceptualFeedback: isMatch
            ? 'ADI Checkpoint Passed: Conceptually matches expected resist pattern. In a real fab, any resist pattern issues caught at ADI can be stripped and reworked before irreversible etch.'
            : `ADI Checkpoint Alert: Developed resist pattern differs from expected at segment(s): ${differingSegments.join(', ')}. In a real fab, resist can be stripped and reworked before irreversible etch.`,
        };

        const nextState: WaferState = {
          currentStepId: 'adi',
          layers: currentState.layers.map((l) => ({
            ...l,
            presenceMask: [...l.presenceMask],
            exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
          })),
        };

        nextState.layers.forEach(validateLayerInvariants);

        return {
          valid: true,
          previousState: currentState,
          nextState,
          changes: [],
          feedback: [inspectionData.conceptualFeedback],
          inspection: inspectionData,
        };
      }

      // Checkpoint AEI (After Etch Inspection): inspects transferred pattern in dielectric film
      const topFilm = currentState.layers.find((l) => l.material === 'oxide');
      const differingSegments: number[] = [];
      if (targetPattern && topFilm) {
        for (let i = 0; i < SIMULATION_MASK_SEGMENTS; i++) {
          if (topFilm.presenceMask[i] !== targetPattern[i]) {
            differingSegments.push(i);
          }
        }
      }

      const isMatch = differingSegments.length === 0;
      const inspectionData: MetrologyInspectionData = {
        checkpoint: 'AEI',
        result: isMatch ? 'match' : 'mismatch',
        inspectedLayerMaterial: 'oxide',
        differingSegments,
        conceptualFeedback: isMatch
          ? 'AEI Checkpoint Passed: Conceptually matches expected pattern in film after etch.'
          : `AEI Checkpoint Alert: Transferred pattern in film differs from expected at segment(s): ${differingSegments.join(', ')}.`,
      };

      const nextState: WaferState = {
        currentStepId: 'aei',
        layers: currentState.layers.map((l) => ({
          ...l,
          presenceMask: [...l.presenceMask],
          exposureMask: l.exposureMask ? [...l.exposureMask] : undefined,
        })),
      };

      nextState.layers.forEach(validateLayerInvariants);

      return {
        valid: true,
        previousState: currentState,
        nextState,
        changes: [],
        feedback: [inspectionData.conceptualFeedback],
        inspection: inspectionData,
      };
    }

    default: {
      return {
        valid: false,
        previousState: currentState,
        nextState: currentState,
        changes: [],
        feedback: ['Unsupported process action.'],
      };
    }
  }
}

/**
 * Helper to produce a clean initial bare wafer.
 */
export function createBareWafer(): WaferState {
  return {
    currentStepId: 'start',
    layers: [
      {
        ...SILICON_SUBSTRATE_LAYER,
        presenceMask: Array(SIMULATION_MASK_SEGMENTS).fill(true),
      },
    ],
  };
}
