import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import { useVirtualFabStore } from './store/virtual-fab-store';

if (typeof window !== 'undefined') {
  (window as unknown as { __virtualFabStore: typeof useVirtualFabStore }).__virtualFabStore = useVirtualFabStore;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
