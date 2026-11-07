import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';
import {
  motionStore,
  setReducedMotionPreference,
  setScrollProgress,
} from '../motion/motionStore';

describe('Portfolio Loïc AKANDA — Base « Horizon Monolithique » (HUD Spatial & 3D)', () => {
  it('Cycle 1 : rend le Rail HUD gauche (LA · 01/06), un H1 unique, les 6 scènes et le repli WebGL', () => {
    const { container } = render(<App />);

    expect(screen.getByText(/Aller au contenu principal/i)).toBeInTheDocument();
    expect(container.querySelector('.hud-rail')).not.toBeNull();
    expect(screen.getByText('/06')).toBeInTheDocument();

    const h1List = screen.getAllByRole('heading', { level: 1 });
    expect(h1List).toHaveLength(1);
    expect(h1List[0]).toHaveTextContent(/Loïc\s*AKANDA/i);

    for (const id of ['hero', 'about', 'expertise', 'projects', 'process', 'contact']) {
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }

    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
  });

  it('Cycle 2 : préserve l’intégrité factuelle (INP-HB, 3 projets prioritaires, 0 % fictif, 6 capsules démarche)', () => {
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: 'LAURA HOUSE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'SassySkin' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'EtuCo' })).toBeInTheDocument();

    const expertiseSection = container.querySelector('#expertise');
    expect(expertiseSection).not.toBeNull();
    expect(expertiseSection?.textContent).not.toMatch(/\b\d{1,3}\s*%/);

    // Les 6 capsules orbitales numérotées sont présentes
    expect(screen.getByRole('tab', { name: /1\. Comprendre le problème/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /2\. Analyser les besoins/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /3\. Structurer une solution/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /4\. Concevoir/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /5\. Développer ou exécuter/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /6\. Tester et améliorer/i })).toBeInTheDocument();
  });

  it('Cycle 3 : ouvre les 3 écrans flottants Projets (modale accessible + Échap), la fiche Contact et le tiroir Menu ⋮', () => {
    render(<App />);

    const projectTiles = screen.getAllByRole('listitem').filter((el) =>
      el.classList.contains('floating-project-tile')
    );
    expect(projectTiles).toHaveLength(3);
    fireEvent.click(projectTiles[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(
      within(dialog).getByRole('heading', { level: 2, name: 'LAURA HOUSE' })
    ).toBeInTheDocument();

    const closeDialogBtn = within(dialog).getByRole('button', { name: /Fermer la fiche projet/i });
    expect(document.activeElement).toBe(closeDialogBtn);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();

    // Fiche contact crépusculaire (affiche les coordonnées vérifiées et marqueurs honnêtes)
    const contactBtn = screen.getByRole('button', { name: /Me contacter/i });
    fireEvent.click(contactBtn);
    expect(screen.getAllByText(/À CONFIRMER/i).length).toBeGreaterThanOrEqual(2);

    // Tiroir Menu ⋮ haut-droit
    const menuBtn = screen.getByRole('button', { name: /Menu/i });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('Cycle 4 : assure la réversibilité complète du scroll (01 -> 06 -> 01) et le contrôle Mouvement réduit dans Menu ⋮', () => {
    const forwardStops: Array<[number, number]> = [
      [0.0, 0],
      [0.22, 1],
      [0.4, 2],
      [0.6, 3],
      [0.82, 4],
      [0.96, 5],
    ];

    act(() => {
      for (const [progress, expectedScene] of forwardStops) {
        setScrollProgress(progress);
        expect(motionStore.activeScene).toBe(expectedScene);
      }
    });

    act(() => {
      for (const [progress, expectedScene] of [...forwardStops].reverse()) {
        setScrollProgress(progress);
        expect(motionStore.activeScene).toBe(expectedScene);
      }
    });

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Menu/i }));
    const motionBtn = screen.getByRole('button', { name: /mouvement réduit/i });
    motionStore.pointerX = 0.75;
    fireEvent.click(motionBtn);
    expect(motionStore.reducedMotion).toBe(true);
    expect(motionStore.pointerX).toBe(0);

    act(() => {
      setReducedMotionPreference(false);
    });
  });

  it('Cycle 5 : permet de consulter les planches maquettes via Menu ⋮ puis de revenir à l’expérience 3D', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Menu/i }));
    fireEvent.click(
      screen.getByRole('button', { name: /Consulter les planches maquettes \(Phase 4\)/i })
    );

    expect(screen.getByText(/Les 6 Scènes Architecturales & Spatiales/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Retour à l’expérience 3D/i }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Loïc\s*AKANDA/i);
  });
});
