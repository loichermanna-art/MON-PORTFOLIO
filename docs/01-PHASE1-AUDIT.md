# PHASE 1 — AUDIT COMPLET & FONDATIONS TECHNIQUES
**Projet :** Portfolio Personnel — Loïc AKANDA (`loichermanna-art/MON-PORTFOLIO`)  
**Date de vérification :** 2026-11-06  
**Méthodologie :** Universal Creative Engine 0.2.0 (`capability-detection` + `creative-brief-analysis`) × Impeccable × Emil Kowalski Skills × Taste Skill × LottieFiles Motion Design

---

## 1. Audit du dépôt GitHub & de l'écosystème réel

### 1.1 État du dépôt cible (`MON-PORTFOLIO`)
- **Dépôt :** `https://github.com/loichermanna-art/MON-PORTFOLIO` `[Vérifié 2026-11-06]`
- **Branche active de session :** `arena/e825c7df-mon-portfolio` (issue de `main` @ `b4d61e20443399582bf2082d5424181f894c5a40`) `[Vérifié]`
- **Contenu initial :** dépôt vierge (*greenfield*), contenant uniquement `README.md` (`# MON-PORTFOLIO`). Aucun framework, `package.json`, configuration ou dette technique préexistante `[Vérifié]`.

### 1.2 Cartographie factuelle du profil & des projets (Zéro invention)
Conformément aux règles anti-fabrication du Master Brief (§2, §6, §13) et du *Universal Creative Engine* (`WRITING-RULES.md` §3), chaque élément d'information est qualifié selon son niveau de preuve :

| Élément | Statut épistémique | Détail vérifié / Source | Point à confirmer avec Loïc |
| :--- | :--- | :--- | :--- |
| **Identité & cursus** | `[Fourni — Brief]` | **Loïc AKANDA**, étudiant en Finance en 3e année du cycle ingénieur à l'**INP-HB** (Côte d'Ivoire). | Intitulé exact de la filière/école interne à l'INP-HB (ex. ESCAE / ingénieur financier) si souhaité. |
| **Piliers métiers** | `[Fourni — Brief]` | Finance · Comptabilité · Audit · Analyse financière · Conception de produits numériques · Développement web · Gestion de projets. | Ordre de priorité selon la cible principale (stage/emploi audit-finance vs missions digitales/hybrides). |
| **Projet 1 — LAURA HOUSE** | `[Fourni + Vérifié Vercel]` | Plateforme de billetterie événementielle : gestion des réservations, génération de billets QR et export PNG haute résolution conservant le QR. Déployée sur `https://laura-house.vercel.app` (stack vérifiée : **Vite**, fonctions Node.js/Vercel, dépôt privé `VENTE-DE-TICKET`). | Contexte client/événement réel, rôle exact, captures autorisées et autorisation d'afficher le lien public `laura-house.vercel.app`. |
| **Projet 2 — SassySkin** | `[Fourni + Vérifié Vercel]` | Site web destiné à une activité de vente de produits de skincare. Déployé sur `https://sassy-skin-site.vercel.app`. | Problème initial, fonctionnalités clés vérifiées (catalogue, commande WhatsApp/panier, etc.), stack technique exacte et lien public à afficher. |
| **Projet 3 — EtuCo** | `[Fourni — Brief]` | Application et environnement numérique liés aux activités du **Club Études-Conseils**. *(Aucun déploiement Vercel ou dépôt public détecté sous le nom `etuco`.)* | Problème résolu, périmètre fonctionnel exact, rôle au sein du Club Études-Conseils, stack vérifiée et visuels/lien éventuel. |
| **Projets additionnels GitHub** | `[Vérifié GitHub]` | Dépôts publics observés sur `github.com/loichermanna-art` : **`Egroupe`** (*Excellence Group*, site vitrine FR/EN en Next.js 16, React 19, TypeScript, Tailwind v4, Motion, Lenis, carte 3D CI) et **`SEANCE-DE-MUSCU`** (*GYM OS*, PWA React/TS/Vite/Dexie). | Confirmer si **Excellence Group** (ou un 4e projet) doit rejoindre la sélection initiale ou rester en réserve évolutive. |
| **Coordonnées (Contact)** | `[Partiel]` | GitHub vérifié : `https://github.com/loichermanna-art`. E-mail observé dans les métadonnées Vercel : `loichermanna@gmail.com` `[Déduit]`. | Confirmer l'e-mail professionnel officiel à afficher, l'URL **LinkedIn** exacte, et la ville de référence souhaitée (Yamoussoukro / Abidjan / Grand-Bassam). |

