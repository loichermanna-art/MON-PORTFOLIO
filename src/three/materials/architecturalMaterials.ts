import * as THREE from 'three';

export interface ArchitecturalMaterialSet {
  /** Béton architectural brut de décoffrage (albedo + normalMap tangentielle + roughnessMap) */
  boardConcrete: THREE.MeshStandardMaterial;
  /** Béton d'ombre profond pour les portiques de premier plan et soffites */
  deepConcrete: THREE.MeshStandardMaterial;
  /** Dalle de basalte adouci avec joints de pierre et micro-variations de rugosité */
  honedBasaltFloor: THREE.MeshStandardMaterial;
  /** Map de rugosité du basalte réutilisable par le réflecteur planaire */
  basaltRoughnessMap: THREE.CanvasTexture | null;
  /** Map de normales du basalte réutilisable par le réflecteur planaire */
  basaltNormalMap: THREE.CanvasTexture | null;
  /** Acier architectural thermolaqué gris-nuit mat (meneaux, huisseries, garde-corps) */
  anodizedSteel: THREE.MeshStandardMaterial;
  /** Acier brossé satiné pour détails d'assemblage fins */
  brushedSteel: THREE.MeshStandardMaterial;
  /** Verre architectural feuilleté antireflet (sans effet plastique/néon) */
  structuralGlass: THREE.MeshPhysicalMaterial;
  /** Panneau de verre architectural gravé sobrement pour la baie droite */
  etchedBayGlass: THREE.MeshPhysicalMaterial;
  /** Gorge lumineuse architecturale douce (dégradé exponentiel sans effet tube néon) */
  softCoveLight: THREE.ShaderMaterial;
  /** Ciel physique d'heure bleue (shader GLSL sans banding ni nuages cartoon) */
  blueHourSky: THREE.ShaderMaterial;
  /** Voile atmosphérique subtil de lumière rasante */
  atmosphericShaft: THREE.ShaderMaterial;
  /** Ombre d'occlusion ambiante de contact (pieds de murs, colonnes et marches) */
  contactAO: THREE.ShaderMaterial;
  /** Panneaux muséaux sobres des 3 projets (sans fausse capture ni bordure criarde) */
  projectPlateMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ];
  /** Stèles vitrées gravées des 3 repères « À propos » (Scène 02) */
  aboutPillarMaterials: [
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
  ];
  /** Parois de verre sérigraphiées des 4 domaines « Expertise » (Scène 03) */
  expertisePlaqueMaterials: [
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
  ];
  /** Cartels gravés des 6 portiques « Ma démarche » (Scène 05) */
  processPortalMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ];
  /** Pupitres vitrés du belvédère « Contact » (Scène 06) */
  contactBeaconMaterials: [
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
  ];
  dispose: () => void;
}

/* ==========================================================================
   GÉNÉRATEUR DE BRUIT PROCÉDURAL DÉTERMINISTE (Value Noise + fBm 4 octaves)
   ========================================================================== */

