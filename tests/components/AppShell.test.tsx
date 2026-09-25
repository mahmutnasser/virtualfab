import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AppShell from '@/components/app/AppShell';
import { useVirtualFabStore } from '@/store/virtual-fab-store';

describe('AppShell Component', () => {
  beforeEach(() => useVirtualFabStore.getState().resetJourney());
  it('contains the #main-content landmark with tabIndex={-1}', () => {
    render(<AppShell />);
    const main = document.getElementById('main-content');
    expect(main).toBeDefined();
    expect(main?.getAttribute('tabIndex')).toBe('-1');
  });

  it('renders the shared site navigation and compact process map', () => {
    render(<AppShell />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeDefined();
    expect(screen.getAllByRole('button', { name: 'View process map' })[0]).toBeDefined();
    expect(screen.queryByText('2 / 12 lessons')).toBeNull();
  });

  it('renders the cleanroom overview and guided tour action', () => {
    render(<AppShell />);
    expect(
      screen.getByRole('heading', { name: 'Virtual Fab cleanroom overview' }),
    ).toBeDefined();
    expect(
      screen.getAllByRole('button', { name: /start the guided tour/i })[0],
    ).toBeDefined();
  });

  it('explains the wafer journey in the overview introduction', () => {
    render(<AppShell />);
    expect(
      screen.getByText(
        'See how deposition, lithography, and etch change the wafer layer by layer.',
      ),
    ).toBeDefined();
  });

  it('navigates from the cleanroom overview to Station Focus', () => {
    render(<AppShell />);
    const startButton = screen.getAllByRole('button', { name: /start the guided tour/i })[0];
    fireEvent.click(startButton);

    expect(screen.getByRole('dialog', { name: /Deposition/i })).toBeDefined();
    expect(screen.getByText('STEP 1 OF 6')).toBeDefined();
    expect(screen.getByRole('button', { name: /Open Wafer Lab/i })).toBeDefined();
  });

  it('opens a station directly from the overview process map', () => {
    render(<AppShell />);
    fireEvent.click(screen.getByRole('button', { name: 'View process map' }));
    const stations = screen.getByRole('list', { name: 'Process stations' });
    fireEvent.click(within(stations).getByRole('button', { name: /Etch/i }));
    expect(screen.getByRole('dialog', { name: /Etch/i })).toBeDefined();
  });

  it('navigates to Wafer Lab and back to correct physical station', () => {
    render(<AppShell initialView="station-focus" />);
    expect(screen.getByRole('dialog')).toBeDefined();

    const inspectButton = screen.getByRole('button', { name: /Open Wafer Lab/i });
    fireEvent.click(inspectButton);

    expect(screen.getByText(/What will deposition change on the wafer/i)).toBeDefined();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeDefined();

    // 1. Returning from Wafer Lab returns to the physical station
    const returnToStationBtn = screen.getByRole('button', { name: /Return to Deposition Station/i });
    fireEvent.click(returnToStationBtn);

    expect(screen.getByRole('dialog', { name: /Deposition/i })).toBeDefined();

    // 2. Returning from Station Focus returns to Fab Overview
    const backToFabBtn = screen.getByRole('button', { name: /Close station focus panel and return to fab overview/i });
    fireEvent.click(backToFabBtn);

    expect(screen.getByRole('heading', { name: 'Virtual Fab cleanroom overview' })).toBeDefined();
  });
});
