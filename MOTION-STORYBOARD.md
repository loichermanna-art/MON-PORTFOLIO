# MOTION-STORYBOARD.md — Storyboard Caméra, Structures 3D & Animations (Scènes 01 → 06)

L’expérience spatiale repose sur un **corridor architectural continu en perspective (`z = +5.5` jusqu’à `z = -41.5`)** baigné dans la palette **Midnight Blue (`#071426`, `#102747`, `#174477`, `#76A9E8`)**. Tous les déplacements caméra sont interpolés à 60 Hz avec amortissement exponentiel (`THREE.MathUtils.damp`) et respectent intégralement `prefers-reduced-motion`.

---

## Vue d’Ensemble des Plages de Scroll (`src/motion/motionConfig.ts`)

| Scène | ID | Plage Scroll | Caméra `(x, y, z)` | Cible `(tx, ty, tz)` | FOV | Brouillard `[near, far]` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01 · Identité** | `hero` | `0.00 – 0.14` | `(0.00, 0.25, +5.50)` | `(0.00, 0.12, -2.50)` | `43°` | `[9, 32]` |
| **02 · Parcours** | `about` | `0.14 – 0.32` | `(-0.35, 0.22, -2.20)` | `(0.10, 0.08, -10.50)` | `44°` | `[8, 30]` |
| **03 · Compétences** | `expertise` | `0.32 – 0.48` | `(0.28, 0.30, -10.40)` | `(0.00, 0.10, -18.80)` | `46°` | `[8, 30]` |
| **04 · Réalisations** | `projects` | `0.48 – 0.76` | `(0.00, 0.24, -19.20)` | `(0.00, 0.05, -28.40)` | `45°` | `[9, 32]` |
| **05 · Méthode** | `process` | `0.76 – 0.91` | `(-0.18, 0.32, -28.80)` | `(0.00, 0.06, -36.50)` | `44°` | `[9, 31]` |
| **06 · Contact** | `contact` | `0.91 – 1.00` | `(0.00, 0.38, -35.80)` | `(0.00, 0.22, -43.50)` | `42°` | `[11, 38]` |

---

## Détail Scène par Scène

### Scène 01 — L’Oculus d’Identité (`z = 0` à `-3.5`)
- **Ouverture** : Rideau Midnight Blue `000 → 100` (franchissable instantanément via `Passer ↗`), suivi d’une révélation masquée ligne par ligne de `Loïc` puis `AKANDA`, du positionnement professionnel et des deux boutons d’action.
- **Architecture 3D** : Grand oculus octogonal finement biseauté entouré de **4 lames architecturales verticales en verre sombre (`#102747`)** correspondant aux 4 axes (`Finance & Comptabilité`, `Audit & Analyse`, `Solutions numériques`, `Conduite de projets`).
- **Couplage UI ↔ 3D** : Le survol ou le focus clavier d’une des 4 stèles du Hero illumine l’arête `#76A9E8` de la lame 3D correspondante (`heroSteleHoverIndex`) et l’avance légèrement dans l’espace.

### Scène 02 — La Ligne Temporelle Spatiale (`z = -5.8` à `-12.8`)
- **Architecture 3D** : Rail directeur au sol reliant **6 stèles chronologiques échelonnées en profondeur** (du Bac G2 en `2020–2021` jusqu’à la 3e année du cycle ingénieur ECS et la présidence du Club Études-Conseils).
- **Texte & Interactions** :
  - Révélation douce mot par mot du paragraphe de présentation personnelle au fil du scroll.
  - Cliquer ou survoler l’une des 6 étapes chronologiques (ou l’un des 2 dossiers de stage **Drone Groupe CI** / **IACG**) déplace légèrement le cadrage latéral de la caméra et illumine la stèle temporelle correspondante en `#76A9E8`.

### Scène 03 — L’Hémicycle des 5 Monolithes de Compétences (`z = -15.5` à `-18.8`)
- **Architecture 3D** : **5 monolithes verticaux disposés en arc de cercle** (`FIN-01`, `AUD-02`, `LOG-03`, `DEV-04`, `PRJ-05`) sur un socle annulaire Midnight Blue.
- **Couplage UI ↔ 3D** : La sélection d’un domaine dans la colonne gauche met en lumière le monolithe 3D correspondant, réoriente subtilement le point de visée de la caméra vers lui et affiche ses 4 registres (*Connaissances académiques, Compétences pratiques, Outils utilisés, Domaines d’intérêt*).

### Scène 04 — Le Corridor des 4 Pavillons Projets (`z = -21.8` à `-28.7`)
- **Architecture 3D** : **4 cadres monumentaux alternés gauche / droite** le long de la nef centrale, dédiés dans l’ordre à **SassySkin**, **AE-ECS**, **LAURA HOUSE** et **GYM OS SPORT**.
- **Interactions** :
  - Le survol d’un pavillon active le curseur contextuel `Découvrir l’étude ↗` et intensifie l’encadrement lumineux `#76A9E8` du pavillon 3D correspondant (`focusedProjectIndex`).
  - Sélecteur de vues authentiques (`Vue 01`, `Vue 02`, `Vue 03`) directement sur chaque pavillon.
  - L’ouverture de l’étude de cas complète en 12 points (`caseStudyOpenIndex`) rapproche subtilement la caméra en arrière-plan tout en verrouillant le focus clavier dans la modale.

### Scène 05 — La Perspective des 6 Portiques de Méthode (`z = -31.2` à `-36.7`)
- **Architecture 3D** : **6 portiques rectangulaires successifs** traversés par la caméra (*Comprendre → Analyser → Concevoir → Réaliser → Tester → Améliorer*).
- **Couplage UI ↔ 3D** : Au scroll comme au clic sur un portique, l’étape active s’illumine franchement en `#FFFFFF` / `#76A9E8`, les étapes déjà franchies conservent une lueur douce et les étapes suivantes restent en pénombre structurée `#102747`.

### Scène 06 — Le Belvédère de l’Horizon Ouvert (`z = -39.5` à `-42.5`)
- **Architecture 3D** : Ouverture complète de la perspective vers une arche d’horizon dégagée et quatre piliers-repères correspondant aux 4 canaux de contact (*Courriel, LinkedIn, GitHub, CV PDF*).
- **Intention émotionnelle** : Après la traversée structurée des 5 premières scènes, le brouillard s’éclaircit (`fogFar: 38`) et l’horizon Midnight Blue s’ouvre avec calme et clarté pour inviter à la prise de contact.

---

## Accessibilité Mouvement Réduit & Fallback
- **`prefers-reduced-motion: reduce`** (ou bouton dédié dans le `Menu`) : désactive immédiatement le rideau d’introduction, le curseur suiveur, le parallaxe pointeur et les oscillations continues ; les transitions deviennent directes et stables.
- **Fallback sans WebGL (`WebGLFallback.tsx`)** : restitue fidèlement la perspective Midnight Blue `#071426` / `#102747` / `#76A9E8` en SVG architectural léger sans perte d’information ni de lisibilité.
