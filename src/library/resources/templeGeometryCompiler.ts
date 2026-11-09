import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function normalizeForMerge(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const nonIdx = geo.index ? geo.toNonIndexed() : geo.clone();
  if (!nonIdx.getAttribute('normal')) {
    nonIdx.computeVertexNormals();
  }
  const posCount = nonIdx.getAttribute('position').count;
  if (!nonIdx.getAttribute('uv')) {
    const uvs = new Float32Array(posCount * 2);
    const pos = nonIdx.getAttribute('position');
    for (let i = 0; i < posCount; i++) {
      uvs[i * 2] = (pos.getX(i) + pos.getZ(i)) * 0.35;
      uvs[i * 2 + 1] = pos.getY(i) * 0.35;
    }
    nonIdx.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  }
  // Keep only position, normal, uv so attributes match identically
  for (const key of Object.keys(nonIdx.attributes)) {
    if (key !== 'position' && key !== 'normal' && key !== 'uv') {
      nonIdx.deleteAttribute(key);
    }
  }
  return nonIdx;
}

/**
 * Builds a true 20-flute classical-contemporary Temple Column (Plinth + Attic Base +
 * Entasis Fluted Shaft + Echinus + Abacus Capital) merged into a single BufferGeometry.
 */
export function createFlutedColumnGeometry(
  totalHeight = 6.0,
  shaftRadius = 0.34
): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  const plinthH = 0.24;
  const plinthW = shaftRadius * 2.75;
  const plinth = new THREE.BoxGeometry(plinthW, plinthH, plinthW);
  plinth.translate(0, plinthH * 0.5, 0);
  parts.push(normalizeForMerge(plinth));

  // Attic base profile (double torus + scotia) via LatheGeometry
  const baseH = 0.32;
  const basePts = [
    new THREE.Vector2(0.01, plinthH),
    new THREE.Vector2(shaftRadius * 1.34, plinthH),
    new THREE.Vector2(shaftRadius * 1.36, plinthH + 0.08),
    new THREE.Vector2(shaftRadius * 1.18, plinthH + 0.16),
    new THREE.Vector2(shaftRadius * 1.26, plinthH + 0.24),
    new THREE.Vector2(shaftRadius * 1.04, plinthH + baseH),
  ];
  const atticBase = new THREE.LatheGeometry(basePts, 32);
  parts.push(normalizeForMerge(atticBase));

  // Capital (necking + curved echinus + square abacus)
  const abacusH = 0.2;
  const echinusH = 0.3;
  const shaftBottomY = plinthH + baseH;
  const shaftTopY = Math.max(shaftBottomY + 1.0, totalHeight - abacusH - echinusH);

  // 20-flute entasis shaft
  const flutes = 20;
  const radialSegs = flutes * 4; // 80 radial steps around circumference
  const heightSegs = 14;
  const shaftH = shaftTopY - shaftBottomY;

  const shaftGeo = new THREE.CylinderGeometry(
    shaftRadius * 0.88,
    shaftRadius,
    shaftH,
    radialSegs,
    heightSegs,
    false
  );
  const posAttr = shaftGeo.getAttribute('position');
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i); // [-shaftH/2 .. +shaftH/2]
    const vz = posAttr.getZ(i);
    const r = Math.hypot(vx, vz);
    if (r > 0.001) {
      const t = (vy + shaftH * 0.5) / shaftH; // [0..1]
      // Classical entasis swell peaking around 1/3 height, tapering toward neck
      const entasis = 1.0 + 0.028 * Math.sin(t * Math.PI) - 0.11 * t * t;
      const angle = Math.atan2(vz, vx);
      // 20 concave flutes fading softly near base & necking
      const endFade = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
      const fluteWave = Math.max(0, Math.cos(angle * flutes));
      const fluteGroove = 1.0 - 0.068 * fluteWave * endFade;
      const newR = shaftRadius * entasis * fluteGroove;
      posAttr.setX(i, (vx / r) * newR);
      posAttr.setZ(i, (vz / r) * newR);
    }
  }
  shaftGeo.computeVertexNormals();
  shaftGeo.translate(0, shaftBottomY + shaftH * 0.5, 0);
  parts.push(normalizeForMerge(shaftGeo));

  // Echinus & astragal ring
  const topR = shaftRadius * 0.89;
  const capPts = [
    new THREE.Vector2(topR * 0.98, shaftTopY),
    new THREE.Vector2(topR * 1.08, shaftTopY + 0.05),
    new THREE.Vector2(topR * 1.03, shaftTopY + 0.09),
    new THREE.Vector2(topR * 1.36, shaftTopY + echinusH * 0.82),
    new THREE.Vector2(topR * 1.42, shaftTopY + echinusH),
    new THREE.Vector2(0.01, shaftTopY + echinusH),
  ];
  const echinus = new THREE.LatheGeometry(capPts, 32);
  parts.push(normalizeForMerge(echinus));

  // Square Abacus slab
  const abacusW = shaftRadius * 2.82;
  const abacus = new THREE.BoxGeometry(abacusW, abacusH, abacusW);
  abacus.translate(0, totalHeight - abacusH * 0.5, 0);
  parts.push(normalizeForMerge(abacus));

  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  return merged;
}

