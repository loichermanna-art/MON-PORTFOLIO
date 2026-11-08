# AUDIT.md — Phase 1 : Audit Technique, Architectural, 3D & Motion

**Projet** : *The Infinite Library — Immersive 3D Portfolio* (Loïc AKANDA)  
**Dépôt** : `loichermanna-art/MON-PORTFOLIO`  
**Branche active** : `arena/e825c7df-mon-portfolio`  
**Date de l’audit** : Novembre 2026

---

## 1. État Actuel du Dépôt & Architecture Existante

### 1.1 Structure actuelle (`src/`)
L’application actuelle est une SPA Vite + React 19 + TypeScript structurée autour de deux couches superposées :
1. **Couche d’arrière-plan (`src/three/`)** :
   - `ExperienceCanvas.tsx` : instancie un `<Canvas>` React Three Fiber plein écran fixé derrière le DOM (`position: fixed; inset: 0; pointer-events: none`).
   - `PhotorealDepthStage.tsx` : affiche un plan d’horizon photographique (`public/scenes/dusk-01..06.jpg`), 5 anneaux shaders (`DepthCorridorPortals`), un gyroscope (`BlendedHorizonGyroscope`) et 18 plans de brume (`VolumetricTwilightClouds`) le long d’un axe `Z` linéaire (`+4.5` → `-26.5`).
   - `WebGLFallback.tsx` : image statique de repli lorsque WebGL est absent.
2. **Couche éditoriale HTML défilante (`src/sections/` & `src/components/`)** :
   - Six `<section className="scene-band">` verticales (`Hero`, `About`, `Expertise`, `Projects`, `Process`, `Contact`) empilées sur ~6 500 px de hauteur de page.
   - Tiroir modal `ProjectDetailDrawer.tsx`, barre fixe `ArchitecturalHeader.tsx`, rideau `SkyZenithIntroLoader.tsx` et curseur `MagneticProjectCursor.tsx`.
3. **Données éditoriales (`src/data/portfolioData.ts`)** :
   - **Point fort majeur à conserver intact** : l’intégralité des données factuelles vérifiées (CV officiel d’AKANDA Assi Loïc à l’INP-HB, stages **Drone Groupe CI** et **IACG**, présidence du Club Études-Conseils AE-ECS, les 4 études de cas réelles **SassySkin**, **AE-ECS**, **LAURA HOUSE** avec son workflow Wave marchand + validation manuelle + QR unique, et **GYM OS SPORT** avec ses planches SVG authentiques, ainsi que le CV PDF `/cv/CV-Loic-AKANDA.pdf`) est déjà propre, typée et découplée des composants visuels.

---

## 2. Diagnostic Critique des Problèmes Vis-à-Vis de « The Infinite Library »

| # | Problème identifié dans le code actuel | Localisation | Impact sur la vision *The Infinite Library* |
| :--- | :--- | :--- | :--- |
| **P1** | **Paradigme « site HTML qui défile devant un fond »** | `src/App.tsx`, `src/styles/global.css` | Contradiction directe avec le cahier des charges : les 6 `<section>` HTML défilent verticalement comme un site classique au lieu de faire pénétrer le visiteur dans un bâtiment 3D continu. |
| **P2** | **Aucune interactivité 3D réelle (`pointer-events: none`)** | `src/styles/global.css:98`, `ExperienceCanvas.tsx` | Le `<Canvas>` ignore tous les événements pointeur : aucun raycasting R3F n’est actif. Il est impossible de cliquer sur une porte, un ouvrage, un rayonnage ou une table d’exposition. |
| **P3** | **Absence d’architecture physique et de matériaux PBR** | `src/three/PhotorealDepthStage.tsx` | La scène actuelle repose sur `MeshBasicMaterial` / `ShaderMaterial` non éclairés et `THREE.NoToneMapping`. Il n’existe ni éclairage physique (PBR/IBL), ni ombres portées, ni matériaux crédibles (bois noble, pierre, béton, bronze, verre), ni continuité architecturale (portes, couloirs, escaliers, mezzanines). |
| **P4** | **Triple amortissement concurrent du scroll (latence perceptible)** | `useScrollOrchestrator.ts` + `PhotorealDepthStage.tsx` | `Lenis (duration: 1.05)` lisse le scroll → `ScrollTrigger` met à jour `motionStore` → `useFrame` applique encore `THREE.MathUtils.damp`. Trois systèmes pilotent en cascade le même mouvement, créant une inertie molle et imprécise. |
| **P5** | **Store d’état artisanal verbeux** | `src/motion/motionStore.ts` | 7 ensembles `Set<Listener>` manuels gèrent à la fois les valeurs continues 60 Hz et l’état UI (ouvrage ouvert, salle active, mode focus), compliquant la navigation hybride (scroll + clic 3D + retour salle principale). |
| **P6** | **Découpage des Compétences en 5 domaines au lieu des 6 collections prévues** | `src/data/portfolioData.ts` | *Finance* et *Comptabilité* d’une part, *Audit* et *Analyse financière* d’autre part sont fusionnés en 5 entrées, alors que l’Espace 03 (*Les Rayonnages*) prévoit **6 collections distinctes** : *Finance*, *Comptabilité*, *Audit*, *Analyse financière*, *Outils numériques*, *Création et réalisation de projets digitaux*. |
| **P7** | **Boucles `requestAnimationFrame` parallèles hors R3F** | `MagneticProjectCursor.tsx`, `useSectionDepthMotion.ts`, `SkyZenithIntroLoader.tsx` | Plusieurs boucles `requestAnimationFrame` tournent en parallèle de la boucle R3F et du ticker GSAP, contrevenant à la règle `render-single-raf` des *Three.js Best Practices*. |

