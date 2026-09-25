import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScaleZoomViewer } from '../../src/components/basics/scale/ScaleZoomViewer';

describe('VF-014 ScaleZoomViewer', () => {
  it('renders with initial wafer stage active', () => {
    render(<ScaleZoomViewer />);
    expect(screen.getByRole('region', { name: /Interactive scale viewer/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Wafer/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(/300 mm \(~12 inches\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('img', { name: /Patterned silicon wafer held by gloved hands/i }))
      .toHaveAttribute('src', '/images/basics/hero-wafer-cleanroom.jpg');
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
    expect(screen.getByRole('img', { name: /six individual dies arranged in two columns and three rows/i }))
      .toHaveAttribute('src', '/images/basics/scale/02_field_2x3.jpg');
    expect(screen.getByText(/2 columns × 3 rows/i)).toBeInTheDocument();

    // Advance to Stage 3: Die
    fireEvent.click(nextBtn);
    expect(screen.getByRole('tab', { name: /Die/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(/Product-dependent size/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('img', { name: /Magnified view of Die #4/i }))
      .toHaveAttribute('src', '/images/basics/scale/03_die_4.jpg');

    // Advance to Stage 4: Layer cutaway
    fireEvent.click(nextBtn);
    expect(screen.getByRole('tab', { name: /Layer/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('img', { name: /Conceptual cross section/i }))
      .toHaveAttribute('src', '/images/basics/scale/05_layer_gate_cutaway.jpg');
    expect(screen.getByText(/not raw instrument data/i)).toBeInTheDocument();

    // Advance to Stage 5: complete nanoscale feature
    fireEvent.click(nextBtn);
    expect(screen.getByRole('tab', { name: /Feature/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText(/Nanoscale/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('img', { name: /Microscopy-inspired rendering/i }))
      .toHaveAttribute('src', '/images/basics/scale/04_feature_finfet.jpg');
  });

  it('allows clicking direct tab buttons to jump to a specific scale', () => {
    render(<ScaleZoomViewer />);
    const dieTab = screen.getByRole('tab', { name: /Die/i });
    fireEvent.click(dieTab);

    expect(dieTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/The Independent Functional Integrated Circuit/i)).toBeInTheDocument();
  });

  it('moves from the six-die field to the die hierarchy and lets the End key reach Feature', () => {
    render(<ScaleZoomViewer initialStage="field" />);
    fireEvent.click(screen.getByRole('button', { name: /Next scale level/i }));
    expect(screen.getByRole('tab', { name: /Die/i })).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(screen.getByRole('region', { name: /Interactive scale viewer/i }), { key: 'End' });
    expect(screen.getByRole('tab', { name: /Feature/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('calls onNavigateToFab when clicking Explore in Virtual Fab at the final stage', () => {
    const handleNav = vi.fn();
    render(<ScaleZoomViewer initialStage="feature" onNavigateToFab={handleNav} />);

    const ctaBtn = screen.getByRole('button', { name: /Experience scale in Virtual Fab/i });
    fireEvent.click(ctaBtn);
    expect(handleNav).toHaveBeenCalledTimes(1);
  });
});
