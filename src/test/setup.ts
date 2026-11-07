import '@testing-library/jest-dom/vitest';

// Mock matchMedia pour JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock scrollTo pour JSDOM
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});

// Retourner null proprement sur getContext dans JSDOM (sans dépendance canvas native)
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: () => null,
});
