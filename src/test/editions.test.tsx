import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LumoraApp } from '../editions/lumora/LumoraApp';
import { GlideApp } from '../editions/glide/GlideApp';

function relativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Édition Lumora & Édition Glide Panel Sound', () => {
  it('affiche les données authentiques de Loïc AKANDA dans Lumora sans faux pourcentages', () => {
    render(<LumoraApp />);
    expect(screen.getByText(/Idées fortes, conçues avec une précision calme/i)).toBeInTheDocument();
    expect(screen.getAllByText(/LAURA HOUSE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SassySkin/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/EtuCo/i).length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toMatch(/\b\d{2,3}\s*%/);
  });

  it('permet de glisser entre les 6 panneaux chromatiques de Glide Panel & Sound', () => {
    render(<GlideApp />);
    expect(screen.getByText(/01 \/ 06 — NOIR/i)).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /Panneau suivant/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/02 \/ 06 — FROST/i)).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(screen.getByText(/03 \/ 06 — MOSS/i)).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(screen.getByText(/04 \/ 06 — COBALT/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /LAURA HOUSE/i })).toBeInTheDocument();
  });

  it('respecte le contraste WCAG AA (>= 4.5:1) sur tous les thèmes Lumora et Glide', () => {
    // Lumora (#111113 sur #F6F5F1, #57554F sur #F6F5F1)
    expect(contrastRatio('#111113', '#F6F5F1')).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio('#57554F', '#F6F5F1')).toBeGreaterThanOrEqual(4.5);

    // Les 6 panneaux Glide (texte principal + CTA)
    const glidePairs: Array<[string, string]> = [
      ['#F5F6F8', '#0B0C10'],
      ['#0B0C10', '#D4AF37'],
      ['#141922', '#EAEFF4'],
      ['#FFFFFF', '#141922'],
      ['#F2F6F3', '#0C2117'],
      ['#0C2117', '#CE9460'],
      ['#F4F7FB', '#09111E'],
      ['#09111E', '#F59E0B'],
      ['#1D1815', '#EFECE6'],
      ['#FFFFFF', '#1D1815'],
      ['#F7F3EE', '#140F0B'],
      ['#140F0B', '#DE7E44'],
    ];

    for (const [fg, bg] of glidePairs) {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
