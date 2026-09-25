import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import SiteHeader from '@/components/app/SiteHeader';

describe('SiteHeader', () => {
  it('shows the same three destinations and marks the current section', () => {
    render(<SiteHeader activeSection="basics" onOpenHome={vi.fn()} onOpenBasics={vi.fn()} onOpenFab={vi.fn()} />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(nav).getByText('Home')).toBeDefined();
    expect(within(nav).getByText('Fab Basics').getAttribute('aria-current')).toBe('page');
    expect(within(nav).getByText('Virtual Fab')).toBeDefined();
    expect(screen.queryByText('2 / 12 lessons')).toBeNull();
    expect(screen.queryByRole('button', { name: /profile/i })).toBeNull();
  });

  it('uses working navigation actions', () => {
    const onOpenHome = vi.fn();
    const onOpenFab = vi.fn();
    render(<SiteHeader activeSection="basics" onOpenHome={onOpenHome} onOpenBasics={vi.fn()} onOpenFab={onOpenFab} />);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    fireEvent.click(within(nav).getByRole('button', { name: 'Home' }));
    fireEvent.click(within(nav).getByRole('button', { name: 'Virtual Fab' }));
    expect(onOpenHome).toHaveBeenCalledOnce();
    expect(onOpenFab).toHaveBeenCalledOnce();
  });

  it('opens and closes the mobile menu after choosing a destination', () => {
    const onOpenBasics = vi.fn();
    render(<SiteHeader activeSection="home" onOpenHome={vi.fn()} onOpenBasics={onOpenBasics} onOpenFab={vi.fn()} />);
    const toggle = screen.getByRole('button', { name: 'Open navigation menu' });
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const mobileNav = screen.getByRole('navigation', { name: 'Mobile main navigation' });
    fireEvent.click(within(mobileNav).getByRole('button', { name: 'Fab Basics' }));
    expect(onOpenBasics).toHaveBeenCalledOnce();
    expect(screen.queryByRole('navigation', { name: 'Mobile main navigation' })).toBeNull();
  });
});
