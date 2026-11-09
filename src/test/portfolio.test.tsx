import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
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

describe('Immersion Pure 3D — Monochrome Carbone, Titane & Blanc Pur', () => {
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

  it('Cycle 1 : interface Immersion Pure (zéro pavé de texte par défaut, uniquement Loïc AKANDA + CV + capsule 01–06)', () => {
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /Loïc\s*AKANDA/i
    );

    // Aucun panneau d’inspection tant qu’on n’a pas cliqué sur un élément 3D
    expect(
      screen.queryByRole('region', { name: /Inspection 3D/i })
    ).toBeNull();

    // Capsule discrète 01..06 + bouton play visite guidée
    const spacesNav = screen.getByRole('navigation', {
      name: /Navigation spatiale dans les six salles du parcours 3D/i,
    });
    expect(within(spacesNav).getAllByRole('button')).toHaveLength(7);

    const cvLinks = screen.getAllByRole('link', { name: /CV/i });
    expect(
      cvLinks.some((l) => l.getAttribute('href') === '/cv/CV-Loic-AKANDA.pdf')
    ).toBe(true);

    expect(
      container.querySelector('.library-static-fallback img')
    ).toHaveAttribute('src', '/scenes/library-entrance-fallback.jpg');
  });

  it('Cycle 2 : déplace réellement le visiteur à travers les 6 salles (01 -> 06) sans modale 2D forcée', () => {
    render(<App />);

    const spacesNav = screen.getByRole('navigation', {
      name: /Navigation spatiale dans les six salles du parcours 3D/i,
    });

    fireEvent.click(
      within(spacesNav).getByRole('button', { name: /02\s*Le Parcours/i })
    );
    expect(useLibraryStore.getState().activeRoomIndex).toBe(1);
    expect(libraryMotionState.glideTargetZ).toBeCloseTo(-2.6, 1);
    expect(screen.queryByRole('dialog')).toBeNull();

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

  it('Cycle 3 : ouvre la fiche uniquement au clic sur une station 3D (stages IACG / Drone CI, compétences sans %, LAURA HOUSE Wave manuel, GYM OS SPORT SVG)', () => {
    render(<App />);

    act(() => {
      useLibraryStore
        .getState()
        .inspectStation('station-milestone-stage-iacg');
    });
    expect(
      screen.getByRole('region', { name: /Inspection 3D/i })
    ).toHaveTextContent(/Sage 100/i);

    act(() => {
      useLibraryStore
        .getState()
        .inspectStation('station-milestone-stage-drone-groupe');
    });
    expect(
      screen.getByRole('region', { name: /Inspection 3D/i })
    ).toHaveTextContent(/tableau de bord/i);

    act(() => {
      useLibraryStore.getState().inspectStation('station-skill-audit');
    });
    const skillPanel = screen.getByRole('region', {
      name: /Inspection 3D/i,
    });
    expect(skillPanel.textContent).not.toMatch(/\b\d{1,3}\s*%/);

    act(() => {
      useLibraryStore.getState().inspectStation('station-project-laura-house');
    });
    expect(
      screen.getByText(/lien marchand Wave de la cliente/i)
    ).toBeInTheDocument();

    act(() => {
      useLibraryStore.getState().inspectStation('station-project-gym-os-sport');
    });
    expect(
      screen.getByAltText(
        /Décomposition biomécanique en 4 phases du Squat à la barre/i
      )
    ).toHaveAttribute('src', '/projects/gym-os-biomechanics.svg');

    fireEvent.click(
      screen.getByRole('button', { name: /Fermer et continuer la marche/i })
    );
    expect(useLibraryStore.getState().inspectedStationId).toBeNull();
  });

  it('Cycle 4 : valide le mode Mouvement Réduit, la Visite Guidée et le Mode Lecture accessible (Escape)', () => {
    render(<App />);

    const motionBtn = screen.getByRole('button', { name: /Mouvement :/i });
    fireEvent.click(motionBtn);
    expect(useLibraryStore.getState().reducedMotion).toBe(true);

    const tourBtn = screen.getByRole('button', {
      name: /Visite guidée automatique/i,
    });
    fireEvent.click(tourBtn);
    expect(useLibraryStore.getState().guidedTourPlaying).toBe(true);
    expect(useLibraryStore.getState().inspectedStationId).toBe(
      'station-identity'
    );

    fireEvent.click(screen.getByRole('button', { name: /Mode Lecture/i }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Cycle 5 : compile les géométries architecturales & la Métropole Monochrome 360° et bascule les 3 ambiances lumineuses', () => {
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
    expect(archGeo.attributes.position.count).toBeGreaterThan(100);
    expect(steppedGeo.attributes.position.count).toBeGreaterThan(100);
    expect(supertallGeo.attributes.position.count).toBeGreaterThan(50);
    expect(bridge.structureGeo.attributes.position.count).toBeGreaterThan(100);
    expect(stoneFacade.uniforms.uNightFactor.value).toBeCloseTo(0.72);
    expect(glassFacade.uniforms.uWarmWindow.value).toBeDefined();

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
    const skyBtn = screen.getByRole('button', {
      name: /Ambiance : Platine/i,
    });
    fireEvent.click(skyBtn);
    expect(useLibraryStore.getState().atmosphereMood).toBe('night');
    fireEvent.click(
      screen.getByRole('button', { name: /Ambiance : Nuit Carbone/i })
    );
    expect(useLibraryStore.getState().atmosphereMood).toBe('day');
  });
});
