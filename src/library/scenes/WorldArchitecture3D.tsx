import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { MeshReflectorMaterial, useCursor, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  LIBRARY_MODEL_PATHS,
  type LibraryMaterialPalette,
} from '../resources/useLibraryMaterials';
import {
  createFloorMedallionTexture,
  createRoomLintelTexture,
} from '../resources/proceduralSignage';
import {
  createArchedPortalWallGeometry,
  createFlutedColumnGeometry,
  createSacredWaterMaterial,
  createTempleBrazierGeometry,
  createTransverseCeilingArchGeometry,
  createVolumetricSunbeamMaterial,
} from '../resources/templeGeometryCompiler';
import { ROOMS_3D } from '../data/worldStations';
import { SPATIAL_TIMELINE_MILESTONES } from '../../data/portfolioData';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

interface WorldArchitecture3DProps {
  materials: LibraryMaterialPalette;
}

const noRaycast = () => null;

const BOOK_BINDING_PALETTE = [
  '#1b1d21',
  '#282b30',
  '#383c42',
  '#52565e',
  '#8c9099',
  '#c8ccd4',
  '#e6e7ea',
  '#3e3229',
  '#5a493c',
  '#141518',
  '#f2f3f5',
];

function bindGltfMaterials(
  root: THREE.Object3D,
  materials: LibraryMaterialPalette,
  castShadow = false
): void {
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      const matName = Array.isArray(mesh.material)
        ? mesh.material[0]?.name
        : mesh.material?.name;

      if (matName === 'WalnutMillwork') mesh.material = materials.walnutMillwork;
      else if (matName === 'BurnishedBronze')
        mesh.material = materials.burnishedBronze;
      else if (matName === 'BrushedBrass') mesh.material = materials.brushedBrass;
      else if (matName === 'ArchitecturalGlass')
        mesh.material = materials.architecturalGlass;
      else if (matName === 'WarmOpalDiffuser')
        mesh.material = materials.warmOpalDiffuser;

      mesh.castShadow = castShadow;
      mesh.receiveShadow = castShadow;
      mesh.raycast = noRaycast;
    }
  });
}

