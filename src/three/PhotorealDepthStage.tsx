import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CANONICAL_SCENE_BANDS, MOTION_DAMPING } from '../motion/motionConfig';
import { motionStore } from '../motion/motionStore';

const DUSK_SCENE_URLS = [
  '/scenes/dusk-01-zenith.jpg',
  '/scenes/dusk-02-stratus.jpg',
  '/scenes/dusk-04-cobalt.jpg',
  '/scenes/dusk-05-orbit.jpg',
  '/scenes/dusk-03-horizon.jpg',
  '/scenes/dusk-06-afterglow.jpg',
] as const;

const FLIGHT_START_Z = 4.5;
const FLIGHT_SPAN_Z = 31.0; // La caméra avance physiquement de z = +4.5 à z = -26.5

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

function createDuskPlaceholderTexture(): THREE.DataTexture {
  // #091220 — Bleu crépusculaire stratosphérique doux (aucun flash blanc ni éblouissement)
  const data = new Uint8Array([9, 18, 32, 255]);
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
    return (motionStore.focusedProjectIndex - 1) * 0.72;
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
  return motionStore.scrollProgress * Math.PI * 3.2;
}

/**
 * Crée un matériau Shader atmosphérique pour anneaux en rotation qui SE FONDENT
 * organiquement dans le ciel crépusculaire et les nuages (bords gaussiens diffus,
 * dissolution angulaire dans la brume et atténuation de profondeur réelle).
 */