---

## 3. Audit de la Stack & Dépendances (`package.json`)

### 3.1 Dépendances actuelles à conserver
- `react` (`^19.3.1`) & `react-dom` (`^19.3.1`) — Socle UI moderne.
- `three` (`^0.187.0`), `@react-three/fiber` (`^9.8.2`), `@react-three/drei` (`^10.7.9`) — Déjà en versions récentes ; `drei` fournit nativement `Environment`, `Lightformer`, `MeshReflectorMaterial`, `Instances`/`Instance`, `Html`, `Text`, `useCursor`, `useGLTF`, `useTexture` et `AdaptiveDpr`.
- `gsap` (`^3.15.1` avec `ScrollTrigger`) — Orchestration précise des timelines caméra, d’ouverture de portes et d’extraction/ouverture d’ouvrages.
- `@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/schibsted-grotesk`, `@fontsource-variable/geist-mono` — Polices locales auto-hébergées rapides (zéro requête externe bloquante).

### 3.2 Dépendances redondantes ou à rationaliser
- **`lenis` (`^1.3.27`) — Redondant dans une architecture à viewport 3D épinglé** : lorsque le viewport est épinglé (`100vw × 100dvh`) et que `ScrollTrigger` pilote la progression narrative avec `scrub: 1`, `ScrollTrigger` assure déjà un lissage déterministe sans conflit de `scrollerProxy`. Nous désactiverons `Lenis` sur le parcours 3D principal (et pourrons retirer la dépendance en Phase 5 après validation) afin d’éliminer le triple amortissement (**P4**).
- **Anciens visuels atmosphériques nuageux (`public/scenes/dusk-01..06.jpg`)** : conservés temporairement tant que la Phase 4 n’est pas validée, puis nettoyés lors du passage complet à l’architecture 3D de la bibliothèque pour alléger le poids statique de `512 Ko`.

### 3.3 Ajouts ciblés et strictement justifiés (pour la Phase 4/5 après votre validation)
1. **`zustand` (~1,2 Ko gzip)** : recommandé à la fois par la Partie 6 et par `r3f-best-practices` (`perf-zustand-selectors`, `perf-transient-subscriptions`). Permet de gérer proprement la machine d’états de navigation hybride (`mode: 'corridor-scroll' | 'inspecting-book' | 'inspecting-project'`, `activeRoom`, `activeCollection`, `activeProject`, `reducedMotion`) tout en lisant l’état dans `useFrame` via `useLibraryStore.getState()` avec **zéro re-render React**.
2. **`@gsap/react` (~2 Ko gzip)** : recommandé par `gsap-skills/gsap-react` (`useGSAP` + `contextSafe`) pour garantir l’annulation et le nettoyage automatiques des tweens d’ouverture de portes, de livres et de transitions entre salles.
3. **`@fontsource-variable/cormorant-garamond` (auto-hébergée)** : recommandée par l’audit typographique `ui-ux-pro-max` (*Editorial Classic / Architectural Luxury*) pour conférer aux frontons gravés de la bibliothèque et aux titres d’ouvrages une véritable noblesse éditoriale et littéraire, en duo avec *Plus Jakarta Sans* (lecture UI longue) et *Geist Mono* (cotes d’archives).

