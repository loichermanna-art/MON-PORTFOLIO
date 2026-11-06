import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface EquilibriumPortalProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 01 — Le Portique d'Équilibre (Point focal droit : x = +1.85, z = +2.2)
 * Ses deux vantaux en bronze s'écartent progressivement lorsque scrollProgress franchit [0.02 -> 0.15]
 * pour ouvrir le passage vers la Galerie à Claire-Voie (Scène 02).
 */
export function EquilibriumPortal({ materials }: EquilibriumPortalProps) {
  const leftWingScrollRef = useRef<THREE.Group>(null);
  const rightWingScrollRef = useRef<THREE.Group>(null);
  const balanceBeamIdleRef = useRef<THREE.Group>(null);
  const plumbIdleRef = useRef<THREE.Mesh>(null);
  const currentAperture = useRef(0);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    // Ouverture complète dès la transition Scène 01 -> Scène 02 (réversible à la remontée)
    const openFactor = THREE.MathUtils.smoothstep(motionStore.scrollProgress, 0.02, 0.15);
    currentAperture.current = THREE.MathUtils.damp(
      currentAperture.current,
      openFactor * 0.82,
      5.5,
      dt
    );

    if (leftWingScrollRef.current && rightWingScrollRef.current) {
      leftWingScrollRef.current.position.x = -0.68 - currentAperture.current;
      rightWingScrollRef.current.position.x = 0.68 + currentAperture.current;
    }

    if (balanceBeamIdleRef.current && plumbIdleRef.current) {
      if (motionStore.reducedMotion) {
        balanceBeamIdleRef.current.rotation.z = 0;
        balanceBeamIdleRef.current.rotation.y = 0;
        plumbIdleRef.current.position.y = 2.55;
      } else {
        const t = clock.getElapsedTime();
        balanceBeamIdleRef.current.rotation.z = Math.sin(t * 0.45) * 0.024;
        balanceBeamIdleRef.current.rotation.y = Math.cos(t * 0.28) * 0.035;
        plumbIdleRef.current.position.y = 2.55 + Math.sin(t * 0.6) * 0.04;
      }
    }
  });

  return (
    <group position={[1.85, 0, 2.2]} name="EquilibriumPortal">
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow material={materials.sandstonePlinth}>
        <boxGeometry args={[4.8, 0.2, 2.4]} />
      </mesh>
      <mesh position={[0, 0.26, 0]} receiveShadow castShadow material={materials.limestoneWall}>
        <boxGeometry args={[4.1, 0.14, 1.85]} />
      </mesh>

      <mesh
        position={[-1.72, 2.78, 0]}
        castShadow
        receiveShadow
        material={materials.limestoneWall}
      >
        <boxGeometry args={[0.52, 4.9, 0.68]} />
      </mesh>
      <mesh
        position={[1.72, 2.78, 0]}
        castShadow
        receiveShadow
        material={materials.limestoneWall}
      >
        <boxGeometry args={[0.52, 4.9, 0.68]} />
      </mesh>
      <mesh
        position={[0, 5.42, 0]}
        castShadow
        receiveShadow
        material={materials.limestoneWall}
      >
        <boxGeometry args={[4.16, 0.48, 0.78]} />
      </mesh>
      <mesh position={[0, 5.16, 0]} material={materials.precisionBrass}>
        <boxGeometry args={[3.98, 0.03, 0.72]} />
      </mesh>

      <group ref={leftWingScrollRef} position={[-0.68, 0, 0.08]}>
        <mesh position={[0, 2.52, 0]} castShadow material={materials.patinatedBronze}>
          <boxGeometry args={[0.09, 4.38, 0.36]} />
        </mesh>
        <mesh position={[0.26, 4.66, 0]} castShadow material={materials.patinatedBronze}>
          <boxGeometry args={[0.6, 0.08, 0.36]} />
        </mesh>
        <mesh position={[0.26, 0.38, 0]} material={materials.patinatedBronze}>
          <boxGeometry args={[0.6, 0.06, 0.36]} />
        </mesh>
        {[-0.12, 0.12, 0.36].map((lx, i) => (
          <mesh
            key={`l-slat-${i}`}
            position={[lx + 0.12, 2.52, 0]}
            material={materials.precisionBrass}
          >
            <boxGeometry args={[0.018, 4.22, 0.14]} />
          </mesh>
        ))}
      </group>

      <group ref={rightWingScrollRef} position={[0.68, 0, -0.08]}>
        <mesh position={[0, 2.52, 0]} castShadow material={materials.patinatedBronze}>
          <boxGeometry args={[0.09, 4.38, 0.36]} />
        </mesh>
        <mesh position={[-0.26, 4.66, 0]} castShadow material={materials.patinatedBronze}>
          <boxGeometry args={[0.6, 0.08, 0.36]} />
        </mesh>
        <mesh position={[-0.26, 0.38, 0]} material={materials.patinatedBronze}>
          <boxGeometry args={[0.6, 0.06, 0.36]} />
        </mesh>
        {[-0.36, -0.12, 0.12].map((rx, i) => (
          <mesh
            key={`r-slat-${i}`}
            position={[rx - 0.12, 2.52, 0]}
            material={materials.precisionBrass}
          >
            <boxGeometry args={[0.018, 4.22, 0.14]} />
          </mesh>
        ))}
      </group>

      <group ref={balanceBeamIdleRef} position={[0, 4.15, 0]}>
        <mesh castShadow material={materials.precisionBrass}>
          <boxGeometry args={[2.35, 0.045, 0.065]} />
        </mesh>
        <mesh position={[-1.12, -0.14, 0]} castShadow material={materials.patinatedBronze}>
          <boxGeometry args={[0.16, 0.24, 0.16]} />
        </mesh>
        <mesh position={[1.12, -0.14, 0]} castShadow material={materials.patinatedBronze}>
          <boxGeometry args={[0.16, 0.24, 0.16]} />
        </mesh>
      </group>

      <mesh position={[0, 4.65, 0]} material={materials.precisionBrass}>
        <cylinderGeometry args={[0.006, 0.006, 1.9, 8]} />
      </mesh>
      <mesh
        ref={plumbIdleRef}
        position={[0, 2.55, 0]}
        castShadow
        material={materials.precisionBrass}
      >
        <octahedronGeometry args={[0.085, 0]} />
      </mesh>
    </group>
  );
}
