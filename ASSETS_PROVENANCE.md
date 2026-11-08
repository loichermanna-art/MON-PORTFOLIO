# ASSETS_PROVENANCE.md — Documentation des Modèles 3D, HDRI, Textures PBR, Polices & Médias

Conformément à la **Partie 5.4** du cahier des charges (*« Documenter la provenance, la licence et les conditions d’utilisation des assets. Éviter les modèles trop lourds et les textures inutilement gigantesques. »*), ce registre inventorie l’ensemble des ressources utilisées dans *The Infinite Library*.

---

## 1. Environnement Lumineux Haute Dynamique (HDRI / Global Illumination)

| Fichier | Taille | Provenance | Licence | Conditions d’utilisation & Rôle |
| :--- | :--- | :--- | :--- | :--- |
| `public/hdri/lebombo_1k.hdr` | `1,48 Mo` | **Poly Haven** (*Lebombo*, Greg Zaal) distribué via `pmndrs/drei-assets` | **CC0 1.0 Universal (Domaine Public)** | Libre d’usage commercial et personnel sans restriction. Auto-hébergé localement pour éliminer toute dépendance CDN externe ; chargé de manière asynchrone dans `<Suspense>` après le premier rendu afin de préserver un `LCP ≤ 2,5 s`. |

---

## 2. Modèles Architecturaux 3D glTF 2.0 Binaires (`.glb`)

Tous les modèles `.glb` ci-dessous sont compilés de manière déterministe dans le dépôt via `scripts/build-architectural-glb.mjs` (extrusions profilées `THREE.ExtrudeGeometry`, pièces tournées `THREE.LatheGeometry`, moulures chanfreinées, reliures courbes et dépliage UV triplanaire métrique) :

| Fichier `.glb` | Taille | Contenu architectural détaillé | Provenance & Licence |
| :--- | :--- | :--- | :--- |
| `public/models/monumental-door-leaf.glb` | `323,2 Ko` | Vantail monumental (`1,58 m × 4,58 m × 10,5 cm`) à montants moulurés en noyer fumé, panneaux à plates-bandes biseautées double-face, imposte vitrée à petits-bois en bronze patiné, paumelles lourdes, plaque de poussée et barre de tirage tournée de `1,44 m` en laiton brossé. | Création originale dédiée au dépôt (`MIT` / Propriété Loïc AKANDA). |
| `public/models/bookcase-bay.glb` | `47,2 Ko` | Travée de bibliothèque monumentale (`2,40 m × 4,20 m × 0,46 m`) avec plinthe à ressaut, pilastres cannelés à bases et chapiteaux, 7 tablettes à nez mouluré, entablement à corniche et rail d’échelle en laiton brossé. | Création originale dédiée au dépôt (`MIT` / Propriété Loïc AKANDA). |
| `public/models/architectural-sconce.glb` | `32,2 Ko` | Applique murale architecturale en bronze patiné sombre et diffuseur cylindrique en verre opalin chaud (`2900 K`). | Création originale dédiée au dépôt (`MIT` / Propriété Loïc AKANDA). |
| `public/models/curved-book-unit.glb` | `24,6 Ko` | Unité d’ouvrage relié à dos arrondi nervuré, plats débordants (chasses) et bloc de pages papier crème en retrait, instanciée via `THREE.InstancedMesh` pour garnir les rayonnages en **2 draw calls** seulement. | Création originale dédiée au dépôt (`MIT` / Propriété Loïc AKANDA). |

**Poids cumulé des modèles 3D `.glb` : `427,2 Ko`** (chargement quasi instantané, zéro géométrie primitive simpliste).

---

## 3. Textures Physiques PBR (`1024 × 1024`, Sans Couture / Seamless)

Chaque matériau dispose d’un triplet complet **Albedo (sRGB)** + **Normal Map tangentielle OpenGL (Linear)** + **Roughness Map (Linear)** optimisé en JPEG progressif *power-of-two* (`1024×1024`) :

| Jeu de textures (`public/textures/library/`) | Poids total (3 maps) | Matériau représenté | Provenance & Licence |
| :--- | :--- | :--- | :--- |
| `walnut-{albedo,normal,roughness}.jpg` | `329,0 Ko` | **Noyer d’Amérique fumé** (*Warm Smoked Walnut*) à fil cathédrale naturel et finition satinée mate | Généré et calibré pour le projet via pipeline PBR sans couture (`scripts/process-pbr-textures`) — Usage libre dédié au portfolio. |
| `limestone-{albedo,normal,roughness}.jpg` | `352,1 Ko` | **Pierre calcaire / Travertin adouci** monolithique (colonnes, encadrements de portail, emmarchements) | Généré et calibré pour le projet via pipeline PBR sans couture — Usage libre dédié au portfolio. |
| `limestone-ashlar-{albedo,normal,roughness}.jpg` | `382,0 Ko` | **Calepinage de pierre de taille à joints fins décalés** (sol du vestibule et murs d’appareil avec variation subtile par dalle) | Généré et calibré pour le projet via pipeline PBR sans couture — Usage libre dédié au portfolio. |
| `concrete-{albedo,normal,roughness}.jpg` | `174,5 Ko` | **Béton architectural lissé** à micro-pores minéraux (voûtes à caissons et refends structurels) | Généré et calibré pour le projet via pipeline PBR sans couture — Usage libre dédié au portfolio. |

**Poids cumulé des 12 textures PBR : `1,24 Mo`**.

---

## 4. Visuels Authentiques des Projets & Documents Officiels

| Ressource | Provenance vérifiée | Statut |
| :--- | :--- | :--- |
| `public/cv/CV-Loic-AKANDA.pdf` (`159 Ko`) | CV officiel fourni par Loïc AKANDA | Document original vérifié. |
| `public/projects/gym-os-biomechanics.svg` & `gym-os-library.svg` | Export direct des moteurs `src/avatar/pose.ts` & `src/avatar/render.ts` du dépôt `loichermanna-art/sport-` (`arena/bee6d52a-sport`) | Captures vectorielles 100 % authentiques du projet **GYM OS SPORT**. |
| Captures **SassySkin**, **AE-ECS**, **LAURA HOUSE** (`src/data/projectVisuals.ts`) | Médias officiels servis par les déploiements réels `sassyskin.pages.dev`, `aeecs-site.aeecs.workers.dev` et `laura-house.vercel.app` | Visuels 100 % authentiques (aucune fausse capture générée). |
| `public/scenes/library-entrance-fallback.jpg` | Visuel statique haute fidélité du vestibule pour le mode de repli sans WebGL (`WebGLFallback.tsx`) | Dédié au fallback d’accessibilité uniquement (jamais présenté comme capture d’un projet client). |

---

## 5. Typographies Auto-Hébergées (`@fontsource-variable`)

- **`@fontsource-variable/cormorant-garamond`** (*SIL Open Font License 1.1*) : Titres monumentaux gravés et frontons éditoriaux.
- **`@fontsource-variable/plus-jakarta-sans`** (*SIL Open Font License 1.1*) : Corps de texte éditorial et interface haute lisibilité.
- **`@fontsource-variable/geist-mono`** (*SIL Open Font License 1.1*) : Cotes d’archives, repères métriques et métadonnées tabulaires.
