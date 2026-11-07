import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { ProjectCaseStudy } from '../data/portfolioData';
import { PhotorealDepthStage } from './PhotorealDepthStage';
import { WebGLFallback } from './WebGLFallback';

export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
    return false;
  }
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

interface ExperienceCanvasProps {
  onSelectProject?: (project: ProjectCaseStudy) => void;
}

export function ExperienceCanvas(_props: ExperienceCanvasProps) {
  const [webglAvailable] = useState<boolean>(() => detectWebGLSupport());
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', updateViewport, { passive: true });
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  if (!webglAvailable) {
    return <WebGLFallback />;
  }

  return (
    <div className="webgl-stage" aria-hidden="true">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 5], fov: 38, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <Suspense fallback={null}>
          <PhotorealDepthStage isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
