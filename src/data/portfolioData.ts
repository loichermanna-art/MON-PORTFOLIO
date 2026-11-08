export type VerificationStatus = 'vérifié' | 'en mode démonstration' | 'à compléter';

export interface TimelineMilestone {
  id: string;
  order: string;
  period: string;
  category: 'Académique' | 'Stage professionnel' | 'Engagement associatif';
  title: string;
  organization: string;
  summary: string;
  details: string[];
  toolsOrContext?: string[];
}

export interface ProfessionalInternship {
  id: 'iacg' | 'drone-groupe-ci';
  organization: string;
  organizationType: string;
  period: string;
  duration: string;
  role: string;
  missions: string[];
  toolsUsed: string[];
  learnings: string[];
}

export interface ExpertiseDomainItem {
  id: string;
  index: string;
  steleCode: 'FINANCE' | 'AUDIT' | 'OUTILS' | 'NUMÉRIQUE' | 'PROJETS';
  title: string;
  shortSubtitle: string;
  summary: string;
  academicKnowledge: string[];
  practicalSkills: string[];
  toolsUsed: Array<{ name: string; usageLevel: string }>;
  areasOfInterest: string[];
}

export interface ProjectVisualAsset {
  src: string;
  alt: string;
  caption: string;
  sourceLabel: string;
}

export interface ProjectCaseStudy {
  id: 'sassyskin' | 'ae-ecs' | 'laura-house' | 'gym-os-sport';
  index: string;
  pavilionCode: string;
  alignment: 'left' | 'right';
  /** 1. Nom du projet */
  name: string;
  /** 2. Catégorie */
  category: string;
  /** 3. Présentation en une phrase */
  oneLinePitch: string;
  /** 4. Contexte */
  context: string;
  /** 5. Problématique ou besoin */
  problem: string;
  /** 6. Objectif */
  objective: string;
  /** 7. Ma contribution personnelle */
  personalContribution: string;
  /** 8. Solution conçue */
  solution: string;
  /** 9. Fonctionnalités réellement développées */
  verifiedFeatures: string[];
  operationalNote?: string;
  /** 10. Technologies utilisées */
  technologies: Array<{ label: string; status: VerificationStatus }>;
  /** 11. Résultat ou état actuel */
  currentState: string;
  /** 12. Démonstration du projet */
  liveUrl: string;
  liveUrlLabel: string;
  repoUrl?: string;
  repoLabel?: string;
  visuals: ProjectVisualAsset[];
}

export interface ProcessMethodStep {
  step: string;
  title: string;
  objective: string;
  actions: string[];
  decisions: string[];
  deliverable: string;
  realExample: {
    projectOrContext: string;
    illustration: string;
  };
}

export const NAV_SCENES = [
  { index: 0, num: '01', id: 'hero', label: 'Identité', zone: 'L’Oculus d’Ouverture' },
  { index: 1, num: '02', id: 'about', label: 'Parcours', zone: 'La Passerelle Chronologique' },
  { index: 2, num: '03', id: 'expertise', label: 'Compétences', zone: 'Les Cinq Monolithes' },
  { index: 3, num: '04', id: 'projects', label: 'Réalisations', zone: 'Les Quatre Pavillons' },
  { index: 4, num: '05', id: 'process', label: 'Méthode', zone: 'Les Six Portiques' },
  { index: 5, num: '06', id: 'contact', label: 'Contact', zone: 'Le Belvédère Ouvert' },
] as const;

export const PROFILE_IDENTITY = {
  firstName: 'Loïc',
  lastName: 'AKANDA',
  fullCivilName: 'AKANDA Assi Loïc',
  fullName: 'Loïc AKANDA',
  monogram: 'LA.',
  portfolioEdition: 'PORTFOLIO · CÔTE D’IVOIRE',
  positioning:
    'Étudiant en 3e année du cycle ingénieur en Finance à l’INP-HB — Audit, Comptabilité & Solutions numériques',
  heroSummary:
    'Formé à la comptabilité financière, au contrôle de gestion et à l’analyse financière à l’INP-HB, je conçois en parallèle des applications web structurées qui répondent à des besoins concrets.',
  heroPrimaryCta: 'Découvrir mes 4 réalisations',
  heroSecondaryCta: 'Télécharger le CV (PDF)',
  cvUrl: '/cv/CV-Loic-AKANDA.pdf',
  cvDownloadName: 'CV-Loic-AKANDA.pdf',
  academicTitle: 'Élève-ingénieur en Finance — Études Comptables Supérieures (ECS)',
  institution: 'INP-HB · ESCAE — Côte d’Ivoire',
  languages: [
    { language: 'Français', level: 'Courant' },
    { language: 'Anglais', level: 'Niveau B1 (en perfectionnement actif)' },
  ],
  about: {
    heading: 'Un parcours construit autour de la rigueur du chiffre et de l’action concrète.',
    personalPresentation:
      'Titulaire d’un diplôme de technicien supérieur en Finance-Comptabilité (option Contrôle de Gestion) et aujourd’hui étudiant en troisième année du cycle ingénieur en Études Comptables Supérieures (ECS) à l’INP-HB, j’aborde chaque sujet avec une même exigence : comprendre les flux réels, vérifier la cohérence des données et produire des outils fiables.',
    personalBridge:
      'Mon engagement au sein de la Commission Informatique de l’AE-FC puis à la présidence du Club Études-Conseils de l’AE-ECS prolonge naturellement cette double culture : allier la discipline de l’audit et de la comptabilité à la conception de solutions numériques directement exploitables.',
    professionalOrientationTitle: 'Cap professionnel : Audit financier, Analyse financière, Comptabilité & Conseil',
    professionalOrientationText:
      'Je souhaite orienter mon début de carrière vers les métiers de l’audit financier, de l’analyse financière, de la comptabilité approfondie et du conseil. Fort de mon socle académique à l’INP-HB et de deux premiers stages en cabinet d’expertise comptable (IACG) et en entreprise (Drone Groupe CI), je recherche des environnements exigeants où consolider ma pratique du terrain.',
    qualities: [
      'Rigueur méthodologique',
      'Rapidité d’exécution',
      'Esprit d’équipe',
      'Assimilation rapide',
      'Esprit d’initiative & d’innovation',
    ],
  },
  contacts: {
    heading: 'Échangeons autour d’une opportunité en audit, finance ou projet numérique.',
    lead: 'Disponible pour échanger au sujet d’un stage de fin d’études, d’une collaboration professionnelle ou d’une réalisation digitale.',
    email: 'loichermanna@gmail.com',
    phonePrimary: '+225 05 01 60 44 73',
    phoneSecondary: '+225 07 67 04 55 86',
    linkedinUrl: 'https://www.linkedin.com/in/loic-akanda-assi',
    linkedinLabel: 'linkedin.com/in/loic-akanda-assi',
    githubUrl: 'https://github.com/loichermanna-art',
    githubHandle: 'github.com/loichermanna-art',
    location: 'Côte d’Ivoire · INP-HB (Yamoussoukro / Abidjan)',
  },
} as const;

