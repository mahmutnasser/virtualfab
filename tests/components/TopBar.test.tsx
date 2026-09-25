import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from '@/components/app/TopBar';

describe('TopBar Component', () => {
  it('renders Silicon Journey brand mark and Virtual Fab navigation', () => {
    render(<TopBar />);
    expect(screen.getByText(/SILICON/i)).toBeDefined();
    expect(screen.getByText('Virtual Fab')).toBeDefined();
    expect(screen.getByRole('button', { name: /Fab Basics/i })).toBeDefined();
  });

  it('displays the lessons progress counter correctly', () => {
    render(<TopBar currentLessons={2} totalLessons={12} />);
    expect(screen.getByText('2 / 12 lessons')).toBeDefined();
  });

  it('renders an accessible settings / profile control with button role and label', () => {
    const handleSettings = vi.fn();
    render(<TopBar onOpenSettings={handleSettings} />);
    const settingsButton = screen.getByRole('button', {
      name: /user profile and accessibility settings/i,
    });
    expect(settingsButton).toBeDefined();

    fireEvent.click(settingsButton);
    expect(handleSettings).toHaveBeenCalledTimes(1);
  });
});
