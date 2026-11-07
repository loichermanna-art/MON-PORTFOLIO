import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { ProjectCaseStudy } from '../data/portfolioData';
import { PhotorealDepthStage } from './PhotorealDepthStage';
import { WebGLFallback } from './WebGLFallback';

interface ExperienceCanvasProps {
  onSelectProject?: (project: ProjectCaseStudy) => void;
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function ExperienceCanvas(_props: ExperienceCanvasProps) {
  const [webglAvailable, setWebglAvailable] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setWebglAvailable(checkWebGLSupport());
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener('resize', updateMobile, { passive: true });
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  if (!webglAvailable) {
    return (
      <div className="webgl-stage" aria-hidden="true">
        <WebGLFallback />
      </div>
    );
  }

  return (
    <div className="webgl-stage" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 5.5], fov: 40, near: 0.1, far: 90 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.NoToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#071426', 1);
        }}
      >
        <PhotorealDepthStage isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
