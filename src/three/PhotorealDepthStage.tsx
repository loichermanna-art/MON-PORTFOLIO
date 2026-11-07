import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CANONICAL_SCENE_BANDS, MOTION_DAMPING } from '../motion/motionConfig';
import { motionStore } from '../motion/motionStore';

const SCENE_IMAGE_URLS = [
  '/scenes/scene-01-hero.jpg',
  '/scenes/scene-02-about.jpg',
  '/scenes/scene-03-expertise.jpg',
  '/scenes/scene-04-projects.jpg',
  '/scenes/scene-05-process.jpg',
  '/scenes/scene-06-contact.jpg',
] as const;

interface LoadedSceneLayer {
  colorTex: THREE.Texture;
  depthTex: THREE.DataTexture;
  aspect: number;
}

/**
 * Génère une carte de profondeur 3D lissée (Gaussian + perspective architecturale + contre-jour)
 * à partir de chaque planche architecturale photoréaliste :
 * - Mur monolithique sombre gauche (u < 0.41) : premier plan proche (depth ~ 0.72..0.92).
 * - Plan d'eau / pierre polie au sol (v < 0.27) : récession perspective continue (0.95 -> 0.32).
 * - Ouvertures à contre-jour blanc pur (luminance > 0.84) : lointain infini (depth ~ 0.04).
 * - Structures sculpturales intermédiaires : plan médian (depth ~ 0.38..0.56).
 */
function buildArchitecturalDepthMap(img: HTMLImageElement): THREE.DataTexture {
  const w = 192;
  const h = 108;
  const raw = new Float32Array(w * h);
  const tmp = new Float32Array(w * h);
  const blurred = new Float32Array(w * h);

  let pixelData: Uint8ClampedArray | null = null;
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, w, h);
      pixelData = ctx.getImageData(0, 0, w, h).data;
    }
  }

  for (let y = 0; y < h; y++) {
    // v = 0 en bas, 1 en haut (convention UV WebGL)
    const v = 1 - y / (h - 1);
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1);
      const idx = y * w + x;

      let lum = 0.5;
      if (pixelData) {
        const p = idx * 4;
        lum =
          (pixelData[p] * 0.2126 + pixelData[p + 1] * 0.7152 + pixelData[p + 2] * 0.0722) /
          255;
      }

      // Prior géométrique d'une nef architecturale à contre-jour :
      const leftWallMask = 1 - smoothstep(0.35, 0.46, u);
      const leftWallDepth = 0.88 - u * 0.42;

      const floorMask = (1 - smoothstep(0.04, 0.32, v)) * smoothstep(0.32, 0.46, u);
      const floorDepth = 0.94 - (v / 0.32) * 0.58;

      // Dans l'ouverture droite, la forte luminance correspond au lointain à contre-jour
      const rightSanctuaryDepth = THREE.MathUtils.lerp(0.56, 0.05, Math.pow(lum, 1.35));

      let d = THREE.MathUtils.lerp(rightSanctuaryDepth, leftWallDepth, leftWallMask);
      d = THREE.MathUtils.lerp(d, Math.max(d, floorDepth), floorMask * 0.85);
      raw[idx] = Math.max(0.02, Math.min(0.98, d));
    }
  }

  // Lissage Gaussien séparable (rayon 5) pour supprimer toute cassure de parallaxe
  const radius = 5;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let wSum = 0;
      for (let k = -radius; k <= radius; k++) {
        const xx = Math.max(0, Math.min(w - 1, x + k));
        const weight = Math.exp(-(k * k) / 8.0);
        sum += raw[y * w + xx] * weight;
        wSum += weight;
      }
      tmp[y * w + x] = sum / wSum;
    }
  }

  const outBytes = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let wSum = 0;
      for (let k = -radius; k <= radius; k++) {
        const yy = Math.max(0, Math.min(h - 1, y + k));
        const weight = Math.exp(-(k * k) / 8.0);
        sum += tmp[yy * w + x] * weight;
        wSum += weight;
      }
      const val = sum / wSum;
      blurred[y * w + x] = val;
      // Stockage avec inversion verticale pour correspondre à flipY=false sur DataTexture
      const flippedY = h - 1 - y;
      const outIdx = (flippedY * w + x) * 4;
      const byte = Math.max(0, Math.min(255, Math.round(val * 255)));
      outBytes[outIdx] = byte;
      outBytes[outIdx + 1] = byte;
      outBytes[outIdx + 2] = byte;
      outBytes[outIdx + 3] = 255;
    }
  }

  const depthTex = new THREE.DataTexture(outBytes, w, h, THREE.RGBAFormat);
  depthTex.colorSpace = THREE.NoColorSpace;
  depthTex.minFilter = THREE.LinearFilter;
  depthTex.magFilter = THREE.LinearFilter;
  depthTex.wrapS = THREE.ClampToEdgeWrapping;
  depthTex.wrapT = THREE.ClampToEdgeWrapping;
  depthTex.needsUpdate = true;
  return depthTex;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Calcule l'indice de scène courant [0..5], la scène suivante [0..5] et le facteur
 * de franchissement continu [0..1] à partir de la progression de scroll [0..1].
 */
