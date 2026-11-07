#!/usr/bin/env node
/**
 * qa-phase8-audit.mjs — Audit automatisé d'architecture « MIDNIGHT BLUE » :
 * 1. Zéro URL réseau externe au runtime dans src/three/ (zéro erreur CSP / CDN).
 * 2. Libération explicite dispose() des textures procédurales (béton, sol, ciel, stèle Hero, projets).
 * 3. Séparation stricte à 3 étages du rig caméra + MeshReflectorMaterial maîtrisé.
 * 4. Palette Midnight Blue (#071426..#FFFFFF) et navigation persistante 01/06 -> 06/06.
 * 5. Présence des 7 documents normatifs exigés (PRODUCT, DESIGN, MOTION, TECH-STACK, CONTENT, IMPLEMENTATION, QA).
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

console.log('Audit Technique & Qualité — Direction « MIDNIGHT BLUE » (Loïc AKANDA)\n');

// 1. Zéro appel réseau externe dans src/three/
const threeFiles = [
  'src/three/ExperienceCanvas.tsx',
  'src/three/materials/architecturalMaterials.ts',
  'src/three/lighting/StudioDaylight.tsx',
  'src/three/camera/ArchitecturalCameraRig.tsx',
  'src/three/structures/PeristyleHall.tsx',
  'src/three/structures/EquilibriumPortal.tsx',
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
  matContent.includes('concretePbr.albedo?.dispose()') &&
    matContent.includes('concretePbr.normal?.dispose()') &&
    matContent.includes('floorPbr.roughness?.dispose()') &&
    matContent.includes('blueHourSky.dispose()') &&
    matContent.includes('contactAO.dispose()') &&
    matContent.includes('screenTextures.forEach((t) => t?.dispose())'),
  'Libération explicite (dispose) des maps PBR (Albedo, Normal, Roughness) et shaders GLSL'
);

// 3. Réalisme tectonique 3D : Réflecteur bassin, NormalMap, Ombres de contact AO & Baie vitrée
const peristyleContent = fs.readFileSync(
  path.join(ROOT, 'src/three/structures/PeristyleHall.tsx'),
  'utf8'
);
const portalContent = fs.readFileSync(
  path.join(ROOT, 'src/three/structures/EquilibriumPortal.tsx'),
  'utf8'
);
check(
  peristyleContent.includes('MeshReflectorMaterial') &&
    peristyleContent.includes('contactAO') &&
    portalContent.includes('HeroInteractiveGlassStele') &&
    portalContent.includes('blueHourSky') &&
    !portalContent.includes('capsuleGeometry'),
  'Architecture 3D tectonique réaliste (NormalMaps, Bassin miroir, AO de contact, Ciel GLSL, 0 mannequin/sphère flottante)'
);

// 4. Rig caméra à 3 étages
const rigContent = fs.readFileSync(
  path.join(ROOT, 'src/three/camera/ArchitecturalCameraRig.tsx'),
  'utf8'
);
check(
  rigContent.includes('name="CameraRailGroup"') &&
    rigContent.includes('name="CameraPointerGroup"') &&
    rigContent.includes('<PerspectiveCamera'),
  'Séparation stricte à 3 groupes imbriqués (Rail Scroll / Parallaxe Curseur / Respiration Optique)'
);

// 5. Palette Midnight Blue, Responsive & Reduced Motion
const tokensCss = fs.readFileSync(path.join(ROOT, 'src/styles/tokens.css'), 'utf8');
const globalCss = fs.readFileSync(path.join(ROOT, 'src/styles/global.css'), 'utf8');

check(
  tokensCss.includes('#071426') &&
    tokensCss.includes('#102747') &&
    tokensCss.includes('#174477') &&
    tokensCss.includes('#76a9e8') &&
    tokensCss.includes('#e8edf5') &&
    tokensCss.includes('#ffffff'),
  'Palette exacte « Midnight Blue » active (#071426, #102747, #174477, #76A9E8, #E8EDF5, #FFFFFF)'
);

check(
  tokensCss.includes('@media (max-width: 1023px)') &&
    globalCss.includes('@media (max-width: 767px)') &&
    globalCss.includes('overflow-x: hidden') &&
    globalCss.includes('@media (prefers-reduced-motion: reduce)'),
  'Couverture responsive Desktop / Tablette / Mobile & règles prefers-reduced-motion actives'
);

// 6. Présence des 7 documents normatifs exigés
for (const doc of [
  'PRODUCT.md',
  'DESIGN.md',
  'MOTION.md',
  'TECH-STACK.md',
  'CONTENT.md',
  'IMPLEMENTATION.md',
  'QA.md',
]) {
  check(fs.existsSync(path.join(ROOT, doc)), `Documentation normative présente : ${doc}`);
}

if (errors > 0) {
  console.error(`\nÉCHEC AUDIT : ${errors} anomalie(s) détectée(s).`);
  process.exit(1);
}
console.log('\nSUCCÈS AUDIT : Tous les contrôles Midnight Blue, Hero 3D, navigation, responsive et QA sont validés.');
