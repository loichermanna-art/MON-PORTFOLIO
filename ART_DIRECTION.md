# ART_DIRECTION.md — Phase 2 : Direction Artistique & Architecture « The Infinite Library »

**Projet** : *The Infinite Library — Immersive 3D Portfolio* (Loïc AKANDA)  
**Références architecturales du monde réel** : *Trinity College Long Room* réinterprétée par l’architecture contemporaine (*Bibliothèque Kengo Kuma / David Chipperfield / Herzog & de Meuron*, *Fondazione Giangiacomo Feltrinelli*, *Bibiliothèque Nationale Richelieu rénovée*).

---

## 1. Parti Architectural : Un Seul Bâtiment Continu, Crédible et Construisible

La bibliothèque n’est ni un décor fantastique ni une juxtaposition de six scènes isolées : elle est conçue selon un **plan d’architecte continu sur deux niveaux reliés physiquement** selon un axe longitudinal Nord–Sud ponctué d’articulations latérales et d’une montée vers le Belvédère :

```text
[01 · L'ENTRÉE] ──(Franchissement des doubles portes en noyer & bronze)──►
    │
    ▼
[02 · LES ARCHIVES] (Galerie voûtée à travées en pierre calcaire & registres d'archives)
    │
    ├──(Passage sous l'arche transversale & vue sur les coursives hautes)──►
    ▼
[03 · LES RAYONNAGES] (Grande Nef à double hauteur, mezzanines & passerelles, 6 travées thématiques)
    │
    ├──(Ouverture latérale par portes vitrées à cadres bronze)──►
    ▼
[04 · LA COLLECTION PRIVÉE] (4 alcôves muséographiques d'exposition avec tables de consultation & vitrines)
    │
    ├──(Montée par l'escalier architectural en pierre & garde-corps verre/bronze vers la mezzanine)──►
    ▼
[05 · LA SALLE DES MÉTHODES] (Salle de lecture en mezzanine : grande table longitudinale à 6 pupitres éclairés)
    │
    ├──(Ouverture de la baie monumentale pleine hauteur)──►
    ▼
[06 · LE BELVÉDÈRE] (Salon de lecture panoramique baigné de lumière naturelle ouvert sur l'horizon)
```

À tout instant du parcours, le visiteur **aperçoit en perspective l’espace suivant** (à travers l’entrebâillement des portes, une colonnade, une passerelle ou la volée d’escalier) et peut se retourner vers la profondeur déjà parcourue : il comprend immédiatement qu’il évolue dans **un unique édifice cohérent**.

---

## 2. Système Matières PBR & Rôle Subtil de la Palette « Midnight Blue »

Conformément à votre directive fondamentale (*« Les matériaux de la bibliothèque doivent conserver des couleurs crédibles : bois brun, pierre naturelle, béton, métal et verre. Le bleu doit principalement intervenir dans l’identité graphique, les éléments de signalétique, certains éclairages architecturaux et les interfaces. »*), la palette sépare strictement **les matériaux physiques bâtis** et **l’identité graphique/lumineuse Midnight Blue**.

### 2.1 Matériaux Architecturaux Physiques (PBR : Albedo + Normal + Roughness + Metalness + AO)

