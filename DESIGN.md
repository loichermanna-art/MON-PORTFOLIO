---
name: Loïc AKANDA — Corporate Immersive Portfolio
description: Système de direction artistique minéral, architectural et éditorial pour le portfolio 3D de Loïc AKANDA.
colors:
  bg-alabaster: "#F5F2EB"
  surface-chalk: "#FCFBF8"
  surface-sandstone: "#EAE5DA"
  ink-obsidian: "#141413"
  ink-slate: "#57534E"
  accent-institutional-navy: "#183B56"
  accent-patinated-bronze: "#6E502F"
  on-accent: "#FCFBF8"
  line-hairline: "rgba(20, 20, 19, 0.12)"
typography:
  display:
    fontFamily: "'Instrument Serif', Georgia, serif"
    fontSize: "clamp(2.7027rem, 1.7268rem + 4.3375vw, 5.6305rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "'Instrument Serif', Georgia, serif"
    fontSize: "clamp(1.8158rem, 1.4356rem + 1.69vw, 2.9566rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Schibsted Grotesk Variable', system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1rem, 0.9583rem + 0.1852vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "-0.005em"
  mono:
    fontFamily: "'Geist Mono Variable', ui-monospace, monospace"
    fontSize: "clamp(0.8152rem, 0.8212rem - 0.0066vw, 0.8197rem)"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
---

# DESIGN.md — Système de Direction Artistique (« L'Atrium de Haute Précision »)

## 1. Thèse Visuelle & Concept Directeur

**Concept retenu :** **Piste A Hybride — « L'Atrium de Haute Précision »**  
*L'autorité silencieuse d'une institution financière alliée à la clarté spatiale d'une fondation d'architecture contemporaine et aux perspectives modernistes de l'INP-HB.*

Le design repose sur **trois strates indissociables** :
1. **Un édifice architectural 3D continu et lumineux** en pierre calcaire d'albâtre et bronze patiné, baigné d'une lumière naturelle matinale aux ombres maîtrisées.
2. **Une cinématographie spatiale mesurée** qui traverse six espaces ayant chacun une fonction narrative précise.
3. **Une mise en page éditoriale institutionnelle** à fort espace négatif (`≥ 55 %`), structurée par des filets architecturaux de `1px` et un contraste typographique franc entre serif ciselée et néo-grotesque analytique.

---

## 2. Palette Chromatique par Rôles & Conformité WCAG 2.2

Tous les couples ont été vérifiés mathématiquement via la formule officielle de luminance relative WCAG 2.2 (`contrast-check`, code de sortie `0`) :

| Token CSS | Rôle | Hex | Ratios WCAG 2.2 vérifiés | Règles d'usage strictes |
| :--- | :--- | :--- | :--- | :--- |
| `--bg` | Fond principal & brume d'horizon 3D | `#F5F2EB` | — | Couvre 60–70 % de l'écran ; assure la fusion invisible entre le `<Canvas>` WebGL et le document HTML. |
| `--surface` | Panneaux éditoriaux & fiches | `#FCFBF8` | — | Utilisé pour les surfaces de lecture rapprochée (fiches projets, navigation active). |
| `--surface-alt` | Socles & séparations douces | `#EAE5DA` | — | Zones secondaires, états survolés discrets, socles de maquettes. |
| `--ink` | Encre principale (Titres & Corps) | `#141413` | **16.49:1 (`AAA`)** sur `--bg`<br>**17.81:1 (`AAA`)** sur `--surface` | Jamais de noir pur `#000000` ; noir obsidienne légèrement chaud harmonisé à la pierre. |
| `--ink-muted` | Encre secondaire & métadonnées | `#57534E` | **6.82:1 (`AA`)** sur `--bg`<br>**7.37:1 (`AAA`)** sur `--surface` | Légendes, dates, descriptions secondaires. Jamais sous `4.5:1`. |
| `--accent` | Accent institutionnel primaire | `#183B56` | **10.44:1 (`AAA`)** sur `--bg`<br>Texte `--surface` dessus : **11.28:1 (`AAA`)** | **Bleu Nuit Institutionnel** : réservé à l'action primaire unique par scène, à l'indicateur actif et à l'anneau `:focus-visible`. **Surface maximale ≤ 5 %.** |
| `--accent-bronze` | Signature architecturale secondaire | `#6E502F` | **6.59:1 (`AA`)** sur `--bg`<br>**7.12:1 (`AAA`)** sur `--surface` | **Bronze Patiné** : réservé aux repères d'axes spatiaux, index de séquences et rappels des structures 3D en bronze. |