/**
 * Builds a real load-bearing Temple Portal Wall with a true semicircular arched opening,
 * projecting archivolt trim, and carved keystone (`construction-principles.md`).
 */
export function createArchedPortalWallGeometry(
  wallWidth: number,
  wallHeight: number,
  archClearWidth: number,
  archSpringY: number,
  thickness = 0.72
): THREE.BufferGeometry {
  const halfW = wallWidth * 0.5;
  const halfArch = archClearWidth * 0.5;

  const shape = new THREE.Shape();
  shape.moveTo(-halfW, 0);
  shape.lineTo(halfW, 0);
  shape.lineTo(halfW, wallHeight);
  shape.lineTo(-halfW, wallHeight);
  shape.closePath();

  // Semicircular arched void cut cleanly out of the masonry wall
  const hole = new THREE.Path();
  hole.moveTo(-halfArch, 0);
  hole.lineTo(-halfArch, archSpringY);
  hole.absarc(0, archSpringY, halfArch, Math.PI, 0, true);
  hole.lineTo(halfArch, 0);
  hole.closePath();
  shape.holes.push(hole);

  const wallGeo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 28,
  });
  wallGeo.translate(0, 0, -thickness * 0.5);

  // Projecting molded archivolt ring around the arch
  const ringShape = new THREE.Shape();
  const outerR = halfArch + 0.34;
  ringShape.moveTo(-outerR, 0);
  ringShape.lineTo(-outerR, archSpringY);
  ringShape.absarc(0, archSpringY, outerR, Math.PI, 0, true);
  ringShape.lineTo(outerR, 0);
  ringShape.lineTo(halfArch, 0);
  ringShape.lineTo(halfArch, archSpringY);
  ringShape.absarc(0, archSpringY, halfArch, 0, Math.PI, false);
  ringShape.lineTo(-halfArch, 0);
  ringShape.closePath();

  const archivoltGeo = new THREE.ExtrudeGeometry(ringShape, {
    depth: thickness + 0.16,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 2,
    curveSegments: 28,
  });
  archivoltGeo.translate(0, 0, -(thickness + 0.16) * 0.5);

  // Carved keystone at crown of arch
  const crownY = archSpringY + halfArch + 0.18;
  const keystone = new THREE.BoxGeometry(0.46, 0.58, thickness + 0.28);
  keystone.translate(0, crownY, 0);

  // Crowning cornice molding across top of portal wall
  const cornice = new THREE.BoxGeometry(
    wallWidth + 0.45,
    0.34,
    thickness + 0.36
  );
  cornice.translate(0, wallHeight - 0.17, 0);

  const parts = [wallGeo, archivoltGeo, keystone, cornice].map(normalizeForMerge);
  const merged = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  wallGeo.dispose();
  archivoltGeo.dispose();
  keystone.dispose();
  cornice.dispose();
  return merged;
}

/**
 * Transverse Coffered Ceiling Rib spanning across a Temple Hall
 */
export function createTransverseCeilingArchGeometry(
  hallWidth: number,
  springY: number,
  ceilingY: number,
  depth = 0.48
): THREE.BufferGeometry {
  const halfSpan = hallWidth * 0.5;
  const rise = Math.max(0.45, ceilingY - springY - 0.25);
  // Chord-radius formula for segmental arch: R = (halfSpan^2 + rise^2) / (2 * rise)
  const radius = (halfSpan * halfSpan + rise * rise) / (2 * rise);
  const centerY = springY + rise - radius;
  const halfAngle = Math.asin(Math.min(0.999, halfSpan / radius));

  const shape = new THREE.Shape();
  shape.moveTo(-halfSpan - 0.25, springY);
  shape.lineTo(-halfSpan - 0.25, ceilingY);
  shape.lineTo(halfSpan + 0.25, ceilingY);
  shape.lineTo(halfSpan + 0.25, springY);
  shape.absarc(
    0,
    centerY,
    radius,
    Math.PI * 0.5 - halfAngle,
    Math.PI * 0.5 + halfAngle,
    false
  );
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 1,
    curveSegments: 28,
  });
  geo.translate(0, 0, -depth * 0.5);
  const norm = normalizeForMerge(geo);
  geo.dispose();
  return norm;
}

