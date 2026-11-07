# MOTION.md — Chorégraphie Caméra, Scroll & Interactions Spatiales

---

## 1. Architecture Motion sans Conflit (3 Étages Caméra)

Afin d’éliminer tout tremblement ou conflit entre le scroll et le curseur, le rig 3D (`ArchitecturalCameraRig.tsx`) sépare strictement trois transformations imbriquées :

1. **`CameraRailGroup`** : Suit les courbes spatiales `CatmullRomCurve3` (`positionCurve` et `targetCurve`) pilotées par `motionStore.scrollProgress` amorti (`THREE.MathUtils.damp`, $\lambda = 5.0$).
2. **`CameraPointerGroup`** : Applique une parallaxe subtile au curseur ($\pm 0.18\text{ m}$ horizontal, $\pm 0.10\text{ m}$ vertical, rotation douce $\pm 1.1^\circ$), désactivée sur mobile et en `prefers-reduced-motion`.
3. **`PerspectiveCamera`** (`FOV 38°` Desktop / `46°` Mobile) : Micro-respiration cinématographique quasi imperceptible donnant la sensation d’une optique réelle sur rail motorisé.

---

## 2. Couplage Spatial Premier Plan ↔ Monde 3D

- **Parallaxe et perspective couplées au scroll** : Le texte du Hero n’est pas figé à plat ; lors de l’avancée de la caméra vers l’oculus (`scrollProgress 0.00 → 0.16`), le bloc éditorial accompagne le franchissement du portique en léger recul perspectif pendant que la caméra s’engage vers les marches lumineuses.
- **Interactions diégétiques 3D** :
  - Survol et clic directs par raycasting sur la **stèle de verre architecturale du Hero** (`AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION`) : illumination des arêtes lumineuses `#76A9E8`, inflexion douce du regard caméra vers la stèle et navigation directe vers le pôle d’expertise correspondant.
  - Sélection spatiale des domaines (Scène 03), approche muséale des stèles projets (Scène 04) et verrouillage séquentiel des 6 étapes (Scène 05).
- **Interruption propre & Réversibilité** : Toutes les interpolations reposent sur des fonctions d’amortissement exponentiel sans état bloquant ; un défilement rapide haut ↔ bas reste 100 % fluide et réversible.

---

## 3. Courbes & Durées d’Interface

- **Apparitions typographiques par masques (`MaskReveal`)** : `720ms cubic-bezier(0.22, 1, 0.36, 1)` (`transform` + `opacity` uniquement).
- **Micro-interactions (hover / focus)** : `200ms cubic-bezier(0.23, 1, 0.32, 1)`.
- **Retour actif au clic** : `140ms`, `scale(0.975)`.
- **`prefers-reduced-motion: reduce`** : Désactive `Lenis`, fige la parallaxe curseur et remplace les travellings continus par des transitions sobres entre points de vue stables.
