import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ROOMS_3D,
  clampWalkablePosition,
  detectRoomIndexAtZ,
  getEyeHeightAtZ,
} from '../data/worldStations';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

export function FirstPersonWalkRig() {
  const { camera, gl } = useThree();
  const keysRef = useRef<Set<string>>(new Set());
  const dragRef = useRef<{
    active: boolean;
    pointerId: number;
    lastX: number;
    lastY: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: -1,
    lastX: 0,
    lastY: 0,
    moved: false,
  });

  const velXRef = useRef(0);
  const velZRef = useRef(0);
  const walkCycleRef = useRef(0);

  // Sync initial hash (#parcours, #projets, etc.) + keyboard/pointer/wheel listeners
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
        el.isContentEditable
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (useLibraryStore.getState().dossierOpen || isTypingElement(e.target)) {
        return;
      }
      const code = e.code;
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
        useLibraryStore.getState().markStartedWalking();
      } else if (code === 'Escape') {
        const st = useLibraryStore.getState();
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
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;

      if (!dragRef.current.moved && Math.hypot(dx, dy) > 4) {
        dragRef.current.moved = true;
        // User intentionally started dragging to look around -> release auto-gaze lock
        libraryMotionState.glideLockGaze = false;
        dom.style.cursor = 'grabbing';
      }

      if (dragRef.current.moved) {
        dragRef.current.lastX = e.clientX;
        dragRef.current.lastY = e.clientY;
        const sensitivity = e.pointerType === 'touch' ? 0.0042 : 0.0031;
        libraryMotionState.yaw += dx * sensitivity;
        libraryMotionState.pitch = THREE.MathUtils.clamp(
          libraryMotionState.pitch + dy * sensitivity,
          -0.68,
          0.72
        );
      }
    };

    const endDrag = (e: PointerEvent) => {
      if (e.pointerId === dragRef.current.pointerId) {
        dragRef.current.active = false;
        dragRef.current.pointerId = -1;
        dom.style.cursor = '';
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (useLibraryStore.getState().dossierOpen) return;
      // Ignore wheel inside scrollable side inspector panel
      if (
        e.target instanceof HTMLElement &&
        e.target.closest('[data-scrollable-panel="true"]')
      ) {
        return;
      }
      e.preventDefault();

      const stepZ = -e.deltaY * 0.018;
      const baseZ = libraryMotionState.glideActive
        ? libraryMotionState.glideTargetZ
        : libraryMotionState.camZ;
      const nextZ = THREE.MathUtils.clamp(baseZ + stepZ, -104.2, 8.6);

      // Keep central corridor alignment when scrolling along the spine
      const baseX = libraryMotionState.glideActive
        ? libraryMotionState.glideTargetX
        : libraryMotionState.camX;
      const nextX = baseX * 0.72;
      const clamped = clampWalkablePosition(nextX, nextZ);

      if (useLibraryStore.getState().reducedMotion) {
        libraryMotionState.camX = clamped.x;
        libraryMotionState.camZ = clamped.z;
        libraryMotionState.camY = getEyeHeightAtZ(clamped.z);
        libraryMotionState.glideActive = false;
      } else {
        libraryMotionState.glideTargetX = clamped.x;
        libraryMotionState.glideTargetZ = clamped.z;
        libraryMotionState.glideLockGaze = false;
        libraryMotionState.glideActive = true;
      }

      const st = useLibraryStore.getState();
      if (st.inspectedStationId && Math.abs(e.deltaY) > 22) {
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
      window.removeEventListener('pointermove', onPointerMove);
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

    // 1. Monumental Entrance Doors automatically swing open on arrival and stay open!
    libraryMotionState.doorOpenProgress = reduced
      ? 1
      : THREE.MathUtils.damp(libraryMotionState.doorOpenProgress, 1, 2.4, dt);

    // 2. Gather Keyboard + Virtual Walk Pad inputs
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
    if (keys.has('ArrowLeft')) {
      turnInput += 1;
    }
    if (keys.has('ArrowRight')) {
      turnInput -= 1;
    }

    forwardInput = THREE.MathUtils.clamp(forwardInput, -1, 1);
    strafeInput = THREE.MathUtils.clamp(strafeInput, -1, 1);
    turnInput = THREE.MathUtils.clamp(turnInput, -1, 1);

    if (Math.abs(turnInput) > 0.01) {
      libraryMotionState.glideLockGaze = false;
      libraryMotionState.yaw += turnInput * 1.65 * dt;
    }

    const isManualMoving =
      Math.abs(forwardInput) > 0.01 || Math.abs(strafeInput) > 0.01;

    if (isManualMoving) {
      libraryMotionState.glideActive = false;
      store.markStartedWalking();
      if (store.inspectedStationId) {
        store.inspectStation(null);
      }
    }

    // 3. Position integration: either smooth Auto-Glide OR Velocity-damped Free Walk
    if (libraryMotionState.glideActive) {
      const posLambda = reduced ? 24 : 4.2;
      libraryMotionState.camX = THREE.MathUtils.damp(
        libraryMotionState.camX,
        libraryMotionState.glideTargetX,
        posLambda,
        dt
      );
      libraryMotionState.camZ = THREE.MathUtils.damp(
        libraryMotionState.camZ,
        libraryMotionState.glideTargetZ,
        posLambda,
        dt
      );

      if (libraryMotionState.glideLockGaze) {
        libraryMotionState.yaw = THREE.MathUtils.damp(
          libraryMotionState.yaw,
          libraryMotionState.glideTargetYaw,
          reduced ? 24 : 5.0,
          dt
        );
        libraryMotionState.pitch = THREE.MathUtils.damp(
          libraryMotionState.pitch,
          libraryMotionState.glideTargetPitch,
          reduced ? 24 : 5.0,
          dt
        );
      }

      const clamped = clampWalkablePosition(
        libraryMotionState.camX,
        libraryMotionState.camZ
      );
      libraryMotionState.camX = clamped.x;
      libraryMotionState.camZ = clamped.z;

      const remDist = Math.hypot(
        libraryMotionState.glideTargetX - libraryMotionState.camX,
        libraryMotionState.glideTargetZ - libraryMotionState.camZ
      );
      if (remDist < 0.03) {
        libraryMotionState.glideActive = false;
      }
      velXRef.current = 0;
      velZRef.current = 0;
    } else {
      const sprint =
        keys.has('ShiftLeft') || keys.has('ShiftRight') ? 1.65 : 1.0;
      const walkSpeed = 5.6 * sprint;

      // Forward vector along horizontal plane for current yaw: (-sin(yaw), -cos(yaw))
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

      // Snappy response per Emil Kowalski's rule: instant start, clean stop
      const accelLambda = isManualMoving ? 14 : 11;
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

      if (
        Math.abs(velXRef.current) > 0.002 ||
        Math.abs(velZRef.current) > 0.002
      ) {
        const nextPos = clampWalkablePosition(
          libraryMotionState.camX + velXRef.current * dt,
          libraryMotionState.camZ + velZRef.current * dt
        );
        libraryMotionState.camX = nextPos.x;
        libraryMotionState.camZ = nextPos.z;
      }
    }

    // 4. Smooth eye height (follows ramp + subtle natural step rhythm when walking)
    const targetEyeY = getEyeHeightAtZ(libraryMotionState.camZ);
    const speedMag = Math.hypot(velXRef.current, velZRef.current);
    let stepBob = 0;
    if (!reduced && speedMag > 0.35) {
      walkCycleRef.current += dt * Math.min(9.5, 4.5 + speedMag * 0.9);
      stepBob = Math.sin(walkCycleRef.current) * 0.011;
    }

    libraryMotionState.camY = THREE.MathUtils.damp(
      libraryMotionState.camY,
      targetEyeY + stepBob,
      14,
      dt
    );

    // 5. Update normalized building progress [0..1] & active room index
    const normProgress = THREE.MathUtils.clamp(
      (8.2 - libraryMotionState.camZ) / (8.2 - -103.0),
      0,
      1
    );
    libraryMotionState.currentProgress = normProgress;
    libraryMotionState.targetProgress = normProgress;

    const detectedRoom = detectRoomIndexAtZ(libraryMotionState.camZ);
    if (detectedRoom !== store.activeRoomIndex) {
      store.setActiveRoomIndex(detectedRoom);
    }

    // 6. Apply to Three.js PerspectiveCamera (plus ultra-subtle pointer micro-parallax)
    const microYaw = reduced ? 0 : -libraryMotionState.pointerX * 0.018;
    const microPitch = reduced ? 0 : -libraryMotionState.pointerY * 0.012;

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
