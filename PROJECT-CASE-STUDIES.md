# PROJECT-CASE-STUDIES.md — Études de Cas Complètes en 12 Points

Chaque étude de cas ci-dessous suit rigoureusement la grille éditoriale en **12 rubriques** et ne décrit que des fonctionnalités **vérifiées en ligne et/ou dans le code source réel**.

---

## 01 · SassySkin

1. **Nom du projet** : SassySkin
2. **Catégorie** : Plateforme e-commerce cosmétique & commande conversationnelle
3. **Présentation en une phrase** : Boutique en ligne de soins dermo-cosmétiques structurant un catalogue riche en 13 univers et 13 catégories, reliée à une finalisation de commande directe sur WhatsApp avec paiement à la livraison.
4. **Contexte** : Développé pour la marque ivoirienne SassySkin (*« Plus qu’un soin, une attention pour soi — Réparer • Nourrir • Sublimer »*) afin d’offrir à sa clientèle une expérience de découverte claire sur mobile comme sur ordinateur.
5. **Problématique ou besoin** : Permettre aux clientes de naviguer facilement dans une gamme étendue de soins visage et corps, de composer un panier chiffré en FCFA et de transmettre une commande complète sans friction bancaire, en respectant les habitudes locales de livraison et de paiement à la réception.
6. **Objectif** : Structurer le catalogue par besoins cutanés et types de produits, rassurer par la preuve sociale et des conseils d’application, puis convertir le panier en message de commande normalisé prêt à être traité sur WhatsApp.
7. **Ma contribution personnelle** : Architecture fonctionnelle et éditoriale de la boutique, développement front-end complet de l’application monopage, modélisation du panier et du formulaire de livraison, intégration WhatsApp et déploiement sur Cloudflare Pages.
8. **Solution conçue** : Application web monopage fluide à routage par ancre (`/#/boutique`, `/#/produit/...`, `/#/avis`, `/#/conseils`, `/#/apropos`) combinant recherche par filtres croisés, fiches produits détaillées, panier persistant et fenêtre de commande structurée.
9. **Fonctionnalités réellement développées** :
   - Double navigation catalogue à travers **13 univers de soin** (*Collagène, Papaye, Curcuma, Glow, Café & Savon noir, Rose, Argile, Nila, Lait, Matern’Éclat, Papaye & Collagène, Réparation, Hydratation & Soin de jour*) et **13 catégories produits** (*Gels douche, Laits corps, Soins visage, Huiles, Gommages, Lotions, Crèmes mains, Masques, Coffrets & duos, Gammes complètes, Routines visage, Savons visage, Crèmes corps*).
   - Affichage clair des prix en **FCFA** avec remises promotionnelles explicites (`−30 %`) et fiches produits dédiées.
   - Galerie de **9 témoignages clients illustrés** et rubrique éditoriale de **4 articles conseils** de routine beauté (`/#/conseil/a1` à `a4`).
   - Panier interactif et modale **« Finaliser la commande »** recueillant `Nom complet`, `Numéro joignable`, `Lieu de livraison`, `Quartier et repères` et `Précisions`.
   - Transmission directe du récapitulatif formaté vers **WhatsApp** (`wa.me/2250708591001`) avec modalité explicite de **paiement à la livraison**.
10. **Technologies utilisées** :
    - Application Web SPA (JavaScript / HTML5 / CSS3) — *vérifié*
    - Routage client & gestion d’état du panier — *vérifié*
    - Protocole de commande WhatsApp structuré — *vérifié*
    - Déploiement Edge Cloudflare Pages (`sassyskin.pages.dev`) — *vérifié*
11. **Résultat ou état actuel** : Application en production sur Cloudflare Pages, catalogue complet consultable et parcours de commande WhatsApp opérationnel.
12. **Démonstration & visuels réels** :
    - Lien en ligne : <https://sassyskin.pages.dev/>
    - Visuels authentiques intégrés : photographie éditoriale d’accueil (`media/img/mvmczbhpinc3ys.jpg`), visuel produit (`assets/img/prod-12.jpg`) et visuel de gamme (`assets/img/univers-collagene.jpg`).

---

## 02 · AE-ECS