---

## 3. Système Typographique (Auto-hébergé OFL `@fontsource`)

Conformément aux audits *Impeccable* et *Universal Creative Engine*, aucune police n'est chargée depuis un CDN tiers : les fichiers `.woff2` sont auto-hébergés localement via `@fontsource` (licence SIL Open Font License, jeu de caractères français intégral : `É, È, Ê, À, Ç, Œ, « », ’`).

### 3.1 Familles & Rôles
1. **Voix Éditoriale (`--font-display`) — `Instrument Serif`** (`@fontsource/instrument-serif`, 400 romain & italique) :
   - Utilisée pour le nom monumental, les titres des 6 scènes (`H1`, `H2`) et les titres des projets majeurs. Ses fûts verticaux élancés répondent directement aux colonnades du Péristyle 3D.
2. **Voix Analytique & Interface (`--font-sans`) — `Schibsted Grotesk Variable`** (`@fontsource-variable/schibsted-grotesk`, 400–600) :
   - Utilisée pour tout le texte courant, l'analyse des projets, la navigation et les boutons. Hauteur d'x généreuse et dessin d'une grande clarté corporate.
3. **Voix Métrologique (`--font-mono`) — `Geist Mono Variable`** (`@fontsource-variable/geist-mono`, 400–500) :
   - Utilisée uniquement pour les index de séquences (`SCÈNE 01 / 06`), coordonnées architecturales, dates et technologies vérifiées, toujours avec `font-variant-numeric: tabular-nums`.

### 3.2 Échelle Modulaire Fluide (`360px` → `1440px`, ordonnée en `rem`)
```css
:root {
  --step-m1: clamp(0.8152rem, 0.8212rem - 0.0066vw, 0.8197rem); /* 13.1px → 13.0px | Métadonnées & Mono */
  --step-0:  clamp(1rem,      0.9583rem + 0.1852vw, 1.125rem);  /* 16.0px → 18.0px | Corps de lecture */
  --step-1:  clamp(1.22rem,   1.1092rem + 0.4926vw, 1.5525rem); /* 19.5px → 24.8px | Chapeau éditorial */
  --step-2:  clamp(1.4884rem, 1.2704rem + 0.9690vw, 2.1424rem); /* 23.8px → 34.3px | Sous-titres & Projets */
  --step-3:  clamp(1.8158rem, 1.4356rem + 1.6900vw, 2.9566rem); /* 29.1px → 47.3px | Titres de séquence H2 */
  --step-4:  clamp(2.2153rem, 1.5938rem + 2.7626vw, 4.0801rem); /* 35.4px → 65.3px | Titres majeurs */
  --step-5:  clamp(2.7027rem, 1.7268rem + 4.3375vw, 5.6305rem); /* 43.2px → 90.1px | Signature Hero H1 */
}
```

### 3.3 Règles Micro-typographiques
- **Mesure de lecture :** `48ch` à `65ch` maximum sur tous les paragraphes (`max-width: 62ch`).
- **Césure & équilibre :** `text-wrap: balance` sur `h1, h2, h3` ; `text-wrap: pretty` sur `p`.
- **Typographie française :** espaces fines insécables avant `: ; ! ?`, guillemets français `« … »`, apostrophes typographiques `’`.
- **Plancher absolu :** aucun texte utile inférieur à `13px` (`0.8125rem`).

---

## 4. Grille Spatiale, Rythme & Alternance des Compositions

