/**
 * Vérification mathématique des ratios de contraste WCAG 2.2 AA & AAA
 * pour la palette « THE INFINITE LIBRARY » (#071426, #102747, #174477, #76A9E8, #E8EDF5, #FFFFFF).
 */

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]) {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(hexA, hexB) {
  const l1 = relativeLuminance(hexToRgb(hexA));
  const l2 = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const PAIRS = [
  { label: 'Titres Blancs (#FFFFFF) sur Midnight Blue (#071426)', fg: '#FFFFFF', bg: '#071426', min: 7.0 },
  { label: 'Corps Soft White (#E8EDF5) sur Midnight Blue (#071426)', fg: '#E8EDF5', bg: '#071426', min: 7.0 },
  { label: 'Corps Soft White (#E8EDF5) sur Deep Blue (#102747)', fg: '#E8EDF5', bg: '#102747', min: 7.0 },
  { label: 'CTA Texte (#FFFFFF) sur Architectural Blue (#174477)', fg: '#FFFFFF', bg: '#174477', min: 7.0 },
  { label: 'Cotes Cold Light Blue (#76A9E8) sur Midnight Blue (#071426)', fg: '#76A9E8', bg: '#071426', min: 7.0 },
  { label: 'Cotes Cold Light Blue (#76A9E8) sur Deep Blue (#102747)', fg: '#76A9E8', bg: '#102747', min: 4.5 },
  { label: 'Anneau Focus (#76A9E8) sur Midnight Blue (#071426)', fg: '#76A9E8', bg: '#071426', min: 3.0 },
];

let allPassed = true;
console.log('=== AUDIT CONTRASTE WCAG 2.2 — THE INFINITE LIBRARY ===');
for (const pair of PAIRS) {
  const ratio = contrastRatio(pair.fg, pair.bg);
  const pass = ratio >= pair.min;
  if (!pass) allPassed = false;
  const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA / AAA-Large' : 'FAIL';
  console.log(
    `${pass ? 'PASS' : 'FAIL'} | ${ratio.toFixed(2)}:1 [${grade}] (seuil ${pair.min}:1) — ${pair.label}`
  );
}

if (!allPassed) {
  process.exit(1);
}