function hash2D(ix: number, iy: number, seed: number): number {
  let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041);
  n = (n ^ (n >>> 13)) >>> 0;
  n = Math.imul(n, 1274126177) >>> 0;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function smoothNoise2D(x: number, y: number, period: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  const x0 = ((xi % period) + period) % period;
  const x1 = (x0 + 1) % period;
  const y0 = ((yi % period) + period) % period;
  const y1 = (y0 + 1) % period;

  const a = hash2D(x0, y0, seed);
  const b = hash2D(x1, y0, seed);
  const c = hash2D(x0, y1, seed);
  const d = hash2D(x1, y1, seed);

  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbmTileable(u: number, v: number, baseFreq: number, seed: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = baseFreq;
  for (let oct = 0; oct < 4; oct++) {
    sum += amp * smoothNoise2D(u * freq, v * freq, freq, seed + oct * 97);
    freq *= 2;
    amp *= 0.5;
  }
  return sum;
}

interface PBRTextureBundle {
  albedo: THREE.CanvasTexture | null;
  normal: THREE.CanvasTexture | null;
  roughness: THREE.CanvasTexture | null;
}

/**
 * Génère un trio PBR complet (Albedo sRGB + NormalMap tangentielle linéaire + RoughnessMap linéaire)
 * pour un véritable béton architectural banché (panneaux coffrés, joints creux et trous de banches).
 */
function createBoardFormedConcretePBR(
  repeatX: number,
  repeatY: number
): PBRTextureBundle {
  if (typeof document === 'undefined') {
    return { albedo: null, normal: null, roughness: null };
  }

  const size = 512;
  const heightField = new Float32Array(size * size);

  const albedoCanvas = document.createElement('canvas');
  const normalCanvas = document.createElement('canvas');
  const roughCanvas = document.createElement('canvas');
  albedoCanvas.width = normalCanvas.width = roughCanvas.width = size;
  albedoCanvas.height = normalCanvas.height = roughCanvas.height = size;

  const aCtx = albedoCanvas.getContext('2d');
  const nCtx = normalCanvas.getContext('2d');
  const rCtx = roughCanvas.getContext('2d');
  if (!aCtx || !nCtx || !rCtx) {
    return { albedo: null, normal: null, roughness: null };
  }

  const aImg = aCtx.createImageData(size, size);
  const nImg = nCtx.createImageData(size, size);
  const rImg = rCtx.createImageData(size, size);

  // Trous de banches authentiques (2 par panneau de coffrage 2x2)
  const tieHoles: Array<[number, number]> = [];
  for (const py of [0.25, 0.75]) {
    for (const px of [0.12, 0.38, 0.62, 0.88]) {
      tieHoles.push([px, py]);
    }
  }

  for (let y = 0; y < size; y++) {
    const v = y / size;
    // Légère variation d'une planche de coffrage horizontale à l'autre (8 planches)
    const plankIdx = Math.floor(v * 8);
    const plankTone = (hash2D(plankIdx, 3, 19) - 0.5) * 0.055;
    const plankSeamDist = Math.abs((v * 8) - Math.round(v * 8));

    for (let x = 0; x < size; x++) {
      const u = x / size;
      const idx = y * size + x;

      // Grain minéral multi-échelle + veinage horizontal très subtil de planche
      const finePores = fbmTileable(u, v, 16, 401);
      const broadCloud = fbmTileable(u, v, 4, 809);
      const woodGrain = fbmTileable(u * 0.35, v * 2.5, 16, 211) * 0.14;

      let h = 0.52 + (finePores - 0.5) * 0.28 + (broadCloud - 0.5) * 0.22 + plankTone + woodGrain;

      // Joints principaux de panneaux de coffrage (grille 2 x 2)
      const panelX = Math.min(Math.abs(u - 0.0), Math.abs(u - 0.5), Math.abs(u - 1.0));
      const panelY = Math.min(Math.abs(v - 0.0), Math.abs(v - 0.5), Math.abs(v - 1.0));
      const panelJoint = Math.min(panelX, panelY);
      if (panelJoint < 0.0045) {
        const t = panelJoint / 0.0045;
        h -= (1 - t * t) * 0.36;
      } else if (plankSeamDist < 0.018) {
        const t = plankSeamDist / 0.018;
        h -= (1 - t) * 0.09;
      }

      // Cônes de tiges de coffrage (trous de banches)
      for (let k = 0; k < tieHoles.length; k++) {
        const dx = u - tieHoles[k][0];
        const dy = v - tieHoles[k][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.013) {
          const rim = dist / 0.013;
          h -= (1 - rim * rim) * 0.44;
        }
      }

      heightField[idx] = Math.max(0, Math.min(1, h));

      // Albedo minéral bleu-ardoise sombre (jamais saturé, aspect béton nocturne naturel)
      const shade = heightField[idx];
      const baseR = 16 + shade * 14;
      const baseG = 28 + shade * 20;
      const baseB = 45 + shade * 28;
      const p = idx * 4;
      aImg.data[p] = Math.max(0, Math.min(255, baseR));
      aImg.data[p + 1] = Math.max(0, Math.min(255, baseG));
      aImg.data[p + 2] = Math.max(0, Math.min(255, baseB));
      aImg.data[p + 3] = 255;

      // Roughness réaliste du béton brut (0.72 .. 0.94)
      const rough = Math.max(0.68, Math.min(0.96, 0.88 - (shade - 0.5) * 0.24));
      const rByte = Math.round(rough * 255);
      rImg.data[p] = rByte;
      rImg.data[p + 1] = rByte;
      rImg.data[p + 2] = rByte;
      rImg.data[p + 3] = 255;
    }
  }

  // Conversion du champ de hauteur en NormalMap tangentielle linéaire
  const normalStrength = 2.6;
  for (let y = 0; y < size; y++) {
    const ym = (y - 1 + size) % size;
    const yp = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const dhx = (heightField[y * size + xp] - heightField[y * size + xm]) * normalStrength;
      const dhy = (heightField[yp * size + x] - heightField[ym * size + x]) * normalStrength;
      const invLen = 1 / Math.sqrt(dhx * dhx + dhy * dhy + 1);
      const nx = -dhx * invLen;
      const ny = -dhy * invLen;
      const nz = invLen;

      const p = (y * size + x) * 4;
      nImg.data[p] = Math.round((nx * 0.5 + 0.5) * 255);
      nImg.data[p + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      nImg.data[p + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      nImg.data[p + 3] = 255;
    }
  }

  aCtx.putImageData(aImg, 0, 0);
  nCtx.putImageData(nImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);

  const configure = (canvas: HTMLCanvasElement, isSrgb: boolean) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.colorSpace = isSrgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  };

  return {
    albedo: configure(albedoCanvas, true),
    normal: configure(normalCanvas, false),
    roughness: configure(roughCanvas, false),
  };
}

/**
 * Génère un trio PBR pour de grandes dalles de pierre de basalte adoucie (calepinage à joints fins
 * et variation subtile de rugosité d'une dalle à l'autre).
 */
function createHonedBasaltFloorPBR(repeatX: number, repeatY: number): PBRTextureBundle {
  if (typeof document === 'undefined') {
    return { albedo: null, normal: null, roughness: null };
  }

  const size = 512;
  const heightField = new Float32Array(size * size);

  const albedoCanvas = document.createElement('canvas');
  const normalCanvas = document.createElement('canvas');
  const roughCanvas = document.createElement('canvas');
  albedoCanvas.width = normalCanvas.width = roughCanvas.width = size;
  albedoCanvas.height = normalCanvas.height = roughCanvas.height = size;

  const aCtx = albedoCanvas.getContext('2d');
  const nCtx = normalCanvas.getContext('2d');
  const rCtx = roughCanvas.getContext('2d');
  if (!aCtx || !nCtx || !rCtx) {
    return { albedo: null, normal: null, roughness: null };
  }

  const aImg = aCtx.createImageData(size, size);
  const nImg = nCtx.createImageData(size, size);
  const rImg = rCtx.createImageData(size, size);

  const tiles = 3;
  for (let y = 0; y < size; y++) {
    const v = y / size;
    const row = Math.floor(v * tiles);
    const rowShift = (row % 2) * 0.5;

    for (let x = 0; x < size; x++) {
      const u = x / size;
      const idx = y * size + x;

      const tu = (u * tiles + rowShift) % 1;
      const tv = (v * tiles) % 1;
      const col = Math.floor((u * tiles + rowShift) % tiles);

      const tileSeed = hash2D(col, row, 733);
      const stoneCloud = fbmTileable(u, v, 6, 557);
      const microGrain = fbmTileable(u, v, 24, 911);

      let h = 0.55 + (stoneCloud - 0.5) * 0.16 + (microGrain - 0.5) * 0.08 + (tileSeed - 0.5) * 0.05;

      const edgeDist = Math.min(tu, 1 - tu, tv, 1 - tv);
      let isJoint = false;
      if (edgeDist < 0.012) {
        isJoint = true;
        const jt = edgeDist / 0.012;
        h -= (1 - jt * jt) * 0.42;
      }

      heightField[idx] = Math.max(0, Math.min(1, h));

      const p = idx * 4;
      const lum = heightField[idx];
      aImg.data[p] = Math.round(9 + lum * 10);
      aImg.data[p + 1] = Math.round(18 + lum * 15);
      aImg.data[p + 2] = Math.round(31 + lum * 22);
      aImg.data[p + 3] = 255;

      // Basalte adouci : rugosité naturelle entre 0.24 et 0.44 (joints mats à 0.88)
      const rough = isJoint
        ? 0.88
        : Math.max(0.22, Math.min(0.48, 0.33 + (stoneCloud - 0.5) * 0.18 + (tileSeed - 0.5) * 0.06));
      const rByte = Math.round(rough * 255);
      rImg.data[p] = rByte;
      rImg.data[p + 1] = rByte;
      rImg.data[p + 2] = rByte;
      rImg.data[p + 3] = 255;
    }
  }

  const normalStrength = 2.1;
  for (let y = 0; y < size; y++) {
    const ym = (y - 1 + size) % size;
    const yp = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const dhx = (heightField[y * size + xp] - heightField[y * size + xm]) * normalStrength;
      const dhy = (heightField[yp * size + x] - heightField[ym * size + x]) * normalStrength;
      const invLen = 1 / Math.sqrt(dhx * dhx + dhy * dhy + 1);

      const p = (y * size + x) * 4;
      nImg.data[p] = Math.round((-dhx * invLen * 0.5 + 0.5) * 255);
      nImg.data[p + 1] = Math.round((-dhy * invLen * 0.5 + 0.5) * 255);
      nImg.data[p + 2] = Math.round((invLen * 0.5 + 0.5) * 255);
      nImg.data[p + 3] = 255;
    }
  }

  aCtx.putImageData(aImg, 0, 0);
  nCtx.putImageData(nImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);

  const configure = (canvas: HTMLCanvasElement, isSrgb: boolean) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.colorSpace = isSrgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  };

  return {
    albedo: configure(albedoCanvas, true),
    normal: configure(normalCanvas, false),
    roughness: configure(roughCanvas, false),
  };
}

