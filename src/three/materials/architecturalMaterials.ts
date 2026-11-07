import * as THREE from 'three';

export interface ArchitecturalMaterialSet {
  whiteMarble: THREE.MeshStandardMaterial;
  reflectiveSlateFloor: THREE.MeshStandardMaterial;
  luminousSlab: THREE.MeshStandardMaterial;
  specularChrome: THREE.MeshStandardMaterial;
  obsidianBlock: THREE.MeshStandardMaterial;
  crystalGlass: THREE.MeshStandardMaterial;
  sunsetHalo: THREE.MeshBasicMaterial;
  projectPlateMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ];
  dispose: () => void;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createArchitecturalConcreteTexture(options: {
  size: number;
  baseRgb: [number, number, number];
  seamAlpha: number;
  repeatX: number;
  repeatY: number;
}): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = options.size;
  canvas.height = options.size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const rand = mulberry32(7331);
  const [br, bg, bb] = options.baseRgb;
  ctx.fillStyle = `rgb(${br}, ${bg}, ${bb})`;
  ctx.fillRect(0, 0, options.size, options.size);

  // Nuances subtiles de béton blanc / marbre architectural
  const cols = 4;
  const rows = 4;
  const cw = options.size / cols;
  const ch = options.size / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const d = (rand() - 0.5) * 6;
      ctx.fillStyle = `rgb(${Math.round(br + d)}, ${Math.round(bg + d)}, ${Math.round(bb + d)})`;
      ctx.fillRect(c * cw, r * ch, cw, ch);
    }
  }

  // Veines minérales très douces
  ctx.strokeStyle = 'rgba(155, 165, 180, 0.09)';
  ctx.lineWidth = 1.2;
  for (let v = 0; v < 18; v++) {
    ctx.beginPath();
    let x = rand() * options.size;
    let y = rand() * options.size;
    ctx.moveTo(x, y);
    for (let s = 0; s < 4; s++) {
      x += (rand() - 0.35) * 90;
      y += (rand() - 0.5) * 60;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Joints d'appareillage architecturaux nets (inspirés de UI.jfif & TRES BON.jfif)
  ctx.strokeStyle = `rgba(30, 38, 50, ${options.seamAlpha})`;
  ctx.lineWidth = 1.25;
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * ch);
    ctx.lineTo(options.size, r * ch);
    ctx.stroke();
  }
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cw, 0);
    ctx.lineTo(c * cw, options.size);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(options.repeatX, options.repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Plaques 3D fidèles à l'esprit de la Scène 04 de la planche de référence :
 * - 0 : LAURA HOUSE (Obsidienne sombre & accents ambrés)
 * - 1 : SassySkin   (Perle rosée douce & typographie noire épurée)
 * - 2 : EtuCo       (Blanc glacé studio & bleu ardoise institutionnel)
 */
function createProjectScreenTexture(variant: 0 | 1 | 2): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = 800;
  const h = 640;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (variant === 0) {
    ctx.fillStyle = '#12151C';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1D222D';
    ctx.fillRect(42, 42, 716, 360);
    ctx.fillStyle = '#D99B66';
    ctx.fillRect(540, 68, 190, 140);
    ctx.fillStyle = '#252B38';
    ctx.fillRect(68, 68, 215, 140);
    ctx.fillRect(304, 68, 215, 140);
    ctx.fillRect(68, 228, 320, 145);
    ctx.fillRect(410, 228, 320, 145);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '600 54px sans-serif';
    ctx.fillText('LAURA HOUSE', 48, 492);
    ctx.fillStyle = '#A8B2C1';
    ctx.font = '400 28px sans-serif';
    ctx.fillText('Billetterie événementielle & QR', 48, 544);
  } else if (variant === 1) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#F6E6E8');
    grad.addColorStop(1, '#EBD3D7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.arc(400, 225, 118, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
    ctx.fill();

    ctx.fillStyle = '#14171F';
    ctx.font = '600 54px sans-serif';
    ctx.fillText('SassySkin', 48, 492);
    ctx.fillStyle = '#4A4448';
    ctx.font = '400 28px sans-serif';
    ctx.fillText('Skincare & e-commerce', 48, 544);
  } else {
    ctx.fillStyle = '#F7F9FC';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#E6ECF5';
    ctx.fillRect(44, 52, 220, 330);
    ctx.fillStyle = '#1A2436';
    ctx.fillRect(284, 52, 220, 330);
    ctx.fillStyle = '#24324A';
    ctx.fillRect(524, 52, 232, 330);
    ctx.fillStyle = '#11141B';
    ctx.font = '600 54px sans-serif';
    ctx.fillText('EtuCo', 48, 492);
    ctx.fillStyle = '#475061';
    ctx.font = '400 28px sans-serif';
    ctx.fillText('Club Études-Conseils', 48, 544);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createArchitecturalMaterials(): ArchitecturalMaterialSet {
  const marbleTex = createArchitecturalConcreteTexture({
    size: 512,
    baseRgb: [247, 249, 252],
    seamAlpha: 0.12,
    repeatX: 2,
    repeatY: 3,
  });

  const slateFloorTex = createArchitecturalConcreteTexture({
    size: 512,
    baseRgb: [42, 48, 58],
    seamAlpha: 0.25,
    repeatX: 14,
    repeatY: 38,
  });

  const screenTextures = [
    createProjectScreenTexture(0),
    createProjectScreenTexture(1),
    createProjectScreenTexture(2),
  ] as const;

  const whiteMarble = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F8FAFC'),
    map: marbleTex ?? undefined,
    bumpMap: marbleTex ?? undefined,
    bumpScale: 0.005,
    roughness: 0.68,
    metalness: 0.05,
    envMapIntensity: 0.95,
  });

  // Sol ardoise sombre poli semi-réfléchissant (UI.jfif & Panel 01 / 06)
  const reflectiveSlateFloor = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2B313C'),
    map: slateFloorTex ?? undefined,
    bumpMap: slateFloorTex ?? undefined,
    bumpScale: 0.004,
    roughness: 0.18,
    metalness: 0.36,
    envMapIntensity: 1.55,
  });

  // Dalles blanches lumineuses du chemin axial (TRES BON.jfif & YT.jfif)
  const luminousSlab = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFFFFF'),
    emissive: new THREE.Color('#E8EFF8'),
    emissiveIntensity: 0.24,
    roughness: 0.28,
    metalness: 0.08,
    envMapIntensity: 1.15,
  });

  // Sphère & détails en chrome spéculaire miroir (Panels 01, 05, 06)
  const specularChrome = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F1F5F9'),
    roughness: 0.06,
    metalness: 0.96,
    envMapIntensity: 2.1,
  });

  // Cubes contrastés en obsidienne polie (Panel 03)
  const obsidianBlock = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#141821'),
    roughness: 0.14,
    metalness: 0.68,
    envMapIntensity: 1.6,
  });

  // Verre architectural clair sans passe FBO coûteuse (Panels 03 & 05)
  const crystalGlass = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E6EEF8'),
    roughness: 0.08,
    metalness: 0.22,
    transparent: true,
    opacity: 0.62,
    envMapIntensity: 1.85,
  });

  // Halo solaire chaud d'horizon pour la Scène 06 Contact (Panel 06 & PO.jfif)
  const sunsetHalo = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#FFE0B2'),
    transparent: true,
    opacity: 0.65,
  });

  const projectPlateMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ] = [
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: screenTextures[0] ?? undefined,
      roughness: 0.28,
      metalness: 0.08,
      envMapIntensity: 1.0,
    }),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: screenTextures[1] ?? undefined,
      roughness: 0.28,
      metalness: 0.06,
      envMapIntensity: 1.0,
    }),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: screenTextures[2] ?? undefined,
      roughness: 0.28,
      metalness: 0.06,
      envMapIntensity: 1.0,
    }),
  ];

  return {
    whiteMarble,
    reflectiveSlateFloor,
    luminousSlab,
    specularChrome,
    obsidianBlock,
    crystalGlass,
    sunsetHalo,
    projectPlateMaterials,
    dispose: () => {
      marbleTex?.dispose();
      slateFloorTex?.dispose();
      screenTextures.forEach((t) => t?.dispose());
      whiteMarble.dispose();
      reflectiveSlateFloor.dispose();
      luminousSlab.dispose();
      specularChrome.dispose();
      obsidianBlock.dispose();
      crystalGlass.dispose();
      sunsetHalo.dispose();
      projectPlateMaterials.forEach((m) => m.dispose());
    },
  };
}
