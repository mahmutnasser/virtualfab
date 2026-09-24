import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DuvEuvComparator } from '../../src/components/basics/patterning/DuvEuvComparator';

describe('VF-014 DuvEuvComparator', () => {
  it('renders EUV as default and shows soft X-ray wavelength', () => {
    render(<DuvEuvComparator />);
    expect(screen.getByRole('heading', { name: /DUV vs\. EUV Lithography/i })).toBeInTheDocument();
    expect(screen.getAllByText(/λ = 13\.5 nm/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/EUV OPTICAL PATH/i)).toBeInTheDocument();
  });

  it('switches between DUV and EUV modes', () => {
    render(<DuvEuvComparator />);

    const duvBtn = screen.getByRole('button', { name: /DUV \(193 nm Refractive\)/i });
    fireEvent.click(duvBtn);

    expect(screen.getAllByText(/λ = 193 nm/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/DUV OPTICAL PATH/i)).toBeInTheDocument();
    expect(screen.getByText(/ArF LASER/i)).toBeInTheDocument();

    const euvBtn = screen.getByRole('button', { name: /EUV \(13.5 nm Reflective\)/i });
    fireEvent.click(euvBtn);

    expect(screen.getAllByText(/λ = 13\.5 nm/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Sn Plasma/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays accurate comparison table parameters', () => {
    render(<DuvEuvComparator />);
    expect(screen.getByText(/193 nm \(ArF\)/i)).toBeInTheDocument();
    expect(screen.getByText(/13.5 nm \(Soft X-ray\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Mo\/Si.*mirrors/i).length).toBeGreaterThanOrEqual(1);
  });
});
