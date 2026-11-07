#!/usr/bin/env node
/**
 * verify-contrast.mjs — Vérification mathématique WCAG 2.2 AA/AAA
 * Palette néo-architecturale « Horizon Monolithique » (Clair minéral 01-05 + Crépuscule ardoise 06)
 */

const PALETTE = {
  bgMist: '#F2F4F8',
  surfacePure: '#FFFFFF',
  surfaceSlate: '#E5E9F0',
  ink: '#0F1218',
  inkMuted: '#474E5B',
  accent: '#1A2333',
  duskBg: '#1B222E',
  duskInk: '#F8FAFC',
  duskMuted: '#C2CAD6',
};

const PAIRS = [
  { fg: 'ink', bg: 'bgMist', use: 'body', min: 4.5 },
  { fg: 'ink', bg: 'surfacePure', use: 'body', min: 4.5 },
  { fg: 'ink', bg: 'surfaceSlate', use: 'body', min: 4.5 },
  { fg: 'inkMuted', bg: 'bgMist', use: 'body', min: 4.5 },
  { fg: 'inkMuted', bg: 'surfacePure', use: 'body', min: 4.5 },
  { fg: 'inkMuted', bg: 'surfaceSlate', use: 'body', min: 4.5 },
  { fg: 'accent', bg: 'bgMist', use: 'body', min: 4.5 },
  { fg: 'surfacePure', bg: 'accent', use: 'body', min: 4.5 },
  { fg: 'duskInk', bg: 'duskBg', use: 'body', min: 4.5 },
  { fg: 'duskMuted', bg: 'duskBg', use: 'body', min: 4.5 },
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
console.log('Contrôle WCAG 2.2 — Palette « Horizon Monolithique »\n');
for (const p of PAIRS) {
  const r = contrastRatio(PALETTE[p.fg], PALETTE[p.bg]);
  const ok = r >= p.min;
  if (!ok) failed++;
  const grade = r >= 7 ? 'AAA' : ok ? 'AA ' : 'FAIL';
  console.log(
    `${(p.fg + ' (' + PALETTE[p.fg] + ') / ' + p.bg + ' (' + PALETTE[p.bg] + ')').padEnd(48)} ${p.use.padEnd(6)} ${r.toFixed(2).padStart(5)}:1  [${grade}]`
  );
}

if (failed > 0) {
  console.error(`\nÉCHEC : ${failed} paire(s) sous le seuil WCAG 2.2.`);
  process.exit(4);
}
console.log('\nSUCCÈS : 100 % des paires respectent WCAG 2.2 AA/AAA.');
