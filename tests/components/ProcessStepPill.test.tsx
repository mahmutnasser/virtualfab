import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProcessStepPill from '../../src/components/process/ProcessStepPill';
import { CANONICAL_PROCESS_STEPS } from '../../src/types/process';

describe('ProcessStepPill Component', () => {
  const depositionStep = CANONICAL_PROCESS_STEPS.find((s) => s.id === 'deposition')!;
  const startStep = CANONICAL_PROCESS_STEPS.find((s) => s.id === 'start')!;

  it('renders a numbered process step (Step 1 of 6)', () => {
    render(<ProcessStepPill step={depositionStep} isActive={true} />);

    const button = screen.getByRole('button', {
      name: /Step 1 of 6: Deposition\. Status: active\./i,
    });
    expect(button).toBeDefined();
    expect(button.getAttribute('aria-current')).toBe('step');
    expect(screen.getByText('Deposition')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
  });

  it('renders a process control checkpoint (ADI Inspection) with checkpoint badge', () => {
    const adiStep = CANONICAL_PROCESS_STEPS.find((s) => s.id === 'adi')!;
    render(<ProcessStepPill step={adiStep} isActive={false} />);

    const button = screen.getByRole('button', {
      name: /Process Control Checkpoint: ADI Inspection\. Status: upcoming\./i,
    });
    expect(button).toBeDefined();
    // Compact visual label matches user specification ("ADI")
    expect(screen.getAllByText('ADI').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the setup step (Start wafer) without a process step number', () => {
    render(<ProcessStepPill step={startStep} isCompleted={true} />);

    const button = screen.getByRole('button', {
      name: /Setup: Start wafer\. Status: completed\./i,
    });
    expect(button).toBeDefined();
    // Compact visual label matches user specification ("Start")
    expect(screen.getAllByText('Start').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ProcessStepPill step={depositionStep} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders all canonical steps with compact labels without any ellipsis truncation', () => {
    for (const step of CANONICAL_PROCESS_STEPS) {
      const { container, unmount } = render(<ProcessStepPill step={step} />);
      const span = container.querySelector('span.whitespace-nowrap');
      expect(span).not.toBeNull();
      const text = span?.textContent ?? '';
      expect(text.endsWith('...')).toBe(false);
      expect(text.endsWith('…')).toBe(false);
      expect(text.includes('/...')).toBe(false);
      unmount();
    }
  });
});
