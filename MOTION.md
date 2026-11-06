# MOTION.md — Storyboard Complet (Desktop & Mobile), Caméras, Timelines & Chorégraphie

<!-- Couvre la PHASE 3 (Storyboard détaillé Desktop & Mobile) et la spécification Motion de la PHASE 5 -->

## 1. Philosophie & Personnalité du Mouvement

- **Archétype retenu :** **`Corporate` × `Premium`** (référentiels *Emil Kowalski* + *LottieFiles Motion Design* + *Universal Creative Engine*).
- **Comportement global :** **HYBRID**
  1. **Couche Autonome (*Idle / Ambient*) :** mouvements lents, continus et presque imperceptibles lorsque le visiteur lit sans scroller (course subtile de la lumière matinale, respiration millimétrique du balancier architectural en bronze).
  2. **Couche Narrative (*Scrolltelling*) :** trajectoire caméra cinématographique sur rail 3D, évolution géométrique des structures (ouverture du portique, alignement des dalles du Process) et révélations typographiques coordonnées au défilement, **100 % réversibles** à la remontée.
  3. **Couche Réactive (*Pointer & UI*) :** parallaxe spatiale amortie à la souris (uniquement sur `@media (hover: hover) and (pointer: fine)`) et micro-interactions UI instantanées (`< 260ms`, `0 %` d'overshoot).

### Constantes Temporelles Centralisées (`tokens.css` / `motionConfig.ts`)
| Token | Valeur | Usage |
| :--- | :--- | :--- |
| `--ease-ui-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entrées UI, survols, ouverture de panneau détail projet (jamais `ease-in`). |
| `--ease-editorial` | `cubic-bezier(0.22, 1, 0.36, 1)` | Révélations de titres par masques et entrées ligne par ligne. |
| `--ease-architectural` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Mouvements d'éléments sur l'écran, transitions douces d'états. |
| `--dur-press` | `140ms` | Feedback `:active { transform: scale(0.97) }`. |
| `--dur-ui` | `220ms` | États de navigation, liens, onglets, contrôles (strictement `< 300ms`). |
| `--dur-reveal` | `720ms` | Révélation éditoriale par masque d'un titre de scène (décalage `75ms` par ligne, total `< 450ms`). |
| `CAMERA_DAMPING` | `lambda = 5.2` (`THREE.MathUtils.damp`) | Amortissement indépendant du framerate sur le rail caméra piloté par le scroll. |
| `POINTER_DAMPING` | `lambda = 3.6` | Amortissement soyeux de la parallaxe souris (`±1.6°` max). |

---

## 2. Architecture de Synchronisation (Zéro Conflit de Propriétés)

Aucun moteur n'écrit jamais sur la même propriété qu'un autre :

```
<Group name="CameraRailGroup">          ← Contrôlé UNIQUEMENT par scrollProgress (GSAP ScrollTrigger)
  <Group name="CameraPointerGroup">     ← Contrôlé UNIQUEMENT par pointerX / pointerY amortis
    <PerspectiveCamera fov={38} />      ← Contrôlé UNIQUEMENT par la respiration autonome Idle (sin lent)
  </Group>
</Group>
```

Même séparation stricte sur les structures 3D mobiles (`ScrollApertureGroup` parent → `IdleEquilibriumMesh` enfant) et sur le DOM HTML (`MaskRevealWrapper` piloté par GSAP/Intersection → `InteractiveButton` piloté par CSS `:hover`/`:active`).

---

## 3. STORYBOARD DÉTAILLÉ DES 6 SCÈNES (PHASE 3)

L'édifice 3D s'étend continûment le long de l'axe longitudinal `Z` (de `z = +16` à `z = -96`). Le visiteur ne change jamais de monde : il traverse **un seul pavillon architectural cohérent**.

---

### SCÈNE 01 — INTRODUCTION / HERO : *« Le Péristyle de Lumière »* (`scroll: 0.00 → 0.16`)
- **Objectif narratif :** Créer une première impression mémorable alliant stature institutionnelle immédiate (Finance, Audit, INP-HB) et maîtrise créative d'un studio digital haut de gamme.
- **Environnement 3D (`z = +16 → 0`) :** Cour d'honneur dallée en pierre d'albâtre, bordée de hauts piliers monolithiques projetant des ombres obliques à 34°. Sur l'axe droit (`x = +2.6, z = +1.8`), **Le Portique d'Équilibre** : deux grands cadres architecturaux imbriqués (l'un en pierre taillée, l'autre en bronze patiné suspendu avec balancier horizontal de précision) incarnant la dualité *Analyse Financière × Construction Numérique*. Au loin dans l'axe central, on aperçoit déjà la perspective lumineuse de la Galerie à Claire-Voie (Scène 02).
- **Composition & Position des textes (Desktop) :**
  - Alignement asymétrique franc **à gauche (colonnes 1 à 7)** sur fond minéral calme.
  - En-tête fixe épuré : monogramme `L. AKANDA`, repère de séquence `01 / PÉRISTYLE`, navigation directe vers les 6 scènes.
  - Surtitre mono : `FINANCE · AUDIT · PRODUITS NUMÉRIQUES — INP-HB`.
  - `H1` monumental en `Instrument Serif` (`--step-5`) + proposition de valeur concise (`max-width: 54ch`) + CTA primaire (`Explorer les réalisations`) et secondaire (`Prendre contact`) + indicateur de défilement architectural vertical en bas.
- **Caméra (Desktop) :**
  - Départ : `position = [-0.85, 2.05, 13.6]`, `lookAt = [1.45, 2.15, 0.5]`, `fov = 38°` (cadrage trois-quarts ouvrant le tiers gauche pour la typographie et magnifiant la profondeur du Péristyle à droite).
- **Animations autonomes (Idle) :**
  - Oscillation lente du fléau d'équilibre en bronze (`±1.1°`, période `14s`) ; glissement imperceptible de l'angle solaire (`±1°`, période `22s`) faisant vivre les ombres au sol.
- **Animations au scroll & Transition vers Scène 02 :**
  - Révélation initiale ligne par ligne sous masque vertical (`720ms`, stagger `75ms`).
  - Dès le début du scroll (`0.04 → 0.16`), la caméra avance en **travelling avant** à travers le seuil du Péristyle tandis que les deux vantaux de bronze du Portique s'écartent latéralement de `0.65m` pour ouvrir le passage vers la Galerie.
- **Adaptation Mobile (`390px`) :**
  - Caméra recadrée à `position = [0.0, 2.35, 15.2]`, `lookAt = [0.6, 2.6, 1.0]`, `fov = 44°` : le Portique d'Équilibre occupe la moitié supérieure/arrière dégagée, tandis que le bloc typographique s'inscrit proprement dans la moitié inférieure sur un socle d'albâtre parfaitement lisible (`DPR ≤ 1.25`, ombres allégées).

---

### SCÈNE 02 — ABOUT : *« La Galerie à Claire-Voie »* (`scroll: 0.16 → 0.32`)
- **Objectif narratif :** Présenter avec authenticité l'identité de Loïc AKANDA, son cursus d'élève-ingénieur en finance à l'INP-HB et sa philosophie de travail.
- **Environnement 3D (`z = 0 → -18`) :** Une galerie lumineuse longée sur le côté gauche (`x = -4.5`) par une rangée de **brise-soleil verticaux élancés** (hommage épuré au modernisme architectural de l'INP-HB / Yamoussoukro) qui découpent la lumière matinale en faisceaux réguliers au sol. À l'arrière-plan, un mur de pierre gravé structure la perspective.
- **Composition & Position des textes (Desktop) :**
  - **Inversion spatiale :** la scène architecturale et ses rais de lumière occupent la **gauche (colonnes 1 à 5)** ; le texte éditorial s'installe **à droite (colonnes 7 à 12)** : récit personnel, parcours académique INP-HB, intérêts professionnels et philosophie en 3 principes sobres.
- **Caméra (Desktop) :**
  - `position = [1.35, 1.95, -4.2]`, `lookAt = [-1.85, 2.05, -14.5]`, `fov = 38°` (rotation douce vers la gauche pour embrasser l'enfilade des brise-soleil tout en libérant l'espace négatif droit pour le texte).
- **Animations autonomes (Idle) :**
  - Respiration subtile de l'intensité lumineuse à travers les claire-voies.
- **Animations au scroll & Transition vers Scène 03 :**
  - Rotation progressive des lames brise-soleil (`18° → 42°`) synchronisée au défilement, déplaçant les bandes de lumière sur le dallage pendant que les paragraphes se révèlent par paliers. En fin de séquence, la caméra s'élève légèrement (`y: 1.95 → 3.4`) pour aborder en plongée douce la Cour des Compétences.
- **Adaptation Mobile (`390px`) :**
  - Cadrage axial haut montrant la perspective des brise-soleil en bandeau architectural supérieur, suivi des 3 blocs éditoriaux structurés par filets `1px` en colonne unique (`4 colonnes`, marge `20px`).

---

### SCÈNE 03 — EXPERTISE : *« La Cour des Deux Piliers »* (`scroll: 0.32 → 0.48`)
- **Objectif narratif :** Exposer la complémentarité des domaines de compétence sans recourir à des jauges chiffrées artificielles.
- **Environnement 3D (`z = -18 → -38`) :** Cour carrée monumentale organisée autour de deux structures architecturales qui se répondent :
  1. À gauche : **Quatre strates monolithiques horizontales en pierre calcaire** superposées en porte-à-faux (*Finance · Comptabilité · Audit · Analyse financière*).
  2. À droite : **Trois cadres tridimensionnels en bronze patiné** d'une précision mécanique (*Conception de produits numériques · Développement web · Gestion de projets*).
- **Composition & Position des textes (Desktop) :**
  - Titre éditorial centré en haut devant la cour ouverte, puis **mise en scène éditoriale en diptyque** (colonnes 1–5 et colonnes 8–12, laissant les colonnes centrales 6–7 ouvertes sur la jonction 3D des deux structures). Chaque domaine présente son périmètre concret d'application, jamais un pourcentage inventé.
- **Caméra (Desktop) :**
  - `position = [0.0, 3.35, -21.5]`, `lookAt = [0.0, 1.85, -31.0]`, `fov = 40°` (angle légèrement plongeant symétrique mettant en évidence l'équilibre des deux ailes).
- **Animations autonomes & Scroll :**
  - Légère lévitation déphasée des strates ; au scroll, chaque strate s'avance de `0.35m` lorsque le domaine correspondant entre dans la zone de lecture active. Transition vers Scène 04 par descente caméra à hauteur d'homme (`y: 3.35 → 1.85`) et franchissement d'une arche monumentale.
- **Adaptation Mobile (`390px`) :**
  - Présentation en deux chapitres distincts (Pôle I : Finance, Comptabilité, Audit & Analyse ; Pôle II : Conception, Développement & Projets) avec accordéon ou empilement éditorial net, sans surcharge verticale.

---

### SCÈNE 04 — SELECTED PROJECTS : *« La Salle des Monolithes d'Exposition »* (`scroll: 0.48 → 0.74`)
- **Objectif narratif :** Démontrer par la preuve la capacité à transformer un besoin réel en solution numérique opérationnelle (*LAURA HOUSE*, *SassySkin*, *EtuCo*).
- **Environnement 3D (`z = -38 → -64`) :** Vaste nef muséale éclairée par trois verrières zénithales. Trois **stèles-pupitres monumentales** en pierre d'albâtre et châssis bronze sont disposées en quinconce (`x = +2.4` à `z = -43`, `x = -2.4` à `z = -51`, `x = +2.4` à `z = -59`), chacune portant la présentation d'interface haute définition du projet dans l'espace 3D.
- **Composition & Interactions (Desktop) :**
  - Approche successive de chaque monolithe :
    - **04.1 — LAURA HOUSE** : Monolithe à droite, fiche éditoriale structurée à gauche (*Contexte · Problème · Objectif · Solution · Rôle · Stack vérifiée · Lien `laura-house.vercel.app`*).
    - **04.2 — SassySkin** : Monolithe à gauche, fiche éditoriale à droite (*Lien `sassy-skin-site.vercel.app` + éléments vérifiés / `[À CONFIRMER]`*).
    - **04.3 — EtuCo** : Monolithe à droite, fiche éditoriale à gauche (*Environnement numérique du Club Études-Conseils*).
  - Interaction : bouton *« Inspecter l'étude de cas »* ouvrant un tiroir éditorial latéral (`240ms cubic-bezier(0.23, 1, 0.32, 1)`) sans perdre le contexte spatial, et léger rapprochement caméra au survol de la stèle.
- **Caméra (Desktop) :**
  - Travelling sinusoïdal maîtrisé s'approchant successivement de chaque monolithe (`z: -39 → -47 → -55`, rotation orbitale `±16°` vers la stèle active).
- **Adaptation Mobile (`390px`) :**
  - Rail caméra centré doux ; cartes éditoriales architecturales plein cadre présentant l'aperçu d'interface, le problème, la solution, le rôle réel et l'accès direct au projet.

---

### SCÈNE 05 — PROCESS / APPROACH : *« La Passerelle Séquentielle »* (`scroll: 0.74 → 0.90`)
- **Objectif narratif :** Rendre visible la rigueur méthodologique de Loïc AKANDA en 6 étapes indissociables.
- **Environnement 3D (`z = -64 → -82`) :** Six dalles architecturales en porte-à-faux initialement décalées verticalement et latéralement au-dessus d'un vide lumineux.
- **Les 6 étapes mises en scène :**
  `01. Comprendre le problème` → `02. Analyser les besoins` → `03. Structurer une solution` → `04. Concevoir` → `05. Développer ou exécuter` → `06. Tester et améliorer`.
- **Animations au scroll & Caméra :**
  - Au fil de la progression (`0.74 → 0.90`), les 6 dalles viennent **s'emboîter et se verrouiller horizontalement** les unes après les autres avec une précision d'horlogerie (`0 %` d'overshoot, verrouillage net d'un filet de bronze), formant une passerelle continue que la caméra traverse en travelling latéral-avant (`position: [-2.1, 2.5, -66] → [0.0, 2.1, -80]`).
- **Composition HTML :**
  - Titre ancré à gauche en entrée de séquence, puis jalons éditoriaux synchronisés à l'assemblage de chaque travée (grille structurée de 6 étapes sur mobile).

---

### SCÈNE 06 — CONTACT : *« Le Belvédère Ouvert »* (`scroll: 0.90 → 1.00`)
- **Objectif narratif :** Conclure le parcours dans la sérénité et offrir une prise de contact limpide et immédiate.
- **Environnement 3D (`z = -82 → -96`) :** La passerelle débouche sur une terrasse architecturale ouverte bordée d'un simple garde-corps en bronze fin face à un horizon minéral lumineux et apaisé.
- **Caméra :**
  - **Travelling arrière lent** (`z: -83 → -86.5`, stabilisation axiale symétrique `x = 0`, `fov = 36°`) installant le calme final.
- **Composition HTML :**
  - Composition centrée-structurée respirante (colonnes 3 à 10) : message final affirmé en `Instrument Serif`, coordonnées validées / signalées clairement (`E-mail`, `LinkedIn`, `GitHub : github.com/loichermanna-art`), bouton de copie rapide d'adresse avec micro-feedback instantané (`140ms`) et retour fluide en haut de parcours.

---

## 4. Accessibilité Motion (`prefers-reduced-motion: reduce`)

Lorsque l'utilisateur active la réduction de mouvement au niveau de son système (ou via le bouton d'accessibilité intégré à l'interface) :
1. **Lenis est désactivé** au profit du défilement natif immédiat.
2. **Les travellings continus sont remplacés** par des cadrages architecturaux fixes calmes par section (fondu doux de l'éclairage uniquement, aucun déplacement spatial brusque).
3. **Les animations autonomes (`Idle`) et la parallaxe souris sont coupées.**
4. **Les textes s'affichent par simple transition d'opacité (`200ms ease`)**, sans translation `translateY`.
