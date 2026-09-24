import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FabNarration from '@/components/fab/FabNarration';

describe('FabNarration Component', () => {
  it('renders primary narration copy', () => {
    render(<FabNarration />);
    expect(
      screen.getByText(
        'Follow one wafer through a simplified patterning cycle.',
      ),
    ).toBeDefined();
  });

  it('renders contextual learning cycle text and action link', () => {
    render(<FabNarration />);
    expect(
      screen.getByText(
        /see how each step adds, changes, or removes material/i,
      ),
    ).toBeDefined();
    expect(
      screen.getByRole('button', { name: /explore the process/i }),
    ).toBeDefined();
  });
});
