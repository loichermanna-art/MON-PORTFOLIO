# TECH-STACK.md — Architecture Technique & Choix Technologiques

## 1. Synthèse des Choix & Justifications

| Couche | Technologie retenue | Version vérifiée | Justification vis-à-vis du Master Brief |
| :--- | :--- | :--- | :--- |
| **Framework & Bundler** | **Vite** + **React** + **TypeScript** | `vite@^6.4.5` · `react@^19.0.0` · `typescript@^5.7` | Expérience spatiale continue à `<Canvas>` WebGL unique persistant (aucun démontage entre sections), compilation ultra-rapide, typage strict, bundle léger et déploiement statique universel. |
| **Moteur 3D** | **Three.js** + **React Three Fiber** + **Drei** | `three@^0.187.0` · `@react-three/fiber@^9.8.2` · `@react-three/drei@^10.7.9` | Graphe de scène déclaratif, gestion propre du cycle de vie WebGL, matériaux PBR procéduraux et environnement studio `<Lightformer>` **sans requête `.hdr` externe**. |
| **Animation & Scroll** | **GSAP** (`ScrollTrigger`) + **CSS / WAAPI** | `gsap@^3.15.1` | Synchronisation chirurgicale et réversible de la progression du scroll avec le rail caméra 3D et les masques typographiques ; micro-interactions UI (`< 300ms`) déléguées au CSS accéléré matériellement. |
| **Défilement fluide** | **Lenis** | `lenis@^1.3.27` | Activé uniquement sur Desktop pointeur fin (`(hover: hover) and (pointer: fine)`) hors `prefers-reduced-motion`, connecté au ticker GSAP pour éliminer tout décalage entre scroll DOM et caméra WebGL. |
| **Typographie** | **Fontsource (OFL local)** | `@fontsource/instrument-serif` · `@fontsource-variable/schibsted-grotesk` · `@fontsource-variable/geist-mono` | Auto-hébergement local des `.woff2` : zéro dépendance CDN externe, respect de la vie privée, `font-display: swap`, zéro CLS. |
| **Styling** | **CSS Modulaire & Design Tokens natifs** | CSS moderne (`clamp()`, `@layer`, Custom Properties) | Aucune surcharge d'utilitaires inutiles ; contrôle millimétré des tokens issus de `DESIGN.md` et `MOTION.md`. |
| **Tests & QA** | **Vitest** + **Testing Library** + **Scripts Node WCAG** | `vitest` · `@testing-library/react` · `jsdom` | Vérification automatisée des ratios WCAG 2.2 AA/AAA, de l'intégrité documentaire, de l'accessibilité clavier/ARIA, du fallback sans WebGL et du mode `prefers-reduced-motion`. |

