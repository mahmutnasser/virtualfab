import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import ProcessMapDisclosure from '@/components/fab/ProcessMapDisclosure';

describe('ProcessMapDisclosure', () => {
  it('keeps the map compact until requested, then selects a station', () => {
    const onSelectStep = vi.fn();
    render(<ProcessMapDisclosure activeStepId="deposition" completedStepIds={['start']} onSelectStep={onSelectStep} />);
    expect(screen.getByText('Step 1 of 6')).toBeDefined();
    const toggle = screen.getByRole('button', { name: 'View process map' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close process map' }).getAttribute('aria-expanded')).toBe('true');
    const mobileList = screen.getByRole('list', { name: 'Process stations' });
    fireEvent.click(within(mobileList).getByRole('button', { name: /Coat Resist/i }));
    expect(onSelectStep).toHaveBeenCalledWith('coat');
    expect(screen.queryByRole('button', { name: 'Close process map' })).toBeNull();
  });
});
