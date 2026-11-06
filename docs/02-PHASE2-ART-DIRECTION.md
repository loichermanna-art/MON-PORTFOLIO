# PHASE 2 — DIRECTION ARTISTIQUE : 3 UNIVERS IMMERSIFS CORPORATE
**Projet :** Portfolio Personnel — Loïc AKANDA  
**Concept Directeur :** *CORPORATE IMMERSIVE EXPERIENCE* (Architecture 3D monumentale × Cinématographie au scroll × Éditorial institutionnel)  
**Date :** 2026-11-06

---

## 0. Méthode de Divergence Créative (Pourquoi zéro « sculpture abstraite »)

Un piège classique des portfolios en Three.js consiste à poser une sphère liquide, un ruban chromé ou un nuage de particules au milieu de l'écran, puis à faire défiler du texte par-dessus. Ce procédé échoue doublement pour **Loïc AKANDA** :
1. Il ne raconte rien de la **Finance, de l'Audit, de la Comptabilité et de l'Analyse**.
2. Il détruit la crédibilité institutionnelle auprès d'un cabinet d'audit, d'une direction financière, d'une banque ou d'un partenaire d'affaires.

Notre parti pris de studio est radicalement différent : **concevoir un lieu architectural continu et traversable**, dont la géométrie incarne physiquement la double culture de Loïc — **la rigueur analytique de l'ingénieur financier (INP-HB)** et **la capacité de construction concrète du créateur de produits digitaux**.

Pour offrir un vrai choix stratégique (et non trois variations de couleurs d'une même idée), nos trois pistes occupent **trois quadrants distincts** sur deux axes :
- **Axe horizontal :** *Institutionnel Intemporel (Banque Privée / Fondation)* ↔ *Ingénierie Analytique Pure (Laboratoire Architectural Suisse)*
- **Axe vertical :** *Lumière Naturelle Chaude & Pierre Minérale* ↔ *Clarté Studio Contemporaine & Métrologie*

```
                     LUMIÈRE NATURELLE CHAUDE & PIERRE MINÉRALE
                                         ▲
                                         │
       PISTE A                           │                        PISTE C
  « L'Atrium de Haute Précision »        │             « Le Méridien Civique »
  (Pierre calcaire, bronze noirci,       │        (Béton blanc cannelé, perspectives
   lumière zénithale, fondation privée)  │         modernistes INP-HB, terre brûlée)
                                         │
INSTITUTIONNEL ◄─────────────────────────┼─────────────────────────► IDENTITÉ SINGULIÈRE
INTEMPOREL                               │                           & PERSPECTIVE CIVIQUE
                                         │
                                         │        PISTE B
                                         │   « Le Pavillon Axiomatique »
                                         │   (Quartz clair, aluminium brossé, verre
                                         │    sablé architectural, vert audit suisse)
                                         ▼
                      CLARTÉ STUDIO CONTEMPORAINE & MÉTROLOGIE
```

---

## PISTE A — « L'ATRIUM DE HAUTE PRÉCISION » *(Recommandée)*
**Sous-titre :** *Architecture monolithique en pierre calcaire claire, cadres en bronze patiné et lumière naturelle zénithale.*

### 1. Concept & Idée directrice
> *« La rigueur d'une institution financière alliée à la clarté spatiale d'une fondation d'architecture contemporaine. »*

Le visiteur entre dans un pavillon contemporain lumineux évoquant à la fois le siège d'une banque privée européenne (inspirations : David Chipperfield, Tadao Ando en pierre claire) et une galerie de design produit. Rien n'y est décoratif : chaque volume exprime l'**équilibre, la mesure, la structure et la concrétisation**.

### 2. Ambiance & Atmosphère
- Calme souverain, silence visuel, autorité naturelle sans ostentation.
- Sensation d'espace vaste (plus de 55 % d'espace négatif par cadrage), baigné d'une lumière du matin franche qui projette des ombres géométriques nettes mais douces sur des sols minéraux mats.

