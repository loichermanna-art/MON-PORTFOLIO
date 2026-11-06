# IMPLEMENTATION.md — Plan de Réalisation, Conventions & Protocole QA

## 1. Feuille de Route Séquentielle (Phases 1 à 8)

| Phase | Statut | Livrables réalisés / attendus |
| :--- | :--- | :--- |
| **Phase 1 — Audit & Préparation** | **Terminé** | Inspection du dépôt `MON-PORTFOLIO`, croisement GitHub/Vercel en lecture seule, rapport `capability-detection` (`Mode B+`), audit détaillé et arbitrage des 5 référentiels de skills (`docs/01-PHASE1-AUDIT.md`). |
| **Phase 2 — Direction Artistique** | **Terminé** | Exploration de 3 univers immersifs corporate distincts, tests mathématiques WCAG 2.2 AA/AAA, sélection argumentée de « L'Atrium de Haute Précision » (`docs/02-PHASE2-ART-DIRECTION.md`). |
| **Phase 3 — Storyboard** | **Terminé** | Découpage cinématographique Desktop & Mobile des 6 scènes avec positions caméra, angles, structures 3D, animations autonomes et transitions au scroll (`MOTION.md`). |
| **Phase 4 — Maquettes Détaillées** | **Terminé (Jalon actuel)** | Planche interactive haute fidélité des **6 maquettes complètes** (*Hero, About, Expertise, Projects, Process, Contact*) accessible dans le mode Studio (`?view=mockups`), illustrant typographie réelle, textes vérifiés, grille 12 colonnes et plans de profondeur 3D ↔ HTML. |
| **Phase 5 — Documentation** | **Terminé (Jalon actuel)** | Création des 6 documents normatifs à la racine : `PRODUCT.md`, `DESIGN.md`, `MOTION.md`, `TECH-STACK.md`, `CONTENT.md`, `IMPLEMENTATION.md`. |
| **Phase 6 — Prototype 3D Fonctionnel** | **En validation (Jalon actuel)** | Scène 01 complète (*Le Péristyle de Lumière* + *Portique d'Équilibre*) et première transition cinématographique au scroll vers la Scène 02 (*La Galerie à Claire-Voie*), avec mouvement autonome, parallaxe souris, typographie par masques, mode mouvement réduit et fallback WebGL. **Point de validation visuelle avant généralisation.** |
| **Phase 7 — Développement Complet** | **À lancer après validation du prototype** | Généralisation modulaire des Scènes 02, 03, 04 (avec tiroir d'étude de cas interactive), 05 (passerelle en 6 dalles assemblées au scroll) et 06 (Belvédère de contact). |
| **Phase 8 — Tests & QA Finaux** | **À exécuter en clôture** | Vérifications Desktop/Tablette/Mobile (`1440`, `1024`, `768`, `390px`), scroll aller-retour, navigation clavier, `prefers-reduced-motion`, absence d'erreurs console, audit `break-ui` et rapport honnête testé / à valider visuellement. |

---

## 2. Conventions Techniques Strictes

### 2.1 Règles React & Performance 60 fps (Emil Kowalski — `animation-performance`)
1. **Interdiction formelle d'appeler `setState` dans une boucle `useFrame`, un écouteur `scroll` ou `pointermove`.** Toute valeur continue transite par `src/motion/motionStore.ts` (objet mutable lu directement en 60/120 Hz par Three.js et GSAP).
2. **Interdiction de `transition: all`** : chaque transition CSS déclare explicitement `transform`, `opacity`, `color` ou `border-color`.
3. **Interdiction d'animer `width`, `height`, `top`, `left`, `margin` ou `padding`** pour des déplacements visuels : utiliser exclusivement `transform: translate3d() / scale()` et `opacity` (ou `clip-path` pour les masques éditoriaux).
4. **Interdiction d'animer une variable CSS héritée sur `<html>` ou `<main>`** à chaque frame de scroll.

### 2.2 Conventions Three.js & Cycle de Vie WebGL
1. **Unité métrique :** `1 unité Three.js = 1 mètre architectural`. Hauteur du regard humain standard : `y ≈ 1.85m – 2.10m`.
2. **Zéro ressource externe non maîtrisée :** aucune requête vers un CDN tiers pour des `.hdr`, `.glb` ou polices WebGL. Les textures minérales et l'environnement lumineux `<Lightformer>` sont générés localement de manière déterministe.
3. **Nettoyage mémoire (`dispose`) :** chaque `CanvasTexture`, `BufferGeometry` ou `Material` instancié impérativement est libéré dans le retour de `useEffect`.
4. **Détection WebGL :** `canUseWebGL()` est vérifié avant le montage du `<Canvas>`. En cas d'indisponibilité matérielle, `<WebGLFallback />` prend le relais sans crash ni écran blanc.

### 2.3 Conventions d'Accessibilité & Sémantique HTML
1. Le `<Canvas>` 3D porte `aria-hidden="true"` et `pointer-events: none` (sauf interactions 3D ciblées doublées d'équivalents boutons HTML accessibles au clavier).
2. Tous les contenus éditoriaux résident dans un arbre HTML sémantique (`<header>`, `<nav>`, `<main>`, `<section aria-labelledby="...">`, `<footer>`) entièrement navigable au clavier (`Tab` / `Shift+Tab`, lien d'évitement *« Aller au contenu principal »*) et sélectionnable à la souris.
3. Tous les nombres dynamiques et index utilisent `font-variant-numeric: tabular-nums`.
4. Aucun couple texte/fond ne descend sous le seuil WCAG 2.2 AA (`4.5:1`), avec un objectif AAA (`> 7:1`) atteint sur l'ensemble du corps de texte (`16.49:1`).

---

## 3. Commandes du Projet

```bash
npm install          # Installation des dépendances verrouillées
npm run dev          # Serveur de développement (0.0.0.0, compatible Live Preview Arena)
npm run typecheck    # Vérification stricte TypeScript (tsc --noEmit)
npm run test         # Suite automatisée Vitest (WCAG 2.2, accessibilité, données, fallback)
npm run build        # Build de production optimisé dans dist/
```
