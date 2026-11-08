import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  LIBRARY_MODEL_PATHS,
  type LibraryMaterialPalette,
} from '../resources/useLibraryMaterials';
import { useLibraryStore } from '../state/useLibraryStore';

interface InteriorLibraryPerspective3DProps {
  materials: LibraryMaterialPalette;
}

const noRaycast = () => null;

/**
 * Deterministic PRNG so the 2,800+ books have organic, credible architectural variety
 * without hydration mismatch or random flicker across mounts.
 */
function createSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Credible natural library bookbinding palette:
 * Warm raw linen, cognac calfskin, dark walnut leather, mineral slate, muted burgundy,
 * forest buckram, charcoal cloth, and subtle Midnight Blue (#102747 / #174477) reference folios.
 */
const BOOK_BINDING_PALETTE = [
  '#cfc5b4', // Écru / Toile de lin naturelle
  '#6c4329', // Cuir fauve cognac
  '#452a1b', // Maroquin brun foncé
  '#494f56', // Toile ardoise minérale
  '#52282c', // Bordeaux bibliothèque sourd
  '#293b31', // Vert empire reliure
  '#8c7b67', // Vélin sable grisé
  '#2c3036', // Anthracite éditorial
  '#102747', // Reliure maîtresse Deep Blue (subtile)
  '#174477', // Folio Architectural Blue (subtile)
];

interface BookTransformRecord {
  matrix: THREE.Matrix4;
  color: THREE.Color;
}

export function InteriorLibraryPerspective3D({
  materials,
}: InteriorLibraryPerspective3DProps) {
  const deviceTier = useLibraryStore((s) => s.deviceTier);
  const bookcaseGltf = useGLTF(LIBRARY_MODEL_PATHS.bookcaseBay);
  const bookUnitGltf = useGLTF(LIBRARY_MODEL_PATHS.bookUnit);

  const coverInstancedRef = useRef<THREE.InstancedMesh>(null);
  const pagesInstancedRef = useRef<THREE.InstancedMesh>(null);

  // Extract the curved-spine binding geometry & recessed cream page-block geometry from curved-book-unit.glb
  const { bindingGeometry, pagesGeometry } = useMemo(() => {
    let bindGeo: THREE.BufferGeometry | null = null;
    let pageGeo: THREE.BufferGeometry | null = null;

    bookUnitGltf.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        const matName = Array.isArray(m.material)
          ? m.material[0]?.name
          : m.material?.name;
        if (matName === 'BookBindingCloth') {
          bindGeo = m.geometry;
        } else if (matName === 'BookCreamPages') {
          pageGeo = m.geometry;
        }
      }
    });

    return {
      bindingGeometry: bindGeo ?? new THREE.BoxGeometry(1, 1, 1),
      pagesGeometry: pageGeo ?? new THREE.BoxGeometry(0.85, 0.95, 0.9),
    };
  }, [bookUnitGltf.scene]);

  // Layout of the continuous interior building bays:
  // - Espace 02 (Les Archives): z = -3.0 .. -12.6 (ground floor vaulted arcade)
  // - Espace 03 (La Grande Nef des Rayonnages): z = -16.2 .. -36.6 (2 levels: ground y=0 + mezzanine y=4.45 m!)
  const { bookcaseInstances, bookRecords } = useMemo(() => {
    const bays: Array<{
      x: number;
      y: number;
      z: number;
      rotY: number;
      object: THREE.Object3D;
    }> = [];

    const zArchives = [-3.2, -6.2, -9.2, -12.2];
    const zNave = [-16.6, -19.4, -22.2, -25.0, -28.2, -31.0, -33.8, -36.6];

    const template = bookcaseGltf.scene.clone(true);
    template.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const matName = Array.isArray(mesh.material)
          ? mesh.material[0]?.name
          : mesh.material?.name;
        mesh.material =
          matName === 'BrushedBrass'
            ? materials.brushedBrass
            : materials.walnutMillwork;
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        mesh.raycast = noRaycast;
      }
    });

    const addBay = (x: number, y: number, z: number, rotY: number) => {
      bays.push({
        x,
        y,
        z,
        rotY,
        object: template.clone(false),
      });
    };

    // Archives ground-level bays (wall offset x = ±3.55 m)
    for (const z of zArchives) {
      addBay(-3.55, 0, z, Math.PI * 0.5);
      addBay(3.55, 0, z, -Math.PI * 0.5);
    }

    // Great Nave ground-level bays (x = ±4.55 m) + Mezzanine upper bays (x = ±4.55 m, y = 4.45 m)
    for (const z of zNave) {
      addBay(-4.55, 0, z, Math.PI * 0.5);
      addBay(4.55, 0, z, -Math.PI * 0.5);
      addBay(-4.55, 4.45, z, Math.PI * 0.5);
      addBay(4.55, 4.45, z, -Math.PI * 0.5);
    }

    // Populate thousands of realistic books on the shelves of every bay!
    const rand = createSeededRandom(20261106);
    const records: BookTransformRecord[] = [];
    const shelfHeights =
      deviceTier === 'mobile'
        ? [0.28, 1.36, 2.44, 3.52]
        : [0.28, 0.82, 1.36, 1.9, 2.44, 2.98, 3.52];

    const dummy = new THREE.Object3D();
    const colorScratch = new THREE.Color();

    for (const bay of bays) {
      const signX = bay.x < 0 ? 1 : -1;
      // Front edge of books sits neatly inside the 0.46 m deep shelf
      const spineCenterX = bay.x + signX * 0.05;

      for (const sh of shelfHeights) {
        let cursorZ = bay.z - 0.96;
        const endZ = bay.z + 0.96;

        while (cursorZ < endZ - 0.05) {
          // Occasional natural breathing gap between book groups (supported, never floating!)
          if (rand() < 0.085) {
            cursorZ += 0.14 + rand() * 0.18;
            continue;
          }

          const thickness = 0.026 + rand() * 0.032;
          const height = 0.22 + rand() * 0.125;
          const depth = 0.19 + rand() * 0.065;
          const setback = (rand() - 0.5) * 0.025;
          const microTilt = (rand() - 0.5) * 0.032;

          dummy.position.set(
            spineCenterX + signX * setback,
            bay.y + sh,
            cursorZ + thickness * 0.5
          );
          dummy.rotation.set(microTilt, bay.rotY, 0);
          dummy.scale.set(thickness, height, depth);
          dummy.updateMatrix();

          const hex =
            BOOK_BINDING_PALETTE[
              Math.floor(rand() * BOOK_BINDING_PALETTE.length)
            ];
          colorScratch.set(hex);
          // Subtle organic dye variation per volume so no two adjacent books look cloned
          colorScratch.offsetHSL(
            (rand() - 0.5) * 0.02,
            (rand() - 0.5) * 0.06,
            (rand() - 0.5) * 0.05
          );

          records.push({
            matrix: dummy.matrix.clone(),
            color: colorScratch.clone(),
          });

          cursorZ += thickness + 0.0025;
        }
      }
    }

    return { bookcaseInstances: bays, bookRecords: records };
  }, [bookcaseGltf.scene, materials.brushedBrass, materials.walnutMillwork, deviceTier]);

  useEffect(() => {
    const coverMesh = coverInstancedRef.current;
    const pagesMesh = pagesInstancedRef.current;
    if (!coverMesh || !pagesMesh) return;

    for (let i = 0; i < bookRecords.length; i++) {
      const rec = bookRecords[i];
      coverMesh.setMatrixAt(i, rec.matrix);
      coverMesh.setColorAt(i, rec.color);
      pagesMesh.setMatrixAt(i, rec.matrix);
    }

    coverMesh.instanceMatrix.needsUpdate = true;
    if (coverMesh.instanceColor) {
      coverMesh.instanceColor.needsUpdate = true;
    }
    pagesMesh.instanceMatrix.needsUpdate = true;
    coverMesh.computeBoundingSphere();
    pagesMesh.computeBoundingSphere();
  }, [bookRecords]);

  return (
    <group name="ContinuousInteriorLibrary">
      {/* =====================================================================
          1. CONTINUOUS HONED LIMESTONE NAVE FLOOR (z = -0.5 -> -52.0 m)
         ===================================================================== */}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, 0, -26.2]}
        material={materials.limestoneAshlarWall}
        receiveShadow
        raycast={noRaycast}
      >
        <planeGeometry args={[11.2, 52.0]} />
      </mesh>

      {/* Subtle inlaid stone axis border lines guiding the eye down the central nave */}
      {[-1.52, 1.52].map((rx) => (
        <mesh
          key={`nave-runner-border-${rx}`}
          rotation={[-Math.PI * 0.5, 0, 0]}
          position={[rx, 0.004, -22.0]}
          material={materials.burnishedBronze}
          raycast={noRaycast}
        >
          <planeGeometry args={[0.035, 42.0]} />
        </mesh>
      ))}

      {/* =====================================================================
          2. MONUMENTAL BOOKCASE BAYS (.glb) + 2,800+ INSTANCED BOOKS (2 draw calls!)
         ===================================================================== */}
      {bookcaseInstances.map((b, idx) => (
        <primitive
          key={`library-bay-${idx}`}
          object={b.object}
          position={[b.x, b.y, b.z]}
          rotation={[0, b.rotY, 0]}
        />
      ))}

      <instancedMesh
        ref={coverInstancedRef}
        args={[bindingGeometry, materials.bookClothBase, bookRecords.length]}
        frustumCulled={false}
        raycast={noRaycast}
      />
      <instancedMesh
        ref={pagesInstancedRef}
        args={[pagesGeometry, materials.bookCreamPages, bookRecords.length]}
        frustumCulled={false}
        raycast={noRaycast}
      />

      {/* =====================================================================
          3. ESPACE 02 (ARCHIVES VAULTED ARCADE, z = -1.5 -> -14.2 m)
         ===================================================================== */}
      {[-1.6, -4.7, -7.7, -10.7, -13.8].map((az) => (
        <group key={`archive-arch-${az}`} position={[0, 0, az]}>
          {/* Left & right limestone columns */}
          {[-3.68, 3.68].map((ax) => (
            <mesh
              key={`arch-col-${ax}`}
              position={[ax, 2.9, 0]}
              material={materials.limestoneMonolith}
              receiveShadow
              raycast={noRaycast}
            >
              <boxGeometry args={[0.38, 5.8, 0.42]} />
            </mesh>
          ))}
          {/* Transverse architectural concrete beam */}
          <mesh
            position={[0, 5.88, 0]}
            material={materials.architecturalConcrete}
            raycast={noRaycast}
          >
            <boxGeometry args={[7.8, 0.44, 0.42]} />
          </mesh>
        </group>
      ))}

      {/* Archival Consultation Lecterns along the Archives gallery */}
      {[-5.4, -10.2].map((lz) =>
        [-2.05, 2.05].map((lx) => (
          <group key={`lectern-${lx}-${lz}`} position={[lx, 0, lz]}>
            {/* Walnut pedestal */}
            <mesh
              position={[0, 0.52, 0]}
              material={materials.walnutMillwork}
              receiveShadow
              raycast={noRaycast}
            >
              <boxGeometry args={[0.68, 1.04, 0.52]} />
            </mesh>
            {/* Sloped walnut reading top */}
            <mesh
              position={[0, 1.08, 0]}
              rotation={[0.22, lx < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, 0]}
              material={materials.walnutMillwork}
              raycast={noRaycast}
            >
              <boxGeometry args={[0.62, 0.04, 0.78]} />
            </mesh>
            {/* Open folio resting on lectern */}
            <mesh
              position={[0, 1.13, 0]}
              rotation={[0.22, lx < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, 0]}
              material={materials.bookCreamPages}
              raycast={noRaycast}
            >
              <boxGeometry args={[0.42, 0.025, 0.56]} />
            </mesh>
            {/* Warm brass banker reading lamp */}
            <mesh
              position={[0, 1.34, 0]}
              material={materials.warmOpalDiffuser}
              raycast={noRaycast}
            >
              <cylinderGeometry args={[0.07, 0.09, 0.06, 16]} />
            </mesh>
          </group>
        ))
      )}

      {/* =====================================================================
          4. ESPACE 03 (DOUBLE-HEIGHT GREAT NAVE, MEZZANINES & WALKWAYS, z = -14.2 -> -39.5 m)
         ===================================================================== */}
      {/* Structural outer walls & double-height stone piers */}
      {[-4.95, 4.95].map((wx) => (
        <mesh
          key={`nave-wall-${wx}`}
          position={[wx, 5.1, -27.5]}
          material={materials.limestoneAshlarWall}
          raycast={noRaycast}
        >
          <boxGeometry args={[0.4, 10.2, 27.5]} />
        </mesh>
      ))}

      {/* Cantilevered Mezzanine Galleries (y = 4.35 m) on left & right with glass + bronze balustrades */}
      {[-3.45, 3.45].map((mx) => {
        const innerEdgeX = mx < 0 ? mx + 0.88 : mx - 0.88;
        return (
          <group key={`mezzanine-wing-${mx}`}>
            {/* Limestone & walnut mezzanine floor slab */}
            <mesh
              position={[mx, 4.34, -26.8]}
              material={materials.walnutMillwork}
              receiveShadow
              raycast={noRaycast}
            >
              <boxGeometry args={[1.85, 0.22, 25.0]} />
            </mesh>
            {/* Low-iron architectural glass guardrail */}
            <mesh
              position={[innerEdgeX, 4.98, -26.8]}
              material={materials.architecturalGlass}
              raycast={noRaycast}
            >
              <boxGeometry args={[0.024, 1.06, 24.8]} />
            </mesh>
            {/* Burnished bronze top handrail */}
            <mesh
              position={[innerEdgeX, 5.52, -26.8]}
              material={materials.burnishedBronze}
              raycast={noRaycast}
            >
              <boxGeometry args={[0.055, 0.045, 24.9]} />
            </mesh>
          </group>
        );
      })}

      {/* Iconic Overhead Mezzanine Passerelle / Bridge spanning across the Great Nave at z = -26.6 m */}
      <group position={[0, 4.34, -26.6]}>
        <mesh material={materials.walnutMillwork} raycast={noRaycast}>
          <boxGeometry args={[5.2, 0.24, 1.9]} />
        </mesh>
        {[-0.92, 0.92].map((bz) => (
          <group key={`bridge-rail-${bz}`}>
            <mesh
              position={[0, 0.64, bz]}
              material={materials.architecturalGlass}
              raycast={noRaycast}
            >
              <boxGeometry args={[5.15, 1.04, 0.024]} />
            </mesh>
            <mesh
              position={[0, 1.18, bz]}
              material={materials.burnishedBronze}
              raycast={noRaycast}
            >
              <boxGeometry args={[5.2, 0.045, 0.055]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* High Clerestory Coffered Ceiling & Natural Daylight Windows of the Great Nave (y = 9.85 m) */}
      {[-16.5, -20.5, -24.5, -28.5, -32.5, -36.5, -40.5].map((cz) => (
        <group key={`nave-coffer-${cz}`} position={[0, 9.75, cz]}>
          <mesh material={materials.architecturalConcrete} raycast={noRaycast}>
            <boxGeometry args={[9.8, 0.55, 0.42]} />
          </mesh>
          <mesh
            rotation={[Math.PI * 0.5, 0, 0]}
            position={[0, 0.26, -2.0]}
            material={materials.frostedSkylightDiffuser}
            raycast={noRaycast}
          >
            <planeGeometry args={[5.8, 3.3]} />
          </mesh>
        </group>
      ))}

      {/* Reading Tables & Warm Lamps flanking the Great Nave */}
      {[-19.5, -24.0, -31.5].map((tz) =>
        [-2.25, 2.25].map((tx) => (
          <group key={`reading-table-${tx}-${tz}`} position={[tx, 0, tz]}>
            <mesh
              position={[0, 0.76, 0]}
              material={materials.walnutMillwork}
              raycast={noRaycast}
            >
              <boxGeometry args={[1.15, 0.06, 2.2]} />
            </mesh>
            {[-0.85, 0.85].map((legZ) => (
              <mesh
                key={`t-leg-${legZ}`}
                position={[0, 0.37, legZ]}
                material={materials.walnutMillwork}
                raycast={noRaycast}
              >
                <boxGeometry args={[0.72, 0.74, 0.09]} />
              </mesh>
            ))}
            {/* Warm reading lamp diffuser */}
            <mesh
              position={[0, 1.12, 0]}
              material={materials.warmOpalDiffuser}
              raycast={noRaycast}
            >
              <cylinderGeometry args={[0.09, 0.12, 0.07, 16]} />
            </mesh>
            <mesh
              position={[0, 0.94, 0]}
              material={materials.brushedBrass}
              raycast={noRaycast}
            >
              <cylinderGeometry args={[0.014, 0.018, 0.32, 12]} />
            </mesh>
          </group>
        ))
      )}

      {/* =====================================================================
          5. ARCHITECTURAL LIMESTONE STAIRCASE & LUMINOUS BELVEDERE VISTA (z = -39.5 -> -50.0 m)
             Visibly connects the ground floor to Espace 05 (Mezzanine) & Espace 06 (Belvédère)!
         ===================================================================== */}
      <group position={[0, 0, -40.2]}>
        {Array.from({ length: 16 }).map((_, idx) => {
          const stepH = 4.45 / 16;
          const stepD = 0.36;
          return (
            <mesh
              key={`grand-stair-${idx}`}
              position={[0, (idx + 0.5) * stepH, -idx * stepD]}
              material={materials.limestoneMonolith}
              raycast={noRaycast}
            >
              <boxGeometry args={[3.1, stepH, stepD + 0.02]} />
            </mesh>
          );
        })}

        {/* Upper Mezzanine Landing & Belvedere Panoramic Window Wall at z = -49.5 m */}
        <mesh
          position={[0, 4.34, -7.6]}
          material={materials.limestoneMonolith}
          raycast={noRaycast}
        >
          <boxGeometry args={[9.8, 0.26, 4.2]} />
        </mesh>

        {/* Luminous Natural Horizon Backdrop of Le Belvédère (#E8EDF5 / #76A9E8) */}
        <mesh position={[0, 7.2, -9.8]} raycast={noRaycast}>
          <planeGeometry args={[9.6, 5.8]} />
          <meshBasicMaterial color="#e8f0fa" />
        </mesh>

        {/* Bronze architectural window mullions framing the far Belvedere panorama */}
        {[-3.2, -1.6, 0, 1.6, 3.2].map((wx) => (
          <mesh
            key={`belvedere-mullion-${wx}`}
            position={[wx, 7.2, -9.65]}
            material={materials.burnishedBronze}
            raycast={noRaycast}
          >
            <boxGeometry args={[0.08, 5.8, 0.14]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
