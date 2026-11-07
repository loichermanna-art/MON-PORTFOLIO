import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CANONICAL_SCENE_BANDS, MOTION_DAMPING } from '../motion/motionConfig';
import { motionStore } from '../motion/motionStore';
import { ArchitecturalStructures3D } from './ArchitecturalStructures3D';

const DUSK_SCENE_URLS = [
  '/scenes/dusk-01-zenith.jpg',
  '/scenes/dusk-02-stratus.jpg',
  '/scenes/dusk-04-cobalt.jpg',
  '/scenes/dusk-05-orbit.jpg',
  '/scenes/dusk-03-horizon.jpg',
  '/scenes/dusk-06-afterglow.jpg',
] as const;

const FLIGHT_START_Z = 5.5;
const FLIGHT_SPAN_Z = 47.0; // Travelling continu de z = +5.5 jusqu'au Belvédère z = -41.5

interface LoadedSkyLayer {
  colorTex: THREE.Texture;
  aspect: number;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

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
      const blend = smoothstep(0.18, 0.88, rawT);
      return { indexA: i, indexB: i + 1, blend, bandProgress: rawT };
    }
  }

  return { indexA: 0, indexB: 0, blend: 0, bandProgress: 0 };
}

function createMidnightPlaceholderTexture(): THREE.DataTexture {
  // #071426 — Midnight Blue de référence
  const data = new Uint8Array([7, 20, 38, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

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
    return (idx / 6) * Math.PI * 2;
  }
  if (scene === 2) {
    const idx =
      motionStore.focusedExpertisePole >= 0
        ? motionStore.focusedExpertisePole
        : motionStore.selectedExpertiseIndex;
    return (idx / 5) * Math.PI * 2;
  }
  if (scene === 3 && motionStore.focusedProjectIndex >= 0) {
    return (motionStore.focusedProjectIndex - 1.5) * 0.65;
  }
  if (scene === 4) {
    return (motionStore.activeProcessStep / 6) * Math.PI * 2;
  }
  if (scene === 5 && motionStore.activeContactChannel >= 0) {
    return ((motionStore.activeContactChannel + 1) / 4) * Math.PI * 1.4;
  }
  return motionStore.scrollProgress * Math.PI * 3.0;
}

/**
 * Résout le cadrage latéral intentionnel de la caméra en fonction de la scène active
 * et de l'élément sélectionné (stèle, monolithe, pavillon projet ou portique).
 */
function resolveNarrativeLateralOffset(isMobile: boolean): number {
  if (isMobile) return 0;
  const scene = motionStore.activeScene;
  if (scene === 0 && motionStore.heroSteleHoverIndex >= 0) {
    return 0.14 + motionStore.heroSteleHoverIndex * 0.06;
  }
  if (scene === 1) {
    const idx =
      motionStore.hoveredAboutPillar >= 0
        ? motionStore.hoveredAboutPillar
        : motionStore.selectedAboutPillar;
    return (idx % 2 === 0 ? 1 : -1) * 0.24;
  }
  if (scene === 2) {
    const idx =
      motionStore.focusedExpertisePole >= 0
        ? motionStore.focusedExpertisePole
        : motionStore.selectedExpertiseIndex;
    return (idx - 2) * 0.22;
  }
  if (scene === 3) {
    const pIdx =
      motionStore.caseStudyOpenIndex >= 0
        ? motionStore.caseStudyOpenIndex
        : motionStore.focusedProjectIndex;
    if (pIdx >= 0) {
      return (pIdx % 2 === 0 ? 1 : -1) * 0.38;
    }
  }
  return 0;
}

/**
 * Anneau atmosphérique Midnight Blue (#102747 -> #76A9E8) fondu organiquement dans la brume.
 */
function createAtmosphericRingMaterial(
  innerR: number,
  outerR: number,
  maxOpacity: number,
  azureMix: number
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uInnerR: { value: innerR },
      uOuterR: { value: outerR },
      uPhase: { value: 0 },
      uOpacity: { value: maxOpacity },
      uAzureMix: { value: azureMix },
      uCamZ: { value: FLIGHT_START_Z },
    },
    vertexShader: /* glsl */ `
      varying vec3 vLocalPos;
      varying vec3 vWorldPos;
      void main() {
        vLocalPos = position;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uInnerR;
      uniform float uOuterR;
      uniform float uPhase;
      uniform float uOpacity;
      uniform float uAzureMix;
      uniform float uCamZ;

      varying vec3 vLocalPos;
      varying vec3 vWorldPos;

      void main() {
        float r = length(vLocalPos.xy);
        float band = clamp((r - uInnerR) / max(0.0001, uOuterR - uInnerR), 0.0, 1.0);
        float radialSoft = pow(sin(band * 3.14159265), 1.9);

        float theta = atan(vLocalPos.y, vLocalPos.x);
        float wave1 = 0.5 + 0.5 * sin(theta + uPhase);
        float wave2 = 0.5 + 0.5 * cos(theta * 2.0 - uPhase * 0.65);
        float arcMask = smoothstep(0.14, 0.86, wave1 * 0.72 + wave2 * 0.28);

        float distZ = uCamZ - vWorldPos.z;
        float nearFade = smoothstep(0.8, 3.4, distZ);
        float farFade = 1.0 - smoothstep(14.0, 29.0, distZ);
        float depthFade = nearFade * farFade;

        // Palette Midnight Blue pure (#174477 -> #76A9E8 -> #E8EDF5)
        vec3 deepSteel = vec3(0.090, 0.267, 0.467);
        vec3 azureGlow = vec3(0.463, 0.663, 0.910);
        float crest = pow(wave1, 2.4) * uAzureMix;
        vec3 col = mix(deepSteel, azureGlow, crest);

        float alpha = radialSoft * arcMask * depthFade * uOpacity;
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}

function DepthOculusHalos({ isMobile }: { isMobile: boolean }) {
  const portals = useMemo(() => {
    const configs = [
      { z: -2.2, x: 0.35, y: 0.16, radius: 2.55, tiltX: 0.26, tiltY: -0.24, speed: 0.14, azure: 0.65 },
      { z: -11.5, x: -0.48, y: 0.08, radius: 2.65, tiltX: -0.34, tiltY: 0.28, speed: -0.12, azure: 0.55 },
      { z: -20.5, x: 0.0, y: 0.12, radius: 2.85, tiltX: 0.38, tiltY: 0.18, speed: 0.15, azure: 0.72 },
      { z: -29.5, x: 0.42, y: -0.06, radius: 2.75, tiltX: -0.36, tiltY: -0.26, speed: -0.13, azure: 0.68 },
      { z: -43.2, x: 0.0, y: 0.1, radius: 3.15, tiltX: 0.18, tiltY: 0.08, speed: 0.1, azure: 0.85 },
    ];

    return configs.map((cfg) => {
      const width = 0.3;
      const matOuter = createAtmosphericRingMaterial(
        cfg.radius - width,
        cfg.radius,
        isMobile ? 0.18 : 0.24,
        cfg.azure
      );
      const matInner = createAtmosphericRingMaterial(
        cfg.radius * 0.74 - width * 0.75,
        cfg.radius * 0.74,
        isMobile ? 0.13 : 0.18,
        cfg.azure * 0.75
      );
      return { ...cfg, width, matOuter, matInner };
    });
  }, [isMobile]);

  useEffect(() => {
    return () => {
      portals.forEach((p) => {
        p.matOuter.dispose();
        p.matInner.dispose();
      });
    };
  }, [portals]);

  useFrame(({ camera, clock }) => {
    if (motionStore.isTabHidden) return;
    const t = motionStore.reducedMotion ? 1.2 : clock.getElapsedTime();
    const camZ = camera.position.z;

    for (let i = 0; i < portals.length; i++) {
      const p = portals[i];
      p.matOuter.uniforms.uPhase.value = t * p.speed * 2.0 + i * 1.3;
      p.matOuter.uniforms.uCamZ.value = camZ;
      p.matInner.uniforms.uPhase.value = -t * p.speed * 1.6 + i * 2.1 + 1.5;
      p.matInner.uniforms.uCamZ.value = camZ;
    }
  });

  return (
    <group name="DepthOculusHalos">
      {portals.map((p, idx) => (
        <group
          key={idx}
          position={[p.x, p.y, p.z]}
          rotation={[p.tiltX, p.tiltY, idx * 0.45]}
          renderOrder={-6}
        >
          <mesh material={p.matOuter}>
            <ringGeometry args={[p.radius - p.width, p.radius, 128, 1]} />
          </mesh>
          <mesh rotation={[0.28, -0.22, 0]} material={p.matInner}>
            <ringGeometry
              args={[p.radius * 0.74 - p.width * 0.75, p.radius * 0.74, 112, 1]}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BlendedHorizonGyroscope({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const smoothedAzimuth = useRef(0);

  const radius = isMobile ? 1.55 : 2.05;
  const bandW = 0.28;

  const { matA, matB } = useMemo(() => {
    return {
      matA: createAtmosphericRingMaterial(radius - bandW, radius, 0.25, 0.78),
      matB: createAtmosphericRingMaterial(
        radius * 0.76 - bandW * 0.8,
        radius * 0.76,
        0.18,
        0.55
      ),
    };
  }, [radius]);

  useEffect(() => {
    return () => {
      matA.dispose();
      matB.dispose();
    };
  }, [matA, matB]);

  useFrame(({ camera, clock }, delta) => {
    if (!groupRef.current || motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const reduced = motionStore.reducedMotion;
    const t = clock.getElapsedTime();

    const targetAz = resolveTargetAzimuth();
    smoothedAzimuth.current = THREE.MathUtils.damp(
      smoothedAzimuth.current,
      targetAz,
      reduced ? 8.0 : 3.4,
      dt
    );

    groupRef.current.position.z = camera.position.z - 6.8;
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      camera.position.x * 0.65 + (reduced ? 0 : motionStore.pointerX * 0.2),
      3.4,
      dt
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      0.1 + (reduced ? 0 : motionStore.pointerY * 0.14),
      3.4,
      dt
    );

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      -0.72 + (reduced ? 0 : motionStore.pointerY * 0.09),
      3.4,
      dt
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      (reduced ? 0 : Math.sin(t * 0.16) * 0.16) + motionStore.pointerX * 0.12,
      3.4,
      dt
    );

    if (ringARef.current) {
      ringARef.current.rotation.z = smoothedAzimuth.current + (reduced ? 0 : t * 0.07);
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.z = -smoothedAzimuth.current * 0.7 - (reduced ? 0 : t * 0.05);
    }

    matA.uniforms.uPhase.value = smoothedAzimuth.current + (reduced ? 0 : t * 0.32);
    matA.uniforms.uCamZ.value = camera.position.z;
    matB.uniforms.uPhase.value = -smoothedAzimuth.current + (reduced ? 1.4 : -t * 0.25);
    matB.uniforms.uCamZ.value = camera.position.z;
  });

  return (
    <group ref={groupRef} renderOrder={-6}>
      <mesh ref={ringARef} material={matA}>
        <ringGeometry args={[radius - bandW, radius, 128, 1]} />
      </mesh>
      <mesh ref={ringBRef} rotation={[0.42, 0.28, 0]} material={matB}>
        <ringGeometry args={[radius * 0.76 - bandW * 0.8, radius * 0.76, 112, 1]} />
      </mesh>
    </group>
  );
}

function VolumetricMidnightClouds({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 14 : 22;

  const clouds = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const ratio = i / Math.max(1, count - 1);
      const z = 3.0 - ratio * 48.0;
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (1.1 + ((i * 37) % 10) * 0.22);
      const y = -0.95 + ((i * 53) % 10) * 0.17;
      const scaleW = 5.6 + ((i * 19) % 7) * 0.65;
      const scaleH = 2.9 + ((i * 29) % 5) * 0.42;
      const seed = i * 3.71;

      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: seed },
          uCamZ: { value: FLIGHT_START_Z },
        },
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
          uniform float uTime;
          uniform float uSeed;
          uniform float uCamZ;

          varying vec2 vUv;
          varying vec3 vWorldPos;

          float hash21(vec2 p) {
            p = fract(p * vec2(127.1, 311.7));
            p += dot(p, p + 34.23);
            return fract(p.x * p.y);
          }

          float vnoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
              mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
              f.y
            );
          }

          float fbm(vec2 p) {
            float s = 0.0;
            float a = 0.5;
            for (int i = 0; i < 4; i++) {
              s += a * vnoise(p);
              p = p * 2.04 + vec2(4.1, 2.7);
              a *= 0.5;
            }
            return s;
          }

          void main() {
            vec2 centered = (vUv - 0.5) * 2.0;
            float radial = 1.0 - clamp(length(centered), 0.0, 1.0);
            float mask = pow(radial, 2.25);

            vec2 drift = vec2(uTime * 0.02, uTime * 0.005);
            float n = fbm(vUv * 3.1 + vec2(uSeed) + drift);
            float cloudDensity = smoothstep(0.32, 0.78, n) * mask;

            float distZ = uCamZ - vWorldPos.z;
            float nearFade = smoothstep(0.6, 3.4, distZ);
            float farFade = 1.0 - smoothstep(15.0, 29.0, distZ);

            // Nuances Midnight Blue (#071426 -> #102747 -> #76A9E8)
            vec3 baseMist = vec3(0.027, 0.078, 0.149);
            vec3 crestMist = vec3(0.090, 0.267, 0.467);
            vec3 azureCrest = vec3(0.463, 0.663, 0.910);
            vec3 col = mix(baseMist, crestMist, smoothstep(0.38, 0.78, n));
            col = mix(col, azureCrest, smoothstep(0.66, 0.94, n) * vUv.y * 0.22);

            float alpha = cloudDensity * nearFade * farFade * 0.34;
            gl_FragColor = vec4(col, alpha);
          }
        `,
      });

      items.push({ x, y, z, scaleW, scaleH, mat });
    }
    return items;
  }, [count]);

  useEffect(() => {
    return () => {
      clouds.forEach((c) => c.mat.dispose());
    };
  }, [clouds]);

  useFrame(({ camera, clock }) => {
    if (motionStore.isTabHidden) return;
    const t = motionStore.reducedMotion ? 0 : clock.getElapsedTime();
    const camZ = camera.position.z;
    for (let i = 0; i < clouds.length; i++) {
      clouds[i].mat.uniforms.uTime.value = t;
      clouds[i].mat.uniforms.uCamZ.value = camZ;
    }
  });

  return (
    <group name="VolumetricMidnightClouds">
      {clouds.map((c, idx) => (
        <mesh
          key={idx}
          position={[c.x, c.y, c.z]}
          renderOrder={idx % 2 === 0 ? -4 : -7}
          material={c.mat}
        >
          <planeGeometry args={[c.scaleW, c.scaleH]} />
        </mesh>
      ))}
    </group>
  );
}