1. **Nom du projet** : AE-ECS
2. **Catégorie** : Portail institutionnel, académique & associatif
3. **Présentation en une phrase** : Site officiel de l’Association des Élèves des Études Comptables Supérieures de l’INP-HB (fondée en 1984), valorisant la filière ECS, ses 7 clubs, ses activités phares et son réseau de plus de 500 alumni.
4. **Contexte** : Réalisé au sein de l’ESCAE (INP-HB Yamoussoukro) pour doter l’AE-ECS — *« Une Empreinte d’Expertise… »* — d’une vitrine institutionnelle crédible auprès des étudiants, des recruteurs, des cabinets d’audit et des partenaires.
5. **Problématique ou besoin** : Rassembler dans un espace web lisible et structuré l’histoire de l’association depuis 1984, l’architecture pédagogique du cursus réformé avec Paris Dauphine, la vie des clubs spécialisés et l’impact du réseau d’anciens élèves.
6. **Objectif** : Offrir une lecture institutionnelle claire aux cabinets partenaires et aux futurs étudiants tout en documentant fidèlement les initiatives académiques, citoyennes et professionnelles de la filière.
7. **Ma contribution personnelle** : Structuration de l’arborescence éditoriale multi-pages, conception de l’interface institutionnelle responsive, intégration des données vérifiées sur la filière, les clubs, les événements et les alumni, et déploiement sur Cloudflare Workers.
8. **Solution conçue** : Portail multi-pages rapide et sobre composé de 7 sections complémentaires (*Accueil, À propos, Filière ECS, Clubs, Activités, Alumni & Partenaires, Contact & Confidentialité*), conçu sans traceurs publicitaires.
9. **Fonctionnalités réellement développées** :
   - Présentation détaillée du **cursus ECS en 6 semestres** (`S1–S2` Tronc commun Master, `S3–S4` ECS, `S5` spécialisation CCA ou Audit Financier / Conseil / Compliance, `S6` stage de 6 mois & mémoire DSC-ECS) ainsi que de la salle des marchés **Bloomberg** inaugurée en novembre 2025.
   - Mise en valeur des repères clés de l’association : création en **1984**, plus de **35 %** des membres de l’OECCI issus de la filière, **500+ alumni actifs** et **6 mois** de stage de fin de cycle.
   - Pages dédiées aux **7 clubs** (*Études-Conseils, Relations Extérieures, Info-Promo, Culture & Loisirs, Junior Bourse Challenge, Corporate Branding, Junior Entreprise ECS*).
   - Chronique des **5 événements majeurs**, dont l’action sociale *Give Them Love* et ses collectes vérifiées (`3 003 200 FCFA` en 2023, `3 556 746 FCFA` en 2024 et `5 657 110 FCFA` en 2026).
   - Galerie de portraits d’alumni et partenaires institutionnels, politique de confidentialité stricte sans cookies tiers.
   - **Précision d’honnêteté fonctionnelle** : le formulaire de la page Contact est explicitement signalé comme **mode démonstration** (les prises de contact officielles s’effectuent via `contact@ae-ecs.ci` et le standard téléphonique affiché).
10. **Technologies utilisées** :
    - Architecture multi-pages HTML5 / CSS3 / JavaScript — *vérifié*
    - Déploiement Edge Cloudflare Workers (`aeecs.workers.dev`) — *vérifié*
    - Conception sobre zéro cookie publicitaire — *vérifié*
11. **Résultat ou état actuel** : Portail institutionnel en ligne sur Cloudflare Workers, lisible sur mobile et ordinateur.
12. **Démonstration & visuels réels** :
    - Lien en ligne : <https://aeecs-site.aeecs.workers.dev/>
    - Visuels authentiques intégrés : `img/ev/1783110138354.jpg`, `img/club-etudes-conseils.jpg` et `img/ev/1783110156084.jpg`.

---

## 03 · LAURA HOUSE

1. **Nom du projet** : LAURA HOUSE
2. **Catégorie** : Plateforme de billetterie événementielle & titres d’accès QR
3. **Présentation en une phrase** : Plateforme de réservation pour une soirée signature à Yamoussoukro, combinant collecte structurée des participants, validation humaine sur paiement Wave marchand et génération de billets PNG haute résolution à QR code unique.
4. **Contexte** : Réalisée pour l’événement *« LAURA HOUSE — Une nuit. Une signature. »* organisé au Royal Suite Millionaire à Yamoussoukro (samedi 28 novembre 2026, `22h–05h`, dress code *All Black*, tarif unitaire de `5 000 FCFA`).
5. **Problématique ou besoin** : Permettre la réservation en ligne et l’émission de billets nominatifs élégants munis de codes QR uniques tout en s’adaptant à un encaissement mobile réel via Wave, sans dépendre d’une API bancaire lourde ni risquer de faux billets.
6. **Objectif** : Offrir une vitrine nocturne sobre et qualitative, capter proprement l’identité de chaque participant et produire des cartes-billets téléchargeables nettes au contrôle d’accès, même pour les noms longs.
7. **Ma contribution personnelle** : Conception de l’expérience utilisateur et de la direction visuelle sombre, développement de l’application Vite et des fonctions serverless sur Vercel, création du générateur de billets PNG haute résolution avec QR code individuel et tests de tenue typographique.
8. **Solution conçue** : Application web événementielle articulant découverte de la soirée, sélection des places et saisie des participants, couplée à un circuit de validation maîtrisé par l’organisatrice avant remise des billets QR.
9. **Fonctionnalités réellement développées** :
   - Présentation éditoriale complète de la soirée (lieu, date, horaires `22h–05h`, dress code *All Black*, affiche officielle et tarif `5 000 FCFA`).
   - Sélection du nombre de billets et collecte structurée des informations de chaque participant.
   - Génération de cartes-billets visuelles exportables en **PNG haute définition** préservant l’unicité et la lisibilité du QR code.
   - Gestion typographique robuste des noms longs sur le billet afin d’éviter tout chevauchement graphique.
   - Mode démonstration explicite sur la vitrine publique (*« Mode démonstration — Aucun paiement n’a été effectué »*).
   - **Fonctionnement opérationnel réel du paiement et de la billetterie** : le règlement s’effectue via le **lien marchand Wave de la cliente**, suivi de l’**envoi d’une preuve de paiement** par l’acheteur, puis d’une **validation manuelle par la cliente**, qui transmet ensuite les billets munis de leurs **QR codes uniques** (ni le paiement ni l’envoi des billets ne sont automatisés).
