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
});
