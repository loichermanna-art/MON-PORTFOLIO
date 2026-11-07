export type VerificationStatus = 'vérifié' | 'à confirmer';

export interface ProjectCaseStudy {
  id: 'laura-house' | 'sassyskin' | 'etuco';
  index: string;
  steleLabel: string;
  alignment: 'left' | 'right';
  name: string;
  category: string;
  tagline: string;
  context: string;
  problem: string;
  objective: string;
  solution: string;
  architectureHighlights: string[];
  role: string;
  roleNote?: string;
  technologies: Array<{ label: string; status: VerificationStatus }>;
  liveUrl?: string;
  liveUrlLabel?: string;
  urlStatus: VerificationStatus;
}

export interface ExpertiseDomainItem {
  id: string;
  index: string;
  steleCode: 'AUDIT' | 'FINANCE' | 'DÉVELOPPEMENT' | 'INNOVATION';
  title: string;
  shortSubtitle: string;
  summary: string;
  capabilities: string[];
  academicOrProjectBasis: string;
}

export const NAV_SCENES = [
  { index: 0, num: '01', id: 'hero', label: 'Accueil', zone: 'L’Oculus Monumental' },
  { index: 1, num: '02', id: 'about', label: 'À propos', zone: 'Les Cadres d’Architecture' },
  { index: 2, num: '03', id: 'expertise', label: 'Expertise', zone: 'Les Quatre Stèles' },
  { index: 3, num: '04', id: 'projects', label: 'Projets', zone: 'La Galerie Immersive' },
  { index: 4, num: '05', id: 'process', label: 'Ma démarche', zone: 'L’Anneau Séquentiel' },
  { index: 5, num: '06', id: 'contact', label: 'Contact', zone: 'L’Horizon Ouvert' },
] as const;

export const PROFILE_IDENTITY = {
  firstName: 'Loïc',
  lastName: 'AKANDA',
  fullName: 'Loïc AKANDA',
  monogram: 'LA.',
  portfolioEdition: 'PORTFOLIO 2026',
  signaturePrefix: 'Finance. Innovation.',
  signatureHighlight: 'Impact.',
  signatureCanonical: 'FINANCE. INNOVATION. IMPACT.',
  heroRole: 'Étudiant en finance & créateur de solutions numériques.',
  heroCta: 'Découvrir mon univers',
  academicTitle: 'Élève-ingénieur en Finance (3e année cycle ingénieur)',
  institution: 'INP-HB — Côte d’Ivoire',
  institutionFull: 'Institut National Polytechnique Félix Houphouët-Boigny (INP-HB)',
  aboutHeading: 'Une vision à la croisée de la finance et du digital.',
  aboutIntro:
    'Étudiant en troisième année du cycle ingénieur en finance à l’Institut National Polytechnique Félix Houphouët-Boigny (INP-HB, Côte d’Ivoire), je construis mon parcours autour des disciplines fondamentales de l’analyse économique et du contrôle : la finance, la comptabilité et l’audit.',
  aboutBridge:
    'En parallèle de cette formation analytique exigeante, je conçois et développe des solutions numériques concrètes. Cette double lecture me permet d’aborder chaque projet à la fois sous l’angle de sa rigueur structurelle et sous celui de son utilité réelle.',
  workPhilosophy: [
    {
      index: '01',
      title: 'Rigueur analytique',
      detail:
        'Comprendre la structure réelle d’un besoin, ses flux et ses contraintes avant toute décision technique ou formelle.',
    },
    {
      index: '02',
      title: 'Architecture claire',
      detail:
        'Appliquer la même exigence de cohérence et de lisibilité à un diagnostic financier qu’à une application web.',
    },
    {
      index: '03',
      title: 'Impact concret',
      detail:
        'Transformer des problématiques réelles en solutions numériques sobres, fiables et directement exploitables.',
    },
  ],
  contacts: {
    heading: 'Ensemble, créons les solutions de demain.',
    lead: 'Une idée, un projet, une opportunité ? Échangeons.',
    email: '[À renseigner — e-mail professionnel de Loïc AKANDA]',
    linkedin: '[À renseigner — profil LinkedIn officiel de Loïc AKANDA]',
    githubUrl: 'https://github.com/loichermanna-art',
    githubHandle: 'github.com/loichermanna-art',
    location: 'Côte d’Ivoire · INP-HB',
  },
};

export const HERO_STELE_AXES = [
  { id: 'audit-analyse', label: 'AUDIT', targetDomainIndex: 1 },
  { id: 'finance-comptabilite', label: 'FINANCE', targetDomainIndex: 0 },
  { id: 'developpement-numerique', label: 'DÉVELOPPEMENT', targetDomainIndex: 2 },
  { id: 'gestion-projets', label: 'INNOVATION', targetDomainIndex: 3 },
] as const;

