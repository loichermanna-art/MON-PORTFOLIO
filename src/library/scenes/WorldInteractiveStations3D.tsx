import { useEffect, useMemo, useState } from 'react';
import { useCursor } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import type { LibraryMaterialPalette } from '../resources/useLibraryMaterials';
import { createSuspendedTableauTexture } from '../resources/proceduralSignage';
import { WORLD_STATIONS_3D, type WorldStation3D } from '../data/worldStations';
import { useLibraryStore } from '../state/useLibraryStore';

interface WorldInteractiveStations3DProps {
  materials: LibraryMaterialPalette;
}

const noRaycast = () => null;

/**
 * Ultra-slim Black-Anodized & Brushed Titanium Frame suspended from the ceiling
 * by twin tensioned steel cables with cantilevered museum white grazing light.
 * Supports 3 live interactive slides directly on the 3D canvas.
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

  const projectId = station.project?.id ?? '';
  const visualIdx = useLibraryStore((s) =>
    projectId ? (s.projectVisualIndex[projectId] ?? 0) : 0
  );

  // Only show slide 1/2 on the currently inspected tableau; all others show crisp Slide 0 poster
  const effectiveSlide = isInspected ? activeSlideIndex : 0;

  // Dimensions tailored to tableau family
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

  // Ceiling anchor height relative to local station root
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

  return (
    <group position={station.position} rotation={[0, station.rotationY, 0]}>
      {/* Subtle Floor Alignment Hairline Marker (zero bulky pedestal) */}
      <mesh
        position={[0, 0.004, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        raycast={noRaycast}
      >
        <planeGeometry args={[outerW * 0.82, 0.024]} />
        <meshBasicMaterial
          color={active ? '#ffffff' : '#8e94a0'}
          transparent
          opacity={active ? 0.65 : 0.22}
        />
      </mesh>

      {/* Twin Tensioned Brushed-Steel Suspension Cables + CNC Ceiling & Frame Clamps */}
      {[-cableOffsetX, cableOffsetX].map((cx) => (
        <group key={cx}>
          {/* Ceiling Anchor Plate */}
          <mesh
            position={[cx, ceilingLocalY - 0.02, 0]}
            material={materials.brushedBrass}
            raycast={noRaycast}
          >
            <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
          </mesh>

          {/* Tensioned Steel Cable */}
          <mesh
            position={[cx, cableCenterY, 0]}
            material={materials.brushedBrass}
            raycast={noRaycast}
          >
            <cylinderGeometry args={[0.0075, 0.0075, cableLen, 10]} />
          </mesh>

          {/* Top Frame CNC Titanium Clamp */}
          <mesh
            position={[cx, frameTopY + 0.032, 0]}
            material={materials.brushedBrass}
            raycast={noRaycast}
          >
            <cylinderGeometry args={[0.022, 0.026, 0.068, 14]} />
          </mesh>
        </group>
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
        {/* Pure White Linear Diffuser */}
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

      {/* Active Pure White Perimeter Halo when Hovered or Inspected */}
      {active && (
        <mesh position={[0, centerY, 0.009]} raycast={noRaycast}>
          <planeGeometry args={[canvasW + 0.028, canvasH + 0.028]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}

      {/* High-Resolution Interactive Exhibition Canvas */}
      <mesh
        position={[0, centerY, 0.012]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          onHover(station.title);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (isInspected) {
            onStepSlide();
          } else {
            onSelect(station.id);
          }
        }}
      >
        <planeGeometry args={[canvasW, canvasH]} />
        <meshBasicMaterial map={tableauTexture} toneMapped={false} />
      </mesh>

      {/* 3 Physical Slide Indicator Micro-Dots Below Frame Rail */}
      {[0, 1, 2].map((sIdx) => {
        const isCurrentSlide = effectiveSlide === sIdx;
        return (
          <mesh
            key={sIdx}
            position={[(sIdx - 1) * 0.085, centerY - outerH * 0.5 - 0.06, 0.01]}
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
