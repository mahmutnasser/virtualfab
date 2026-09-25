import { useState, useEffect, useCallback } from 'react';
import AppShell from './components/app/AppShell';
import SkipLink from './components/a11y/SkipLink';
import { LiveAnnouncerProvider } from './components/a11y/LiveAnnouncer';
import { FabBasicsPage } from './components/basics/FabBasicsPage';
import { HomePage } from './components/home/HomePage';

export type AppDestination = 'home' | 'fab' | 'basics';

const BASICS_HASHES = new Set([
  'basics',
  'basics-top',
  'scale-viewer',
  'patterning-lesson',
  'duv-vs-euv',
  'process-verbs',
  'all-terms',
]);

const getDestination = (): AppDestination => {
  const path = window.location.pathname.toLowerCase();
  const hashTarget = window.location.hash.slice(1).split('?')[0].toLowerCase();
  if (/\/basics(?:\/|$)/.test(path) || BASICS_HASHES.has(hashTarget)) return 'basics';
  if (/\/fab(?:\/|$)/.test(path) || hashTarget === 'fab') return 'fab';
  return 'home';
};

export default function App() {
  const [destination, setDestination] = useState<AppDestination>(() => {
    return typeof window === 'undefined' ? 'home' : getDestination();
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
      const nextDestination = getDestination();
      setDestination(nextDestination);
      if (nextDestination === 'basics') {
        const searchParams = new URLSearchParams(
          window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '')
        );
        const term = searchParams.get('term');
        if (term) setInitialTermId(term);
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
    const fabPath = window.location.pathname.replace(/\/basics(?:\/.*)?$/i, '/') || '/';
    const newLocation = `${fabPath}#fab`;
    if (`${window.location.pathname}${window.location.hash}` !== newLocation) {
      window.history.pushState(null, '', newLocation);
    }
  }, []);

  const handleOpenHome = useCallback(() => {
    setDestination('home');
    const homePath = window.location.pathname.replace(/\/(?:basics|fab)(?:\/.*)?$/i, '/') || '/';
    const newLocation = `${homePath}#home`;
    if (`${window.location.pathname}${window.location.hash}` !== newLocation) {
      window.history.pushState(null, '', newLocation);
    }
  }, []);

  return (
    <LiveAnnouncerProvider>
      <SkipLink targetId="main-content" />
      {destination === 'home' ? (
        <HomePage onOpenBasics={() => handleOpenBasics()} onOpenFab={handleOpenFab} />
      ) : destination === 'basics' ? (
        <FabBasicsPage onOpenHome={handleOpenHome} onOpenFab={handleOpenFab} initialTermId={initialTermId} />
      ) : (
        <AppShell onOpenHome={handleOpenHome} onOpenBasics={handleOpenBasics} />
      )}
    </LiveAnnouncerProvider>
  );
}
