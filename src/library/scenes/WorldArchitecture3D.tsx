import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useCursor, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  LIBRARY_MODEL_PATHS,
  type LibraryMaterialPalette,
} from '../resources/useLibraryMaterials';
import { createRoomLintelTexture } from '../resources/proceduralSignage';
import { ROOMS_3D } from '../data/worldStations';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

interface WorldArchitecture3DProps {
  materials: LibraryMaterialPalette;
}

const noRaycast = () => null;

const BOOK_BINDING_PALETTE = [
  '#5a3b28',
  '#3f291c',
  '#74523b',
  '#8c6b4f',
  '#c5b8a4',
  '#afa18c',
  '#3d454c',
  '#4e2824',
  '#2d3d33',
  '#102747',
  '#174477',
];

function bindGltfMaterials(
  root: THREE.Object3D,
  materials: LibraryMaterialPalette
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

      mesh.raycast = noRaycast;
    }
  });
}

export function WorldArchitecture3D({ materials }: WorldArchitecture3DProps) {
  const walkToFloorPoint = useLibraryStore((s) => s.walkToFloorPoint);
  const walkToRoom = useLibraryStore((s) => s.walkToRoom);
  const activeRoomIndex = useLibraryStore((s) => s.activeRoomIndex);

  const [floorHovered, setFloorHovered] = useState(false);
  const [waypointHovered, setWaypointHovered] = useState(false);
  useCursor(waypointHovered, 'pointer', floorHovered ? 'crosshair' : 'grab');

  const reticleGroupRef = useRef<THREE.Group>(null);
  const reticleTargetRef = useRef(new THREE.Vector3(0, 0.02, 4));
  const leftDoorPivotRef = useRef<THREE.Group>(null);
  const rightDoorPivotRef = useRef<THREE.Group>(null);
  const bookCoversRef = useRef<THREE.InstancedMesh>(null);
  const bookPagesRef = useRef<THREE.InstancedMesh>(null);

  const doorGltf = useGLTF(LIBRARY_MODEL_PATHS.doorLeaf);
  const bayGltf = useGLTF(LIBRARY_MODEL_PATHS.bookcaseBay);
  const sconceGltf = useGLTF(LIBRARY_MODEL_PATHS.sconce);
  const bookGltf = useGLTF(LIBRARY_MODEL_PATHS.bookUnit);

  // Tiled stone floor material covering the entire 118m walkthrough cleanly
  const floorMaterial = useMemo(() => {
    const map = materials.limestoneAshlarFloorMaps.map.clone();
    const normalMap = materials.limestoneAshlarFloorMaps.normalMap.clone();
    const roughnessMap = materials.limestoneAshlarFloorMaps.roughnessMap.clone();
    for (const t of [map, normalMap, roughnessMap]) {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(8, 42);
      t.needsUpdate = true;
    }
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ddd6ca'),
      map,
      normalMap,
      normalScale: new THREE.Vector2(0.45, 0.45),
      roughnessMap,
      roughness: 0.46,
      metalness: 0.02,
      envMapIntensity: 0.92,
    });
  }, [materials.limestoneAshlarFloorMaps]);

  useEffect(() => {
    return () => {
      floorMaterial.map?.dispose();
      floorMaterial.normalMap?.dispose();
      floorMaterial.roughnessMap?.dispose();
      floorMaterial.dispose();
    };
  }, [floorMaterial]);

  // 6 Architectural Room Lintel Signage Textures
  const lintelConfigs = useMemo(() => {
    const lintelZ = [2.6, -1.6, -25.1, -50.1, -83.6, -96.1];
    const lintelY = [4.55, 4.75, 5.4, 5.5, 5.35, 5.35];
    return ROOMS_3D.map((r, idx) => ({
      room: r,
      z: lintelZ[idx],
      y: lintelY[idx],
      texture: createRoomLintelTexture(r.code, r.title, r.subtitle),
    }));
  }, []);

  useEffect(() => {
    return () => {
      lintelConfigs.forEach((c) => c.texture.dispose());
    };
  }, [lintelConfigs]);

  // Doors, Bookcase Bays & Sconces cloned from our verified GLBs
  const { leftDoor, rightDoor, bookcaseBays, wallSconces } = useMemo(() => {
    const lDoor = doorGltf.scene.clone(true);
    bindGltfMaterials(lDoor, materials);
    const rDoor = doorGltf.scene.clone(true);
    bindGltfMaterials(rDoor, materials);

    // Great Nave (Room 03: z = -27 to -48) multi-story walnut bookcase bays
    const bayPlacements: Array<{ pos: [number, number, number]; rotY: number }> = [];
    const naveZ = [-28.0, -32.2, -36.4, -40.6, -44.8, -48.2];
    for (const z of naveZ) {
      bayPlacements.push({ pos: [-6.15, 0, z], rotY: Math.PI * 0.5 });
      bayPlacements.push({ pos: [6.15, 0, z], rotY: -Math.PI * 0.5 });
      bayPlacements.push({ pos: [-6.15, 4.35, z], rotY: Math.PI * 0.5 });
      bayPlacements.push({ pos: [6.15, 4.35, z], rotY: -Math.PI * 0.5 });
    }

    const bays = bayPlacements.map((cfg) => {
      const clone = bayGltf.scene.clone(true);
      bindGltfMaterials(clone, materials);
      return { ...cfg, object: clone };
    });

    const sconceSpots: Array<{ pos: [number, number, number]; rotY: number }> = [
      { pos: [-3.95, 2.5, 6.2], rotY: Math.PI * 0.5 },
      { pos: [3.95, 2.5, 6.2], rotY: -Math.PI * 0.5 },
      { pos: [-4.15, 2.6, -6.0], rotY: Math.PI * 0.5 },
      { pos: [4.15, 2.6, -6.0], rotY: -Math.PI * 0.5 },
      { pos: [-4.15, 2.6, -15.5], rotY: Math.PI * 0.5 },
      { pos: [4.15, 2.6, -15.5], rotY: -Math.PI * 0.5 },
      { pos: [-6.8, 2.9, -58.5], rotY: Math.PI * 0.5 },
      { pos: [6.8, 2.9, -58.5], rotY: -Math.PI * 0.5 },
      { pos: [-6.8, 2.9, -72.0], rotY: Math.PI * 0.5 },
      { pos: [6.8, 2.9, -72.0], rotY: -Math.PI * 0.5 },
      { pos: [-5.7, 3.1, -89.5], rotY: Math.PI * 0.5 },
      { pos: [5.7, 3.1, -89.5], rotY: -Math.PI * 0.5 },
    ];

    const sconces = sconceSpots.map((cfg) => {
      const clone = sconceGltf.scene.clone(true);
      bindGltfMaterials(clone, materials);
      return { ...cfg, object: clone };
    });

    return {
      leftDoor: lDoor,
      rightDoor: rDoor,
      bookcaseBays: bays,
      wallSconces: sconces,
    };
  }, [doorGltf.scene, bayGltf.scene, sconceGltf.scene, materials]);

  // 2,100+ Instanced Books inside Room 03 (2 GPU draw calls total)
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

  // Animate entrance walnut doors open + floor target reticle
  useFrame((_, dt) => {
    if (libraryMotionState.isTabHidden) return;
    const openAngle =
      libraryMotionState.doorOpenProgress * THREE.MathUtils.degToRad(84);
    if (leftDoorPivotRef.current) {
      leftDoorPivotRef.current.rotation.y = -openAngle;
    }
    if (rightDoorPivotRef.current) {
      rightDoorPivotRef.current.rotation.y = openAngle;
    }

    if (reticleGroupRef.current && floorHovered) {
      reticleGroupRef.current.position.lerp(
        reticleTargetRef.current,
        Math.min(1, dt * 18)
      );
      reticleGroupRef.current.rotation.y += dt * 0.85;
    }
  });

  const handleFloorMove = (e: ThreeEvent<PointerEvent>) => {
    setFloorHovered(true);
    reticleTargetRef.current.set(e.point.x, e.point.y + 0.018, e.point.z);
  };

  const handleFloorClick = (e: ThreeEvent<MouseEvent>) => {
    // Only walk on clean click, never after drag-look
    if (e.delta > 5) return;
    e.stopPropagation();
    walkToFloorPoint(e.point.x, e.point.z);
  };

  // Ramp angle calculation: rises +0.60 m from z = -79.5 to z = -84.0 (length 4.5 m)
  const rampLength = Math.hypot(4.5, 0.6);
  const rampPitch = Math.atan2(0.6, 4.5);

  return (
    <group name="WorldArchitecture-6Rooms">
      {/* ===================================================================
          1. CONTINUOUS INTERACTIVE CLICK-TO-WALK FLOORS + CENTRAL RUNNER
         =================================================================== */}
      {/* Main Ground Level Floor (Rooms 01 -> 04: z = +11.0 to -79.5) */}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0, -34.25]}
        material={floorMaterial}
        receiveShadow
        onPointerMove={handleFloorMove}
        onPointerOut={() => setFloorHovered(false)}
        onClick={handleFloorClick}
      >
        <planeGeometry args={[15.2, 90.5]} />
      </mesh>

      {/* Architectural Ramp (z = -79.5 -> -84.0, rises 0 -> +0.60 m) */}
      <mesh
        rotation={[-Math.PI * 0.5 + rampPitch, 0, 0]}
        position={[0, 0.3, -81.75]}
        material={materials.limestoneMonolith}
        receiveShadow
        onPointerMove={handleFloorMove}
        onPointerOut={() => setFloorHovered(false)}
        onClick={handleFloorClick}
      >
        <planeGeometry args={[8.8, rampLength]} />
      </mesh>

      {/* Elevated Terrace Floor (Rooms 05 -> 06: z = -84.0 -> -108.0 at y = +0.60 m) */}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0.6, -96.0]}
        material={floorMaterial}
        receiveShadow
        onPointerMove={handleFloorMove}
        onPointerOut={() => setFloorHovered(false)}
        onClick={handleFloorClick}
      >
        <planeGeometry args={[14.4, 24.0]} />
      </mesh>

      {/* Central Inlaid Brass & Smoked Walnut Wayfinding Spine */}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0.004, -34.5]}
        material={materials.walnutMillwork}
        raycast={noRaycast}
      >
        <planeGeometry args={[1.35, 88.5]} />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[-0.7, 0.006, -34.5]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <planeGeometry args={[0.035, 88.5]} />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0.7, 0.006, -34.5]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <planeGeometry args={[0.035, 88.5]} />
      </mesh>

      {/* Interactive Floor Walk Target Reticle */}
      <group ref={reticleGroupRef} visible={floorHovered}>
        <mesh rotation={[-Math.PI * 0.5, 0, 0]} raycast={noRaycast}>
          <ringGeometry args={[0.26, 0.33, 32]} />
          <meshBasicMaterial color="#76A9E8" transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[-Math.PI * 0.5, 0, 0]} raycast={noRaycast}>
          <circleGeometry args={[0.09, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* 6 Clickable Floor Room Waypoint Medallions */}
      {ROOMS_3D.map((room) => {
        const isCurrent = activeRoomIndex === room.index;
        return (
          <group key={room.slug} position={room.medallionPosition}>
            <mesh
              rotation={[-Math.PI * 0.5, 0, 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setWaypointHovered(true);
              }}
              onPointerOut={() => setWaypointHovered(false)}
              onClick={(e) => {
                if (e.delta > 5) return;
                e.stopPropagation();
                walkToRoom(room.index);
              }}
            >
              <circleGeometry args={[0.48, 32]} />
              <meshStandardMaterial
                color={isCurrent ? '#174477' : '#071426'}
                emissive={isCurrent ? '#76A9E8' : '#102747'}
                emissiveIntensity={isCurrent ? 0.55 : 0.22}
                roughness={0.32}
              />
            </mesh>
            <mesh
              rotation={[-Math.PI * 0.5, 0, 0]}
              position={[0, 0.003, 0]}
              raycast={noRaycast}
            >
              <ringGeometry args={[0.45, 0.52, 32]} />
              <meshStandardMaterial
                color="#c8a66b"
                metalness={0.88}
                roughness={0.26}
              />
            </mesh>
          </group>
        );
      })}

      {/* ===================================================================
          2. ROOM 01 — ENTRANCE VESTIBULE & OPEN DOUBLE WALNUT PORTAL (z=+10.8..0)
         =================================================================== */}
      {/* Back wall behind visitor */}
      <mesh
        position={[0, 2.9, 10.6]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[9.0, 5.8, 0.5]} />
      </mesh>
      {/* Side limestone walls */}
      <mesh
        position={[-4.2, 2.9, 5.3]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.5, 5.8, 10.8]} />
      </mesh>
      <mesh
        position={[4.2, 2.9, 5.3]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.5, 5.8, 10.8]} />
      </mesh>
      {/* Coffered Vestibule Ceiling + Skylight */}
      <mesh
        position={[0, 5.75, 5.3]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[9.0, 0.35, 10.8]} />
      </mesh>
      <mesh
        position={[0, 5.56, 5.3]}
        rotation={[Math.PI * 0.5, 0, 0]}
        material={materials.frostedSkylightDiffuser}
        raycast={noRaycast}
      >
        <planeGeometry args={[4.4, 6.8]} />
      </mesh>

      {/* Portal Limestone Jambs & Open Walnut Double Doors at z = 0 */}
      <mesh
        position={[-2.95, 2.9, 0]}
        material={materials.limestoneMonolith}
        raycast={noRaycast}
      >
        <boxGeometry args={[2.5, 5.8, 0.65]} />
      </mesh>
      <mesh
        position={[2.95, 2.9, 0]}
        material={materials.limestoneMonolith}
        raycast={noRaycast}
      >
        <boxGeometry args={[2.5, 5.8, 0.65]} />
      </mesh>
      <mesh
        position={[0, 5.15, 0]}
        material={materials.limestoneMonolith}
        raycast={noRaycast}
      >
        <boxGeometry args={[3.5, 1.3, 0.65]} />
      </mesh>

      {/* Swinging Walnut & Bronze Double Doors (open inward automatically) */}
      <group position={[-1.68, 0, -0.06]} ref={leftDoorPivotRef}>
        <primitive object={leftDoor} scale={[1, 0.96, 1]} />
      </group>
      <group position={[1.68, 0, -0.06]} ref={rightDoorPivotRef}>
        <group scale={[-1, 0.96, 1]}>
          <primitive object={rightDoor} />
        </group>
      </group>

      {/* ===================================================================
          3. ROOM 02 — ARCHIVES COLONNADE (z=0 -> -25.0, width 8.8 m)
         =================================================================== */}
      <mesh
        position={[-4.45, 3.0, -12.5]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.5, 6.0, 25.2]} />
      </mesh>
      <mesh
        position={[4.45, 3.0, -12.5]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.5, 6.0, 25.2]} />
      </mesh>
      <mesh
        position={[0, 5.95, -12.5]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[9.4, 0.35, 25.2]} />
      </mesh>
      {[-5.0, -11.0, -17.0, -22.5].map((zSky) => (
        <group key={`arch-sky-${zSky}`} position={[0, 0, zSky]}>
          <mesh
            position={[0, 5.76, 0]}
            rotation={[Math.PI * 0.5, 0, 0]}
            material={materials.frostedSkylightDiffuser}
            raycast={noRaycast}
          >
            <planeGeometry args={[4.2, 3.4]} />
          </mesh>
          <mesh
            position={[-4.05, 2.9, 0]}
            material={materials.limestoneMonolith}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.42, 5.8, 0.52]} />
          </mesh>
          <mesh
            position={[4.05, 2.9, 0]}
            material={materials.limestoneMonolith}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.42, 5.8, 0.52]} />
          </mesh>
        </group>
      ))}

      {/* ===================================================================
          4. ROOM 03 — GREAT DOUBLE-HEIGHT NAVE OF SKILLS (z=-25 -> -50, h=9.4m)
         =================================================================== */}
      {/* Transition walls widening from 8.8m to 13.6m */}
      <mesh
        position={[-5.6, 4.7, -25.0]}
        material={materials.limestoneMonolith}
        raycast={noRaycast}
      >
        <boxGeometry args={[2.8, 9.4, 0.6]} />
      </mesh>
      <mesh
        position={[5.6, 4.7, -25.0]}
        material={materials.limestoneMonolith}
        raycast={noRaycast}
      >
        <boxGeometry args={[2.8, 9.4, 0.6]} />
      </mesh>
      {/* Outer nave walls + high ceiling + clerestory skylight */}
      <mesh
        position={[-6.85, 4.7, -37.5]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.55, 9.4, 25.2]} />
      </mesh>
      <mesh
        position={[6.85, 4.7, -37.5]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.55, 9.4, 25.2]} />
      </mesh>
      <mesh
        position={[0, 9.45, -37.5]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[14.2, 0.4, 25.2]} />
      </mesh>
      <mesh
        position={[0, 9.22, -37.5]}
        rotation={[Math.PI * 0.5, 0, 0]}
        material={materials.frostedSkylightDiffuser}
        raycast={noRaycast}
      >
        <planeGeometry args={[6.8, 20.5]} />
      </mesh>
      {/* Mezzanine Decks & Bronze/Glass Balustrades */}
      <mesh
        position={[-5.65, 4.28, -37.5]}
        material={materials.walnutMillwork}
        raycast={noRaycast}
      >
        <boxGeometry args={[1.9, 0.2, 24.6]} />
      </mesh>
      <mesh
        position={[5.65, 4.28, -37.5]}
        material={materials.walnutMillwork}
        raycast={noRaycast}
      >
        <boxGeometry args={[1.9, 0.2, 24.6]} />
      </mesh>
      <mesh
        position={[-4.72, 4.88, -37.5]}
        material={materials.architecturalGlass}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.04, 1.05, 24.4]} />
      </mesh>
      <mesh
        position={[4.72, 4.88, -37.5]}
        material={materials.architecturalGlass}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.04, 1.05, 24.4]} />
      </mesh>
      <mesh
        position={[-4.72, 5.42, -37.5]}
        material={materials.burnishedBronze}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.08, 0.06, 24.5]} />
      </mesh>
      <mesh
        position={[4.72, 5.42, -37.5]}
        material={materials.burnishedBronze}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.08, 0.06, 24.5]} />
      </mesh>

      {/* Cloned GLB Walnut Bookcase Bays & 2,100+ Instanced Books */}
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

      {/* ===================================================================
          5. ROOM 04 — GRAND EXHIBITION GALLERY OF THE 4 PROJECTS (z=-50 -> -80)
         =================================================================== */}
      <mesh
        position={[-7.25, 3.65, -65.0]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.55, 7.3, 30.2]} />
      </mesh>
      <mesh
        position={[7.25, 3.65, -65.0]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.55, 7.3, 30.2]} />
      </mesh>
      <mesh
        position={[0, 7.25, -65.0]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[15.0, 0.38, 30.2]} />
      </mesh>
      {[-55.0, -62.0, -69.0, -76.0].map((zLight) => (
        <mesh
          key={`gal-sky-${zLight}`}
          position={[0, 7.04, zLight]}
          rotation={[Math.PI * 0.5, 0, 0]}
          material={materials.frostedSkylightDiffuser}
          raycast={noRaycast}
        >
          <planeGeometry args={[6.4, 4.2]} />
        </mesh>
      ))}

      {/* ===================================================================
          6. ROOM 05 — ELEVATED STRATEGY & METHOD CHAMBER (z=-80 -> -96, y=+0.6m)
         =================================================================== */}
      {/* Ramp Brass Handrails */}
      <mesh
        position={[-4.2, 1.25, -81.75]}
        rotation={[rampPitch, 0, 0]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.07, 0.07, rampLength]} />
      </mesh>
      <mesh
        position={[4.2, 1.25, -81.75]}
        rotation={[rampPitch, 0, 0]}
        material={materials.brushedBrass}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.07, 0.07, rampLength]} />
      </mesh>

      {/* Room 05 Side Walls & Ceiling */}
      <mesh
        position={[-6.15, 3.9, -88.0]}
        material={materials.walnutMillwork}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.48, 6.8, 16.4]} />
      </mesh>
      <mesh
        position={[6.15, 3.9, -88.0]}
        material={materials.walnutMillwork}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.48, 6.8, 16.4]} />
      </mesh>
      <mesh
        position={[0, 7.25, -88.0]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[12.8, 0.35, 16.4]} />
      </mesh>
      <mesh
        position={[0, 7.05, -89.5]}
        rotation={[Math.PI * 0.5, 0, 0]}
        material={materials.frostedSkylightDiffuser}
        raycast={noRaycast}
      >
        <planeGeometry args={[5.4, 9.0]} />
      </mesh>

      {/* Central Sculpted Walnut & Stone Chess / Strategy Table at (0, 0.60, -89.5) */}
      <group position={[0, 0.6, -89.5]}>
        <mesh
          position={[0, 0.42, 0]}
          material={materials.limestoneMonolith}
          raycast={noRaycast}
        >
          <boxGeometry args={[1.45, 0.84, 2.3]} />
        </mesh>
        <mesh
          position={[0, 0.88, 0]}
          material={materials.walnutMillwork}
          raycast={noRaycast}
        >
          <boxGeometry args={[2.1, 0.1, 3.1]} />
        </mesh>
        {/* Subtle Brushed Brass Strategic Grid Inlay */}
        <mesh
          position={[0, 0.935, 0]}
          material={materials.midnightSignagePlaque}
          raycast={noRaycast}
        >
          <boxGeometry args={[1.15, 0.015, 1.15]} />
        </mesh>
        {[-0.36, -0.12, 0.12, 0.36].map((cx, ci) => (
          <mesh
            key={`chess-piece-${ci}`}
            position={[cx, 1.05 + (ci % 2) * 0.04, (ci - 1.5) * 0.24]}
            material={ci % 2 === 0 ? materials.brushedBrass : materials.limestoneMonolith}
            raycast={noRaycast}
          >
            <cylinderGeometry args={[0.045, 0.068, 0.22 + (ci % 2) * 0.08, 16]} />
          </mesh>
        ))}
      </group>

      {/* ===================================================================
          7. ROOM 06 — PANORAMIC BELVEDERE & HORIZON TERRACE (z=-96 -> -145)
         =================================================================== */}
      <mesh
        position={[-6.85, 3.9, -102.0]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.5, 6.8, 12.2]} />
      </mesh>
      <mesh
        position={[6.85, 3.9, -102.0]}
        material={materials.limestoneAshlarWall}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.5, 6.8, 12.2]} />
      </mesh>
      <mesh
        position={[0, 7.25, -102.0]}
        material={materials.architecturalConcrete}
        raycast={noRaycast}
      >
        <boxGeometry args={[14.2, 0.35, 12.2]} />
      </mesh>

      {/* Floor-to-Ceiling Panoramic Curtain Wall at z = -107.8 */}
      <mesh
        position={[0, 3.9, -107.8]}
        material={materials.architecturalGlass}
        raycast={noRaycast}
      >
        <boxGeometry args={[13.4, 6.5, 0.06]} />
      </mesh>
      {[-6.5, -3.25, 0, 3.25, 6.5].map((mx) => (
        <mesh
          key={`belv-mullion-${mx}`}
          position={[mx, 3.9, -107.78]}
          material={materials.burnishedBronze}
          raycast={noRaycast}
        >
          <boxGeometry args={[0.09, 6.6, 0.14]} />
        </mesh>
      ))}

      {/* Exterior Horizon Reflection Pool & Travertine Terrace beyond the glass */}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0.54, -124.0]}
        raycast={noRaycast}
      >
        <planeGeometry args={[42.0, 32.0]} />
        <meshStandardMaterial
          color="#8ab4e3"
          roughness={0.08}
          metalness={0.35}
          envMapIntensity={1.6}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0.58, -110.5]}
        material={materials.limestoneMonolith}
        raycast={noRaycast}
      >
        <planeGeometry args={[22.0, 5.2]} />
      </mesh>

      {/* ===================================================================
          8. SIX OVERHEAD ARCHITECTURAL ROOM LINTELS + SCONCES
         =================================================================== */}
      {lintelConfigs.map(({ room, z, y, texture }) => (
        <group key={`lintel-${room.code}`} position={[0, y, z]}>
          <mesh material={materials.burnishedBronze} raycast={noRaycast}>
            <boxGeometry args={[3.5, 0.78, 0.14]} />
          </mesh>
          <mesh position={[0, 0, 0.08]} raycast={noRaycast}>
            <planeGeometry args={[3.36, 0.7]} />
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