/**
 * Sérigraphie architecturale muséale discrète sur vitrage feuilleté (sans cadre fluo ni effet HUD jeu vidéo).
 */
function createEtchedGlassBayTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = 1024;
  const h = 1280;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = 'rgba(11, 26, 46, 0.34)';
  ctx.fillRect(0, 0, w, h);

  // Filets de sérigraphie architecturale très fins (blanc dépoli à faible opacité)
  ctx.strokeStyle = 'rgba(220, 232, 246, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(96, 180);
  ctx.lineTo(96, h - 180);
  ctx.stroke();

  const labels = ['AUDIT', 'FINANCE', 'DÉVELOPPEMENT', 'INNOVATION'];
  const startY = 430;
  const stepY = 126;

  ctx.textBaseline = 'middle';
  labels.forEach((word, idx) => {
    const y = startY + idx * stepY;
    ctx.fillStyle = 'rgba(169, 192, 218, 0.58)';
    ctx.font = '400 18px monospace';
    ctx.fillText(`0${idx + 1}`, 132, y);

    ctx.fillStyle = 'rgba(236, 242, 250, 0.86)';
    ctx.font = '500 30px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    ctx.fillText(word.split('').join(' '), 196, y);

    ctx.strokeStyle = 'rgba(220, 232, 246, 0.1)';
    ctx.beginPath();
    ctx.moveTo(132, y + 54);
    ctx.lineTo(w - 132, y + 54);
    ctx.stroke();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Cartels muséaux sobres pour la galerie d'exposition (Scène 04).
 */
function createMuseumPlaqueTexture(projectIndex: 0 | 1 | 2): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = 1024;
  const h = 640;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#0B192E';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(232, 237, 245, 0.16)';
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, w - 64, h - 64);

  const items = [
    {
      index: '01 / GALERIE',
      title: 'LAURA HOUSE',
      subtitle: 'Billetterie événementielle & titres QR haute définition',
      meta: 'Application Web · Node.js · Export PNG',
    },
    {
      index: '02 / GALERIE',
      title: 'SassySkin',
      subtitle: 'Vitrine commerciale — Soins & beauté',
      meta: 'Conception responsive · Parcours vente',
    },
    {
      index: '03 / GALERIE',
      title: 'EtuCo',
      subtitle: 'Environnement numérique — Club Études-Conseils',
      meta: 'Architecture applicative · Coordination',
    },
  ][projectIndex];

  ctx.fillStyle = '#8FB6E8';
  ctx.font = '500 21px monospace';
  ctx.fillText(items.index, 84, 128);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 62px "Plus Jakarta Sans Variable", system-ui, sans-serif';
  ctx.fillText(items.title, 84, 248);

  ctx.fillStyle = '#C9D7EA';
  ctx.font = '400 27px "Plus Jakarta Sans Variable", system-ui, sans-serif';
  ctx.fillText(items.subtitle, 84, 322);

  ctx.strokeStyle = 'rgba(232, 237, 245, 0.14)';
  ctx.beginPath();
  ctx.moveTo(84, 412);
  ctx.lineTo(w - 84, 412);
  ctx.stroke();

  ctx.fillStyle = '#9AB8DE';
  ctx.font = '400 22px monospace';
  ctx.fillText(items.meta, 84, 488);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Génère une plaque de verre ou de pierre gravée sobre (style signalétique muséale suisse)
 * pour intégrer physiquement l'information éditoriale aux volumes architecturaux 3D (Scènes 02, 03, 05, 06).
 */
function createEngravedArchitecturalPlaqueTexture(
  kicker: string,
  title: string,
  subtitle: string,
  variant: 'glass' | 'lintel' = 'glass'
): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = variant === 'lintel' ? 1024 : 768;
  const h = variant === 'lintel' ? 256 : 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (variant === 'lintel') {
    ctx.fillStyle = '#0A182B';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(143, 182, 232, 0.28)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    ctx.fillStyle = '#76A9E8';
    ctx.font = '600 26px monospace';
    ctx.textBaseline = 'middle';
    ctx.fillText(kicker, 56, h * 0.5);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 44px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    ctx.fillText(title, 180, h * 0.5);

    ctx.fillStyle = '#A9BCD6';
    ctx.font = '400 22px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(subtitle, w - 56, h * 0.5);
  } else {
    ctx.fillStyle = 'rgba(10, 24, 44, 0.56)';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(220, 234, 250, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, w - 72, h - 72);

    ctx.strokeStyle = 'rgba(118, 169, 232, 0.48)';
    ctx.beginPath();
    ctx.moveTo(76, 176);
    ctx.lineTo(220, 176);
    ctx.stroke();

    ctx.fillStyle = '#8FB6E8';
    ctx.font = '500 24px monospace';
    ctx.fillText(kicker, 76, 136);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 48px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    const words = title.split(' ');
    let line = '';
    let y = 276;
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width > w - 152 && line) {
        ctx.fillText(line, 76, y);
        line = word;
        y += 60;
      } else {
        line = candidate;
      }
    }
    if (line) ctx.fillText(line, 76, y);

    ctx.strokeStyle = 'rgba(232, 237, 245, 0.14)';
    ctx.beginPath();
    ctx.moveTo(76, h - 220);
    ctx.lineTo(w - 76, h - 220);
    ctx.stroke();

    ctx.fillStyle = '#C9D7EA';
    ctx.font = '400 26px "Plus Jakarta Sans Variable", system-ui, sans-serif';
    ctx.fillText(subtitle, 76, h - 148);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/* ==========================================================================
   SHADERS GLSL D'ATMOSPHÈRE PHYSIQUE, DE GORGES LUMINEUSES & D'OCCLUSION (AO)
   ========================================================================== */