export const HERO_ARCHITECTURAL_DOMAINS = [
  { id: 'finance-comptabilite', label: 'FINANCE & COMPTABILITÉ', targetDomainIndex: 0 },
  { id: 'audit-analyse', label: 'AUDIT & ANALYSE', targetDomainIndex: 1 },
  { id: 'developpement-numerique', label: 'SOLUTIONS NUMÉRIQUES', targetDomainIndex: 3 },
  { id: 'gestion-projets', label: 'CONDUITE DE PROJETS', targetDomainIndex: 4 },
] as const;

/**
 * SCÈNE 02 — LIGNE TEMPORELLE SPATIALE (6 jalons chronologiques vérifiés sur le CV et le cursus)
 */
export const SPATIAL_TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'bac-g2',
    order: '01',
    period: '2020 – 2021',
    category: 'Académique',
    title: 'Baccalauréat Série G2',
    organization: 'Enseignement secondaire technique — Côte d’Ivoire',
    summary:
      'Acquisition des premiers fondamentaux en comptabilité, mathématiques financières et techniques quantitatives de gestion.',
    details: [
      'Initiation structurée à la logique comptable et à la lecture chiffrée des organisations.',
      'Socle déterminant ayant orienté la poursuite d’études supérieures vers la filière Finance-Comptabilité de l’INP-HB.',
    ],
  },
  {
    id: 'dts-fc-inphb',
    order: '02',
    period: '2021 – 2024',
    category: 'Académique',
    title: 'Diplôme de Technicien Supérieur — Finance Comptabilité (Option Contrôle de Gestion)',
    organization: 'INP-HB — Institut National Polytechnique Félix Houphouët-Boigny',
    summary:
      'Formation supérieure intensive en comptabilité financière, comptabilité analytique, fiscalité et contrôle de gestion (diplômé en 2023–2024).',
    details: [
      'Maîtrise des mécanismes de tenue comptable, d’analyse des coûts et de suivi budgétaire.',
      'Membre actif de la Commission Informatique de l’AE-FC (2021–2025) et joueur au club de basket de l’école.',
    ],
    toolsOrContext: ['Comptabilité financière & analytique', 'Contrôle de gestion', 'Commission Informatique AE-FC'],
  },
  {
    id: 'stage-iacg',
    order: '03',
    period: 'Juillet – Août 2023 (2 mois)',
    category: 'Stage professionnel',
    title: 'Stagiaire au département Expertise-Comptable',
    organization: 'IACG — Cabinet d’expertise comptable et de conseil',
    summary:
      'Première immersion en cabinet sur des dossiers clients réels : saisie comptable, rapprochements bancaires, livres de paie et tenue comptable.',
    details: [
      'Enregistrement des pièces justificatives dans le logiciel de comptabilité Sage 100 / Sage SAARI.',
      'Établissement de rapprochements bancaires et préparation de livres de paie.',
      'Assistance directe lors d’une mission de tenue comptable pour une entreprise cliente.',
    ],
    toolsOrContext: ['Sage 100 / SAARI Comptabilité', 'Sage Paie RH', 'Rapprochements bancaires'],
  },
  {
    id: 'stage-drone-groupe',
    order: '04',
    period: 'Avril – Juin 2024 (3 mois)',
    category: 'Stage professionnel',
    title: 'Stagiaire au département Comptabilité et Finance',
    organization: 'DRONE GROUPE CI',
    summary:
      'Stage de fin de cycle technicien supérieur centré sur le pilotage budgétaire de projet, le traitement de données financières et l’analyse d’écarts.',
    details: [
      'Mise en place d’un tableau de bord opérationnel pour le suivi du budget d’un projet.',
      'Collecte, fiabilisation et traitement structuré de données financières.',
      'Analyse et interprétation des écarts budgétaires au service du suivi financier.',
    ],
    toolsOrContext: ['Tableaux de bord Excel', 'Suivi budgétaire', 'Analyse d’écarts'],
  },
  {
    id: 'cycle-ingenieur-ecs',
    order: '05',
    period: '2024 – Présent',
    category: 'Académique',
    title: 'Cycle Ingénieur — Études Comptables Supérieures (3e année en cours)',
    organization: 'ESCAE · INP-HB — Yamoussoukro, Côte d’Ivoire',
    summary:
      'Poursuite en cycle ingénieur au sein de la filière Études Comptables Supérieures (ECS) : audit, analyse financière, comptabilité approfondie, droit et conseil.',
    details: [
      'Progression du tronc commun Master (1re année) vers la 2e année ECS (2025–2026) puis la 3e année du cycle ingénieur en finance.',
      'Conception parallèle de quatre réalisations numériques déployées en ligne (SassySkin, AE-ECS, LAURA HOUSE, GYM OS SPORT).',
    ],
    toolsOrContext: ['Audit & Contrôle', 'Analyse financière', 'Études Comptables Supérieures'],
  },
  {
    id: 'presidence-etudes-conseils',
    order: '06',
    period: 'Depuis Novembre 2025',
    category: 'Engagement associatif',
    title: 'Président du Club Études-Conseils de l’AE-ECS',
    organization: 'Association des Élèves des Études Comptables Supérieures (AE-ECS · INP-HB)',
    summary:
      'Coordination pédagogique et méthodologique du club incubateur de la filière ECS, dédié à la rigueur analytique, à l’intégration et à la préparation professionnelle.',
    details: [
      'Encadrement des travaux de formation, d’argumentation économique et de structuration méthodologique des membres.',
      'Implication directe dans le rayonnement numérique et institutionnel de la communauté AE-ECS.',
    ],
    toolsOrContext: ['Leadership étudiant', 'Rigueur & pédagogie', 'AE-ECS'],
  },
];