10. **Technologies utilisées** :
    - Application Web Vite & TypeScript — *vérifié*
    - Fonctions Serverless Node.js (Vercel) — *vérifié*
    - Génération QR Unique & Export PNG HD — *vérifié*
    - Workflow Paiement Wave marchand + Validation Manuelle — *vérifié*
11. **Résultat ou état actuel** : Déployé sur Vercel (`laura-house.vercel.app`) avec mode démonstration public actif et générateur de cartes PNG QR opérationnel.
12. **Démonstration & visuels réels** :
    - Lien en ligne : <https://laura-house.vercel.app/>
    - Visuels authentiques intégrés : photographie officielle du cadre (`laura-restaurant.webp`) et affiche officielle (`laura-affiche-officielle.webp`).

---

## 04 · GYM OS SPORT

1. **Nom du projet** : GYM OS SPORT
2. **Catégorie** : Application web progressive (PWA) d’entraînement guidé
3. **Présentation en une phrase** : Application de musculation hors-ligne générant un programme personnalisé et illustrant l’exécution de 52 exercices grâce à un moteur biomécanique vectoriel animé 100 % codé en TypeScript.
4. **Contexte** : Projet personnel d’ingénierie front-end conçu pour offrir en salle un guide d’entraînement lisible, rapide et utilisable sans connexion réseau ni vidéos lourdes à charger (dépôt `loichermanna-art/sport-`, branche `arena/bee6d52a-sport`).
5. **Problématique ou besoin** : Accompagner un pratiquant pas à pas — du choix de son objectif jusqu’au suivi de ses séries et temps de repos — avec des démonstrations visuelles claires de chaque mouvement, tout en conservant une application légère (~100 Ko gzip) et autonome.
6. **Objectif** : Réunir dans une PWA installable la génération automatique d’un programme hebdomadaire, une bibliothèque pédagogique de mouvements animés et un carnet de séance interactif stocké localement sur l’appareil.
7. **Ma contribution personnelle** : Architecture complète de l’application en React 19 et TypeScript, conception du générateur de programmes (`buildProgram`), écriture du solveur géométrique de postures (cinématique inverse à 2 segments dans `pose.ts`) et du moteur de rendu SVG des 52 exercices (`render.ts`).
8. **Solution conçue** : Application structurée autour d’un onboarding en 3 étapes (*Objectif, Niveau, Profil*), d’un mode Séance épuré avec chronomètre de repos et d’une bibliothèque interactive mettant en évidence les groupes musculaires sollicités.
9. **Fonctionnalités réellement développées** :
   - Onboarding en **3 étapes** (*Sèche, Prise de masse ou Force · Niveau 1 à 3 · 3 à 6 séances/semaine*) générant automatiquement la semaine d’entraînement et permettant de la régénérer.
   - Moteur biomécanique **100 % code** (`pose.ts` & `render.ts`) animant **52 exercices en SVG** avec matériel dessiné (barre, haltères, banc, poulie) et mise en évidence lumineuse de **20 groupes musculaires**.
   - Contrôles pédagogiques sur chaque fiche exercice : lecture/pause, curseur temporel manuel, vitesses `0,5×` / `1×` / `1,75×`, exécution pas à pas, respiration et erreurs fréquentes.
   - Écran de Séance active sans distraction avec saisie séries/répétitions/charges, chronomètre de repos automatique et reprise après rechargement.
   - Suivi statistique local (volume, régularité, records personnels, poids du corps, export/import JSON) et fonctionnement hors-ligne complet via PWA (`Service Worker`).
10. **Technologies utilisées** :
    - React 19.2 & TypeScript 5.9 — *vérifié*
    - Vite 7.2 & PWA Hors-Ligne (Service Worker) — *vérifié*
    - Solveur Cinématique Inverse & SVG Procédural — *vérifié*
    - Déploiement Vercel (`gym-os-sport.vercel.app`) — *vérifié*
11. **Résultat ou état actuel** : En ligne sur Vercel et installable en PWA hors-ligne ; les 52 exercices sont validés géométriquement par script de contrôle automatisé (`scripts/verify-figures.ts`).
12. **Démonstration & visuels réels** :
    - Lien en ligne : <https://gym-os-sport.vercel.app/>
    - Code source : <https://github.com/loichermanna-art/sport->
    - Visuels authentiques intégrés : planches vectorielles `/projects/gym-os-biomechanics.svg` et `/projects/gym-os-library.svg` exportées directement par exécution du moteur `pose.ts` + `render.ts` de l’application.