*Aucune bibliothèque lourde superflue (pas de moteur physique Rapier inutile, pas de post-processing lourd si l’éclairage PBR + `RoomEnvironment` + ombres douces suffisent) ne sera installée.*

---

## 4. Synthèse de Consultation des 6 Référentiels de Skills (Partie 2)

Les 6 dépôts demandés ont été clonés et étudiés dans l’environnement de travail (`/tmp/agent-skills-ref/`) ; voici les règles techniques retenues et appliquées à l’architecture du projet :

1. **UI/UX Pro Max (`nextlevelbuilder/ui-ux-pro-max-skill`)** :
   - Exécution de `scripts/search.py` (`--design-system --variance 7 --motion 9 --density 4` + `--domain typography`) : hiérarchie éditoriale aérée, contraste ≥ 4.5:1 (visé > 7:1 sur les panneaux de lecture), cibles interactives ≥ 44×44 px, icônes SVG exclusivement, retours visuels immédiats (< 150 ms au survol d’un livre ou d’une porte).
2. **LottieFiles Motion Design (`LottieFiles/motion-design-skill`)** :
   - Archétype retenu : **Premium Architectural** + courbes basées sur la masse physique des matériaux (*Rigid stone/heavy wood doors* : accélération progressive sans rebond `0% overshoot`, durée proportionnelle à l’amplitude `900–1300 ms` pour les vantaux monumentaux ; *Paper/book pages* : `350–500 ms` avec décélération douce).
   - Structuration systématique en **3 couches de mouvement** : *Primaire* (caméra / porte / livre), *Secondaire* (lumière rasante qui glisse sur le bois et le laiton, ombre portée qui s’ouvre), *Ambiante* (subtile poussière lumineuse dans les faisceaux des verrières hautes, désactivée sous `prefers-reduced-motion`).
3. **GSAP Official Skills (`greensock/gsap-skills` : `core`, `timeline`, `scrolltrigger`, `react`, `performance`)** :
   - **Un seul propriétaire par propriété animée** : une timeline maîtresse GSAP pilote un objet proxy `cameraRig` (`position`, `lookAt`, `fov`) via `ScrollTrigger (scrub: 1)` ; lors d’une interaction directe (clic sur une collection ou un projet), un tween `contextSafe` prend proprement le relais vers le point d’observation dédié puis restitue la main au retour dans la galerie.
   - Côté DOM, n’animer que `transform` (`x`, `y`, `scale`) et `opacity` (`autoAlpha`) ; utiliser `gsap.quickTo()` pour les micro-déplacements continus.
4. **React Three Fiber & Three.js Best Practices (`emalorenzo/three-agent-skills`)** :
   - `perf-never-set-state-in-useframe` : aucun `setState` dans `useFrame`.
   - `geometry-instanced-mesh` & `draw-call-optimization` (< 100 draw calls/frame) : les **milliers de livres** garnissant les rayonnages monumentaux seront rendus via **`THREE.InstancedMesh`** (1 à 3 draw calls au total pour 2 500+ ouvrages aux dimensions, épaisseurs, inclinaisons légères et reliures variées), et les boiseries répétitives par géométries fusionnées/instancées.
   - `events-raycast-filter` : le raycasting R3F ne ciblera **que** les objets réellement interactifs (les vantaux d’entrée, les 6 registres d’archives, les 6 ouvrages maîtres des collections de compétences, les 4 tables/vitrines d’exposition projets et les 6 pupitres de méthodes), jamais les 2 500 livres décoratifs.
   - `memory-dispose-on-unmount` : libération explicite des géométries, textures PBR procédurales/chargées et `PMREMGenerator` au démontage.