export const EXPERTISE_DOMAINS: ExpertiseDomainItem[] = [
  {
    id: 'finance-comptabilite',
    index: '01',
    steleCode: 'FINANCE',
    title: 'Finance et comptabilité',
    shortSubtitle: 'Socle académique du cycle ingénieur à l’INP-HB',
    summary:
      'Lecture structurée des équilibres financiers, compréhension des flux économiques, organisation rigoureuse de l’information comptable et cohérence des états de synthèse.',
    capabilities: [
      'Analyse des équilibres et des flux financiers',
      'Structuration et cohérence comptable',
      'Lecture rigoureuse des états de synthèse',
    ],
    academicOrProjectBasis: 'Formation en 3e année du cycle ingénieur en finance — INP-HB',
  },
  {
    id: 'audit-analyse',
    index: '02',
    steleCode: 'AUDIT',
    title: 'Audit et analyse',
    shortSubtitle: 'Vérification méthodique, contrôle et diagnostic',
    summary:
      'Approche méthodique de contrôle des processus, identification des zones de risque, exigence de traçabilité et restitution claire d’indicateurs utiles à la décision.',
    capabilities: [
      'Démarche structurée d’audit et de contrôle',
      'Diagnostic et interprétation d’indicateurs',
      'Synthèse analytique orientée décision',
    ],
    academicOrProjectBasis: 'Socle académique en audit et analyse financière — INP-HB',
  },
  {
    id: 'developpement-numerique',
    index: '03',
    steleCode: 'DÉVELOPPEMENT',
    title: 'Développement numérique',
    shortSubtitle: 'Conception et réalisation d’applications web fonctionnelles',
    summary:
      'Traduction d’un besoin concret en architecture applicative propre, interfaces web modernes, responsives et déployées en production.',
    capabilities: [
      'Applications web React, TypeScript & Vite',
      'Logique applicative & API Node.js',
      'Interfaces responsives accessibles et soignées',
    ],
    academicOrProjectBasis: 'Mis en œuvre sur LAURA HOUSE, SassySkin et ce portfolio 3D',
  },
  {
    id: 'gestion-projets',
    index: '04',
    steleCode: 'INNOVATION',
    title: 'Gestion de projets',
    shortSubtitle: 'Du cadrage initial jusqu’au livrable opérationnel',
    summary:
      'Organisation méthodique des réalisations : définition du périmètre, priorisation des fonctionnalités essentielles, suivi par jalons et livraison vérifiable.',
    capabilities: [
      'Cadrage fonctionnel et définition des priorités',
      'Structuration des étapes de réalisation',
      'Coordination et livraison orientée usage réel',
    ],
    academicOrProjectBasis: 'Appliqué aux projets numériques et initiatives associatives (EtuCo)',
  },
];

