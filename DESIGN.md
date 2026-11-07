# DESIGN.md — Charte Normative « Horizon Monolithique »
## Portfolio de Loïc AKANDA

> **Source de vérité unique du Design System** construite à partir des **12 visuels de référence** (`Portfolio futuriste de Loïc Akanda.png`, `TRES BON.jfif`, `UI.jfif`, `MS7WT...jfif`, `HGG.jfif`, `ER.jfif`, `YT.jfif`, `PO.jfif`).

---

## 1. Philosophie Visuelle & Spatiale

Le portfolio articule deux exigences :
1. **Conserver l’animation 3D architecturale continue pilotée par le défilement** (`Lenis` + `GSAP` + `Three.js` 3-tier rig).
2. **Adopter une interface minimaliste futuriste sans cartes rectangulaires lourdes** : la typographie géométrique flotte directement dans l’espace négatif gauche, encadrée par un **rail HUD vertical fixe à gauche (`LA · 01/06 · Social`)** et un déclencheur épuré **`Menu ⋮`** en haut à droite.

---

## 2. Palette Chromatique & Contrastes WCAG 2.2 (Vérifiés via `scripts/verify-contrast.mjs`)

### Scènes 01 à 05 — Jour Polaire Minéral
| Rôle | Token CSS | Hex | Contraste sur `#F2F4F8` | Niveau WCAG 2.2 |
| :--- | :--- | :--- | :--- | :--- |
| **Brume Minérale (Fond)** | `--bg` | `#F2F4F8` | — | Surface scène |
| **Dalle Pure** | `--surface` | `#FFFFFF` | — | Surface pure |
| **Ardoise Claire** | `--surface-alt` | `#E5E9F0` | — | Surface secondaire |
| **Encre Obsidienne** | `--ink` | `#0F1218` | **17.03 : 1** | **AAA** |
| **Gris Ardoise** | `--ink-muted` | `#474E5B` | **7.60 : 1** | **AAA** |
| **Titane Profond (Accent)** | `--accent` | `#1A2333` | **14.32 : 1** | **AAA** |

### Scène 06 — Crépuscule d’Horizon Doré
| Rôle | Token CSS | Hex | Contraste sur `#1B222E` | Niveau WCAG 2.2 |
| :--- | :--- | :--- | :--- | :--- |
| **Ardoise Crépusculaire** | `--dusk-bg` | `#1B222E` | — | Fond scène 06 |
| **Blanc Lumineux** | `--dusk-ink` | `#F8FAFC` | **15.26 : 1** | **AAA** |
| **Argent Doux** | `--dusk-muted` | `#C2CAD6` | **9.67 : 1** | **AAA** |

---

## 3. Système Typographique (100 % Auto-hébergé OFL via `@fontsource-variable`)

- **Titres & Corps (`--font-display`, `--font-sans`)** : **`Plus Jakarta Sans Variable`** (géométrique contemporaine ultra-nette : graisse `300` pour *« Loïc »*, `750` majuscule pour *« AKANDA »*, `500` pour les titres de scènes).
- **Index & Métadonnées (`--font-mono`)** : **`Geist Mono Variable`** avec `font-variant-numeric: tabular-nums`.

---

## 4. Composants Signatures

1. **Rail Vertical Gauche (`.hud-rail`)** : Monogramme géométrique `LA` en tête, indicateur `01 /06` + ligne de progression verticale au centre, 3 icônes (`GitHub`, `LinkedIn`, `Mail`) en pied.
2. **Boutons Pilules (`.pill-cta`)** : `border-radius: 999px`, contour fin `1px`, flèche directionnelle `→`, retour tactile `scale(0.97)`.
3. **Orbe Circulaire Hero (`.scroll-orb`)** : Cercle parfait `Scroll ↓`.
4. **3 Dalles Projets en Perspective (`.floating-project-tile`)** : `LAURA HOUSE` (Obsidienne `#0F1218`), `SassySkin` (Rose poudré `#F8EAEC`), `EtuCo` (Glace `#FFFFFF`).
5. **6 Capsules Orbitales (`.orbital-pill`)** : `1. Comprendre` → `6. Tester & améliorer`.
