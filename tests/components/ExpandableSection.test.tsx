import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpandableSection from '@/components/ui/ExpandableSection';

describe('ExpandableSection Component', () => {
  it('renders the title inside a native button trigger', () => {
    render(
      <ExpandableSection title="Why this step?">
        Detailed context about thin film deposition.
      </ExpandableSection>,
    );
    const trigger = screen.getByRole('button', { name: /why this step\?/i });
    expect(trigger).toBeDefined();
    expect(trigger.tagName.toLowerCase()).toBe('button');
  });

  it('is closed initially by default with aria-expanded="false"', () => {
    render(
      <ExpandableSection title="Engineering View">
        Gas flow rates and chamber pressures.
      </ExpandableSection>,
    );
    const trigger = screen.getByRole('button', { name: /engineering view/i });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    const contentContainer = document.getElementById(
      trigger.getAttribute('aria-controls')!,
    );
    expect(contentContainer?.className).toContain('grid-rows-[0fr]');
  });

  it('opens content and updates aria-expanded to true on click', () => {
    render(
      <ExpandableSection title="Sources">
        References to textbook and cleanroom manuals.
      </ExpandableSection>,
    );
    const trigger = screen.getByRole('button', { name: /sources/i });
    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const contentContainer = document.getElementById(
      trigger.getAttribute('aria-controls')!,
    );
    expect(contentContainer?.className).toContain('grid-rows-[1fr]');
    expect(
      screen.getByText('References to textbook and cleanroom manuals.'),
    ).toBeDefined();
  });

  it('closes on second click', () => {
    render(
      <ExpandableSection title="Common Misconceptions">
        All oxide is deposited.
      </ExpandableSection>,
    );
    const trigger = screen.getByRole('button', {
      name: /common misconceptions/i,
    });

    // First click: open
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    // Second click: close
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    const contentContainer = document.getElementById(
      trigger.getAttribute('aria-controls')!,
    );
    expect(contentContainer?.className).toContain('grid-rows-[0fr]');
  });

  it('renders content open when defaultOpen is true', () => {
    render(
      <ExpandableSection title="Default Open Section" defaultOpen>
        Pre-expanded content.
      </ExpandableSection>,
    );
    const trigger = screen.getByRole('button', {
      name: /default open section/i,
    });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const contentContainer = document.getElementById(
      trigger.getAttribute('aria-controls')!,
    );
    expect(contentContainer?.className).toContain('grid-rows-[1fr]');
  });
});
