import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WaferLab from '../../src/components/wafer-lab/WaferLab';
import WaferCrossSectionSVG from '../../src/components/wafer-lab/WaferCrossSectionSVG';
import { useVirtualFabStore } from '../../src/store/virtual-fab-store';
import { applyProcess, createBareWafer } from '../../src/engine/process-engine';
import type { WaferState } from '../../src/engine/types';

describe('VF-013 Complete Wafer Lab Journey Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    useVirtualFabStore.getState().resetJourney();
  });

  it('VF-013A: Coat Resist applies uniform purple photoresist over dielectric film', () => {
    // 1. Prepare wafer state with deposited oxide
    let wafer: WaferState = createBareWafer();
    const depResult = applyProcess(wafer, { type: 'deposit', material: 'oxide', thicknessNm: 100 });
    expect(depResult.valid).toBe(true);
    wafer = depResult.nextState;

    // Apply coat-resist
    const coatResult = applyProcess(wafer, { type: 'coat-resist', tone: 'positive', thicknessNm: 300 });
    expect(coatResult.valid).toBe(true);
    wafer = coatResult.nextState;

    // Render SVG
    render(<WaferCrossSectionSVG waferState={wafer} />);
    expect(screen.getAllByText(/SILICON SUBSTRATE/i)[0]).toBeDefined();
    expect(screen.getAllByText(/SILICON DIOXIDE \(SiO₂\) FILM/i)[0]).toBeDefined();
    expect(screen.getAllByText(/PHOTORESIST \(PR\)/i)[0]).toBeDefined();
    expect(screen.getByText(/Photoresist Mask/i)).toBeDefined();
  });

  it('VF-013B: Lithography alters exposureMask without removing any photoresist (latent image)', () => {
    // Build stack to coat
    let wafer = createBareWafer();
    wafer = applyProcess(wafer, { type: 'deposit', material: 'oxide' }).nextState;
    wafer = applyProcess(wafer, { type: 'coat-resist', tone: 'positive' }).nextState;

    // Expose segments [4..11]
    const mask = Array(16).fill(false);
    for (let i = 4; i <= 11; i++) mask[i] = true;
    const lithoResult = applyProcess(wafer, { type: 'expose', exposureMask: mask });
    expect(lithoResult.valid).toBe(true);
    wafer = lithoResult.nextState;

    const resist = wafer.layers.find((l) => l.material === 'photoresist');
    expect(resist).toBeDefined();
    // Physical truth check: presenceMask must remain 100% full (no material removed!)
    expect(resist!.presenceMask.every(Boolean)).toBe(true);
    expect(resist!.exposureMask).toEqual(mask);

    render(<WaferCrossSectionSVG waferState={wafer} />);
    expect(screen.getAllByText(/LATENT IMAGE/i)[0]).toBeDefined();
    expect(screen.getByText(/UV LIGHT/i)).toBeDefined();
    expect(screen.getByText(/Latent UV Image/i)).toBeDefined();
  });

  it('VF-013C: Develop removes exposed resist and opens stencil windows revealing dielectric', () => {
    let wafer = createBareWafer();
    wafer = applyProcess(wafer, { type: 'deposit', material: 'oxide' }).nextState;
    wafer = applyProcess(wafer, { type: 'coat-resist', tone: 'positive' }).nextState;
    const mask = Array(16).fill(false);
    for (let i = 4; i <= 11; i++) mask[i] = true;
    wafer = applyProcess(wafer, { type: 'expose', exposureMask: mask }).nextState;

    // Develop
    const devResult = applyProcess(wafer, { type: 'develop' });
    expect(devResult.valid).toBe(true);
    wafer = devResult.nextState;

    const resist = wafer.layers.find((l) => l.material === 'photoresist');
    expect(resist).toBeDefined();
    // Exposed segments [4..11] are now cleared (!presenceMask[i])
    for (let i = 4; i <= 11; i++) {
      expect(resist!.presenceMask[i]).toBe(false);
    }
    // Unexposed segments [0..3] and [12..15] remain present
    expect(resist!.presenceMask[0]).toBe(true);
    expect(resist!.presenceMask[15]).toBe(true);

    render(<WaferCrossSectionSVG waferState={wafer} />);
    expect(screen.getAllByText(/SILICON SUBSTRATE/i)[0]).toBeDefined();
    expect(screen.getAllByText(/SILICON DIOXIDE \(SiO₂\) FILM/i)[0]).toBeDefined();
    expect(screen.getAllByText(/PHOTORESIST/i)[0]).toBeDefined();
  });

  it('VF-013D: ADI Inspection evaluates developed resist stencil non-destructively', () => {
    let wafer = createBareWafer();
    wafer = applyProcess(wafer, { type: 'deposit', material: 'oxide' }).nextState;
    wafer = applyProcess(wafer, { type: 'coat-resist', tone: 'positive' }).nextState;
    const mask = Array(16).fill(false);
    for (let i = 4; i <= 11; i++) mask[i] = true;
    wafer = applyProcess(wafer, { type: 'expose', exposureMask: mask }).nextState;
    wafer = applyProcess(wafer, { type: 'develop' }).nextState;

    const layersBefore = JSON.stringify(wafer.layers);
    const adiResult = applyProcess(wafer, { type: 'inspect', checkpoint: 'ADI' });
    expect(adiResult.valid).toBe(true);
    expect(adiResult.inspection?.checkpoint).toBe('ADI');
    expect(adiResult.inspection?.result).toBe('match');
    // Non-destructive invariant: wafer.layers is untouched
    expect(JSON.stringify(adiResult.nextState.layers)).toBe(layersBefore);

    render(<WaferCrossSectionSVG waferState={wafer} activeCheckpoint="ADI" />);
    expect(screen.getByText(/ADI METROLOGY CHECKPOINT/i)).toBeDefined();
    expect(screen.getByText(/Pre-etch pattern inspection/i)).toBeDefined();
  });

  it('VF-013E: Etch removes dielectric film only through open stencil windows', () => {
    let wafer = createBareWafer();
    wafer = applyProcess(wafer, { type: 'deposit', material: 'oxide' }).nextState;
    wafer = applyProcess(wafer, { type: 'coat-resist', tone: 'positive' }).nextState;
    const mask = Array(16).fill(false);
    for (let i = 4; i <= 11; i++) mask[i] = true;
    wafer = applyProcess(wafer, { type: 'expose', exposureMask: mask }).nextState;
    wafer = applyProcess(wafer, { type: 'develop' }).nextState;

    // Etch
    const etchResult = applyProcess(wafer, { type: 'etch' });
    expect(etchResult.valid).toBe(true);
    wafer = etchResult.nextState;

    const oxide = wafer.layers.find((l) => l.material === 'oxide');
    const resist = wafer.layers.find((l) => l.material === 'photoresist');
    expect(oxide).toBeDefined();
    expect(resist).toBeDefined();

    // Dielectric in segments [4..11] is etched down to silicon substrate
    for (let i = 4; i <= 11; i++) {
      expect(oxide!.presenceMask[i]).toBe(false);
    }
    // Protected dielectric segments [0..3] and [12..15] remain intact under photoresist
    expect(oxide!.presenceMask[0]).toBe(true);
    expect(resist!.presenceMask[0]).toBe(true);

    render(<WaferCrossSectionSVG waferState={wafer} />);
    expect(screen.getAllByText(/SILICON SUBSTRATE/i)[0]).toBeDefined();
    expect(screen.getAllByText(/SILICON DIOXIDE \(SiO₂\) FILM/i)[0]).toBeDefined();
    expect(screen.getAllByText(/PHOTORESIST/i)[0]).toBeDefined();
  });

  it('VF-013F: AEI Inspection evaluates transferred permanent dielectric film pattern', () => {
    let wafer = createBareWafer();
    wafer = applyProcess(wafer, { type: 'deposit', material: 'oxide' }).nextState;
    wafer = applyProcess(wafer, { type: 'coat-resist', tone: 'positive' }).nextState;
    const mask = Array(16).fill(false);
    for (let i = 4; i <= 11; i++) mask[i] = true;
    wafer = applyProcess(wafer, { type: 'expose', exposureMask: mask }).nextState;
    wafer = applyProcess(wafer, { type: 'develop' }).nextState;
    wafer = applyProcess(wafer, { type: 'etch' }).nextState;

    const aeiResult = applyProcess(wafer, { type: 'inspect', checkpoint: 'AEI' });
    expect(aeiResult.valid).toBe(true);
    expect(aeiResult.inspection?.checkpoint).toBe('AEI');

    render(<WaferCrossSectionSVG waferState={wafer} activeCheckpoint="AEI" />);
    expect(screen.getByText(/AEI METROLOGY CHECKPOINT/i)).toBeDefined();
    expect(screen.getByText(/Post-etch pattern verified/i)).toBeDefined();
  });

  it('VF-013G: Strip completely eliminates photoresist leaving patterned dielectric film', () => {
    let wafer = createBareWafer();
    wafer = applyProcess(wafer, { type: 'deposit', material: 'oxide' }).nextState;
    wafer = applyProcess(wafer, { type: 'coat-resist', tone: 'positive' }).nextState;
    const mask = Array(16).fill(false);
    for (let i = 4; i <= 11; i++) mask[i] = true;
    wafer = applyProcess(wafer, { type: 'expose', exposureMask: mask }).nextState;
    wafer = applyProcess(wafer, { type: 'develop' }).nextState;
    wafer = applyProcess(wafer, { type: 'etch' }).nextState;

    // Strip
    const stripResult = applyProcess(wafer, { type: 'strip' });
    expect(stripResult.valid).toBe(true);
    wafer = stripResult.nextState;

    // Invariant: Photoresist layer must be completely gone
    const resist = wafer.layers.find((l) => l.material === 'photoresist');
    expect(resist).toBeUndefined();

    // Patterned dielectric remains on silicon substrate
    const oxide = wafer.layers.find((l) => l.material === 'oxide');
    expect(oxide).toBeDefined();
    expect(oxide!.presenceMask.some((p) => !p)).toBe(true);

    render(<WaferCrossSectionSVG waferState={wafer} />);
    expect(screen.getAllByText(/SILICON SUBSTRATE/i)[0]).toBeDefined();
    expect(screen.getAllByText(/SILICON DIOXIDE \(SiO₂\) FILM/i)[0]).toBeDefined();
    expect(screen.queryByText(/PHOTORESIST/i)).toBeNull();
  });

  it('WaferLab component renders active step and handles full interactive cycle for Coat Resist', () => {
    // 1. Prepare wafer with deposited oxide film
    const depositedWafer = applyProcess(createBareWafer(), { type: 'deposit', material: 'oxide' }).nextState;
    useVirtualFabStore.setState({
      wafer: depositedWafer,
      completedStepIds: ['deposition'],
      fabProgress: {
        setupCompleted: true,
        completedOperationIds: ['deposition'],
        completedCheckpointIds: [],
        selectedNodeId: 'coat',
      },
    });

    // Start at Coat Resist
    useVirtualFabStore.getState().openStation('coat');
    useVirtualFabStore.getState().openWaferLab();

    const handleNext = vi.fn();
    render(<WaferLab onNextStep={handleNext} />);

    expect(screen.getByRole('heading', { name: 'Coat Resist' })).toBeDefined();
    expect(screen.getByText(/STEP 2 OF 6/i)).toBeDefined();

    // 1. Select prediction
    const opt = screen.getByRole('radio', { name: /Applies an even layer of photosensitive polymer/i });
    fireEvent.click(opt);

    // 2. Run Coat Resist
    const runBtn = screen.getByRole('button', { name: /Run Coat Resist/i });
    expect(runBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(runBtn);

    // 3. Answer interpretation
    const interpOpt = screen.getByRole('radio', {
      name: /Spin coating provides a flat, continuous photosensitive canvas/i,
    });
    fireEvent.click(interpOpt);

    // 4. Continue to Lithography
    const continueBtn = screen.getByRole('button', { name: /Continue to Lithography/i });
    expect(continueBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(continueBtn);

    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('VF-013F: WaferLab Repeat step executes multi-layer BEOL build, renders layer stack inspector, and completes CMP interpretation', () => {
    // 1. Prepare wafer at strip step with patterned oxide
    let wafer = createBareWafer();
    wafer = applyProcess(wafer, { type: 'deposit', material: 'oxide' }).nextState;
    wafer = applyProcess(wafer, { type: 'coat-resist', tone: 'positive' }).nextState;
    const mask = Array(16).fill(false);
    for (let i = 4; i <= 11; i++) mask[i] = true;
    wafer = applyProcess(wafer, { type: 'expose', exposureMask: mask }).nextState;
    wafer = applyProcess(wafer, { type: 'develop' }).nextState;
    wafer = applyProcess(wafer, { type: 'etch' }).nextState;
    wafer = applyProcess(wafer, { type: 'strip' }).nextState;

    useVirtualFabStore.setState({
      wafer,
      completedStepIds: ['deposition', 'coat', 'lithography', 'develop', 'etch', 'strip'],
      fabProgress: {
        setupCompleted: true,
        completedOperationIds: ['deposition', 'coat', 'lithography', 'develop', 'etch', 'strip'],
        completedCheckpointIds: ['adi', 'aei'],
        selectedNodeId: 'repeat',
      },
    });

    useVirtualFabStore.getState().openStation('repeat');
    useVirtualFabStore.getState().openWaferLab();

    const handleNext = vi.fn();
    render(<WaferLab onNextStep={handleNext} />);

    expect(screen.getByRole('heading', { name: 'Multi-Layer Interconnects & Repeat' })).toBeDefined();

    // 1. Prediction question
    const predOption = screen.getByRole('radio', {
      name: /A single layer cannot route overlapping electrical signals without short-circuiting/i,
    });
    fireEvent.click(predOption);

    // 2. Execute process button
    const runBtn = screen.getByRole('button', { name: /Build Multi-Layer Interconnect Stack/i });
    expect(runBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(runBtn);

    // 3. Check 3D Layer Stack Inspector tabs are rendered
    expect(screen.getByText(/3D Layer Stack Inspector/i)).toBeDefined();
    expect(screen.getByRole('tab', { name: /M1 & CMP/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /ILD & Vias/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /M2 Routing/i })).toBeDefined();

    // 4. Answer CMP interpretation question
    const interpOption = screen.getByRole('radio', {
      name: /CMP creates an atomically flat optical surface so scanner lenses can maintain depth of focus/i,
    });
    fireEvent.click(interpOption);

    // 5. Complete repeat step
    const finishBtn = screen.getByRole('button', { name: /Begin New Patterning Cycle/i });
    expect(finishBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(finishBtn);

    expect(handleNext).toHaveBeenCalledTimes(1);
  });
});