export const PROFESSIONAL_INTERNSHIPS: ProfessionalInternship[] = [
  {
    id: 'drone-groupe-ci',
    organization: 'DRONE GROUPE CI',
    organizationType: 'Entreprise — Département Comptabilité et Finance',
    period: 'Avril 2024 – Juin 2024',
    duration: '3 mois',
    role: 'Stagiaire Comptabilité et Finance',
    missions: [
      'Mise en place d’un tableau de bord pour le suivi du budget d’un projet.',
      'Collecte et traitement méthodique de données financières.',
      'Analyse et interprétation d’écarts entre prévisions et réalisations.',
    ],
    toolsUsed: ['Microsoft Excel (modélisation & tableaux de bord)', 'Pack Office'],
    learnings: [
      'Structurer un outil de suivi budgétaire lisible et directement exploitable.',
      'Relier les écarts chiffrés aux réalités opérationnelles d’un projet.',
    ],
  },
  {
    id: 'iacg',
    organization: 'IACG',
    organizationType: 'Cabinet d’expertise comptable et de conseil',
    period: 'Juillet 2023 – Août 2023',
    duration: '2 mois',
    role: 'Stagiaire au département Expertise-Comptable',
    missions: [
      'Enregistrement des pièces justificatives dans le logiciel de comptabilité Sage 100 / Sage SAARI.',
      'Établissement de rapprochements bancaires et de livres de paie.',
      'Assistance lors d’une mission de tenue comptable d’une entreprise cliente.',
    ],
    toolsUsed: ['Sage 100 / Sage SAARI Comptabilité', 'Sage Paie RH', 'Microsoft Excel'],
    learnings: [
      'Vérifier la conformité et la traçabilité des pièces avant toute imputation comptable.',
      'Comprendre la rigueur quotidienne des travaux de tenue et de révision en cabinet.',
    ],
  },
];

/**
 * SCÈNE 03 — LES 5 DOMAINES DE COMPÉTENCES (Séparation stricte Académique / Pratique / Outils / Intérêts)
 */
export const EXPERTISE_DOMAINS: ExpertiseDomainItem[] = [
  {
    id: 'finance-comptabilite',
    index: '01',
    steleCode: 'FINANCE',
    title: 'Finance et comptabilité',
    shortSubtitle: 'Comptabilité financière, analytique & suivi budgétaire',
    summary:
      'Socle principal construit du Baccalauréat G2 jusqu’au cycle ingénieur ECS à l’INP-HB et mis en pratique lors de deux stages en cabinet et en entreprise.',
    academicKnowledge: [
      'Comptabilité financière approfondie et cohérence des états de synthèse (SYSCOHADA)',
      'Comptabilité analytique, calcul des coûts et contrôle de gestion (option du DTS à l’INP-HB)',
      'Lecture des équilibres financiers et de la structure de trésorerie',
    ],
    practicalSkills: [
      'Imputation et enregistrement de pièces justificatives sur dossier client (stage IACG)',
      'Établissement de rapprochements bancaires et préparation de livres de paie (stage IACG)',
      'Conception d’un tableau de bord de suivi budgétaire de projet (stage Drone Groupe CI)',
    ],
    toolsUsed: [
      { name: 'Microsoft Excel', usageLevel: 'Maîtrise opérationnelle (tableaux de bord, suivi budgétaire)' },
      { name: 'Sage 100 / SAARI Comptabilité', usageLevel: 'Bonne base pratique (utilisé en stage chez IACG)' },
    ],
    areasOfInterest: [
      'Ingénierie financière d’entreprise',
      'Pilotage de la performance et reporting financier',
    ],
  },
  {
    id: 'audit-analyse',
    index: '02',
    steleCode: 'AUDIT',
    title: 'Audit et analyse financière',
    shortSubtitle: 'Vérification méthodique, analyse d’écarts & diagnostic',
    summary:
      'Orientation professionnelle centrale : vérifier la fiabilité de l’information comptable, comprendre l’origine des écarts et éclairer la prise de décision.',
    academicKnowledge: [
      'Démarche méthodique de contrôle, de vérification et d’analyse des risques (cursus ECS — INP-HB)',
      'Analyse financière : étude de l’activité, de la profitabilité et de la solvabilité',
      'Principes de contrôle interne et de traçabilité documentaire',
    ],
    practicalSkills: [
      'Collecte, recoupement et traitement de données financières (stage Drone Groupe CI)',
      'Analyse et interprétation d’écarts budgétaires sur projet réel',
      'Contrôle de concordance entre relevés bancaires et écritures comptables (stage IACG)',
    ],
    toolsUsed: [
      { name: 'Excel (analyse & recoupements)', usageLevel: 'Pratique régulière en stage et travaux académiques' },
      { name: 'États financiers & balances', usageLevel: 'Lecture et vérification académique & stage' },
    ],
    areasOfInterest: [
      'Audit financier et commissariat aux comptes en cabinet',
      'Transaction services, conformité et conseil financier',
    ],
  },
  {
    id: 'outils-logiciels',
    index: '03',
    steleCode: 'OUTILS',
    title: 'Outils et logiciels',
    shortSubtitle: 'Suite bureautique, logiciels comptables Sage & écosystème web',
    summary:
      'Usage différencié et honnête des logiciels métiers de la comptabilité et des outils contemporains de production numérique, sans nivellement artificiel.',
    academicKnowledge: [
      'Structuration de classeurs financiers, formules d’analyse et présentations synthétiques',
      'Logique des progiciels comptables et de gestion de la paie',
    ],
    practicalSkills: [
      'Tenue et saisie comptable sur logiciel métier lors du stage en cabinet',
      'Gestion du code source, déploiement continu et hébergement d’applications web',
    ],
    toolsUsed: [
      { name: 'Pack Office (Excel, Word, PowerPoint)', usageLevel: 'Maîtrise courante (CV & stages)' },
      { name: 'Sage SAARI Comptabilité / Sage 100', usageLevel: 'Bonne base — pratiqué en stage chez IACG' },
      { name: 'Sage Paie RH (i7)', usageLevel: 'Bonne base — formation et préparation de livres de paie' },
      { name: 'GitHub, Vercel & Cloudflare', usageLevel: 'Utilisés concrètement pour héberger mes 4 projets' },
    ],
    areasOfInterest: [
      'Automatisation des contrôles comptables et outils BI / Data financière',
      'Approfondissement des environnements ERP et terminaux financiers',
    ],
  },
  {
    id: 'developpement-numerique',
    index: '04',
    steleCode: 'NUMÉRIQUE',
    title: 'Développement numérique',
    shortSubtitle: 'Applications web modernes, interfaces sobres & outils métiers',
    summary:
      'Compétence complémentaire développée par la pratique : transformer un besoin concret (commerce, association, billetterie, sport) en application web fonctionnelle.',
    academicKnowledge: [
      'Logique algorithmique, structuration modulaire des données et typage statique',
      'Principes d’accessibilité web, d’ergonomie mobile-first et de performance réseau',
    ],
    practicalSkills: [
      'Développement d’interfaces web réactives et d’applications PWA hors-ligne (GYM OS SPORT)',
      'Création de parcours e-commerce orientés WhatsApp & paiement à la livraison (SassySkin)',
      'Génération de cartes-billets PNG haute définition à QR code unique (LAURA HOUSE)',
      'Conception de portails institutionnels multi-rubriques rapides (AE-ECS)',
    ],
    toolsUsed: [
      { name: 'React & TypeScript', usageLevel: 'Pratique concrète sur projets déployés' },
      { name: 'Vite, HTML5 & CSS3 moderne', usageLevel: 'Pratique concrète sur projets déployés' },
      { name: 'Fonctions Node.js Serverless & PWA', usageLevel: 'Mises en œuvre selon les besoins projet' },
    ],
    areasOfInterest: [
      'Outils numériques dédiés à la gestion financière, à la facturation et au pilotage PME',
      'Interfaces web interactives alliant clarté éditoriale et fluidité',
    ],
  },
  {
    id: 'gestion-projets',
    index: '05',
    steleCode: 'PROJETS',
    title: 'Gestion et conduite de projets',
    shortSubtitle: 'Cadrage du besoin, coordination associative & livraison réelle',
    summary:
      'Capacité à organiser le travail collectif, clarifier les priorités et adapter une solution aux contraintes réelles du terrain plutôt qu’à la théorie seule.',
    academicKnowledge: [
      'Cadrage d’objectifs, découpage par étapes, suivi des délais et contrôle budgétaire',
      'Organisation du travail en équipe et restitution structurée',
    ],
    practicalSkills: [
      'Présidence du Club Études-Conseils de l’AE-ECS (depuis novembre 2025) : coordination et animation',
      'Participation à la Commission Informatique de l’AE-FC de l’INP-HB (2021–2025)',
      'Adaptation des parcours numériques aux usages locaux réels (validation Wave manuelle, commande WhatsApp)',
    ],
    toolsUsed: [
      { name: 'Tableaux de suivi & documentation structurée', usageLevel: 'Pratique régulière associative et projet' },
      { name: 'GitHub (suivi des versions & livrables)', usageLevel: 'Utilisé sur chaque réalisation web' },
    ],
    areasOfInterest: [
      'Conduite de missions d’audit et d’accompagnement organisationnel',
      'Structuration digitale des associations et entreprises en Côte d’Ivoire',
    ],
  },
];

