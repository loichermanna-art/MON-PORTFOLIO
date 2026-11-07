import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';
import {
  motionStore,
  selectAboutPillar,
  setActiveProcessStep,
  setFocusedProjectIndex,
  setReducedMotionPreference,
  setScrollProgress,
} from '../motion/motionStore';

describe('Portfolio Loïc AKANDA — Conformité Éditoriale, Architecturale & 3D (Scènes 01 -> 06)', () => {
  it('Cycle 1 : valide la Scène 01 (Hero : identité Loïc AKANDA, 3e année cycle ingénieur Finance INP-HB, accès Projets & CV PDF, navigation 01–06)', () => {
    const { container } = render(<App />);

    expect(screen.getByText(/Aller au contenu principal/i)).toBeInTheDocument();
    expect(screen.getByText(/PORTFOLIO · CÔTE D’IVOIRE/i)).toBeInTheDocument();

    const h1List = screen.getAllByRole('heading', { level: 1 });
    expect(h1List).toHaveLength(1);
    expect(h1List[0]).toHaveTextContent(/Loïc\s*AKANDA/i);

    expect(
      screen.getByText(/Étudiant en 3e année du cycle ingénieur en Finance à l’INP-HB/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Découvrir mes 4 réalisations/i })
    ).toHaveAttribute('href', '#projects');

    const cvLinks = screen.getAllByRole('link', { name: /CV/i });
    expect(
      cvLinks.some((link) => link.getAttribute('href') === '/cv/CV-Loic-AKANDA.pdf')
    ).toBe(true);

    const topNav = screen.getByRole('navigation', {
      name: /Barre de navigation supérieure/i,
    });
    expect(within(topNav).getAllByRole('link')).toHaveLength(6);

    const railNav = screen.getByRole('navigation', {
      name: /Navigation directe des six sections/i,
    });
    const railLinks = within(railNav).getAllByRole('link');
    expect(railLinks).toHaveLength(6);
    expect(railLinks[0]).toHaveAttribute('aria-current', 'true');

    for (const id of ['hero', 'about', 'expertise', 'projects', 'process', 'contact']) {
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }

    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
  });

  it('Cycle 2 : vérifie le couplage entre les 4 stèles du Hero et les 5 monolithes de la Scène 03 (Compétences)', () => {
    render(<App />);

    const domainNav = screen.getByRole('navigation', {
      name: /Domaines d’activité mis en lumière dans l’espace 3D/i,
    });
    const auditLink = within(domainNav).getByRole('link', { name: /AUDIT & ANALYSE/i });

    fireEvent.mouseEnter(auditLink);
    expect(motionStore.heroSteleHoverIndex).toBe(1);

    fireEvent.click(auditLink);
    expect(motionStore.selectedExpertiseIndex).toBe(1);
    expect(
      screen.getByRole('tabpanel', { name: /Détails du domaine Audit et analyse financière/i })
    ).toBeInTheDocument();

    fireEvent.mouseLeave(auditLink);
    expect(motionStore.heroSteleHoverIndex).toBe(-1);
  });

  it('Cycle 3 : vérifie l’exactitude du Parcours (Scène 02 : 6 jalons chronologiques, stages vérifiés Drone Groupe CI & IACG) et 0 % dans Compétences (Scène 03)', () => {
    const { container } = render(<App />);

    // Stages vérifiés sur le CV officiel
    expect(screen.getByRole('heading', { name: 'DRONE GROUPE CI' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'IACG' })).toBeInTheDocument();
    expect(
      screen.getByText(/Cabinet d’expertise comptable et de conseil/i)
    ).toBeInTheDocument();

    // Ligne temporelle spatiale à 6 étapes
    const timelineList = screen.getByRole('tablist', {
      name: /Étapes chronologiques du parcours académique et professionnel/i,
    });
    expect(within(timelineList).getAllByRole('tab')).toHaveLength(6);

    // 5 domaines de compétences et absence stricte de jauges %
    const expertiseTabs = screen.getByRole('tablist', {
      name: /Les cinq domaines de compétences/i,
    });
    expect(within(expertiseTabs).getAllByRole('tab')).toHaveLength(5);

    const expertiseSection = container.querySelector('#expertise');
    expect(expertiseSection?.textContent).not.toMatch(/\b\d{1,3}\s*%/);
  });

  it('Cycle 4 : vérifie les 4 Projets réels (SassySkin, AE-ECS, LAURA HOUSE avec mention Wave manuelle, GYM OS SPORT) et l’étude de cas en 12 points', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'SassySkin' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AE-ECS' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'LAURA HOUSE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'GYM OS SPORT' })).toBeInTheDocument();

    // Précision éditoriale obligatoire sur LAURA HOUSE (lien marchand Wave + validation manuelle)
    expect(
      screen.getByText(/lien marchand Wave de la cliente/i)
    ).toBeInTheDocument();

    // Ouverture de l'étude de cas complète (12 points) et fermeture clavier Escape
    const openLauraBtn = screen.getByRole('button', {
      name: /Ouvrir l'étude de cas complète de LAURA HOUSE/i,
    });
    fireEvent.click(openLauraBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByText(/07 · MA CONTRIBUTION PERSONNELLE/i)).toBeInTheDocument();
    expect(
      within(dialog).getByText(/09 · FONCTIONNALITÉS RÉELLEMENT DÉVELOPPÉES/i)
    ).toBeInTheDocument();

    const closeBtn = within(dialog).getByRole('button', { name: /Fermer la fiche projet/i });
    expect(document.activeElement).toBe(closeBtn);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Cycle 5 : vérifie les 6 étapes de la Méthode (Scène 05), les coordonnées Contact réelles (Scène 06), la réversibilité du scroll et le mouvement réduit', () => {
    const stops: Array<[number, number]> = [
      [0.0, 0],
      [0.22, 1],
      [0.4, 2],
      [0.62, 3],
      [0.84, 4],
      [0.96, 5],
    ];

    act(() => {
      for (const [p, idx] of stops) {
        setScrollProgress(p);
        expect(motionStore.activeScene).toBe(idx);
      }
      for (const [p, idx] of [...stops].reverse()) {
        setScrollProgress(p);
        expect(motionStore.activeScene).toBe(idx);
      }
    });

    render(<App />);

    // Les 6 portiques de la méthode
    expect(screen.getByRole('tab', { name: /1\.\s*Comprendre/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /2\.\s*Analyser/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /3\.\s*Concevoir/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /4\.\s*Développer ou réaliser/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /5\.\s*Tester/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /6\.\s*Améliorer/i })).toBeInTheDocument();

    // Coordonnées professionnelles réelles renseignées (zéro placeholder "À renseigner")
    expect(screen.getByText('loichermanna@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('linkedin.com/in/loic-akanda-assi')).toBeInTheDocument();
    expect(screen.getByText('github.com/loichermanna-art')).toBeInTheDocument();
    expect(screen.queryByText(/À renseigner/i)).toBeNull();

    // Toggle mouvement réduit dans le menu
    fireEvent.click(screen.getByRole('button', { name: /Menu/i }));
    const motionBtn = screen.getByRole('button', { name: /mouvement réduit/i });
    motionStore.pointerX = 0.5;
    fireEvent.click(motionBtn);
    expect(motionStore.reducedMotion).toBe(true);
    expect(motionStore.pointerX).toBe(0);

    act(() => {
      setReducedMotionPreference(false);
    });
  });

  it('Cycle 6 : prouve la synchronisation bidirectionnelle motionStore <-> UI et la présence des visuels réels des 4 projets', () => {
    const { container } = render(<App />);

    act(() => {
      selectAboutPillar(5);
    });
    expect(
      screen.getByRole('tabpanel', {
        name: /Détail de l'étape Président du Club Études-Conseils/i,
      })
    ).toBeInTheDocument();

    act(() => {
      setFocusedProjectIndex(0);
    });
    const sassyPavilion = screen.getByRole('listitem', {
      name: /Pavillon projet SassySkin/i,
    });
    expect(sassyPavilion).toHaveAttribute('data-active', 'true');

    act(() => {
      setActiveProcessStep(4);
    });
    expect(screen.getByText(/ÉTAPE 05 \/ 06/i)).toBeInTheDocument();

    // Visuels authentiques GYM OS SPORT & SassySkin
    expect(
      screen.getByAltText(/Décomposition biomécanique en 4 phases du Squat à la barre/i)
    ).toHaveAttribute('src', '/projects/gym-os-biomechanics.svg');

    // Curseur contextuel activé au survol d'un pavillon projet
    fireEvent.mouseEnter(sassyPavilion);
    const cursorPill = container.querySelector('.zenith-cursor-pill');
    expect(cursorPill).toHaveAttribute('data-visible', 'true');
    fireEvent.mouseLeave(sassyPavilion);
    expect(cursorPill).toHaveAttribute('data-visible', 'false');

    act(() => {
      setFocusedProjectIndex(-1);
      setActiveProcessStep(0);
      selectAboutPillar(4);
      setScrollProgress(0);
    });
  });
});
