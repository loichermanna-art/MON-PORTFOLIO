# TECH-STACK.md — Audit Technique & Architecture Modulaire

---

## 1. Synthèse de l’Audit du Dépôt (Phase 1)

### Acquis conservés et consolidés
- **Socle applicatif** : `React 19.3` + `TypeScript 5.8` (strict) + `Vite 8.3` avec découpage manuel des bundles (`three-core`, `r3f-ecosystem`, `motion-vendor`).
- **Moteur 3D & Scroll** : `Three.js 0.187` + `@react-three/fiber 9.8` + `@react-three/drei 10.7` + `GSAP 3.15 (ScrollTrigger)` + `Lenis 1.3`.
- **Store hors-cycle React (`src/motion/motionStore.ts`)** : Zéro `setState` à 60 Hz pendant le défilement ; communication directe DOM ↔ WebGL.
- **Polices auto-hébergées OFL** : `@fontsource-variable/plus-jakarta-sans` et `@fontsource-variable/geist-mono` (zéro requête Google Fonts / CDN externe).

### Limites identifiées lors de l’audit et résolues
1. **Ancienne direction claire décorrélée de `REFERENCE_HERO_PORTFOLIO.png`** : Remplacée par le système de tokens, matériaux PBR et éclairages **Midnight Blue (`#071426` → `#FFFFFF`)**.
2. **Séparation rigide HTML / Canvas (`pointer-events: none` global)** : Remplacée par un **système mixte interactif** où les stèles architecturales 3D reçoivent les événements pointeur (survol, focus visuel, clic) tout en préservant l’accessibilité clavier native et la sélection de texte.
3. **Absence de vraies réflexions planaires au sol** : Intégration maîtrisée de `MeshReflectorMaterial` (`@react-three/drei`) sur la dalle bleu nuit avec résolution adaptative (`512` desktop / surface standard optimisée sur mobile).

---

## 2. Organisation des Dossiers

```text
src/
├── components/
│   ├── layout/          # MidnightNavigationShell (LA., rail 01-06, Menu, réseaux, scroll cue)
│   ├── projects/        # ProjectDetailDrawer & schémas d'architecture vectoriels réels
│   └── typography/      # MaskReveal (apparition par ligne masquée GPU)
├── data/
│   └── portfolioData.ts # Contenus authentiques vérifiés (Loïc AKANDA, INP-HB, 3 projets, 6 étapes)
├── motion/
│   ├── motionConfig.ts  # Plages canoniques des 6 scènes & constantes d'amortissement
│   ├── motionStore.ts   # État mutable temps réel (scroll, scène active, focus 3D, pointeur)
│   └── useScrollOrchestrator.ts # Synchronisation Lenis + ScrollTrigger + ancres DOM
├── sections/            # 01 Hero (validé Phase 3) + 02 À propos .. 06 Contact
├── styles/              # tokens.css & global.css (Midnight Blue, grille, responsive, a11y)
├── test/                # Suite d'intégration Vitest + Testing Library
└── three/
    ├── ExperienceCanvas.tsx     # Canvas R3F, gestion événements mixtes & repli WebGL
    ├── WebGLFallback.tsx        # Composition architecturale SVG Midnight Blue sans WebGL
    ├── camera/                  # ArchitecturalCameraRig (3 groupes imbriqués)
    ├── lighting/                # StudioDaylight (Clair-obscur Midnight Blue + ouverture azur)
    ├── materials/               # Matériaux PBR béton sombre, verre biseauté, acier, textures HD
    └── structures/              # HeroOculusMonument (Phase 3) & structures des scènes 02-06
```
