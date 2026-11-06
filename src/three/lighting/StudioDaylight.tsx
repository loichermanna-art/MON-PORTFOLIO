import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';

interface StudioDaylightProps {
  isMobile: boolean;
}

/**
 * Éclairage naturel matinal + studio architectural sans aucune requête réseau (.hdr externe banni).
 * Le frustum d'ombre accompagne progressivement la progression longitudinale le long de l'édifice
 * (de z = +6 à z = -88) afin de conserver des ombres nettes dans chacune des 6 salles.
 */
export function StudioDaylight({ isMobile }: StudioDaylightProps) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();
  const smoothedFocusZ = useRef(4);

  useEffect(() => {
    const light = sunRef.current;
    if (!light) return;
    scene.add(light.target);
    return () => {
      scene.remove(light.target);
    };
  }, [scene]);

  useFrame(({ clock }, delta) => {
    const light = sunRef.current;
    if (!light || motionStore.isTabHidden) return;

    const dt = Math.min(delta, 0.05);
    const targetZoneZ = THREE.MathUtils.lerp(5.0, -88.0, motionStore.scrollProgress);
    smoothedFocusZ.current = THREE.MathUtils.damp(
      smoothedFocusZ.current,
      targetZoneZ,
      4.5,
      dt
    );

    // Quantification douce au demi-mètre pour éviter tout scintillement de shadow-map
    const anchorZ = Math.round(smoothedFocusZ.current * 2) / 2;

    if (motionStore.reducedMotion) {
      light.position.set(13.5, 22.0, anchorZ + 10.5);
      light.target.position.set(0, 0, anchorZ - 2.0);
      light.target.updateMatrixWorld();
      return;
    }

    const t = clock.getElapsedTime();
    const driftX = Math.sin(t * 0.28) * 0.48;
    const driftZ = Math.cos(t * 0.22) * 0.38;

    light.position.set(13.5 + driftX, 22.0, anchorZ + 10.5 + driftZ);
    light.target.position.set(0, 0, anchorZ - 2.0);
    light.target.updateMatrixWorld();
  });

  const shadowMapSize = isMobile ? 1024 : 2048;

  return (
    <>
      <color attach="background" args={['#F5F2EB']} />
      {/* Brouillard minéral doux préservant la visibilité sur 45m tout en fondant l'horizon lointain */}
      <fogExp2 attach="fog" args={['#F5F2EB', 0.0135]} />

      <hemisphereLight args={['#FCFBF8', '#DDD5C5', 0.94]} />

      <directionalLight
        ref={sunRef}
        position={[13.5, 22.0, 14.5]}
        intensity={2.15}
        color="#FFFDF8"
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={2}
        shadow-camera-far={68}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={18}
        shadow-camera-bottom={-22}
        shadow-bias={-0.00035}
        shadow-normalBias={0.022}
      />

      <directionalLight position={[-10, 9, -40]} intensity={0.48} color="#F2EDE2" />

      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#FFFDF9"
          position={[8, 12, 6]}
          rotation={[Math.PI / 3, 0.3, 0]}
          scale={[18, 18, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.15}
          color="#EAE3D5"
          position={[-10, 4, -6]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[20, 10, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.85}
          color="#FCFBF8"
          position={[0, 15, -10]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[14, 14, 1]}
        />
      </Environment>
    </>
  );
}
