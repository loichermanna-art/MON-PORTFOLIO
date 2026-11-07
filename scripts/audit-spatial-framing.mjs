#!/usr/bin/env node
/**
 * audit-spatial-framing.mjs — Audit Mathématique & Spatial Section par Section (01 -> 06)
 * Reproduit à l'identique la matrice PerspectiveCamera Three.js et les courbes CatmullRomCurve3
 * de ArchitecturalCameraRig.tsx pour démontrer objectivement :
 * 1. Zéro collision murale sur 240 pas continus (franchissement réel au cœur de l'Oculus z=-6.2..-4.15).
 * 2. Visibilité continue de l'horizon d'heure bleue (z=-121.5m < far=170m, 0 mur de ciel intermédiaire).
 * 3. Cadrage écran exact [x%, y%] des monuments 3D des 6 scènes dans la fenêtre ouverte droite/centre-droit,
 *    sans recouvrement avec la colonne éditoriale gauche (mur béton sombre).
 */

import * as THREE from 'three';

const positionCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-0.65, 1.85, 11.4),
    new THREE.Vector3(1.35, 1.98, -5.1),
    new THREE.Vector3(-0.85, 1.96, -12.2),
    new THREE.Vector3(-0.95, 2.06, -27.8),
    new THREE.Vector3(-1.05, 1.98, -48.6),
    new THREE.Vector3(-0.45, 2.06, -59.5),
    new THREE.Vector3(-0.95, 2.14, -68.8),
    new THREE.Vector3(-0.85, 1.92, -91.2),
  ],
  false,
  'centripetal'
);

const targetCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(1.55, 2.18, -2.4),
    new THREE.Vector3(2.05, 2.05, -16.8),
    new THREE.Vector3(1.55, 1.96, -22.8),
    new THREE.Vector3(1.45, 2.02, -39.5),
    new THREE.Vector3(1.35, 1.95, -61.8),
    new THREE.Vector3(1.45, 2.1, -72.0),
    new THREE.Vector3(1.15, 2.28, -82.5),
    new THREE.Vector3(1.45, 2.02, -103.5),
  ],
  false,
  'centripetal'
);

let errors = 0;
function assert(cond, msg) {
  if (cond) {
    console.log(`  [OK] ${msg}`);
  } else {
    console.error(`  [ERREUR] ${msg}`);
    errors++;
  }
}

console.log('Audit Spatial & Cadrage 3D Section par Section (01 -> 06)\n');

let minLeftWallClearance = Infinity;
let minOculusRadialClearance = Infinity;
let maxHorizonDist = 0;

const oculusCenter = new THREE.Vector3(2.25, 2.85, -5.18);
const oculusRadius = 3.25;
const horizonPos = new THREE.Vector3(1.8, 6.2, -121.5);

for (let i = 0; i <= 240; i++) {
  const t = i / 240;
  const p = positionCurve.getPointAt(t);

  const leftClearance = p.x - -4.25;
  if (leftClearance < minLeftWallClearance) minLeftWallClearance = leftClearance;

  if (p.z <= -4.1 && p.z >= -6.3) {
    const radialDist = Math.hypot(p.x - oculusCenter.x, p.y - oculusCenter.y);
    const clearance = oculusRadius - radialDist;
    if (clearance < minOculusRadialClearance) minOculusRadialClearance = clearance;
  }

  const distToHorizon = p.distanceTo(horizonPos);
  if (distToHorizon > maxHorizonDist) maxHorizonDist = distToHorizon;
}

assert(
  minLeftWallClearance > 3.0,
  `Dégagement continu vis-à-vis du mur porteur gauche : min = ${minLeftWallClearance.toFixed(2)} m (> 3.00 m)`
);
assert(
  minOculusRadialClearance > 1.5,
  `Franchissement physique centré dans le tambour de l'Oculus (r=3.25m) : marge radiale min = ${minOculusRadialClearance.toFixed(2)} m (0 collision)`
);
assert(
  maxHorizonDist < 168.0,
  `Visibilité continue de l'horizon d'heure bleue depuis le Hero (dist max = ${maxHorizonDist.toFixed(1)} m < far = 170 m)`
);

const camera = new THREE.PerspectiveCamera(38, 1440 / 900, 0.2, 170);
const sceneStops = [
  {
    id: '01 · HERO',
    t: 0.0,
    landmarkName: 'Oculus monumental + Canal d’eau',
    worldPoint: new THREE.Vector3(2.25, 2.65, -6.2),
    minScreenX: 46,
    maxScreenX: 88,
  },
  {
    id: '02 · À PROPOS',
    t: 0.24,
    landmarkName: 'Stèle centrale de la Claire-voie (INP-HB)',
    worldPoint: new THREE.Vector3(2.95, 1.96, -22.8),
    minScreenX: 50,
    maxScreenX: 88,
  },
  {
    id: '03 · EXPERTISE',
    t: 0.4,
    landmarkName: 'Cour des 4 Piliers Muséaux',
    worldPoint: new THREE.Vector3(2.8, 2.15, -39.5),
    minScreenX: 50,
    maxScreenX: 88,
  },
  {
    id: '04 · PROJETS',
    t: 0.61,
    landmarkName: 'Galerie des 3 Chevalets (LAURA HOUSE · SassySkin · EtuCo)',
    worldPoint: new THREE.Vector3(2.75, 2.08, -61.8),
    minScreenX: 50,
    maxScreenX: 88,
  },
  {
    id: '05 · MA DÉMARCHE',
    t: 0.82,
    landmarkName: 'Perspective des 6 Portiques Séquentiels',
    worldPoint: new THREE.Vector3(2.25, 2.4, -83.1),
    minScreenX: 48,
    maxScreenX: 86,
  },
  {
    id: '06 · CONTACT',
    t: 0.99,
    landmarkName: 'Belvédère ouvert & Pupitres de Seuil sur l’Horizon',
    worldPoint: new THREE.Vector3(2.75, 1.75, -100.8),
    minScreenX: 48,
    maxScreenX: 88,
  },
];

console.log('\nProjection écran Desktop (1440×900, FOV 38°) — Séparation Texte Gauche / Architecture 3D Droite :');
for (const stop of sceneStops) {
  const pos = positionCurve.getPointAt(stop.t);
  const target = targetCurve.getPointAt(stop.t);
  camera.position.copy(pos);
  camera.lookAt(target);
  camera.updateMatrixWorld(true);
  camera.updateProjectionMatrix();

  const ndc = stop.worldPoint.clone().project(camera);
  const screenX = (ndc.x * 0.5 + 0.5) * 100;
  const screenY = (-ndc.y * 0.5 + 0.5) * 100;
  const inFront = ndc.z > -1 && ndc.z < 1;

  assert(
    inFront && screenX >= stop.minScreenX && screenX <= stop.maxScreenX && screenY >= 15 && screenY <= 82,
    `${stop.id.padEnd(16)} -> ${stop.landmarkName} projeté à [X=${screenX.toFixed(1)}%, Y=${screenY.toFixed(1)}%] (camZ=${pos.z.toFixed(1)}m)`
  );
}

if (errors > 0) {
  console.error(`\nÉCHEC AUDIT SPATIAL : ${errors} erreur(s).`);
  process.exit(1);
}
console.log('\nSUCCÈS AUDIT SPATIAL : Les 6 scènes forment une trajectoire 3D continue sans collision ni occultation UI.');
