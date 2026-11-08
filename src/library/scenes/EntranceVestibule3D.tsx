import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { MeshReflectorMaterial, useCursor, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  LIBRARY_MODEL_PATHS,
  type LibraryMaterialPalette,
} from '../resources/useLibraryMaterials';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

interface EntranceVestibule3DProps {
  materials: LibraryMaterialPalette;
  onTogglePortal: () => void;
}

/**
 * Applies our shared high-res PBR materials onto a cloned glTF scene graph
 * by matching the semantic material names authored in `build-architectural-glb.mjs`.
 */
function bindArchitecturalMaterials(
  root: THREE.Object3D,
  materials: LibraryMaterialPalette,
  castShadow: boolean,
  receiveShadow: boolean
): void {
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      const matName = Array.isArray(mesh.material)
        ? mesh.material[0]?.name
        : mesh.material?.name;

      if (matName === 'WalnutMillwork') {
        mesh.material = materials.walnutMillwork;
      } else if (matName === 'BurnishedBronze') {
        mesh.material = materials.burnishedBronze;
      } else if (matName === 'BrushedBrass') {
        mesh.material = materials.brushedBrass;
      } else if (matName === 'ArchitecturalGlass') {
        mesh.material = materials.architecturalGlass;
      } else if (matName === 'WarmOpalDiffuser') {
        mesh.material = materials.warmOpalDiffuser;
      }

      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
    }
  });
}

const noRaycast = () => null;

