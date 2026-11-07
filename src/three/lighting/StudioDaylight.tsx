import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { motionStore } from '../../motion/motionStore';

interface StudioDaylightProps {
  isMobile: boolean;
}

/**
 * Éclairage néo-architectural évolutif (sans aucun .hdr réseau externe) :
 * - Scènes 01 -> 05 : lumière du jour polaire claire (#F2F4F8), reflets spéculaires nets.
 * - Scène 06 (scrollProgress 0.84 -> 1.00) : transition continue vers un crépuscule ardoise (#1E2532)
 *   baigné d'un soleil d'horizon doré (#FFD59E) fidèle au panneau 06 de référence.
 */
export function StudioDaylight({ isMobile }: StudioDaylightProps) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const { scene } = useThree();

  const smoothedFocusZ = useRef(4);
  const smoothedDusk = useRef(0);

  const daySky = useMemo(() => new THREE.Color('#F2F4F8'), []);
  const duskSky = useMemo(() => new THREE.Color('#1E2532'), []);
  const currentBg = useMemo(() => new THREE.Color('#F2F4F8'), []);

  const daySun = useMemo(() => new THREE.Color('#FFFFFF'), []);
  const duskSun = useMemo(() => new THREE.Color('#FFD29D'), []);
  const currentSun = useMemo(() => new THREE.Color('#FFFFFF'), []);

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
    const p = motionStore.scrollProgress;

    const targetZoneZ = THREE.MathUtils.lerp(5.0, -88.0, p);
    smoothedFocusZ.current = THREE.MathUtils.damp(
      smoothedFocusZ.current,
      targetZoneZ,
      4.5,
      dt
    );

    // Facteur crépusculaire progressif pour la Scène 06 Contact
    const targetDusk = THREE.MathUtils.smoothstep(p, 0.84, 0.96);
    smoothedDusk.current = THREE.MathUtils.damp(smoothedDusk.current, targetDusk, 4.0, dt);

    currentBg.copy(daySky).lerp(duskSky, smoothedDusk.current);
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(currentBg);
    }
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(currentBg);
      scene.fog.density = THREE.MathUtils.lerp(0.0125, 0.0105, smoothedDusk.current);
    }

    currentSun.copy(daySun).lerp(duskSun, smoothedDusk.current);
    light.color.copy(currentSun);
    light.intensity = THREE.MathUtils.lerp(2.35, 2.75, smoothedDusk.current);

    if (hemiRef.current) {
      hemiRef.current.intensity = THREE.MathUtils.lerp(1.05, 0.62, smoothedDusk.current);
    }

    const anchorZ = Math.round(smoothedFocusZ.current * 2) / 2;

    if (motionStore.reducedMotion) {
      light.position.set(12.5, 20.0, anchorZ + 10.0);
      light.target.position.set(0, 0, anchorZ - 2.0);
      light.target.updateMatrixWorld();
      return;
    }

    const t = clock.getElapsedTime();
    const driftX = Math.sin(t * 0.28) * 0.55;
    const driftZ = Math.cos(t * 0.22) * 0.42;

    light.position.set(
      THREE.MathUtils.lerp(12.5 + driftX, 2.5, smoothedDusk.current),
      THREE.MathUtils.lerp(20.0, 9.5, smoothedDusk.current),
      anchorZ + THREE.MathUtils.lerp(10.0 + driftZ, -14.0, smoothedDusk.current)
    );
    light.target.position.set(0, 0, anchorZ - 2.0);
    light.target.updateMatrixWorld();
  });

  const shadowMapSize = isMobile ? 1024 : 2048;

  return (
    <>
      <color attach="background" args={['#F2F4F8']} />
      <fogExp2 attach="fog" args={['#F2F4F8', 0.0125]} />

      <hemisphereLight ref={hemiRef} args={['#FFFFFF', '#CFD6E2', 1.05]} />

      <directionalLight
        ref={sunRef}
        position={[12.5, 20.0, 14.0]}
        intensity={2.35}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={2}
        shadow-camera-far={72}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={18}
        shadow-camera-bottom={-22}
        shadow-bias={-0.00035}
        shadow-normalBias={0.022}
      />

      <directionalLight position={[-11, 8, -42]} intensity={0.55} color="#DCE4F0" />

      {/* Studio spéculaire haute précision pour faire vibrer le chrome, le verre et le marbre blanc */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3.1}
          color="#FFFFFF"
          position={[8, 13, 6]}
          rotation={[Math.PI / 3, 0.3, 0]}
          scale={[20, 18, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#D9E2F0"
          position={[-12, 5, -8]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[24, 12, 1]}
        />
        <Lightformer
          form="ring"
          intensity={2.2}
          color="#FFE3BD"
          position={[0, 4, -22]}
          rotation={[0, 0, 0]}
          scale={[12, 12, 1]}
        />
      </Environment>
    </>
  );
}
