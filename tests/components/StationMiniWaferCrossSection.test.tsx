import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StationMiniWaferCrossSection } from '../../src/components/process/StationMiniWaferCrossSection';
import { STATION_TELEMETRY_MAP } from '../../src/data/station-telemetry';

describe('StationMiniWaferCrossSection Component', () => {
  it('renders bare wafer cross-section state for start step', () => {
    const startTelemetry = STATION_TELEMETRY_MAP.start;
    render(<StationMiniWaferCrossSection telemetry={startTelemetry} />);

    expect(screen.getByText('Wafer State Preview')).toBeDefined();
    expect(screen.getByText(/Silicon Substrate \(Si · 775 µm\)/i)).toBeDefined();
    expect(screen.getByRole('img', { name: startTelemetry.waferStateDescription })).toBeDefined();
  });

  it('renders deposited film annotation for deposition step', () => {
    const depTelemetry = STATION_TELEMETRY_MAP.deposition;
    render(<StationMiniWaferCrossSection telemetry={depTelemetry} />);

    expect(screen.getByText(/Deposited Film: SiO₂ \(100 nm\)/i)).toBeDefined();
    expect(screen.getByText(depTelemetry.waferStateDescription)).toBeDefined();
  });

  it('renders photoresist polymer annotation for coat step', () => {
    const coatTelemetry = STATION_TELEMETRY_MAP.coat;
    render(<StationMiniWaferCrossSection telemetry={coatTelemetry} />);

    expect(screen.getByText(/Photoresist Polymer \(300 nm\)/i)).toBeDefined();
    expect(screen.getByText(coatTelemetry.waferStateDescription)).toBeDefined();
  });

  it('renders etched trench markers and annotation for etch step', () => {
    const etchTelemetry = STATION_TELEMETRY_MAP.etch;
    render(<StationMiniWaferCrossSection telemetry={etchTelemetry} />);

    expect(screen.getByText(/Anisotropic Plasma Trench Etch ↓/i)).toBeDefined();
  });

  it('renders resist stripped annotation for strip step', () => {
    const stripTelemetry = STATION_TELEMETRY_MAP.strip;
    render(<StationMiniWaferCrossSection telemetry={stripTelemetry} />);

    expect(screen.getByText(/Resist Stripped · Functional SiO₂ Pattern/i)).toBeDefined();
  });
});
