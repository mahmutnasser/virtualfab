import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScaleZoomViewer } from '../../src/components/basics/scale/ScaleZoomViewer';

describe('VF-014 ScaleZoomViewer', () => {
  it('renders with initial wafer stage active', () => {
    render(<ScaleZoomViewer />);
    expect(screen.getByRole('region', { name: /Interactive scale viewer/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Wafer/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(/300 mm \(~12 inches\)/i).length).toBeGreaterThanOrEqual(1);
  });

  it('navigates through all 5 stages using Next button', () => {
    render(<ScaleZoomViewer />);
    
    // Stage 1: Wafer
    const nextBtn = screen.getByRole('button', { name: /Next scale level/i });
    expect(nextBtn).toBeInTheDocument();

    // Advance to Stage 2: Field
    fireEvent.click(nextBtn);
    expect(screen.getByRole('tab', { name: /Exposure Field/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(/Exposure area varies by scanner/i).length).toBeGreaterThanOrEqual(1);

    // Advance to Stage 3: Die
    fireEvent.click(nextBtn);
    expect(screen.getByRole('tab', { name: /Die/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(/Product-dependent size/i).length).toBeGreaterThanOrEqual(1);

    // Advance to Stage 4: Feature
    fireEvent.click(nextBtn);
    expect(screen.getByRole('tab', { name: /Feature/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(/Nanoscale/i).length).toBeGreaterThanOrEqual(1);

    // A physical feature belongs to a material layer.
    fireEvent.click(nextBtn);
    expect(screen.getByRole('tab', { name: /Layer/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('img', { name: /Conceptual cross section/i })).toBeInTheDocument();
  });

  it('allows clicking direct tab buttons to jump to a specific scale', () => {
    render(<ScaleZoomViewer />);
    const dieTab = screen.getByRole('tab', { name: /Die/i });
    fireEvent.click(dieTab);

    expect(dieTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/The Independent Functional Integrated Circuit/i)).toBeInTheDocument();
  });

  it('calls onNavigateToFab when clicking Explore in Virtual Fab at the final stage', () => {
    const handleNav = vi.fn();
    render(<ScaleZoomViewer initialStage="layer" onNavigateToFab={handleNav} />);

    const ctaBtn = screen.getByRole('button', { name: /Experience scale in Virtual Fab/i });
    fireEvent.click(ctaBtn);
    expect(handleNav).toHaveBeenCalledTimes(1);
  });
});