/**
 * SCÈNE 04 — LES 4 ÉTUDES DE CAS RÉELLES (Structure stricte en 12 points + Visuels authentiques)
 */
export const SELECTED_PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'sassyskin',
    index: '01',
    pavilionCode: 'PAVILLON 01 · COMMERCE NUMÉRIQUE',
    alignment: 'left',
    name: 'SassySkin',
    category: 'Commerce numérique — Soins dermo-cosmétiques & beauté',
    oneLinePitch:
      'Boutique en ligne structurant un large catalogue de soins naturels autour d’une navigation par univers et d’une finalisation de commande directe via WhatsApp avec paiement à la livraison.',
    context:
      'Projet e-commerce conçu pour la marque de soins Sassy Skin (« Plus qu’un soin, une attention pour soi — Réparer • Nourrir • Sublimer »), active en Côte d’Ivoire et à l’international.',
    problem:
      'Présenter de manière claire et désirable des dizaines de références de soins tout en proposant un parcours de commande adapté aux habitudes locales d’achat (paiement à la réception et échange direct sur WhatsApp).',
    objective:
      'Guider chaque cliente vers la routine adaptée à son besoin cutané (éclat, réparation, hydratation, maternité) et convertir le panier en commande structurée prête à être traitée pour la livraison.',
    personalContribution:
      'Conception de l’architecture du catalogue, du design d’interface responsive, du système de filtrage multi-entrées, du panier et du flux de commande vers WhatsApp, jusqu’au déploiement sur Cloudflare Pages.',
    solution:
      'Application web monopage rapide organisant l’offre selon une double taxonomie (13 univers d’actifs et 13 catégories de produits), enrichie de témoignages clients en images et de guides de routines skincare.',
    verifiedFeatures: [
      'Exploration du catalogue par 13 univers (Collagène, Papaye, Curcuma, Glow, Café & Savon noir, Nila, Matern’Éclat…) et 13 catégories (Gels douche, Laits, Huiles, Coffrets, Routines visage…)',
      'Fiches produits détaillées avec contenances, bénéfices ciblés, tarifs en FCFA et remises affichées',
      'Panier interactif et fenêtre « Finaliser la commande » collectant nom complet, numéro joignable, lieu de livraison, quartier/repères et précisions',
      'Transmission formatée de la commande vers WhatsApp pour confirmation et paiement à la livraison (« Vous payez à la réception »)',
      'Galerie de 9 témoignages clients en photos (#/avis) et espace éditorial de 4 articles conseils skincare (#/conseils)',
    ],
    technologies: [
      { label: 'Application Web SPA (Hash Routing)', status: 'vérifié' },
      { label: 'Interface Responsive Mobile-First', status: 'vérifié' },
      { label: 'Intégration Commande WhatsApp', status: 'vérifié' },
      { label: 'Cloudflare Pages (sassyskin.pages.dev)', status: 'vérifié' },
    ],
    currentState:
      'En ligne et opérationnel sur Cloudflare Pages avec catalogue complet en FCFA, conseils éditoriaux et tunnel de commande WhatsApp actif.',
    liveUrl: 'https://sassyskin.pages.dev/',
    liveUrlLabel: 'sassyskin.pages.dev',
    visuals: [
      {
        src: 'https://sassyskin.pages.dev/media/img/mvmczbhpinc3ys.jpg',
        alt: 'Gamme officielle des soins Sassy Skin présentée en page d’accueil du site',
        caption: 'Visuel principal de la collection Sassy Skin sur la boutique en ligne.',
        sourceLabel: 'sassyskin.pages.dev',
      },
      {
        src: 'https://sassyskin.pages.dev/assets/img/prod-12.jpg',
        alt: 'Coffret Duo Réparateur Sassy Skin (Lait 250 ml et Huile 100 ml)',
        caption: 'Fiche produit réelle : Duo Réparateur (22 400 FCFA) issu du catalogue.',
        sourceLabel: 'Catalogue SassySkin',
      },
      {
        src: 'https://sassyskin.pages.dev/assets/img/univers-collagene.jpg',
        alt: 'Entrée thématique Univers Collagène du catalogue Sassy Skin',
        caption: 'Navigation par actifs : l’un des 13 univers thématiques de la boutique.',
        sourceLabel: 'Univers SassySkin',
      },
    ],
  },
  {
    id: 'ae-ecs',
    index: '02',
    pavilionCode: 'PAVILLON 02 · PORTAIL INSTITUTIONNEL & ASSOCIATIF',
    alignment: 'right',
    name: 'AE-ECS',
    category: 'Portail institutionnel & associatif — Filière Études Comptables Supérieures (INP-HB)',
    oneLinePitch:
      'Site officiel de l’Association des Élèves des Études Comptables Supérieures de l’INP-HB, fédérant la présentation du cursus, les 7 clubs, les temps forts annuels et le réseau de plus de 500 diplômés.',
    context:
      'Créée en 1984 au sein de l’ESCAE (INP-HB Yamoussoukro), la filière ECS forme plus de 35 % des membres de l’Ordre des Experts-Comptables de Côte d’Ivoire (OECCI). En tant qu’élève-ingénieur ECS et Président du Club Études-Conseils, j’ai voulu doter l’association d’une vitrine à la hauteur de son histoire.',
    problem:
      'Rassembler dans une architecture claire et digne d’une grande école une densité importante d’informations institutionnelles (réforme du cursus, salle des marchés Bloomberg, 7 clubs, 5 événements majeurs, réseau alumni 2A-ECS) à destination des candidats, étudiants, diplômés et cabinets partenaires.',
    objective:
      'Offrir une lecture structurée de l’identité ECS (« Une Empreinte d’Expertise… »), valoriser l’engagement des clubs et faciliter les prises de contact institutionnelles et partenariales.',
    personalContribution:
      'Structuration éditoriale complète des 6 rubriques institutionnelles, conception graphique et développement front-end multi-pages sobre et accessible, jusqu’à la mise en ligne sur Cloudflare Workers.',
    solution:
      'Portail web multi-pages articulé autour du parcours étudiant (de l’admission au réseau 2A-ECS), d’un panorama détaillé de la filière et de ses débouchés, de la présentation des 7 clubs et des portraits d’alumni.',
    verifiedFeatures: [
      'Présentation complète du cursus ingénieur ECS (S1 à S6, spécialisations CCA et Audit/Conseil/Compliance, mémoire DSC-ECS et salle Bloomberg inaugurée en novembre 2025)',
      'Pages dédiées aux 7 clubs : Études-Conseils, Junior Entreprise ECS, Junior Bourse Challenge, Relations Extérieures, Info-Promo, Corporate Branding et Culture & Loisirs',
      'Chronique illustrée des 5 temps forts annuels : Réveillon du Leader, Journée de l’Expert Financier (JEF), Debate of Leaders, Sortie Officielle et action caritative Give Them Love',
      'Galerie de portraits d’alumni (OECCI, Deloitte, EY, BGFIBank, Microsoft, Banque Mondiale, Goldman Sachs…) et présentation des partenaires institutionnels',
      'Respect strict de la vie privée (zéro cookie publicitaire ou de pistage) et page Contact orientée par profil d’interlocuteur',
    ],
    operationalNote:
      'Transparence : le formulaire de message direct sur la page Contact est actuellement affiché en mode démonstration explicite et renvoie vers les canaux officiels actifs (contact@ae-ecs.ci, partenariats@ae-ecs.ci et permanence ESCAE).',
    technologies: [
      { label: 'Architecture Web Multi-Pages (HTML/CSS/JS)', status: 'vérifié' },
      { label: 'Cloudflare Workers (aeecs.workers.dev)', status: 'vérifié' },
      { label: 'Design Éditorial Accessible & Sans Pistage', status: 'vérifié' },
      { label: 'Formulaire Contact (mode démonstration)', status: 'en mode démonstration' },
    ],
    currentState:
      'Déployé et accessible publiquement sur Cloudflare Workers avec l’ensemble des pages Filière, Clubs, Activités, À propos, Alumni et Contact.',
    liveUrl: 'https://aeecs-site.aeecs.workers.dev/',
    liveUrlLabel: 'aeecs-site.aeecs.workers.dev',
    visuals: [
      {
        src: 'https://aeecs-site.aeecs.workers.dev/img/ev/1783110138354.jpg',
        alt: 'Membres de la communauté Études Comptables Supérieures (ECS) réunis en tenue professionnelle à Yamoussoukro',
        caption: 'La communauté étudiante ECS en tenue professionnelle à l’INP-HB Yamoussoukro.',
        sourceLabel: 'aeecs-site.aeecs.workers.dev',
      },
      {
        src: 'https://aeecs-site.aeecs.workers.dev/img/club-etudes-conseils.jpg',
        alt: 'Identité visuelle du Club Études-Conseils de l’AE-ECS sur le portail officiel',
        caption: 'Section dédiée au Club Études-Conseils (« L’incubateur ECS »), présidé depuis novembre 2025.',
        sourceLabel: 'Rubrique Nos Clubs',
      },
      {
        src: 'https://aeecs-site.aeecs.workers.dev/img/ev/1783110156084.jpg',
        alt: 'Rencontre professionnelle lors de la Journée de l’Expert Financier de l’AE-ECS',
        caption: 'Temps fort annuel : La Journée de l’Expert Financier réunissant étudiants et praticiens.',
        sourceLabel: 'Rubrique Activités',
      },
    ],
  },
  {
    id: 'laura-house',
    index: '03',
    pavilionCode: 'PAVILLON 03 · BILLETTERIE ÉVÉNEMENTIELLE',
    alignment: 'left',
    name: 'LAURA HOUSE',
    category: 'Plateforme de billetterie événementielle & titres d’accès QR',
    oneLinePitch:
      'Plateforme de réservation pour une soirée signature à Yamoussoukro, combinant collecte structurée des participants, validation humaine sur paiement Wave marchand et génération de billets PNG haute résolution à QR code unique.',
    context:
      'Réalisée pour l’événement « LAURA HOUSE — Une nuit. Une signature. » organisé au Royal Suite Millionaire à Yamoussoukro (dress code All Black, tarif unitaire de 5 000 FCFA).',
    problem:
      'Permettre la réservation en ligne et l’émission de billets nominatifs élégants munis de codes QR uniques tout en s’adaptant à un encaissement mobile réel via Wave, sans dépendre d’une API bancaire lourde ni risquer de faux billets.',
    objective:
      'Offrir une vitrine nocturne sobre et qualitative, capter proprement l’identité de chaque participant et produire des cartes-billets téléchargeables nettes au contrôle d’accès, même pour les noms longs.',
    personalContribution:
      'Conception de l’expérience utilisateur et de la direction visuelle sombre, développement de l’application Vite et des fonctions serverless sur Vercel, création du générateur de billets PNG haute résolution avec QR code individuel et tests de tenue typographique.',
    solution:
      'Application web événementielle articulant découverte de la soirée, sélection des places et saisie des participants, couplée à un circuit de validation maîtrisé par l’organisatrice avant remise des billets QR.',
    verifiedFeatures: [
      'Présentation éditoriale complète de la soirée (lieu, date, horaires 22h–05h, dress code All Black, affiche officielle et tarif 5 000 FCFA)',
      'Sélection du nombre de billets et collecte structurée des informations nécessaires pour chaque participant',
      'Génération de cartes-billets visuelles exportables en PNG haute définition préservant l’unicité et la lisibilité du QR code',
      'Gestion typographique robuste des noms longs sur le billet afin d’éviter tout chevauchement graphique',
      'Mode démonstration explicite sur la vitrine publique permettant de tester l’interface sans transaction financière',
    ],
    operationalNote:
      'Processus réel de validation retenu : le règlement s’effectue via le lien marchand Wave de la cliente, suivi de l’envoi d’une preuve de paiement par l’acheteur. Après vérification et validation manuelle par la cliente, celle-ci transmet les billets individuels munis de leurs QR codes uniques (ni le paiement ni l’envoi des billets ne sont présentés comme automatisés).',
    technologies: [
      { label: 'Application Web Vite & TypeScript', status: 'vérifié' },
      { label: 'Fonctions Serverless Node.js (Vercel)', status: 'vérifié' },
      { label: 'Génération QR Unique & Export PNG HD', status: 'vérifié' },
      { label: 'Workflow Paiement Wave + Validation Manuelle', status: 'vérifié' },
    ],
    currentState:
      'Déployé sur Vercel (laura-house.vercel.app) avec mode démonstration public actif et générateur de cartes PNG QR opérationnel.',
    liveUrl: 'https://laura-house.vercel.app/',
    liveUrlLabel: 'laura-house.vercel.app',
    visuals: [
      {
        src: 'https://laura-house.vercel.app/laura-restaurant.webp',
        alt: 'Univers visuel nocturne de la plateforme LAURA HOUSE au Royal Suite Millionaire',
        caption: 'Visuel d’ouverture de la plateforme LAURA HOUSE (« Une nuit. Une signature. »).',
        sourceLabel: 'laura-house.vercel.app',
      },
      {
        src: 'https://laura-house.vercel.app/laura-affiche-officielle.webp',
        alt: 'Affiche officielle LAURA HOUSE : Royal Suite Millionaire Yamoussoukro, All Black, 5 000 FCFA',
        caption: 'Affiche officielle intégrée au parcours d’information et de réservation (5 000 FCFA).',
        sourceLabel: 'Affiche officielle LAURA HOUSE',
      },
    ],
  },
  {
    id: 'gym-os-sport',
    index: '04',
    pavilionCode: 'PAVILLON 04 · APPLICATION WEB & MOTEUR BIOMÉCANIQUE',
    alignment: 'right',
    name: 'GYM OS SPORT',
    category: 'Application PWA de musculation guidée & animation biomécanique SVG',
    oneLinePitch:
      'Application d’entraînement hors-ligne générant un programme personnalisé selon l’objectif et démontrant l’exécution de 52 exercices grâce à un moteur de silhouettes SVG animées par cinématique inverse.',
    context:
      'Projet numérique conçu pour répondre à une difficulté fréquente en salle de sport : savoir exactement quelle séance réaliser aujourd’hui et visualiser immédiatement le bon geste technique sans dépendre du réseau mobile ni de vidéos lourdes.',
    problem:
      'Les débutants et pratiquants intermédiaires hésitent souvent sur la structure de leurs séances (séries, répétitions, temps de repos) et sur la posture juste de chaque mouvement, tandis que la connexion internet est souvent instable en salle.',
    objective:
      'Construire une application légère (~100 ko gzip), installable hors-ligne sur téléphone (PWA), qui génère un plan hebdomadaire cohérent et illustre chaque exercice mouvement par mouvement directement dans le navigateur.',
    personalContribution:
      'Architecture complète de l’application en React 19 et TypeScript, conception du générateur de programmes, écriture du solveur géométrique de postures (cinématique inverse à 2 segments) et du moteur de rendu SVG des 52 exercices.',
    solution:
      'Application structurée autour d’un onboarding en 3 étapes (Objectif, Niveau, Profil), d’un mode Séance épuré avec chronomètre de repos et d’une bibliothèque interactive mettant en évidence les groupes musculaires sollicités.',
    verifiedFeatures: [
      'Onboarding en 3 étapes (Sèche, Prise de masse ou Force · Niveau 1 à 3 · 3 à 6 séances/semaine) générant automatiquement la semaine d’entraînement et permettant de la régénérer',
      'Moteur biomécanique 100 % code (pose.ts & render.ts) animant 52 exercices en SVG avec matériel dessiné (barre, haltères, banc, poulie) et mise en évidence lumineuse de 20 groupes musculaires',
      'Contrôles pédagogiques sur chaque fiche exercice : lecture/pause, curseur temporel manuel, vitesses 0,5× / 1× / 1,75×, exécution pas à pas, respiration et erreurs fréquentes',
      'Écran de Séance active sans distraction avec saisie séries/répétitions/charges, chronomètre de repos automatique et reprise après rechargement',
      'Suivi statistique local (volume, régularité, records personnels, poids du corps, export/import JSON) et fonctionnement hors-ligne complet via PWA (Service Worker)',
    ],
    technologies: [
      { label: 'React 19.2 & TypeScript 5.9', status: 'vérifié' },
      { label: 'Vite 7.2 & PWA Hors-Ligne (Service Worker)', status: 'vérifié' },
      { label: 'Solveur Cinématique Inverse & SVG Procédural', status: 'vérifié' },
      { label: 'Déploiement Vercel (gym-os-sport.vercel.app)', status: 'vérifié' },
    ],
    currentState:
      'En ligne sur Vercel et installable en PWA hors-ligne ; les 52 exercices sont validés géométriquement par script de contrôle automatisé.',
    liveUrl: 'https://gym-os-sport.vercel.app/',
    liveUrlLabel: 'gym-os-sport.vercel.app',
    repoUrl: 'https://github.com/loichermanna-art/sport-',
    repoLabel: 'github.com/loichermanna-art/sport-',
    visuals: [
      {
        src: '/projects/gym-os-biomechanics.svg',
        alt: 'Décomposition biomécanique en 4 phases du Squat à la barre générée par le moteur SVG de GYM OS SPORT',
        caption: 'Rendu authentique issu du moteur pose.ts / render.ts : 4 phases clés du Squat avec muscles ciblés.',
        sourceLabel: 'Moteur SVG GYM OS SPORT',
      },
      {
        src: '/projects/gym-os-library.svg',
        alt: 'Planche vectorielle de 8 exercices issue de la bibliothèque de 52 mouvements de GYM OS SPORT',
        caption: 'Extrait direct de la bibliothèque de 52 exercices dessinés en code (zéro image externe).',
        sourceLabel: 'Bibliothèque 52 exercices',
      },
    ],
  },
];

