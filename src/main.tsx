import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Polices auto-hébergées OFL (@fontsource) — zéro dépendance réseau externe au runtime */
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource-variable/geist-mono';

import './styles/global.css';
import { App } from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Élément racine #root introuvable dans index.html.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
