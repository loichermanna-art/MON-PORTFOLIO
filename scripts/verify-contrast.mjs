#!/usr/bin/env node
/**
 * verify-contrast.mjs
 * Vérification mathématique WCAG 2.2 de la palette « MIDNIGHT BLUE »
 * (Section 4 du Master Prompt & REFERENCE_HERO_PORTFOLIO.png).
 */

const PALETTE = {
  midnightNavy: '#071426',  // Bleu nuit (fond principal & béton d'ombre)
  deepBlue: '#102747',      // Bleu profond (volumes architecturaux & surfaces)
  steelBlue: '#174477',     // Bleu acier (structures & bordures actives)
  luminousBlue: '#76A9E8',  // Bleu lumineux (accents, « Impact. », indicateurs)
  coldWhite: '#E8EDF5',     // Blanc froid (texte courant & sous-titres clairs)
  mutedIce: '#A9BCD6',      // Gris-bleu froid (métadonnées & labels secondaires)
  pureWhite: '#FFFFFF',     // Blanc pur (titres majeurs & ouvertures lumineuses)
};

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]) {
  const norm = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * norm[0] + 0.7152 * norm[1] + 0.0722 * norm[2];
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(hexToRgb(fg));
  const l2 = relativeLuminance(hexToRgb(bg));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const PAIRS = [
  ['pureWhite (#FFFFFF)', PALETTE.pureWhite, 'midnightNavy (#071426)', PALETTE.midnightNavy, 4.5],
  ['coldWhite (#E8EDF5)', PALETTE.coldWhite, 'midnightNavy (#071426)', PALETTE.midnightNavy, 4.5],
  ['mutedIce (#A9BCD6)', PALETTE.mutedIce, 'midnightNavy (#071426)', PALETTE.midnightNavy, 4.5],
  ['luminousBlue (#76A9E8)', PALETTE.luminousBlue, 'midnightNavy (#071426)', PALETTE.midnightNavy, 4.5],
  ['pureWhite (#FFFFFF)', PALETTE.pureWhite, 'deepBlue (#102747)', PALETTE.deepBlue, 4.5],
  ['coldWhite (#E8EDF5)', PALETTE.coldWhite, 'deepBlue (#102747)', PALETTE.deepBlue, 4.5],
  ['luminousBlue (#76A9E8)', PALETTE.luminousBlue, 'deepBlue (#102747)', PALETTE.deepBlue, 4.5],
  ['pureWhite (#FFFFFF)', PALETTE.pureWhite, 'steelBlue (#174477)', PALETTE.steelBlue, 4.5],
];

let failed = 0;
console.log('Contrôle WCAG 2.2 — Direction Artistique « MIDNIGHT BLUE »\n');
for (const [fgName, fg, bgName, bg, min] of PAIRS) {
  const ratio = contrastRatio(fg, bg);
  const ok = ratio >= min;
  if (!ok) failed++;
  const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA ' : 'FAIL';
  console.log(
    `${`${fgName} / ${bgName}`.padEnd(50)} ${ratio.toFixed(2).padStart(6)}:1  [${grade}]`
  );
}

if (failed > 0) {
  console.error(`\nÉCHEC : ${failed} paire(s) sous le seuil WCAG 2.2.`);
  process.exit(1);
}
console.log('\nSUCCÈS : 100 % des paires Midnight Blue respectent WCAG 2.2 AA/AAA.');