| Matériau bâti | Usage architectural | Teinte physique (sRGB) | Paramètres PBR |
| :--- | :--- | :--- | :--- |
| **Noyer d’Amérique fumé** (*Warm Smoked Walnut*) | Rayonnages monumentaux à montants moulurés, vantaux de la grande porte d’entrée, plateaux des tables de consultation, sous-faces à caissons | `#3E281B` → `#593A26` (veinage fin vertical/horizontal) | `roughness: 0.42–0.58`, `metalness: 0.0`, `clearcoat: 0.14` (vernis satiné mat réaliste, jamais plastique) |
| **Pierre de taille calcaire / Travertin adouci** (*Honed Limestone*) | Sols à grands calepinages jointoyés, marches de l’escalier monumental, soubassements et pilastres | `#CFC6B8` → `#A89F91` | `roughness: 0.55–0.72` avec réflexions diffuses subtiles au sol (`MeshReflectorMaterial` flouté), `normalScale: 0.25` |
| **Béton architectural coffré fin** (*Architectural Concrete*) | Voûtes hautes, murs porteurs de refend, limon structurel de l’escalier et colonnes de la nef | `#8A8680` → `#6E6B66` | `roughness: 0.82`, `metalness: 0.0`, micro-relief minéral sobre |
| **Bronze patiné sombre & Laiton brossé** (*Burnished Bronze & Brass*) | Poignées de tirage des grandes portes, garde-corps des mezzanines, rails d’échelles de bibliothèque, lampes d’architecte sur les tables | `#2B241E` (bronze) / `#A88958` (laiton brossé ponctuel) | `metalness: 0.88`, `roughness: 0.28–0.38` (accroche élégante des reflets rasants) |
| **Verre architectural extra-clair** (*Architectural Glass*) | Garde-corps des passerelles, impostes vitrées, vitrines de la Collection Privée et grande verrière du Belvédère | Clair légèrement froid (`#DCE8F5` sur la tranche) | `MeshPhysicalMaterial` (`transmission` maîtrisée / réflexion Fresnel réaliste `ior: 1.52`, `roughness: 0.06`) |
| **Reliures des milliers de livres** (`InstancedMesh`) | Garnissage dense et crédible des rayonnages (hauteurs `21–34 cm`, épaisseurs `1,8–5,5 cm`, retraits et légères inclinaisons naturelles, serre-livres en pierre/bronze) | Toile de lin écrue `#D8D0C2`, cuir fauve `#6B3F26`, gris ardoise `#464B52`, bordeaux sourd `#4A2328`, vert bibliothèque `#25382E`, et **toile Midnight Blue `#102747`** | `roughness: 0.65–0.85`, tranches de papier crème `#EAE2D3` finement striées, dorure discrète sur dos |

### 2.2 Palette Identitaire, Signalétique & Lumineuse « Midnight Blue »

| Nom | Code Hex | Application précise et maîtrisée |
| :--- | :--- | :--- |
| **Midnight Blue** | `#071426` | Fond des cartels éditoriaux de lecture, reliures maîtresses des dossiers de Loïc AKANDA, zones d’ombre profonde nocturne/crépusculaire à l’extérieur du seuil d’entrée. |
| **Deep Blue** | `#102747` | Plaques de signalétique architecturale fixées aux pilastres (*01 · L’ENTRÉE*, *02 · LES ARCHIVES*…), surfaces secondaires de l’interface et bandeaux de navigation. |
| **Architectural Blue** | `#174477` | Filets structurels d’encadrement UI, reliures de collections actives, états sélectionnés de la barre d’orientation spatiale. |
| **Cold Light Blue** | `#76A9E8` | Lumière zénithale naturelle du ciel froid filtrant par les verrières hautes (clerestory), indicateurs d’interactivité discrets, anneaux de `:focus-visible` clavier et repères actifs. |
| **Soft White** | `#E8EDF5` | Texte courant haute lisibilité sur les panneaux éditoriaux Midnight Blue (contraste **15,71:1 AAA** sur `#071426`) et lumière diffuse du jour au Belvédère. |
| **White** | `#FFFFFF` | Grands titres gravés, typographie d’identité de l’Entrée et éclats spéculaires maîtrisés sur le verre et le laiton. |

---

## 3. Direction Photographique & Éclairage Réaliste

L’éclairage bannit tout effet « néon », cyberpunk ou surexposition artificielle :
1. **Lumière naturelle directionnelle haute (Clerestory Daylight)** : de hautes baies latérales et zénithales laissent pénétrer une lumière naturelle douce légèrement froide (`#DCEAF9` / `#76A9E8`), projetant des ombres obliques calmes sur les rayonnages en noyer et les dalles de pierre calcaire.
2. **Illumination globale approximée (IBL PBR)** : environnement haute dynamique généré par `PMREMGenerator` combinant voûte céleste douce et rebonds chauds du bois et de la pierre (tons d’ombres chauds-froids équilibrés, jamais noirs bouchés).
3. **Éclairage architectural intégré & lampes de lecture** :
   - Réglettes linéaires encastrées à faible intensité sous les corniches des rayonnages pour révéler la texture des tranches de livres ;
   - Lampes de consultation en laiton brossé diffusant un cône chaud feutré (`2900 K`, `#F2C98A`) uniquement sur les bureaux d’archives, les tables projets et les pupitres des méthodes.