/**
 * Ceremonial Bronze Sanctuary Brazier / Torchère Pedestal
 */
export function createTempleBrazierGeometry(): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.36, 0),
    new THREE.Vector2(0.36, 0.1),
    new THREE.Vector2(0.22, 0.2),
    new THREE.Vector2(0.11, 0.95),
    new THREE.Vector2(0.18, 1.08),
    new THREE.Vector2(0.44, 1.28),
    new THREE.Vector2(0.48, 1.38),
    new THREE.Vector2(0.38, 1.38),
    new THREE.Vector2(0.32, 1.26),
    new THREE.Vector2(0.01, 1.24),
  ];
  const lathe = new THREE.LatheGeometry(pts, 24);
  const norm = normalizeForMerge(lathe);
  lathe.dispose();
  return norm;
}

/**
 * Analytic Rayleigh/Mie Golden-Hour Temple Sky Dome Shader
 */
export function createTempleSkyMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uSunDir: { value: new THREE.Vector3(-0.18, 0.24, -0.95).normalize() },
      uZenithColor: { value: new THREE.Color('#0c2244') },
      uMidSkyColor: { value: new THREE.Color('#4a80bc') },
      uHorizonColor: { value: new THREE.Color('#ebd5b3') },
      uSunColor: { value: new THREE.Color('#fff2d6') },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldDir;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldDir = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDir;
      uniform vec3 uZenithColor;
      uniform vec3 uMidSkyColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uSunColor;
      varying vec3 vWorldDir;

      void main() {
        vec3 dir = normalize(vWorldDir);
        float h = clamp(dir.y, 0.0, 1.0);
        vec3 sky = mix(uHorizonColor, uMidSkyColor, smoothstep(0.0, 0.28, h));
        sky = mix(sky, uZenithColor, smoothstep(0.22, 0.88, h));

        float sunCos = max(dot(dir, uSunDir), 0.0);
        float mieHalo = pow(sunCos, 12.0) * 0.36 + pow(sunCos, 96.0) * 0.55;
        float sunDisc = smoothstep(0.9985, 0.9996, sunCos) * 1.4;
        sky += uSunColor * (mieHalo + sunDisc);

        // Below horizon calm reflection tint
        if (dir.y < 0.0) {
          sky = mix(uHorizonColor * 0.72, uZenithColor * 0.55, clamp(-dir.y * 3.0, 0.0, 1.0));
        }

        gl_FragColor = vec4(sky, 1.0);
      }
    `,
  });
}

/**
 * Volumetric Architectural Sunbeam Shaft Material (zero post-processing cost,
 * soft Fresnel edge-fade + vertical attenuation + near-camera fade).
 */
export function createVolumetricSunbeamMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color('#f5f6f8') },
      uIntensity: { value: 0.068 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewPos;
      void main() {
        vUv = uv;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        vNormalView = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewPos;

      void main() {
        vec3 viewDir = normalize(vViewPos);
        float fresnel = pow(abs(dot(vNormalView, viewDir)), 1.75);
        float vertFade = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.58, vUv.y);
        float camDist = length(vViewPos);
        float nearFade = smoothstep(1.2, 4.2, camDist);
        float alpha = uIntensity * fresnel * vertFade * nearFade;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });
}

/**
 * Sacred Reflecting Pool Animated Water Surface Shader
 */
export function createSacredWaterMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeepColor: { value: new THREE.Color('#0b0c0e') },
      uSkyReflect: { value: new THREE.Color('#787d87') },
      uSunGlint: { value: new THREE.Color('#ffffff') },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uDeepColor;
      uniform vec3 uSkyReflect;
      uniform vec3 uSunGlint;
      varying vec3 vWorldPos;

      void main() {
        vec2 p = vWorldPos.xz * 0.65;
        float w1 = sin(p.x * 2.3 + uTime * 0.85) * cos(p.y * 1.9 - uTime * 0.65);
        float w2 = sin((p.x + p.y) * 3.7 - uTime * 1.15) * 0.5;
        vec3 n = normalize(vec3((w1 + w2) * 0.045, 1.0, (w1 - w2) * 0.045));

        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - clamp(dot(n, viewDir), 0.0, 1.0), 3.2);
        vec3 col = mix(uDeepColor, uSkyReflect, clamp(0.28 + fresnel * 0.72, 0.0, 1.0));

        vec3 sunDir = normalize(vec3(-0.18, 0.32, -0.93));
        vec3 halfVec = normalize(sunDir + viewDir);
        float spec = pow(max(dot(n, halfVec), 0.0), 90.0);
        col += uSunGlint * spec * 0.55;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}
