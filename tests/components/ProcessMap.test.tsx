import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProcessMap from '../../src/components/process/ProcessMap';

describe('ProcessMap Component', () => {
  it('renders all canonical steps including ADI/AEI checkpoints and repeat', () => {
    render(<ProcessMap activeStepId="deposition" />);

    expect(screen.getAllByText('Start').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Deposition')).toBeDefined();
    expect(screen.getByText('Coat Resist')).toBeDefined();
    expect(screen.getByText('Lithography')).toBeDefined();
    expect(screen.getByText('Develop')).toBeDefined();
    expect(screen.getAllByText('ADI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Etch')).toBeDefined();
    expect(screen.getAllByText('AEI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Strip')).toBeDefined();
    expect(screen.getByText('Repeat')).toBeDefined();

    // Verify full names remain preserved in accessibility labels
    expect(screen.getByRole('button', { name: /Setup: Start wafer/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Process Control Checkpoint: ADI Inspection/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Process Control Checkpoint: AEI Inspection/i })).toBeDefined();
  });

  it('triggers onSelectStep when clicking a step', () => {
    const handleSelect = vi.fn();
    render(<ProcessMap onSelectStep={handleSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Lithography/i }));
    expect(handleSelect).toHaveBeenCalledWith('lithography');
  });
});
