import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Run Process</Button>);
    expect(screen.getByText('Run Process')).toBeDefined();
  });

  it('is accessible via native button role', () => {
    render(<Button>Inspect Wafer</Button>);
    const button = screen.getByRole('button', { name: 'Inspect Wafer' });
    expect(button).toBeDefined();
    expect(button.tagName.toLowerCase()).toBe('button');
  });

  it('disables the button when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('sets aria-busy and disables interaction when loading is true', () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Start Journey
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button).toBeDisabled();
    expect(screen.getByText('Loading…')).toBeDefined();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('preserves custom className', () => {
    render(<Button className="custom-test-class">Custom</Button>);
    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button.className).toContain('custom-test-class');
  });

  it('fires onClick handler when active', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
