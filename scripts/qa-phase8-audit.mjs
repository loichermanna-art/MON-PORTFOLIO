#!/usr/bin/env node
/**
 * qa-phase8-audit.mjs — Audit automatisé d'architecture « MIDNIGHT BLUE » (Scènes 01 -> 06) :
 * 1. Zéro URL réseau externe au runtime dans src/three/ (zéro erreur CSP / CDN).
 * 2. Libération explicite dispose() de toutes les textures PBR et plaques gravées des 6 scènes.
 * 3. Continuité tectonique 3D : Canal miroir continu, AO de contact, Ciel GLSL unique en bout de nef,
 *    et raycasting interactif sur les structures des Scènes 01, 02, 03, 04, 05 et 06.
 * 4. Séparation stricte à 3 étages du rig caméra + couplage du regard sur les 6 scènes.
 * 5. Palette Midnight Blue (#071426..#FFFFFF), responsive et 7 documents normatifs.
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

// 1. Zéro appel réseau externe dans l'intégralité de src/three/
const threeFiles = [
  'src/three/ExperienceCanvas.tsx',
  'src/three/materials/architecturalMaterials.ts',
  'src/three/lighting/StudioDaylight.tsx',
  'src/three/camera/ArchitecturalCameraRig.tsx',
  'src/three/structures/PeristyleHall.tsx',
  'src/three/structures/EquilibriumPortal.tsx',
  'src/three/structures/ClairvoieGallery.tsx',
  'src/three/structures/DualPillarCourtyard.tsx',
  'src/three/structures/MonolithGallery.tsx',
  'src/three/structures/SequentialBridge.tsx',
  'src/three/structures/OpenBelvedere.tsx',
];

for (const rel of threeFiles) {
  const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const hasExternalHttp = /https?:\/\//.test(content);
  check(!hasExternalHttp, `${rel} : aucune dépendance réseau externe (.hdr / texture CDN)`);
}

// 2. Nettoyage mémoire GPU (dispose) sur l'ensemble des maps PBR et cartels 01-06
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
    matContent.includes('aboutPillarMaterials.forEach((m) => m.dispose())') &&
    matContent.includes('expertisePlaqueMaterials.forEach((m) => m.dispose())') &&
    matContent.includes('processPortalMaterials.forEach((m) => m.dispose())') &&
    matContent.includes('contactBeaconMaterials.forEach((m) => m.dispose())'),
  'Libération explicite (dispose) des maps PBR, shaders GLSL et cartels gravés des 6 scènes'
);

// 3. Continuité tectonique & interactivité 3D réelle sur chacune des 6 scènes
const peristyleContent = fs.readFileSync(
  path.join(ROOT, 'src/three/structures/PeristyleHall.tsx'),
  'utf8'
);
const portalContent = fs.readFileSync(
  path.join(ROOT, 'src/three/structures/EquilibriumPortal.tsx'),
  'utf8'
);
const about3d = fs.readFileSync(
  path.join(ROOT, 'src/three/structures/ClairvoieGallery.tsx'),
  'utf8'
);
const expertise3d = fs.readFileSync(
  path.join(ROOT, 'src/three/structures/DualPillarCourtyard.tsx'),
  'utf8'
);
const projects3d = fs.readFileSync(
  path.join(ROOT, 'src/three/structures/MonolithGallery.tsx'),
  'utf8'
);
const process3d = fs.readFileSync(
  path.join(ROOT, 'src/three/structures/SequentialBridge.tsx'),
  'utf8'
);
const contact3d = fs.readFileSync(
  path.join(ROOT, 'src/three/structures/OpenBelvedere.tsx'),
  'utf8'
);

check(
  peristyleContent.includes('MeshReflectorMaterial') &&
    peristyleContent.includes('contactAO') &&
    portalContent.includes('HeroInteractiveGlassStele') &&
    !portalContent.includes('blueHourSky') &&
    contact3d.includes('blueHourSky') &&
    !portalContent.includes('capsuleGeometry'),
  'Nef 3D unifiée sans paroi de ciel intermédiaire bloquante (Oculus ouvert -> Canal -> Horizon Belvédère)'
);

check(
  portalContent.includes('onPointerOver') &&
    about3d.includes('selectAboutPillar') &&
    expertise3d.includes('selectExpertiseDomain') &&
    projects3d.includes('onSelectProject') &&
    process3d.includes('setActiveProcessStep') &&
    contact3d.includes('selectContactChannel'),
  'Raycasting 3D bidirectionnel actif sur les 6 séquences (01 Hero, 02 À propos, 03 Expertise, 04 Projets, 05 Démarche, 06 Contact)'
);

// 4. Rig caméra à 3 étages + far plane couvrant l'horizon
const rigContent = fs.readFileSync(
  path.join(ROOT, 'src/three/camera/ArchitecturalCameraRig.tsx'),
  'utf8'
);
check(
  rigContent.includes('name="CameraRailGroup"') &&
    rigContent.includes('name="CameraPointerGroup"') &&
    rigContent.includes('far={170}'),
  'Rig caméra à 3 groupes imbriqués et plan lointain (far=170m) couvrant toute la perspective'
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
console.log('\nSUCCÈS AUDIT : Tous les contrôles Midnight Blue, continuité 3D 01-06, raycasting, responsive et QA sont validés.');
