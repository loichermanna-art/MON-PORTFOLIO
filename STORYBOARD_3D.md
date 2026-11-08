# STORYBOARD_3D.md — Phase 3 : Storyboard Cinématographique, Trajectoire Caméra & Chorégraphie

Ce document définit à l’avance le chemin de caméra continu (spline `CatmullRomCurve3` sans collision ni saut d’axe), les durées, les animations architecturales et la structure en **6 temps chorégraphiques** (*Préparation → Mouvement principal → Animation secondaire → Révélation du contenu → Stabilisation → Transition*) pour chacun des 6 espaces.

Système métrique réel : **1 unité Three.js = 1 mètre** (hauteur d’œil humaine naturelle à `y = 1.65 m` au rez-de-chaussée et `y = 5.45 m` sur la mezzanine).

---

## Espace 01 — L’Entrée : Identité (*Cible du Prototype Visuel de Phase 4*)

- **Plage narrative** : `0.00 → 0.14` (Durée d’ouverture initiale : `1,4 s` + progression au scroll)
- **Position initiale caméra** : `(0.00, 1.65, +9.20)` · Visée `(0.00, 2.10, 0.00)` · `FOV 42°` (cadrage frontal majestueux dans le vestibule en pierre face aux doubles portes fermées à `z = 0.00`).
- **Position finale caméra** : `(0.00, 1.68, -1.80)` · Visée `(0.00, 1.95, -14.00)` · `FOV 44°` (seuil franchi, découverte de la perspective des Archives et de la Grande Nef).
- **Trajectoire** : Travelling avant rectiligne parfaitement stable dans l’axe central, léger relèvement du regard (`+4°`) vers l’imposte vitrée puis recentrage horizontal à hauteur d’homme lors du franchissement des portes.
- **Éléments visibles** : Murs en pierre calcaire adoucie, plafond à caissons en béton et noyer, doubles portes monumentales de `4,6 m` en noyer fumé et poignées verticales en bronze patiné, plaque signalétique Midnight Blue `#102747`, et en arrière-plan à travers le vitrage et l’ouverture : les travées de rayonnages illuminées.
- **Chorégraphie en 6 temps** :
  1. *Préparation (`0–200 ms`)* : Montée douce de la lumière zénithale sur le grain du bois des portes et sur la pierre du seuil.
  2. *Mouvement principal* : Au premier coup de molette (ou au clic sur « Entrer dans la bibliothèque » / sur les poignées en bronze), déverrouillage subtil puis rotation physique des deux lourds vantaux (`0° → -78°` et `+78°`, courbe `power3.inOut` sans rebond, inertie de bois massif).
  3. *Animation secondaire* : Le faisceau de lumière naturelle venant de la nef intérieure s’élargit progressivement sur les dalles de pierre polie du vestibule ; les appliques murales intérieures s’allument en cascade vers le fond.
  4. *Révélation du contenu* : Apparition par masque typographique ligne par ligne de **Loïc AKANDA**, de son positionnement (*3e année cycle ingénieur Finance INP-HB*) et des actions (*Explorer la bibliothèque* / *Télécharger le CV*).
  5. *Stabilisation* : Ancrage calme face à la perspective ouverte avant d’engager la traversée.
  6. *Transition* : Passage fluide de l’encadrement des portes vers la galerie voûtée des Archives (`z = -2.0` → `-16.0`).

---

## Espace 02 — Les Archives : Parcours

- **Plage narrative** : `0.14 → 0.30` (Traversée indicative : `~3,5 s` au scroll continu)
- **Position initiale caméra** : `(0.00, 1.68, -2.50)` · Visée `(-0.80, 1.55, -12.00)` · `FOV 44°`
- **Position finale caméra** : `(0.00, 1.70, -16.50)` · Visée `(0.00, 2.40, -28.00)` · `FOV 45°`
- **Trajectoire** : Travelling doux en léger « S » longeant les **6 pupitres chronologiques** disposés de part et d’autre de la galerie d’archives (`z = -5 m` à `-15 m`).
- **Interactions directes** : Cliquer sur un registre d’archive (ou sur un jalon `2020` → `2026` de la frise chronologique) rapproche la caméra à `1,4 m` du pupitre choisi (`duration: 0.85s`, `power3.out`), allume sa lampe laiton et ouvre le registre relié ; un bouton `Revenir à l’allée centrale` (ou la reprise du scroll / touche `Échap`) recadre dans l’axe.
- **Animations principale & secondaire** : Ouverture de la couverture du registre sélectionné (`0° → -145°`) et léger feuilletage d’une page papier crème ; éclairage progressif du bandeau chronologique au sol.
- **Contenu révélé** : Parcours INP-HB (Bac G2, DTS Finance-Compta Contrôle de Gestion, 3e année Ingénieur ECS), stages vérifiés **IACG** et **Drone Groupe CI**, présidence du Club Études-Conseils AE-ECS.

