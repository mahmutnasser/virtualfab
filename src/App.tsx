import { useState, useEffect, useCallback } from 'react';
import AppShell from './components/app/AppShell';
import SkipLink from './components/a11y/SkipLink';
import { LiveAnnouncerProvider } from './components/a11y/LiveAnnouncer';
import { FabBasicsPage } from './components/basics/FabBasicsPage';

export type AppDestination = 'fab' | 'basics';

export default function App() {
  const [destination, setDestination] = useState<AppDestination>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/basics') || hash.includes('basics')) {
        return 'basics';
      }
    }
    return 'fab';
  });

  const [initialTermId, setInitialTermId] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(
        window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '')
      );
      return searchParams.get('term') || undefined;
    }
    return undefined;
  });

  // Handle browser back/forward and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/basics') || hash.includes('basics')) {
        setDestination('basics');
        const searchParams = new URLSearchParams(
          window.location.search || (hash.includes('?') ? hash.split('?')[1] : '')
        );
        const term = searchParams.get('term');
        if (term) setInitialTermId(term);
      } else {
        setDestination('fab');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleOpenBasics = useCallback((termId?: string) => {
    setDestination('basics');
    setInitialTermId(termId);
    const newHash = termId ? `#basics?term=${encodeURIComponent(termId)}` : '#basics';
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
  }, []);

  const handleOpenFab = useCallback(() => {
    setDestination('fab');
    if (window.location.hash !== '#fab' && window.location.hash !== '') {
      window.history.pushState(null, '', '#fab');
    }
  }, []);

  return (
    <LiveAnnouncerProvider>
      <SkipLink targetId="main-content" />
      {destination === 'basics' ? (
        <FabBasicsPage onOpenFab={handleOpenFab} initialTermId={initialTermId} />
      ) : (
        <AppShell onOpenBasics={handleOpenBasics} />
      )}
    </LiveAnnouncerProvider>
  );
}
