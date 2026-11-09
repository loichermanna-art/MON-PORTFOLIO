import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { WORLD_STATIONS_3D } from '../library/data/worldStations';
import { createSuspendedTableauTexture } from '../library/resources/proceduralSignage';
import {
  createArchedPortalWallGeometry,
  createFlutedColumnGeometry,
  createSacredWaterMaterial,
  createTempleBrazierGeometry,
  createTempleSkyMaterial,
  createTransverseCeilingArchGeometry,
  createVolumetricSunbeamMaterial,
} from '../library/resources/templeGeometryCompiler';
import {
  createCableStayedBridgeGeometry,
  createMetropolisSkyMaterial,
  createSkyscraperFacadeMaterial,
  createSteppedSkyscraperGeometry,
  createTaperedSupertallGeometry,
} from '../library/resources/metropolisCompiler';
import {
  libraryMotionState,
  useLibraryStore,
} from '../library/state/useLibraryStore';

describe('Tableaux Titane Suspendus & Focus Caméra Multi-Slides (Sans CV)', () => {
  beforeEach(() => {
    libraryMotionState.camX = 0;
    libraryMotionState.camY = 1.66;
    libraryMotionState.camZ = 11.2;
    libraryMotionState.yaw = 0;
    libraryMotionState.pitch = 0.025;
    libraryMotionState.glideActive = false;
    useLibraryStore.setState({
      activeRoomIndex: 0,
      inspectedStationId: null,
      stationSlideIndex: 0,
      hoveredStationLabel: null,
      guidedTourPlaying: false,
      hasStartedWalking: false,
      dossierOpen: false,
      dossierTab: 'overview',
      selectedProjectId: null,
      selectedCollectionId: 'finance',
      atmosphereMood: 'twilight',
      reducedMotion: false,
      manualReducedMotion: null,
    });
  });

  it('Cycle 1 : interface épurée sans aucun affichage de CV et capsule 01–06', () => {
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Loïc\s*AKANDA/i
    );

    // Zéro bouton ou lien CV affiché
    expect(screen.queryByRole('link', { name: /CV/i })).toBeNull();

    // Aucun bandeau focus tant qu’aucun tableau 3D n’est sélectionné
    expect(
      screen.queryByRole('region', { name: /Inspection 3D/i })
    ).toBeNull();

    // Capsule discrète 01..06 + bouton visite guidée
    const spacesNav = screen.getByRole('navigation', {
      name: /Navigation spatiale dans les six salles du parcours 3D/i,
    });
    expect(within(spacesNav).getAllByRole('button')).toHaveLength(7);

    expect(
      container.querySelector('.library-static-fallback img')
    ).toHaveAttribute('src', '/scenes/library-entrance-fallback.jpg');
  });

  it('Cycle 2 : déplace le visiteur à travers les 6 salles (01 -> 06) sans modale forcée', () => {
    render(<App />);

    const spacesNav = screen.getByRole('navigation', {
      name: /Navigation spatiale dans les six salles du parcours 3D/i,
    });

    fireEvent.click(
      within(spacesNav).getByRole('button', { name: /02\s*Le Parcours/i })
    );
    expect(useLibraryStore.getState().activeRoomIndex).toBe(1);
    expect(libraryMotionState.glideTargetZ).toBeCloseTo(-2.6, 1);

    fireEvent.click(
      within(spacesNav).getByRole('button', { name: /04\s*Les Réalisations/i })
    );
    expect(useLibraryStore.getState().activeRoomIndex).toBe(3);
    expect(libraryMotionState.glideTargetZ).toBeCloseTo(-51.4, 1);

    fireEvent.click(
      within(spacesNav).getByRole('button', { name: /06\s*Le Belvédère/i })
    );
    expect(useLibraryStore.getState().activeRoomIndex).toBe(5);
    expect(libraryMotionState.glideTargetZ).toBeCloseTo(-98.4, 1);
  });

  it('Cycle 3 : focus caméra face au tableau + navigation en 3 mini-slides (01 · 02 · 03) sans CV', () => {
    render(<App />);

    // Stage IACG : Slide 01 -> Slide 02 (Missions Sage 100)
    act(() => {
      useLibraryStore
        .getState()
        .inspectStation('station-milestone-stage-iacg');
    });
    expect(useLibraryStore.getState().stationSlideIndex).toBe(0);
    fireEvent.click(screen.getByRole('tab', { name: /02 · Missions/i }));
    expect(useLibraryStore.getState().stationSlideIndex).toBe(1);
    expect(
      screen.getByRole('region', { name: /Inspection 3D/i })
    ).toHaveTextContent(/Sage 100/i);

    // Stage Drone Groupe CI : Slide 02 (tableau de bord)
    act(() => {
      useLibraryStore
        .getState()
        .inspectStation('station-milestone-stage-drone-groupe');
    });
    fireEvent.click(screen.getByRole('tab', { name: /02 · Missions/i }));
    expect(
      screen.getByRole('region', { name: /Inspection 3D/i })
    ).toHaveTextContent(/tableau de bord/i);

    // Compétences sans %
    act(() => {
      useLibraryStore.getState().inspectStation('station-skill-audit');
    });
    expect(
      screen.getByRole('region', { name: /Inspection 3D/i }).textContent
    ).not.toMatch(/\b\d{1,3}\s*%/);

    // LAURA HOUSE : Slide 02 · Analyse contient la note Wave vérifiée
    act(() => {
      useLibraryStore.getState().inspectStation('station-project-laura-house');
    });
    fireEvent.click(screen.getByRole('tab', { name: /02 · Analyse/i }));
    expect(
      screen.getByText(/lien marchand Wave de la cliente/i)
    ).toBeInTheDocument();

    // GYM OS SPORT : SVG biomécanique accessible
    act(() => {
      useLibraryStore.getState().inspectStation('station-project-gym-os-sport');
    });
    expect(
      screen.getByAltText(
        /Décomposition biomécanique en 4 phases du Squat à la barre/i
      )
    ).toHaveAttribute('src', '/projects/gym-os-biomechanics.svg');

    // Contact : zéro CV affiché
    act(() => {
      useLibraryStore.getState().inspectStation('station-contact');
    });
    expect(screen.queryByRole('link', { name: /CV/i })).toBeNull();
    expect(screen.getByRole('link', { name: /Email/i })).toHaveAttribute(
      'href',
      'mailto:loichermanna@gmail.com'
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Fermer et continuer la marche/i })
    );
    expect(useLibraryStore.getState().inspectedStationId).toBeNull();
  });

  it('Cycle 4 : génère proprement les textures haute définition des 3 slides pour chaque famille de tableau 3D', () => {
    const sampleIds = [
      'station-identity',
      'station-milestone-stage-iacg',
      'station-skill-finance',
      'station-project-sassyskin',
      'station-method-01',
      'station-contact',
    ];
    for (const id of sampleIds) {
      const st = WORLD_STATIONS_3D.find((s) => s.id === id)!;
      for (const slide of [0, 1, 2]) {
        const tex = createSuspendedTableauTexture(st, slide, 0, 8);
        expect(tex.image.width).toBeGreaterThanOrEqual(1440);
        tex.dispose();
      }
    }
  });

  it('Cycle 5 : compile la Métropole Monochrome 360°, bascule les 3 ambiances et vérifie le Mode Lecture sans CV', () => {
    const colGeo = createFlutedColumnGeometry(6.0, 0.34);
    const archGeo = createArchedPortalWallGeometry(14.4, 9.4, 5.2, 4.4, 0.82);
    const ribGeo = createTransverseCeilingArchGeometry(8.8, 4.6, 6.1, 0.46);
    const brazierGeo = createTempleBrazierGeometry();
    const skyMat = createTempleSkyMaterial();
    const beamMat = createVolumetricSunbeamMaterial();
    const waterMat = createSacredWaterMaterial();
    const steppedGeo = createSteppedSkyscraperGeometry();
    const supertallGeo = createTaperedSupertallGeometry();
    const bridge = createCableStayedBridgeGeometry();
    const stoneFacade = createSkyscraperFacadeMaterial('stoneArtDeco');
    const glassFacade = createSkyscraperFacadeMaterial('glassCurtain');
    const metroSky = createMetropolisSkyMaterial();

    expect(colGeo.attributes.position.count).toBeGreaterThan(200);
    expect(steppedGeo.attributes.position.count).toBeGreaterThan(100);

    colGeo.dispose();
    archGeo.dispose();
    ribGeo.dispose();
    brazierGeo.dispose();
    skyMat.dispose();
    beamMat.dispose();
    waterMat.dispose();
    steppedGeo.dispose();
    supertallGeo.dispose();
    bridge.structureGeo.dispose();
    bridge.cablesGeo.dispose();
    stoneFacade.dispose();
    glassFacade.dispose();
    metroSky.dispose();

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Mode Lecture/i }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // Même dans le Mode Lecture (onglet Contact), aucun lien CV n’est affiché
    fireEvent.click(within(dialog).getByRole('tab', { name: /06.*Belvédère/i }));
    expect(within(dialog).queryByRole('link', { name: /CV/i })).toBeNull();
  });
});
