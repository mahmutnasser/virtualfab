import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('App Root', () => {
  it('renders the complete Fab Overview shell with SkipLink and accessible landmark', () => {
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeDefined();
    expect(
      screen.getAllByRole('button', { name: 'Virtual Fab' })[0],
    ).toBeDefined();
    expect(screen.getByText('2 / 12 lessons')).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Fab Overview' }),
    ).toBeDefined();
    expect(
      screen.getByText(
        'Follow one wafer through a simplified patterning cycle.',
      ),
    ).toBeDefined();

    const main = document.getElementById('main-content');
    expect(main).toBeDefined();
  });
});
