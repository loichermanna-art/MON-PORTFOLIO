import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';
import type { ArchitecturalMaterialSet } from '../materials/architecturalMaterials';

interface SequentialBridgeProps {
  materials: ArchitecturalMaterialSet;
}

/**
 * SCÈNE 05 — L'Anneau Orbital Sculpté à 6 Segments & Sphère Centrale (Panel 05)
 * S'inspire directement du panneau 05 « Ma démarche » : un anneau cristallin & chromé
 * incliné dans l'espace autour d'une sphère spéculaire centrale, dont la rotation
 * accompagne progressivement le parcours des 6 étapes méthodologiques.
 */
export function SequentialBridge({ materials }: SequentialBridgeProps) {
  const orbitalGroupRef = useRef<THREE.Group>(null);
  const coreSphereRef = useRef<THREE.Mesh>(null);
  const smoothedSpin = useRef(0);

  useFrame(({ clock }, delta) => {
    if (motionStore.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    const stepProgress = THREE.MathUtils.smoothstep(motionStore.scrollProgress, 0.68, 0.9);
    smoothedSpin.current = THREE.MathUtils.damp(
      smoothedSpin.current,
      stepProgress * Math.PI * 1.25,
      4.6,
      dt
    );

    if (orbitalGroupRef.current) {
      const idle = motionStore.reducedMotion ? 0 : clock.getElapsedTime() * 0.12;
      orbitalGroupRef.current.rotation.z = smoothedSpin.current + idle;
    }

    if (coreSphereRef.current && !motionStore.reducedMotion) {
      coreSphereRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.08;
    }
  });

  return (
    <group name="SequentialBridge">
      {/* Arche courbe porteuse au sol (Panel 05) */}
      <mesh
        position={[1.4, -0.45, -73.0]}
        rotation={[0, 0.3, 0.18]}
        receiveShadow
        castShadow
        material={materials.specularChrome}
      >
        <torusGeometry args={[4.8, 0.24, 16, 64, Math.PI * 0.85]} />
      </mesh>

      {/* Anneau orbital sculpté à 6 segments + coeur spéculaire (Panel 05) */}
      <group position={[1.45, 2.35, -73.2]} rotation={[0.78, -0.36, 0]}>
        <group ref={orbitalGroupRef}>
          {/* Anneau principal en cristal spéculaire */}
          <mesh castShadow material={materials.crystalGlass}>
            <torusGeometry args={[2.05, 0.34, 24, 72]} />
          </mesh>

          {/* 6 bagues d'indexation en chrome marquant les 6 étapes */}
          {[0, 1, 2, 3, 4, 5].map((stepIdx) => {
            const angle = (stepIdx / 6) * Math.PI * 2;
            const rx = Math.cos(angle) * 2.05;
            const ry = Math.sin(angle) * 2.05;
            return (
              <mesh
                key={`ring-segment-${stepIdx}`}
                position={[rx, ry, 0]}
                rotation={[0, 0, angle]}
                castShadow
                material={materials.specularChrome}
              >
                <boxGeometry args={[0.42, 0.52, 0.44]} />
              </mesh>
            );
          })}
        </group>

        {/* Sphère centrale en chrome miroir */}
        <mesh ref={coreSphereRef} castShadow material={materials.specularChrome}>
          <sphereGeometry args={[0.62, 40, 40]} />
        </mesh>
      </group>
    </group>
  );
}
