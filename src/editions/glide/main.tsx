import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/geist-mono';
import './glide.css';
import { GlideApp } from './GlideApp';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <GlideApp />
    </StrictMode>
  );
}