export const SELECTED_PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'laura-house',
    index: '01',
    steleLabel: 'GALERIE 01 · BILLETTERIE & QR',
    alignment: 'left',
    name: 'LAURA HOUSE',
    category: 'Plateforme de billetterie événementielle avec réservation et génération de billets QR',
    tagline:
      'Orchestrer la réservation d’événements et générer des titres d’accès QR individuels haute définition.',
    context:
      'Plateforme numérique conçue pour structurer la prise de réservation événementielle, le suivi des attributions et l’émission fiable des billets.',
    problem:
      'Fluidifier l’inscription des participants tout en garantissant l’unicité des billets, la stabilité typographique (même sur les noms longs) et la netteté du code QR au contrôle.',
    objective:
      'Réunir dans une interface claire la réservation en ligne, l’allocation contrôlée des places et le téléchargement individuel de billets PNG haute résolution.',
    solution:
      'Application web complète intégrant parcours de réservation, génération de codes QR uniques et rendu de cartes-billets téléchargeables.',
    architectureHighlights: [
      'Parcours de réservation structuré limitant les erreurs de saisie.',
      'Émission de billets munis de codes QR uniques prêts pour le contrôle d’accès.',
      'Export individuel en carte PNG haute définition à mise en page maîtrisée.',
    ],
    role: 'Conception et développement de la plateforme',
    technologies: [
      { label: 'Application Web (Vite)', status: 'vérifié' },
      { label: 'Fonctions Serverless Node.js', status: 'vérifié' },
      { label: 'Génération QR & Export PNG HD', status: 'vérifié' },
      { label: 'Déploiement Vercel', status: 'vérifié' },
    ],
    liveUrl: 'https://laura-house.vercel.app',
    liveUrlLabel: 'laura-house.vercel.app',
    urlStatus: 'vérifié',
  },
  {
    id: 'sassyskin',
    index: '02',
    steleLabel: 'GALERIE 02 · COMMERCE SKINCARE',
    alignment: 'right',
    name: 'SassySkin',
    category: 'Site web de vente de produits de soins et de beauté',
    tagline:
      'Valoriser une gamme de soins skincare à travers une vitrine commerciale claire, rassurante et mobile-first.',
    context:
      'Création d’un site web commercial dédié à la présentation et à la vente de produits de soins et de beauté.',
    problem:
      'Offrir une présence en ligne soignée et lisible qui mette en valeur les produits tout en simplifiant le parcours client sur mobile comme sur ordinateur.',
    objective:
      'Structurer la découverte du catalogue de soins et accompagner efficacement les clientes vers la prise de commande.',
    solution:
      'Site web commercial responsive articulant présentation claire des produits, identité visuelle sobre et parcours orienté conversion.',
    architectureHighlights: [
      'Présentation structurée et lisible des gammes de soins et de beauté.',
      'Expérience responsive pensée en priorité pour la navigation mobile.',
      'Parcours direct vers l’action commerciale sans surcharge visuelle.',
    ],
    role: 'Conception et développement du site web',
    technologies: [
      { label: 'Développement Web Frontend', status: 'vérifié' },
      { label: 'Design Responsive Mobile & Desktop', status: 'vérifié' },
      { label: 'Déploiement Vercel', status: 'vérifié' },
    ],
    liveUrl: 'https://sassy-skin-site.vercel.app',
    liveUrlLabel: 'sassy-skin-site.vercel.app',
    urlStatus: 'vérifié',
  },
  {
    id: 'etuco',
    index: '03',
    steleLabel: 'GALERIE 03 · ÉCOSYSTÈME CLUB',
    alignment: 'left',
    name: 'EtuCo',
    category: 'Application et environnement numérique liés au Club Études-Conseils',
    tagline:
      'Doter le Club Études-Conseils d’un espace applicatif structuré au service de ses travaux et de son organisation.',
    context:
      'Environnement numérique conçu pour accompagner la coordination, la structuration et la valorisation des activités du Club Études-Conseils.',
    problem:
      'Rassembler et organiser dans un cadre applicatif cohérent les informations, pôles d’activité et initiatives portés par le club.',
    objective:
      'Mettre à disposition des membres et interlocuteurs du Club Études-Conseils un outil numérique clair, centralisé et évolutif.',
    solution:
      'Application et environnement digital dédiés à l’organisation des activités d’études, de conseil et de vie associative du club.',
    architectureHighlights: [
      'Architecture d’information claire structurant les pôles et missions du club.',
      'Environnement pensé pour faciliter la coordination des membres.',
      'Base évolutive prête à accompagner le développement des activités EtuCo.',
    ],
    role: 'Conception et réalisation numérique liée au Club Études-Conseils',
    roleNote: 'Périmètre détaillé et lien public à compléter selon autorisation de publication du club.',
    technologies: [
      { label: 'Conception Produit & Architecture', status: 'vérifié' },
      { label: 'Environnement Applicatif Web', status: 'vérifié' },
    ],
    urlStatus: 'à confirmer',
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Comprendre',
    summary:
      'Cerner avec précision le contexte, les objectifs réels et les contraintes métier avant d’esquisser la moindre piste technique.',
    deliverable: 'Cadrage clair de la problématique',
  },
  {
    step: '02',
    title: 'Analyser',
    summary:
      'Étudier les flux, les usages attendus, les exigences de fiabilité et hiérarchiser ce qui crée réellement de la valeur.',
    deliverable: 'Diagnostic fonctionnel & priorités',
  },
  {
    step: '03',
    title: 'Concevoir',
    summary:
      'Dessiner une architecture logique limpide et une interface sobre où chaque élément guide naturellement la lecture et l’action.',
    deliverable: 'Architecture & parcours d’interface',
  },
  {
    step: '04',
    title: 'Développer',
    summary:
      'Traduire la conception en code propre, modulaire, typé et maintenable, avec une attention constante aux détails d’exécution.',
    deliverable: 'Solution web robuste & modulaire',
  },
  {
    step: '05',
    title: 'Tester',
    summary:
      'Vérifier minutieusement les parcours réels, la tenue sur mobile, les performances, les contrastes et les cas limites.',
    deliverable: 'Validation qualité multi-supports',
  },
  {
    step: '06',
    title: 'Améliorer',
    summary:
      'Affiner les transitions, consolider la stabilité et faire évoluer la solution de manière durable à partir des retours concrets.',
    deliverable: 'Produit pérenne & évolutif',
  },
];