function createBlueHourSkyShader(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPos;

      float screenDither(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
      }

      void main() {
        // Élévation normalisée de l'horizon (0.0) vers le zénith (1.0)
        float h = clamp((vWorldPos.y + 0.6) / 14.5, 0.0, 1.0);

        vec3 zenith = vec3(0.024, 0.066, 0.133);      // #061122 Bleu nuit zénithal
        vec3 midSky = vec3(0.086, 0.212, 0.384);      // #163662 Bleu acier crépusculaire
        vec3 lowMist = vec3(0.345, 0.533, 0.757);     // #5888C1 Brume froide d'horizon
        vec3 horizonGlow = vec3(0.835, 0.906, 0.976); // #D5E7F9 Clarté naturelle d'heure bleue

        vec3 col = mix(horizonGlow, lowMist, smoothstep(0.0, 0.22, h));
        col = mix(col, midSky, smoothstep(0.18, 0.58, h));
        col = mix(col, zenith, smoothstep(0.52, 1.0, h));

        // Légère lueur solaire sous l'horizon dans l'axe de l'ouverture (droite)
        float az = smoothstep(14.0, 0.0, length(vec2((vWorldPos.x - 2.9) * 0.55, vWorldPos.y - 1.9)));
        col += vec3(0.18, 0.24, 0.31) * az * (1.0 - smoothstep(0.0, 0.65, h));

        // Dithering subtil anti-banding
        col += screenDither(gl_FragCoord.xy) / 255.0;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    depthWrite: false,
    fog: false,
    side: THREE.DoubleSide,
  });
}

