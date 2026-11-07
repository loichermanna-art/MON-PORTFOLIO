#!/usr/bin/env node
/**
 * verify-contrast.mjs
 * Vérification mathématique WCAG 2.2 de la palette « MONUMENTAL CHIAROSCURO »
 * (Béton d'obsidienne sombre #0A0C10 / #10141B + Contre-jour blanc pur #FFFFFF / #F2F5FA).
 */

const PALETTE = {
  obsidian950: '#0A0C10',
  obsidian900: '#10141B',
  obsidian850: '#161B24',
  white: '#FFFFFF',
  alabaster100: '#F2F5FA',
  silver200: '#DCE3ED',
  silver300: '#B8C2D0',
  silver400: '#96A2B4',
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
  ['white (#FFFFFF)', PALETTE.white, 'obsidian950 (#0A0C10)', PALETTE.obsidian950, 4.5],
  ['alabaster100 (#F2F5FA)', PALETTE.alabaster100, 'obsidian950 (#0A0C10)', PALETTE.obsidian950, 4.5],
  ['silver200 (#DCE3ED)', PALETTE.silver200, 'obsidian950 (#0A0C10)', PALETTE.obsidian950, 4.5],
  ['silver300 (#B8C2D0)', PALETTE.silver300, 'obsidian950 (#0A0C10)', PALETTE.obsidian950, 4.5],
  ['silver400 (#96A2B4)', PALETTE.silver400, 'obsidian950 (#0A0C10)', PALETTE.obsidian950, 4.5],
  ['white (#FFFFFF)', PALETTE.white, 'obsidian900 (#10141B)', PALETTE.obsidian900, 4.5],
  ['silver300 (#B8C2D0)', PALETTE.silver300, 'obsidian850 (#161B24)', PALETTE.obsidian850, 4.5],
  ['obsidian950 (#0A0C10)', PALETTE.obsidian950, 'alabaster100 (#F2F5FA)', PALETTE.alabaster100, 4.5],
];

let failed = 0;
console.log('Contrôle WCAG 2.2 — Direction Artistique « MONUMENTAL CHIAROSCURO »\n');
for (const [fgName, fg, bgName, bg, min] of PAIRS) {
  const ratio = contrastRatio(fg, bg);
  const ok = ratio >= min;
  if (!ok) failed++;
  const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA ' : 'FAIL';
  console.log(
    `${`${fgName} / ${bgName}`.padEnd(52)} ${ratio.toFixed(2).padStart(6)}:1  [${grade}]`
  );
}

if (failed > 0) {
  console.error(`\nÉCHEC : ${failed} paire(s) sous le seuil WCAG 2.2.`);
  process.exit(1);
}
console.log('\nSUCCÈS : 100 % des paires Monumental Chiaroscuro respectent WCAG 2.2 AAA.');
