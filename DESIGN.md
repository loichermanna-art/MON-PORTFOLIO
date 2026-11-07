# DESIGN.md — Direction Artistique « MIDNIGHT BLUE »
## Référence Visuelle : `REFERENCE_HERO_PORTFOLIO.png`

---

## 1. Principes Directeurs issus de la Référence Visuelle

1. **Clair-obscur architectural monumental** : Des masses en béton architectural sombre (`#071426` / `#102747`) au premier plan gauche encadrent naturellement la typographie blanche et s’ouvrent sur un **oculus circulaire monumental** baigné d’une lumière froide azur et blanche (`#76A9E8` → `#FFFFFF`).
2. **Unité organique Premier Plan ↔ Monde 3D** :
   - Aucune carte HTML opaque générique flottant arbitrairement devant le décor.
   - Les surfaces du premier plan dialoguent avec les lignes de fuite, les joints du béton, les reflets planaires du sol (`MeshReflectorMaterial`) et les stèles en verre architectural biseauté intégrées dans l’espace 3D.
3. **Échelle humaine & profondeur atmosphérique** : Une silhouette humaine discrète sur les emmarchements donne immédiatement l’échelle monumentale de l’architecture (hauteur sous intrados > 14 m) et projette son reflet vertical sur la dalle polie.

---

## 2. Palette Chromatique Normative & Contrastes WCAG 2.2

Tous les ratios sont vérifiés mathématiquement par `scripts/verify-contrast.mjs` :

| Rôle | Token CSS | Hex | Contraste sur `#071426` | Niveau WCAG 2.2 |
| :--- | :--- | :--- | :--- | :--- |
| **Bleu Nuit (Fond & Ombre)** | `--midnight-950` | `#071426` | — | Surface maîtresse |
| **Bleu Profond (Béton & Volumes)** | `--midnight-900` | `#102747` | — | Surface architecturale |
| **Bleu Acier (Structures & Traits)** | `--midnight-700` | `#174477` | — | Accent structurel |
| **Bleu Lumineux (Lumière & Focus)** | `--azure-400` | `#76A9E8` | **7.57 : 1** | **AAA** |
| **Blanc Froid (Texte éditorial)** | `--ice-100` | `#E8EDF5` | **15.71 : 1** | **AAA** |
| **Gris-Bleu Froid (Métadonnées)** | `--ice-300` | `#A9BCD6` | **9.54 : 1** | **AAA** |
| **Blanc Pur (Titres & Ouvertures)** | `--white` | `#FFFFFF` | **18.47 : 1** | **AAA** |

---

## 3. Matériaux 3D & Éclairage Cinématographique

- **Béton architectural (`architecturalConcrete`)** : Micro-grain minéral procédural, joints de coffrage subtils, teinte `#0C1E38`, `roughness: 0.72`, `metalness: 0.08`.
- **Dalle miroir bleu nuit (`MeshReflectorMaterial`)** : Réflexions planaires temps réel maîtrisées (`blur={[320, 96]}`, `mixStrength={1.35}`, `roughness={0.26}`, teinte `#071426`) reflétant l’oculus lumineux, la silhouette et les stèles de verre.
- **Verre structurel biseauté (`architecturalGlass`)** : Panneaux verticaux translucides sombres à tranches illuminées (`#76A9E8` / `#FFFFFF`), portant les inscriptions diégétiques (`AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION`) et les supports muséaux.
- **Acier anodisé sombre (`brushedSteel`)** : Détails d’assemblage, sphères d’équilibre architecturales et huisseries fines (`roughness: 0.18`, `metalness: 0.88`).

---

## 4. Typographie & Shell de Navigation

- **Famille principale** : **`Plus Jakarta Sans Variable`** (auto-hébergée OFL) — `Loïc` en graisse régulière élancée (`400`), `AKANDA` en capitales géométriques puissantes (`760`), titres de sections en `500` équilibré.
- **Famille technique & index** : **`Geist Mono Variable`** (`tabular-nums`) pour `PORTFOLIO 2026`, la numérotation `01/06` → `06/06` et `SCROLL TO EXPLORE`.
- **Navigation persistante** :
  - Haut-gauche : monogramme **`LA.`** (point final en `#76A9E8`).
  - Gauche : rail vertical fin affichant simultanément **`01 /06` à `06 /06`** avec curseur lumineux `#76A9E8` et accès direct au clic.
  - Haut-droite : bouton **`Menu`** avec icône architecturale à 3 traits.
  - Bas-gauche : 3 boutons circulaires fins alignés horizontalement (`GitHub`, `LinkedIn`, `E-mail`).
  - Bas-centre : indicateur capsule **`SCROLL TO EXPLORE`** + ligne directrice verticale.
