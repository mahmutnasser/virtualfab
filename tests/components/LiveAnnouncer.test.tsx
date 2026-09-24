import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import {
  LiveAnnouncerProvider,
  LiveAnnouncer,
} from '@/components/a11y/LiveAnnouncer';
import { useLiveAnnouncer } from '@/components/a11y/LiveAnnouncerContext';

const TestTrigger: React.FC<{ message: string }> = ({ message }) => {
  const { announce } = useLiveAnnouncer();
  return (
    <button type="button" onClick={() => announce(message)}>
      Trigger Announcement
    </button>
  );
};

describe('LiveAnnouncer Component & Provider', () => {
  it('renders a standalone live region with aria-live="polite" and aria-atomic="true"', () => {
    render(<LiveAnnouncer message="Test status announcement" />);
    const region = screen.getByTestId('live-announcer');
    expect(region).toBeDefined();
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
    expect(region.textContent).toBe('Test status announcement');
  });

  it('provides announcement API via useLiveAnnouncer hook and updates live region', async () => {
    render(
      <LiveAnnouncerProvider>
        <TestTrigger message="Deposition station selected. Step 1 of 7." />
      </LiveAnnouncerProvider>,
    );

    const region = screen.getByTestId('live-announcer');
    expect(region).toBeDefined();
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('');

    const button = screen.getByRole('button', {
      name: 'Trigger Announcement',
    });

    await act(async () => {
      button.click();
      // wait for small timeout in component
      await new Promise((resolve) => setTimeout(resolve, 60));
    });

    expect(region.textContent).toBe(
      'Deposition station selected. Step 1 of 7.',
    );
  });
});
