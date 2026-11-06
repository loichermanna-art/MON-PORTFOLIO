import * as THREE from 'three';

export interface ArchitecturalMaterialSet {
  limestoneWall: THREE.MeshStandardMaterial;
  limestonePaving: THREE.MeshStandardMaterial;
  sandstonePlinth: THREE.MeshStandardMaterial;
  patinatedBronze: THREE.MeshStandardMaterial;
  precisionBrass: THREE.MeshStandardMaterial;
  projectPlateMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ];
  dispose: () => void;
}

/** Générateur pseudo-aléatoire déterministe pour un grain minéral stable */
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

function createLimestoneTexture(options: {
  size: number;
  baseHex: [number, number, number];
  gridCols: number;
  gridRows: number;
  repeatX: number;
  repeatY: number;
}): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = options.size;
  canvas.height = options.size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const rand = mulberry32(4219);
  const [br, bg, bb] = options.baseHex;
  ctx.fillStyle = `rgb(${br}, ${bg}, ${bb})`;
  ctx.fillRect(0, 0, options.size, options.size);

  const cellW = options.size / options.gridCols;
  const cellH = options.size / options.gridRows;
  for (let row = 0; row < options.gridRows; row++) {
    const offset = row % 2 === 1 ? cellW * 0.5 : 0;
    for (let col = -1; col <= options.gridCols; col++) {
      const delta = (rand() - 0.5) * 7;
      const r = Math.round(Math.min(255, Math.max(0, br + delta)));
      const g = Math.round(Math.min(255, Math.max(0, bg + delta * 0.95)));
      const b = Math.round(Math.min(255, Math.max(0, bb + delta * 0.85)));
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(col * cellW + offset, row * cellH, cellW, cellH);
    }
  }

  for (let i = 0; i < 3600; i++) {
    const x = rand() * options.size;
    const y = rand() * options.size;
    const w = 1 + rand() * 3.5;
    const h = 0.8 + rand() * 1.4;
    const shade = rand() > 0.5 ? 'rgba(255,253,248,0.16)' : 'rgba(130,118,102,0.09)';
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, w, h);
  }

  ctx.strokeStyle = 'rgba(120, 110, 96, 0.22)';
  ctx.lineWidth = 1.25;
  for (let row = 0; row <= options.gridRows; row++) {
    const y = row * cellH;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(options.size, y);
    ctx.stroke();

    const offset = row % 2 === 1 ? cellW * 0.5 : 0;
    if (row < options.gridRows) {
      for (let col = 0; col <= options.gridCols; col++) {
        const x = (col * cellW + offset) % options.size;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellH);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(options.repeatX, options.repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Génère les 3 plaques d'exposition muséales haute définition (768x1024)
 * intégrées dans les stèles 3D de la Scène 04 (zéro requête réseau externe).
 */
function createProjectPlateTexture(variant: 0 | 1 | 2): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = 768;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Fond papier d'archive minéral
  ctx.fillStyle = '#FAF7F0';
  ctx.fillRect(0, 0, w, h);

  // Cadre fin intérieur
  ctx.strokeStyle = '#6E502F';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, w - 72, h - 72);
  ctx.strokeStyle = 'rgba(20, 20, 19, 0.14)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 52, w - 104, h - 104);

  // En-tête éditorial commun
  ctx.fillStyle = '#6E502F';
  ctx.font = '600 22px monospace';
  const indexLabels = ['STÈLE 01 · BILLETTERIE QR', 'STÈLE 02 · VITRINE SKINCARE', 'STÈLE 03 · ESPACE ÉTUDES-CONSEILS'];
  ctx.fillText(indexLabels[variant], 84, 114);

  ctx.fillStyle = '#141413';
  ctx.font = '400 64px Georgia, serif';
  const titles = ['LAURA HOUSE', 'SassySkin', 'EtuCo'];
  ctx.fillText(titles[variant], 84, 194);

  ctx.fillStyle = '#183B56';
  ctx.fillRect(84, 224, 112, 4);

  if (variant === 0) {
    // Schéma architectural d'une carte-billet QR haute définition
    ctx.fillStyle = '#F2EDE2';
    ctx.fillRect(84, 272, w - 168, 520);
    ctx.strokeStyle = '#183B56';
    ctx.lineWidth = 2;
    ctx.strokeRect(84, 272, w - 168, 520);

    // Ligne de découpe billet
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = 'rgba(20,20,19,0.28)';
    ctx.beginPath();
    ctx.moveTo(84, 580);
    ctx.lineTo(w - 84, 580);
    ctx.stroke();
    ctx.setLineDash([]);

    // Matrice géométrique QR stylisée
    const qrX = 264;
    const qrY = 324;
    const qrSize = 240;
    ctx.fillStyle = '#FCFBF8';
    ctx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
    ctx.strokeStyle = '#141413';
    ctx.lineWidth = 4;
    ctx.strokeRect(qrX, qrY, 64, 64);
    ctx.strokeRect(qrX + qrSize - 64, qrY, 64, 64);
    ctx.strokeRect(qrX, qrY + qrSize - 64, 64, 64);
    ctx.fillStyle = '#141413';
    ctx.fillRect(qrX + 18, qrY + 18, 28, 28);
    ctx.fillRect(qrX + qrSize - 46, qrY + 18, 28, 28);
    ctx.fillRect(qrX + 18, qrY + qrSize - 46, 28, 28);

    const rand = mulberry32(101);
    for (let gx = 0; gx < 9; gx++) {
      for (let gy = 0; gy < 9; gy++) {
        const inCorner =
          (gx < 3 && gy < 3) || (gx > 5 && gy < 3) || (gx < 3 && gy > 5);
        if (!inCorner && rand() > 0.44) {
          ctx.fillRect(qrX + gx * 26 + 4, qrY + gy * 26 + 4, 18, 18);
        }
      }
    }

    ctx.fillStyle = '#141413';
    ctx.font = '600 24px sans-serif';
    ctx.fillText('RÉSERVATION & CONTRÔLE D’ACCÈS', 124, 646);
    ctx.fillStyle = '#57534E';
    ctx.font = '400 20px monospace';
    ctx.fillText('EXPORT PNG HD · INTÉGRITÉ QR VÉRIFIÉE', 124, 690);
    ctx.fillStyle = '#183B56';
    ctx.fillRect(124, 722, 220, 34);
    ctx.fillStyle = '#FCFBF8';
    ctx.font = '500 17px monospace';
    ctx.fillText('BILLET CERTIFIÉ', 152, 745);
  } else if (variant === 1) {
    // Composition éditoriale vitrine Skincare
    ctx.fillStyle = '#F2EDE2';
    ctx.fillRect(84, 272, w - 168, 520);
    ctx.strokeStyle = '#6E502F';
    ctx.lineWidth = 2;
    ctx.strokeRect(84, 272, w - 168, 520);

    // Silhouette minimaliste de flacon & fiches gammes
    ctx.fillStyle = '#FCFBF8';
    ctx.fillRect(120, 314, 240, 340);
    ctx.strokeStyle = 'rgba(20,20,19,0.2)';
    ctx.strokeRect(120, 314, 240, 340);

    // Flacon géométrique épuré
    ctx.fillStyle = '#E6DFD1';
    ctx.fillRect(195, 410, 90, 185);
    ctx.fillStyle = '#423325';
    ctx.fillRect(218, 372, 44, 38);
    ctx.strokeStyle = '#6E502F';
    ctx.strokeRect(208, 452, 64, 96);

    // Colonne catalogue à droite
    ctx.fillStyle = '#141413';
    ctx.font = '400 32px Georgia, serif';
    ctx.fillText('Gamme Soins', 396, 362);
    ctx.fillStyle = '#57534E';
    ctx.font = '400 20px sans-serif';
    ctx.fillText('Présentation claire', 396, 404);
    ctx.fillText('& parcours mobile', 396, 434);

    for (let r = 0; r < 3; r++) {
      ctx.fillStyle = '#FCFBF8';
      ctx.fillRect(396, 472 + r * 62, 250, 46);
      ctx.strokeStyle = 'rgba(20,20,19,0.16)';
      ctx.strokeRect(396, 472 + r * 62, 250, 46);
      ctx.fillStyle = '#183B56';
      ctx.fillRect(412, 491 + r * 62, 48, 8);
    }

    ctx.fillStyle = '#183B56';
    ctx.fillRect(120, 692, w - 240, 56);
    ctx.fillStyle = '#FCFBF8';
    ctx.font = '500 20px monospace';
    ctx.fillText('VITRINE E-COMMERCE · RESPONSIVE', 184, 727);
  } else {
    // EtuCo — Architecture applicative Club Études-Conseils
    ctx.fillStyle = '#F2EDE2';
    ctx.fillRect(84, 272, w - 168, 520);
    ctx.strokeStyle = '#183B56';
    ctx.lineWidth = 2;
    ctx.strokeRect(84, 272, w - 168, 520);

    // Grille modulaire d'activités et d'études
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const bx = 120 + col * 274;
        const by = 312 + row * 184;
        ctx.fillStyle = '#FCFBF8';
        ctx.fillRect(bx, by, 254, 160);
        ctx.strokeStyle = 'rgba(20,20,19,0.18)';
        ctx.strokeRect(bx, by, 254, 160);
        ctx.fillStyle = col === 0 && row === 0 ? '#183B56' : '#6E502F';
        ctx.fillRect(bx, by, 254, 6);
        ctx.fillStyle = '#141413';
        ctx.fillRect(bx + 22, by + 34, 130, 10);
        ctx.fillStyle = '#AEA79B';
        ctx.fillRect(bx + 22, by + 62, 195, 7);
        ctx.fillRect(bx + 22, by + 82, 165, 7);
        ctx.fillRect(bx + 22, by + 116, 84, 20);
      }
    }

    ctx.fillStyle = '#141413';
    ctx.font = '600 23px sans-serif';
    ctx.fillText('CLUB ÉTUDES-CONSEILS', 120, 718);
    ctx.fillStyle = '#57534E';
    ctx.font = '400 19px monospace';
    ctx.fillText('ENVIRONNEMENT NUMÉRIQUE STRUCTURÉ', 120, 752);
  }

  // Pied de stèle
  ctx.fillStyle = '#57534E';
  ctx.font = '400 19px monospace';
  ctx.fillText('LOÏC AKANDA · RÉALISATION VÉRIFIÉE', 84, 928);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createArchitecturalMaterials(): ArchitecturalMaterialSet {
  const wallTex = createLimestoneTexture({
    size: 512,
    baseHex: [243, 239, 230],
    gridCols: 3,
    gridRows: 6,
    repeatX: 1.5,
    repeatY: 3,
  });

  const pavingTex = createLimestoneTexture({
    size: 512,
    baseHex: [238, 233, 222],
    gridCols: 4,
    gridRows: 4,
    repeatX: 12,
    repeatY: 34,
  });

  const plateTextures = [
    createProjectPlateTexture(0),
    createProjectPlateTexture(1),
    createProjectPlateTexture(2),
  ] as const;

  const limestoneWall = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F5F1E8'),
    map: wallTex ?? undefined,
    bumpMap: wallTex ?? undefined,
    bumpScale: 0.008,
    roughness: 0.86,
    metalness: 0.02,
    envMapIntensity: 0.75,
  });

  const limestonePaving = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#EFEAE0'),
    map: pavingTex ?? undefined,
    bumpMap: pavingTex ?? undefined,
    bumpScale: 0.012,
    roughness: 0.88,
    metalness: 0.02,
    envMapIntensity: 0.7,
  });

  const sandstonePlinth = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E3DDD0'),
    roughness: 0.9,
    metalness: 0.03,
    envMapIntensity: 0.65,
  });

  const patinatedBronze = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#423325'),
    roughness: 0.32,
    metalness: 0.78,
    envMapIntensity: 1.35,
  });

  const precisionBrass = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9E7C4E'),
    roughness: 0.25,
    metalness: 0.85,
    envMapIntensity: 1.45,
  });

  const projectPlateMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ] = [
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: plateTextures[0] ?? undefined,
      roughness: 0.42,
      metalness: 0.04,
      envMapIntensity: 0.85,
    }),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: plateTextures[1] ?? undefined,
      roughness: 0.42,
      metalness: 0.04,
      envMapIntensity: 0.85,
    }),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: plateTextures[2] ?? undefined,
      roughness: 0.42,
      metalness: 0.04,
      envMapIntensity: 0.85,
    }),
  ];

  return {
    limestoneWall,
    limestonePaving,
    sandstonePlinth,
    patinatedBronze,
    precisionBrass,
    projectPlateMaterials,
    dispose: () => {
      wallTex?.dispose();
      pavingTex?.dispose();
      plateTextures.forEach((t) => t?.dispose());
      limestoneWall.dispose();
      limestonePaving.dispose();
      sandstonePlinth.dispose();
      patinatedBronze.dispose();
      precisionBrass.dispose();
      projectPlateMaterials.forEach((m) => m.dispose());
    },
  };
}
