# EDITORIAL-ARCHITECTURE.md — Architecture Éditoriale, Hiérarchie & Logique Spatiale

## 1. Principe Directeur
Le portfolio de **Loïc AKANDA** est conçu comme **un seul système narratif, architectural et éditorial** où l’environnement 3D sert la lecture de l’information au lieu de la concurrencer. Chaque scène répond à une question précise d’un recruteur, d’un responsable de cabinet d’audit/conseil ou d’un porteur de projet :

| Scène | Ancrage | Question du lecteur | Réponse éditoriale & spatiale |
| :--- | :--- | :--- | :--- |
| **01 · Identité** | `#hero` | *Qui est Loïc AKANDA et que recherche-t-il ?* | Étudiant en 3e année du cycle ingénieur en Finance à l’INP-HB, orienté audit, comptabilité, analyse financière et conception de solutions numériques utiles. |
| **02 · Parcours** | `#about` | *Sur quelles formations et expériences réelles repose son profil ?* | Ligne temporelle spatiale (2020 → aujourd’hui) + dossiers vérifiés des deux stages (**Drone Groupe CI** 3 mois & **IACG** 2 mois) + présidence du Club Études-Conseils AE-ECS. |
| **03 · Compétences** | `#expertise` | *Que maîtrise-t-il académiquement vs pratiquement ?* | 5 monolithes distinguant explicitement **connaissances académiques**, **pratique terrain**, **logiciels réellement utilisés** et **axes d’intérêt** — sans aucun `%`. |
| **04 · Réalisations** | `#projects` | *Qu’a-t-il réellement conçu et mis en ligne ?* | 4 pavillons monumentaux dédiés à **SassySkin**, **AE-ECS**, **LAURA HOUSE** et **GYM OS SPORT**, avec visuels authentiques et études de cas en 12 points. |
| **05 · Méthode** | `#process` | *Comment travaille-t-il face à un problème concret ?* | 6 portiques séquentiels (*Comprendre → Analyser → Concevoir → Réaliser → Tester → Améliorer*), chacun relié à un livrable et un cas réel vécu. |
| **06 · Contact** | `#contact` | *Comment échanger avec lui ou consulter son CV ?* | Belvédère ouvert réunissant courriel direct (`loichermanna@gmail.com`), LinkedIn, GitHub, téléphones et téléchargement direct du CV PDF officiel. |

---

## 2. Différenciation Architecturale des 6 Scènes (Élimination des Répétitions)
L’audit initial avait mis en évidence la répétition d’une même grille générique à deux boîtes flottantes sur plusieurs sections. La refonte attribue une **typologie spatiale propre** à chacune des 6 scènes :

1. **Scène 01 (Hero ouvert)** : Aucune boîte autour du nom ni du positionnement. Typographie éditoriale monumentale ouverte sur l’oculus 3D, encadrée en partie basse par un seuil horizontal de 4 stèles reliées aux 4 lames vitrées 3D.
2. **Scène 02 (Axe temporel & diptyque de stages)** : Bandeau d’introduction scindé (*Présentation personnelle* + *Orientation professionnelle*), rail chronologique horizontal à 6 nœuds relié aux 6 stèles temporelles 3D, puis diptyque structuré des deux stages vérifiés.
3. **Scène 03 (Sélecteur de monolithes + matrice à 4 registres)** : Colonne gauche de 5 lames biseautées commandant les 5 monolithes 3D ; panneau droit divisé en 4 registres analytiques constants (*Connaissances académiques · Compétences pratiques · Outils utilisés · Domaines d’intérêt*).
4. **Scène 04 (Corridor de 4 pavillons alternés + Modale 12 points)** : Grands pavillons alternant écran architectural à gauche/droite avec sélecteur de vues réelles (`Vue 01`, `Vue 02`, `Vue 03`) et ouverture d’un dossier complet en 12 rubriques accompagné d’un schéma fonctionnel dédié.
5. **Scène 05 (Frise de 6 portiques séquentiels)** : Barre de progression en 6 portiques numérotés (`01` à `06`) pilotant l’allumage des arches 3D et affichant *Objectif, Actions, Décisions, Livrable et Exemple concret*.
6. **Scène 06 (Belvédère à 4 terminaux d’action)** : Grille aérée et lumineuse de 4 terminaux directs (*Courriel + copie*, *LinkedIn*, *GitHub*, *CV PDF & localisation*).

---

## 3. Système Chromatiques & Typographique « Midnight Blue »

### Palette Normative Validée WCAG 2.2 AAA
- **Fond principal** : `#071426` (`--midnight-950`)
- **Volumes architecturaux** : `#102747` (`--midnight-900`)
- **Contours structurels & surfaces actives** : `#174477` (`--midnight-700`)
- **Lumière d’accentuation & repères actifs** : `#76A9E8` (`--azure-400` — contraste **7,57:1 AAA** sur `#071426`)
- **Texte principal de lecture** : `#E8EDF5` (`--ice-100` — contraste **15,71:1 AAA** sur `#071426`)
- **Titres & points spéculaires** : `#FFFFFF` (`--white` — contraste **18,47:1 AAA** sur `#071426`)

### Hiérarchie Typographique Auto-Hébergée
- **Titres (`--font-display`)** : *Schibsted Grotesk Variable* — géométrie architecturale franche, interlignage resserré (`0.95` sur le Hero, `1.08` sur les titres de scènes).
- **Corps éditorial (`--font-sans`)** : *Plus Jakarta Sans Variable* — confort de lecture longue (`line-height: 1.62–1.68`, largeur de ligne bornée à `64–68ch`).
- **Repères & indices (`--font-mono`)** : *Geist Mono Variable* avec `font-variant-numeric: tabular-nums` pour les indices `01/06`, les périodes `2020 – 2021` et les codes de stèles.

---

## 4. Règles d’Intégrité Éditoriale Appliquées
1. **Séparation stricte des niveaux de maîtrise** : Sage 100 / Sage SAARI Comptabilité et Sage Paie RH sont présentés comme de *bonnes bases pratiquées en stage*, Excel / Pack Office comme une *maîtrise régulière*, et l’audit financier comme *formation d’ingénieur approfondie + premiers travaux en cabinet* (sans jamais revendiquer le titre d’expert-comptable ou d’auditeur senior).
2. **Transparence sur les flux opérationnels des projets** :
   - Sur **LAURA HOUSE**, le règlement réel par **lien marchand Wave**, l’envoi d’une **preuve de paiement** et la **validation manuelle par la cliente** avant envoi des billets QR uniques sont explicitement décrits.
   - Sur **AE-ECS**, le caractère démonstratif du formulaire de la page Contact est signalé avec transparence.
   - Sur **GYM OS SPORT**, seules les fonctionnalités effectivement codées dans le dépôt `loichermanna-art/sport-` (52 exercices SVG par cinématique inverse, onboarding 3 étapes, mode séance hors-ligne) sont mentionnées.
