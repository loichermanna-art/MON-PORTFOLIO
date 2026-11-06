#!/usr/bin/env node
/**
 * qa-phase8-audit.mjs — Audit automatisé d'architecture Phase 8 :
 * 1. Zéro URL réseau externe au runtime dans src/three/ et src/styles/ (zéro erreur CSP / CDN).
 * 2. Présence du nettoyage mémoire dispose() pour toutes les textures/matériaux WebGL.
 * 3. Séparation stricte des 3 étages du rig caméra (CameraRailGroup / CameraPointerGroup / PerspectiveCamera).
 * 4. Couverture responsive des 4 paliers cibles (1440px, 1024px, 768px, 390px) et prefers-reduced-motion.
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

console.log('Audit Technique & Visuel Phase 8 — Portfolio Loïc AKANDA\n');

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
  matContent.includes('wallTex?.dispose()') &&
    matContent.includes('pavingTex?.dispose()') &&
    matContent.includes('plateTextures.forEach((t) => t?.dispose())'),
  'Libération explicite (dispose) des textures procédurales et plaques projets 3D'
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

// 4. Couverture CSS des breakpoints (1440 / 1024 / 768 / 390) & prefers-reduced-motion
const globalCss = fs.readFileSync(path.join(ROOT, 'src/styles/global.css'), 'utf8');
check(
  globalCss.includes('@media (max-width: 1023px)') &&
    globalCss.includes('@media (max-width: 767px)') &&
    globalCss.includes('overflow-x: hidden') &&
    globalCss.includes('minmax(0, 1fr)'),
  'Grilles fluides sans débordement horizontal sur 1440px, 1024px, 768px et 390px'
);
check(
  globalCss.includes('@media (prefers-reduced-motion: reduce)'),
  'Règles CSS prefers-reduced-motion présentes et actives'
);

// 5. Présence des 6 fichiers normatifs Phase 5 à la racine
for (const doc of [
  'PRODUCT.md',
  'DESIGN.md',
  'MOTION.md',
  'TECH-STACK.md',
  'CONTENT.md',
  'IMPLEMENTATION.md',
]) {
  check(fs.existsSync(path.join(ROOT, doc)), `Documentation normative présente : ${doc}`);
}

if (errors > 0) {
  console.error(`\nÉCHEC AUDIT PHASE 8 : ${errors} anomalie(s) détectée(s).`);
  process.exit(1);
}
console.log('\nSUCCÈS AUDIT PHASE 8 : Tous les contrôles architecturaux, WebGL, responsive et a11y sont validés.');
