/**
 * Vérification mathématique des ratios de contraste WCAG 2.2 AA & AAA
 * pour la palette « TWILIGHT ZENITH » (#080F1C / verre fumé #0C1627 / #E8EEF6 / #C3CFE0 / #F2B24B).
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
  { label: 'Titres Doux (#E8EEF6) sur Crépuscule (#080F1C)', fg: '#E8EEF6', bg: '#080F1C', min: 7.0 },
  { label: 'Corps Éditorial (#C3CFE0) sur Crépuscule (#080F1C)', fg: '#C3CFE0', bg: '#080F1C', min: 7.0 },
  { label: 'Corps Éditorial (#C3CFE0) sur Verre Fumé (#0C1627)', fg: '#C3CFE0', bg: '#0C1627', min: 7.0 },
  { label: 'Métadonnées (#8FA2BC) sur Crépuscule (#080F1C)', fg: '#8FA2BC', bg: '#080F1C', min: 4.5 },
  { label: 'Display Ligne 1 (#7E93B0) sur Crépuscule (#080F1C) [Grand Texte]', fg: '#7E93B0', bg: '#080F1C', min: 4.5 },
  { label: 'Accent Horizon Ambre (#F2B24B) sur Verre Fumé (#0C1627)', fg: '#F2B24B', bg: '#0C1627', min: 7.0 },
  { label: 'CTA Pilule Perle (#080F1C) sur (#DCE5F2)', fg: '#080F1C', bg: '#DCE5F2', min: 7.0 },
];

let allPassed = true;
console.log('=== AUDIT CONTRASTE WCAG 2.2 — TWILIGHT ZENITH ===');
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
