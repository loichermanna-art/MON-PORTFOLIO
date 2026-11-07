import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';
import {
  motionStore,
  setReducedMotionPreference,
  setScrollProgress,
} from '../motion/motionStore';

describe('Portfolio Loïc AKANDA — Direction « MIDNIGHT BLUE » & Prototype Hero (Phases 1–3)', () => {
  it('Cycle 1 : valide le Prototype Hero (PORTFOLIO 2026, Loïc AKANDA, FINANCE. INNOVATION. IMPACT., Découvrir mon univers, SCROLL TO EXPLORE) et la navigation 01–06', () => {
    const { container } = render(<App />);

    expect(screen.getByText(/Aller au contenu principal/i)).toBeInTheDocument();
    expect(screen.getByText('PORTFOLIO 2026')).toBeInTheDocument();

    const h1List = screen.getAllByRole('heading', { level: 1 });
    expect(h1List).toHaveLength(1);
    expect(h1List[0]).toHaveTextContent(/Loïc\s*AKANDA/i);

    expect(screen.getByLabelText('FINANCE. INNOVATION. IMPACT.')).toBeInTheDocument();
    expect(
      screen.getByText(/Étudiant en finance & créateur de solutions numériques\./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Découvrir mon univers/i })).toHaveAttribute(
      'href',
      '#about'
    );
    expect(screen.getByText('SCROLL TO EXPLORE')).toBeInTheDocument();

    // Navigation verticale gauche : les 6 numéros 01..06 sont présents et interactifs
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

  it('Cycle 2 : vérifie le couplage entre les axes de la stèle Hero (AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION) et la section Expertise', () => {
    render(<App />);

    const auditChip = screen.getByRole('button', { name: 'AUDIT' });
    fireEvent.mouseEnter(auditChip);
    expect(motionStore.heroSteleHoverIndex).toBe(0);
    expect(screen.getByText(/STÈLE 3D ACTIVE · AUDIT/i)).toBeInTheDocument();

    // Un clic sur AUDIT active directement le domaine « Audit et analyse » (index 1)
    fireEvent.click(auditChip);
    expect(motionStore.selectedExpertiseIndex).toBe(1);
    expect(
      screen.getByText(/Approche méthodique de contrôle des processus/i)
    ).toBeInTheDocument();

    fireEvent.mouseLeave(auditChip);
    expect(motionStore.heroSteleHoverIndex).toBe(-1);
  });

  it('Cycle 3 : garantit l’authenticité des contenus (INP-HB, 4 domaines sans %, 3 projets réels, 6 étapes exactes)', () => {
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: 'LAURA HOUSE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'SassySkin' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'EtuCo' })).toBeInTheDocument();

    const expertiseSection = container.querySelector('#expertise');
    expect(expertiseSection?.textContent).not.toMatch(/\b\d{1,3}\s*%/);

    // Les 6 étapes exactes exigées par le Master Prompt
    expect(screen.getByRole('tab', { name: /1\.\s*Comprendre/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /2\.\s*Analyser/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /3\.\s*Concevoir/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /4\.\s*Développer/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /5\.\s*Tester/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /6\.\s*Améliorer/i })).toBeInTheDocument();
  });

  it('Cycle 4 : vérifie l’ouverture/fermeture clavier des projets, de la fiche contact et du Menu', () => {
    render(<App />);

    const lauraTile = screen.getByRole('listitem', {
      name: /Ouvrir la présentation détaillée de LAURA HOUSE/i,
    });
    fireEvent.click(lauraTile);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    const closeBtn = within(dialog).getByRole('button', { name: /Fermer la fiche projet/i });
    expect(document.activeElement).toBe(closeBtn);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();

    const contactBtn = screen.getByRole('button', { name: /Afficher les coordonnées/i });
    fireEvent.click(contactBtn);
    expect(screen.getAllByText(/À renseigner/i).length).toBeGreaterThanOrEqual(2);

    const menuBtn = screen.getByRole('button', { name: /Menu/i });
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('Cycle 5 : assure la réversibilité du scroll (01 <-> 06) et le mode prefers-reduced-motion', () => {
    const stops: Array<[number, number]> = [
      [0.0, 0],
      [0.22, 1],
      [0.4, 2],
      [0.6, 3],
      [0.82, 4],
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
    fireEvent.click(screen.getByRole('button', { name: /Menu/i }));
    const motionBtn = screen.getByRole('button', { name: /mouvement réduit/i });
    motionStore.pointerX = 0.6;
    fireEvent.click(motionBtn);
    expect(motionStore.reducedMotion).toBe(true);
    expect(motionStore.pointerX).toBe(0);

    act(() => {
      setReducedMotionPreference(false);
    });
  });
});
