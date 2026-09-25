import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';

describe('App Root', () => {
  it('renders the complete Fab Overview shell with SkipLink and accessible landmark', () => {
    window.history.replaceState(null, '', '/#fab');
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeDefined();
    expect(
      screen.getAllByText('Virtual Fab')[0],
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

  it('switches between Virtual Fab and Fab Basics and keeps Basics section links in Basics', () => {
    window.history.replaceState(null, '', '/#fab');
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /Fab Basics/i })[0]);
    expect(screen.getByRole('heading', { name: /A clearer view of how chips are made/i })).toBeDefined();
    expect(window.location.hash).toBe('#basics');

    window.history.pushState(null, '', '#patterning-lesson');
    fireEvent(window, new Event('hashchange'));
    expect(screen.getByRole('heading', { name: /A clearer view of how chips are made/i })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Return to Virtual Fab' }));
    expect(screen.getByRole('heading', { name: 'Fab Overview' })).toBeDefined();
    expect(window.location.hash).toBe('#fab');
  });

  it('returns to the root Fab URL from a direct Basics path', () => {
    window.history.replaceState(null, '', '/basics');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Return to Virtual Fab' }));
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('#fab');
    expect(screen.getByRole('heading', { name: 'Fab Overview' })).toBeDefined();
  });
});
