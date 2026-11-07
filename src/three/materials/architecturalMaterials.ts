import * as THREE from 'three';

export interface ArchitecturalMaterialSet {
  darkConcrete: THREE.MeshStandardMaterial;
  deepConcrete: THREE.MeshStandardMaterial;
  wetMirrorFallback: THREE.MeshStandardMaterial;
  brushedDarkSteel: THREE.MeshStandardMaterial;
  specularChrome: THREE.MeshStandardMaterial;
  architecturalGlass: THREE.MeshStandardMaterial;
  luminousEdge: THREE.MeshBasicMaterial;
  luminousCore: THREE.MeshBasicMaterial;
  skyApertureMaterial: THREE.MeshBasicMaterial;
  distantTowerMaterial: THREE.MeshStandardMaterial;
  silhouetteMaterial: THREE.MeshStandardMaterial;
  heroSteleFaceMaterial: THREE.MeshStandardMaterial;
  projectPlateMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ];
  dispose: () => void;
}

/**
 * Texture procédurale de béton architectural coffré « Midnight Blue »
 * (grain minéral fin, joints de banches et micro-reliefs réalistes, 0 appel réseau).
 */
function createMidnightConcreteTexture(options: {
  size?: number;
  baseRgb: [number, number, number];
  jointAlpha: number;
  repeatX: number;
  repeatY: number;
}): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const size = options.size ?? 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const img = ctx.createImageData(size, size);
  const data = img.data;
  let seed = 48271;
  const nextRand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const [br, bg, bb] = options.baseRgb;
  for (let y = 0; y < size; y++) {
    const streak = Math.sin((y / size) * Math.PI * 14) * 2.2;
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const grain = (nextRand() - 0.5) * 11 + streak;
      data[i] = Math.max(0, Math.min(255, br + grain));
      data[i + 1] = Math.max(0, Math.min(255, bg + grain * 1.05));
      data[i + 2] = Math.max(0, Math.min(255, bb + grain * 1.15));
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Joints de coffrage architecturaux
  ctx.strokeStyle = `rgba(4, 10, 20, ${options.jointAlpha})`;
  ctx.lineWidth = 1.5;
  const step = size / 4;
  for (let p = step; p < size; p += step) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  // Légers reflets d'arête bleutés le long des joints
  ctx.strokeStyle = `rgba(118, 169, 232, ${options.jointAlpha * 0.28})`;
  ctx.lineWidth = 1;
  for (let p = step; p < size; p += step) {
    ctx.beginPath();
    ctx.moveTo(0, p + 1.5);
    ctx.lineTo(size, p + 1.5);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(options.repeatX, options.repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Ciel atmosphérique froid & nuées volumétriques derrière l'oculus monumental.
 */
function createHorizonSkyTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = 1024;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0.0, '#102747');
  grad.addColorStop(0.28, '#234F87');
  grad.addColorStop(0.58, '#6CA2E4');
  grad.addColorStop(0.8, '#CFE3FA');
  grad.addColorStop(1.0, '#F3F8FF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Halo lumineux principal dans l'axe de l'oculus
  const sunGlow = ctx.createRadialGradient(w * 0.56, h * 0.62, 20, w * 0.56, h * 0.62, w * 0.48);
  sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
  sunGlow.addColorStop(0.45, 'rgba(210, 232, 255, 0.48)');
  sunGlow.addColorStop(1, 'rgba(118, 169, 232, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, w, h);

  // Strates nuageuses atmosphériques douces
  const clouds: Array<[number, number, number, number]> = [
    [0.28, 0.68, 220, 0.34],
    [0.44, 0.72, 260, 0.42],
    [0.68, 0.66, 240, 0.36],
    [0.82, 0.74, 190, 0.3],
    [0.35, 0.56, 170, 0.22],
  ];
  for (const [cx, cy, radius, alpha] of clouds) {
    const cg = ctx.createRadialGradient(w * cx, h * cy, 10, w * cx, h * cy, radius);
    cg.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    cg.addColorStop(0.55, `rgba(186, 214, 248, ${alpha * 0.5})`);
    cg.addColorStop(1, 'rgba(23, 68, 119, 0)');
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, w, h);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Gravure architecturale haute définition de la stèle de verre droite du Hero
 * (« AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION » — fidèle à REFERENCE_HERO_PORTFOLIO.png).
 */
function createHeroGlassSteleTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = 1024;
  const h = 1152;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Fond verre bleuté sombre semi-translucide
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, 'rgba(16, 44, 82, 0.46)');
  bgGrad.addColorStop(0.5, 'rgba(10, 28, 54, 0.62)');
  bgGrad.addColorStop(1, 'rgba(7, 20, 38, 0.76)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Reflet diagonal subtil de verre architectural
  const sheen = ctx.createLinearGradient(0, 0, w * 0.85, h * 0.65);
  sheen.addColorStop(0, 'rgba(180, 216, 255, 0.20)');
  sheen.addColorStop(0.32, 'rgba(118, 169, 232, 0.05)');
  sheen.addColorStop(1, 'rgba(7, 20, 38, 0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // Meneaux verticaux structurels fins (gauche)
  ctx.strokeStyle = 'rgba(156, 198, 250, 0.24)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(148, 40);
  ctx.lineTo(148, h - 40);
  ctx.moveTo(264, 140);
  ctx.lineTo(264, h - 60);
  ctx.stroke();

  // Inscriptions gravées dans le verre
  const labels = ['A U D I T', 'F I N A N C E', 'D É V E L O P P E M E N T', 'I N N O V A T I O N'];
  const startY = 390;
  const rowGap = 118;

  ctx.textBaseline = 'middle';
  labels.forEach((label, index) => {
    const y = startY + index * rowGap;
    ctx.fillStyle = 'rgba(232, 237, 245, 0.92)';
    ctx.font = '500 33px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    ctx.fillText(label, 336, y);

    // Repère fin à gauche
    ctx.fillStyle = 'rgba(118, 169, 232, 0.68)';
    ctx.font = '400 20px monospace';
    ctx.fillText(`0${index + 1}`, 282, y);
  });

  // Règle architecturale inférieure et croix de visée (comme dans la référence)
  const crossY = startY + labels.length * rowGap + 22;
  ctx.strokeStyle = 'rgba(180, 214, 255, 0.42)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(336, crossY);
  ctx.lineTo(548, crossY);
  ctx.moveTo(442, crossY - 26);
  ctx.lineTo(442, crossY + 46);
  ctx.stroke();

  // Biseau périmétrique lumineux
  ctx.strokeStyle = 'rgba(162, 206, 255, 0.65)';
  ctx.lineWidth = 5;
  ctx.strokeRect(4, 4, w - 8, h - 8);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Stèles architecturales 3D des 3 projets authentiques (0 fausse capture d'écran :
 * fiches signalétiques architecturales Midnight Blue).
 */
function createProjectMonolithTexture(projectIndex: 0 | 1 | 2): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = 1024;
  const h = 640;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#102747');
  grad.addColorStop(1, '#071426');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(118, 169, 232, 0.55)';
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  const specs = [
    {
      num: 'PROJET 01',
      title: 'LAURA HOUSE',
      sub: 'BILLETTERIE ÉVÉNEMENTIELLE & BILLETS QR HD',
      stack: 'VITE · NODE.JS · EXPORT PNG QR',
    },
    {
      num: 'PROJET 02',
      title: 'SassySkin',
      sub: 'SITE WEB COMMERCIAL — SOINS & BEAUTÉ',
      stack: 'FRONTEND RESPONSIVE · PARCOURS VENTE',
    },
    {
      num: 'PROJET 03',
      title: 'EtuCo',
      sub: 'ENVIRONNEMENT NUMÉRIQUE — CLUB ÉTUDES-CONSEILS',
      stack: 'ARCHITECTURE PRODUIT · COORDINATION CLUB',
    },
  ][projectIndex];

  ctx.fillStyle = '#76A9E8';
  ctx.font = '500 24px monospace';
  ctx.fillText(specs.num, 72, 110);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 68px system-ui, sans-serif';
  ctx.fillText(specs.title, 72, 235);

  ctx.fillStyle = '#E8EDF5';
  ctx.font = '400 28px system-ui, sans-serif';
  ctx.fillText(specs.sub, 72, 310);

  ctx.strokeStyle = 'rgba(118, 169, 232, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(72, 390);
  ctx.lineTo(w - 72, 390);
  ctx.stroke();

  ctx.fillStyle = '#76A9E8';
  ctx.font = '500 24px monospace';
  ctx.fillText(specs.stack, 72, 465);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 24px system-ui, sans-serif';
  ctx.fillText('SÉLECTIONNER POUR OUVRIR L’ÉTUDE DE CAS →', 72, 545);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createArchitecturalMaterials(): ArchitecturalMaterialSet {
  const concreteTex = createMidnightConcreteTexture({
    size: 512,
    baseRgb: [14, 32, 58],
    jointAlpha: 0.42,
    repeatX: 2,
    repeatY: 2,
  });

  const floorTex = createMidnightConcreteTexture({
    size: 512,
    baseRgb: [8, 20, 38],
    jointAlpha: 0.36,
    repeatX: 12,
    repeatY: 32,
  });

  const skyTex = createHorizonSkyTexture();
  const heroSteleTex = createHeroGlassSteleTexture();

  const screenTextures = [
    createProjectMonolithTexture(0),
    createProjectMonolithTexture(1),
    createProjectMonolithTexture(2),
  ] as const;

  const darkConcrete = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#132C50'),
    map: concreteTex ?? undefined,
    bumpMap: concreteTex ?? undefined,
    bumpScale: 0.012,
    roughness: 0.72,
    metalness: 0.12,
    envMapIntensity: 1.05,
  });

  const deepConcrete = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#09172B'),
    map: concreteTex ?? undefined,
    bumpMap: concreteTex ?? undefined,
    bumpScale: 0.015,
    roughness: 0.78,
    metalness: 0.1,
    envMapIntensity: 0.85,
  });

  const wetMirrorFallback = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#081629'),
    map: floorTex ?? undefined,
    bumpMap: floorTex ?? undefined,
    bumpScale: 0.004,
    roughness: 0.14,
    metalness: 0.55,
    envMapIntensity: 1.85,
  });

  const brushedDarkSteel = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#173863'),
    roughness: 0.24,
    metalness: 0.86,
    envMapIntensity: 1.55,
  });

  const specularChrome = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9EC5F8'),
    roughness: 0.07,
    metalness: 0.95,
    envMapIntensity: 2.15,
  });

  const architecturalGlass = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1A4980'),
    roughness: 0.08,
    metalness: 0.25,
    transparent: true,
    opacity: 0.42,
    envMapIntensity: 2.0,
  });

  const luminousEdge = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#8CC0FF'),
  });

  const luminousCore = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#F5FAFF'),
  });

  const skyApertureMaterial = new THREE.MeshBasicMaterial({
    map: skyTex ?? undefined,
    color: new THREE.Color('#FFFFFF'),
    fog: false,
  });

  const distantTowerMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3C6BA6'),
    roughness: 0.55,
    metalness: 0.2,
    transparent: true,
    opacity: 0.76,
  });

  const silhouetteMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#050D1A'),
    roughness: 0.42,
    metalness: 0.18,
    envMapIntensity: 0.9,
  });

  const heroSteleFaceMaterial = new THREE.MeshStandardMaterial({
    map: heroSteleTex ?? undefined,
    color: new THREE.Color('#FFFFFF'),
    roughness: 0.1,
    metalness: 0.22,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 1.8,
  });

  const projectPlateMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ] = [
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: screenTextures[0] ?? undefined,
      roughness: 0.2,
      metalness: 0.18,
      envMapIntensity: 1.25,
    }),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: screenTextures[1] ?? undefined,
      roughness: 0.2,
      metalness: 0.18,
      envMapIntensity: 1.25,
    }),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: screenTextures[2] ?? undefined,
      roughness: 0.2,
      metalness: 0.18,
      envMapIntensity: 1.25,
    }),
  ];

  return {
    darkConcrete,
    deepConcrete,
    wetMirrorFallback,
    brushedDarkSteel,
    specularChrome,
    architecturalGlass,
    luminousEdge,
    luminousCore,
    skyApertureMaterial,
    distantTowerMaterial,
    silhouetteMaterial,
    heroSteleFaceMaterial,
    projectPlateMaterials,
    dispose: () => {
      concreteTex?.dispose();
      floorTex?.dispose();
      skyTex?.dispose();
      heroSteleTex?.dispose();
      screenTextures.forEach((t) => t?.dispose());
      darkConcrete.dispose();
      deepConcrete.dispose();
      wetMirrorFallback.dispose();
      brushedDarkSteel.dispose();
      specularChrome.dispose();
      architecturalGlass.dispose();
      luminousEdge.dispose();
      luminousCore.dispose();
      skyApertureMaterial.dispose();
      distantTowerMaterial.dispose();
      silhouetteMaterial.dispose();
      heroSteleFaceMaterial.dispose();
      projectPlateMaterials.forEach((m) => m.dispose());
    },
  };
}
