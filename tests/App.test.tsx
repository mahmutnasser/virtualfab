import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '@/App';

describe('App Root', () => {
  it('opens Home at the root and navigates through both learning sections', () => {
    window.history.replaceState(null, '', '/');
    render(<App />);

    expect(screen.getByRole('heading', { name: /See how a chip takes shape/i })).toBeDefined();
    expect(screen.getByRole('main')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Start with Fab Basics' }));
    expect(window.location.hash).toBe('#basics');
    expect(screen.getByRole('heading', { name: /A clearer view of how chips are made/i })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Home' }));
    expect(window.location.hash).toBe('#home');
    expect(screen.getByRole('heading', { name: /See how a chip takes shape/i })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Explore Virtual Fab' }));
    expect(window.location.hash).toBe('#fab');
    expect(screen.getByRole('heading', { name: 'Fab Overview' })).toBeDefined();
    fireEvent.click(screen.getAllByRole('button', { name: 'Home' })[0]);
    expect(window.location.hash).toBe('#home');
    expect(screen.getByRole('heading', { name: /See how a chip takes shape/i })).toBeDefined();
  });

  it('restores Home and Fab from URL history and keeps the skip link in place', () => {
    window.history.replaceState(null, '', '/#home');
    render(<App />);
    window.history.pushState(null, '', '#fab');
    fireEvent(window, new Event('popstate'));
    expect(screen.getByRole('heading', { name: 'Fab Overview' })).toBeDefined();

    fireEvent.click(screen.getByText('Skip to main content'));
    expect(window.location.hash).toBe('#fab');

    window.history.pushState(null, '', '#home');
    fireEvent(window, new Event('popstate'));
    expect(screen.getByRole('heading', { name: /See how a chip takes shape/i })).toBeDefined();
  });

  it('renders the complete Fab Overview shell with SkipLink and accessible landmark', () => {
    window.history.replaceState(null, '', '/#fab');
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeDefined();
    expect(
      screen.getAllByText('Virtual Fab')[0],
    ).toBeDefined();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeDefined();
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

    fireEvent.click(screen.getByRole('button', { name: 'Virtual Fab' }));
    expect(screen.getByRole('heading', { name: 'Fab Overview' })).toBeDefined();
    expect(window.location.hash).toBe('#fab');
  });

  it('returns to the root Fab URL from a direct Basics path', () => {
    window.history.replaceState(null, '', '/basics');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Virtual Fab' }));
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('#fab');
    expect(screen.getByRole('heading', { name: 'Fab Overview' })).toBeDefined();
  });

  it('returns to the Home page from a direct Basics path', () => {
    window.history.replaceState(null, '', '/basics');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Home' }));
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('#home');
    expect(screen.getByRole('heading', { name: /See how a chip takes shape/i })).toBeDefined();
  });

  it('opens Fab Basics from the Virtual Fab introduction', () => {
    window.history.replaceState(null, '', '/#fab');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Start with Fab Basics' }));
    expect(window.location.hash).toBe('#basics');
    expect(screen.getByRole('heading', { name: /A clearer view of how chips are made/i })).toBeDefined();
  });

  it('navigates through the mobile menu without a second bottom bar', () => {
    window.history.replaceState(null, '', '/#fab');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile main navigation' });
    fireEvent.click(within(mobileNav).getByRole('button', { name: 'Fab Basics' }));
    expect(window.location.hash).toBe('#basics');
    expect(screen.queryByRole('navigation', { name: 'Mobile Navigation' })).toBeNull();
  });
});