export function WorldArchitecture3D({ materials }: WorldArchitecture3DProps) {
  const deviceTier = useLibraryStore((s) => s.deviceTier);
  const walkToFloorPoint = useLibraryStore((s) => s.walkToFloorPoint);
  const walkToRoom = useLibraryStore((s) => s.walkToRoom);
  const inspectStation = useLibraryStore((s) => s.inspectStation);
  const activeRoomIndex = useLibraryStore((s) => s.activeRoomIndex);

  const [floorHovered, setFloorHovered] = useState(false);
  const [waypointHovered, setWaypointHovered] = useState(false);
  useCursor(waypointHovered, 'pointer', floorHovered ? 'crosshair' : 'grab');

  const reticleGroupRef = useRef<THREE.Group>(null);
  const reticleTargetRef = useRef(new THREE.Vector3(0, 0.02, 6));
  const leftDoorPivotRef = useRef<THREE.Group>(null);
  const rightDoorPivotRef = useRef<THREE.Group>(null);
  const columnsInstRef = useRef<THREE.InstancedMesh>(null);
  const braziersInstRef = useRef<THREE.InstancedMesh>(null);
  const bookCoversRef = useRef<THREE.InstancedMesh>(null);
  const bookPagesRef = useRef<THREE.InstancedMesh>(null);

  const doorGltf = useGLTF(LIBRARY_MODEL_PATHS.doorLeaf);
  const bayGltf = useGLTF(LIBRARY_MODEL_PATHS.bookcaseBay);
  const sconceGltf = useGLTF(LIBRARY_MODEL_PATHS.sconce);
  const bookGltf = useGLTF(LIBRARY_MODEL_PATHS.bookUnit);

  // =========================================================================
  // 1. PROCEDURAL TEMPLE GEOMETRIES & SHADER MATERIALS
  // =========================================================================
  const templeKit = useMemo(() => {
    const unitColumnGeo = createFlutedColumnGeometry(6.0, 0.34);
    const portalEntryGeo = createArchedPortalWallGeometry(11.6, 6.4, 3.55, 3.65, 0.78);
    const portalNaveGeo = createArchedPortalWallGeometry(14.4, 9.4, 5.2, 4.4, 0.82);
    const portalGalleryGeo = createArchedPortalWallGeometry(15.0, 7.4, 5.4, 4.1, 0.78);
    const portalStrategyGeo = createArchedPortalWallGeometry(13.6, 6.8, 4.8, 3.7, 0.72);

    const vaultNarrowGeo = createTransverseCeilingArchGeometry(8.8, 4.6, 6.1, 0.46);
    const vaultWideGeo = createTransverseCeilingArchGeometry(14.4, 5.4, 7.4, 0.52);
    const brazierGeo = createTempleBrazierGeometry();

    const sunbeamMat = createVolumetricSunbeamMaterial();
    const waterMat = createSacredWaterMaterial();

    return {
      unitColumnGeo,
      portalEntryGeo,
      portalNaveGeo,
      portalGalleryGeo,
      portalStrategyGeo,
      vaultNarrowGeo,
      vaultWideGeo,
      brazierGeo,
      sunbeamMat,
      waterMat,
    };
  }, []);

  useEffect(() => {
    return () => {
      templeKit.unitColumnGeo.dispose();
      templeKit.portalEntryGeo.dispose();
      templeKit.portalNaveGeo.dispose();
      templeKit.portalGalleryGeo.dispose();
      templeKit.portalStrategyGeo.dispose();
      templeKit.vaultNarrowGeo.dispose();
      templeKit.vaultWideGeo.dispose();
      templeKit.brazierGeo.dispose();
      templeKit.sunbeamMat.dispose();
      templeKit.waterMat.dispose();
    };
  }, [templeKit]);

  // =========================================================================
  // 2. 52 MONUMENTAL FLUTED TEMPLE COLUMNS & 14 BRONZE BRAZIERS (2 DRAW CALLS)
  // =========================================================================
  const { columnPlacements, brazierPlacements } = useMemo(() => {
    const cols: Array<{ pos: [number, number, number]; scaleY: number; scaleXZ: number }> = [];

    // A. Peristyle Forecourt Columns (z = +13.6 & +9.6)
    for (const x of [-4.8, -2.45, 2.45, 4.8]) {
      cols.push({ pos: [x, 0, 13.6], scaleY: 6.6 / 6.0, scaleXZ: 1.12 });
    }
    for (const x of [-4.2, 4.2]) {
      cols.push({ pos: [x, 0, 9.4], scaleY: 6.2 / 6.0, scaleXZ: 1.04 });
      cols.push({ pos: [x, 0, 5.2], scaleY: 6.0 / 6.0, scaleXZ: 1.0 });
      cols.push({ pos: [x, 0, 1.4], scaleY: 6.0 / 6.0, scaleXZ: 1.0 });
    }

    // B. Sanctuaire 02 — La Voie du Parcours Colonnade (14 columns)
    for (const z of [-2.6, -6.2, -9.8, -13.4, -17.0, -20.6, -23.8]) {
      cols.push({ pos: [-3.92, 0, z], scaleY: 5.8 / 6.0, scaleXZ: 0.94 });
      cols.push({ pos: [3.92, 0, z], scaleY: 5.8 / 6.0, scaleXZ: 0.94 });
    }

    // C. Sanctuaire 03 — La Rotonde des Savoirs Double-Height Columns (12 columns)
    for (const z of [-27.6, -31.8, -36.0, -40.2, -44.4, -48.2]) {
      cols.push({ pos: [-5.15, 0, z], scaleY: 9.1 / 6.0, scaleXZ: 1.18 });
      cols.push({ pos: [5.15, 0, z], scaleY: 9.1 / 6.0, scaleXZ: 1.18 });
    }

    // D. Sanctuaire 04 — Galerie des 4 Réalisations Shrine Columns (10 columns)
    for (const z of [-52.2, -58.6, -65.4, -72.2, -78.4]) {
      cols.push({ pos: [-6.35, 0, z], scaleY: 7.05 / 6.0, scaleXZ: 1.08 });
      cols.push({ pos: [6.35, 0, z], scaleY: 7.05 / 6.0, scaleXZ: 1.08 });
    }

    // E. Sanctuaire 05 — Autel de la Stratégie Elevated Columns (6 columns at y=+0.6m)
    for (const z of [-85.2, -89.6, -94.2]) {
      cols.push({ pos: [-5.35, 0.6, z], scaleY: 6.45 / 6.0, scaleXZ: 0.98 });
      cols.push({ pos: [5.35, 0.6, z], scaleY: 6.45 / 6.0, scaleXZ: 0.98 });
    }

    // F. Sanctuaire 06 — Open Horizon Peristyle Belvedere Columns (6 columns at y=+0.6m)
    for (const x of [-5.85, -2.35, 2.35, 5.85]) {
      cols.push({ pos: [x, 0.6, -107.4], scaleY: 6.5 / 6.0, scaleXZ: 1.08 });
    }

    const braziers: Array<[number, number, number]> = [
      [-2.35, 0, 11.6],
      [2.35, 0, 11.6],
      [-2.35, 0, 7.4],
      [2.35, 0, 7.4],
      [-2.4, 0, -1.5],
      [2.4, 0, -1.5],
      [-3.1, 0, -25.8],
      [3.1, 0, -25.8],
      [-3.2, 0, -50.8],
      [3.2, 0, -50.8],
      [-3.95, 0, -79.4],
      [3.95, 0, -79.4],
      [-3.6, 0.6, -106.4],
      [3.6, 0.6, -106.4],
    ];

    return { columnPlacements: cols, brazierPlacements: braziers };
  }, []);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (columnsInstRef.current) {
      columnPlacements.forEach((c, i) => {
        dummy.position.set(c.pos[0], c.pos[1], c.pos[2]);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(c.scaleXZ, c.scaleY, c.scaleXZ);
        dummy.updateMatrix();
        columnsInstRef.current!.setMatrixAt(i, dummy.matrix);
      });
      columnsInstRef.current.instanceMatrix.needsUpdate = true;
    }
    if (braziersInstRef.current) {
      brazierPlacements.forEach((pos, i) => {
        dummy.position.set(pos[0], pos[1], pos[2]);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        braziersInstRef.current!.setMatrixAt(i, dummy.matrix);
      });
      braziersInstRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [columnPlacements, brazierPlacements]);

  // =========================================================================
  // 3. FLOOR PBR MAPS, ROOM LINTELS & ROOM 02 TIMELINE FLOOR MEDALLIONS
  // =========================================================================
  const floorMaps = useMemo(() => {
    const map = materials.limestoneAshlarFloorMaps.map.clone();
    const normalMap = materials.limestoneAshlarFloorMaps.normalMap.clone();
    const roughnessMap = materials.limestoneAshlarFloorMaps.roughnessMap.clone();
    for (const t of [map, normalMap, roughnessMap]) {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(10, 48);
      t.anisotropy = 16;
      t.needsUpdate = true;
    }
    const stdMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#dfd7cb'),
      map,
      normalMap,
      normalScale: new THREE.Vector2(0.45, 0.45),
      roughnessMap,
      roughness: 0.42,
      metalness: 0.04,
      envMapIntensity: 1.0,
    });
    return { map, normalMap, roughnessMap, stdMat };
  }, [materials.limestoneAshlarFloorMaps]);

  useEffect(() => {
    return () => {
      floorMaps.map.dispose();
      floorMaps.normalMap.dispose();
      floorMaps.roughnessMap.dispose();
      floorMaps.stdMat.dispose();
    };
  }, [floorMaps]);

  const { lintelConfigs, roomMedallions, timelineFloorNodes } = useMemo(() => {
    const lintelZ = [9.5, -0.45, -25.45, -50.45, -80.4, -96.35];
    const lintelY = [5.95, 5.6, 7.6, 6.75, 6.25, 6.25];
    const lintels = ROOMS_3D.map((r, idx) => ({
      room: r,
      z: lintelZ[idx],
      y: lintelY[idx],
      texture: createRoomLintelTexture(r.code, r.title, r.subtitle, 16),
    }));

    const rMeds = ROOMS_3D.map((r) => ({
      room: r,
      texture: createFloorMedallionTexture(
        'SANCTUAIRE',
        r.code,
        r.title.toUpperCase(),
        false,
        8
      ),
    }));

    const shortYears = ['2020', '2021–24', '2023', '2024', '2024–26', '2025'];
    const shortOrgs = [
      'BAC SÉRIE G2',
      'DTS INP-HB',
      'CABINET IACG',
      'DRONE GROUPE CI',
      'INGÉNIEUR ECS',
      'PRÉSIDENT AE-ECS',
    ];
    const tNodes = SPATIAL_TIMELINE_MILESTONES.map((m, idx) => ({
      milestoneId: `station-milestone-${m.id}`,
      z: -4.5 - idx * 3.55,
      isLeft: idx % 2 === 0,
      texture: createFloorMedallionTexture(
        `ÉTAPE 0${idx + 1}`,
        shortYears[idx],
        shortOrgs[idx],
        idx >= 2,
        8
      ),
    }));

    return {
      lintelConfigs: lintels,
      roomMedallions: rMeds,
      timelineFloorNodes: tNodes,
    };
  }, []);

  useEffect(() => {
    return () => {
      lintelConfigs.forEach((c) => c.texture.dispose());
      roomMedallions.forEach((m) => m.texture.dispose());
      timelineFloorNodes.forEach((n) => n.texture.dispose());
    };
  }, [lintelConfigs, roomMedallions, timelineFloorNodes]);

  // =========================================================================
  // 4. CLONED GLB DOORS, BOOKCASES, SCONCES & 2,100 INSTANCED BOOKS
  // =========================================================================
  const { leftDoor, rightDoor, bookcaseBays, wallSconces } = useMemo(() => {
    const enableShadows = deviceTier !== 'mobile';
    const lDoor = doorGltf.scene.clone(true);
    bindGltfMaterials(lDoor, materials, enableShadows);
    const rDoor = doorGltf.scene.clone(true);
    bindGltfMaterials(rDoor, materials, enableShadows);

    const bayPlacements: Array<{ pos: [number, number, number]; rotY: number }> = [];
    const naveZ = [-28.0, -32.2, -36.4, -40.6, -44.8, -48.2];
    for (const z of naveZ) {
      bayPlacements.push({ pos: [-6.45, 0, z], rotY: Math.PI * 0.5 });
      bayPlacements.push({ pos: [6.45, 0, z], rotY: -Math.PI * 0.5 });
      bayPlacements.push({ pos: [-6.45, 4.4, z], rotY: Math.PI * 0.5 });
      bayPlacements.push({ pos: [6.45, 4.4, z], rotY: -Math.PI * 0.5 });
    }

    const bays = bayPlacements.map((cfg) => {
      const clone = bayGltf.scene.clone(true);
      bindGltfMaterials(clone, materials, false);
      return { ...cfg, object: clone };
    });

    const sconceSpots: Array<{ pos: [number, number, number]; rotY: number }> = [
      { pos: [-4.05, 2.7, 5.2], rotY: Math.PI * 0.5 },
      { pos: [4.05, 2.7, 5.2], rotY: -Math.PI * 0.5 },
      { pos: [-4.2, 2.75, -8.0], rotY: Math.PI * 0.5 },
      { pos: [4.2, 2.75, -8.0], rotY: -Math.PI * 0.5 },
      { pos: [-4.2, 2.75, -18.8], rotY: Math.PI * 0.5 },
      { pos: [4.2, 2.75, -18.8], rotY: -Math.PI * 0.5 },
      { pos: [-6.95, 3.1, -58.5], rotY: Math.PI * 0.5 },
      { pos: [6.95, 3.1, -58.5], rotY: -Math.PI * 0.5 },
      { pos: [-6.95, 3.1, -72.5], rotY: Math.PI * 0.5 },
      { pos: [6.95, 3.1, -72.5], rotY: -Math.PI * 0.5 },
      { pos: [-5.85, 3.3, -89.5], rotY: Math.PI * 0.5 },
      { pos: [5.85, 3.3, -89.5], rotY: -Math.PI * 0.5 },
    ];

    const sconces = sconceSpots.map((cfg) => {
      const clone = sconceGltf.scene.clone(true);
      bindGltfMaterials(clone, materials, false);
      return { ...cfg, object: clone };
    });

    return {
      leftDoor: lDoor,
      rightDoor: rDoor,
      bookcaseBays: bays,
      wallSconces: sconces,
    };
  }, [doorGltf.scene, bayGltf.scene, sconceGltf.scene, materials, deviceTier]);

  const { coverGeometry, pageGeometry, bookTransforms } = useMemo(() => {
    let coverGeo: THREE.BufferGeometry | null = null;
    let pageGeo: THREE.BufferGeometry | null = null;
    bookGltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        const name = Array.isArray(m.material)
          ? m.material[0]?.name
          : m.material?.name;
        if (name === 'BookClothCover') coverGeo = m.geometry;
        else if (name === 'BookCreamPages') pageGeo = m.geometry;
      }
    });

    let seed = 20261106;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const transforms: Array<{ matrix: THREE.Matrix4; color: THREE.Color }> = [];
    const dummy = new THREE.Object3D();
    const shelfHeights = [0.22, 0.86, 1.5, 2.14, 2.78, 3.42];

    for (const bay of bookcaseBays) {
      const [bx, by, bz] = bay.pos;
      const isLeft = bx < 0;
      const spineRot = isLeft ? Math.PI * 0.5 : -Math.PI * 0.5;
      const xPlane = isLeft ? bx + 0.09 : bx - 0.09;

      for (const sh of shelfHeights) {
        let cursor = -1.26;
        while (cursor < 1.24) {
          if (rand() < 0.08) {
            cursor += 0.14 + rand() * 0.14;
            continue;
          }
          const thick = 0.032 + rand() * 0.024;
          const hScale = 0.84 + rand() * 0.3;
          const dScale = 0.88 + rand() * 0.18;
          dummy.position.set(
            xPlane + (isLeft ? 1 : -1) * (rand() * 0.015),
            by + sh,
            bz + cursor
          );
          dummy.rotation.set((rand() - 0.5) * 0.03, spineRot, 0);
          dummy.scale.set(thick / 0.044, hScale, dScale);
          dummy.updateMatrix();

          transforms.push({
            matrix: dummy.matrix.clone(),
            color: new THREE.Color(
              BOOK_BINDING_PALETTE[
                Math.floor(rand() * BOOK_BINDING_PALETTE.length)
              ]
            ),
          });
          cursor += thick + 0.004;
        }
      }
    }

    return {
      coverGeometry: coverGeo ?? new THREE.BoxGeometry(0.04, 0.28, 0.2),
      pageGeometry: pageGeo ?? new THREE.BoxGeometry(0.035, 0.26, 0.19),
      bookTransforms: transforms,
    };
  }, [bookGltf.scene, bookcaseBays]);

  useEffect(() => {
    const covers = bookCoversRef.current;
    const pages = bookPagesRef.current;
    if (!covers || !pages) return;
    bookTransforms.forEach((item, i) => {
      covers.setMatrixAt(i, item.matrix);
      covers.setColorAt(i, item.color);
      pages.setMatrixAt(i, item.matrix);
    });
    covers.instanceMatrix.needsUpdate = true;
    if (covers.instanceColor) covers.instanceColor.needsUpdate = true;
    pages.instanceMatrix.needsUpdate = true;
  }, [bookTransforms]);

  // Animate doors, water shader & target reticle
  useFrame(({ clock }, dt) => {
    if (libraryMotionState.isTabHidden) return;
    const openAngle =
      libraryMotionState.doorOpenProgress * THREE.MathUtils.degToRad(84);
    if (leftDoorPivotRef.current) {
      leftDoorPivotRef.current.rotation.y = -openAngle;
    }
    if (rightDoorPivotRef.current) {
      rightDoorPivotRef.current.rotation.y = openAngle;
    }

    templeKit.waterMat.uniforms.uTime.value = clock.getElapsedTime();

    if (reticleGroupRef.current && floorHovered) {
      reticleGroupRef.current.position.lerp(
        reticleTargetRef.current,
        Math.min(1, dt * 18)
      );
      reticleGroupRef.current.rotation.y += dt * 0.9;
    }
  });

  const handleFloorMove = (e: ThreeEvent<PointerEvent>) => {
    setFloorHovered(true);
    reticleTargetRef.current.set(e.point.x, e.point.y + 0.018, e.point.z);
  };

  const handleFloorClick = (e: ThreeEvent<MouseEvent>) => {
    if (
      e.delta > 5 ||
      (typeof performance !== 'undefined' &&
        performance.now() - libraryMotionState.lastDragEndMs < 140)
    ) {
      return;
    }
    e.stopPropagation();
    walkToFloorPoint(e.point.x, e.point.z);
  };

  const rampLength = Math.hypot(4.5, 0.6);
  const rampPitch = Math.atan2(0.6, 4.5);
  const enableShadows = deviceTier !== 'mobile';

  return (
    <group name="MonumentalTempleWorld">
      {/* ===================================================================
          1. SATIN REFLECTIVE TRAVERTINE TEMPLE FLOORS + RAMP
         =================================================================== */}
      {deviceTier !== 'mobile' ? (
        <mesh
          rotation={[-Math.PI * 0.5, 0, 0]}
          position={[0, 0, -32.25]}
          receiveShadow
          onPointerMove={handleFloorMove}
          onPointerOut={() => setFloorHovered(false)}
          onClick={handleFloorClick}
        >
          <planeGeometry args={[16.2, 94.5]} />
          <MeshReflectorMaterial
            mirror={0.28}
            blur={[260, 80]}
            resolution={512}
            mixBlur={0.92}
            mixStrength={0.42}
            roughness={0.42}
            depthScale={0.5}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#e1d9cd"
            metalness={0.03}
            map={floorMaps.map}
            normalMap={floorMaps.normalMap}
            normalScale={new THREE.Vector2(0.38, 0.38)}
            roughnessMap={floorMaps.roughnessMap}
          />
        </mesh>
      ) : (
        <mesh
          rotation={[-Math.PI * 0.5, 0, 0]}
          position={[0, 0, -32.25]}
          material={floorMaps.stdMat}
          onPointerMove={handleFloorMove}
          onPointerOut={() => setFloorHovered(false)}
          onClick={handleFloorClick}
        >
          <planeGeometry args={[16.2, 94.5]} />
        </mesh>
      )}

      {/* Grand Temple Ramp & Steppedcheek Plinths (z = -79.5 -> -84.0) */}
      <mesh
        rotation={[-Math.PI * 0.5 + rampPitch, 0, 0]}
        position={[0, 0.3, -81.75]}
        material={materials.limestoneMonolith}
        receiveShadow={enableShadows}
        onPointerMove={handleFloorMove}
        onPointerOut={() => setFloorHovered(false)}
        onClick={handleFloorClick}
      >
        <planeGeometry args={[9.2, rampLength]} />
      </mesh>
      <mesh
        position={[-4.85, 0.48, -81.75]}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.55, 0.96, 4.7]} />
      </mesh>
      <mesh
        position={[4.85, 0.48, -81.75]}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.55, 0.96, 4.7]} />
      </mesh>

      {/* Elevated Upper Sanctuary & Belvedere Terrace (z = -84.0 -> -108.5 at y = +0.60m) */}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0.6, -96.25]}
        material={floorMaps.stdMat}
        receiveShadow={enableShadows}
        onPointerMove={handleFloorMove}
        onPointerOut={() => setFloorHovered(false)}
        onClick={handleFloorClick}
      >
        <planeGeometry args={[15.4, 24.5]} />
      </mesh>

      {/* Central Monochrome Runner + Whisper-Thin Perspective Guide Line */}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0.005, -32.2]}
        material={materials.midnightSignagePlaque}
        raycast={noRaycast}
      >
        <planeGeometry args={[1.48, 92.0]} />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0.008, -32.2]}
        raycast={noRaycast}
      >
        <planeGeometry args={[0.014, 90.0]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[-0.78, 0.007, -32.2]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <planeGeometry args={[0.055, 92.0]} />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0.78, 0.007, -32.2]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <planeGeometry args={[0.055, 92.0]} />
      </mesh>

      {/* Room 03 Rotunda Concentric Brass & Stone Compass Rose Inlay */}
      <group position={[0, 0.008, -37.5]}>
        <mesh
          rotation={[-Math.PI * 0.5, 0, 0]}
          material={materials.brushedBrass}
          raycast={noRaycast}
        >
          <ringGeometry args={[3.4, 3.55, 64]} />
        </mesh>
        <mesh
          rotation={[-Math.PI * 0.5, 0, 0]}
          material={materials.brushedBrass}
          raycast={noRaycast}
        >
          <ringGeometry args={[1.85, 1.96, 64]} />
        </mesh>
      </group>

      {/* Interactive Walk Reticle */}
      <group ref={reticleGroupRef} visible={floorHovered}>
        <mesh rotation={[-Math.PI * 0.5, 0, 0]} raycast={noRaycast}>
          <ringGeometry args={[0.28, 0.34, 36]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI * 0.5, 0, 0]} raycast={noRaycast}>
          <circleGeometry args={[0.08, 24]} />
          <meshBasicMaterial color="#c8ccd4" transparent opacity={0.95} />
        </mesh>
      </group>

      {/* 6 Engraved Circular Sanctuary Threshold Medallions */}
      {roomMedallions.map(({ room, texture }) => {
        const isCurrent = activeRoomIndex === room.index;
        return (
          <group key={`med-${room.slug}`} position={room.medallionPosition}>
            <mesh
              rotation={[-Math.PI * 0.5, 0, 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setWaypointHovered(true);
              }}
              onPointerOut={() => setWaypointHovered(false)}
              onClick={(e) => {
                if (
                  e.delta > 5 ||
                  (typeof performance !== 'undefined' &&
                    performance.now() - libraryMotionState.lastDragEndMs < 140)
                ) {
                  return;
                }
                e.stopPropagation();
                walkToRoom(room.index);
              }}
            >
              <circleGeometry args={[0.58, 40]} />
              <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>
            {isCurrent && (
              <mesh
                rotation={[-Math.PI * 0.5, 0, 0]}
                position={[0, 0.002, 0]}
                raycast={noRaycast}
              >
                <ringGeometry args={[0.58, 0.65, 40]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            )}
          </group>
        );
      })}

      {/* ROOM 02 — 6 Chronological Floor Date Medallions + Brass Branch Veins */}
      {timelineFloorNodes.map((node) => (
        <group key={node.milestoneId} position={[0, 0.011, node.z]}>
          <mesh
            rotation={[-Math.PI * 0.5, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setWaypointHovered(true);
            }}
            onPointerOut={() => setWaypointHovered(false)}
            onClick={(e) => {
              if (
                e.delta > 5 ||
                (typeof performance !== 'undefined' &&
                  performance.now() - libraryMotionState.lastDragEndMs < 140)
              ) {
                return;
              }
              e.stopPropagation();
              inspectStation(node.milestoneId);
            }}
          >
            <circleGeometry args={[0.42, 36]} />
            <meshBasicMaterial map={node.texture} toneMapped={false} />
          </mesh>
          {/* Brass branch line connecting central date medallion to side Temple Stele */}
          <mesh
            rotation={[-Math.PI * 0.5, 0, 0]}
            position={[node.isLeft ? -1.35 : 1.35, -0.002, 0]}
            material={materials.brushedBrass}
            raycast={noRaycast}
          >
            <planeGeometry args={[1.9, 0.045]} />
          </mesh>
        </group>
      ))}

      {/* ===================================================================
          2. 52 INSTANCED FLUTED TEMPLE COLUMNS & 14 CEREMONIAL BRAZIERS
         =================================================================== */}
      <instancedMesh
        ref={columnsInstRef}
        args={[
          templeKit.unitColumnGeo,
          materials.limestoneMonolith,
          columnPlacements.length,
        ]}
        castShadow={enableShadows}
        receiveShadow={enableShadows}
        frustumCulled={false}
        raycast={noRaycast}
      />

      <instancedMesh
        ref={braziersInstRef}
        args={[
          templeKit.brazierGeo,
          materials.burnishedBronze,
          brazierPlacements.length,
        ]}
        castShadow={enableShadows}
        frustumCulled={false}
        raycast={noRaycast}
      />
      {brazierPlacements.map((pos, idx) => (
        <mesh
          key={`brazier-flame-${idx}`}
          position={[pos[0], pos[1] + 1.42, pos[2]]}
          material={materials.warmOpalDiffuser}
          raycast={noRaycast}
        >
          <sphereGeometry args={[0.16, 16, 12]} />
        </mesh>
      ))}

      {/* ===================================================================
          3. MONUMENTAL SEMICIRCULAR ARCHED TEMPLE PORTALS & PEDIMENT
         =================================================================== */}
      {/* Peristyle Forecourt Classical Entablature & Triangular Pediment (z = +9.5) */}
      <group position={[0, 6.35, 9.5]}>
        <mesh
          material={materials.limestoneMonolith}
          castShadow={enableShadows}
          raycast={noRaycast}
        >
          <boxGeometry args={[11.4, 0.72, 1.1]} />
        </mesh>
        {/* Classical low-slope triangular Temple Pediment */}
        <mesh
          position={[-2.75, 0.78, 0]}
          rotation={[0, 0, 0.21]}
          material={materials.limestoneMonolith}
          raycast={noRaycast}
        >
          <boxGeometry args={[5.8, 0.32, 1.18]} />
        </mesh>
        <mesh
          position={[2.75, 0.78, 0]}
          rotation={[0, 0, -0.21]}
          material={materials.limestoneMonolith}
          raycast={noRaycast}
        >
          <boxGeometry args={[5.8, 0.32, 1.18]} />
        </mesh>
      </group>

      {/* Twin Exterior Forecourt Reflecting Pools (z = +9.8 .. +14.8, x = ±6.2) */}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[-6.35, 0.02, 11.8]}
        material={templeKit.waterMat}
        raycast={noRaycast}
      >
        <planeGeometry args={[3.6, 7.6]} />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[6.35, 0.02, 11.8]}
        material={templeKit.waterMat}
        raycast={noRaycast}
      >
        <planeGeometry args={[3.6, 7.6]} />
      </mesh>

      {/* Portal 1: Main Temple Arched Threshold at z = 0 + Open Walnut Doors */}
      <mesh
        position={[0, 0, 0]}
        geometry={templeKit.portalEntryGeo}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        receiveShadow={enableShadows}
        raycast={noRaycast}
      />
      <group position={[-1.68, 0, -0.08]} ref={leftDoorPivotRef}>
        <primitive object={leftDoor} scale={[1, 0.96, 1]} />
      </group>
      <group position={[1.68, 0, -0.08]} ref={rightDoorPivotRef}>
        <group scale={[-1, 0.96, 1]}>
          <primitive object={rightDoor} />
        </group>
      </group>

      {/* Portal 2: Arched Gateway into La Rotonde des Savoirs (z = -25.0) */}
      <mesh
        position={[0, 0, -25.0]}
        geometry={templeKit.portalNaveGeo}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        receiveShadow={enableShadows}
        raycast={noRaycast}
      />

      {/* Portal 3: Arched Gateway into Le Sanctuaire des 4 Réalisations (z = -50.0) */}
      <mesh
        position={[0, 0, -50.0]}
        geometry={templeKit.portalGalleryGeo}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        receiveShadow={enableShadows}
        raycast={noRaycast}
      />

      {/* Portal 4: Arched Gateway at foot of Strategy Ramp (z = -80.0) */}
      <mesh
        position={[0, 0, -80.0]}
        geometry={templeKit.portalGalleryGeo}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        receiveShadow={enableShadows}
        raycast={noRaycast}
      />

      {/* Portal 5: Elevated Arched Gateway into Le Belvédère Sacré (z = -96.0, y = +0.6m) */}
      <mesh
        position={[0, 0.6, -96.0]}
        geometry={templeKit.portalStrategyGeo}
        material={materials.limestoneMonolith}
        castShadow={enableShadows}
        receiveShadow={enableShadows}
        raycast={noRaycast}
      />

      {/* ===================================================================
          4. PANORAMIC BRONZE CURTAIN-WALL GLASS FACADES, VAULT RIBS & OCULUS
             (Opens all halls laterally onto the 360° Illuminated Metropolis!)
         =================================================================== */}
      {/* Vestibule & Parcours Panoramic Curtain-Wall Glass + Bronze Mullions */}
      {[-4.55, 4.55].map((wx) => (
        <group key={`curtain-parcours-${wx}`}>
          <mesh
            position={[wx, 3.1, -8.0]}
            material={materials.architecturalGlass}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.06, 5.9, 34.8]} />
          </mesh>
          {/* Low stone sill + top cornice + central bronze transom */}
          <mesh
            position={[wx, 0.16, -8.0]}
            material={materials.limestoneMonolith}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.38, 0.32, 35.2]} />
          </mesh>
          <mesh
            position={[wx, 3.15, -8.0]}
            material={materials.burnishedBronze}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.16, 0.09, 35.0]} />
          </mesh>
          <mesh
            position={[wx, 6.08, -8.0]}
            material={materials.burnishedBronze}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.36, 0.24, 35.2]} />
          </mesh>
          {[8.5, 4.0, -0.5, -5.0, -9.5, -14.0, -18.5, -23.0].map((mz) => (
            <mesh
              key={`mul-p-${wx}-${mz}`}
              position={[wx, 3.1, mz]}
              material={materials.burnishedBronze}
              raycast={noRaycast}
            >
              <boxGeometry args={[0.2, 5.9, 0.14]} />
            </mesh>
          ))}
        </group>
      ))}
      {[5.0, -4.5, -11.6, -18.7].map((zRib) => (
        <group key={`rib-narrow-${zRib}`} position={[0, 0, zRib]}>
          <mesh
            geometry={templeKit.vaultNarrowGeo}
            material={materials.limestoneMonolith}
            raycast={noRaycast}
          />
          <mesh
            position={[0, 5.95, 0]}
            rotation={[Math.PI * 0.5, 0, 0]}
            material={materials.frostedSkylightDiffuser}
            raycast={noRaycast}
          >
            <planeGeometry args={[4.2, 2.8]} />
          </mesh>
        </group>
      ))}

      {/* Room 03 Rotunda Panoramic Glass Envelope, Pantheon Oculus & Bookcases */}
      {[-7.15, 7.15].map((wx) => (
        <group key={`curtain-nave-${wx}`}>
          <mesh
            position={[wx, 4.75, -37.5]}
            material={materials.architecturalGlass}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.07, 9.2, 25.0]} />
          </mesh>
          <mesh
            position={[wx, 4.45, -37.5]}
            material={materials.burnishedBronze}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.22, 0.14, 25.2]} />
          </mesh>
        </group>
      ))}
      <mesh
        position={[0, 9.5, -37.5]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[14.8, 0.42, 25.2]} />
      </mesh>
      {/* Pantheon Circular Oculus Ring & Glowing Skylight Crown */}
      <mesh
        position={[0, 9.24, -37.5]}
        rotation={[Math.PI * 0.5, 0, 0]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <torusGeometry args={[3.6, 0.22, 16, 48]} />
      </mesh>
      <mesh
        position={[0, 9.32, -37.5]}
        rotation={[Math.PI * 0.5, 0, 0]}
        material={materials.frostedSkylightDiffuser}
        raycast={noRaycast}
      >
        <circleGeometry args={[3.55, 48]} />
      </mesh>

      {/* Mezzanine Decks & Bronze Balustrades */}
      <mesh
        position={[-5.95, 4.32, -37.5]}
        material={materials.walnutMillwork}
        raycast={noRaycast}
      >
        <boxGeometry args={[1.95, 0.22, 24.6]} />
      </mesh>
      <mesh
        position={[5.95, 4.32, -37.5]}
        material={materials.walnutMillwork}
        raycast={noRaycast}
      >
        <boxGeometry args={[1.95, 0.22, 24.6]} />
      </mesh>

      {bookcaseBays.map((bay, i) => (
        <primitive
          key={`nave-bay-${i}`}
          object={bay.object}
          position={bay.pos}
          rotation={[0, bay.rotY, 0]}
        />
      ))}
      <instancedMesh
        ref={bookCoversRef}
        args={[
          coverGeometry,
          materials.bookClothBase,
          Math.max(1, bookTransforms.length),
        ]}
        frustumCulled={false}
        raycast={noRaycast}
      />
      <instancedMesh
        ref={bookPagesRef}
        args={[
          pageGeometry,
          materials.bookCreamPages,
          Math.max(1, bookTransforms.length),
        ]}
        frustumCulled={false}
        raycast={noRaycast}
      />

      {/* Room 04 Executive Showroom Panoramic Curtain Walls & Vaulted Ceiling Ribs */}
      {[-7.45, 7.45].map((wx) => (
        <group key={`curtain-gallery-${wx}`}>
          <mesh
            position={[wx, 3.75, -65.0]}
            material={materials.architecturalGlass}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.07, 7.2, 30.0]} />
          </mesh>
          <mesh
            position={[wx, 0.18, -65.0]}
            material={materials.limestoneMonolith}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.42, 0.36, 30.2]} />
          </mesh>
          <mesh
            position={[wx, 3.85, -65.0]}
            material={materials.burnishedBronze}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.18, 0.1, 30.0]} />
          </mesh>
          {[-53.0, -59.0, -65.0, -71.0, -77.0].map((mz) => (
            <mesh
              key={`mul-g-${wx}-${mz}`}
              position={[wx, 3.75, mz]}
              material={materials.burnishedBronze}
              raycast={noRaycast}
            >
              <boxGeometry args={[0.24, 7.2, 0.16]} />
            </mesh>
          ))}
        </group>
      ))}
      {[-55.0, -62.0, -69.0, -76.0].map((zVault) => (
        <group key={`gal-vault-${zVault}`} position={[0, 0, zVault]}>
          <mesh
            geometry={templeKit.vaultWideGeo}
            material={materials.limestoneMonolith}
            raycast={noRaycast}
          />
          <mesh
            position={[0, 7.28, 0]}
            rotation={[Math.PI * 0.5, 0, 0]}
            material={materials.frostedSkylightDiffuser}
            raycast={noRaycast}
          >
            <planeGeometry args={[6.8, 3.8]} />
          </mesh>
        </group>
      ))}

      {/* Room 05 Executive Strategy Boardroom Panoramic Glass Walls & Chess Altar */}
      {[-6.35, 6.35].map((wx) => (
        <group key={`curtain-strat-${wx}`}>
          <mesh
            position={[wx, 4.0, -88.0]}
            material={materials.architecturalGlass}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.07, 6.7, 16.0]} />
          </mesh>
          <mesh
            position={[wx, 0.78, -88.0]}
            material={materials.walnutMillwork}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.38, 0.36, 16.2]} />
          </mesh>
          <mesh
            position={[wx, 3.9, -88.0]}
            material={materials.burnishedBronze}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.18, 0.1, 16.0]} />
          </mesh>
          {[-83.5, -88.0, -92.5].map((mz) => (
            <mesh
              key={`mul-s-${wx}-${mz}`}
              position={[wx, 4.0, mz]}
              material={materials.burnishedBronze}
              raycast={noRaycast}
            >
              <boxGeometry args={[0.22, 6.7, 0.14]} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh
        position={[0, 7.35, -88.0]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[13.2, 0.36, 16.2]} />
      </mesh>

      <group position={[0, 0.6, -89.5]}>
        <mesh
          position={[0, 0.44, 0]}
          material={materials.limestoneMonolith}
          castShadow={enableShadows}
          raycast={noRaycast}
        >
          <boxGeometry args={[1.55, 0.88, 2.4]} />
        </mesh>
        <mesh
          position={[0, 0.92, 0]}
          material={materials.walnutMillwork}
          castShadow={enableShadows}
          raycast={noRaycast}
        >
          <boxGeometry args={[2.24, 0.12, 3.24]} />
        </mesh>
        <mesh
          position={[0, 0.985, 0]}
          material={materials.midnightSignagePlaque}
          raycast={noRaycast}
        >
          <boxGeometry args={[1.28, 0.02, 1.28]} />
        </mesh>
        {[-0.38, -0.13, 0.13, 0.38].map((cx, ci) => (
          <mesh
            key={`chess-piece-${ci}`}
            position={[cx, 1.12 + (ci % 2) * 0.05, (ci - 1.5) * 0.25]}
            material={
              ci % 2 === 0 ? materials.brushedBrass : materials.limestoneMonolith
            }
            castShadow={enableShadows}
            raycast={noRaycast}
          >
            <cylinderGeometry args={[0.048, 0.072, 0.25 + (ci % 2) * 0.09, 20]} />
          </mesh>
        ))}
      </group>

      {/* ===================================================================
          5. ROOM 06 — VIP PANORAMIC SKYDECK OVERLOOKING THE 360° METROPOLIS
         =================================================================== */}
      <mesh
        position={[0, 7.25, -101.8]}
        material={materials.limestoneMonolith}
        raycast={noRaycast}
      >
        <boxGeometry args={[14.4, 0.55, 11.8]} />
      </mesh>
      {/* Low glass & brushed-brass Skydeck Horizon Balustrade (front + left + right) */}
      <mesh
        position={[0, 1.12, -107.6]}
        material={materials.architecturalGlass}
        raycast={noRaycast}
      >
        <boxGeometry args={[13.8, 0.96, 0.05]} />
      </mesh>
      <mesh
        position={[0, 1.62, -107.6]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <boxGeometry args={[14.0, 0.06, 0.1]} />
      </mesh>
      {[-6.85, 6.85].map((bx) => (
        <group key={`skydeck-rail-${bx}`}>
          <mesh
            position={[bx, 1.12, -102.0]}
            material={materials.architecturalGlass}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.05, 0.96, 11.4]} />
          </mesh>
          <mesh
            position={[bx, 1.62, -102.0]}
            material={materials.brushedBrass}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.1, 0.06, 11.6]} />
          </mesh>
        </group>
      ))}

      {/* ===================================================================
          6. VOLUMETRIC GOD-RAY SUNBEAM SHAFTS STREAMING FROM THE OCULI
         =================================================================== */}
      {[
        { pos: [1.1, 4.6, -37.5] as [number, number, number], rTop: 2.2, rBot: 4.1, h: 9.2 },
        { pos: [0.6, 3.0, -11.6] as [number, number, number], rTop: 1.1, rBot: 2.4, h: 5.8 },
        { pos: [0.8, 3.6, -62.0] as [number, number, number], rTop: 1.5, rBot: 3.1, h: 7.0 },
        { pos: [0.5, 3.8, -89.5] as [number, number, number], rTop: 1.2, rBot: 2.5, h: 6.4 },
      ].map((beam, bi) => (
        <mesh
          key={`sunbeam-${bi}`}
          position={beam.pos}
          rotation={[0, 0, -0.14]}
          material={templeKit.sunbeamMat}
          raycast={noRaycast}
        >
          <cylinderGeometry args={[beam.rTop, beam.rBot, beam.h, 28, 1, true]} />
        </mesh>
      ))}

      {/* ===================================================================
          7. SIX ENGRAVED ARCHITRAVE LINTELS + WALL SCONCES
         =================================================================== */}
      {lintelConfigs.map(({ room, z, y, texture }) => (
        <group key={`lintel-${room.code}`} position={[0, y, z]}>
          <mesh material={materials.burnishedBronze} raycast={noRaycast}>
            <boxGeometry args={[4.25, 0.92, 0.18]} />
          </mesh>
          <mesh position={[0, 0, 0.1]} raycast={noRaycast}>
            <planeGeometry args={[4.08, 0.84]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {wallSconces.map((sc, i) => (
        <primitive
          key={`world-sconce-${i}`}
          object={sc.object}
          position={sc.pos}
          rotation={[0, sc.rotY, 0]}
        />
      ))}
    </group>
  );
}