---

## Espace 03 — Les Rayonnages : Compétences

- **Plage narrative** : `0.30 → 0.48`
- **Position initiale caméra** : `(0.00, 1.70, -17.00)` · Visée `(0.00, 3.20, -30.00)` · `FOV 47°` (ouverture spectaculaire de la Grande Nef à double hauteur et de ses mezzanines).
- **Position finale caméra** : `(0.00, 1.70, -30.50)` · Visée `(1.20, 1.80, -38.00)` · `FOV 45°`
- **Éléments visibles** : 6 rayonnages monumentaux de `7,2 m` de haut garnis de milliers de livres (`InstancedMesh`), échelles sur rails en bronze, passerelles vitrées à l’étage, lumière du jour tombant des hautes verrières.
- **Les 6 collections interactives** : *01 Finance · 02 Comptabilité · 03 Audit · 04 Analyse financière · 05 Outils numériques · 06 Création & réalisation de projets digitaux*.
- **Animations lors de la sélection d’une collection** :
  1. Approche latérale cadrée de la caméra vers la travée sélectionnée (sans masquer le reste de la nef).
  2. Allumage progressif de la réglette chaude sous l’étagère active.
  3. Extraction horizontale (`+18 cm`) puis ouverture de l’ouvrage maître relié en toile Midnight Blue `#102747`.
  4. Affichage latéral du cartel éditorial présentant acquis académiques, pratique réelle et outils utilisés.

---

## Espace 04 — La Collection Privée : Projets

- **Plage narrative** : `0.48 → 0.72`
- **Position initiale caméra** : `(0.40, 1.68, -31.50)` · Visée `(0.00, 1.60, -42.00)` · `FOV 44°`
- **Position finale caméra** : `(-0.30, 1.68, -50.00)` · Visée `(0.00, 2.80, -58.00)` · `FOV 44°`
- **Trajectoire** : Déplacement rythmé desservant **4 alcôves muséographiques** latérales (*SassySkin*, *AE-ECS*, *LAURA HOUSE*, *GYM OS SPORT*), après ouverture automatique des doubles portes vitrées à cadres bronze à l’entrée de la galerie (`z = -32 m`).
- **Interactions & animations** :
  - Chaque alcôve comporte une table de consultation en noyer, un cadre rétro-éclairé haute définition exposant les **vraies captures du projet** et un coffret d’étude de cas.
  - Sélectionner un projet approche la caméra face à la table, ouvre la vitrine ou le portfolio relié, et déploie l’étude de cas complète vérifiée (avec galerie multi-vues réelle et lien direct vers l’application en production).

---

## Espace 05 — La Salle des Méthodes (*Montée à la Mezzanine*)

- **Plage narrative** : `0.72 → 0.88`
- **Position initiale caméra (pied de l’escalier)** : `(0.00, 1.68, -50.50)` → **Montée fluide le long de la volée d’escalier architectural** (`y: 1.68 m → 5.45 m`, avec contre-plongée puis vue plongeante sur la Grande Nef en contrebas !) → **Position finale mezzanine** : `(0.00, 5.45, -62.00)` · Visée `(0.00, 5.35, -70.00)` · `FOV 43°`.
- **Éléments visibles & interactions** : Longue table de lecture en noyer bordée de chaises architecturales et de **6 lampes de bibliothèque en laiton** correspondant aux 6 étapes (*1. Comprendre · 2. Analyser · 3. Concevoir · 4. Réaliser · 5. Tester · 6. Améliorer*). Cliquer sur une étape allume sa lampe et ouvre l’ouvrage consultable sur le cas concret correspondant.

---

## Espace 06 — Le Belvédère : Contact

- **Plage narrative** : `0.88 → 1.00`
- **Position initiale caméra** : `(0.00, 5.45, -63.00)` · **Position finale** : `(0.00, 5.50, -71.50)` · Visée `(0.00, 5.45, -84.00)` · `FOV 42°`.
- **Animations architecturales** : Les grands vantaux vitrés donnant sur la loggia panoramique s’entrouvrent doucement ; la lumière naturelle claire (`#E8EDF5` / `#76A9E8`) inonde la pierre et le bois du bureau de consultation final.
- **Éléments interactifs** : Sur le bureau du Belvédère reposent le **porte-document du CV officiel** (téléchargement direct `/cv/CV-Loic-AKANDA.pdf`) et le **registre de contact** donnant accès en un clic à `loichermanna@gmail.com`, LinkedIn, GitHub et à un bouton « Retourner à l’Entrée de la bibliothèque ».
