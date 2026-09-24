import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextualGlossaryDrawer } from '../../src/components/process/ContextualGlossaryDrawer';

describe('VF-014 ContextualGlossaryDrawer', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ContextualGlossaryDrawer isOpen={false} onClose={vi.fn()} stepId="deposition" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders station-specific terms when open', () => {
    render(
      <ContextualGlossaryDrawer isOpen={true} onClose={vi.fn()} stepId="deposition" />
    );

    expect(screen.getByRole('dialog', { name: /Fab Vocabulary & Key Terms/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Deposition' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Thin Film' })).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <ContextualGlossaryDrawer isOpen={true} onClose={handleClose} stepId="coat" />
    );

    const closeBtn = screen.getByRole('button', { name: /Close glossary drawer/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <ContextualGlossaryDrawer isOpen={true} onClose={handleClose} stepId="lithography" />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('triggers onOpenBasics when clicking Full Lesson or Open Guide', () => {
    const handleOpenBasics = vi.fn();
    const handleClose = vi.fn();
    render(
      <ContextualGlossaryDrawer
        isOpen={true}
        onClose={handleClose}
        stepId="lithography"
        onOpenBasics={handleOpenBasics}
      />
    );

    const fullGuideBtn = screen.getByRole('button', { name: /Open Complete "Fab Basics" Guide/i });
    fireEvent.click(fullGuideBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleOpenBasics).toHaveBeenCalledTimes(1);
  });
});