/**
 * SCÈNE 05 — LES 6 ÉTAPES DE LA MÉTHODE DE TRAVAIL (avec Objectif, Actions, Décisions, Livrable & Exemple réel)
 */
export const PROCESS_STEPS: ProcessMethodStep[] = [
  {
    step: '01',
    title: 'Comprendre',
    objective:
      'Cerner avec exactitude le besoin métier, les acteurs impliqués et les contraintes réelles du terrain avant toute hypothèse technique.',
    actions: [
      'Écouter le porteur du besoin et observer le parcours réel des utilisateurs ou des flux financiers.',
      'Identifier les contraintes opérationnelles (habitudes de paiement, réseau, délais, cadre institutionnel).',
    ],
    decisions: [
      'Retenir le périmètre réellement utile dès la première version et écarter les complexités artificielles.',
    ],
    deliverable: 'Note de cadrage fonctionnel & contraintes opérationnelles',
    realExample: {
      projectOrContext: 'LAURA HOUSE',
      illustration:
        'Prise en compte du circuit réel souhaité par l’organisatrice : paiement via son lien marchand Wave, réception d’une preuve de paiement et validation manuelle avant remise des billets QR.',
    },
  },
  {
    step: '02',
    title: 'Analyser',
    objective:
      'Structurer les données, les règles de gestion et les priorités afin de bâtir sur une logique vérifiable.',
    actions: [
      'Cartographier les informations à traiter, les catégories, les cas particuliers et les indicateurs clés.',
      'Vérifier la cohérence des chiffres ou des règles métier comme lors d’un diagnostic financier.',
    ],
    decisions: [
      'Hiérarchiser l’information par niveau de lecture pour éviter toute surcharge cognitive.',
    ],
    deliverable: 'Modèle d’information, règles métier & arborescence',
    realExample: {
      projectOrContext: 'DRONE GROUPE CI & AE-ECS',
      illustration:
        'Chez Drone Groupe CI, structuration des données budgétaires pour isoler les écarts ; sur AE-ECS, organisation claire de 40 ans d’histoire, 7 clubs et 5 événements majeurs.',
    },
  },
  {
    step: '03',
    title: 'Concevoir',
    objective:
      'Dessiner une architecture claire et une interface sobre où chaque écran guide naturellement la lecture et l’action.',
    actions: [
      'Définir les parcours utilisateurs sur mobile et ordinateur ainsi que la hiérarchie typographique.',
      'Concevoir des composants lisibles, accessibles au clavier et cohérents visuellement.',
    ],
    decisions: [
      'Privilégier la clarté immédiate du parcours client plutôt que la multiplication d’étapes intermédiaires.',
    ],
    deliverable: 'Architecture d’interface & parcours utilisateur complet',
    realExample: {
      projectOrContext: 'SassySkin',
      illustration:
        'Double entrée par 13 univers d’actifs et 13 catégories menant directement du panier à une fiche de livraison transmise sur WhatsApp avec paiement à la réception.',
    },
  },
  {
    step: '04',
    title: 'Réaliser',
    objective:
      'Traduire la conception en une réalisation propre, rigoureuse et adaptée aux contraintes de performance.',
    actions: [
      'Écrire un code modulaire et typé (React, TypeScript, Vite) ou structurer rigoureusement les états comptables et tableaux de suivi.',
      'Documenter les choix techniques et maintenir une séparation nette entre données et affichage.',
    ],
    decisions: [
      'Choisir des solutions techniques sobres, légères et autonomes plutôt que des dépendances lourdes.',
    ],
    deliverable: 'Application fonctionnelle ou livrable financier structuré',
    realExample: {
      projectOrContext: 'GYM OS SPORT',
      illustration:
        'Développement d’un moteur géométrique de cinématique inverse et de rendu SVG (~100 ko gzip) permettant d’animer 52 exercices hors-ligne sans aucune vidéo externe.',
    },
  },
  {
    step: '05',
    title: 'Tester',
    objective:
      'Vérifier la justesse des résultats, la tenue sur tous les formats d’écran et les cas limites avant mise en service.',
    actions: [
      'Contrôler les parcours complets, les calculs, l’affichage mobile, l’accessibilité et les contrastes.',
      'Mettre à l’épreuve les cas extrêmes (noms longs, absence de réseau, postures limites).',
    ],
    decisions: [
      'Corriger chaque point de fragilité constaté avant publication et signaler honnêtement tout mode démonstration.',
    ],
    deliverable: 'Contrôles de cohérence, tests automatisés & validation multi-supports',
    realExample: {
      projectOrContext: 'LAURA HOUSE & GYM OS SPORT',
      illustration:
        'Tests de non-débordement des noms longs sur les cartes-billets PNG QR de LAURA HOUSE et validation géométrique automatisée de la portée articulaire des 52 exercices de GYM OS.',
    },
  },
  {
    step: '06',
    title: 'Améliorer',
    objective:
      'Faire évoluer durablement la solution à partir des retours d’usage réels et de l’exigence de qualité.',
    actions: [
      'Observer l’utilisation réelle après déploiement, affiner la lisibilité et consolider les performances.',
      'Enrichir progressivement la documentation et les fonctionnalités prioritaires.',
    ],
    decisions: [
      'Faire progresser chaque version par itérations mesurées sans jamais dégrader la simplicité d’usage.',
    ],
    deliverable: 'Solution pérenne, maintenable et évolutive',
    realExample: {
      projectOrContext: 'Portfolio Personnel (MON-PORTFOLIO)',
      illustration:
        'Refonte éditoriale et spatiale unifiant narration biographique vérifiée, études de cas documentées et environnement architectural 3D Midnight Blue.',
    },
  },
];

