import { Suspense, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useLibraryStore } from '../state/useLibraryStore';

function HdriGlobalIllumination() {
  return (
    <Environment
      files="/hdri/lebombo_1k.hdr"
      environmentIntensity={0.58}
      background={false}
    />
  );
}

/**
 * Physically plausible continuous lighting rig across all 6 rooms (z = +10 -> -140):
 * - Immediate PMREM RoomEnvironment on frame 0 -> upgraded to Poly Haven CC0 HDRI
 * - Gentle aerial perspective fog (0.0042) preserving long-axis visibility
 * - Balanced warm 2900K museum pools + cool overhead clerestory daylight
 */
export function LibraryLightingRig() {
  const { gl, scene } = useThree();
  const deviceTier = useLibraryStore((s) => s.deviceTier);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);

    if (!scene.environment) {
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.52;
    }

    return () => {
      envRT.dispose();
      roomEnv.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  const shadowMapSize = deviceTier === 'desktop' ? 2048 : 1024;

  return (
    <>
      <color attach="background" args={['#cfe0f5']} />
      <fogExp2 attach="fog" args={['#cfddef', 0.0042]} />

      <Suspense fallback={null}>
        <HdriGlobalIllumination />
      </Suspense>

      <hemisphereLight args={['#e2eefb', '#93816e', 0.88]} />

      {/* Main skylight directional daylight */}
      <directionalLight
        position={[4.5, 16.0, 4.0]}
        intensity={2.1}
        color="#f5f9ff"
        castShadow={deviceTier !== 'mobile'}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-bias={-0.00025}
        shadow-normalBias={0.02}
        shadow-camera-near={1}
        shadow-camera-far={55}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />

      {/* Deep gallery & Belvedere horizon daylight */}
      <directionalLight
        position={[-5.0, 18.0, -78.0]}
        intensity={1.75}
        color="#dcebfb"
      />

      {/* Distributed warm 2900K architectural pools along all 6 rooms */}
      <pointLight position={[0, 4.4, 5.2]} intensity={9} distance={18} decay={1.8} color="#f5c98e" />
      <pointLight position={[0, 4.6, -11.5]} intensity={14} distance={26} decay={1.7} color="#f3c488" />
      <pointLight position={[0, 6.8, -37.5]} intensity={24} distance={34} decay={1.6} color="#f4ca93" />
      <pointLight position={[0, 5.8, -64.5]} intensity={26} distance={36} decay={1.6} color="#eef5fd" />
      <pointLight position={[0, 5.8, -89.5]} intensity={18} distance={26} decay={1.7} color="#f5c68b" />
      <pointLight position={[0, 5.8, -104.0]} intensity={22} distance={30} decay={1.6} color="#e6f1fd" />
    </>
  );
}
