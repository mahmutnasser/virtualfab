import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppShell from '@/components/app/AppShell';

describe('AppShell Component', () => {
  it('contains the #main-content landmark with tabIndex={-1}', () => {
    render(<AppShell />);
    const main = document.getElementById('main-content');
    expect(main).toBeDefined();
    expect(main?.getAttribute('tabIndex')).toBe('-1');
  });

  it('renders the TopBar header with navigation and progress', () => {
    render(<AppShell />);
    expect(
      screen.getAllByText('Virtual Fab')[0],
    ).toBeDefined();
    expect(screen.getByText('2 / 12 lessons')).toBeDefined();
  });

  it('renders the FabOverviewHero heading and Start the Tour CTA', () => {
    render(<AppShell />);
    expect(
      screen.getByRole('heading', { name: 'Fab Overview' }),
    ).toBeDefined();
    expect(
      screen.getAllByRole('button', { name: /start the tour/i })[0],
    ).toBeDefined();
  });

  it('renders the FabNarration contextual card', () => {
    render(<AppShell />);
    expect(
      screen.getByText(
        'Follow one wafer through a simplified patterning cycle.',
      ),
    ).toBeDefined();
  });

  it('navigates from Fab Overview to Station Focus when Start the Tour is clicked', () => {
    render(<AppShell />);
    const startButton = screen.getAllByRole('button', { name: /start the tour/i })[0];
    fireEvent.click(startButton);

    expect(screen.getByRole('dialog', { name: /Deposition/i })).toBeDefined();
    expect(screen.getByText('STEP 1 OF 6')).toBeDefined();
    expect(screen.getByRole('button', { name: /Open Wafer Lab/i })).toBeDefined();
  });

  it('navigates to Wafer Lab and back to correct physical station', () => {
    render(<AppShell initialView="station-focus" />);
    expect(screen.getByRole('dialog')).toBeDefined();

    const inspectButton = screen.getByRole('button', { name: /Open Wafer Lab/i });
    fireEvent.click(inspectButton);

    expect(screen.getByText(/What will deposition change on the wafer/i)).toBeDefined();

    // 1. Returning from Wafer Lab returns to the physical station
    const returnToStationBtn = screen.getByRole('button', { name: /Return to Deposition Station/i });
    fireEvent.click(returnToStationBtn);

    expect(screen.getByRole('dialog', { name: /Deposition/i })).toBeDefined();

    // 2. Returning from Station Focus returns to Fab Overview
    const backToFabBtn = screen.getByRole('button', { name: /Close station focus panel and return to fab overview/i });
    fireEvent.click(backToFabBtn);

    expect(screen.getByRole('heading', { name: 'Fab Overview' })).toBeDefined();
  });
});