export interface LibrarySpaceDefinition {
  index: number;
  code: string;
  slug: 'entree' | 'archives' | 'rayonnages' | 'collection-privee' | 'salle-des-methodes' | 'belvedere';
  title: string;
  subtitle: string;
  architecturalZone: string;
  prototypeReady: boolean;
}

export const LIBRARY_SPACES: LibrarySpaceDefinition[] = [
  {
    index: 0,
    code: '01',
    slug: 'entree',
    title: 'L’Entrée',
    subtitle: 'Identité & Positionnement',
    architecturalZone: 'Vestibule en pierre calcaire & Portail en noyer massif',
    prototypeReady: true,
  },
  {
    index: 1,
    code: '02',
    slug: 'archives',
    title: 'Les Archives',
    subtitle: 'Parcours INP-HB & Stages',
    architecturalZone: 'Galerie voûtée à 6 pupitres chronologiques',
    prototypeReady: false,
  },
  {
    index: 2,
    code: '03',
    slug: 'rayonnages',
    title: 'Les Rayonnages',
    subtitle: '6 Collections de compétences',
    architecturalZone: 'Grande Nef à double hauteur & Mezzanines vitrées',
    prototypeReady: false,
  },
  {
    index: 3,
    code: '04',
    slug: 'collection-privee',
    title: 'La Collection Privée',
    subtitle: '4 Études de cas réelles',
    architecturalZone: 'Quatre alcôves muséographiques d’exposition',
    prototypeReady: false,
  },
  {
    index: 4,
    code: '05',
    slug: 'salle-des-methodes',
    title: 'La Salle des Méthodes',
    subtitle: 'Démarche en 6 étapes',
    architecturalZone: 'Salle de lecture en mezzanine & Escalier monumental',
    prototypeReady: false,
  },
  {
    index: 5,
    code: '06',
    slug: 'belvedere',
    title: 'Le Belvédère',
    subtitle: 'Contact & CV officiel',
    architecturalZone: 'Salon panoramique ouvert sur l’horizon',
    prototypeReady: false,
  },
];

