import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PredictionPanel from '../../src/components/wafer-lab/PredictionPanel';

describe('PredictionPanel Component (VF-006 Non-Blocking Pedagogy)', () => {
  it('renders question, options, and initially disabled Run Deposition button before selection', () => {
    render(<PredictionPanel isProcessExecuted={false} onRunProcess={vi.fn()} />);

    expect(screen.getByText(/What will deposition change on the wafer\?/i)).toBeDefined();
    expect(screen.getByRole('radio', { name: /Adds a material layer/i })).toBeDefined();
    expect(screen.getByRole('radio', { name: /Removes material/i })).toBeDefined();

    const runBtn = screen.getByRole('button', { name: /Run Deposition/i });
    expect(runBtn.hasAttribute('disabled')).toBe(true);
  });

  it('shows amber misconception feedback but ENABLES Run button when wrong option is selected', () => {
    const handleRun = vi.fn();
    render(<PredictionPanel isProcessExecuted={false} onRunProcess={handleRun} />);

    const wrongOpt = screen.getByRole('radio', { name: /Removes material/i });
    fireEvent.click(wrongOpt);

    expect(screen.getByText(/Material removal occurs during etching/i)).toBeDefined();
    const runBtn = screen.getByRole('button', { name: /Run Deposition/i });
    // Pedagogical requirement: never block process execution on wrong predictions!
    expect(runBtn.hasAttribute('disabled')).toBe(false);

    fireEvent.click(runBtn);
    expect(handleRun).toHaveBeenCalledTimes(1);
  });

  it('shows green feedback and enables Run button when correct option is selected', () => {
    const handleRun = vi.fn();
    render(<PredictionPanel isProcessExecuted={false} onRunProcess={handleRun} />);

    const correctOpt = screen.getByRole('radio', { name: /Adds a material layer/i });
    fireEvent.click(correctOpt);

    expect(screen.getByText(/Deposition adds a thin film of material/i)).toBeDefined();
    const runBtn = screen.getByRole('button', { name: /Run Deposition/i });
    expect(runBtn.hasAttribute('disabled')).toBe(false);

    fireEvent.click(runBtn);
    expect(handleRun).toHaveBeenCalledTimes(1);
  });

  it('renders explanation, prediction recap, and gates continuation until interpretation is answered', () => {
    const handleProceed = vi.fn();
    render(
      <PredictionPanel
        isProcessExecuted={true}
        selectedPredictionId="opt_remove_mat"
        onRunProcess={vi.fn()}
        onNextStep={handleProceed}
      />,
    );

    // 1. Success banner and explanation
    expect(screen.getByText(/Process Complete: Thin Film Deposited/i)).toBeDefined();
    expect(screen.getByText(/WHAT CHANGED\?/i)).toBeDefined();

    // 2. Prediction recap comparing misconception with physical reality
    expect(screen.getByText(/PREDICTION RECAP/i)).toBeDefined();
    expect(screen.getByText(/Removes material from the surface/i)).toBeDefined();
    expect(
      screen.getByText(/In this simplified process model, deposition adds material; material removal is performed in Step 5/i),
    ).toBeDefined();

    // 3. Interpretation question is present
    expect(screen.getByText(/why is the example film deposited across the wafer before selective patterning/i)).toBeDefined();

    // 4. Continue button is initially disabled
    const continueBtn = screen.getByRole('button', { name: /Continue to Coat Resist/i });
    expect(continueBtn.hasAttribute('disabled')).toBe(true);

    // 5. Select correct interpretation option to unlock continuation
    const correctInterp = screen.getByRole('radio', {
      name: /This example uses blanket deposition/i,
    });
    fireEvent.click(correctInterp);

    expect(continueBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(continueBtn);
    expect(handleProceed).toHaveBeenCalledTimes(1);
  });
});