export function PhotorealDepthStage({ isMobile }: { isMobile: boolean }) {
  const { camera, size } = useThree();
  const backdropMeshRef = useRef<THREE.Mesh>(null);
  const smoothedScroll = useRef(0);
  const smoothedPointer = useRef(new THREE.Vector2(0, 0));
  const smoothedLateral = useRef(0);
  const smoothedFocus = useRef(0);

  const fallbackMidnight = useMemo(() => createMidnightPlaceholderTexture(), []);
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
        uColorA: { value: fallbackMidnight },
        uAspectA: { value: 16 / 9 },
        uColorB: { value: fallbackMidnight },
        uAspectB: { value: 16 / 9 },
        uViewportAspect: { value: 16 / 9 },
        uBlend: { value: 0 },
        uBandProgress: { value: 0 },
        uScroll: { value: 0 },
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
        uniform float uScroll;
        uniform vec2 uPointer;
        uniform float uTime;
        uniform float uFocusBoost;
        uniform float uReducedMotion;

        varying vec2 vUv;

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

        vec2 coverUv(vec2 uv, float imgAspect, float viewAspect) {
          vec2 centered = uv - 0.5;
          if (viewAspect > imgAspect) {
            centered.y *= imgAspect / viewAspect;
          } else {
            centered.x *= viewAspect / imgAspect;
          }
          return centered + 0.5;
        }

        vec3 sampleDuskVista(
          sampler2D colorMap,
          float imgAspect,
          vec2 baseUv,
          float zoomScale,
          vec2 panOffset
        ) {
          vec2 uvCov = coverUv(baseUv, imgAspect, uViewportAspect);
          vec2 horizonCenter = vec2(0.5, 0.52);
          vec2 zoomed = (uvCov - horizonCenter) / zoomScale + horizonCenter + panOffset;
          zoomed = clamp(zoomed, 0.003, 0.997);
          return texture2D(colorMap, zoomed).rgb;
        }

        void main() {
          float t = uBlend;
          float reduced = uReducedMotion;

          float zoomA = 1.03 + (uBandProgress * 0.11 + t * 0.07) * (1.0 - reduced);
          float zoomB = mix(1.14, 1.03, t);

          vec2 panA = uPointer * (1.0 - reduced) + vec2(0.0, -t * 0.026 * (1.0 - reduced));
          vec2 panB = uPointer * (1.0 - reduced) + vec2(0.0, (1.0 - t) * 0.026 * (1.0 - reduced));

          vec3 colA = sampleDuskVista(uColorA, uAspectA, vUv, zoomA, panA);
          vec3 colB = sampleDuskVista(uColorB, uAspectB, vUv, zoomB, panB);

          float drift = uTime * 0.025 * (1.0 - reduced);
          float cloudField = fbmClouds(vec2(vUv.x * 2.5 - drift, vUv.y * 3.2 + uScroll * 1.4));

          float softTransition = smoothstep(
            0.0,
            1.0,
            t * 1.12 - (1.0 - cloudField) * 0.12 * sin(t * 3.14159265)
          );
          vec3 raw = mix(colA, colB, clamp(softTransition, 0.0, 1.0));

          // Étalonnage chromatique Midnight Blue (#071426 -> #102747 -> #76A9E8) basse luminance
          float lum = dot(raw, vec3(0.2126, 0.7152, 0.0722));
          vec3 midnightShadow = vec3(0.027, 0.078, 0.149); // #071426
          vec3 midnightDeep = vec3(0.063, 0.153, 0.278);   // #102747
          vec3 midnightAzure = vec3(0.463, 0.663, 0.910);  // #76A9E8

          vec3 graded = mix(midnightShadow, midnightDeep, smoothstep(0.04, 0.42, lum));
          graded = mix(graded, midnightAzure, smoothstep(0.38, 0.92, lum) * (0.48 + uScroll * 0.16));
          vec3 color = mix(raw * 0.80, graded, 0.48);

          // Ouverture lumineuse progressive sur la scène finale Contact (06)
          float finalBelvedere = smoothstep(0.86, 1.0, uScroll);
          color += midnightAzure * finalBelvedere * 0.07 * smoothstep(0.2, 0.85, vUv.y);
          color += midnightAzure * uFocusBoost * 0.04;

          vec2 vigUv = vUv - 0.5;
          float vignette = 1.0 - dot(vigUv, vigUv) * 0.52;
          color *= clamp(vignette, 0.58, 1.0);

          gl_FragColor = vec4(clamp(color, 0.0, 0.86), 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
  }, [fallbackMidnight]);

  useEffect(() => {
    let disposed = false;
    const loader = new THREE.TextureLoader();
    const loadedTextures: THREE.Texture[] = [];

    DUSK_SCENE_URLS.forEach((url, index) => {
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
        () => {}
      );
    });

    return () => {
      disposed = true;
      layersRef.current = [null, null, null, null, null, null];
      loadedTextures.forEach((t) => t.dispose());
      fallbackMidnight.dispose();
      shaderMaterial.dispose();
    };
  }, [fallbackMidnight, shaderMaterial]);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);
    const elapsed = clock.getElapsedTime();
    const reduced = motionStore.reducedMotion;

    smoothedScroll.current = THREE.MathUtils.damp(
      smoothedScroll.current,
      motionStore.scrollProgress,
      reduced ? MOTION_DAMPING.cameraReduced : MOTION_DAMPING.cameraRail,
      dt
    );

    const breathX = reduced ? 0 : Math.cos(elapsed * 0.2) * 0.0035;
    const breathY = reduced ? 0 : Math.sin(elapsed * 0.27) * 0.0028;
    const targetPx = (isMobile ? 0 : -motionStore.pointerX * 0.016) + breathX;
    const targetPy = (isMobile ? 0 : -motionStore.pointerY * 0.012) + breathY;

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

    const narrativeLat = reduced ? 0 : resolveNarrativeLateralOffset(isMobile);
    smoothedLateral.current = THREE.MathUtils.damp(
      smoothedLateral.current,
      narrativeLat,
      3.6,
      dt
    );

    // Travelling cinématographique Z (+5.5 -> -41.5) + approche légère si une étude de cas est ouverte
    const caseStudyApproach =
      !reduced && motionStore.caseStudyOpenIndex >= 0 ? -0.85 : 0;
    const camZ =
      FLIGHT_START_Z - smoothedScroll.current * FLIGHT_SPAN_Z + caseStudyApproach;
    camera.position.z = camZ;
    camera.position.x =
      smoothedLateral.current + (reduced ? 0 : -smoothedPointer.current.x * 14.0);
    camera.position.y = reduced ? 0 : -smoothedPointer.current.y * 10.0;

    const velBank = reduced
      ? 0
      : Math.max(-0.02, Math.min(0.02, motionStore.scrollVelocity * 0.00012));
    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      velBank + (reduced ? 0 : smoothedPointer.current.x * 0.55),
      4.0,
      dt
    );
    camera.rotation.y = THREE.MathUtils.damp(
      camera.rotation.y,
      reduced ? 0 : -smoothedLateral.current * 0.08,
      3.8,
      dt
    );

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov =
        40 + (reduced ? 0 : Math.min(2.8, Math.abs(motionStore.scrollVelocity) * 0.002));
      if (Math.abs(camera.fov - targetFov) > 0.02) {
        camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 4.5, dt);
        camera.updateProjectionMatrix();
      }

      if (backdropMeshRef.current) {
        const dist = 36.0;
        const vFovRad = THREE.MathUtils.degToRad(camera.fov);
        const planeH = 2 * Math.tan(vFovRad * 0.5) * dist * 1.1;
        const aspect = size.height > 0 ? size.width / size.height : 16 / 9;
        const planeW = planeH * aspect;

        backdropMeshRef.current.position.set(
          camera.position.x,
          camera.position.y,
          camZ - dist
        );
        backdropMeshRef.current.rotation.z = camera.rotation.z;
        backdropMeshRef.current.scale.set(planeW, planeH, 1);
      }
    }

    const hasInteractiveFocus =
      motionStore.heroSteleHoverIndex !== -1 ||
      motionStore.hoveredAboutPillar !== -1 ||
      motionStore.focusedExpertisePole !== -1 ||
      motionStore.focusedProjectIndex !== -1 ||
      motionStore.caseStudyOpenIndex !== -1 ||
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
    u.uColorA.value = layerA ? layerA.colorTex : fallbackMidnight;
    u.uAspectA.value = layerA ? layerA.aspect : 16 / 9;
    u.uColorB.value = layerB ? layerB.colorTex : fallbackMidnight;
    u.uAspectB.value = layerB ? layerB.aspect : 16 / 9;
    u.uViewportAspect.value = size.height > 0 ? size.width / size.height : 16 / 9;
    u.uBlend.value = blend;
    u.uBandProgress.value = bandProgress;
    u.uScroll.value = smoothedScroll.current;
    u.uPointer.value.copy(smoothedPointer.current);
    u.uTime.value = elapsed;
    u.uFocusBoost.value = smoothedFocus.current;
    u.uReducedMotion.value = reduced ? 1.0 : 0.0;
  });

  return (
    <group name="MidnightBlueNarrativeWorld">
      <mesh ref={backdropMeshRef} renderOrder={-20} material={shaderMaterial}>
        <planeGeometry args={[1, 1]} />
      </mesh>

      <DepthOculusHalos isMobile={isMobile} />
      <BlendedHorizonGyroscope isMobile={isMobile} />
      <ArchitecturalStructures3D isMobile={isMobile} />
      <VolumetricMidnightClouds isMobile={isMobile} />
    </group>
  );
}