### 3. Palette par rôles (Vérifiée WCAG 2.2 — `0 échec`)
| Rôle Token | Nom Matière | Hex | Usage autorisé | Contraste vérifié |
| :--- | :--- | :--- | :--- | :--- |
| `--bg` | Pierre d'Albâtre | `#F5F2EB` | Fond principal HTML & tonalité d'atmosphère 3D | — |
| `--surface` | Craie Lumineuse | `#FCFBF8` | Surfaces surélevées, fiches éditoriales sobres | — |
| `--surface-alt` | Grès Minéral | `#EAE5DA` | Zones secondaires, socles, séparations douces | — |
| `--ink` | Obsidienne Chaude | `#141413` | Titres monumentaux, texte principal | **16.49:1 (`AAA`)** sur `--bg` · **17.81:1 (`AAA`)** sur `--surface` |
| `--ink-muted` | Ardoise Sèche | `#57534E` | Paragraphes secondaires, légendes, dates | **6.82:1 (`AA`)** sur `--bg` · **7.37:1 (`AAA`)** sur `--surface` |
| `--accent` | Bleu Nuit Institutionnel | `#183B56` | Action principale unique, focus clavier, repères clés (≤ 5 % surface) | **10.44:1 (`AAA`)** sur `--bg` · Texte clair dessus : **11.28:1 (`AAA`)** |
| `--accent-rule` | Bronze Patiné | `#6E502F` | Filets architecturaux 1 px, index muséaux, détails 3D métalliques | **6.59:1 (`AA`)** sur `--bg` · **7.12:1 (`AAA`)** sur `--surface` |

### 4. Typographie (Auto-hébergée OFL via `@fontsource`, vérifiée npm)
- **Voix Éditoriale & Titres (`Display`) :** **`Instrument Serif`** (`@fontsource/instrument-serif`) — empattements verticaux élancés d'une grande distinction éditoriale (évite les clichés IA `Playfair` / `Cormorant`), évoquant les rapports annuels de maisons financières de prestige.
- **Corps & Interface (`Sans`) :** **`Schibsted Grotesk Variable`** (`@fontsource-variable/schibsted-grotesk`) — néo-grotesque scandinave dessinée pour la lecture analytique longue, nette et contemporaine.
- **Données, Index & Repères Spatiaux (`Mono`) :** **`Geist Mono Variable`** (`@fontsource-variable/geist-mono`, `tabular-nums`) — réservée aux numéros de séquences, dates académiques et métadonnées techniques.

### 5. Architecture 3D Continue (Un seul bâtiment traversé en 6 scènes)
1. **Scène 01 (Hero) — *Le Péristyle de Lumière* :** Un portique monumental à colonnade rectangulaire élancée ouvre sur la nef centrale. Au centre-droit de la perspective, un **cadre d'équilibre architectural** (deux portiques imbriqués en pierre et bronze symbolisant la rencontre *Analyse × Construction*) projette une ombre lente au sol.
2. **Scène 02 (About) — *La Galerie à Claire-Voie* :** La caméra pivote et glisse le long d'une colonnade latérale rythmée de brise-soleil verticaux (clin d'œil architectural sobre aux grands édifices institutionnels de Yamoussoukro / INP-HB), découpant la lumière au rythme du récit académique.
3. **Scène 03 (Expertise) — *La Cour des Deux Piliers* :** Plongée oblique sur une salle carrée structurée en deux systèmes spatiaux complémentaires : des **strates monolithiques horizontales** parfaitement alignées (*Finance, Comptabilité, Audit, Analyse*) articulées à une **ossature fine en bronze noirci** (*Conception Produit, Développement Web, Gestion de Projet*).
4. **Scène 04 (Selected Projects) — *La Salle des Monolithes d'Exposition* :** Trois pupitres architecturaux verticaux en pierre et cadre bronze dressés dans une cour zénithale présentent, comme des pièces maîtresses de musée, les interfaces réelles haute définition de **LAURA HOUSE**, **SassySkin** et **EtuCo**. La caméra effectue un travelling d'approche dédié vers chaque stèle.
5. **Scène 05 (Process) — *La Passerelle Séquentielle* :** Six dalles en porte-à-faux initialement décalées dans la hauteur s'alignent millimétriquement au fil du scroll pour former un pont continu en 6 travées (*Comprendre → Analyser → Structurer → Concevoir → Développer → Tester & Améliorer*).
6. **Scène 06 (Contact) — *Le Belvédère Ouvert* :** Au bout du pont, l'architecture s'ouvre sur une esplanade dégagée baignée de lumière calme ; la caméra recule légèrement pour offrir une respiration finale propice à la prise de contact.

