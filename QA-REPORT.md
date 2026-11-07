# QA-REPORT.md — Rapport d’Assurance Qualité Éditoriale, Visuelle & Technique

Date d’audit : **Novembre 2026**  
Branche vérifiée : `arena/e825c7df-mon-portfolio`

---

## 1. Vérification Éditoriale & Exactitude Factuelle

| Critère | Statut | Preuve / Détail |
| :--- | :--- | :--- |
| Identité & positionnement exacts | **PASS** | `Loïc AKANDA` (*AKANDA Assi Loïc*), 3e année du cycle ingénieur en Finance à l’INP-HB (ESCAE), intérêt audit/comptabilité/analyse financière + solutions numériques. |
| Exactitude des diplômes & dates | **PASS** | Bac G2 (`2020–2021`) → DTS Finance Comptabilité option Contrôle de Gestion INP-HB (`2021–2024`) → Cycle Ingénieur ECS INP-HB (`2024–Présent`, 3e année). |
| Exactitude des stages (aucune inversion ni invention) | **PASS** | **DRONE GROUPE CI** (`Avr–Juin 2024`, 3 mois : tableau de bord budgétaire, collecte/traitement de données financières, analyse d’écarts) & **IACG** (`Juil–Août 2023`, 2 mois : saisie Sage 100, rapprochements bancaires, livres de paie, assistance mission tenue comptable). |
| Absence de jauges `%` arbitraires | **PASS** | Test automatisé `not.toMatch(/\b\d{1,3}\s*%/)` validé sur `#expertise` ; séparation explicite en 4 registres sur chacun des 5 domaines. |
| Workflow réel de **LAURA HOUSE** respecté | **PASS** | Mention explicite du règlement via le **lien marchand Wave de la cliente**, de l’**envoi d’une preuve de paiement** et de la **validation manuelle par la cliente** avant envoi des billets QR uniques. |
| Vérification par le code de **GYM OS SPORT** | **PASS** | Fonctionnalités décrites d’après `loichermanna-art/sport-` (`arena/bee6d52a-sport` : React 19.2, TypeScript, PWA hors-ligne, 52 exercices SVG par cinématique inverse). |
| Honnêteté sur **AE-ECS** & **SassySkin** | **PASS** | Mention transparente du formulaire Contact en mode démonstration sur `AE-ECS` ; commande WhatsApp + paiement à la livraison documentés sur `SassySkin`. |
| Coordonnées & CV réels renseignés | **PASS** | `loichermanna@gmail.com`, `linkedin.com/in/loic-akanda-assi`, `github.com/loichermanna-art`, `+225 05 01 60 44 73 / 07 67 04 55 86` et `/cv/CV-Loic-AKANDA.pdf` (aucun placeholder *« À renseigner »* restant). |

---

## 2. Audit Mathématique des Contrastes WCAG 2.2 (`node scripts/verify-contrast.mjs`)

| Couple Couleur Texte / Fond | Ratio mesuré | Niveau WCAG 2.2 | Statut |
| :--- | :--- | :--- | :--- |
| Titres Blanc Pur (`#FFFFFF`) sur Midnight Blue (`#071426`) | **18.47 : 1** | **AAA** | **PASS** |
| Texte Éditorial (`#E8EDF5`) sur Midnight Blue (`#071426`) | **15.71 : 1** | **AAA** | **PASS** |
| CTA Primaire (`#071426`) sur Blanc Froid (`#E8EDF5`) | **15.71 : 1** | **AAA** | **PASS** |
| Texte Éditorial (`#E8EDF5`) sur Volume Architectural (`#102747`) | **12.73 : 1** | **AAA** | **PASS** |
| Corps Secondaire (`#CBD8EA`) sur Volume Architectural (`#102747`) | **10.37 : 1** | **AAA** | **PASS** |
| Métadonnées (`#A9BCD6`) sur Midnight Blue (`#071426`) | **9.54 : 1** | **AAA** | **PASS** |
| Accent Lumineux (`#76A9E8`) sur Midnight Blue (`#071426`) | **7.57 : 1** | **AAA** | **PASS** |
| Accent Lumineux (`#76A9E8`) sur Volume Architectural (`#102747`) | **6.14 : 1** | **AA / AAA-Large** | **PASS** |

---

## 3. Contrôles Techniques, Accessibilité & Responsive

- **Compilation TypeScript (`npx tsc --noEmit` & `tsc -b`)** : **0 erreur**.
- **Suite de tests automatisés (`npm test -- --run`)** : **6/6 cycles réussis** (Hero & CV, couplage Hero ↔ Compétences, Parcours & 0 % jauges, 4 Projets & modale 12 points avec focus trap + touche `Escape`, 6 étapes Méthode + Contact réel + `prefers-reduced-motion`, synchronisation bidirectionnelle `motionStore` ↔ UI + visuels réels).
- **Build de production (`npm run build`)** : **Succès en 1,19 s** (`dist/index.html`, CSS `7.60 kB` gzip, bundle applicatif `98.80 kB` gzip + vendor 3D séparé).
- **Navigation clavier & Lecteurs d’écran** :
  - Lien d’évitement `Aller au contenu principal` en premier élément focusable.
  - Rôles ARIA complets (`tablist` / `tab` / `tabpanel` sur Parcours, Compétences et Méthode ; `dialog` modal avec piège de focus et restauration du focus sur les études de cas).
  - Mode `prefers-reduced-motion` automatique + interrupteur manuel accessible dans le menu.
  - Fallback SVG architectural Midnight Blue (`WebGLFallback.tsx`) actif dès que WebGL est indisponible.
- **Adaptation Mobile & Tablette** :
  - Grilles fluides repliées proprement sous `1100px` et `768px` (pavillons projets empilés verticalement sans perte de hiérarchie, rail latéral remplacé par le tiroir de navigation mobile, cibles tactiles confortables).