### Pourquoi ne pas multiplier les bibliothèques ?
- **Pas de Lottie** : Three.js, GSAP et CSS couvrent la 3D architecturale et les micro-interactions avec un poids moindre et une cohérence spatiale totale.
- **Pas de bibliothèque UI lourde** : les composants éditoriaux (navigation, stèles projets, tiroir d'étude de cas, sélecteur de maquettes) sont taillés sur mesure avec gestion rigoureuse du focus clavier et des attributs ARIA.
- **Pas de post-processing WebGL coûteux** (`EffectComposer` bloom/DOF plein écran banni) : l'atmosphère lumineuse provient directement des matériaux PBR, de l'éclairage directionnel calibré, des ombres douces et du brouillard exponentiel de profondeur (`fogExp2`), garantissant **60 fps constants** même sur GPU intégré d'ordinateur portable corporate.

---

## 2. Architecture Modulaire du Code (`src/`)

Conformément à la Section 7 du brief, chaque responsabilité est isolée dans un module dédié :

```
src/
├── data/
│   └── portfolioData.ts         # Données vérifiées du profil, compétences, projets, méthode & placeholders explicites
├── motion/
│   ├── motionStore.ts           # Store mutable hors-state React (scrollProgress, pointer, reducedMotion, activeScene)
│   ├── motionConfig.ts          # Constantes d'amortissement, courbes et seuils de séquences
│   └── useScrollOrchestrator.ts # Synchronisation Lenis + GSAP ScrollTrigger + écouteur reduced-motion
├── three/
│   ├── ExperienceCanvas.tsx     # Unique <Canvas> WebGL fixe, gestion DPR adaptatif & pause hors-visibilité
│   ├── WebGLFallback.tsx        # Fallback architectural SVG/HTML si WebGL est indisponible
│   ├── materials/
│   │   └── architecturalMaterials.ts # Générateur procédural Pierre d'Albâtre, Grès & Bronze Patiné + dispose()
│   ├── lighting/
│   │   └── StudioDaylight.tsx   # Soleil directionnel, ombres douces calibrées & Lightformers sans réseau
│   ├── camera/
│   │   └── ArchitecturalCameraRig.tsx # Rig caméra 3 étages sans conflit (Rail Scroll / Parallaxe Souris / Idle)
│   └── structures/
│       ├── PeristyleHall.tsx      # Scène 01 : Péristyle monumental, colonnade & dallage continu 126m
│       ├── EquilibriumPortal.tsx  # Scène 01 : Portique d'Équilibre pierre/bronze (idle + ouverture scroll)
│       ├── ClairvoieGallery.tsx   # Scène 02 : Galerie à 11 brise-soleil verticaux articulés
│       ├── DualPillarCourtyard.tsx# Scène 03 : Cour des Deux Piliers (4 strates pierre ↔ 3 cadres bronze)
│       ├── MonolithGallery.tsx    # Scène 04 : Salle des 3 Monolithes d'exposition + plaques procédurales HD
│       ├── SequentialBridge.tsx   # Scène 05 : Passerelle séquentielle de 6 dalles verrouillées au scroll
│       └── OpenBelvedere.tsx      # Scène 06 : Belvédère ouvert d'horizon & garde-corps bronze
├── components/
│   ├── layout/
│   │   └── ArchitecturalHeader.tsx# En-tête 6 scènes, barre de progression GPU, menu mobile & mouvement réduit
│   ├── projects/
│   │   └── ProjectDetailDrawer.tsx# Tiroir accessible (role="dialog", Échap, retour de focus) d'étude de cas
│   └── typography/
│       └── MaskReveal.tsx         # Révélation typographique par masque coordonnée à l'entrée
├── sections/
│   ├── HeroSceneSection.tsx       # Scène 01 HTML : composition asymétrique gauche
│   ├── AboutSceneSection.tsx      # Scène 02 HTML : composition droite (INP-HB & philosophie en 3 piliers)
│   ├── ExpertiseSceneSection.tsx  # Scène 03 HTML : diptyque symétrique sans pourcentages fictifs
│   ├── ProjectsSceneSection.tsx   # Scène 04 HTML : 3 stations alternées (LAURA HOUSE, SassySkin, EtuCo)
│   ├── ProcessSceneSection.tsx    # Scène 05 HTML : 6 paliers synchronisés au verrouillage de la passerelle
│   └── ContactSceneSection.tsx    # Scène 06 HTML : pavillon centré apaisé + colophon studio
├── mockups/
│   └── MockupsStudioDeck.tsx    # PHASE 4 : Maquettes interactives haute fidélité des 6 scènes (Desktop & Mobile + Grille)
├── styles/
│   ├── tokens.css               # Palette WCAG AAA, échelle fluide clamp(), espacements, courbes d'animation
│   └── global.css               # Reset, grilles 12/8/4 colonnes, ::selection, :focus-visible, utilitaires éditoriaux
├── App.tsx                      # Assemblage principal & bascule Prototype / Maquettes
└── main.tsx                     # Point d'entrée & chargement local des polices @fontsource
```

---

## 3. Performance, Cycle de Vie WebGL & Sécurité d'Affichage

1. **Un seul contexte WebGL actif** sur toute la session (plafond bien en deçà de la limite matérielle navigateur).
2. **Géométries architecturales partagées et instanciées** lorsque pertinent ; textures procédurales générées une seule fois en mémoire et nettoyées via `dispose()` au démontage.
3. **Adaptation automatique DPR & Mobile :**
   - Desktop : `dpr={[1, 1.75]}`, shadow-map `2048×2048`.
   - Mobile (`< 768px`) : `dpr={[1, 1.25]}`, shadow-map `1024×1024`, parallaxe souris désactivée, défilement natif tactile.
4. **Visibilité onglet :** suspension du calcul d'animation autonome lorsque `document.hidden === true`.
5. **Compatibilité Live Preview Arena :** serveur Vite lié sur `0.0.0.0` avec `allowedHosts: true`, uniquement des chemins relatifs côté navigateur (aucun appel codé en dur vers `localhost`).
