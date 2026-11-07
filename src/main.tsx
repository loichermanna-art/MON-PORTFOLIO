import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Polices géométriques contemporaines auto-hébergées OFL (@fontsource) */
import '@fontsource-variable/plus-jakarta-sans';
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