function createSoftCoveLightShader(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        // Dégradé exponentiel doux d'éclairage rasant encastré (jamais une barre néon dure)
        float edgeX = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
        float falloff = exp(-vUv.y * 3.6);
        vec3 warmIce = mix(vec3(0.46, 0.66, 0.91), vec3(0.94, 0.97, 1.0), falloff);
        float alpha = falloff * edgeX * 0.72;
        gl_FragColor = vec4(warmIce, alpha);
      }
    `,
  });
}

function createAtmosphericShaftShader(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vNormalView = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewDir;
      void main() {
        // Disparaît complètement sur les bords et à angle rasant (zéro tranche visible)
        float facing = pow(abs(dot(vNormalView, vViewDir)), 1.6);
        float envU = smoothstep(0.0, 0.35, vUv.x) * smoothstep(1.0, 0.65, vUv.x);
        float envV = exp(-vUv.y * 2.4) * smoothstep(0.0, 0.12, vUv.y);
        float alpha = facing * envU * envV * 0.075;
        gl_FragColor = vec4(0.58, 0.76, 0.96, alpha);
      }
    `,
  });
}

function createContactAOShader(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        // Ombre de contact dense au ras du mur (vUv.y = 0) se fondant doucement vers 1
        float ao = pow(1.0 - clamp(vUv.y, 0.0, 1.0), 2.35) * 0.68;
        float ends = smoothstep(0.0, 0.04, vUv.x) * smoothstep(1.0, 0.96, vUv.x);
        gl_FragColor = vec4(0.008, 0.02, 0.045, ao * ends);
      }
    `,
  });
}

export function createArchitecturalMaterials(): ArchitecturalMaterialSet {
  const concretePbr = createBoardFormedConcretePBR(2, 2);
  const floorPbr = createHonedBasaltFloorPBR(10, 28);
  const heroSteleTex = createEtchedGlassBayTexture();

  const screenTextures = [
    createMuseumPlaqueTexture(0),
    createMuseumPlaqueTexture(1),
    createMuseumPlaqueTexture(2),
  ] as const;

  const aboutTextures = [
    createEngravedArchitecturalPlaqueTexture(
      '01 · INP-HB',
      'RIGUEUR ANALYTIQUE',
      'Finance · Comptabilité · Audit'
    ),
    createEngravedArchitecturalPlaqueTexture(
      '02 · ARCHITECTURE',
      'COHÉRENCE LOGIQUE',
      'Diagnostic & Ingénierie Web'
    ),
    createEngravedArchitecturalPlaqueTexture(
      '03 · VISION',
      'IMPACT CONCRET',
      'Solutions numériques durables'
    ),
  ] as const;

  const expertiseTextures = [
    createEngravedArchitecturalPlaqueTexture(
      'STÈLE 01 · FINANCE',
      'FINANCE & COMPTABILITÉ',
      'Socle ingénieur INP-HB'
    ),
    createEngravedArchitecturalPlaqueTexture(
      'STÈLE 02 · AUDIT',
      'AUDIT & ANALYSE',
      'Contrôle, risques & décision'
    ),
    createEngravedArchitecturalPlaqueTexture(
      'STÈLE 03 · DIGITAL',
      'DÉVELOPPEMENT WEB',
      'React · TypeScript · Node.js'
    ),
    createEngravedArchitecturalPlaqueTexture(
      'STÈLE 04 · PILOTAGE',
      'GESTION DE PROJETS',
      'Cadrage, jalons & livraison'
    ),
  ] as const;

  const processTextures = [
    createEngravedArchitecturalPlaqueTexture('01 / 06', 'COMPRENDRE', 'CADRAGE', 'lintel'),
    createEngravedArchitecturalPlaqueTexture('02 / 06', 'ANALYSER', 'DIAGNOSTIC', 'lintel'),
    createEngravedArchitecturalPlaqueTexture('03 / 06', 'CONCEVOIR', 'ARCHITECTURE', 'lintel'),
    createEngravedArchitecturalPlaqueTexture('04 / 06', 'DÉVELOPPER', 'EXÉCUTION', 'lintel'),
    createEngravedArchitecturalPlaqueTexture('05 / 06', 'TESTER', 'FIABILITÉ', 'lintel'),
    createEngravedArchitecturalPlaqueTexture('06 / 06', 'AMÉLIORER', 'PÉRENNITÉ', 'lintel'),
  ] as const;

  const contactTextures = [
    createEngravedArchitecturalPlaqueTexture(
      'SEUIL 01 · DIRECT',
      'E-MAIL PRO',
      'Projets & opportunités'
    ),
    createEngravedArchitecturalPlaqueTexture(
      'SEUIL 02 · RÉSEAU',
      'LINKEDIN',
      'Parcours & échanges'
    ),
    createEngravedArchitecturalPlaqueTexture(
      'SEUIL 03 · DÉPÔTS',
      'GITHUB',
      'github.com/loichermanna-art'
    ),
  ] as const;

  const boardConcrete = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8BA4C4'),
    map: concretePbr.albedo ?? undefined,
    normalMap: concretePbr.normal ?? undefined,
    normalScale: new THREE.Vector2(0.85, 0.85),
    roughnessMap: concretePbr.roughness ?? undefined,
    roughness: 0.88,
    metalness: 0.04,
    envMapIntensity: 0.85,
  });

  const deepConcrete = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5E7696'),
    map: concretePbr.albedo ?? undefined,
    normalMap: concretePbr.normal ?? undefined,
    normalScale: new THREE.Vector2(0.9, 0.9),
    roughnessMap: concretePbr.roughness ?? undefined,
    roughness: 0.92,
    metalness: 0.03,
    envMapIntensity: 0.65,
  });

  const honedBasaltFloor = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8FA6C4'),
    map: floorPbr.albedo ?? undefined,
    normalMap: floorPbr.normal ?? undefined,
    normalScale: new THREE.Vector2(0.55, 0.55),
    roughnessMap: floorPbr.roughness ?? undefined,
    roughness: 0.36,
    metalness: 0.18,
    envMapIntensity: 1.35,
  });

  const anodizedSteel = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0E1B2E'),
    roughness: 0.38,
    metalness: 0.82,
    envMapIntensity: 1.25,
  });

  const brushedSteel = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#355278'),
    roughness: 0.28,
    metalness: 0.86,
    envMapIntensity: 1.4,
  });

  const structuralGlass = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#132D4E'),
    roughness: 0.07,
    metalness: 0.08,
    reflectivity: 0.9,
    clearcoat: 0.6,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.34,
    envMapIntensity: 1.65,
  });

  const etchedBayGlass = new THREE.MeshPhysicalMaterial({
    map: heroSteleTex ?? undefined,
    color: new THREE.Color('#FFFFFF'),
    roughness: 0.11,
    metalness: 0.06,
    reflectivity: 0.85,
    clearcoat: 0.5,
    transparent: true,
    opacity: 0.86,
    envMapIntensity: 1.5,
  });

  const softCoveLight = createSoftCoveLightShader();
  const blueHourSky = createBlueHourSkyShader();
  const atmosphericShaft = createAtmosphericShaftShader();
  const contactAO = createContactAOShader();

  const projectPlateMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ] = [
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: screenTextures[0] ?? undefined,
      roughness: 0.34,
      metalness: 0.12,
      envMapIntensity: 1.0,
    }),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: screenTextures[1] ?? undefined,
      roughness: 0.34,
      metalness: 0.12,
      envMapIntensity: 1.0,
    }),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: screenTextures[2] ?? undefined,
      roughness: 0.34,
      metalness: 0.12,
      envMapIntensity: 1.0,
    }),
  ];

  const makeEngravedGlass = (tex: THREE.CanvasTexture | null): THREE.MeshPhysicalMaterial =>
    new THREE.MeshPhysicalMaterial({
      map: tex ?? undefined,
      color: new THREE.Color('#FFFFFF'),
      roughness: 0.14,
      metalness: 0.08,
      reflectivity: 0.85,
      clearcoat: 0.48,
      transparent: true,
      opacity: 0.9,
      envMapIntensity: 1.4,
    });

  const makeLintelPlate = (tex: THREE.CanvasTexture | null): THREE.MeshStandardMaterial =>
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFFFFF'),
      map: tex ?? undefined,
      roughness: 0.36,
      metalness: 0.16,
      envMapIntensity: 1.0,
    });

  const aboutPillarMaterials: [
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
  ] = [
    makeEngravedGlass(aboutTextures[0]),
    makeEngravedGlass(aboutTextures[1]),
    makeEngravedGlass(aboutTextures[2]),
  ];

  const expertisePlaqueMaterials: [
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
  ] = [
    makeEngravedGlass(expertiseTextures[0]),
    makeEngravedGlass(expertiseTextures[1]),
    makeEngravedGlass(expertiseTextures[2]),
    makeEngravedGlass(expertiseTextures[3]),
  ];

  const processPortalMaterials: [
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshStandardMaterial,
  ] = [
    makeLintelPlate(processTextures[0]),
    makeLintelPlate(processTextures[1]),
    makeLintelPlate(processTextures[2]),
    makeLintelPlate(processTextures[3]),
    makeLintelPlate(processTextures[4]),
    makeLintelPlate(processTextures[5]),
  ];

  const contactBeaconMaterials: [
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
    THREE.MeshPhysicalMaterial,
  ] = [
    makeEngravedGlass(contactTextures[0]),
    makeEngravedGlass(contactTextures[1]),
    makeEngravedGlass(contactTextures[2]),
  ];

  return {
    boardConcrete,
    deepConcrete,
    honedBasaltFloor,
    basaltRoughnessMap: floorPbr.roughness,
    basaltNormalMap: floorPbr.normal,
    anodizedSteel,
    brushedSteel,
    structuralGlass,
    etchedBayGlass,
    softCoveLight,
    blueHourSky,
    atmosphericShaft,
    contactAO,
    projectPlateMaterials,
    aboutPillarMaterials,
    expertisePlaqueMaterials,
    processPortalMaterials,
    contactBeaconMaterials,
    dispose: () => {
      concretePbr.albedo?.dispose();
      concretePbr.normal?.dispose();
      concretePbr.roughness?.dispose();
      floorPbr.albedo?.dispose();
      floorPbr.normal?.dispose();
      floorPbr.roughness?.dispose();
      heroSteleTex?.dispose();
      screenTextures.forEach((t) => t?.dispose());
      aboutTextures.forEach((t) => t?.dispose());
      expertiseTextures.forEach((t) => t?.dispose());
      processTextures.forEach((t) => t?.dispose());
      contactTextures.forEach((t) => t?.dispose());
      boardConcrete.dispose();
      deepConcrete.dispose();
      honedBasaltFloor.dispose();
      anodizedSteel.dispose();
      brushedSteel.dispose();
      structuralGlass.dispose();
      etchedBayGlass.dispose();
      softCoveLight.dispose();
      blueHourSky.dispose();
      atmosphericShaft.dispose();
      contactAO.dispose();
      projectPlateMaterials.forEach((m) => m.dispose());
      aboutPillarMaterials.forEach((m) => m.dispose());
      expertisePlaqueMaterials.forEach((m) => m.dispose());
      processPortalMaterials.forEach((m) => m.dispose());
      contactBeaconMaterials.forEach((m) => m.dispose());
    },
  };
}