---

## 2. Détection des Capacités & Environnement Technique (`capability-detection`)

Exécution réelle effectuée le `2026-11-06` dans l'environnement sandbox Linux x86_64 :

| Capacité / Outil | État réel vérifié | Impact architectural & Protocole de travail |
| :--- | :--- | :--- |
| **Exécution shell & Git/GH** | **Oui** (`bash`, `git`, `gh` authentifié) | Versionnage propre sur la branche imposée `arena/e825c7df-mon-portfolio`. |
| **Node.js & Gestionnaires** | **Node `v22.22.3`**, **npm `10.9.8`**, **Yarn `1.22.22`**, **Python `3.11.2`** | Compatible avec toute la pile moderne (`Vite 6/8`, `Next.js 16`, `React 19`, `Three.js 0.187`, `R3F 9.8`). |
| **Registre npm & PyPI** | **Oui** (`registry.npmjs.org` HTTP 200, `pypi.org`, `github.com`) | Installation complète des bibliothèques 3D, d'animation, de typographie et de test. |
| **Accès CDN externes (Google Fonts, etc.)** | **Filtré côté sandbox** (liste blanche : GitHub, npm, PyPI) | **Décision structurante :** toutes les polices seront **auto-hébergées via `@fontsource` / `@fontsource-variable`** (meilleure performance LCP, zéro requête tierce, conformité RGPD, zéro décalage CLS). |
| **Serveur Live Preview Arena** | **Oui** (`start_process` sur `0.0.0.0`, proxy HTTPS `*.e2b.app`) | Rendu WebGL2 / Three.js sur **vrai GPU** directement dans le navigateur de Loïc à chaque jalon (Maquettes HTML, Prototype Scène 01, Site complet). |
| **Lecture & Génération d'images** | **Oui** (`read_file` PNG/JPG, `generate_image`, `ImageMagick 6.9`) | Possibilité d'inspecter visuellement toute capture fournie ou générée. |
| **Navigateur Headless local (Playwright / Chromium) & FFmpeg** | **Absents du conteneur** (et CDN binaires Microsoft Playwright hors liste blanche réseau) | **Transparence totale (Règle UCE `fallbacks.md`) :** nous sommes en **Mode B+ (Exécution complète + Tests automatisés Node/Vitest/WCAG/Typecheck + Live Preview interactif temps réel)**. Nous ne prétendrons jamais avoir exécuté une capture Chromium locale si elle n'a pas tourné ; la validation visuelle s'appuiera sur nos scripts d'audit mathématique (contraste WCAG 2.2, bornes typographiques, tests unitaires/DOM multi-viewports) couplés au **Live Preview temps réel** vérifié avec toi à chaque étape. |