### 6. Matières & Éclairage 3D
- **Matières PBR sobres et tactiles :** Travertin clair mat (`roughness: 0.88`, micro-grain procédural léger sans texture lourde), béton architectural sablé (`roughness: 0.82`), bronze anodisé sombre (`metalness: 0.72, roughness: 0.34`), verre architectural antireflet sur les pupitres projets.
- **Éclairage :** `DirectionalLight` solaire chaude-neutre (`#FFFDF8`) à angle de 34° avec `ContactShadows` / shadow-map adoucie contrôlée + lumière d'appoint hémisphérique ciel/pierre (`#F5F2EB` / `#D6CFC2`) évitant toute ombre noire bouchée.

### 7. Style de Caméra & Animations
- **Caméra :** Optique cinéma **38 mm** (ni déformation grand-angle jeu vidéo, ni écrasement plat), déplacements sur rail `CatmullRomCurve3` amortis (`damping`), alternant plans d'ensemble architecturaux, travellings latéraux (texte à gauche / nef à droite, puis inversement) et plans rapprochés sur les pupitres projets.
- **Mouvement autonome (Idle) :** Course imperceptible de la lumière zénithale, oscillation millimétrique des lames d'équilibre en bronze, léger voile atmosphérique de profondeur.
- **Typographie cinétique :** Révélations par masques verticaux francs (`clip-path` / `translateY(105% -> 0)`), `cubic-bezier(0.22, 1, 0.36, 1)`, décalage calme `80 ms` entre lignes, parallaxe subtile entre surtitre mono, titre serif et paragraphe.

