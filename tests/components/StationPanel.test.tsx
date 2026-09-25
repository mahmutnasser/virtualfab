import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StationPanel from '../../src/components/process/StationPanel';
import { CANONICAL_PROCESS_STEPS } from '../../src/types/process';

describe('StationPanel Component', () => {
  const depositionStep = CANONICAL_PROCESS_STEPS.find((s) => s.id === 'deposition')!;

  it('renders station focus dialog with step details and role="dialog"', () => {
    render(
      <StationPanel
        step={depositionStep}
        onInspect={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: /Deposition/i });
    expect(dialog).toBeDefined();
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Deposition' }));
    expect(screen.getByText('STEP 1 OF 6')).toBeDefined();
    expect(screen.getByText('Deposition tool · CVD example')).toBeDefined();
    expect(
      screen.getByText('Add a thin film of material across the wafer surface.'),
    ).toBeDefined();
    expect(screen.getByText('Why this step?')).toBeDefined();
  });

  it('renders checkpoint badge for ADI metrology checkpoint', () => {
    const adiStep = CANONICAL_PROCESS_STEPS.find((s) => s.id === 'adi')!;
    render(
      <StationPanel
        step={adiStep}
        onInspect={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByText('CHECKPOINT · ADI')).toBeDefined();
    expect(screen.getByText('ADI Inspection')).toBeDefined();
    expect(screen.getByText('Metrology / Inspection Bay')).toBeDefined();
  });

  it('calls onInspect when "Open Wafer Lab" button is clicked', () => {
    const handleInspect = vi.fn();
    render(
      <StationPanel
        step={depositionStep}
        onInspect={handleInspect}
        onBack={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Open Wafer Lab/i }));
    expect(handleInspect).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back or close button is clicked', () => {
    const handleBack = vi.fn();
    render(
      <StationPanel
        step={depositionStep}
        onInspect={vi.fn()}
        onBack={handleBack}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /Close station focus panel and return to fab overview/i,
      }),
    );
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when Escape key is pressed', () => {
    const handleBack = vi.fn();
    render(
      <StationPanel
        step={depositionStep}
        onInspect={vi.fn()}
        onBack={handleBack}
      />,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders cleanroom bay, real equipment reference, chamber telemetry, and wafer preview', () => {
    render(
      <StationPanel
        step={depositionStep}
        onInspect={vi.fn()}
        onBack={vi.fn()}
      />,
    );

    // Recipe details are available on demand, leaving the wafer change visible first.
    const recipe = screen.getByText('Equipment and recipe').closest('details');
    expect(recipe?.open).toBe(false);
    fireEvent.click(screen.getByText('Equipment and recipe'));
    expect(recipe?.open).toBe(true);

    // Cleanroom Bay & Hardware Reference
    expect(screen.getByText('Bay 1 — Dielectric & Thin Film Deposition')).toBeDefined();
    expect(screen.getByText(/Ref: Centura \/ Producer Platform CVD Multi-Chamber Tool/i)).toBeDefined();

    // Chamber Telemetry Card & Status
    expect(screen.getByText(/Chamber Recipe & Telemetry/i)).toBeDefined();
    expect(screen.getByText('VACUUM READY')).toBeDefined();
    expect(screen.getByText('400 °C')).toBeDefined();
    expect(screen.getByText('SiH₄ + N₂O')).toBeDefined();
    expect(screen.getByText('2.5 Torr')).toBeDefined();
    expect(screen.getByText('100 nm SiO₂')).toBeDefined();

    // Wafer State Preview
    expect(screen.getByText(/Wafer State Preview/i)).toBeDefined();
    expect(screen.getByRole('img', { name: /Continuous dielectric layer deposited uniformly across wafer/i })).toBeDefined();
  });
});