### Vérification de compatibilité des versions clés sur `registry.npmjs.org` `[Vérifié 2026-11-06]`
- `three`: `0.187.0`
- `@react-three/fiber`: `9.8.2` (`peerDependencies: react >=19 <19.4, three >=0.156`)
- `@react-three/drei`: `10.7.9` (`peerDependencies: @react-three/fiber ^9.0.0, react ^19`)
- `gsap`: `3.15.1` (inclut `ScrollTrigger` et `SplitText` sous licence Standard No Charge Webflow)
- `lenis`: `1.3.27` (`peerDependencies: react >=17.0.0`)
- `motion`: `14.10.1` (inclut l'accélération matérielle WAAPI combinée des transforms >= 14.2)

---

## 3. Audit Scrupuleux des 5 Ressources & Skills Obligatoires

Tous les dépôts ont été clonés et inspectés fichier par fichier (`SKILL.md`, `references/*.md`, scripts), ainsi que les 150 pages intégrales du guide PDF *Universal Creative Engine 0.2.0*.

### A. Emil Kowalski — Design Engineering Skills (`emilkowalski/skills`)
Fichiers étudiés : `emil-design-eng`, `animate`, `choreograph`, `animation-performance`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-vocabulary`, `prototype`, `break-ui`, `ui-cheatsheet.md`, `performance-cheatsheet.md`.

**Règles opérationnelles retenues pour notre portfolio :**
1. **Séparation stricte UI vs Scène Narrative** :
   - Toute interaction d'interface (boutons, navigation, ouverture de fiche projet, sélecteurs) reste **sous 300 ms** (`150–240 ms`) avec une courbe `ease-out` nerveuse (`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`). **Interdiction absolue de `ease-in`** sur une entrée UI.
   - Feedback tactile systématique sur les éléments cliquables : `:active { transform: scale(0.97) }`.
   - **Jamais de `scale(0)`** : toute apparition commence au minimum à `scale(0.95)` combiné à `opacity: 0`.
2. **Chorégraphie (`choreograph`)** :
   - Règle *« One entrance per container »* : si un panneau s'ouvre, son contenu est déjà là (pas de double attente parent + enfants).
   - Casting obligatoire par séquence : **Lead** (titre ou structure 3D focale) → **Support** (paragraphe, métadonnées) → **Decoration** (filets architecturaux : simple fondu) → **Static**.
   - Interdiction des staggers mécaniques uniformes sur de longues listes ; budget total de cascade **< 500 ms** ; la chorégraphie ne bloque jamais le clic.
3. **Performance pure (`animation-performance`)** :
   - Sur le DOM, animer exclusivement `transform`, `opacity` et `clip-path`.
   - **Zéro `setState` React dans `requestAnimationFrame`, `scroll` ou `pointermove`** : écriture directe sur `refs`, uniforms WebGL ou timelines GSAP.
   - **Piège critique évité** : ne jamais animer une variable CSS `--scroll` sur un parent pour piloter ses enfants (provoque un recalcul de style sur tout le sous-arbre DOM à chaque frame).
   - Hover protégé par `@media (hover: hover) and (pointer: fine)` ; `prefers-reduced-motion: reduce` implémenté dès la construction (conserve l'opacité et le sens spatial, supprime les déplacements amples).
4. **Robustesse aux cas limites (`break-ui`)** :
   - `font-variant-numeric: tabular-nums` sur tous les index, dates et repères numériques ; `min-width: 0` et `minmax(0, 1fr)` dans toutes les grilles ; `max-width: 65ch` sur les textes courants.

---

### B. Impeccable (`pbakaus/impeccable` — v4.8.0)
Fichiers étudiés : `SKILL.md`, `shape`, `init`, `document`, `critique`, `audit`, `layout`, `typeset`, `bolder`, `quieter`, `distill`, `animate`, `polish`, `harden`, `adapt`, `optimize`, `overdrive`, `craft-floor`, `new-work`.

**Règles opérationnelles retenues :**
1. **Mode de surface : `Experience` × `Persuade`** :
   - Dans un portfolio d'exception, l'œuvre elle-même (l'espace architectural 3D et la mise en scène éditoriale des projets réels) mène dès le premier viewport ; l'interface chromée s'efface au profit de la clarté spatiale.
2. **Exigences du `craft-floor.md` (Anti-générique & Finition Studio)** :
   - **Refus des poncifs IA** : pas de texte en dégradé, pas de rangées de 3 cartes identiques *icône + titre + texte*, pas de glassmorphism décoratif gratuit, pas d'ombres néobrutalistes décalées, pas d'emojis en guise d'icônes, pas de polices vues partout par défaut sans justification (`Playfair`, `Cormorant`, `Syne`, `Space Grotesk`, `Plus Jakarta Sans`).
   - **Thématisation complète des surfaces navigateur** : sélection de texte (`::selection`), anneaux `:focus-visible`, barres de défilement discrètes, `text-underline-offset` soigné, et césure typographique équilibrée (`text-wrap: balance` sur les titres, `text-wrap: pretty` sur les paragraphes).
3. **Protocole `overdrive` maîtrisé** :
   - *« Propose Before Building »* : proposer 2 à 3 directions ambitieuses avec leurs compromis avant d'écrire le code.
   - Pousser l'ambition technique (WebGL architectural continu, transitions spatiales, shaders sobres de pierre/lumière) uniquement là où elle sert la crédibilité corporate.

---

### C. Taste Skill (`Leonxlnx/taste-skill` — v2.5.0) & Arbitrage des conflits
Fichiers étudiés : `SKILL.md`, `system.md`, `layout-v4.md`, `motion.md`, `scenes.md`, `sections.md`, `perf.md`, `effects-creative.md`, `effects-objects.md`.

Conformément à la **Section 8C du Master Brief** (*« ses règles sont volontairement très opinionated. Ne les applique pas aveuglément. Les contraintes propres à notre direction artistique immersive et corporate priment lorsqu'il existe un conflit justifié »*), voici notre arbitrage explicite :

| Règle `taste-skill` | Décision | Justification pour le portfolio de Loïc Akanda |
| :--- | :--- | :--- |
| Interface **90–95 % neutre**, 1 seul accent (≤ 5 % de surface) | **RETENU** | Garantit immédiatement l'autorité institutionnelle et évite l'effet « template coloré ». |
| **Bannissement absolu du violet/lavande IA** (`OKLCH 270–330°`) | **RETENU** | Élimine le signal n°1 des interfaces générées artificiellement. |
| Corps de texte **≥ 16 px**, jamais de texte < 13 px, contraste texte principal ≥ 7:1 | **RETENU** | Lisibilité éditoriale irréprochable pour un recruteur en finance/audit. |
| Budget strict : **≤ 4 fichiers de polices**, **≤ 4 contextes WebGL** (nous visons **1 seul `<Canvas>` partagé**), DPR plafonné (`[1, 1.5]` ou `[1, 2]` adaptatif) | **RETENU** | Clé de voûte pour garantir 60 fps sur un laptop d'entreprise à GPU intégré. |
| Montrer de **vraies interfaces / preuves produit** plutôt que des schémas abstraits | **RETENU** | LAURA HOUSE, SassySkin et EtuCo seront montrés via de vraies vues d'interfaces documentées dans l'espace 3D. |
| Sections rigides figées à `100svh` sans transition au scroll ni numérotation de séquence | **ÉCARTÉ (Conflit Brief)** | Notre brief exige un **voyage cinématographique continu à travers 6 séquences spatiales** piloté par le scroll (*scrolltelling*), avec variations d'alignement gauche / droite / centré monumental. |
| Interdiction des capitales espacées pour les métadonnées | **ADAPTÉ** | Autorisé avec parcimonie uniquement pour la signalétique architecturale / muséale en chasse fixe (`≥ 12–13 px`, contraste AA vérifié). |

---

### D. Universal Creative Engine `0.2.0` (Guide PDF — 150 pages)
Audit complet des 12 parties du PDF (`README`, `ARCHITECTURE`, `SKILL-FORMAT`, `WRITING-RULES`, `QUALITY-RUBRICS`, `EXECUTION-MODES`, `uce-orchestrator`, `capability-detection`, `creative-brief-analysis`, `reference-analysis`, `art-direction-system`, `MANIFEST`, et scripts annexes).

**Constat factuel important vérifié dans `tracking/MANIFEST.md` (p. 123–125) :**
- En version `0.2.0`, seuls **6 skills** sont rédigés/partiels (`uce-orchestrator`, `capability-detection`, `skill-authoring`, `creative-brief-analysis`, `reference-analysis`, et `art-direction-system` guides 01 à 05).
- Les skills `webgl-threejs`, `web-animation-gsap`, `scroll-driven-animation`, `kinetic-typography`, `visual-qa-playwright` et `animation-qa` sont explicitement marqués **`planifié` (non rédigés)** dans le manifeste 0.2.0. Nous les complétons donc par les standards d'Emil Kowalski, d'Impeccable, de LottieFiles Motion Design et notre ingénierie Three.js/GSAP directe, sans jamais prétendre charger un fichier fantôme.
- En revanche, nous exploitons directement dès la Phase 2 :
  1. Le protocole des **3 intentions créatives contrastées** et des **5 tests de spécificité** (`03-creative-intent.md` : Substitution, Capture, Exclusion, Défaut d'IA, Faisabilité).
  2. La formule exacte de **luminance relative WCAG 2.2** (`contrast-check.mjs`, p. 138) exécutée sur toutes nos palettes candidates.
  3. La formule d'**échelle typographique modulaire fluide `clamp()`** à ordonnée en `rem` (`type-scale.mjs`, p. 102 & 140) préservant le zoom utilisateur.

---

### E. LottieFiles Motion Design (`LottieFiles/motion-design-skill`)
Fichiers étudiés : `SKILL.md`, `director/*` (`choreography`, `core-philosophy`, `motion-personality`, `emotion-mapping`, `narrative-structure`), `patterns/*`, `reference/*` (`property-selection`, `quality-checklist`, `timing-easing-tables`, `troubleshooting`).

**Règles opérationnelles retenues :**
1. **Archétype Motion : `Corporate` × `Premium`** (`0 %` d'overshoot / zéro rebond élastique ludique ; décélérations longues et maîtrisées pour les mouvements architecturaux `600–1100 ms`, réactivité nette `160–280 ms` pour l'UI).
2. **Trois couches de profondeur cinématographique** :
   - *Primary* : trajectoire caméra & révélation éditoriale principale.
   - *Secondary* : réponse subtile des structures architecturales (ouverture d'un vantail, alignement des paliers du Process, parallaxe des plans).
   - *Ambient* : dérive lente de la lumière naturelle / ombres portées et micro-respiration spatiale lorsque le visiteur ne scrolle pas (comportement **HYBRID** exigé au §5 du brief).
3. **Règle du 1/3** : jamais plus d'un tiers des éléments visibles en mouvement actif simultané, pour préserver le calme institutionnel et guider l'œil vers un point focal unique par scène.
4. **Pertinence de l'outil** : pas d'intégration forcée de fichiers `.lottie` ; **Three.js + GSAP ScrollTrigger + CSS/WAAPI** couvrent 100 % des besoins avec une cohérence spatiale supérieure et un poids JS maîtrisé.

---

## 4. Principe d'Architecture de Synchronisation Prévu (Anti-conflit de moteurs)

Pour répondre dès la fondation à l'exigence critique de la Section 7 (*« Évite que plusieurs moteurs contrôlent simultanément la même propriété sans architecture de synchronisation claire »*) :

```
[ Défilement Utilisateur (Lenis Desktop / Natif Mobile) ]
                        │
                        ▼
      [ GSAP ScrollTrigger Master Progress ]
    (Écrit uniquement dans un store mutable hors-state React :
     globalProgress, activeScene, sceneProgress, scrollVelocity)
                        │
        ┌───────────────┴────────────────┐
        ▼                                ▼
[ Monde WebGL Unique (<Canvas>) ]   [ Couche Éditoriale HTML ]
Hiérarchie de groupes séparés :     - Masques & révélations : GSAP / CSS
1. CameraRailGroup   ← Scroll seul  - Micro-interactions UI (<250ms) : CSS pur
2. CameraMouseGroup  ← Souris seule - Aucun conflit sur le même nœud DOM
3. CameraIdleNode    ← Temps seul (uTime / sin lent)
```

Chaque transformation possède **un propriétaire unique** : le scroll pilote le rail architectural, la souris pilote l'inclinaison secondaire amortie, et l'horloge temps réel pilote la respiration autonome et la course lente de la lumière. Résultat : **zéro saccade, zéro saut lors d'une inversion de scroll vers le haut, et arrêt propre en `prefers-reduced-motion`**.
