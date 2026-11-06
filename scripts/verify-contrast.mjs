#!/usr/bin/env node
/**
 * verify-contrast.mjs — Vérification mathématique WCAG 2.2 (formule officielle de luminance relative)
 * Exécutable via `npm run audit:contrast`. Code de sortie 0 si toutes les paires respectent AA/AAA.
 */

const PALETTE = {
  bg: '#F5F2EB',
  surface: '#FCFBF8',
  surfaceAlt: '#EAE5DA',
  ink: '#141413',
  inkMuted: '#57534E',
  accent: '#183B56',
  bronze: '#6E502F',
  onAccent: '#FCFBF8',
};

const PAIRS = [
  { fg: 'ink', bg: 'bg', use: 'body', min: 4.5 },
  { fg: 'ink', bg: 'surface', use: 'body', min: 4.5 },
  { fg: 'ink', bg: 'surfaceAlt', use: 'body', min: 4.5 },
  { fg: 'inkMuted', bg: 'bg', use: 'body', min: 4.5 },
  { fg: 'inkMuted', bg: 'surface', use: 'body', min: 4.5 },
  { fg: 'inkMuted', bg: 'surfaceAlt', use: 'body', min: 4.5 },
  { fg: 'accent', bg: 'bg', use: 'body', min: 4.5 },
  { fg: 'accent', bg: 'surface', use: 'body', min: 4.5 },
  { fg: 'onAccent', bg: 'accent', use: 'body', min: 4.5 },
  { fg: 'bronze', bg: 'bg', use: 'body', min: 4.5 },
  { fg: 'bronze', bg: 'surface', use: 'body', min: 4.5 },
  { fg: 'accent', bg: 'bg', use: 'ui', min: 3.0 },
];

const parseHex = (hex) => [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16));
const linearize = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (rgb) => {
  const [r, g, b] = rgb.map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrastRatio = (hexA, hexB) => {
  const [l1, l2] = [luminance(parseHex(hexA)), luminance(parseHex(hexB))].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
};

let failed = 0;
console.log('Contrôle WCAG 2.2 — Palette « L’Atrium de Haute Précision »\n');
for (const p of PAIRS) {
  const r = contrastRatio(PALETTE[p.fg], PALETTE[p.bg]);
  const ok = r >= p.min;
  if (!ok) failed++;
  const grade = r >= 7 ? 'AAA' : ok ? 'AA ' : 'FAIL';
  console.log(
    `${(p.fg + ' (' + PALETTE[p.fg] + ') / ' + p.bg + ' (' + PALETTE[p.bg] + ')').padEnd(46)} ${p.use.padEnd(6)} ${r.toFixed(2).padStart(5)}:1  [${grade}]`
  );
}

if (failed > 0) {
  console.error(`\nÉCHEC : ${failed} paire(s) sous le seuil WCAG 2.2.`);
  process.exit(4);
}
console.log('\nSUCCÈS : 100 % des paires respectent WCAG 2.2 AA (majorité AAA).');