### 4.1 Grille CSS & Points de rupture
- **Unité de base :** `8px` (`--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 24px`, `--space-6: 32px`, `--space-7: 48px`, `--space-8: 64px`, `--space-9: 96px`, `--space-10: 128px`).
- **Desktop (`≥ 1024px`) :** 12 colonnes (`minmax(0, 1fr)`), gouttière `32px`, marges latérales fluides `clamp(32px, 5vw, 80px)`, largeur max conteneur `1360px`.
- **Tablette (`768px – 1023px`) :** 8 colonnes, gouttière `24px`, marges `32px`.
- **Mobile (`< 768px`, référence `390px`) :** 4 colonnes, gouttière `16px`, marges `20px`.

### 4.2 Alternance Narrative (Refus du centrage monotone)
Conformément au §5 du brief, chaque séquence adopte une relation spatiale distincte entre le HTML et l'architecture 3D :
- **Scène 01 (Hero) :** Texte monumental ancré **colonnes 1–7 à gauche** ; Péristyle & Portique d'Équilibre 3D déployés en profondeur **colonnes 7–12 à droite**.
- **Scène 02 (About) :** Inversion — Galerie à claire-voie (brise-soleil) **à gauche (colonnes 1–5)** ; récit académique et philosophie **à droite (colonnes 7–12)**.
- **Scène 03 (Expertise) :** En-tête éditorial asymétrique haut, puis **diptyque architectural structuré** (Aile *Finance, Comptabilité, Audit & Analyse* à gauche / Aile *Conception, Développement & Projets* à droite, encadrant la Cour des Deux Piliers 3D).
- **Scène 04 (Selected Projects) :** Travelling rapproché successif — **fiche analytique latérale alternée** face au monolithe 3D exposant l'interface réelle du projet, avec panneau d'exploration détaillée à la demande.
- **Scène 05 (Process) :** Progression séquentielle en **6 travées alignées** sur les paliers du pont 3D qui s'assemblent au scroll.
- **Scène 06 (Contact) :** Retour au **calme axial ouvert** (colonnes centrales 3–10 devant le Belvédère 3D dégagé).

---

## 5. Matières 3D, Profondeur & Surfaces Navigateur

### 5.1 Matériaux PBR 3D
1. **Pierre d'Albâtre adoucie (`Limestone`) :** albédo `#F2EDE3`, micro-grain minéral procédural et joints d'appareillage subtils, `roughness: 0.86`, `metalness: 0.02`.
2. **Grès d'assise (`Sandstone Plinth`) :** albédo `#E5DFD2`, `roughness: 0.90`, utilisé pour les marches, socles et linteaux secondaires.
3. **Bronze Patiné Architectural (`Burnished Bronze`) :** albédo `#3C2F23`, reflets chauds `#8B6B43`, `metalness: 0.78`, `roughness: 0.32`, utilisé avec parcimonie pour les cadres d'équilibre, tirants et bordures des stèles projets.
4. **Verre Muséal Antireflet :** transmission sobre / réflexion douce sur les pupitres d'exposition projets uniquement (aucun glassmorphism généralisé dans l'UI).

### 5.2 Surfaces Navigateur (`craft-floor`)
- `::selection` : fond `#183B56` (Bleu Nuit Institutionnel), texte `#FCFBF8`.
- `:focus-visible` : contour `2px solid #183B56` avec `outline-offset: 3px` (ratio `10.44:1` ≥ `3:1` WCAG 1.4.11).
- Liens éditoriaux : soulignement fin `1px` avec `text-underline-offset: 0.22em`.
- Boutons : géométrie architecturale franche (rayon `2px`), feedback `:active { transform: scale(0.97) }`, transition `160ms cubic-bezier(0.23, 1, 0.32, 1)`.

---

## 6. Exclusions Strictes (Anti-Patterns Interdits)

1. **Interdit :** esthétique gaming, cyberpunk, néons, mode sombre futuriste ou particules flottantes décoratives.
2. **Interdit :** sculpture fluide/organique arbitraire (blob, torus knot, sphère chromée) sans fonction architecturale.
3. **Interdit :** teintes violettes/lavandes (`OKLCH 270–330°`), dégradés décoratifs dans les titres, glassmorphism systématique.
4. **Interdit :** barres de progression ou pourcentages de compétences inventés (« Audit 85 % »).
5. **Interdit :** grilles SaaS génériques de 3 cartes identiques *icône + titre + texte*.
