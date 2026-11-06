# Portfolio de Loïc AKANDA — *L’Atrium de Haute Précision*

Expérience web **Corporate Immersive 3D** conçue et développée sur mesure pour **Loïc AKANDA** — Élève-ingénieur en finance (3e année du cycle ingénieur) à l’**INP-HB** (Côte d’Ivoire), à la croisée de la **finance, de la comptabilité, de l’audit, de l’analyse financière** et de la **conception / réalisation de produits numériques**.

---

## Architecture Narrative & Spatiale (6 Scènes Continues)

L’expérience traverse un **seul édifice architectural continu** en pierre d’albâtre, grès minéral et bronze patiné (`z = +16m` à `z = -98m`) :

1. **`01 · Introduction / Hero`** — *Le Péristyle de Lumière* & *Le Portique d’Équilibre*
2. **`02 · Parcours / About`** — *La Galerie à Claire-Voie* (hommage épuré au modernisme institutionnel de l’INP-HB)
3. **`03 · Expertise`** — *La Cour des Deux Piliers* (diptyque *Finance, Comptabilité, Audit & Analyse* ↔ *Produits Numériques, Développement Web & Projets*)
4. **`04 · Réalisations Sélectionnées`** — *La Salle des Monolithes d’Exposition* (**LAURA HOUSE**, **SassySkin**, **EtuCo**)
5. **`05 · Méthode / Process`** — *La Passerelle Séquentielle* (6 paliers verrouillés progressivement au fil du scroll)
6. **`06 · Contact`** — *Le Belvédère Ouvert*

---

## Documentation Studio du Dépôt

- [`PRODUCT.md`](./PRODUCT.md) — Positionnement, publics cibles, proposition de valeur & registre des `[À CONFIRMER]`
- [`DESIGN.md`](./DESIGN.md) — Direction artistique, palette vérifiée WCAG 2.2 AA/AAA, typographie fluide `clamp()`, grilles & matériaux PBR
- [`MOTION.md`](./MOTION.md) — Storyboard détaillé Desktop & Mobile des 6 scènes, trajectoires caméra & architecture sans conflit
- [`TECH-STACK.md`](./TECH-STACK.md) — Stack Vite + React 19 + TypeScript + Three.js / R3F / Drei + GSAP `ScrollTrigger` + Lenis + `@fontsource`
- [`CONTENT.md`](./CONTENT.md) — Textes éditoriaux vérifiés & marqueurs d’intégrité documentaire
- [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) — Feuille de route Phases 1 → 8 & conventions de performance WebGL
- [`docs/`](./docs/) — Rapports d’audit Phase 1, d’exploration artistique Phase 2 et de QA Phase 8

---

## Démarrage & Contrôles Qualité

```bash
npm install
npm run dev            # Serveur de développement (0.0.0.0:5173)
npm run typecheck      # Vérification TypeScript stricte
npm test               # Suite automatisée multi-cycles (Vitest)
npm run audit:contrast # Vérification mathématique WCAG 2.2 AA/AAA
npm run audit:qa       # Audit d'architecture WebGL, responsive & accessibilité
npm run build          # Compilation de production
```
