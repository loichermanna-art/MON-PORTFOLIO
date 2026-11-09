import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createCableStayedBridgeGeometry,
  createSkyscraperFacadeMaterial,
  createSteppedSkyscraperGeometry,
  createTaperedSupertallGeometry,
} from '../resources/metropolisCompiler';
import { createSacredWaterMaterial } from '../resources/templeGeometryCompiler';
import type { LibraryMaterialPalette } from '../resources/useLibraryMaterials';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

interface MetropolisWorld3DProps {
  materials: LibraryMaterialPalette;
}

const noRaycast = () => null;

interface TowerSpec {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  rotY: number;
}

interface TrafficAgent {
  axis: 'x' | 'z';
  laneCoord: number; // z if axis==='x', x if axis==='z'
  y: number;
  minPos: number;
  maxPos: number;
  speed: number;
  phase: number;
  isHeadlight: boolean;
}

export function MetropolisWorld3D({ materials }: MetropolisWorld3DProps) {
  const atmosphereMood = useLibraryStore((s) => s.atmosphereMood);
  const reducedMotion = useLibraryStore((s) => s.reducedMotion);

  const steppedTowersRef = useRef<THREE.InstancedMesh>(null);
  const glassTowersRef = useRef<THREE.InstancedMesh>(null);
  const trafficInstRef = useRef<THREE.InstancedMesh>(null);
  const beaconsMatRef = useRef<THREE.PointsMaterial>(null);

  // 1. Compile Geometries & Custom Facade / Lagoon Shaders
  const cityKit = useMemo(() => {
    const steppedGeo = createSteppedSkyscraperGeometry();
    const supertallGeo = createTaperedSupertallGeometry();
    const bridge = createCableStayedBridgeGeometry();

    const stoneFacadeMat = createSkyscraperFacadeMaterial('stoneArtDeco');
    const glassFacadeMat = createSkyscraperFacadeMaterial('glassCurtain');
    const lagoonWaterMat = createSacredWaterMaterial();

    const trafficGeo = new THREE.BoxGeometry(2.1, 0.22, 0.52);
    const trafficMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      toneMapped: false,
    });

    const cableMat = new THREE.MeshBasicMaterial({
      color: '#d2d6de',
      transparent: true,
      opacity: 0.68,
    });

    return {
      steppedGeo,
      supertallGeo,
      bridgeStructGeo: bridge.structureGeo,
      bridgeCablesGeo: bridge.cablesGeo,
      stoneFacadeMat,
      glassFacadeMat,
      lagoonWaterMat,
      trafficGeo,
      trafficMat,
      cableMat,
    };
  }, []);

  useEffect(() => {
    return () => {
      cityKit.steppedGeo.dispose();
      cityKit.supertallGeo.dispose();
      cityKit.bridgeStructGeo.dispose();
      cityKit.bridgeCablesGeo.dispose();
      cityKit.stoneFacadeMat.dispose();
      cityKit.glassFacadeMat.dispose();
      cityKit.lagoonWaterMat.dispose();
      cityKit.trafficGeo.dispose();
      cityKit.trafficMat.dispose();
      cityKit.cableMat.dispose();
    };
  }, [cityKit]);

  // 2. Deterministic 360° Financial Metropolis Masterplan (156 Skyscrapers + Traffic + Beacons)
  const { steppedSpecs, glassSpecs, beaconsGeo, trafficAgents } = useMemo(() => {
    let seed = 225072026;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const stepped: TowerSpec[] = [];
    const glass: TowerSpec[] = [];

    const addTower = (
      isGlass: boolean,
      x: number,
      z: number,
      w: number,
      h: number,
      d: number,
      rotY = 0,
      y = -0.6
    ) => {
      const spec = { x, y, z, w, h, d, rotY };
      if (isGlass) glass.push(spec);
      else stepped.push(spec);
    };

    // A. YOUR OWN HEADQUARTERS CROWN TOWER rising above Room 03-04 ("TOUR LOÏC AKANDA")
    addTower(false, 0, -49.5, 13.8, 76.0, 14.5, 0, 9.6);

    // B. Left & Right Financial Boulevard Skyscraper Rows (visible through all side curtain walls!)
    for (let z = 34; z >= -104; z -= 17.5) {
      for (const side of [-1, 1]) {
        // First avenue row (x ~ ±24m)
        const x1 = side * (23.5 + rand() * 4.5);
        const w1 = 11.5 + rand() * 4.2;
        const d1 = 11.5 + rand() * 4.2;
        const h1 = 44 + rand() * 68;
        addTower(rand() > 0.48, x1, z + (rand() - 0.5) * 3.5, w1, h1, d1);

        // Second deeper skyline row (x ~ ±46m)
        const x2 = side * (44.0 + rand() * 10.0);
        const w2 = 14.0 + rand() * 6.5;
        const d2 = 14.0 + rand() * 6.5;
        const h2 = 68 + rand() * 96;
        addTower(rand() > 0.42, x2, z + (rand() - 0.5) * 6.0, w2, h2, d2);

        // Outer metropolitan ring (x ~ ±76m)
        const x3 = side * (74.0 + rand() * 16.0);
        const w3 = 16.0 + rand() * 8.0;
        const d3 = 16.0 + rand() * 8.0;
        const h3 = 82 + rand() * 112;
        addTower(rand() > 0.38, x3, z + (rand() - 0.5) * 8.0, w3, h3, d3);
      }
    }

    // C. Behind-Spawn Downtown Plaza Skyline (when visitor turns 180° at z > +25m)
    for (let x = -72; x <= 72; x += 19) {
      if (Math.abs(x) < 12) {
        // Grand axial landmark tower framing the opposite end of the plaza at z = +56m
        addTower(true, 0, 58, 18.0, 142.0, 18.0, Math.PI * 0.25);
        continue;
      }
      addTower(
        rand() > 0.45,
        x + (rand() - 0.5) * 4,
        36 + rand() * 14,
        13 + rand() * 5,
        58 + rand() * 85,
        13 + rand() * 5
      );
      addTower(
        rand() > 0.4,
        x + (rand() - 0.5) * 6,
        66 + rand() * 18,
        16 + rand() * 6,
        85 + rand() * 98,
        16 + rand() * 6
      );
    }

    // D. Across-the-Lagoon Iconic Financial Skyline (facing Room 06 Skydeck at z = -175..-245m!)
    // Centerpiece: Iconic 196m Tapered Supertall (homage to Abidjan's Tour F!)
    addTower(true, 0, -196, 22.0, 196.0, 22.0, Math.PI * 0.125, -0.4);
    // Flanking skyline cluster across the bay
    const bayPositions = [
      -128, -104, -82, -62, -42, -24, 24, 42, 62, 82, 104, 128,
    ];
    for (const bx of bayPositions) {
      const distFactor = 1 - Math.min(1, Math.abs(bx) / 145);
      const hFront = 68 + distFactor * 72 + rand() * 38;
      addTower(
        rand() > 0.44,
        bx,
        -182 - rand() * 16,
        15 + rand() * 5,
        hFront,
        15 + rand() * 5
      );
      addTower(
        rand() > 0.5,
        bx + (rand() - 0.5) * 8,
        -214 - rand() * 20,
        18 + rand() * 7,
        hFront * (0.85 + rand() * 0.35),
        18 + rand() * 7
      );
    }

    // E. Rooftop Red Aviation Warning Beacons atop every tower spire
    const allTowers = [
      ...stepped.map((t) => ({ ...t, tipMult: 1.14 })),
      ...glass.map((t) => ({ ...t, tipMult: 1.18 })),
    ];
    const beaconPositions = new Float32Array(allTowers.length * 3);
    allTowers.forEach((t, idx) => {
      beaconPositions[idx * 3] = t.x;
      beaconPositions[idx * 3 + 1] = t.y + t.h * t.tipMult + 0.4;
      beaconPositions[idx * 3 + 2] = t.z;
    });
    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute('position', new THREE.BufferAttribute(beaconPositions, 3));

    // F. 84 Moving Traffic Vehicles on Cable-Stayed Bridge & Flanking Financial Avenues
    const agents: TrafficAgent[] = [];
    // Bridge lanes (z = -142 +- 2.6, y = 8.05)
    for (let i = 0; i < 36; i++) {
      const dir = i % 2 === 0 ? 1 : -1;
      agents.push({
        axis: 'x',
        laneCoord: -142 + (dir > 0 ? 2.4 : -2.4),
        y: 8.05,
        minPos: -155,
        maxPos: 155,
        speed: dir * (14 + rand() * 9),
        phase: rand(),
        isHeadlight: dir > 0,
      });
    }
    // Left & Right Financial Boulevards (x = -13.2 & +13.2, y = -0.32)
    for (const side of [-1, 1]) {
      for (let i = 0; i < 24; i++) {
        const dir = i % 2 === 0 ? 1 : -1;
        agents.push({
          axis: 'z',
          laneCoord: side * 13.2 + (dir > 0 ? 1.3 : -1.3),
          y: -0.25,
          minPos: -106,
          maxPos: 34,
          speed: dir * (10 + rand() * 6),
          phase: rand(),
          isHeadlight: dir < 0,
        });
      }
    }

    return {
      steppedSpecs: stepped,
      glassSpecs: glass,
      beaconsGeo: bGeo,
      trafficAgents: agents,
    };
  }, []);

  useEffect(() => {
    return () => {
      beaconsGeo.dispose();
    };
  }, [beaconsGeo]);

  // Populate skyscraper matrices once
  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (steppedTowersRef.current) {
      steppedSpecs.forEach((t, i) => {
        dummy.position.set(t.x, t.y, t.z);
        dummy.rotation.set(0, t.rotY, 0);
        dummy.scale.set(t.w, t.h, t.d);
        dummy.updateMatrix();
        steppedTowersRef.current!.setMatrixAt(i, dummy.matrix);
      });
      steppedTowersRef.current.instanceMatrix.needsUpdate = true;
    }

    if (glassTowersRef.current) {
      glassSpecs.forEach((t, i) => {
        dummy.position.set(t.x, t.y, t.z);
        dummy.rotation.set(0, t.rotY, 0);
        dummy.scale.set(t.w, t.h, t.d);
        dummy.updateMatrix();
        glassTowersRef.current!.setMatrixAt(i, dummy.matrix);
      });
      glassTowersRef.current.instanceMatrix.needsUpdate = true;
    }

    if (trafficInstRef.current) {
      const warmHeadlight = new THREE.Color('#fff2d6');
      const rubyTaillight = new THREE.Color('#ff4a3d');
      trafficAgents.forEach((ag, i) => {
        trafficInstRef.current!.setColorAt(
          i,
          ag.isHeadlight ? warmHeadlight : rubyTaillight
        );
      });
      if (trafficInstRef.current.instanceColor) {
        trafficInstRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [steppedSpecs, glassSpecs, trafficAgents]);

  // Sync shader mood uniforms whenever atmosphereMood changes
  useEffect(() => {
    const nightFactor =
      atmosphereMood === 'night'
        ? 1.0
        : atmosphereMood === 'twilight'
          ? 0.72
          : 0.08;
    const hazeHex =
      atmosphereMood === 'night'
        ? '#0a0b0d'
        : atmosphereMood === 'twilight'
          ? '#1e2025'
          : '#d6d9df';

    for (const mat of [cityKit.stoneFacadeMat, cityKit.glassFacadeMat]) {
      mat.uniforms.uNightFactor.value = nightFactor;
      mat.uniforms.uHazeColor.value.set(hazeHex);
    }

    if (atmosphereMood === 'night') {
      cityKit.lagoonWaterMat.uniforms.uDeepColor.value.set('#07080a');
      cityKit.lagoonWaterMat.uniforms.uSkyReflect.value.set('#30333a');
      cityKit.lagoonWaterMat.uniforms.uSunGlint.value.set('#e8eaee');
      cityKit.cableMat.opacity = 0.78;
    } else if (atmosphereMood === 'twilight') {
      cityKit.lagoonWaterMat.uniforms.uDeepColor.value.set('#0c0d10');
      cityKit.lagoonWaterMat.uniforms.uSkyReflect.value.set('#686d76');
      cityKit.lagoonWaterMat.uniforms.uSunGlint.value.set('#f5f5f7');
      cityKit.cableMat.opacity = 0.66;
    } else {
      cityKit.lagoonWaterMat.uniforms.uDeepColor.value.set('#22252a');
      cityKit.lagoonWaterMat.uniforms.uSkyReflect.value.set('#cfd3da');
      cityKit.lagoonWaterMat.uniforms.uSunGlint.value.set('#ffffff');
      cityKit.cableMat.opacity = 0.5;
    }
  }, [atmosphereMood, cityKit]);

  const trafficDummy = useMemo(() => new THREE.Object3D(), []);

  // Animate lagoon water, aviation beacons & moving traffic light streams at 60Hz
  useFrame(({ clock }) => {
    if (libraryMotionState.isTabHidden) return;
    const t = clock.getElapsedTime();

    cityKit.lagoonWaterMat.uniforms.uTime.value = t;

    if (beaconsMatRef.current) {
      const pulse = reducedMotion ? 0.85 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.6));
      beaconsMatRef.current.opacity =
        atmosphereMood === 'day' ? 0.18 : pulse * 0.95;
    }

    if (trafficInstRef.current) {
      const animT = reducedMotion ? 0 : t;
      for (let i = 0; i < trafficAgents.length; i++) {
        const ag = trafficAgents[i];
        const span = ag.maxPos - ag.minPos;
        const raw =
          (((ag.phase * span + animT * ag.speed) % span) + span) % span;
        const posAlong = ag.minPos + raw;

        if (ag.axis === 'x') {
          trafficDummy.position.set(posAlong, ag.y, ag.laneCoord);
          trafficDummy.rotation.set(0, 0, 0);
        } else {
          trafficDummy.position.set(ag.laneCoord, ag.y, posAlong);
          trafficDummy.rotation.set(0, Math.PI * 0.5, 0);
        }
        trafficDummy.updateMatrix();
        trafficInstRef.current.setMatrixAt(i, trafficDummy.matrix);
      }
      trafficInstRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group name="Metropolis360World">
      {/* 1. Vast 360° Urban Lagoon & Bay (Lagune Ébrié / Financial Bay spirit) */}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, -0.85, -80]}
        material={cityKit.lagoonWaterMat}
        raycast={noRaycast}
      >
        <planeGeometry args={[520, 480]} />
      </mesh>

      {/* 2. Central Financial Peninsula Granite Esplanade & Flanking Boulevards */}
      <mesh
        position={[0, -0.62, -36]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[36.0, 0.45, 148.0]} />
      </mesh>
      {/* Left & Right Urban District Landmasses */}
      <mesh
        position={[-58, -0.68, -32]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[76.0, 0.4, 168.0]} />
      </mesh>
      <mesh
        position={[58, -0.68, -32]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[76.0, 0.4, 168.0]} />
      </mesh>
      {/* Across-the-Bay Financial Island Embankment */}
      <mesh
        position={[0, -0.65, -210]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[340.0, 0.5, 86.0]} />
      </mesh>

      {/* 3. Monumental Cable-Stayed Suspension Bridge ("Pont Financier" at z = -142m) */}
      <group position={[0, -0.6, -142]}>
        <mesh
          geometry={cityKit.bridgeStructGeo}
          material={materials.limestoneMonolith}
          raycast={noRaycast}
        />
        <mesh
          geometry={cityKit.bridgeCablesGeo}
          material={cityKit.cableMat}
          raycast={noRaycast}
        />
      </group>

      {/* 4. 160+ Multi-Tier 3D Skyscrapers Across 360° (ONLY 2 InstancedMesh Draw Calls!) */}
      <instancedMesh
        ref={steppedTowersRef}
        args={[
          cityKit.steppedGeo,
          cityKit.stoneFacadeMat,
          Math.max(1, steppedSpecs.length),
        ]}
        frustumCulled={false}
        raycast={noRaycast}
      />
      <instancedMesh
        ref={glassTowersRef}
        args={[
          cityKit.supertallGeo,
          cityKit.glassFacadeMat,
          Math.max(1, glassSpecs.length),
        ]}
        frustumCulled={false}
        raycast={noRaycast}
      />

      {/* 5. Blinking Red Aviation Warning Beacons on Skyscraper Spires */}
      <points geometry={beaconsGeo} frustumCulled={false} raycast={noRaycast}>
        <pointsMaterial
          ref={beaconsMatRef}
          color="#ff3b30"
          size={1.35}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      {/* 6. Flowing Golden & Ruby Urban Traffic Light-Trails (Bridge + Side Boulevards) */}
      <instancedMesh
        ref={trafficInstRef}
        args={[
          cityKit.trafficGeo,
          cityKit.trafficMat,
          Math.max(1, trafficAgents.length),
        ]}
        frustumCulled={false}
        raycast={noRaycast}
      />
    </group>
  );
}
