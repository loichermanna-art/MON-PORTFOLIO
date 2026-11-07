import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';

interface StudioDaylightProps {
  isMobile: boolean;
}

/**
 * Éclairage Cinématographique « MIDNIGHT BLUE » (Zéro appel réseau .hdr) :
 * - Clair-obscur architectural entre le portique béton bleu nuit (#071426)
 *   et la puissante ouverture froide azur-blanche (#76A9E8 / #FFFFFF) de l'oculus.
 * - Réflexions spéculaires cohérentes via Lightformers calibrés.
 */
export function StudioDaylight({ isMobile }: StudioDaylightProps) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (motionStore.isTabHidden) return;
    if (keyLightRef.current && !motionStore.reducedMotion) {
      const t = clock.getElapsedTime();
      keyLightRef.current.position.x = 5.4 + Math.sin(t * 0.22) * 0.28;
    }
  });

  return (
    <>
      <color attach="background" args={['#071426']} />
      <fog attach="fog" args={['#071426', 18, 86]} />

      {/* Base nocturne froide préservant la lecture des joints du béton dans l'ombre */}
      <ambientLight intensity={0.42} color="#174477" />

      <hemisphereLight
        color="#76A9E8"
        groundColor="#071426"
        intensity={0.68}
        position={[2, 16, -4]}
      />

      {/* Contre-jour architectural traversant l'oculus monumental vers les emmarchements */}
      <directionalLight
        ref={keyLightRef}
        position={[5.4, 7.8, -9.5]}
        intensity={2.95}
        color="#E6F2FF"
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={65}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={12}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0003}
      />

      {/* Lueur ponctuelle de la gorge lumineuse de l'oculus */}
      <pointLight position={[2.6, 3.8, -3.6]} intensity={14} distance={22} decay={1.7} color="#8CC0FF" />

      {/* Éclairage rasant bleuté pour la stèle de verre droite */}
      <pointLight position={[4.2, 2.5, 2.4]} intensity={4.5} distance={10} decay={2} color="#76A9E8" />

      {/* Continuité lumineuse le long de la nef des scènes 02 -> 06 */}
      <directionalLight position={[-5.5, 9.0, -45.0]} intensity={1.35} color="#76A9E8" />
      <pointLight position={[0, 4.5, -92]} intensity={18} distance={34} decay={1.6} color="#BCE0FF" />

      <Environment resolution={isMobile ? 128 : 256} frames={1}>
        {/* Ouverture blanche/azur principale face au sol réfléchissant */}
        <Lightformer
          form="ring"
          intensity={3.6}
          color="#FFFFFF"
          position={[3.2, 4.2, -8]}
          scale={[9, 9, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#76A9E8"
          position={[5, 6, -6]}
          rotation={[0, -0.4, 0]}
          scale={[14, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.95}
          color="#174477"
          position={[-8, 4, 4]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[16, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#071426"
          position={[0, -6, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[30, 30, 1]}
        />
      </Environment>
    </>
  );
}