4. **Tone Mapping cinématographique** : `THREE.ACESFilmicToneMapping` avec exposition calibrée (`toneMappingExposure ≈ 0.95`) — aucun bloom baveux, aucun flou de mouvement artificiel, aucun grain excessif.

---

## 4. Typographie & Intégration Éditoriale (Zéro « Template »)

### 4.1 Triade typographique auto-hébergée
- **Titres monumentaux & Frontons d’espaces** : *Cormorant Garamond Variable* (ou *Schibsted Grotesk* selon votre préférence finale — proposition : **Cormorant Garamond** pour les titres littéraires/architecturaux des 6 salles et des grands ouvrages, apportant immédiatement l’âme d’une grande maison d’édition et d’une bibliothèque d’exception).
- **Lecture éditoriale & Études de cas** : *Plus Jakarta Sans Variable* (`16px` minimum, interlignage `1.65`, largeur de colonne `58–65ch`) pour une lisibilité irréprochable des expériences financières et techniques.
- **Cotes d’archives, dates & signalétique** : *Geist Mono Variable* (`tabular-nums`, capitales espacées `0.14em`) imitant les cotes muséographiques réelles (`ARC · 2024 · DRONE-CI`, `COL · 03 · LAURA-HOUSE`).

### 4.2 Dispositif d’affichage des contenus : le « Folio & Cartel Muséographique »
Au lieu d’empiler des cartes HTML génériques au milieu de l’écran :
- Pendant le déplacement dans la bibliothèque, **l’écran reste dégagé à plus de 80 %** pour laisser vivre l’architecture, la perspective et la lumière. Seule une fine barre d’orientation spatiale (en bas ou en haut : nom de la salle actuelle, progression `01 — 06`, accès direct aux 6 salles et bouton `CV PDF`) accompagne discrètement le regard.
- Lorsqu’on s’arrête dans une salle ou que l’on sélectionne un ouvrage / une table d’exposition, l’information s’ouvre sous la forme d’un **Cartel / Folio éditorial Midnight Blue (`#071426` / `#102747`, filet `#174477`, texte `#E8EDF5`)** ancré latéralement pour ne jamais masquer l’objet 3D consulté (le livre ouvert, le registre d’archive ou la vitrine du projet reste visible dans le cadrage à côté du texte).

---

## 5. Conception Architecturale Détaillée des 6 Espaces

### ESPACE 01 — L’ENTRÉE : IDENTITÉ (*Le Vestibule Monumental*)
- **Architecture** : Vestibule en pierre calcaire adoucie et béton architectural, encadrant une **double porte monumentale de 4,6 m de haut en noyer massif et montants de bronze sombre**, surmontée d’une imposte vitrée laissant déjà deviner la perspective des rayonnages illuminés de la grande bibliothèque à l’intérieur. Sur le linteau en pierre et la plaque Midnight Blue `#102747` est gravée la signalétique d’entrée.
- **Mise en scène** : La caméra s’avance dans l’axe du tapis de pierre ; les deux lourds vantaux pivotent avec inertie physique, dévoilant la profondeur de la nef centrale tandis qu’un faisceau de lumière naturelle s’élargit sur le sol.
- **Contenu intégré** : **Loïc AKANDA** (*Étudiant en 3e année du cycle ingénieur en Finance à l’INP-HB — Audit, Comptabilité & Solutions numériques*), courte présentation, bouton **`Entrer dans la bibliothèque`** (scroll ou clic sur la porte ouverte) et accès direct au **CV PDF officiel**.

### ESPACE 02 — LES ARCHIVES : PARCOURS (*La Galerie Chronologique*)
- **Architecture** : Première salle voûtée bordée de **6 travées d’archives numérotées (`2020` → `2026`)** en noyer avec tiroirs à porte-étiquettes en laiton et **6 registres reliés posés sur pupitres inclinés**.
- **Contenu & interaction** : Chronologie visuelle et interactive retraçant *Bac G2 (`2020–2021`)* → *DTS Finance-Comptabilité option Contrôle de Gestion à l’INP-HB (`2021–2024`)* → *Stage cabinet **IACG** (2 mois : Sage 100, rapprochements bancaires, paie, tenue comptable)* → *Stage **Drone Groupe CI** (3 mois : tableau de bord budgétaire, collecte de données financières, analyse d’écarts)* → *Cycle Ingénieur ECS 3e année à l’INP-HB* → *Présidence du Club Études-Conseils AE-ECS*. Sélectionner un registre approche la caméra et ouvre le dossier correspondant.

