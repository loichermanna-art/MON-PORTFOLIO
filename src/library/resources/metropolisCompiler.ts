import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type MetropolisMood = 'twilight' | 'night' | 'day';

function normalizeMerged(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const nonIndexed = parts.map((g) => {
    const ni = g.index ? g.toNonIndexed() : g.clone();
    g.dispose();
    if (!ni.attributes.uv) {
      const count = ni.attributes.position.count;
      ni.setAttribute(
        'uv',
        new THREE.BufferAttribute(new Float32Array(count * 2), 2)
      );
    }
    return ni;
  });
  const merged = mergeGeometries(nonIndexed, false);
  nonIndexed.forEach((g) => g.dispose());
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  return merged;
}

/**
 * 1. Unit Stepped Art-Deco / Corporate Skyscraper Geometry (unit footprint ~1x1, height = 1.0)
 * Scaled per instance to [width, totalHeight, depth] for rich multi-tier skyline silhouettes.
 */
export function createSteppedSkyscraperGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Podium base (0.00 -> 0.14)
  const podium = new THREE.BoxGeometry(1.08, 0.14, 1.08);
  podium.translate(0, 0.07, 0);
  parts.push(podium);

  // Podium cornice ledge
  const podCornice = new THREE.BoxGeometry(1.13, 0.018, 1.13);
  podCornice.translate(0, 0.145, 0);
  parts.push(podCornice);

  // Main lower shaft (0.14 -> 0.62)
  const lowerShaft = new THREE.BoxGeometry(0.94, 0.48, 0.94);
  lowerShaft.translate(0, 0.38, 0);
  parts.push(lowerShaft);

  // Corner vertical piers on lower shaft for crisp architectural relief
  for (const sx of [-0.46, 0.46]) {
    for (const sz of [-0.46, 0.46]) {
      const pier = new THREE.BoxGeometry(0.08, 0.5, 0.08);
      pier.translate(sx, 0.38, sz);
      parts.push(pier);
    }
  }

  // First setback tier (0.62 -> 0.84)
  const midLedge = new THREE.BoxGeometry(0.98, 0.016, 0.98);
  midLedge.translate(0, 0.625, 0);
  parts.push(midLedge);

  const midShaft = new THREE.BoxGeometry(0.76, 0.22, 0.76);
  midShaft.translate(0, 0.73, 0);
  parts.push(midShaft);

  // Upper setback crown (0.84 -> 0.96)
  const crownLedge = new THREE.BoxGeometry(0.8, 0.015, 0.8);
  crownLedge.translate(0, 0.845, 0);
  parts.push(crownLedge);

  const crown = new THREE.BoxGeometry(0.56, 0.12, 0.56);
  crown.translate(0, 0.9, 0);
  parts.push(crown);

  // Penthouse lantern & architectural spire (0.96 -> 1.14)
  const lantern = new THREE.BoxGeometry(0.32, 0.05, 0.32);
  lantern.translate(0, 0.985, 0);
  parts.push(lantern);

  const spire = new THREE.CylinderGeometry(0.008, 0.026, 0.14, 8);
  spire.translate(0, 1.07, 0);
  parts.push(spire);

  return normalizeMerged(parts);
}

/**
 * 2. Tapered Contemporary Glass Supertall Geometry (Abidjan Tour F / One WTC spirit)
 * Unit footprint ~1x1, height = 1.0 (+ spire to 1.18).
 */
export function createTaperedSupertallGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Lobby podium
  const base = new THREE.BoxGeometry(1.06, 0.1, 1.06);
  base.translate(0, 0.05, 0);
  parts.push(base);

  // Tapered octagonal-chamfered supertall shaft (0.10 -> 0.92)
  const shaft = new THREE.CylinderGeometry(0.42, 0.66, 0.82, 8, 1);
  shaft.rotateY(Math.PI / 8);
  shaft.translate(0, 0.51, 0);
  parts.push(shaft);

  // Sky-lobby horizontal belt rings
  for (const ry of [0.38, 0.66, 0.92]) {
    const rScale = THREE.MathUtils.lerp(0.66, 0.42, (ry - 0.1) / 0.82) * 1.04;
    const belt = new THREE.CylinderGeometry(rScale, rScale, 0.016, 8);
    belt.rotateY(Math.PI / 8);
    belt.translate(0, ry, 0);
    parts.push(belt);
  }

  // Illuminated crystal crown & spire
  const crown = new THREE.CylinderGeometry(0.24, 0.4, 0.08, 8);
  crown.rotateY(Math.PI / 8);
  crown.translate(0, 0.96, 0);
  parts.push(crown);

  const mast = new THREE.CylinderGeometry(0.006, 0.022, 0.18, 8);
  mast.translate(0, 1.09, 0);
  parts.push(mast);

  return normalizeMerged(parts);
}