function computeSceneBlend(progress: number): {
  indexA: number;
  indexB: number;
  blend: number;
  chamberProgress: number;
} {
  const p = Math.max(0, Math.min(1, progress));
  const centers = CANONICAL_SCENE_BANDS.map((b, i) =>
    i === 0 ? 0.04 : i === 5 ? 0.965 : (b.start + b.end) * 0.5
  );

  if (p <= centers[0]) {
    return { indexA: 0, indexB: 0, blend: 0, chamberProgress: p / Math.max(0.01, centers[0]) };
  }
  const last = centers.length - 1;
  if (p >= centers[last]) {
    return { indexA: last, indexB: last, blend: 0, chamberProgress: 1 };
  }

  for (let i = 0; i < last; i++) {
    const c0 = centers[i];
    const c1 = centers[i + 1];
    if (p >= c0 && p <= c1) {
      const span = c1 - c0;
      const rawT = (p - c0) / span;
      // Plage de maintien calme au cœur de chaque chambre, puis traversée fluide vers la suivante
      const blend = smoothstep(0.28, 0.88, rawT);
      return { indexA: i, indexB: i + 1, blend, chamberProgress: rawT };
    }
  }

  return { indexA: 0, indexB: 0, blend: 0, chamberProgress: 0 };
}

function createPlaceholderTexture(hex: number): THREE.DataTexture {
  const c = new THREE.Color(hex);
  const data = new Uint8Array([
    Math.round(c.r * 255),
    Math.round(c.g * 255),
    Math.round(c.b * 255),
    255,
  ]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createPlaceholderDepth(): THREE.DataTexture {
  const data = new Uint8Array([128, 128, 128, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Poussières lumineuses muséales subtiles flottant dans le faisceau de contre-jour droit.
 */
function ContreJourMotes({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobile ? 22 : 44;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Déterministe et confiné à la moitié droite baignée de lumière blanche
      const s1 = Math.sin(i * 12.9898 + 1.23) * 43758.5453;
      const s2 = Math.sin(i * 78.233 + 4.56) * 24634.6345;
      const s3 = Math.sin(i * 39.425 + 7.89) * 19283.7465;
      const r1 = s1 - Math.floor(s1);
      const r2 = s2 - Math.floor(s2);
      const r3 = s3 - Math.floor(s3);

      positions[i * 3] = 0.4 + r1 * 4.4;
      positions[i * 3 + 1] = -2.2 + r2 * 4.6;
      positions[i * 3 + 2] = -2.5 - r3 * 2.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || motionStore.isTabHidden) return;
    pointsRef.current.visible = !motionStore.reducedMotion;
    if (motionStore.reducedMotion) return;
    const t = clock.getElapsedTime();
    pointsRef.current.position.y = (t * 0.045) % 0.8;
    pointsRef.current.position.x = Math.sin(t * 0.22) * 0.08 - motionStore.pointerX * 0.14;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#FFFFFF"
        size={0.022}
        transparent
        opacity={0.28}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function PhotorealDepthStage({ isMobile }: { isMobile: boolean }) {
  const { viewport, size } = useThree();
  const smoothedScroll = useRef(0);
  const smoothedPointer = useRef(new THREE.Vector2(0, 0));
  const smoothedFocus = useRef(0);

  const fallbackColor = useMemo(() => createPlaceholderTexture(0x0b0e13), []);
  const fallbackDepth = useMemo(() => createPlaceholderDepth(), []);

  const layersRef = useRef<Array<LoadedSceneLayer | null>>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColorA: { value: fallbackColor },
        uDepthA: { value: fallbackDepth },
        uAspectA: { value: 16 / 9 },
        uColorB: { value: fallbackColor },
        uDepthB: { value: fallbackDepth },
        uAspectB: { value: 16 / 9 },
        uViewportAspect: { value: 16 / 9 },
        uBlend: { value: 0 },
        uChamberDolly: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uFocusBoost: { value: 0 },
        uIsMobile: { value: 0 },
        uReducedMotion: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uColorA;
        uniform sampler2D uDepthA;
        uniform float uAspectA;
        uniform sampler2D uColorB;
        uniform sampler2D uDepthB;
        uniform float uAspectB;
        uniform float uViewportAspect;
        uniform float uBlend;
        uniform float uChamberDolly;
        uniform vec2 uPointer;
        uniform float uTime;
        uniform float uFocusBoost;
        uniform float uIsMobile;
        uniform float uReducedMotion;

        varying vec2 vUv;

        // Cadrage "object-fit: cover" sans déformation quelle que soit la taille d'écran
        vec2 coverUv(vec2 uv, float imgAspect, float viewAspect, float isMob) {
          vec2 centered = uv - 0.5;
          if (viewAspect > imgAspect) {
            centered.y *= imgAspect / viewAspect;
          } else {
            centered.x *= viewAspect / imgAspect;
            // Sur mobile portrait, décale subtilement le centre vers la droite (0.58)
            // afin de conserver l'ombre gauche ET l'ouverture monumentale à contre-jour
            centered.x += isMob * 0.085;
          }
          return clamp(centered + 0.5, 0.002, 0.998);
        }

        vec3 sampleChamber(
          sampler2D colorMap,
          sampler2D depthMap,
          float imgAspect,
          vec2 baseUv,
          float dollyScale,
          vec2 parallaxVec,
          float timeVal,
          float reduced
        ) {
          vec2 uvCov = coverUv(baseUv, imgAspect, uViewportAspect, uIsMobile);

          // Lecture de la carte de profondeur 3D [0 = infini lumineux, 1 = mur proche]
          float depth = texture2D(depthMap, uvCov).r;

          // Point de fuite architectural situé dans l'ouverture lumineuse droite
          vec2 portalVanish = vec2(0.66, 0.50);

          // Avancée physique 3D (les parois proches défilent plus vite que l'horizon)
          float depthFactor = mix(0.35, 1.25, depth);
          vec2 dollyUv = portalVanish + (uvCov - portalVanish) / (1.0 + dollyScale * depthFactor);

          // Parallaxe 3D multi-plans réagissant au curseur et à la respiration optique
          vec2 disp = parallaxVec * (depth - 0.36) * (1.0 - reduced);
          vec2 finalUv = dollyUv + disp;

          // Micro-ondulations physiques de l'eau calme et de la pierre humide en partie basse
          float waterZone = (1.0 - smoothstep(0.03, 0.27, uvCov.y)) * smoothstep(0.36, 0.48, uvCov.x);
          if (waterZone > 0.001 && reduced < 0.5) {
            float wave1 = sin(uvCov.y * 95.0 - timeVal * 1.4 + uvCov.x * 18.0);
            float wave2 = cos(uvCov.y * 145.0 + timeVal * 0.95 - uvCov.x * 26.0);
            finalUv.x += (wave1 + wave2 * 0.5) * 0.0014 * waterZone;
            finalUv.y += wave1 * 0.0007 * waterZone;
          }

          finalUv = clamp(finalUv, 0.002, 0.998);
          vec3 col = texture2D(colorMap, finalUv).rgb;

          // Légère respiration lumineuse du contre-jour blanc lors des interactions UI
          float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
          float highlightMask = smoothstep(0.62, 0.96, lum) * smoothstep(0.35, 0.55, uvCov.x);
          col += vec3(0.06, 0.065, 0.075) * highlightMask * (uFocusBoost + 0.25 * sin(timeVal * 0.7) * (1.0 - reduced));

          return col;
        }

        void main() {
          float t = uBlend;
          float reduced = uReducedMotion;

          // Lors de la traversée d'une salle à la suivante :
          // - La salle A avance vers son portail lumineux (zoom avant perspectif)
          // - La salle B émerge depuis le contre-jour (1.10 -> 1.0)
          float dollyA = mix(uChamberDolly * 0.045, 0.20, t) * (1.0 - reduced);
          float dollyB = mix(-0.085, 0.0, t) * (1.0 - reduced);

          vec3 colA = sampleChamber(
            uColorA,
            uDepthA,
            uAspectA,
            vUv,
            dollyA,
            uPointer,
            uTime,
            reduced
          );

          vec3 colB = sampleChamber(
            uColorB,
            uDepthB,
            uAspectB,
            vUv,
            dollyB,
            uPointer,
            uTime,
            reduced
          );

          // Fondu spatial guidé par la lumière du contre-jour (l'ouverture blanche révèle d'abord la salle suivante)
          float lumB = dot(colB, vec3(0.2126, 0.7152, 0.0722));
          float lightLead = smoothstep(0.0, 1.0, t * 1.12 + (lumB - 0.5) * 0.14 * sin(t * 3.14159));
          vec3 color = mix(colA, colB, clamp(lightLead, 0.0, 1.0));

          // Halo cinématographique subtil au franchissement du seuil lumineux
          float portalFlash = sin(t * 3.14159265) * 0.075 * (1.0 - reduced);
          float rightGlow = smoothstep(0.34, 0.72, vUv.x);
          color += vec3(portalFlash * rightGlow);

          // Assise d'ombre architecturale douce sur le mur gauche garantissant >15:1 de contraste typographique
          float leftShadowGuard = 1.0 - smoothstep(0.0, 0.44, vUv.x);
          color = mix(color, color * 0.62 + vec3(0.012, 0.015, 0.02), leftShadowGuard * 0.38);

          // Vignette optique subtile de grand format architectural
          vec2 vigUv = vUv * (1.0 - vUv.yx);
          float vig = pow(max(0.0, vigUv.x * vigUv.y * 15.0), 0.12);
          color *= mix(0.84, 1.0, vig);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
  }, [fallbackColor, fallbackDepth]);

  // Chargement asynchrone propre des 6 planches photoréalistes + calcul de leurs cartes de profondeur 3D
  useEffect(() => {
    let disposed = false;
    const loader = new THREE.TextureLoader();
    const createdTextures: THREE.Texture[] = [];

    SCENE_IMAGE_URLS.forEach((url, index) => {
      loader.load(
        url,
        (tex) => {
          if (disposed) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.needsUpdate = true;

          const img = tex.image as HTMLImageElement;
          const aspect = img && img.height > 0 ? img.width / img.height : 16 / 9;
          const depthTex = buildArchitecturalDepthMap(img);

          createdTextures.push(tex, depthTex);
          layersRef.current[index] = { colorTex: tex, depthTex, aspect };
        },
        undefined,
        () => {
          // Garde le placeholder sobre en cas d'erreur réseau isolée
        }
      );
    });

    return () => {
      disposed = true;
      layersRef.current = [null, null, null, null, null, null];
      createdTextures.forEach((t) => t.dispose());
      fallbackColor.dispose();
      fallbackDepth.dispose();
      shaderMaterial.dispose();
    };
  }, [fallbackColor, fallbackDepth, shaderMaterial]);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const elapsed = clock.getElapsedTime();

    const targetScroll = motionStore.scrollProgress;
    smoothedScroll.current = THREE.MathUtils.damp(
      smoothedScroll.current,
      targetScroll,
      motionStore.reducedMotion ? MOTION_DAMPING.cameraReduced : MOTION_DAMPING.cameraRail,
      dt
    );

    // Respiration optique + parallaxe curseur
    const breathX = motionStore.reducedMotion ? 0 : Math.cos(elapsed * 0.32) * 0.004;
    const breathY = motionStore.reducedMotion ? 0 : Math.sin(elapsed * 0.41) * 0.003;
    const targetPx = (isMobile ? 0 : motionStore.pointerX * 0.022) + breathX;
    const targetPy = (isMobile ? 0 : motionStore.pointerY * 0.014) + breathY;

    smoothedPointer.current.x = THREE.MathUtils.damp(
      smoothedPointer.current.x,
      targetPx,
      MOTION_DAMPING.pointerParallax,
      dt
    );
    smoothedPointer.current.y = THREE.MathUtils.damp(
      smoothedPointer.current.y,
      targetPy,
      MOTION_DAMPING.pointerParallax,
      dt
    );

    // Intensité de réponse lumineuse lorsque l'utilisateur survole un élément interactif
    const hasInteractiveFocus =
      motionStore.heroSteleHoverIndex !== -1 ||
      motionStore.hoveredAboutPillar !== -1 ||
      motionStore.focusedExpertisePole !== -1 ||
      motionStore.focusedProjectIndex !== -1 ||
      motionStore.activeContactChannel !== -1;

    smoothedFocus.current = THREE.MathUtils.damp(
      smoothedFocus.current,
      hasInteractiveFocus ? 1.0 : 0.0,
      5.0,
      dt
    );

    const { indexA, indexB, blend, chamberProgress } = computeSceneBlend(
      smoothedScroll.current
    );
    const layerA = layersRef.current[indexA];
    const layerB = layersRef.current[indexB];

    const u = shaderMaterial.uniforms;
    u.uColorA.value = layerA ? layerA.colorTex : fallbackColor;
    u.uDepthA.value = layerA ? layerA.depthTex : fallbackDepth;
    u.uAspectA.value = layerA ? layerA.aspect : 16 / 9;

    u.uColorB.value = layerB ? layerB.colorTex : fallbackColor;
    u.uDepthB.value = layerB ? layerB.depthTex : fallbackDepth;
    u.uAspectB.value = layerB ? layerB.aspect : 16 / 9;

    u.uViewportAspect.value = size.height > 0 ? size.width / size.height : 16 / 9;
    u.uBlend.value = blend;
    u.uChamberDolly.value = chamberProgress;
    u.uPointer.value.copy(smoothedPointer.current);
    u.uTime.value = elapsed;
    u.uFocusBoost.value = smoothedFocus.current;
    u.uIsMobile.value = isMobile ? 1.0 : 0.0;
    u.uReducedMotion.value = motionStore.reducedMotion ? 1.0 : 0.0;
  });

  return (
    <group name="PhotorealChiaroscuroWorld">
      <mesh position={[0, 0, 0]} material={shaderMaterial}>
        <planeGeometry args={[viewport.width, viewport.height]} />
      </mesh>
      <ContreJourMotes isMobile={isMobile} />
    </group>
  );
}
