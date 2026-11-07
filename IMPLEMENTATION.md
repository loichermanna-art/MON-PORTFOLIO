# IMPLEMENTATION.md — Architecture Technique & Choix d’Implémentation

## 1. Vue d’Ensemble de la Stack Conservée et Affinée
Conformément à la règle de conservation de l’infrastructure saine existante, la refonte s’appuie sur le socle éprouvé du dépôt tout en séparant rigoureusement les responsabilités :

- **UI & Typage** : `React 19.2` + `TypeScript 5.9` (mode strict, `tsc --noEmit` et `tsc -b` sans aucune erreur)
- **Scène 3D temps réel** : `Three.js 0.183` + `@react-three/fiber` + `@react-three/drei` (rendu adaptatif `dpr={[1, 1.75]}`, ACES Filmic tone mapping basse luminance `toneMappingExposure = 0.92`)
- **Orchestration du scroll & transitions** : `GSAP 3.14` (`ScrollTrigger`) + store réactif léger à 60 Hz (`src/motion/motionStore.ts`) évitant les re-rendus inutiles de l’arbre React
- **Typographies auto-hébergées** : `@fontsource-variable/schibsted-grotesk`, `@fontsource-variable/plus-jakarta-sans` et `@fontsource-variable/geist-mono` (zéro dépendance à un CDN de polices externe)
- **Tests & Qualité** : `Vitest` + `@testing-library/react` + script mathématique d’audit de contraste WCAG 2.2 (`scripts/verify-contrast.mjs`)

---

## 2. Organisation Modulaire des Fichiers

```text
MON-PORTFOLIO/
├── public/
│   ├── cv/CV-Loic-AKANDA.pdf                 # CV officiel téléchargeable
│   ├── projects/
│   │   ├── gym-os-biomechanics.svg           # Planche biomécanique générée par le moteur de GYM OS SPORT
│   │   └── gym-os-library.svg                # Extrait authentique des 52 figures SVG de GYM OS SPORT
│   └── scenes/dusk-01..06.jpg                # Textures atmosphériques basse luminance
├── src/
│   ├── data/
│   │   ├── portfolioData.ts                  # Source unique de vérité éditoriale (CV + 4 projets + méthode)
│   │   └── projectVisuals.ts                 # Index des visuels réels par projet
│   ├── motion/
│   │   ├── motionConfig.ts                   # Plages de scroll et keyframes caméra/brouillard des 6 scènes
│   │   ├── motionStore.ts                    # Store 60 Hz bidirectionnel UI <-> structures 3D
│   │   ├── useScrollOrchestrator.ts          # Synchronisation scroll, clavier et prefers-reduced-motion
│   │   └── useSectionReveal.ts               # Apparition sobre à l’entrée dans le champ
│   ├── three/
│   │   ├── ExperienceCanvas.tsx              # Canvas R3F persistant + détection WebGL
│   │   ├── PhotorealDepthStage.tsx           # Caméra cinématographique, éclairages Midnight Blue & brume
│   │   ├── ArchitecturalStructures3D.tsx     # Les 6 ensembles architecturaux 3D réactifs
│   │   └── WebGLFallback.tsx                 # Perspective Midnight Blue SVG si WebGL indisponible
│   ├── sections/
│   │   ├── HeroSceneSection.tsx              # Scène 01 : Identité ouverte, positionnement, CTAs & 4 stèles
│   │   ├── AboutSceneSection.tsx             # Scène 02 : Parties A/B/C/D, rail 6 jalons & 2 stages vérifiés
│   │   ├── ExpertiseSceneSection.tsx         # Scène 03 : 5 monolithes & 4 registres explicites (0 %)
│   │   ├── ProjectsSceneSection.tsx          # Scène 04 : 4 pavillons alternés & galerie multi-visuels réels
│   │   ├── ProcessSceneSection.tsx           # Scène 05 : 6 portiques séquentiels & cas concrets
│   │   └── ContactSceneSection.tsx           # Scène 06 : Belvédère à 4 terminaux directs & CV PDF
│   ├── components/
│   │   ├── layout/ArchitecturalHeader.tsx    # Barre Midnight Blue, rail 01/06, lien CV & menu accessible
│   │   ├── motion/SkyZenithIntroLoader.tsx   # Rideau d'ouverture 000 -> 100 franchissable
│   │   ├── motion/MagneticProjectCursor.tsx  # Pastille curseur contextuelle sur les pavillons projets
│   │   └── projects/
│   │       ├── ProjectDetailDrawer.tsx       # Dossier d'étude de cas complet en 12 rubriques
│   │       └── ProjectArchitectureDiagram.tsx# 4 schémas fonctionnels SVG vérifiés en Midnight Blue
│   ├── styles/
│   │   ├── tokens.css                        # Variables CSS Midnight Blue (#071426 -> #FFFFFF)
│   │   └── global.css                        # Compositions spatiales propres à chacune des 6 scènes
│   └── test/
│       ├── setup.ts                          # Configuration JSDOM propre
│       └── portfolio.test.tsx                # Suite de 6 cycles de tests fonctionnels & éditoriaux
└── scripts/verify-contrast.mjs               # Audit automatisé des ratios WCAG 2.2 AAA
```

---

## 3. Intégration Authentique des Visuels Projets & Suppression des Visuels Génériques
- Les anciennes images d’illustration génériques (`public/projects/work-laura.jpg`, `work-sassy.jpg`, `work-etuco.jpg`) ont été **définitivement supprimées**.
- Chaque projet affiche désormais **exclusivement ses propres visuels réels** :
  - **SassySkin** : photographies produits et éditoriales servies depuis la boutique réelle (`sassyskin.pages.dev`).
  - **AE-ECS** : photographies officielles de la vie associative, du Club Études-Conseils et des événements (`aeecs-site.aeecs.workers.dev`).
  - **LAURA HOUSE** : photographie du lieu et affiche officielle de la soirée (`laura-house.vercel.app`).
  - **GYM OS SPORT** : deux planches vectorielles haute précision (`/projects/gym-os-biomechanics.svg` et `/projects/gym-os-library.svg`) générées directement en exécutant le moteur réel `src/lib/pose.ts` + `src/lib/render.ts` + `src/data/exercises.ts` du dépôt `loichermanna-art/sport-` (`arena/bee6d52a-sport`).
- L’ancien schéma `ProjectArchitectureDiagram.tsx` (qui mentionnait à tort une pile *Express + SQLite* sur LAURA HOUSE) a été intégralement remplacé par **4 schémas SVG vérifiés** fidèles à l’architecture réelle de chacun des 4 projets.