export function EntranceVestibule3D({
  materials,
  onTogglePortal,
}: EntranceVestibule3DProps) {
  const deviceTier = useLibraryStore((s) => s.deviceTier);
  const doorHovered = useLibraryStore((s) => s.doorHovered);
  const setDoorHovered = useLibraryStore((s) => s.setDoorHovered);

  useCursor(doorHovered, 'pointer', 'auto');

  const doorGltf = useGLTF(LIBRARY_MODEL_PATHS.doorLeaf);
  const sconceGltf = useGLTF(LIBRARY_MODEL_PATHS.sconce);

  const leftDoorPivotRef = useRef<THREE.Group>(null);
  const rightDoorPivotRef = useRef<THREE.Group>(null);

  const { leftDoorScene, rightDoorScene, sconces } = useMemo(() => {
    const enableShadows = deviceTier !== 'mobile';

    const leftClone = doorGltf.scene.clone(true);
    bindArchitecturalMaterials(leftClone, materials, enableShadows, enableShadows);

    const rightClone = doorGltf.scene.clone(true);
    bindArchitecturalMaterials(rightClone, materials, enableShadows, enableShadows);

    const sconcePositions: Array<{
      pos: [number, number, number];
      rotY: number;
    }> = [
      { pos: [-3.72, 2.42, 6.1], rotY: Math.PI * 0.5 },
      { pos: [3.72, 2.42, 6.1], rotY: -Math.PI * 0.5 },
      { pos: [-3.72, 2.42, 2.3], rotY: Math.PI * 0.5 },
      { pos: [3.72, 2.42, 2.3], rotY: -Math.PI * 0.5 },
    ];

    const sconceClones = sconcePositions.map((cfg) => {
      const clone = sconceGltf.scene.clone(true);
      bindArchitecturalMaterials(clone, materials, false, false);
      clone.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.raycast = noRaycast;
        }
      });
      return { ...cfg, object: clone };
    });

    return {
      leftDoorScene: leftClone,
      rightDoorScene: rightClone,
      sconces: sconceClones,
    };
  }, [doorGltf.scene, sconceGltf.scene, materials, deviceTier]);

  // Subtle brass hardware highlight when hovering the 3D doors (<120ms feedback)
  useEffect(() => {
    materials.brushedBrass.emissive.setHex(doorHovered ? 0x3b2a12 : 0x000000);
    materials.brushedBrass.emissiveIntensity = doorHovered ? 0.35 : 0.0;
  }, [doorHovered, materials.brushedBrass]);

  useFrame(() => {
    if (libraryMotionState.isTabHidden) return;
    const p = libraryMotionState.currentProgress;

    // Physical heavy timber door swing curve: unlatches at p=0.03, swings smoothly inward to 78 deg
    const rawOpen = THREE.MathUtils.clamp((p - 0.02) / 0.66, 0, 1);
    // Cubic ease-in-out with zero overshoot (heavy solid walnut doors)
    const easedOpen =
      rawOpen < 0.5
        ? 4 * rawOpen * rawOpen * rawOpen
        : 1 - Math.pow(-2 * rawOpen + 2, 3) / 2;

    const maxAngle = THREE.MathUtils.degToRad(79);
    if (leftDoorPivotRef.current) {
      leftDoorPivotRef.current.rotation.y = -easedOpen * maxAngle;
    }
    if (rightDoorPivotRef.current) {
      rightDoorPivotRef.current.rotation.y = easedOpen * maxAngle;
    }
  });

  const handleDoorPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDoorHovered(true);
  };

  const handleDoorPointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDoorHovered(false);
  };

  const handleDoorClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onTogglePortal();
  };

  const castShadow = deviceTier !== 'mobile';

  return (
    <group name="Espace01-Vestibule">
      {/* =====================================================================
          1. HONED LIMESTONE ASHLAR FLOOR (z = +11.0 -> -0.5, width 8.4 m)
             Satin architectural stone reflection on desktop/tablet, standard PBR on mobile
         ===================================================================== */}
      {deviceTier !== 'mobile' ? (
        <mesh
          rotation={[-Math.PI * 0.5, 0, 0]}
          position={[0, 0, 5.25]}
          receiveShadow
          raycast={noRaycast}
        >
          <planeGeometry args={[8.4, 11.6]} />
          <MeshReflectorMaterial
            blur={[420, 130]}
            resolution={512}
            mixBlur={1}
            mixStrength={0.28}
            roughness={0.62}
            depthScale={0.35}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.35}
            color="#d9d1c5"
            metalness={0.02}
            mirror={0.14}
            map={materials.limestoneAshlarFloorMaps.map}
            normalMap={materials.limestoneAshlarFloorMaps.normalMap}
            normalScale={new THREE.Vector2(0.35, 0.35)}
            roughnessMap={materials.limestoneAshlarFloorMaps.roughnessMap}
          />
        </mesh>
      ) : (
        <mesh
          rotation={[-Math.PI * 0.5, 0, 0]}
          position={[0, 0, 5.25]}
          material={materials.limestoneAshlarWall}
          raycast={noRaycast}
        >
          <planeGeometry args={[8.4, 11.6]} />
        </mesh>
      )}

      {/* Subtle Bronze Threshold Strip directly beneath the monumental doors (z = 0.0) */}
      <mesh
        position={[0, 0.008, 0]}
        material={materials.burnishedBronze}
        receiveShadow
        raycast={noRaycast}
      >
        <boxGeometry args={[7.2, 0.016, 0.24]} />
      </mesh>

      {/* =====================================================================
          2. VESTIBULE COLONNADE PIERS & RECESSED WALNUT ACOUSTIC BAYS
         ===================================================================== */}
      {/* Outer side masonry walls */}
      <mesh
        position={[-4.05, 3.1, 5.25]}
        material={materials.limestoneAshlarWall}
        receiveShadow
        raycast={noRaycast}
      >
        <boxGeometry args={[0.35, 6.2, 11.5]} />
      </mesh>
      <mesh
        position={[4.05, 3.1, 5.25]}
        material={materials.limestoneAshlarWall}
        receiveShadow
        raycast={noRaycast}
      >
        <boxGeometry args={[0.35, 6.2, 11.5]} />
      </mesh>

      {/* Recessed warm walnut acoustic wall panels between piers (z = 4.2 & z = 8.0) */}
      {[-3.84, 3.84].map((wx) =>
        [4.2, 8.0].map((wz) => (
          <mesh
            key={`walnut-panel-${wx}-${wz}`}
            position={[wx, 2.75, wz]}
            material={materials.walnutMillwork}
            receiveShadow
            raycast={noRaycast}
          >
            <boxGeometry args={[0.06, 4.7, 2.65]} />
          </mesh>
        ))
      )}

      {/* 3 Pairs of Honed Limestone Structural Pilasters + Stepped Bases */}
      {[9.85, 6.1, 2.3].map((pz) =>
        [-3.78, 3.78].map((px) => (
          <group key={`pier-${px}-${pz}`} position={[px, 0, pz]}>
            <mesh
              position={[0, 3.05, 0]}
              material={materials.limestoneMonolith}
              castShadow={castShadow}
              receiveShadow
              raycast={noRaycast}
            >
              <boxGeometry args={[0.42, 6.1, 0.72]} />
            </mesh>
            <mesh
              position={[0, 0.14, 0]}
              material={materials.limestoneMonolith}
              receiveShadow
              raycast={noRaycast}
            >
              <boxGeometry args={[0.48, 0.28, 0.78]} />
            </mesh>
          </group>
        ))
      )}

      {/* 4 Sculpted Architectural Wall Sconces (.glb) */}
      {sconces.map((s, idx) => (
        <primitive
          key={`vestibule-sconce-${idx}`}
          object={s.object}
          position={s.pos}
          rotation={[0, s.rotY, 0]}
        />
      ))}

      {/* =====================================================================
          3. COFFERED ARCHITECTURAL CONCRETE SKYLIGHT CEILING (y = 5.95..6.65 m)
             Chipperfield-inspired deep concrete beams & natural skylight wells
         ===================================================================== */}
      {/* Longitudinal ceiling soffit beams */}
      {[-3.65, -1.25, 1.25, 3.65].map((bx) => (
        <mesh
          key={`ceil-long-beam-${bx}`}
          position={[bx, 6.18, 5.2]}
          material={materials.architecturalConcrete}
          castShadow={castShadow}
          receiveShadow
          raycast={noRaycast}
        >
          <boxGeometry args={[0.38, 0.56, 11.4]} />
        </mesh>
      ))}

      {/* Transverse coffer ribs */}
      {[0.35, 3.2, 6.1, 9.0].map((bz) => (
        <mesh
          key={`ceil-trans-beam-${bz}`}
          position={[0, 6.18, bz]}
          material={materials.architecturalConcrete}
          castShadow={castShadow}
          receiveShadow
          raycast={noRaycast}
        >
          <boxGeometry args={[7.8, 0.56, 0.38]} />
        </mesh>
      ))}

      {/* Frosted natural skylight diffuser panels recessed at top of coffers (y = 6.48) */}
      {[-2.45, 0, 2.45].map((sx) =>
        [1.78, 4.65, 7.55].map((sz) => (
          <mesh
            key={`skylight-${sx}-${sz}`}
            rotation={[Math.PI * 0.5, 0, 0]}
            position={[sx, 6.48, sz]}
            material={materials.frostedSkylightDiffuser}
            raycast={noRaycast}
          >
            <planeGeometry args={[2.05, 2.5]} />
          </mesh>
        ))
      )}

      {/* =====================================================================
          4. PORTAL WALLPIERS & SUBTLE MIDNIGHT BLUE WAYFINDING PLAQUE (z = 0.0)
         ===================================================================== */}
      {/* Heavy flanking limestone portal piers (x = -3.62..-3.28 & +3.28..+3.62) */}
      {[-3.62, 3.62].map((px) => (
        <mesh
          key={`portal-pier-${px}`}
          position={[px, 3.05, 0]}
          material={materials.limestoneMonolith}
          castShadow={castShadow}
          receiveShadow
          raycast={noRaycast}
        >
          <boxGeometry args={[0.68, 6.1, 0.68]} />
        </mesh>
      ))}

      {/* Stone lintel header above portal screen (y = 5.84..6.20) */}
      <mesh
        position={[0, 6.02, 0]}
        material={materials.limestoneMonolith}
        castShadow={castShadow}
        receiveShadow
        raycast={noRaycast}
      >
        <boxGeometry args={[7.9, 0.38, 0.68]} />
      </mesh>

      {/* Recessed Architectural Wayfinding Plaque in Midnight/Deep Blue (#102747) on right pier */}
      <group position={[3.6, 1.72, 0.355]}>
        {/* Brushed brass trim bezel */}
        <mesh material={materials.brushedBrass} raycast={noRaycast}>
          <boxGeometry args={[0.42, 0.62, 0.014]} />
        </mesh>
        {/* Deep Blue (#102747) architectural enamel face */}
        <mesh
          position={[0, 0, 0.006]}
          material={materials.midnightSignagePlaque}
          raycast={noRaycast}
        >
          <boxGeometry args={[0.395, 0.595, 0.012]} />
        </mesh>
        {/* Subtle engraved architectural brass rule lines */}
        <mesh
          position={[0, 0.16, 0.014]}
          material={materials.brushedBrass}
          raycast={noRaycast}
        >
          <boxGeometry args={[0.3, 0.006, 0.004]} />
        </mesh>
        <mesh
          position={[-0.04, -0.18, 0.014]}
          material={materials.brushedBrass}
          raycast={noRaycast}
        >
          <boxGeometry args={[0.22, 0.005, 0.004]} />
        </mesh>
      </group>

      {/* =====================================================================
          5. BURNISHED-BRONZE & LOW-IRON GLASS PORTAL SCREEN (z = 0.0)
             Full-height glazed sidelights + overhead transom revealing the Great Hall!
         ===================================================================== */}
      {/* Outer bronze perimeter frame */}
      <mesh
        position={[-3.25, 2.92, 0]}
        material={materials.burnishedBronze}
        castShadow={castShadow}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.09, 5.84, 0.22]} />
      </mesh>
      <mesh
        position={[3.25, 2.92, 0]}
        material={materials.burnishedBronze}
        castShadow={castShadow}
        raycast={noRaycast}
      >
        <boxGeometry args={[0.09, 5.84, 0.22]} />
      </mesh>
      <mesh
        position={[0, 5.8, 0]}
        material={materials.burnishedBronze}
        castShadow={castShadow}
        raycast={noRaycast}
      >
        <boxGeometry args={[6.58, 0.09, 0.22]} />
      </mesh>

      {/* Structural bronze door jambs framing the 3.18 m wide × 4.60 m tall double doors */}
      {[-1.635, 1.635].map((jx) => (
        <mesh
          key={`door-jamb-${jx}`}
          position={[jx, 2.92, 0]}
          material={materials.burnishedBronze}
          castShadow={castShadow}
          receiveShadow
          raycast={noRaycast}
        >
          <boxGeometry args={[0.09, 5.84, 0.24]} />
        </mesh>
      ))}

      {/* Bronze transom bar directly above the 4.58 m walnut doors */}
      <mesh
        position={[0, 4.63, 0]}
        material={materials.burnishedBronze}
        castShadow={castShadow}
        receiveShadow
        raycast={noRaycast}
      >
        <boxGeometry args={[6.56, 0.09, 0.24]} />
      </mesh>

      {/* Left & Right Floor-to-Ceiling Glazed Sidelights (x = -2.44 & +2.44) */}
      {[-2.44, 2.44].map((gx) => (
        <group key={`sidelight-${gx}`}>
          {/* Clear low-iron architectural glass */}
          <mesh
            position={[gx, 2.9, 0]}
            material={materials.architecturalGlass}
            raycast={noRaycast}
          >
            <boxGeometry args={[1.52, 5.72, 0.018]} />
          </mesh>
          {/* Slender horizontal bronze mullions aligning with door rails */}
          {[1.04, 2.32, 3.48].map((my) => (
            <mesh
              key={`sidelight-mullion-${gx}-${my}`}
              position={[gx, my, 0]}
              material={materials.burnishedBronze}
              raycast={noRaycast}
            >
              <boxGeometry args={[1.54, 0.032, 0.08]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Upper Overhead Transom Window above the double doors (y = 4.68..5.76) */}
      <mesh
        position={[0, 5.22, 0]}
        material={materials.architecturalGlass}
        raycast={noRaycast}
      >
        <boxGeometry args={[3.18, 1.08, 0.018]} />
      </mesh>
      {[-0.8, 0, 0.8].map((mx) => (
        <mesh
          key={`transom-mullion-${mx}`}
          position={[mx, 5.22, 0]}
          material={materials.burnishedBronze}
          raycast={noRaycast}
        >
          <boxGeometry args={[0.03, 1.08, 0.08]} />
        </mesh>
      ))}

      {/* =====================================================================
          6. INTERACTIVE MONUMENTAL SMOKED WALNUT & BRONZE DOUBLE DOORS (.glb)
             Filtered raycasting ONLY on the two interactive door leaves
         ===================================================================== */}
      <group
        ref={leftDoorPivotRef}
        position={[-1.585, 0.016, 0]}
        onPointerOver={handleDoorPointerOver}
        onPointerOut={handleDoorPointerOut}
        onClick={handleDoorClick}
      >
        <primitive object={leftDoorScene} />
      </group>

      <group
        ref={rightDoorPivotRef}
        position={[1.585, 0.016, 0]}
        onPointerOver={handleDoorPointerOver}
        onPointerOut={handleDoorPointerOut}
        onClick={handleDoorClick}
      >
        <group scale={[-1, 1, 1]}>
          <primitive object={rightDoorScene} />
        </group>
      </group>
    </group>
  );
}
