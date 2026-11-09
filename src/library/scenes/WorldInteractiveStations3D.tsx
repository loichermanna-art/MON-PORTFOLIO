import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import type { LibraryMaterialPalette } from '../resources/useLibraryMaterials';
import { createSuspendedTableauTexture } from '../resources/proceduralSignage';
import { WORLD_STATIONS_3D, type WorldStation3D } from '../data/worldStations';
import { libraryMotionState, useLibraryStore } from '../state/useLibraryStore';

interface WorldInteractiveStations3DProps {
  materials: LibraryMaterialPalette;
}

const noRaycast = () => null;

/**
 * Ultra-slim Black-Anodized & Brushed Titanium Frame suspended from the ceiling
 * by twin tensioned steel cables with cantilevered museum white grazing light,
 * magnetic hover spring, ergonomic hit-zone, and 3 live interactive slides.
 */
function SuspendedTitaniumTableau({
  station,
  materials,
  isInspected,
  activeSlideIndex,
  enableShadows,
  onSelect,
  onStepSlide,
  onHover,
}: {
  station: WorldStation3D;
  materials: LibraryMaterialPalette;
  isInspected: boolean;
  activeSlideIndex: number;
  enableShadows: boolean;
  onSelect: (id: string) => void;
  onStepSlide: () => void;
  onHover: (label: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const frameAssemblyRef = useRef<THREE.Group>(null);

  const projectId = station.project?.id ?? '';
  const visualIdx = useLibraryStore((s) =>
    projectId ? (s.projectVisualIndex[projectId] ?? 0) : 0
  );

  const effectiveSlide = isInspected ? activeSlideIndex : 0;

  const isProject = station.kind === 'project';
  const isContact = station.kind === 'contact';
  const canvasW = isProject ? 3.72 : isContact ? 2.64 : 1.72;
  const canvasH = isProject ? 2.325 : isContact ? 1.76 : 2.15;
  const centerY = isProject ? 1.98 : isContact ? 1.88 : 1.82;

  const outerW = canvasW + 0.14;
  const outerH = canvasH + 0.14;
  const trimW = canvasW + 0.045;
  const trimH = canvasH + 0.045;
  const frameDepth = 0.052;

  const ceilingLocalY = station.position[1] > 0.2 ? 5.62 : 6.22;
  const frameTopY = centerY + outerH * 0.5;
  const cableLen = Math.max(0.4, ceilingLocalY - frameTopY);
  const cableCenterY = frameTopY + cableLen * 0.5;
  const cableOffsetX = outerW * 0.36;

  const tableauTexture = useMemo(
    () =>
      createSuspendedTableauTexture(station, effectiveSlide, visualIdx, 16),
    [station, effectiveSlide, visualIdx]
  );

  useEffect(() => {
    return () => {
      tableauTexture.dispose();
    };
  }, [tableauTexture]);

  const active = hovered || isInspected;

  // Tactile 60fps micro-advance when hovered or focused
  useFrame((_, rawDt) => {
    if (!frameAssemblyRef.current || libraryMotionState.isTabHidden) return;
    const dt = Math.min(rawDt, 0.05);
    const targetZ = active ? 0.045 : 0;
    frameAssemblyRef.current.position.z = THREE.MathUtils.damp(
      frameAssemblyRef.current.position.z,
      targetZ,
      14,
      dt
    );
  });

  const handleTableauClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (
      e.delta > 6 ||
      (typeof performance !== 'undefined' &&
        performance.now() - libraryMotionState.lastDragEndMs < 140)
    ) {
      return;
    }
    useLibraryStore.getState().stopGuidedTour();
    if (isInspected) {
      onStepSlide();
    } else {
      onSelect(station.id);
    }
  };

  return (
    <group position={station.position} rotation={[0, station.rotationY, 0]}>
      {/* Subtle Floor Alignment Hairline + Approach Guide Strip */}
      <mesh
        position={[0, 0.004, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        raycast={noRaycast}
      >
        <planeGeometry args={[outerW * 0.84, 0.024]} />
        <meshBasicMaterial
          color={active ? '#ffffff' : '#8e94a0'}
          transparent
          opacity={active ? 0.72 : 0.22}
        />
      </mesh>
      <mesh
        position={[0, 0.004, 0.75]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        raycast={noRaycast}
      >
        <planeGeometry args={[0.018, 1.45]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={active ? 0.42 : 0.08}
        />
      </mesh>

      {/* Twin Tensioned Brushed-Steel Suspension Cables + Ceiling Anchors */}
      {[-cableOffsetX, cableOffsetX].map((cx) => (
        <group key={cx}>
          <mesh
            position={[cx, ceilingLocalY - 0.02, 0]}
            material={materials.brushedBrass}
            raycast={noRaycast}
          >
            <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
          </mesh>
          <mesh
            position={[cx, cableCenterY, 0]}
            material={materials.brushedBrass}
            raycast={noRaycast}
          >
            <cylinderGeometry args={[0.0075, 0.0075, cableLen, 10]} />
          </mesh>
        </group>
      ))}

      {/* Suspended Frame Assembly (responds smoothly on hover/focus) */}
      <group ref={frameAssemblyRef}>
        {[-cableOffsetX, cableOffsetX].map((cx) => (
          <mesh
            key={`clamp-${cx}`}
            position={[cx, frameTopY + 0.032, 0]}
            material={materials.brushedBrass}
            raycast={noRaycast}
          >
            <cylinderGeometry args={[0.022, 0.026, 0.068, 14]} />
          </mesh>
        ))}

        {/* Cantilevered Museum Linear Grazing Light Bar */}
        <group position={[0, frameTopY + 0.16, 0]}>
          {[-outerW * 0.28, outerW * 0.28].map((lx) => (
            <mesh
              key={lx}
              position={[lx, 0, 0.085]}
              material={materials.burnishedBronze}
              raycast={noRaycast}
            >
              <boxGeometry args={[0.018, 0.018, 0.17]} />
            </mesh>
          ))}
          <mesh
            position={[0, 0, 0.17]}
            material={materials.burnishedBronze}
            raycast={noRaycast}
          >
            <boxGeometry args={[outerW * 0.86, 0.028, 0.036]} />
          </mesh>
          <mesh position={[0, -0.016, 0.17]} raycast={noRaycast}>
            <boxGeometry args={[outerW * 0.84, 0.008, 0.024]} />
            <meshBasicMaterial color={active ? '#ffffff' : '#d8dce4'} />
          </mesh>
        </group>

        {/* Razor-Thin Anodized Dark Titanium Outer Chassis */}
        <mesh
          position={[0, centerY, -frameDepth * 0.5]}
          material={materials.walnutMillwork}
          castShadow={enableShadows}
          receiveShadow={enableShadows}
          raycast={noRaycast}
        >
          <boxGeometry args={[outerW, outerH, frameDepth]} />
        </mesh>

        {/* Brushed Silver Titanium Inner Bezel */}
        <mesh
          position={[0, centerY, 0.002]}
          material={materials.brushedBrass}
          raycast={noRaycast}
        >
          <boxGeometry args={[trimW, trimH, 0.012]} />
        </mesh>

        {/* Active Pure White Perimeter Halo */}
        {active && (
          <mesh position={[0, centerY, 0.009]} raycast={noRaycast}>
            <planeGeometry args={[canvasW + 0.03, canvasH + 0.03]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        )}

        {/* High-Resolution Exhibition Canvas */}
        <mesh position={[0, centerY, 0.012]} raycast={noRaycast}>
          <planeGeometry args={[canvasW, canvasH]} />
          <meshBasicMaterial map={tableauTexture} toneMapped={false} />
        </mesh>

        {/* Generous Invisible Ergonomic Hit-Plane (makes distant clicks effortless) */}
        <mesh
          position={[0, centerY, 0.02]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHovered(true);
            onHover(station.title);
          }}
          onPointerOut={() => {
            setHovered(false);
            onHover(null);
          }}
          onClick={handleTableauClick}
        >
          <planeGeometry args={[canvasW + 0.36, canvasH + 0.36]} />
          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        {/* 3 Physical Slide Indicator Micro-Dots Below Frame Rail */}
        {[0, 1, 2].map((sIdx) => {
          const isCurrentSlide = effectiveSlide === sIdx;
          return (
            <mesh
              key={sIdx}
              position={[
                (sIdx - 1) * 0.085,
                centerY - outerH * 0.5 - 0.06,
                0.01,
              ]}
              raycast={noRaycast}
            >
              <circleGeometry args={[isCurrentSlide ? 0.017 : 0.011, 16]} />
              <meshBasicMaterial
                color={isCurrentSlide ? '#ffffff' : '#6c727f'}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export function WorldInteractiveStations3D({
  materials,
}: WorldInteractiveStations3DProps) {
  const inspectedStationId = useLibraryStore((s) => s.inspectedStationId);
  const stationSlideIndex = useLibraryStore((s) => s.stationSlideIndex);
  const inspectStation = useLibraryStore((s) => s.inspectStation);
  const stepStationSlide = useLibraryStore((s) => s.stepStationSlide);
  const setHoveredStationLabel = useLibraryStore(
    (s) => s.setHoveredStationLabel
  );
  const hoveredStationLabel = useLibraryStore((s) => s.hoveredStationLabel);
  const deviceTier = useLibraryStore((s) => s.deviceTier);
  const enableShadows = deviceTier === 'desktop';

  useCursor(Boolean(hoveredStationLabel), 'pointer', 'auto');

  return (
    <group>
      {WORLD_STATIONS_3D.map((station) => (
        <SuspendedTitaniumTableau
          key={station.id}
          station={station}
          materials={materials}
          isInspected={inspectedStationId === station.id}
          activeSlideIndex={stationSlideIndex}
          enableShadows={enableShadows}
          onSelect={inspectStation}
          onStepSlide={() => stepStationSlide(1)}
          onHover={setHoveredStationLabel}
        />
      ))}
    </group>
  );
}