function createAtmosphericRingMaterial(
  innerR: number,
  outerR: number,
  maxOpacity: number,
  warmTint: number
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
      uWarmth: { value: warmTint },
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
      uniform float uWarmth;
      uniform float uCamZ;

      varying vec3 vLocalPos;
      varying vec3 vWorldPos;

      void main() {
        float r = length(vLocalPos.xy);
        float band = clamp((r - uInnerR) / max(0.0001, uOuterR - uInnerR), 0.0, 1.0);
        // Profil transversal en cloche ultra-douce : ZÉRO arête vive, aspect halo de brume réfractée
        float radialSoft = pow(sin(band * 3.14159265), 1.85);

        // Dissolution angulaire : une partie de l'anneau s'évanouit complètement dans les nuages
        float theta = atan(vLocalPos.y, vLocalPos.x);
        float wave1 = 0.5 + 0.5 * sin(theta + uPhase);
        float wave2 = 0.5 + 0.5 * cos(theta * 2.0 - uPhase * 0.65);
        float arcMask = smoothstep(0.12, 0.86, wave1 * 0.72 + wave2 * 0.28);

        // Atténuation naturelle selon la distance Z à la caméra (brouillard stratosphérique)
        float distZ = uCamZ - vWorldPos.z;
        float nearFade = smoothstep(0.7, 3.2, distZ);
        float farFade = 1.0 - smoothstep(13.5, 27.0, distZ);
        float depthFade = nearFade * farFade;

        // Palette ton-sur-ton fondue dans le crépuscule bleu nuit + caresse ambre d'horizon sans surbrillance
        vec3 duskSlate = vec3(0.22, 0.34, 0.52);
        vec3 horizonAmber = vec3(0.78, 0.56, 0.32);
        float warmCrest = pow(wave1, 2.6) * uWarmth;
        vec3 col = mix(duskSlate, horizonAmber, warmCrest);

        float alpha = radialSoft * arcMask * depthFade * uOpacity;
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}

/**
 * Portails orbitaux échelonnés en profondeur Z le long du couloir de vol (-1.5 -> -26.0) :
 * L'utilisateur les traverse réellement au scroll pendant qu'ils tournent lentement dans la brume.
 */
function DepthCorridorPortals({ isMobile }: { isMobile: boolean }) {
  const portals = useMemo(() => {
    const configs = [
      { z: -1.6, x: -0.55, y: 0.18, radius: 2.35, tiltX: 0.42, tiltY: -0.28, speed: 0.16, warm: 0.45 },
      { z: -7.4, x: 0.72, y: -0.12, radius: 2.65, tiltX: -0.36, tiltY: 0.34, speed: -0.14, warm: 0.55 },
      { z: -13.4, x: -0.62, y: 0.15, radius: 2.55, tiltX: 0.48, tiltY: 0.24, speed: 0.18, warm: 0.62 },
      { z: -19.5, x: 0.48, y: -0.08, radius: 2.75, tiltX: -0.44, tiltY: -0.3, speed: -0.15, warm: 0.7 },
      { z: -25.4, x: 0.0, y: 0.08, radius: 2.95, tiltX: 0.35, tiltY: 0.18, speed: 0.12, warm: 0.8 },
    ];

    return configs.map((cfg) => {
      const width = 0.30;
      const matOuter = createAtmosphericRingMaterial(
        cfg.radius - width,
        cfg.radius,
        isMobile ? 0.19 : 0.26,
        cfg.warm
      );
      const matInner = createAtmosphericRingMaterial(
        cfg.radius * 0.72 - width * 0.78,
        cfg.radius * 0.72,
        isMobile ? 0.14 : 0.19,
        cfg.warm * 0.75
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
      p.matOuter.uniforms.uPhase.value = t * p.speed * 2.2 + i * 1.3;
      p.matOuter.uniforms.uCamZ.value = camZ;

      p.matInner.uniforms.uPhase.value = -t * p.speed * 1.7 + i * 2.1 + 1.5;
      p.matInner.uniforms.uCamZ.value = camZ;
    }
  });

  return (
    <group name="DepthCorridorPortals">
      {portals.map((p, idx) => (
        <group
          key={idx}
          position={[p.x, p.y, p.z]}
          rotation={[p.tiltX, p.tiltY, idx * 0.5]}
          renderOrder={-6}
        >
          <mesh material={p.matOuter}>
            <ringGeometry args={[p.radius - p.width, p.radius, 128, 1]} />
          </mesh>
          <mesh rotation={[0.32, -0.25, 0]} material={p.matInner}>
            <ringGeometry
              args={[p.radius * 0.72 - p.width * 0.75, p.radius * 0.72, 112, 1]}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Gyroscope céleste interactif accompagnant le vol caméra à mi-profondeur (derrière les bancs de brume proches) :
 * Réagit aux survols/sélections UI des 6 sections tout en restant fondu ton-sur-ton dans l'atmosphère.
 */
function BlendedHorizonGyroscope({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const smoothedAzimuth = useRef(0);

  const radius = isMobile ? 1.55 : 2.05;
  const bandW = 0.28;

  const { matA, matB } = useMemo(() => {
    return {
      matA: createAtmosphericRingMaterial(radius - bandW, radius, 0.27, 0.72),
      matB: createAtmosphericRingMaterial(
        radius * 0.76 - bandW * 0.8,
        radius * 0.76,
        0.20,
        0.52
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

    const isProcess = motionStore.activeScene === 4;
    const targetX = isMobile ? 0 : isProcess ? 1.35 : 0.15;
    const targetY = isProcess ? -0.06 : 0.12;

    // Suit la caméra à une profondeur constante (camZ - 6.2) au cœur des nuages
    groupRef.current.position.z = camera.position.z - 6.2;
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetX + (reduced ? 0 : motionStore.pointerX * 0.22),
      3.4,
      dt
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY + (reduced ? 0 : motionStore.pointerY * 0.15),
      3.4,
      dt
    );

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      isProcess ? -0.52 : -0.78 + (reduced ? 0 : motionStore.pointerY * 0.1),
      3.4,
      dt
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      (reduced ? 0 : Math.sin(t * 0.18) * 0.18) + motionStore.pointerX * 0.14,
      3.4,
      dt
    );

    if (ringARef.current) {
      ringARef.current.rotation.z = smoothedAzimuth.current + (reduced ? 0 : t * 0.08);
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.z = -smoothedAzimuth.current * 0.7 - (reduced ? 0 : t * 0.06);
    }

    matA.uniforms.uPhase.value = smoothedAzimuth.current + (reduced ? 0 : t * 0.35);
    matA.uniforms.uCamZ.value = camera.position.z;
    matB.uniforms.uPhase.value = -smoothedAzimuth.current + (reduced ? 1.4 : -t * 0.28);
    matB.uniforms.uCamZ.value = camera.position.z;
  });

  return (
    <group ref={groupRef} renderOrder={-5}>
      <mesh ref={ringARef} material={matA}>
        <ringGeometry args={[radius - bandW, radius, 128, 1]} />
      </mesh>
      <mesh ref={ringBRef} rotation={[0.42, 0.28, 0]} material={matB}>
        <ringGeometry args={[radius * 0.76 - bandW * 0.8, radius * 0.76, 112, 1]} />
      </mesh>
    </group>
  );
}

/**
 * 18 Bancs de nuages volumétriques crépusculaires répartis en vraie profondeur 3D (z = +2 -> -30) :
 * Traversés physiquement par la caméra au scroll ET passant partiellement devant les anneaux rotatifs
 * pour qu'ils semblent littéralement immergés dans les nuages.
 */
function VolumetricTwilightClouds({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 12 : 18;

  const clouds = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const ratio = i / Math.max(1, count - 1);
      const z = 2.0 - ratio * 31.5;
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (1.1 + ((i * 37) % 10) * 0.22);
      const y = -0.95 + ((i * 53) % 10) * 0.17;
      const scaleW = 5.4 + ((i * 19) % 7) * 0.65;
      const scaleH = 2.8 + ((i * 29) % 5) * 0.42;
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
            // Masque gaussien doux : aucun bord rectangulaire visible
            float mask = pow(radial, 2.25);

            vec2 drift = vec2(uTime * 0.022, uTime * 0.006);
            float n = fbm(vUv * 3.1 + vec2(uSeed) + drift);
            float cloudDensity = smoothstep(0.32, 0.78, n) * mask;

            float distZ = uCamZ - vWorldPos.z;
            float nearFade = smoothstep(0.5, 3.2, distZ);
            float farFade = 1.0 - smoothstep(14.0, 26.0, distZ);

            // Couleur brume crépusculaire douce + lueur d'horizon ambrée subtile sur les crêtes
            vec3 baseMist = vec3(0.08, 0.14, 0.24);
            vec3 crestMist = vec3(0.18, 0.28, 0.44);
            vec3 amberKiss = vec3(0.76, 0.52, 0.28);
            vec3 col = mix(baseMist, crestMist, smoothstep(0.4, 0.8, n));
            col = mix(col, amberKiss, smoothstep(0.62, 0.92, n) * vUv.y * 0.16);

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
    <group name="VolumetricTwilightClouds">
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

/**
 * Particules atmosphériques crépusculaires ultra-discrètes accentuant la sensation de traversée 3D au scroll.
 */
function AtmosphericDepthMotes({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 70 : 130;

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (((i * 73) % 100) / 100 - 0.5) * 11.0;
      positions[i * 3 + 1] = (((i * 41) % 100) / 100 - 0.5) * 6.5;
      positions[i * 3 + 2] = 3.5 - (i / count) * 33.0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uCamZ: { value: FLIGHT_START_Z },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        uniform float uCamZ;
        uniform float uTime;
        varying float vAlpha;

        void main() {
          vec3 p = position;
          p.y += sin(uTime * 0.35 + p.x * 1.4) * 0.08;
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          float distZ = uCamZ - p.z;
          float nearFade = smoothstep(0.6, 2.8, distZ);
          float farFade = 1.0 - smoothstep(12.0, 24.0, distZ);
          vAlpha = nearFade * farFade * 0.24;

          gl_PointSize = clamp(22.0 / max(1.0, -mvPosition.z), 1.5, 5.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c) * 2.0;
          float soft = pow(clamp(1.0 - d, 0.0, 1.0), 2.2);
          vec3 col = vec3(0.68, 0.78, 0.94);
          gl_FragColor = vec4(col, soft * vAlpha);
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ camera, clock }) => {
    if (motionStore.isTabHidden) return;
    material.uniforms.uCamZ.value = camera.position.z;
    material.uniforms.uTime.value = motionStore.reducedMotion ? 0 : clock.getElapsedTime();
  });

  return <points geometry={geometry} material={material} renderOrder={-3} />;
}

export function PhotorealDepthStage({ isMobile }: { isMobile: boolean }) {
  const { camera, size } = useThree();
  const backdropMeshRef = useRef<THREE.Mesh>(null);
  const smoothedScroll = useRef(0);
  const smoothedPointer = useRef(new THREE.Vector2(0, 0));
  const smoothedFocus = useRef(0);

  const fallbackDusk = useMemo(() => createDuskPlaceholderTexture(), []);
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
        uColorA: { value: fallbackDusk },
        uAspectA: { value: 16 / 9 },
        uColorB: { value: fallbackDusk },
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
          // Avancée perspective continue vers l'horizon crépusculaire
          vec2 horizonCenter = vec2(0.5, 0.52);
          vec2 zoomed = (uvCov - horizonCenter) / zoomScale + horizonCenter + panOffset;
          zoomed = clamp(zoomed, 0.003, 0.997);
          return texture2D(colorMap, zoomed).rgb;
        }

        void main() {
          float t = uBlend;
          float reduced = uReducedMotion;

          // Sensation d'avancée profonde vers la mer de nuages (zoom progressif accru au scroll)
          float zoomA = 1.03 + (uBandProgress * 0.11 + t * 0.07) * (1.0 - reduced);
          float zoomB = mix(1.14, 1.03, t);

          vec2 panA = uPointer * (1.0 - reduced) + vec2(0.0, -t * 0.028 * (1.0 - reduced));
          vec2 panB = uPointer * (1.0 - reduced) + vec2(0.0, (1.0 - t) * 0.028 * (1.0 - reduced));

          vec3 colA = sampleDuskVista(uColorA, uAspectA, vUv, zoomA, panA);
          vec3 colB = sampleDuskVista(uColorB, uAspectB, vUv, zoomB, panB);

          float drift = uTime * 0.028 * (1.0 - reduced);
          float cloudField = fbmClouds(vec2(vUv.x * 2.5 - drift, vUv.y * 3.2 + uScroll * 1.4));

          float softTransition = smoothstep(
            0.0,
            1.0,
            t * 1.12 - (1.0 - cloudField) * 0.12 * sin(t * 3.14159265)
          );
          vec3 color = mix(colA, colB, clamp(softTransition, 0.0, 1.0));

          // Maîtrise douce de la luminance : supprime tout éblouissement tout en préservant la richesse du bleu nuit & de l'ambre
          color *= 0.84;

          // Lueur d'horizon ambrée subtile répondant aux interactions UI
          float warmMask = smoothstep(0.04, 0.20, color.r - color.b);
          color += vec3(0.09, 0.05, 0.015) * warmMask * (0.22 + uFocusBoost * 0.55);

          // Vignettage velours périphérique renforçant la profondeur et le confort oculaire
          vec2 vigUv = vUv - 0.5;
          float vignette = 1.0 - dot(vigUv, vigUv) * 0.48;
          color *= clamp(vignette, 0.62, 1.0);

          gl_FragColor = vec4(clamp(color, 0.0, 0.88), 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
  }, [fallbackDusk]);

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
        () => {
          // Conserve le ciel crépusculaire calme de secours
        }
      );
    });

    return () => {
      disposed = true;
      layersRef.current = [null, null, null, null, null, null];
      loadedTextures.forEach((t) => t.dispose());
      fallbackDusk.dispose();
      shaderMaterial.dispose();
    };
  }, [fallbackDusk, shaderMaterial]);

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

    const breathX = reduced ? 0 : Math.cos(elapsed * 0.22) * 0.004;
    const breathY = reduced ? 0 : Math.sin(elapsed * 0.29) * 0.003;
    const targetPx = (isMobile ? 0 : -motionStore.pointerX * 0.018) + breathX;
    const targetPy = (isMobile ? 0 : -motionStore.pointerY * 0.013) + breathY;

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

    // 1. AVANCÉE PHYSIQUE 3D DE LA CAMÉRA SUR L'AXE Z (+4.5 -> -26.5) + ROULIS D'INCLINAISON DOUX
    const camZ = FLIGHT_START_Z - smoothedScroll.current * FLIGHT_SPAN_Z;
    camera.position.z = camZ;
    camera.position.x = reduced ? 0 : -smoothedPointer.current.x * 16.0;
    camera.position.y = reduced ? 0 : -smoothedPointer.current.y * 12.0;

    const velBank = reduced
      ? 0
      : Math.max(-0.024, Math.min(0.024, motionStore.scrollVelocity * 0.00014));
    camera.rotation.z = THREE.MathUtils.damp(
      camera.rotation.z,
      velBank + (reduced ? 0 : smoothedPointer.current.x * 0.65),
      4.0,
      dt
    );

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov =
        40 + (reduced ? 0 : Math.min(3.2, Math.abs(motionStore.scrollVelocity) * 0.0022));
      if (Math.abs(camera.fov - targetFov) > 0.02) {
        camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 4.5, dt);
        camera.updateProjectionMatrix();
      }

      // Maintient le dôme d'horizon photographique verrouillé au fond du frustum caméra
      if (backdropMeshRef.current) {
        const dist = 34.0;
        const vFovRad = THREE.MathUtils.degToRad(camera.fov);
        const planeH = 2 * Math.tan(vFovRad * 0.5) * dist * 1.08;
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
    u.uColorA.value = layerA ? layerA.colorTex : fallbackDusk;
    u.uAspectA.value = layerA ? layerA.aspect : 16 / 9;
    u.uColorB.value = layerB ? layerB.colorTex : fallbackDusk;
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
    <group name="TwilightZenithImmersionWorld">
      {/* Fond d'horizon crépusculaire sans éblouissement */}
      <mesh ref={backdropMeshRef} renderOrder={-20} material={shaderMaterial}>
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Portails rotatifs échelonnés en Z, fondus dans l'atmosphère */}
      <DepthCorridorPortals isMobile={isMobile} />

      {/* Gyroscope d'horizon couplé aux interactions UI, immergé derrière les bancs de brume */}
      <BlendedHorizonGyroscope isMobile={isMobile} />

      {/* 18 Bancs de nuages volumétriques 3D traversés physiquement au scroll */}
      <VolumetricTwilightClouds isMobile={isMobile} />

      {/* Poussières d'étoiles / brume fine 3D donnant la sensation immédiate de vitesse et de profondeur */}
      <AtmosphericDepthMotes isMobile={isMobile} />
    </group>
  );
}