/**
 * 3. Monumental Cable-Stayed Urban Bridge Geometry (Pont HKB / Lagune Ébrié spirit)
 * Spans along X axis [-155..+155], centered at origin.
 */
export function createCableStayedBridgeGeometry(): {
  structureGeo: THREE.BufferGeometry;
  cablesGeo: THREE.BufferGeometry;
} {
  const structParts: THREE.BufferGeometry[] = [];
  const cableParts: THREE.BufferGeometry[] = [];

  // Main highway deck spanning 320m
  const deck = new THREE.BoxGeometry(320, 1.35, 11.5);
  deck.translate(0, 7.2, 0);
  structParts.push(deck);

  // Twin side parapet rails
  for (const sz of [-5.5, 5.5]) {
    const rail = new THREE.BoxGeometry(320, 0.65, 0.35);
    rail.translate(0, 8.1, sz);
    structParts.push(rail);
  }

  // Two monumental A-frame pylons at x = -54 and x = +54
  for (const px of [-54, 54]) {
    // Underwater caisson pier
    const pier = new THREE.BoxGeometry(7.5, 8.0, 15.0);
    pier.translate(px, 3.2, 0);
    structParts.push(pier);

    // Inclined A-frame legs rising to y = 46m
    for (const sideZ of [-1, 1]) {
      const leg = new THREE.BoxGeometry(2.4, 44.0, 2.2);
      leg.rotateX(sideZ * -0.115);
      leg.translate(px, 25.0, sideZ * 3.1);
      structParts.push(leg);
    }

    // Crossbeams
    const crossLow = new THREE.BoxGeometry(2.8, 1.8, 8.6);
    crossLow.translate(px, 19.0, 0);
    structParts.push(crossLow);

    const crossHigh = new THREE.BoxGeometry(2.6, 1.6, 4.4);
    crossHigh.translate(px, 35.5, 0);
    structParts.push(crossHigh);

    // Spire tip
    const pylonCap = new THREE.BoxGeometry(2.5, 4.5, 2.5);
    pylonCap.translate(px, 47.5, 0);
    structParts.push(pylonCap);

    // Harp stay cables fanning left and right from top of pylon
    for (let i = 1; i <= 8; i++) {
      for (const dirX of [-1, 1]) {
        const anchorY = 30.0 + i * 2.0;
        const deckX = px + dirX * (8.0 + i * 5.6);
        const dx = deckX - px;
        const dy = 7.8 - anchorY;
        const len = Math.hypot(dx, dy);
        const angleZ = Math.atan2(dy, dx) - Math.PI * 0.5;

        for (const cz of [-5.1, 5.1]) {
          const cable = new THREE.CylinderGeometry(0.065, 0.065, len, 5);
          cable.rotateZ(angleZ);
          cable.translate((px + deckX) * 0.5, (anchorY + 7.8) * 0.5, cz);
          cableParts.push(cable);
        }
      }
    }
  }

  // Approach viaduct piers
  for (const vx of [-128, -96, 0, 96, 128]) {
    const vPier = new THREE.BoxGeometry(3.2, 7.4, 8.4);
    vPier.translate(vx, 3.5, 0);
    structParts.push(vPier);
  }

  return {
    structureGeo: normalizeMerged(structParts),
    cablesGeo: normalizeMerged(cableParts),
  };
}

/**
 * 4. World-Space Procedural Skyscraper Facade Shader (`InstancedMesh` compatible!)
 * Renders crisp 3.4m office floors, vertical curtain-wall mullions, randomized warm/cool
 * lit office interiors, executive crown lighting, and atmospheric horizon aerial perspective.
 */
