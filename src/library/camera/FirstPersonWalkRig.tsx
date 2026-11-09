import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ROOMS_3D,
  clampWalkablePosition,
  detectRoomIndexAtZ,
  getEyeHeightAtZ,
} from '../data/worldStations';
import {
  libraryMotionState,
  shortestYawTarget,
  useLibraryStore,
} from '../state/useLibraryStore';

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function FirstPersonWalkRig() {
  const { camera, gl } = useThree();
  const keysRef = useRef<Set<string>>(new Set());
  const dragRef = useRef<{
    active: boolean;
    pointerId: number;
    pointerType: string;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: -1,
    pointerType: 'mouse',
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    moved: false,
  });

  const velXRef = useRef(0);
  const velZRef = useRef(0);
  const walkCycleRef = useRef(0);

  useEffect(() => {
    camera.rotation.order = 'YXZ';

    if (typeof window !== 'undefined' && window.location.hash) {
      const targetRoom = ROOMS_3D.find(
        (r) => r.hash.toLowerCase() === window.location.hash.toLowerCase()
      );
      if (targetRoom && targetRoom.index > 0) {
        useLibraryStore.getState().walkToRoom(targetRoom.index);
      }
    }

    const isTypingElement = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        tag === 'BUTTON' ||
        tag === 'A' ||
        el.isContentEditable
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const st = useLibraryStore.getState();
      if (st.dossierOpen || isTypingElement(e.target)) {
        return;
      }
      const code = e.code;

      // Smart shortcuts while inspecting a 3D tableau:
      // Left/Right arrows glide cleanly to Previous/Next tableau!
      if (st.inspectedStationId) {
        if (code === 'ArrowRight') {
          e.preventDefault();
          st.stepStation(1);
          return;
        }
        if (code === 'ArrowLeft') {
          e.preventDefault();
          st.stepStation(-1);
          return;
        }
        if (code === 'Space') {
          e.preventDefault();
          if (st.stationSlideIndex < 2) {
            st.stepStationSlide(1);
          } else {
            st.stepStation(1);
          }
          return;
        }
      } else if (code === 'Space') {
        e.preventDefault();
        st.stepStation(1);
        return;
      }

      if (
        code === 'KeyW' ||
        code === 'KeyZ' ||
        code === 'KeyS' ||
        code === 'KeyA' ||
        code === 'KeyQ' ||
        code === 'KeyD' ||
        code === 'ArrowUp' ||
        code === 'ArrowDown' ||
        code === 'ArrowLeft' ||
        code === 'ArrowRight' ||
        code === 'ShiftLeft' ||
        code === 'ShiftRight'
      ) {
        if (code.startsWith('Arrow')) {
          e.preventDefault();
        }
        keysRef.current.add(code);
        libraryMotionState.glideActive = false;
        libraryMotionState.scrollVelZ = 0;
        st.stopGuidedTour();
        st.markStartedWalking();
      } else if (code === 'Escape') {
        if (st.inspectedStationId) {
          st.inspectStation(null);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    const onBlur = () => {
      keysRef.current.clear();
      libraryMotionState.virtualMoveForward = 0;
      libraryMotionState.virtualMoveStrafe = 0;
      libraryMotionState.virtualTurn = 0;
    };

    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      dragRef.current.active = true;
      dragRef.current.pointerId = e.pointerId;
      dragRef.current.pointerType = e.pointerType;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      dragRef.current.moved = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      libraryMotionState.pointerX = (e.clientX / w) * 2 - 1;
      libraryMotionState.pointerY = (e.clientY / h) * 2 - 1;

      if (!dragRef.current.active || e.pointerId !== dragRef.current.pointerId) {
        return;
      }

      const totalDist = Math.hypot(
        e.clientX - dragRef.current.startX,
        e.clientY - dragRef.current.startY
      );

      if (!dragRef.current.moved && totalDist > 5) {
        dragRef.current.moved = true;
        libraryMotionState.glideLockGaze = false;
        dom.style.cursor = 'grabbing';
        useLibraryStore.getState().markStartedWalking();
        useLibraryStore.getState().stopGuidedTour();
      }

      if (dragRef.current.moved) {
        const dx = e.clientX - dragRef.current.lastX;
        const dy = e.clientY - dragRef.current.lastY;
        dragRef.current.lastX = e.clientX;
        dragRef.current.lastY = e.clientY;

        if (dragRef.current.pointerType === 'touch') {
          // Intuitive 1-finger touch: horizontal turns gaze, vertical cruises forward/back!
          libraryMotionState.lookTargetYaw += dx * 0.0044;
          libraryMotionState.glideActive = false;
          libraryMotionState.scrollVelZ = THREE.MathUtils.clamp(
            libraryMotionState.scrollVelZ + dy * 0.085,
            -13.5,
            13.5
          );
          const st = useLibraryStore.getState();
          if (st.inspectedStationId && Math.abs(dy) > 9) {
            st.inspectStation(null);
          }
        } else {
          // Silky desktop inertial drag-to-look
          const sensitivity = 0.0029;
          libraryMotionState.lookTargetYaw += dx * sensitivity;
          libraryMotionState.lookTargetPitch = THREE.MathUtils.clamp(
            libraryMotionState.lookTargetPitch + dy * sensitivity,
            -0.66,
            0.7
          );
        }
      }
    };

    const endDrag = (e: PointerEvent) => {
      if (e.pointerId === dragRef.current.pointerId) {
        if (dragRef.current.moved && typeof performance !== 'undefined') {
          libraryMotionState.lastDragEndMs = performance.now();
        }
        dragRef.current.active = false;
        dragRef.current.pointerId = -1;
        dom.style.cursor = '';
      }
    };

    const onWheel = (e: WheelEvent) => {
      const st = useLibraryStore.getState();
      if (st.dossierOpen) return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest('[data-scrollable-panel="true"]')
      ) {
        return;
      }
      e.preventDefault();

      // Normalize wheel delta across mouse notched wheels and smooth trackpads
      const rawDelta =
        e.deltaMode === 1 ? e.deltaY * 28 : e.deltaMode === 2 ? e.deltaY * 120 : e.deltaY;
      const clampedDelta = THREE.MathUtils.clamp(rawDelta, -160, 160);

      if (st.reducedMotion) {
        const nextZ = THREE.MathUtils.clamp(
          libraryMotionState.camZ - clampedDelta * 0.025,
          -104.2,
          12.8
        );
        const clamped = clampWalkablePosition(libraryMotionState.camX * 0.8, nextZ);
        libraryMotionState.camX = clamped.x;
        libraryMotionState.camZ = clamped.z;
        libraryMotionState.camY = getEyeHeightAtZ(clamped.z);
        libraryMotionState.glideActive = false;
      } else {
        // Inject silky momentum velocity along the architectural spine
        libraryMotionState.glideActive = false;
        libraryMotionState.scrollVelZ = THREE.MathUtils.clamp(
          libraryMotionState.scrollVelZ - clampedDelta * 0.058,
          -15.5,
          15.5
        );
      }

      st.stopGuidedTour();
      if (st.inspectedStationId && Math.abs(clampedDelta) > 22) {
        st.inspectStation(null);
      }
      st.markStartedWalking();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    dom.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      dom.removeEventListener('wheel', onWheel);
    };
  }, [camera, gl]);

  useFrame((_, rawDelta) => {
    if (libraryMotionState.isTabHidden) return;
    const dt = Math.min(rawDelta, 0.05);
    const store = useLibraryStore.getState();
    const reduced = store.reducedMotion;

    // 1. Entrance Doors open smoothly and remain invitingly open
    libraryMotionState.doorOpenProgress = reduced
      ? 1
      : THREE.MathUtils.damp(libraryMotionState.doorOpenProgress, 1, 2.8, dt);

    // 2. Gather Keyboard + Virtual Walk inputs
    const keys = keysRef.current;
    let forwardInput = libraryMotionState.virtualMoveForward;
    let strafeInput = libraryMotionState.virtualMoveStrafe;
    let turnInput = libraryMotionState.virtualTurn;

    if (keys.has('KeyW') || keys.has('KeyZ') || keys.has('ArrowUp')) {
      forwardInput += 1;
    }
    if (keys.has('KeyS') || keys.has('ArrowDown')) {
      forwardInput -= 1;
    }
    if (keys.has('KeyD')) {
      strafeInput += 1;
    }
    if (keys.has('KeyA') || keys.has('KeyQ')) {
      strafeInput -= 1;
    }
    if (!store.inspectedStationId) {
      if (keys.has('ArrowLeft')) turnInput += 1;
      if (keys.has('ArrowRight')) turnInput -= 1;
    }

    forwardInput = THREE.MathUtils.clamp(forwardInput, -1, 1);
    strafeInput = THREE.MathUtils.clamp(strafeInput, -1, 1);
    turnInput = THREE.MathUtils.clamp(turnInput, -1, 1);

    if (Math.abs(turnInput) > 0.01) {
      libraryMotionState.glideLockGaze = false;
      libraryMotionState.lookTargetYaw += turnInput * 1.85 * dt;
    }

    const isManualMoving =
      Math.abs(forwardInput) > 0.01 || Math.abs(strafeInput) > 0.01;

    if (isManualMoving) {
      libraryMotionState.glideActive = false;
      libraryMotionState.scrollVelZ = 0;
      store.markStartedWalking();
      if (store.inspectedStationId) {
        store.inspectStation(null);
      }
    }

    // 3. Position & Gaze Integration
    if (libraryMotionState.glideActive) {
      // Parametric S-Curve Cinema Dolly Flight (Quadratic Bezier X + Smoothstep Z/Angles)
      libraryMotionState.glideElapsed += dt;
      const rawT = Math.min(
        1,
        libraryMotionState.glideElapsed /
          Math.max(0.15, libraryMotionState.glideDuration)
      );
      const s = easeInOutCubic(rawT);
      const oneMinusS = 1 - s;

      // Quadratic Bezier on X routes cross-room flights cleanly down the central corridor
      const bezierX =
        oneMinusS * oneMinusS * libraryMotionState.glideStartX +
        2 * oneMinusS * s * libraryMotionState.glideMidX +
        s * s * libraryMotionState.glideTargetX;

      const interpZ = THREE.MathUtils.lerp(
        libraryMotionState.glideStartZ,
        libraryMotionState.glideTargetZ,
        s
      );

      const clamped = clampWalkablePosition(bezierX, interpZ);
      libraryMotionState.camX = clamped.x;
      libraryMotionState.camZ = clamped.z;

      if (libraryMotionState.glideLockGaze) {
        libraryMotionState.yaw = THREE.MathUtils.lerp(
          libraryMotionState.glideStartYaw,
          libraryMotionState.glideTargetYaw,
          s
        );
        libraryMotionState.pitch = THREE.MathUtils.lerp(
          libraryMotionState.glideStartPitch,
          libraryMotionState.glideTargetPitch,
          s
        );
        libraryMotionState.lookTargetYaw = libraryMotionState.yaw;
        libraryMotionState.lookTargetPitch = libraryMotionState.pitch;
      } else {
        libraryMotionState.yaw = THREE.MathUtils.damp(
          libraryMotionState.yaw,
          libraryMotionState.lookTargetYaw,
          20,
          dt
        );
        libraryMotionState.pitch = THREE.MathUtils.damp(
          libraryMotionState.pitch,
          libraryMotionState.lookTargetPitch,
          20,
          dt
        );
      }

      if (rawT >= 1) {
        libraryMotionState.glideActive = false;
      }
      velXRef.current = 0;
      velZRef.current = 0;
    } else {
      // Free Walk + Momentum Scroll-Rail Cruise
      const sprint =
        keys.has('ShiftLeft') || keys.has('ShiftRight') ? 1.65 : 1.0;
      const walkSpeed = 6.2 * sprint;

      const sinY = Math.sin(libraryMotionState.yaw);
      const cosY = Math.cos(libraryMotionState.yaw);
      const fwdX = -sinY;
      const fwdZ = -cosY;
      const rightX = cosY;
      const rightZ = -sinY;

      let wishX = fwdX * forwardInput + rightX * strafeInput;
      let wishZ = fwdZ * forwardInput + rightZ * strafeInput;
      const wishLen = Math.hypot(wishX, wishZ);
      if (wishLen > 1) {
        wishX /= wishLen;
        wishZ /= wishLen;
      }

      const targetVx = wishX * walkSpeed;
      const targetVz = wishZ * walkSpeed;

      const accelLambda = isManualMoving ? 15 : 11;
      velXRef.current = THREE.MathUtils.damp(
        velXRef.current,
        targetVx,
        accelLambda,
        dt
      );
      velZRef.current = THREE.MathUtils.damp(
        velZRef.current,
        targetVz,
        accelLambda,
        dt
      );

      // Decay momentum scroll velocity smoothly like a cinema dolly on silk rails
      libraryMotionState.scrollVelZ = THREE.MathUtils.damp(
        libraryMotionState.scrollVelZ,
        0,
        6.2,
        dt
      );
      if (Math.abs(libraryMotionState.scrollVelZ) < 0.005) {
        libraryMotionState.scrollVelZ = 0;
      }

      const isScrolling = Math.abs(libraryMotionState.scrollVelZ) > 0.15;

      // Gently guide X toward central gallery axis & align horizon when scroll-cruising
      let nextRawX = libraryMotionState.camX + velXRef.current * dt;
      const nextRawZ =
        libraryMotionState.camZ +
        (velZRef.current + libraryMotionState.scrollVelZ) * dt;

      if (isScrolling && !isManualMoving) {
        nextRawX = THREE.MathUtils.damp(nextRawX, 0, 1.8, dt);
        if (!dragRef.current.active && !store.inspectedStationId) {
          const horizonYaw = shortestYawTarget(
            libraryMotionState.lookTargetYaw,
            0
          );
          libraryMotionState.lookTargetYaw = THREE.MathUtils.damp(
            libraryMotionState.lookTargetYaw,
            horizonYaw,
            2.6,
            dt
          );
          libraryMotionState.lookTargetPitch = THREE.MathUtils.damp(
            libraryMotionState.lookTargetPitch,
            0.02,
            3.0,
            dt
          );
        }
      }

      if (
        Math.abs(velXRef.current) > 0.002 ||
        Math.abs(velZRef.current) > 0.002 ||
        Math.abs(libraryMotionState.scrollVelZ) > 0.005
      ) {
        const clamped = clampWalkablePosition(
          nextRawX,
          THREE.MathUtils.clamp(nextRawZ, -104.8, 13.0)
        );
        libraryMotionState.camX = clamped.x;
        libraryMotionState.camZ = clamped.z;
      }

      // Silky-smooth inertial gaze damping
      const lookLambda = reduced ? 30 : 20;
      libraryMotionState.yaw = THREE.MathUtils.damp(
        libraryMotionState.yaw,
        libraryMotionState.lookTargetYaw,
        lookLambda,
        dt
      );
      libraryMotionState.pitch = THREE.MathUtils.damp(
        libraryMotionState.pitch,
        libraryMotionState.lookTargetPitch,
        lookLambda,
        dt
      );
    }

    // 4. Smooth eye height (follows ramp + subtle natural step rhythm when walking)
    const targetEyeY = getEyeHeightAtZ(libraryMotionState.camZ);
    const speedMag = Math.hypot(
      velXRef.current,
      velZRef.current + libraryMotionState.scrollVelZ * 0.45
    );
    let stepBob = 0;
    if (!reduced && !libraryMotionState.glideActive && speedMag > 0.5) {
      walkCycleRef.current += dt * Math.min(8.5, 4.2 + speedMag * 0.7);
      stepBob = Math.sin(walkCycleRef.current) * 0.008;
    }

    libraryMotionState.camY = THREE.MathUtils.damp(
      libraryMotionState.camY,
      targetEyeY + stepBob,
      14,
      dt
    );

    // 5. Update normalized building progress [0..1] & active room index
    const normProgress = THREE.MathUtils.clamp(
      (11.2 - libraryMotionState.camZ) / (11.2 - -103.0),
      0,
      1
    );
    libraryMotionState.currentProgress = normProgress;
    libraryMotionState.targetProgress = normProgress;

    const detectedRoom = detectRoomIndexAtZ(libraryMotionState.camZ);
    if (!libraryMotionState.glideActive && detectedRoom !== store.activeRoomIndex) {
      store.setActiveRoomIndex(detectedRoom);
    }

    // 6. Apply to Three.js PerspectiveCamera (plus ultra-subtle pointer micro-parallax)
    const microYaw = reduced ? 0 : -libraryMotionState.pointerX * 0.014;
    const microPitch = reduced ? 0 : -libraryMotionState.pointerY * 0.01;

    camera.position.set(
      libraryMotionState.camX,
      libraryMotionState.camY,
      libraryMotionState.camZ
    );
    camera.rotation.y = libraryMotionState.yaw + microYaw;
    camera.rotation.x = THREE.MathUtils.clamp(
      libraryMotionState.pitch + microPitch,
      -0.75,
      0.78
    );
    camera.rotation.z = 0;
  });

  return null;
}