export interface LibrarySkillCollection {
  id: string;
  callNumber: string;
  title: string;
  summary: string;
  academicFoundations: string[];
  practicalExperience: string[];
  toolsContext: string[];
}

/**
 * ESPACE 03 — LES 6 COLLECTIONS DE LA BIBLIOTHÈQUE
 * Aucune jauge arbitraire, aucun niveau de maîtrise inventé ni aucune certification fictive.
 */
export const LIBRARY_COLLECTIONS: LibrarySkillCollection[] = [
  {
    id: 'finance',
    callNumber: 'RAY · 01 · FIN',
    title: 'Finance',
    summary:
      'Suivi budgétaire, lecture des équilibres de trésorerie et structuration de données financières au sein du cursus ingénieur ECS à l’INP-HB et en entreprise.',
    academicFoundations: [
      'Gestion financière, équilibres de financement et structure de trésorerie (INP-HB)',
      'Contrôle de gestion et suivi prévisionnel (option du DTS Finance-Comptabilité)',
    ],
    practicalExperience: [
      'Mise en place d’un tableau de bord pour le suivi du budget d’un projet chez Drone Groupe CI (stage de 3 mois)',
      'Collecte et traitement méthodique de données financières d’exploitation',
    ],
    toolsContext: ['Microsoft Excel (tableaux de bord budgétaires)', 'États prévisionnels & suivis de trésorerie'],
  },
  {
    id: 'comptabilite',
    callNumber: 'RAY · 02 · CPT',
    title: 'Comptabilité',
    summary:
      'Tenue comptable, imputation de pièces justificatives, rapprochements bancaires et comptabilité analytique pratiqués du Baccalauréat G2 au cabinet d’expertise comptable.',
    academicFoundations: [
      'Comptabilité financière approfondie et états de synthèse (référentiel SYSCOHADA)',
      'Comptabilité analytique et calcul des coûts de revient',
    ],
    practicalExperience: [
      'Enregistrement des pièces justificatives dans Sage 100 / SAARI chez IACG (stage de 2 mois)',
      'Établissement de rapprochements bancaires, préparation de livres de paie et assistance à la tenue comptable d’une entreprise cliente',
    ],
    toolsContext: ['Sage 100 / Sage SAARI Comptabilité', 'Sage Paie RH', 'Journaux, balances & grands-livres'],
  },
  {
    id: 'audit',
    callNumber: 'RAY · 03 · AUD',
    title: 'Audit',
    summary:
      'Vérification de la conformité documentaire, contrôle de cohérence des écritures et traçabilité des opérations comptables et financières.',
    academicFoundations: [
      'Méthodologie de contrôle, vérification des pièces et principes de contrôle interne (cycle ingénieur ECS — INP-HB)',
      'Recoupement des cycles comptables et justification des soldes',
    ],
    practicalExperience: [
      'Contrôle de concordance entre pièces justificatives, relevés bancaires et journaux comptables (cabinet IACG)',
      'Rigueur documentaire appliquée aux travaux du Club Études-Conseils de l’AE-ECS',
    ],
    toolsContext: ['Dossiers de révision & pièces justificatives', 'Contrôles de cohérence Excel'],
  },
  {
    id: 'analyse-financiere',
    callNumber: 'RAY · 04 · ANF',
    title: 'Analyse financière',
    summary:
      'Étude des écarts entre prévisions et réalisations, lecture des indicateurs d’activité et restitution synthétique pour éclairer les décisions.',
    academicFoundations: [
      'Diagnostic financier : analyse de l’activité, des marges, de la structure financière et de la rentabilité (INP-HB)',
      'Interprétation économique des ratios et des soldes intermédiaires de gestion',
    ],
    practicalExperience: [
      'Analyse et interprétation d’écarts budgétaires sur projet réel lors du stage chez Drone Groupe CI',
      'Structuration d’argumentaires économiques dans le cadre de la présidence du Club Études-Conseils (AE-ECS)',
    ],
    toolsContext: ['Modèles d’analyse d’écarts sous Excel', 'Tableaux de synthèse financière'],
  },
  {
    id: 'outils-numeriques',
    callNumber: 'RAY · 05 · NUM',
    title: 'Outils numériques',
    summary:
      'Utilisation régulière des suites bureautiques, des progiciels comptables de référence et des plateformes collaboratives modernes.',
    academicFoundations: [
      'Structuration de classeurs de calcul, automatisation de formules et mise en forme de rapports professionnels',
      'Organisation logique des bases de données comptables et documentaires',
    ],
    practicalExperience: [
      'Pratique quotidienne du Pack Office dans les travaux académiques et les stages en entreprise et cabinet',
      'Utilisation concrète de Sage Comptabilité et Sage Paie RH en contexte professionnel',
    ],
    toolsContext: ['Pack Office (Excel, Word, PowerPoint)', 'Sage SAARI / Sage 100 & Sage Paie RH', 'GitHub'],
  },
  {
    id: 'projets-digitaux',
    callNumber: 'RAY · 06 · DIG',
    title: 'Création et réalisation de projets digitaux',
    summary:
      'Conception et mise en ligne d’applications web sobres répondant à des besoins réels : commerce local, vie associative, billetterie événementielle et suivi sportif.',
    academicFoundations: [
      'Cadrage fonctionnel d’un besoin réel, architecture modulaire et typage statique',
      'Attention portée à la performance mobile, à l’accessibilité et à la simplicité d’usage',
    ],
    practicalExperience: [
      'SassySkin : boutique cosmétique en ligne adaptée à la commande WhatsApp et au paiement à la livraison',
      'AE-ECS : portail institutionnel des élèves-ingénieurs ECS de l’INP-HB',
      'LAURA HOUSE : site vitrine et réservation événementielle (lien marchand Wave de la cliente, preuve de paiement et attribution manuelle de QR code unique)',
      'GYM OS SPORT : application PWA hors-ligne dotée d’un moteur SVG biomécanique de 52 exercices',
    ],
    toolsContext: ['React & TypeScript', 'Vite, HTML5 & CSS3', 'Vercel & Cloudflare Workers / Pages'],
  },
];

