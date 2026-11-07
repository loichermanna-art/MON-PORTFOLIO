/**
 * Vérification mathématique des ratios de contraste WCAG 2.2 AA & AAA
 * pour la palette de référence « MIDNIGHT BLUE » (#071426 / #102747 / #174477 / #76A9E8 / #E8EDF5 / #FFFFFF).
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
  { label: 'Titres Blanc Pur (#FFFFFF) sur Midnight Blue (#071426)', fg: '#FFFFFF', bg: '#071426', min: 7.0 },
  { label: 'Texte Éditorial (#E8EDF5) sur Midnight Blue (#071426)', fg: '#E8EDF5', bg: '#071426', min: 7.0 },
  { label: 'Texte Éditorial (#E8EDF5) sur Volume Architectural (#102747)', fg: '#E8EDF5', bg: '#102747', min: 7.0 },
  { label: 'Corps Secondaire (#CBD8EA) sur Volume Architectural (#102747)', fg: '#CBD8EA', bg: '#102747', min: 7.0 },
  { label: 'Métadonnées (#A9BCD6) sur Midnight Blue (#071426)', fg: '#A9BCD6', bg: '#071426', min: 7.0 },
  { label: 'Accent Lumineux (#76A9E8) sur Midnight Blue (#071426)', fg: '#76A9E8', bg: '#071426', min: 7.0 },
  { label: 'Accent Lumineux (#76A9E8) sur Volume Architectural (#102747)', fg: '#76A9E8', bg: '#102747', min: 4.5 },
  { label: 'CTA Primaire (#071426) sur Blanc Froid (#E8EDF5)', fg: '#071426', bg: '#E8EDF5', min: 7.0 },
];

let allPassed = true;
console.log('=== AUDIT CONTRASTE WCAG 2.2 — PALETTE MIDNIGHT BLUE ===');
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