5. **Web Quality Skills (`addyosmani/web-quality-skills`)** :
   - Budget Core Web Vitals : **LCP ≤ 2,5 s** (rendu immédiat du fronton typographique de l’Entrée pendant l’initialisation progressive du GPU, polices locales préchargées), **INP ≤ 200 ms** (raycasting filtré sur < 25 meshes interactifs), **CLS ≤ 0,1** (canevas fixe `100vw × 100dvh` et dimensions explicites sur tous les visuels projets).
6. **Vercel Web Design Guidelines (`vercel-labs/agent-skills` & `web-interface-guidelines`)** :
   - Accessibilité clavier intégrale : chaque interaction 3D (ouvrir l’entrée, consulter une archive, ouvrir une collection, inspecter un projet, parcourir les 6 méthodes) possède son équivalent clavier natif (`<button>`, `<a>`, `:focus-visible` net en `#76A9E8`), synchronisation d’état dans l’URL (`#entree`, `#archives`, `#rayonnages`, `#collection`, `#methodes`, `#belvedere`), et mode complet adapté pour `prefers-reduced-motion` et l’absence de WebGL.

---

## 5. Inventaire de Véracité Éditoriale Acquis pour les 6 Espaces

Toutes les données métier sont vérifiées et prêtes à être réparties dans les 6 espaces de la bibliothèque sans aucune invention :
- **Espace 01 (L’Entrée)** : **Loïc AKANDA** (*AKANDA Assi Loïc*), étudiant en 3e année du cycle ingénieur en Finance à l’INP-HB (Côte d’Ivoire), orienté Audit financier, Comptabilité, Analyse financière & Solutions numériques ; accès direct au CV PDF officiel (`/cv/CV-Loic-AKANDA.pdf`).
- **Espace 02 (Les Archives)** : Chronologie vérifiée `2020–2021` Bac G2 → `2021–2024` DTS Finance Comptabilité option Contrôle de Gestion (INP-HB) → Stage **IACG** (`Juillet–Août 2023`, 2 mois : Sage 100, rapprochements bancaires, livres de paie, tenue comptable) → Stage **Drone Groupe CI** (`Avril–Juin 2024`, 3 mois : tableau de bord budgétaire projet, collecte/traitement de données financières, analyse d’écarts) → `2024–Présent` Cycle Ingénieur ECS INP-HB (3e année) → `Depuis Nov. 2025` Président du Club Études-Conseils AE-ECS.
- **Espace 03 (Les Rayonnages — redécoupé en 6 collections exactes)** :
  1. *Finance* · 2. *Comptabilité* · 3. *Audit* · 4. *Analyse financière* · 5. *Outils numériques* (`Excel`, `Pack Office`, `Sage 100 / SAARI`, `Sage Paie RH`) · 6. *Création et réalisation de projets digitaux* (`React`, `TypeScript`, `Vite`, `GitHub`, `Cloudflare`, `Vercel`). Aucune jauge en `%`, aucune certification inventée.
- **Espace 04 (La Collection Privée — 4 espaces d’exposition)** :
  1. **SassySkin** (`sassyskin.pages.dev`) — vrais visuels produits/boutique, commande WhatsApp + paiement à la livraison.
  2. **AE-ECS** (`aeecs-site.aeecs.workers.dev`) — vraies photos associatives INP-HB, mention transparente du formulaire Contact de démonstration.
  3. **LAURA HOUSE** (`laura-house.vercel.app`) — vrais visuels officiels, workflow réel explicite (**lien marchand Wave de la cliente → envoi de la preuve de paiement → validation manuelle par la cliente → attribution manuelle d’un billet PNG muni d’un QR code unique**).
  4. **GYM OS SPORT** (`gym-os-sport.vercel.app`) — vraies planches issues du moteur SVG `pose.ts`/`render.ts` de `loichermanna-art/sport-` (52 exercices, PWA hors-ligne).
- **Espace 05 (La Salle des Méthodes)** : *1. Comprendre · 2. Analyser · 3. Concevoir · 4. Réaliser · 5. Tester · 6. Améliorer*, illustrées chacune par un cas réel vécu.
- **Espace 06 (Le Belvédère)** : `loichermanna@gmail.com`, `linkedin.com/in/loic-akanda-assi`, `github.com/loichermanna-art`, `/cv/CV-Loic-AKANDA.pdf`, Yamoussoukro / Abidjan, Côte d’Ivoire.
