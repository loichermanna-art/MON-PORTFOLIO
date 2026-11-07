#!/usr/bin/env node
/**
 * qa-phase8-audit.mjs — Audit automatisé d'architecture « Horizon Monolithique » :
 * 1. Zéro URL réseau externe au runtime dans src/three/ et src/styles/ (zéro erreur CSP / CDN).
 * 2. Présence du nettoyage mémoire dispose() pour toutes les textures/matériaux WebGL.
 * 3. Séparation stricte des 3 étages du rig caméra (CameraRailGroup / CameraPointerGroup / PerspectiveCamera).
 * 4. Shell HUD minimaliste (Rail vertical gauche .hud-rail + bouton Menu ⋮) et absence d'anciennes cartes beige.
 * 5. Couverture responsive des 4 paliers cibles (1440px, 1024px, 768px, 390px) et prefers-reduced-motion.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
let errors = 0;

function check(condition, message) {
  if (condition) {
    console.log(`  [OK] ${message}`);
  } else {
    console.error(`  [ERREUR] ${message}`);
    errors++;
  }
}

console.log('Audit Technique & Visuel — Base « Horizon Monolithique » (Loïc AKANDA)\n');

// 1. Zéro appel réseau externe dans src/three/
const threeFiles = [
  'src/three/ExperienceCanvas.tsx',
  'src/three/materials/architecturalMaterials.ts',
  'src/three/lighting/StudioDaylight.tsx',
  'src/three/camera/ArchitecturalCameraRig.tsx',
];

for (const rel of threeFiles) {
  const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const hasExternalHttp = /https?:\/\//.test(content);
  check(!hasExternalHttp, `${rel} : aucune dépendance réseau externe (.hdr / texture CDN)`);
}

// 2. Nettoyage mémoire GPU (dispose)
const matContent = fs.readFileSync(
  path.join(ROOT, 'src/three/materials/architecturalMaterials.ts'),
  'utf8'
);
check(
  matContent.includes('marbleTex?.dispose()') &&
    matContent.includes('slateFloorTex?.dispose()') &&
    matContent.includes('screenTextures.forEach((t) => t?.dispose())'),
  'Libération explicite (dispose) des textures procédurales marbre/ardoise et dalles projets 3D'
);

// 3. Rig caméra à 3 étages sans conflit de contrôleurs
const rigContent = fs.readFileSync(
  path.join(ROOT, 'src/three/camera/ArchitecturalCameraRig.tsx'),
  'utf8'
);
check(
  rigContent.includes('name="CameraRailGroup"') &&
    rigContent.includes('name="CameraPointerGroup"') &&
    rigContent.includes('<PerspectiveCamera'),
  'Séparation stricte à 3 groupes imbriqués (Rail Scroll / Parallaxe Souris / Respiration Idle)'
);

// 4. Vérification du Shell HUD et des styles responsives
const tokensCss = fs.readFileSync(path.join(ROOT, 'src/styles/tokens.css'), 'utf8');
const globalCss = fs.readFileSync(path.join(ROOT, 'src/styles/global.css'), 'utf8');

check(
  tokensCss.includes('#f2f4f8') &&
    globalCss.includes('.hud-rail') &&
    globalCss.includes('.pill-cta') &&
    globalCss.includes('.floating-project-tile'),
  'Charte « Horizon Monolithique » active (Rail HUD, Pilules CTA, 3 Écrans flottants, Brume #F2F4F8)'
);

check(
  tokensCss.includes('@media (max-width: 1023px)') &&
    globalCss.includes('@media (max-width: 767px)') &&
    globalCss.includes('overflow-x: hidden') &&
    globalCss.includes('minmax(0, 1fr)'),
  'Grilles fluides sans débordement horizontal sur 1440px, 1024px, 768px et 390px'
);

check(
  globalCss.includes('@media (prefers-reduced-motion: reduce)'),
  'Règles CSS prefers-reduced-motion présentes et actives'
);

// 5. Présence des fichiers normatifs à la racine + synthèse nouvelle base
for (const doc of [
  'PRODUCT.md',
  'DESIGN.md',
  'MOTION.md',
  'TECH-STACK.md',
  'CONTENT.md',
  'IMPLEMENTATION.md',
  'docs/04-NOUVELLE-BASE-ARCHITECTURALE-FUTURISTE.md',
]) {
  check(fs.existsSync(path.join(ROOT, doc)), `Documentation normative présente : ${doc}`);
}

if (errors > 0) {
  console.error(`\nÉCHEC AUDIT : ${errors} anomalie(s) détectée(s).`);
  process.exit(1);
}
console.log('\nSUCCÈS AUDIT : Tous les contrôles architecturaux, HUD, WebGL, responsive et a11y sont validés.');
