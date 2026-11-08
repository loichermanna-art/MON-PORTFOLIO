import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Triade typographique auto-hébergée OFL (@fontsource) */
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/geist-mono';

import './library/styles/infiniteLibrary.css';
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