### 8. Avantages & Limites
- **Avantages :** Équilibre idéal entre **crédibilité financière immédiate** (banque, cabinet d'audit, direction générale) et **prestige créatif digne d'un studio haut de gamme**. Très performant en WebGL (géométries architecturales franches = très faible nombre de polygones, 60 fps constants).
- **Limite & Parade :** Risque de paraître trop solennel si les projets sont trop petits → compensé par des plans rapprochés généreux et interactifs sur les interfaces réelles en Scène 04.

---

## PISTE B — « LE PAVILLON AXIOMATIQUE »
**Sous-titre :** *Architecture suisse de précision métrologique, quartz blanc, aluminium brossé et vert audit profond.*

### 1. Concept & Idée directrice
> *« L'exactitude d'une salle d'analyse financière traduite en pavillon d'ingénierie spatiale suisse. »*

Inspiré de l'école architecturale zurichoise et bâloise (Herzog & de Meuron, Vitra, rapports de gestion helvétiques), l'univers prend la forme d'un **pavillon modulaire tramé au millimètre**, où l'espace lui-même matérialise une grille d'audit et d'architecture système.

### 2. Ambiance & Atmosphère
- Clarté clinique lumineuse, fraîcheur minérale, haute technicité silencieuse, netteté chirurgicale.
- Atmosphère de studio de recherche et de stratégie : tout respire la méthode, la vérification et la maîtrise structurelle.

### 3. Palette par rôles (Vérifiée WCAG 2.2 — `0 échec`)
| Rôle Token | Nom Matière | Hex | Usage autorisé | Contraste vérifié |
| :--- | :--- | :--- | :--- | :--- |
| `--bg` | Quartz Froid | `#F3F5F7` | Fond principal & atmosphère studio | — |
| `--surface` | Blanc Optique | `#FFFFFF` | Panneaux éditoriaux, cadres d'interfaces | — |
| `--surface-alt` | Acier Pâle | `#E5E9EE` | Conteneurs secondaires, grilles | — |
| `--ink` | Carbone Profond | `#0F1419` | Titres & corps principal | **16.94:1 (`AAA`)** sur `--bg` · **18.51:1 (`AAA`)** sur `--surface` |
| `--ink-muted` | Ardoise Technique | `#475569` | Textes secondaires & légendes | **6.93:1 (`AA`)** sur `--bg` · **7.58:1 (`AAA`)** sur `--surface` |
| `--accent` | Vert Audit Helvétique | `#0F4C3A` | Action principale, indicateurs actifs, focus | **9.08:1 (`AAA`)** sur `--bg` · Texte blanc : **9.93:1 (`AAA`)** |

### 4. Typographie (Auto-hébergée OFL via `@fontsource`, vérifiée npm)
- **Titres & Hiérarchie (`Display`) :** **`Archivo Variable`** (`@fontsource-variable/archivo`) — grotesque d'ingénierie suisse à forte tenue géométrique et chasse modulable.
- **Corps & Interface (`Sans`) :** **`Geist Variable`** (`@fontsource-variable/geist`) — précision contemporaine irréprochable.
- **Métrologie & Audit (`Mono`) :** **`JetBrains Mono Variable`** (`@fontsource-variable/jetbrains-mono`, `tabular-nums`) — repères d'axes `(X, Y, Z)`, numérotation et indicateurs techniques.

### 5. Architecture 3D, Matières & Éclairage
- **Architecture 3D :** Un pavillon à trame orthogonale blanche et poutres fines en aluminium anodisé, traversé de **cloisons en verre architectural dépoli** (physique PBR, sans flou UI gadget) et de repères topographiques gravés au sol. Les 6 scènes sont 6 travées d'un même laboratoire spatial : *Atrium d'Index → Travée Profil → Matrice des Compétences → Baies Produits → Ligne d'Assemblage Méthodologique → Salon d'Échange*.
- **Matières & Lumière :** Béton blanc lissé (`roughness: 0.65`), aluminium brossé clair (`metalness: 0.6, roughness: 0.28`), éclairage studio zénithal diffus (`Softbox` architecturale) sans ombres dures.
- **Caméra & Motion :** Focale plus longue (**45–50 mm**), perspective quasi-architectonique ultra-propre, rotations orthogonales précises à 45° et 90°, transitions nettes sans fioriture (`cubic-bezier(0.2, 0, 0, 1)`).

### 6. Avantages & Limites
- **Avantages :** Lisibilité analytique maximale ; le **Vert Audit `#0F4C3A`** sur blanc quartz est immédiatement associé à la finance sérieuse (private equity, audit, conseil) tout en se démarquant radicalement du bleu SaaS générique.
- **Limite & Parade :** Moins chaleureux et moins émotionnel que la Piste A ; peut paraître plus austère si l'on ne dose pas soigneusement la respiration éditoriale.

---

## PISTE C — « LE MÉRIDIEN CIVIQUE »
**Sous-titre :** *Modernisme monumental blanc, voiles courbes de lumière, ancrage INP-HB réinterprété et terre de Sienne institutionnelle.*

### 1. Concept & Idée directrice
> *« L'élan monumental des grandes architectures civiques modernistes de Côte d'Ivoire réinterprété en musée digital contemporain. »*

Plutôt que d'importer un décor générique déconnecté du parcours réel de Loïc, cette piste puise subtilement dans le **vocabulaire architectural moderniste des grands campus d'excellence ivoiriens** (portiques élancés, voiles de béton blanc courbes, claustras géométriques de lumière, perspectives axiales de Yamoussoukro), épuré au niveau d'un studio de design contemporain international. **Aucun cliché folklorique ni motif plaqué** : uniquement de la pure architecture monumentale.

### 2. Ambiance & Atmosphère
- Lumineuse, solaire mais tempérée, sculpturale et profondément incarnée.
- Donne immédiatement au visiteur le sentiment d'une **signature personnelle mémorable** : un futur ingénieur financier formé dans une institution d'élite, doté d'une vision créative singulière.

### 3. Palette par rôles (Vérifiée WCAG 2.2 — `0 échec`)
| Rôle Token | Nom Matière | Hex | Usage autorisé | Contraste vérifié |
| :--- | :--- | :--- | :--- | :--- |
| `--bg` | Craie Solaire | `#F6F1E9` | Fond principal & lumière d'ambiance | — |
| `--surface` | Ivoire Minéral | `#FDFBF7` | Surfaces éditoriales | — |
| `--surface-alt` | Sable Calcaire | `#E9E1D4` | Volumes secondaires & socles | — |
| `--ink` | Basalte Noir | `#181512` | Titres & texte principal | **16.17:1 (`AAA`)** sur `--bg` · **17.59:1 (`AAA`)** sur `--surface` |
| `--ink-muted` | Taupe Pierre | `#5A524A` | Textes secondaires | **6.82:1 (`AA`)** sur `--bg` · **7.41:1 (`AAA`)** sur `--surface` |
| `--accent` | Terre Cuivrée Institutionnelle | `#7C2D1E` | Action principale, repères de séquence, focus | **8.30:1 (`AAA`)** sur `--bg` · Texte clair : **9.03:1 (`AAA`)** |

### 4. Typographie (Auto-hébergée OFL via `@fontsource`, vérifiée npm)
- **Titres Monumentaux (`Display`) :** **`Libre Bodoni Variable`** (`@fontsource-variable/libre-bodoni`) — contraste statutaire fort et coupe architecturale affirmée.
- **Sous-titres & Corps (`Sans`) :** **`Manrope Variable`** (`@fontsource-variable/manrope`) — géométrie humaniste ouverte et très lisible.
- **Repères & Données (`Mono`) :** **`Geist Mono Variable`** (`@fontsource-variable/geist-mono`, `tabular-nums`).

### 5. Architecture 3D, Matières & Éclairage
- **Architecture 3D :** Une grande perspective axiale bordée d'arches tendues minimalistes et d'un anneau zénithal (*oculus*) qui trace au sol un méridien lumineux guidant le visiteur de la Scène 01 à la Scène 06 : *L'Esplanade du Méridien → L'Arche Académique → Les Voiles de Compétences → La Cour des Stèles Projets → L'Aqueduc Méthodologique → Le Forum Ouvert*.
- **Matières & Lumière :** Béton blanc bouchardé mat, pierre ocre très pâle, métal cuivre oxydé sombre, lumière solaire haute projetant des courbes d'ombre graphiques au sol.
- **Caméra & Motion :** Focale **35 mm** légèrement plus ample, mouvements courbes fluides épousant les voiles architecturaux, travellings avant majestueux dans l'axe du méridien.

### 6. Avantages & Limites
- **Avantages :** **Singularité maximale** (réussit le test de substitution avec la note la plus haute : impossible de confondre ce portfolio avec un autre) ; chaleur humaine et stature monumentale.
- **Limite & Parade :** L'accent terre cuivrée `#7C2D1E` est plus culturel/éditorial que bancaire classique (là où le Bleu Nuit `#183B56` de la Piste A ou le Vert Audit `#0F4C3A` de la Piste B parlent instantanément aux recruteurs en finance pure).

---

## Échelle Typographique Modulaire Fluide Commune (Générée via formule UCE `type-scale.mjs`)

Calculée entre `360px` (`base 16px`, `ratio 1.22`) et `1440px` (`base 18px`, `ratio 1.38`), avec ordonnée en `rem` pour respecter intégralement le zoom navigateur et l'accessibilité WCAG 1.4.4 :

```css
:root {
  --step-m1: clamp(0.8152rem, 0.8212rem - 0.0066vw, 0.8197rem); /* 13.1px → 13.0px (Métadonnées / Mono) */
  --step-0:  clamp(1rem,      0.9583rem + 0.1852vw, 1.125rem);  /* 16.0px → 18.0px (Corps éditorial) */
  --step-1:  clamp(1.22rem,   1.1092rem + 0.4926vw, 1.5525rem); /* 19.5px → 24.8px (Chapeau / Lead) */
  --step-2:  clamp(1.4884rem, 1.2704rem + 0.9690vw, 2.1424rem); /* 23.8px → 34.3px (Titres H3 / Projets) */
  --step-3:  clamp(1.8158rem, 1.4356rem + 1.6900vw, 2.9566rem); /* 29.1px → 47.3px (Titres de Scène H2) */
  --step-4:  clamp(2.2153rem, 1.5938rem + 2.7626vw, 4.0801rem); /* 35.4px → 65.3px (Titres Majeurs) */
  --step-5:  clamp(2.7027rem, 1.7268rem + 4.3375vw, 5.6305rem); /* 43.2px → 90.1px (Monumental Hero) */
}
```

---

## Comparaison Synthétique & Contrôle des 5 Tests UCE

| Critère d'évaluation | PISTE A — *Atrium de Haute Précision* | PISTE B — *Pavillon Axiomatique* | PISTE C — *Méridien Civique* |
| :--- | :--- | :--- | :--- |
| **Crédibilité Finance / Audit / Corporate** | **Exceptionnelle (5/5)** | **Exceptionnelle (5/5)** | **Élevée (4/5)** |
| **Émotion & Immersion Cinématographique** | **Très élevée (5/5)** | **Maîtrisée / Froide (3.5/5)** | **Exceptionnelle (5/5)** |
| **Singularité & Mémorabilité Studio** | **Élevée (4.5/5)** | **Élevée (4/5)** | **Maximale (5/5)** |
| **Lisibilité & Repos Visuel** | **Optimale (`AAA` 16.5:1)** | **Optimale (`AAA` 16.9:1)** | **Optimale (`AAA` 16.2:1)** |
| **Performance WebGL (Desktop & Mobile)** | **Très légère (60 fps)** | **Très légère (60 fps)** | **Légère (courbes subdivisées maîtrisées)** |
| **Tests UCE (Substitution / Capture / Exclusion / Anti-IA / Faisabilité)** | **5 / 5 validés** | **5 / 5 validés** | **5 / 5 validés** |

### Exclusions Communes Non-Négociables (Appliquées aux 3 pistes)
- Zéro esthétique gaming, cyberpunk, néon ou fond noir futuriste.
- Zéro nuage de particules flottantes ou sculpture organique liquide sans sens narratif.
- Zéro violet/lavande IA (`OKLCH 270–330°`), zéro texte en dégradé, zéro glassmorphism de carte SaaS.
- Zéro jauge de compétence chiffrée arbitraire (« Finance 90 % »).
- Zéro statistique ou témoignage inventé.

---

## Recommandation du Directeur de Création

Nous recommandons la **PISTE A — « L'ATRIUM DE HAUTE PRÉCISION »**, avec une **subtile hybridation architecturale issue de la Piste C** (intégration des brise-soleil verticaux et de la perspective axiale moderniste faisant subtilement écho à l'excellence académique de l'INP-HB, mais traités dans la palette **Pierre d'Albâtre `#F5F2EB` + Obsidienne `#141413` + Bleu Nuit Institutionnel `#183B56` + filets Bronze Patiné `#6E502F`** et le duo typographique **`Instrument Serif` + `Schibsted Grotesk` + `Geist Mono`**).

**Pourquoi ce choix est le plus fort pour Loïc AKANDA :**
1. **Un recruteur en finance, audit ou banque** perçoit dès la première seconde les codes des plus grandes maisons institutionnelles (sobriété minérale, bleu nuit profond, serif éditoriale ciselée, rigueur géométrique).
2. **Un entrepreneur, client digital ou directeur produit** est immédiatement saisi par la maîtrise spatiale 3D, la lumière zénithale vivante, le travelling cinématographique et la mise en valeur muséale des vraies interfaces (**LAURA HOUSE**, **SassySkin**, **EtuCo**).
3. **L'identité reste 100 % authentique** : ambitieuse sans arrogance, ancrée sans folklore, sophistiquée sans artifice.
