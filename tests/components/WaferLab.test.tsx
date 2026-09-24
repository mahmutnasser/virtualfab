import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WaferLab from '../../src/components/wafer-lab/WaferLab';
import { useVirtualFabStore } from '../../src/store/virtual-fab-store';

describe('WaferLab Component (VF-006 Full Slice)', () => {
  beforeEach(() => {
    localStorage.clear();
    useVirtualFabStore.getState().resetJourney();
  });

  it('renders initial bare wafer state and header with step 1 of 6', () => {
    render(<WaferLab onReturnToFab={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Deposition' })).toBeDefined();
    expect(screen.getByText('STEP 1 OF 6')).toBeDefined();
    expect(screen.getAllByText(/SILICON SUBSTRATE/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Silicon Substrate Present/i)[0]).toBeDefined();
    expect(screen.queryByText(/SILICON DIOXIDE \(SiO₂\) FILM/i)).toBeNull();
  });

  it('allows learner to make wrong prediction, run process, and complete step after interpretation', () => {
    const handleNext = vi.fn();
    render(<WaferLab onNextStep={handleNext} />);

    // 1. Select WRONG prediction ("Removes material")
    const wrongOpt = screen.getByRole('radio', { name: /Removes material/i });
    fireEvent.click(wrongOpt);

    // 2. Click Run Deposition (unlocked despite misconception)
    const runBtn = screen.getByRole('button', { name: /Run Deposition/i });
    expect(runBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(runBtn);

    // 3. Verify SVG cross-section updated with oxide film
    expect(screen.getAllByText(/SILICON DIOXIDE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/WHAT CHANGED\?/i)).toBeDefined();
    expect(screen.getByText(/PREDICTION RECAP/i)).toBeDefined();

    // 4. Continue button is initially disabled pending interpretation
    const continueBtn = screen.getByRole('button', { name: /Continue to Coat Resist/i });
    expect(continueBtn.hasAttribute('disabled')).toBe(true);

    // 5. Answer conceptual interpretation question correctly
    const correctInterp = screen.getByRole('radio', {
      name: /This example uses blanket deposition/i,
    });
    fireEvent.click(correctInterp);
    expect(continueBtn.hasAttribute('disabled')).toBe(false);

    // 6. Proceed to next step
    fireEvent.click(continueBtn);
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('navigates back when return button is clicked', () => {
    const handleReturn = vi.fn();
    render(<WaferLab onReturnToFab={handleReturn} />);

    const returnBtn = screen.getAllByRole('button', { name: /Return to Fab Overview/i })[0];
    fireEvent.click(returnBtn);

    expect(handleReturn).toHaveBeenCalledTimes(1);
  });
});