### ESPACE 03 — LES RAYONNAGES : COMPÉTENCES (*La Grande Nef à Mezzanines*)
- **Architecture** : Cœur monumental de la bibliothèque à double hauteur traversé de **passerelles en verre et bronze** et d’une verrière zénithale. Six grandes bibliothèques thématiques portent chacune une plaque Midnight Blue `#102747` gravée en `#E8EDF5` :
  1. **FINANCE**
  2. **COMPTABILITÉ**
  3. **AUDIT**
  4. **ANALYSE FINANCIÈRE**
  5. **OUTILS NUMÉRIQUES**
  6. **CRÉATION & RÉALISATION DE PROJETS DIGITAUX**
- **Interaction** : Au clic (ou au clavier) sur l’une des 6 collections, la caméra pivote et s’approche du rayon, la réglette lumineuse de la travée s’intensifie doucement, **l’ouvrage de référence relié en Midnight Blue s’extrait légèrement et s’ouvre**, révélant les connaissances académiques, la pratique réelle et les outils effectivement utilisés — pendant que les 5 autres collections restent pleinement présentes dans l’espace environnant.

### ESPACE 04 — LA COLLECTION PRIVÉE : PROJETS (*Les 4 Alcôves d’Exposition*)
- **Architecture** : Quatre alcôves muséographiques successives séparées par des portiques en pierre et parois vitrées à cadres bronze. Chaque alcôve abrite une **grande table d’architecte éclairée**, un **écran/cadre muséographique haute définition présentant les vraies captures du projet** et un **portfolio d’étude de cas consultable** :
  1. **Alcôve I — SASSYSKIN** (`sassyskin.pages.dev`)
  2. **Alcôve II — AE-ECS** (`aeecs-site.aeecs.workers.dev`)
  3. **Alcôve III — LAURA HOUSE** (`laura-house.vercel.app` — workflow réel Wave marchand + preuve + validation manuelle + QR unique)
  4. **Alcôve IV — GYM OS SPORT** (`gym-os-sport.vercel.app` — moteur biomécanique SVG 52 exercices)
- **Interaction** : Cliquer sur une alcôve ou son ouvrage d’étude de cas cale la caméra face à la table d’exposition et ouvre la fiche complète vérifiée (contexte, problème, objectif, rôle réel, solution, fonctionnalités réelles, stack, état actuel, galerie de vraies captures et lien direct).

### ESPACE 05 — LA SALLE DES MÉTHODES (*La Mezzanine de Lecture*)
- **Architecture** : Accessible en gravissant **l’escalier architectural en pierre calcaire et garde-corps vitré** qui domine la Grande Nef (offrant une vue plongeante spectaculaire sur les rayonnages en contrebas !). Au centre de la mezzanine trône une longue table de lecture en noyer rythmée par **6 lampes de bibliothèque et 6 ouvrages méthodologiques consultables** :
  *01 · Comprendre* · *02 · Analyser* · *03 · Concevoir* · *04 · Réaliser* · *05 · Tester* · *06 · Améliorer*.
- **Interaction** : À mesure que l’on progresse le long de la table (ou que l’on sélectionne un ouvrage), la lampe correspondante s’allume progressivement et l’ouvrage s’ouvre sur l’objectif, les décisions, le livrable et l’exemple concret vécu.

### ESPACE 06 — LE BELVÉDÈRE : CONTACT (*Le Salon Panoramique*)
- **Architecture** : Dans le prolongement direct de la mezzanine, de hautes portes-fenêtres encadrées de bronze s’ouvrent sur un **grand salon de lecture calme baigné de lumière naturelle**, face à un vaste horizon serein aux teintes `#174477` / `#76A9E8` / `#E8EDF5`. Un bureau d’accueil en noyer et pierre présente le **coffret du CV officiel** et le registre de correspondance.
- **Contenu intégré** : Email vérifié (`loichermanna@gmail.com`), LinkedIn (`loic-akanda-assi`), GitHub (`loichermanna-art`), téléchargement direct du CV PDF (`/cv/CV-Loic-AKANDA.pdf`) et localisation (*Côte d’Ivoire · INP-HB*).