export function createSkyscraperFacadeMaterial(
  variant: 'stoneArtDeco' | 'glassCurtain'
): THREE.ShaderMaterial {
  const isGlass = variant === 'glassCurtain';

  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uNightFactor: { value: 0.72 },
      uSunDir: { value: new THREE.Vector3(0.42, 0.24, -0.87).normalize() },
      uBaseWallColor: {
        value: new THREE.Color(isGlass ? '#0d213b' : '#2a3342'),
      },
      uDayWallColor: {
        value: new THREE.Color(isGlass ? '#4b739e' : '#c9bfb0'),
      },
      uHazeColor: { value: new THREE.Color('#193358') },
      uWarmWindow: { value: new THREE.Color('#ffd89c') },
      uCoolWindow: { value: new THREE.Color('#cde4ff') },
      uAccentWindow: { value: new THREE.Color('#76A9E8') },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      varying vec3 vLocalPos;
      varying float vInstanceSeed;

      void main() {
        vLocalPos = position;
        vec4 worldPos = vec4(position, 1.0);
        mat3 normalMat = mat3(modelMatrix);

        #ifdef USE_INSTANCING
          worldPos = instanceMatrix * worldPos;
          normalMat = mat3(modelMatrix) * mat3(instanceMatrix);
          // Deterministic per-tower seed from instance translation
          vInstanceSeed = fract(sin(instanceMatrix[3][0] * 12.9898 + instanceMatrix[3][2] * 78.233) * 43758.5453);
        #else
          worldPos = modelMatrix * worldPos;
          vInstanceSeed = 0.37;
        #endif

        vWorldPos = worldPos.xyz;
        vWorldNormal = normalize(normalMat * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uNightFactor;
      uniform vec3 uSunDir;
      uniform vec3 uBaseWallColor;
      uniform vec3 uDayWallColor;
      uniform vec3 uHazeColor;
      uniform vec3 uWarmWindow;
      uniform vec3 uCoolWindow;
      uniform vec3 uAccentWindow;

      varying vec3 vWorldPos;
      varying vec3 vWorldNormal;
      varying vec3 vLocalPos;
      varying float vInstanceSeed;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec3 n = normalize(vWorldNormal);
        float isHorizontalFace = step(0.65, abs(n.y));

        // Base directional + sky lighting on structural facade
        float sunDiff = max(dot(n, normalize(uSunDir)), 0.0);
        float hemi = 0.45 + 0.55 * clamp(n.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 wallAlbedo = mix(uDayWallColor, uBaseWallColor, uNightFactor * 0.88);
        vec3 structCol = wallAlbedo * (hemi * mix(0.85, 0.34, uNightFactor) + sunDiff * mix(0.75, 0.28, uNightFactor));

        vec3 finalCol = structCol;

        // Vertical facade window bays (skip horizontal roofs & spire above yLocal=0.97)
        if (isHorizontalFace < 0.5 && vLocalPos.y > 0.03 && vLocalPos.y < 0.975) {
          // Project world coordinates onto facade plane
          float uCoord = abs(n.x) > abs(n.z) ? vWorldPos.z : vWorldPos.x;
          float floorH = 3.4;
          float bayW = ${isGlass ? '2.35' : '2.95'};

          vec2 cell = floor(vec2(uCoord / bayW, vWorldPos.y / floorH));
          vec2 f = fract(vec2(uCoord / bayW, vWorldPos.y / floorH));

          // Mullion & spandrel frame borders
          float marginX = ${isGlass ? '0.09' : '0.18'};
          float marginYBot = ${isGlass ? '0.12' : '0.22'};
          float marginYTop = ${isGlass ? '0.88' : '0.82'};

          float inPane = step(marginX, f.x) * step(f.x, 1.0 - marginX) *
                         step(marginYBot, f.y) * step(f.y, marginYTop);

          if (inPane > 0.5) {
            float rnd = hash21(cell + vInstanceSeed * 97.0);
            float floorRnd = hash21(vec2(cell.y, vInstanceSeed * 53.0));

            // Sky reflection gradient on glass pane
            vec3 glassReflect = mix(vec3(0.08, 0.17, 0.30), vec3(0.45, 0.66, 0.90), clamp(vLocalPos.y * 0.9 + sunDiff * 0.35, 0.0, 1.0));
            glassReflect *= mix(0.95, 0.38, uNightFactor);

            // Interior office occupancy probability
            float occupancyThreshold = mix(0.82, 0.42, uNightFactor);
            // Whole executive floors occasionally lit
            if (floorRnd > 0.86) occupancyThreshold -= 0.28;

            float isLit = step(occupancyThreshold, rnd);

            // Choose realistic office light temperature
            vec3 roomColor = mix(uWarmWindow, uCoolWindow, step(0.58, fract(rnd * 13.7)));
            roomColor = mix(roomColor, uAccentWindow, step(0.90, fract(rnd * 29.3)));

            // Subtle vertical blind / desk gradient inside window pane
            float interiorShade = 0.62 + 0.38 * smoothstep(0.15, 0.85, f.y);
            float blindStripe = 0.88 + 0.12 * sin(f.y * 28.0);
            vec3 litInterior = roomColor * interiorShade * blindStripe * mix(0.25, 1.38, uNightFactor);

            finalCol = mix(glassReflect, litInterior, isLit * smoothstep(0.08, 0.55, uNightFactor + 0.15));
          }
        }

        // Executive illuminated crown band near top of skyscraper (0.90..0.965)
        float crownMask = smoothstep(0.895, 0.915, vLocalPos.y) * (1.0 - smoothstep(0.96, 0.985, vLocalPos.y));
        if (crownMask > 0.01 && isHorizontalFace < 0.5) {
          vec3 crownGlow = mix(uWarmWindow, uAccentWindow, step(0.5, vInstanceSeed));
          finalCol += crownGlow * crownMask * mix(0.12, 0.85, uNightFactor);
        }

        // Aerial perspective city haze with distance
        float dist = length(vWorldPos - cameraPosition);
        float hazeFactor = 1.0 - exp(-dist * 0.0021);
        finalCol = mix(finalCol, uHazeColor, clamp(hazeFactor * 0.82, 0.0, 0.85));

        gl_FragColor = vec4(finalCol, 1.0);
      }
    `,
  });
}

/**
 * 5. Three-Mood Atmospheric Metropolis Sky Dome Shader (Twilight / Night Stars / Bright Day)
 */
export function createMetropolisSkyMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uSunDir: { value: new THREE.Vector3(0.42, 0.16, -0.89).normalize() },
      uZenithColor: { value: new THREE.Color('#081a36') },
      uHorizonColor: { value: new THREE.Color('#2c5382') },
      uSunsetGlowColor: { value: new THREE.Color('#eb9f5e') },
      uStarIntensity: { value: 0.35 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorldDir;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldDir = normalize(wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uSunDir;
      uniform vec3 uZenithColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uSunsetGlowColor;
      uniform float uStarIntensity;

      varying vec3 vWorldDir;

      float starHash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      void main() {
        vec3 d = normalize(vWorldDir);
        float up = clamp(d.y, 0.0, 1.0);
        float horizonMask = pow(1.0 - up, 2.75);

        vec3 col = mix(uZenithColor, uHorizonColor, horizonMask);

        // Solar / twilight directional glow
        float sunCos = max(dot(d, normalize(uSunDir)), 0.0);
        col += uSunsetGlowColor * pow(sunCos, 5.0) * 0.44;
        col += vec3(1.0, 0.95, 0.84) * smoothstep(0.9975, 0.9997, sunCos) * 0.85;

        // Crisp procedural stars in upper sky vault during twilight/night
        if (uStarIntensity > 0.01 && d.y > 0.08) {
          vec3 starCell = floor(d * 260.0);
          float s = starHash(starCell);
          float star = smoothstep(0.9945, 0.9995, s) * smoothstep(0.08, 0.42, d.y);
          col += vec3(0.86, 0.92, 1.0) * star * uStarIntensity;
        }

        // Below-horizon urban lagoon dark reflection base
        if (d.y < 0.0) {
          col = mix(uHorizonColor * 0.65, vec3(0.03, 0.07, 0.14), clamp(-d.y * 4.5, 0.0, 1.0));
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
}
