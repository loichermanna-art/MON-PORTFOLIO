import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CANONICAL_SCENE_BANDS, MOTION_DAMPING } from '../motion/motionConfig';
import { motionStore } from '../motion/motionStore';

const SKY_SCENE_URLS = [
  '/scenes/sky-01-hero.jpg',
  '/scenes/sky-02-about.jpg',
  '/scenes/sky-03-expertise.jpg',
  '/scenes/sky-04-projects.jpg',
  '/scenes/sky-05-process.jpg',
  '/scenes/sky-06-contact.jpg',
] as const;

interface LoadedSkyLayer {
  colorTex: THREE.Texture;
  aspect: number;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Calcule les deux paliers d'altitude [0..5] et le facteur de traversée nuageuse continu [0..1]
 * à partir de la progression canonique de scroll [0..1].
 */
function computeAltitudeBlend(progress: number): {
  indexA: number;
  indexB: number;
  blend: number;
  bandProgress: number;
} {
  const p = Math.max(0, Math.min(1, progress));
  const centers = CANONICAL_SCENE_BANDS.map((b, i) =>
    i === 0 ? 0.04 : i === 5 ? 0.965 : (b.start + b.end) * 0.5
  );

  if (p <= centers[0]) {
    return {
      indexA: 0,
      indexB: 0,
      blend: 0,
      bandProgress: p / Math.max(0.01, centers[0]),
    };
  }
  const last = centers.length - 1;
  if (p >= centers[last]) {
    return { indexA: last, indexB: last, blend: 0, bandProgress: 1 };
  }

  for (let i = 0; i < last; i++) {
    const c0 = centers[i];
    const c1 = centers[i + 1];
    if (p >= c0 && p <= c1) {
      const span = c1 - c0;
      const rawT = (p - c0) / span;
      const blend = smoothstep(0.24, 0.86, rawT);
      return { indexA: i, indexB: i + 1, blend, bandProgress: rawT };
    }
  }

  return { indexA: 0, indexB: 0, blend: 0, bandProgress: 0 };
}

function createSkyPlaceholderTexture(): THREE.DataTexture {
  // #F5F8FC — Ciel stratosphérique clair par défaut (aucun flash noir au chargement)
  const data = new Uint8Array([245, 248, 252, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Résout l'angle azimutal cible (en radians) de l'instrument d'horizon 3D
 * selon les interactions UI sur les 6 sections (About, Expertise, Projets, Démarche, Contact).
 */
function resolveTargetAzimuth(): number {
  const scene = motionStore.activeScene;
  if (scene === 0 && motionStore.heroSteleHoverIndex >= 0) {
    return (motionStore.heroSteleHoverIndex / 4) * Math.PI * 1.5;
  }
  if (scene === 1) {
    const idx =
      motionStore.hoveredAboutPillar >= 0
        ? motionStore.hoveredAboutPillar
        : motionStore.selectedAboutPillar;
    return (idx / 3) * Math.PI * 2;
  }
  if (scene === 2) {
    const idx =
      motionStore.focusedExpertisePole >= 0
        ? motionStore.focusedExpertisePole
        : motionStore.selectedExpertiseIndex;
    return (idx / 4) * Math.PI * 2;
  }
  if (scene === 3 && motionStore.focusedProjectIndex >= 0) {
    return (motionStore.focusedProjectIndex - 1) * 0.65;
  }
  if (scene === 4) {
    return (motionStore.activeProcessStep / 6) * Math.PI * 2;
  }
  if (scene === 5) {
    const ch =
      motionStore.activeContactChannel >= 0
        ? motionStore.activeContactChannel
        : motionStore.selectedContactChannel;
    if (ch >= 0) return ((ch + 1) / 3) * Math.PI * 1.4;
  }
  return motionStore.scrollProgress * Math.PI * 2.5;
}

/**
 * Instrument d'horizon aérospatial 3D ultra-fin (filets #202A36 + bille ambre solaire #F59E0B)
 * couplant physiquement les interactions UI des 6 séquences à l'espace WebGL.
 */
function ZenithHorizonInstrument({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const beaconGroupRef = useRef<THREE.Group>(null);
  const smoothedAzimuth = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const reduced = motionStore.reducedMotion;
    const t = clock.getElapsedTime();

    const targetAz = resolveTargetAzimuth();
    smoothedAzimuth.current = THREE.MathUtils.damp(
      smoothedAzimuth.current,
      targetAz,
      reduced ? 9.0 : 4.2,
      dt
    );

    // En Scène 05 (Ma démarche), l'instrument se centre côté droit derrière l'anneau orbital
    const isProcess = motionStore.activeScene === 4;
    const targetX = isMobile ? 0 : isProcess ? 1.15 : 0.0;
    const targetY = isProcess ? -0.05 : 0.25;
    const targetScale = isMobile ? 0.72 : isProcess ? 1.12 : 0.96;

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetX + (reduced ? 0 : motionStore.pointerX * 0.14),
      3.8,
      dt
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY + (reduced ? 0 : motionStore.pointerY * 0.1),
      3.8,
      dt
    );
    const s = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 3.8, dt);
    groupRef.current.scale.setScalar(s);

    // Inclinaison perspective aérospatiale douce
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      isProcess ? -0.58 : -0.92 + (reduced ? 0 : motionStore.pointerY * 0.08),
      3.8,
      dt
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      reduced ? 0 : motionStore.pointerX * 0.12,
      3.8,
      dt
    );

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = reduced ? 0 : t * 0.05;
    }
    if (beaconGroupRef.current) {
      beaconGroupRef.current.rotation.z = smoothedAzimuth.current;
    }
  });

  const radius = 1.65;

  return (
    <group ref={groupRef} position={[0, 0.25, -0.8]}>
      <mesh ref={outerRingRef}>
        <ringGeometry args={[radius - 0.006, radius, 128]} />
        <meshBasicMaterial
          color="#202A36"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <ringGeometry args={[radius * 0.72 - 0.004, radius * 0.72, 96]} />
        <meshBasicMaterial
          color="#202A36"
          transparent
          opacity={0.09}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <group ref={beaconGroupRef}>
        <mesh position={[radius, 0, 0.01]}>
          <circleGeometry args={[0.028, 24]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.85} depthWrite={false} />
        </mesh>
        <mesh position={[radius, 0, 0.005]}>
          <ringGeometry args={[0.042, 0.054, 32]} />
          <meshBasicMaterial color="#D97706" transparent opacity={0.38} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

export function PhotorealDepthStage({ isMobile }: { isMobile: boolean }) {
  const { viewport, size } = useThree();
  const smoothedScroll = useRef(0);
  const smoothedPointer = useRef(new THREE.Vector2(0, 0));
  const smoothedFocus = useRef(0);

  const fallbackSky = useMemo(() => createSkyPlaceholderTexture(), []);
  const layersRef = useRef<Array<LoadedSkyLayer | null>>([
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
        uColorA: { value: fallbackSky },
        uAspectA: { value: 16 / 9 },
        uColorB: { value: fallbackSky },
        uAspectB: { value: 16 / 9 },
        uViewportAspect: { value: 16 / 9 },
        uBlend: { value: 0 },
        uBandProgress: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uFocusBoost: { value: 0 },
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
        uniform float uAspectA;
        uniform sampler2D uColorB;
        uniform float uAspectB;
        uniform float uViewportAspect;
        uniform float uBlend;
        uniform float uBandProgress;
        uniform vec2 uPointer;
        uniform float uTime;
        uniform float uFocusBoost;
        uniform float uReducedMotion;

        varying vec2 vUv;

        // Bruit continu pour les voiles nuageux stratosphériques vivants (inspiré Sky Zenith)
        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float valueNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash21(i);
          float b = hash21(i + vec2(1.0, 0.0));
          float c = hash21(i + vec2(0.0, 1.0));
          float d = hash21(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbmClouds(vec2 p) {
          float sum = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 4; i++) {
            sum += amp * valueNoise(p);
            p = p * 2.03 + vec2(1.7, 9.2);
            amp *= 0.5;
          }
          return sum;
        }

        // Cadrage rectilinéaire "object-fit: cover" sans AUCUNE déformation des lignes architecturales
        vec2 coverUv(vec2 uv, float imgAspect, float viewAspect) {
          vec2 centered = uv - 0.5;
          if (viewAspect > imgAspect) {
            centered.y *= imgAspect / viewAspect;
          } else {
            centered.x *= viewAspect / imgAspect;
          }
          return centered + 0.5;
        }

        vec3 sampleSkyVista(
          sampler2D colorMap,
          float imgAspect,
          vec2 baseUv,
          float zoomScale,
          vec2 panOffset
        ) {
          vec2 uvCov = coverUv(baseUv, imgAspect, uViewportAspect);
          // Léger plané optique rectilinéaire façon caméra héliportée stabilisée
          vec2 zoomed = (uvCov - vec2(0.5, 0.44)) / zoomScale + vec2(0.5, 0.44) + panOffset;
          zoomed = clamp(zoomed, 0.002, 0.998);
          return texture2D(colorMap, zoomed).rgb;
        }

        void main() {
          float t = uBlend;
          float reduced = uReducedMotion;

          // Plané altitudinal doux sans distorsion géométrique
          float zoomA = 1.018 + (uBandProgress * 0.032 + t * 0.028) * (1.0 - reduced);
          float zoomB = mix(1.055, 1.018, t);

          vec2 panA = uPointer * (1.0 - reduced) + vec2(0.0, -t * 0.018 * (1.0 - reduced));
          vec2 panB = uPointer * (1.0 - reduced) + vec2(0.0, (1.0 - t) * 0.018 * (1.0 - reduced));

          vec3 colA = sampleSkyVista(uColorA, uAspectA, vUv, zoomA, panA);
          vec3 colB = sampleSkyVista(uColorB, uAspectB, vUv, zoomB, panB);

          // Transition "Clouds Clearing" : un voile nuageux doux accompagne le passage d'un palier à l'autre
          float cloudDriftTime = uTime * 0.035 * (1.0 - reduced);
          vec2 cloudCoord = vec2(vUv.x * 2.6 - cloudDriftTime, vUv.y * 3.4 - cloudDriftTime * 0.25);
          float cloudField = fbmClouds(cloudCoord);

          float softTransition = smoothstep(
            0.0,
            1.0,
            t * 1.14 - (1.0 - cloudField) * 0.14 * sin(t * 3.14159265)
          );
          vec3 color = mix(colA, colB, clamp(softTransition, 0.0, 1.0));

          // Voiles de cumulus vivants dérivant en continu sur la mer de nuages basse (comme dans Sky Zenith)
          float lowerSkyMask = (1.0 - smoothstep(0.18, 0.56, vUv.y));
          float wisps = smoothstep(0.46, 0.82, fbmClouds(vec2(vUv.x * 3.2 + cloudDriftTime * 1.4, vUv.y * 5.0)));
          color = mix(color, vec3(0.985, 0.99, 1.0), wisps * lowerSkyMask * 0.16 * (1.0 - reduced));

          // Brume lumineuse passagère lors du changement d'altitude
          float transitionVeil = sin(t * 3.14159265) * 0.16 * (1.0 - reduced);
          color = mix(color, vec3(0.97, 0.98, 0.995), transitionVeil * (0.45 + 0.55 * cloudField));

          // Scintillement solaire ambre chaleureux sur les reflets dorés lors des interactions UI
          float warmMask = smoothstep(0.06, 0.22, color.r - color.b) * smoothstep(0.35, 0.85, color.r);
          float pulse = 0.5 + 0.5 * sin(uTime * 1.35) * (1.0 - reduced);
          color += vec3(0.08, 0.045, 0.01) * warmMask * (0.35 * pulse + uFocusBoost * 0.85);

          // Clarté stratosphérique calme en partie haute garantissant un contraste AAA (#202A36 > 13:1)
          float upperSkyCalm = smoothstep(0.50, 0.88, vUv.y);
          vec3 zenithSky = mix(vec3(0.955, 0.968, 0.986), vec3(0.982, 0.988, 0.996), vUv.y);
          color = mix(color, zenithSky, upperSkyCalm * 0.34);

          gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
  }, [fallbackSky]);

  useEffect(() => {
    let disposed = false;
    const loader = new THREE.TextureLoader();
    const loadedTextures: THREE.Texture[] = [];

    SKY_SCENE_URLS.forEach((url, index) => {
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

          loadedTextures.push(tex);
          layersRef.current[index] = { colorTex: tex, aspect };
        },
        undefined,
        () => {
          // Conserve le ciel stratosphérique clair de secours
        }
      );
    });

    return () => {
      disposed = true;
      layersRef.current = [null, null, null, null, null, null];
      loadedTextures.forEach((t) => t.dispose());
      fallbackSky.dispose();
      shaderMaterial.dispose();
    };
  }, [fallbackSky, shaderMaterial]);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const elapsed = clock.getElapsedTime();

    smoothedScroll.current = THREE.MathUtils.damp(
      smoothedScroll.current,
      motionStore.scrollProgress,
      motionStore.reducedMotion ? MOTION_DAMPING.cameraReduced : MOTION_DAMPING.cameraRail,
      dt
    );

    const breathX = motionStore.reducedMotion ? 0 : Math.cos(elapsed * 0.24) * 0.003;
    const breathY = motionStore.reducedMotion ? 0 : Math.sin(elapsed * 0.31) * 0.002;
    const targetPx = (isMobile ? 0 : -motionStore.pointerX * 0.011) + breathX;
    const targetPy = (isMobile ? 0 : -motionStore.pointerY * 0.008) + breathY;

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

    const { indexA, indexB, blend, bandProgress } = computeAltitudeBlend(
      smoothedScroll.current
    );
    const layerA = layersRef.current[indexA];
    const layerB = layersRef.current[indexB];

    const u = shaderMaterial.uniforms;
    u.uColorA.value = layerA ? layerA.colorTex : fallbackSky;
    u.uAspectA.value = layerA ? layerA.aspect : 16 / 9;
    u.uColorB.value = layerB ? layerB.colorTex : fallbackSky;
    u.uAspectB.value = layerB ? layerB.aspect : 16 / 9;
    u.uViewportAspect.value = size.height > 0 ? size.width / size.height : 16 / 9;
    u.uBlend.value = blend;
    u.uBandProgress.value = bandProgress;
    u.uPointer.value.copy(smoothedPointer.current);
    u.uTime.value = elapsed;
    u.uFocusBoost.value = smoothedFocus.current;
    u.uReducedMotion.value = motionStore.reducedMotion ? 1.0 : 0.0;
  });

  return (
    <group name="SkyZenithWorld">
      <mesh position={[0, 0, 0]} renderOrder={-10} material={shaderMaterial}>
        <planeGeometry args={[viewport.width, viewport.height]} />
      </mesh>
      <ZenithHorizonInstrument isMobile={isMobile} />
    </group>
  );
}
