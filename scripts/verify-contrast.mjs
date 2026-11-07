/**
 * Audit automatisé des ratios de contraste WCAG 2.2 AA / AAA
 * pour la palette exécutive claire « SKY ZENITH » (#F8FAFC / #FFFFFF / #202A36 / #525E6E).
 */

function srgbToLinear(channel) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const PAIRS = [
  { label: 'Marque & Nav (#111827) sur Ciel (#F8FAFC)', fg: '#111827', bg: '#F8FAFC', min: 7.0 },
  { label: 'Titres Sky Zenith (#202A36) sur Ciel (#F8FAFC)', fg: '#202A36', bg: '#F8FAFC', min: 7.0 },
  { label: 'Titres Sky Zenith (#202A36) sur Verre Blanc (#FFFFFF)', fg: '#202A36', bg: '#FFFFFF', min: 7.0 },
  { label: 'Corps éditorial (#334155) sur Ciel (#F8FAFC)', fg: '#334155', bg: '#F8FAFC', min: 7.0 },
  { label: 'Sous-titres & Kickers (#475569) sur Verre (#FFFFFF)', fg: '#475569', bg: '#FFFFFF', min: 7.0 },
  { label: 'Display Ligne 1 Titane (#525E6E) sur Ciel (#F8FAFC) [Grand Texte]', fg: '#525E6E', bg: '#F8FAFC', min: 4.5 },
  { label: 'CTA Primaire Blanc (#FFFFFF) sur Ardoise (#202A36)', fg: '#FFFFFF', bg: '#202A36', min: 7.0 },
  { label: 'CTA Secondaire (#1E293B) sur Pilule Argent (#DCE2EA)', fg: '#1E293B', bg: '#DCE2EA', min: 7.0 },
  { label: 'Accent Ambre Foncé (#9A3412) sur Verre (#FFFFFF)', fg: '#9A3412', bg: '#FFFFFF', min: 7.0 },
];

let failed = false;
console.log('=== AUDIT CONTRASTE WCAG 2.2 — PALETTE SKY ZENITH ===');
for (const pair of PAIRS) {
  const ratio = contrastRatio(pair.fg, pair.bg);
  const grade = ratio >= 7.0 ? 'AAA' : ratio >= 4.5 ? 'AA / AAA-Large' : 'FAIL';
  const ok = ratio >= pair.min;
  if (!ok) failed = true;
  console.log(`${ok ? '✓' : '✗'} ${pair.label}: ${ratio.toFixed(2)}:1 [${grade}]`);
}

if (failed) {
  process.exit(1);
}
