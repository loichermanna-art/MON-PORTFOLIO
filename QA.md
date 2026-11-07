# QA.md — Protocole d’Assurance Qualité, Performance & Finitions

---

## 1. Contrôles Automatisés Exécutés à Chaque Étape

| Commande | Périmètre vérifié | Critère d’acceptation |
| :--- | :--- | :--- |
| `npm run typecheck` | Typage strict TypeScript (`tsc --noEmit`) sur React 19 & Three.js | `0` erreur |
| `npm run audit:contrast` | Ratios WCAG 2.2 de toutes les paires chromatiques *Midnight Blue* | `8 / 8` paires AA / AAA (`7.57:1` à `18.47:1`) |
| `npm run audit:qa` | Absence de requêtes CDN externes, `dispose()` GPU, rig caméra 3 niveaux, responsive & `prefers-reduced-motion` | `100 %` `[OK]` |
| `npm test` | Rendu sémantique H1 unique, navigation `01–06`, interactions projets/menu/contact, réversibilité du scroll, repli WebGL | `100 %` tests passants |
| `npm run build` | Compilation de production Vite 8 & séparation des chunks JS/CSS/WOFF2 | Build propre sans erreur |

---

## 2. Grille d’Inspection Qualitative (Exigences Non Négociables)

### Intégration 3D ↔ Interface
- [x] Le sol réfléchissant (`MeshReflectorMaterial`) capte réellement l’oculus lumineux, la silhouette humaine et la stèle de verre.
- [x] La stèle de verre droite (`AUDIT · FINANCE · DÉVELOPPEMENT · INNOVATION`) appartient physiquement à l’espace 3D, réagit au survol et redirige vers la section Expertise.
- [x] Les masses en béton sombre de gauche forment l’écrin naturel de la typographie blanche sans boîte artificielle superposée.

### Accessibilité, Responsive & Sobriété GPU
- [x] Résolution du réflecteur planaire adaptée au viewport (désactivée au profit d’une dalle PBR polie légère sur mobile `< 768px` et en mode `prefers-reduced-motion`).
- [x] Libération intégrale (`dispose()`) des géométries, matériaux et `CanvasTexture` procédurales au démontage.
- [x] Repli architectural SVG *Midnight Blue* immédiat lorsque WebGL est indisponible.
