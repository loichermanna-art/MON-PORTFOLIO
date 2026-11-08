import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  libraryMotionState,
  useLibraryStore,
  type PortalPhase,
} from '../state/useLibraryStore';

/**
 * Pre-designed architectural camera trajectory for Espace 01 — L'Entrée:
 * - Starts at human eye height (y = 1.66 m, z = +8.80 m) in the stone vestibule facing the 4.6 m portal.
 * - Glides smoothly forward along the central axis as the heavy walnut doors swing open.
 * - Settles at the open threshold (y = 1.68 m, z = -1.65 m) gazing deep into the Archives,
 *   the two-story Great Nave of bookshelves, the mezzanine bridges, and the far Belvedere staircase.
 */
export function EntranceCameraRig() {
  const { size } = useThree();
  const reducedMotion = useLibraryStore((s) => s.reducedMotion);
  const setPortalPhase = useLibraryStore((s) => s.setPortalPhase);

  const { positionCurve, lookAtCurve, tempPos, tempLook } = useMemo(() => {
    const posCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0.0, 1.66, 8.85),
        new THREE.Vector3(0.0, 1.66, 6.20),
        new THREE.Vector3(0.0, 1.67, 2.85),
        new THREE.Vector3(0.0, 1.68, -1.65),
      ],
      false,
      'catmullrom',
      0.35
    );

    const lookCurve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0.0, 2.08, -1.50),
        new THREE.Vector3(0.0, 2.16, -9.00),
        new THREE.Vector3(0.0, 2.24, -20.00),
        new THREE.Vector3(0.0, 2.35, -34.00),
      ],
      false,
      'catmullrom',
      0.35
    );

    return {
      positionCurve: posCurve,
      lookAtCurve: lookCurve,
      tempPos: new THREE.Vector3(),
      tempLook: new THREE.Vector3(),
    };
  }, []);

  const smoothedPointer = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame((state, delta) => {
    if (libraryMotionState.isTabHidden) return;
    const dt = Math.min(delta, 0.05);

    if (reducedMotion) {
      libraryMotionState.currentProgress = libraryMotionState.targetProgress;
      smoothedPointer.set(0, 0);
    } else {
      libraryMotionState.currentProgress = THREE.MathUtils.damp(
        libraryMotionState.currentProgress,
        libraryMotionState.targetProgress,
        4.2,
        dt
      );
      smoothedPointer.x = THREE.MathUtils.damp(
        smoothedPointer.x,
        libraryMotionState.pointerX,
        3.6,
        dt
      );
      smoothedPointer.y = THREE.MathUtils.damp(
        smoothedPointer.y,
        libraryMotionState.pointerY,
        3.6,
        dt
      );
    }

    const p = THREE.MathUtils.clamp(libraryMotionState.currentProgress, 0, 1);

    // Update discrete UI phase only when crossing thresholds (zero per-frame re-renders)
    let nextPhase: PortalPhase = 'vestibule';
    if (p >= 0.74) {
      nextPhase = 'threshold';
    } else if (p >= 0.14) {
      nextPhase = 'opening';
    }
    setPortalPhase(nextPhase);

    positionCurve.getPointAt(p, tempPos);
    lookAtCurve.getPointAt(p, tempLook);

    // Responsive framing: slightly wider pull-back on portrait viewports so the full portal breathes
    const aspect = size.width / Math.max(1, size.height);
    const portraitPullback = aspect < 1.0 ? (1.0 - aspect) * 2.4 : 0;

    const cam = state.camera as THREE.PerspectiveCamera;
    cam.position.set(
      tempPos.x + smoothedPointer.x * 0.16,
      tempPos.y + smoothedPointer.y * 0.08,
      tempPos.z + portraitPullback * (1 - p * 0.55)
    );

    tempLook.x += smoothedPointer.x * 0.65;
    tempLook.y += smoothedPointer.y * 0.35;
    cam.lookAt(tempLook);

    const baseFov = aspect < 0.85 ? 50 : aspect < 1.15 ? 45 : 41;
    const targetFov = baseFov + p * 2.5;
    if (Math.abs(cam.fov - targetFov) > 0.02) {
      cam.fov = targetFov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
