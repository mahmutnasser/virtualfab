import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WaferCrossSectionSVG from '../../src/components/wafer-lab/WaferCrossSectionSVG';
import {
  INITIAL_BARE_WAFER,
  applyMockDeposition,
} from '../../src/types/wafer';

describe('WaferCrossSectionSVG Component', () => {
  it('renders accessible SVG with role="img" and accessible descriptions for bare wafer', () => {
    render(<WaferCrossSectionSVG waferState={INITIAL_BARE_WAFER} />);

    const svg = screen.getByRole('img');
    expect(svg).toBeDefined();
    expect(screen.getAllByText(/SILICON SUBSTRATE/i)[0]).toBeDefined();
    expect(screen.getAllByText(/Silicon Substrate Present/i)[0]).toBeDefined();
    expect(screen.getAllByText(/NOT TO SCALE/i)[0]).toBeDefined();
    expect(screen.queryByText(/SILICON DIOXIDE/i)).toBeNull();
  });

  it('renders the deposited oxide film after deposition transformation', () => {
    const depositedWafer = applyMockDeposition(INITIAL_BARE_WAFER);
    render(<WaferCrossSectionSVG waferState={depositedWafer} />);

    expect(screen.getAllByText(/SILICON SUBSTRATE/i)[0]).toBeDefined();
    expect(screen.getByText(/SILICON DIOXIDE \(SiO₂\) FILM/i)).toBeDefined();
    expect(screen.getByText(/Deposited Film \(SiO₂\)/i)).toBeDefined();
    expect(screen.getAllByText(/NOT TO SCALE/i)[0]).toBeDefined();
  });
});
