export type VerificationStatus = 'vérifié' | 'à confirmer';

export interface ProjectCaseStudy {
  id: string;
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
  uiPreviewType: 'ticketing-qr' | 'skincare-commerce' | 'club-platform';
}

export interface SceneMockupSpec {
  id: string;
  number: string;
  codeName: string;
  architecturalSpace: string;
  narrativeGoal: string;
  alignment: 'left' | 'right' | 'diptych' | 'alternating' | 'sequential' | 'centered-calm';
  cameraDesktop: { pos: string; target: string; fov: string; movement: string };
  cameraMobile: { pos: string; fov: string; adaptation: string };
  depthLayers: {
    z3Background: string;
    z2Midground3D: string;
    z1ForegroundHTML: string;
  };
  autonomousMotion: string;
  scrollChoreography: string;
}

export const NAV_SCENES = [
  { index: 0, num: '01', id: 'hero', label: 'Introduction', zone: 'Le Péristyle' },
  { index: 1, num: '02', id: 'about', label: 'Parcours', zone: 'La Claire-Voie' },
  { index: 2, num: '03', id: 'expertise', label: 'Expertise', zone: 'Les Deux Piliers' },
  { index: 3, num: '04', id: 'projects', label: 'Réalisations', zone: 'Les Monolithes' },
  { index: 4, num: '05', id: 'process', label: 'Méthode', zone: 'La Passerelle' },
  { index: 5, num: '06', id: 'contact', label: 'Contact', zone: 'Le Belvédère' },
] as const;

export const PROFILE_IDENTITY = {
  fullName: 'Loïc AKANDA',
  monogram: 'L. AKANDA',
  academicTitle: 'Élève-ingénieur en Finance (3e année cycle ingénieur)',
  institution: 'INP-HB — Côte d’Ivoire',
  institutionFull: 'Institut National Polytechnique Félix Houphouët-Boigny (INP-HB)',
  institutionDetailPlaceholder: '[À CONFIRMER : école interne / spécialisation exacte INP-HB]',
  valueProposition:
    'La rigueur de l’analyse financière, la concrétisation du produit numérique.',
  heroSummary:
    'Élève-ingénieur en troisième année de finance à l’INP-HB (Côte d’Ivoire), j’articule une formation exigeante en finance, comptabilité, audit et analyse avec la conception et le développement d’applications web pensées pour résoudre des besoins réels.',
  aboutIntro:
    'Étudiant en troisième année du cycle ingénieur en finance à l’Institut National Polytechnique Félix Houphouët-Boigny (INP-HB), je construis mon parcours autour des disciplines fondamentales de l’analyse économique et du contrôle : la finance, la comptabilité et l’audit.',
  aboutBridge:
    'En parallèle de ce socle analytique, je conçois et développe des solutions numériques concrètes. Cette double approche me permet de lire un besoin à la fois sous l’angle de sa cohérence opérationnelle et sous celui de son exécution produit.',
  professionalInterests:
    'Audit financier et opérationnel, analyse de performance, structuration comptable, conception de produits numériques et développement d’applications web utiles.',
  workPhilosophy: [
    {
      index: '01',
      title: 'Clarté analytique',
      detail:
        'Comprendre la structure réelle d’un problème, ses flux et ses contraintes avant toute décision technique ou formelle.',
    },
    {
      index: '02',
      title: 'Exigence d’exécution',
      detail:
        'Appliquer la même discipline de vérification à un diagnostic financier qu’à l’architecture d’une interface web.',
    },
    {
      index: '03',
      title: 'Utilité concrète',
      detail:
        'Transformer des besoins réels en outils sobres, lisibles et immédiatement exploitables sur le terrain.',
    },
  ],
  contacts: {
    email: '[À CONFIRMER — ex. loichermanna@gmail.com]',
    linkedin: '[À CONFIRMER — URL profil LinkedIn Loïc AKANDA]',
    githubUrl: 'https://github.com/loichermanna-art',
    githubHandle: 'github.com/loichermanna-art',
    location: 'Côte d’Ivoire · INP-HB',
  },
};

export const EXPERTISE_POLES = [
  {
    poleId: 'finance-audit',
    poleIndex: 'PÔLE I',
    poleTitle: 'Finance, Comptabilité, Audit & Analyse',
    poleSubtitle: 'Socle académique du cycle ingénieur — lecture critique, contrôle et structuration.',
    architecturalMetaphor: 'Strates monolithiques en pierre d’albâtre (stabilité & contrôle)',
    domains: [
      {
        code: 'I.1',
        name: 'Finance',
        description:
          'Compréhension des équilibres financiers, lecture des flux et structuration logique des décisions d’allocation au sein du cycle ingénieur.',
      },
      {
        code: 'I.2',
        name: 'Comptabilité',
        description:
          'Organisation rigoureuse de l’information comptable, cohérence des opérations et fiabilité des états de synthèse.',
      },
      {
        code: 'I.3',
        name: 'Audit',
        description:
          'Démarche méthodique de vérification, identification des zones de risque, contrôle des procédures et traçabilité.',
      },
      {
        code: 'I.4',
        name: 'Analyse financière',
        description:
          'Diagnostic structuré des indicateurs d’activité et restitution synthétique au service de la prise de décision.',
      },
    ],
  },
  {
    poleId: 'digital-product',
    poleIndex: 'PÔLE II',
    poleTitle: 'Conception Numérique, Développement & Projets',
    poleSubtitle: 'Traduction concrète d’enjeux opérationnels en plateformes web fonctionnelles.',
    architecturalMetaphor: 'Ossature de précision en bronze patiné (ingénierie & exécution)',
    domains: [
      {
        code: 'II.1',
        name: 'Conception de produits numériques',
        description:
          'Traduction d’un besoin métier en parcours utilisateur limpide, architecture de l’information et interface éditoriale.',
      },
      {
        code: 'II.2',
        name: 'Développement web',
        description:
          'Réalisation d’applications web modernes, responsives et maintenables (React, TypeScript, Vite / Node.js) jusqu’à la mise en ligne.',
      },
      {
        code: 'II.3',
        name: 'Gestion et réalisation de projets',
        description:
          'Cadrage du besoin, structuration par jalons, résolution pragmatique des blocages et livraison de réalisations vérifiables.',
      },
    ],
  },
];

export const SELECTED_PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'laura-house',
    index: '01',
    steleLabel: 'STÈLE 01 · AILE DROITE',
    alignment: 'left',
    name: 'LAURA HOUSE',
    category: 'Plateforme de billetterie événementielle & billets QR',
    tagline:
      'Gérer les réservations événementielles et émettre des titres d’accès QR haute définition fiables au contrôle.',
    context:
      'Dispositif numérique autonome conçu pour orchestrer la réservation d’événements, le suivi des attributions et la délivrance des billets.',
    problem:
      'Fluidifier la prise de réservation tout en garantissant l’unicité, la lisibilité typographique (y compris sur les noms longs) et l’intégrité du code QR lors du téléchargement individuel.',
    objective:
      'Réunir dans une interface claire la réservation participant, la gestion contrôlée des places et l’export de cartes-billets haute résolution.',
    solution:
      'Application web de billetterie intégrant la gestion des réservations, l’allocation structurée des billets et l’export individuel en carte PNG haute définition.',
    architectureHighlights: [
      'Parcours de réservation structuré limitant les erreurs de saisie participant.',
      'Génération de billets dotés de codes QR uniques prêts pour la vérification d’accès.',
      'Rendu et téléchargement de cartes-billets PNG haute résolution à mise en page stable.',
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
    urlStatus: 'à confirmer',
    uiPreviewType: 'ticketing-qr',
  },
  {
    id: 'sassyskin',
    index: '02',
    steleLabel: 'STÈLE 02 · AILE GAUCHE',
    alignment: 'right',
    name: 'SassySkin',
    category: 'Site web commercial — Univers Skincare',
    tagline:
      'Structurer la présence digitale et la vitrine de vente en ligne d’une activité dédiée aux soins de la peau.',
    context:
      'Création d’un espace web commercial pensé pour présenter la gamme de produits de skincare et accompagner la vente.',
    problem:
      'Offrir à l’activité une vitrine digitale soignée, lisible et rassurante valorisant les soins tout en simplifiant le parcours vers la commande sur mobile comme sur ordinateur.',
    objective:
      'Mettre en valeur l’identité des produits et guider clairement les clientes jusqu’à la prise de commande.',
    solution:
      'Site web commercial dédié à la présentation de la gamme SassySkin et à la facilitation des ventes en ligne.',
    architectureHighlights: [
      'Hiérarchie visuelle claire mettant l’accent sur la lisibilité des gammes de soins.',
      'Conception responsive adaptée à la consultation mobile majoritaire.',
      'Parcours orienté vers l’action commerciale sans surcharge décorative.',
    ],
    role: 'Conception et développement du site web',
    roleNote: '[Détail exact du tunnel de commande / catalogue : À CONFIRMER]',
    technologies: [
      { label: 'Développement Web Frontend', status: 'vérifié' },
      { label: 'Interface Responsive Mobile/Desktop', status: 'vérifié' },
      { label: 'Déploiement Vercel', status: 'vérifié' },
      { label: '[Stack interne exacte : À CONFIRMER]', status: 'à confirmer' },
    ],
    liveUrl: 'https://sassy-skin-site.vercel.app',
    liveUrlLabel: 'sassy-skin-site.vercel.app',
    urlStatus: 'à confirmer',
    uiPreviewType: 'skincare-commerce',
  },
  {
    id: 'etuco',
    index: '03',
    steleLabel: 'STÈLE 03 · AILE DROITE',
    alignment: 'left',
    name: 'EtuCo',
    category: 'Application & environnement numérique — Club Études-Conseils',
    tagline:
      'Doter le Club Études-Conseils d’un environnement applicatif structuré au service de ses activités.',
    context:
      'Projet numérique conçu en lien direct avec l’organisation et le rayonnement des activités du Club Études-Conseils.',
    problem:
      'Centraliser et organiser dans un environnement numérique cohérent le suivi des initiatives, travaux et informations liés au club.',
    objective:
      'Fournir aux membres et parties prenantes du Club Études-Conseils un espace applicatif clair, fiable et évolutif.',
    solution:
      'Application et environnement digital soutenant la structuration, la coordination et la valorisation des activités du Club Études-Conseils.',
    architectureHighlights: [
      'Structuration d’un espace numérique dédié aux activités associatives et d’études.',
      'Organisation claire de l’information pour faciliter l’usage par les membres.',
      'Architecture prête à accueillir les évolutions fonctionnelles du club.',
    ],
    role: 'Conception et réalisation numérique au service du Club Études-Conseils',
    roleNote: '[Périmètre fonctionnel détaillé & intitulé exact du rôle : À CONFIRMER]',
    technologies: [
      { label: 'Conception Produit & Application', status: 'vérifié' },
      { label: '[Stack technique exacte : À CONFIRMER]', status: 'à confirmer' },
      { label: '[Lien ou captures officielles : À CONFIRMER]', status: 'à confirmer' },
    ],
    urlStatus: 'à confirmer',
    uiPreviewType: 'club-platform',
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Comprendre le problème',
    summary:
      'Écouter le contexte réel, cerner l’enjeu économique ou opérationnel et formuler précisément la question à résoudre avant d’envisager un outil.',
    deliverable: 'Cadrage du problème & objectifs réels',
  },
  {
    step: '02',
    title: 'Analyser les besoins',
    summary:
      'Décortiquer les flux, les utilisateurs, les contraintes de fiabilité ou de contrôle et distinguer l’essentiel du superflu.',
    deliverable: 'Cartographie des flux & priorités',
  },
  {
    step: '03',
    title: 'Structurer une solution',
    summary:
      'Définir une architecture fonctionnelle et logique claire, vérifiable tant dans l’organisation des données que dans le parcours.',
    deliverable: 'Architecture fonctionnelle & parcours',
  },
  {
    step: '04',
    title: 'Concevoir',
    summary:
      'Composer des interfaces sobres et lisibles où la hiérarchie éditoriale sert immédiatement la compréhension et l’action.',
    deliverable: 'Maquettes & système d’interface',
  },
  {
    step: '05',
    title: 'Développer ou exécuter',
    summary:
      'Construire avec rigueur, modularité technique et exigence du détail jusqu’à l’obtention d’un livrable opérationnel.',
    deliverable: 'Application modulaire & performante',
  },
  {
    step: '06',
    title: 'Tester et améliorer',
    summary:
      'Éprouver les cas limites réels, vérifier l’accessibilité et affiner itérativement pour garantir un résultat durable.',
    deliverable: 'Contrôle qualité & fiabilisation',
  },
];

export const SCENE_MOCKUPS: SceneMockupSpec[] = [
  {
    id: 'hero',
    number: '01',
    codeName: 'INTRODUCTION / HERO',
    architecturalSpace: 'Le Péristyle de Lumière (z = +16m → 0m)',
    narrativeGoal: 'Installer immédiatement l’autorité corporate et l’immersion architecturale.',
    alignment: 'left',
    cameraDesktop: {
      pos: '[-0.88, 2.05, 13.5]',
      target: '[1.55, 2.22, 1.4]',
      fov: '38° (Optique cinéma)',
      movement: 'Travelling avant franchissant le Portique d’Équilibre qui s’entrouvre au scroll.',
    },
    cameraMobile: {
      pos: '[0.10, 2.35, 15.2]',
      fov: '45°',
      adaptation: 'Portique cadré dans le tiers supérieur lumineux ; bloc éditorial ancré bas.',
    },
    depthLayers: {
      z3Background: 'Perspective profonde de la nef centrale et brume d’albâtre (#F5F2EB).',
      z2Midground3D: 'Colonnade calcaire + Portique d’Équilibre pierre/bronze à droite (cols 7–12).',
      z1ForegroundHTML: 'H1 Instrument Serif + proposition de valeur + 2 CTAs à gauche (cols 1–7).',
    },
    autonomousMotion: 'Oscillation lente (±1.2°, 14s) du fléau de bronze et course solaire subtile.',
    scrollChoreography: 'Ouverture latérale des vantaux de bronze (±0.78m) + plongée dans la nef.',
  },
  {
    id: 'about',
    number: '02',
    codeName: 'ABOUT / IDENTITÉ & PARCOURS',
    architecturalSpace: 'La Galerie à Claire-Voie (z = 0m → -18m)',
    narrativeGoal: 'Raconter avec justesse le parcours INP-HB et la philosophie analytique.',
    alignment: 'right',
    cameraDesktop: {
      pos: '[1.38, 1.95, -4.2]',
      target: '[-1.95, 2.06, -14.5]',
      fov: '38°',
      movement: 'Glissement latéral droit + rotation -15° vers les brise-soleil verticaux.',
    },
    cameraMobile: {
      pos: '[0.15, 2.05, -3.5]',
      fov: '45°',
      adaptation: 'Bandeau architectural des claire-voies en tête, lecture séquentielle 4 colonnes.',
    },
    depthLayers: {
      z3Background: 'Mur de pierre d’assise et ouverture sur la Cour des Deux Piliers.',
      z2Midground3D: '11 brise-soleil verticaux (cols 1–5) projetant des faisceaux de lumière au sol.',
      z1ForegroundHTML: 'Récit académique INP-HB + 3 principes de travail à droite (cols 7–12).',
    },
    autonomousMotion: 'Modulation douce des rais lumineux sur le dallage en travertin.',
    scrollChoreography: 'Rotation coordonnée des lames brise-soleil (20° → 46°) au fil de la lecture.',
  },
  {
    id: 'expertise',
    number: '03',
    codeName: 'EXPERTISE / DOMAINES',
    architecturalSpace: 'La Cour des Deux Piliers (z = -18m → -38m)',
    narrativeGoal: 'Articuler Finance/Audit et Ingénierie Produit sans jauges chiffrées factices.',
    alignment: 'diptych',
    cameraDesktop: {
      pos: '[0.00, 3.25, -20.8]',
      target: '[0.00, 1.85, -31.2]',
      fov: '39°',
      movement: 'Élévation en plongée douce révélant la symétrie complémentaire des deux ailes.',
    },
    cameraMobile: {
      pos: '[0.00, 2.95, -20.5]',
      fov: '45°',
      adaptation: 'Deux chapitres éditoriaux consécutifs (Pôle I Finance/Audit, Pôle II Produit/Web).',
    },
    depthLayers: {
      z3Background: 'Arche monumentale ouvrant sur la Salle des Monolithes.',
      z2Midground3D: '4 strates horizontales de pierre à gauche ↔ 3 cadres de bronze à droite.',
      z1ForegroundHTML: 'Diptyque éditorial cols 1–5 & cols 8–12 laissant respirer l’axe central.',
    },
    autonomousMotion: 'Respiration verticale déphasée millimétrique des strates.',
    scrollChoreography: 'Avancée séquentielle (+0.38m) de chaque volume lors du focus domaine.',
  },
  {
    id: 'projects',
    number: '04',
    codeName: 'SELECTED PROJECTS',
    architecturalSpace: 'La Salle des Monolithes d’Exposition (z = -38m → -64m)',
    narrativeGoal: 'Prouver la capacité de réalisation concrète avec LAURA HOUSE, SassySkin et EtuCo.',
    alignment: 'alternating',
    cameraDesktop: {
      pos: '[-1.25 ↔ +1.25, 1.88, -38.8 → -54.8]',
      target: 'Stèle active (+/-2.15, 2.05, -43.8 / -51.8 / -59.8)',
      fov: '38°',
      movement: 'Travelling d’approche muséal d’une stèle à l’autre avec rotation orbitale ±16°.',
    },
    cameraMobile: {
      pos: '[0.00, 2.00, -39 → -56]',
      fov: '45°',
      adaptation: 'Fiches d’études de cas complètes avec aperçu d’interface intégré et tiroir détail.',
    },
    depthLayers: {
      z3Background: 'Verrières zénithales et colonnade de la nef muséale.',
      z2Midground3D: '3 monolithes pierre/bronze portant les interfaces haute définition en 3D.',
      z1ForegroundHTML: 'Étude de cas alternée gauche/droite (Contexte, Problème, Solution, Rôle, Stack).',
    },
    autonomousMotion: 'Reflet spéculaire doux sur le châssis bronze et le verre antireflet.',
    scrollChoreography: 'Focus successif 01 → 02 → 03 + ouverture tiroir détail (< 240ms ease-out).',
  },
  {
    id: 'process',
    number: '05',
    codeName: 'PROCESS / APPROACH',
    architecturalSpace: 'La Passerelle Séquentielle (z = -64m → -82m)',
    narrativeGoal: 'Rendre tangible la méthode de travail rigoureuse en 6 étapes.',
    alignment: 'sequential',
    cameraDesktop: {
      pos: '[-1.55 → 0.00, 2.45 → 2.12, -65.2 → -77.5]',
      target: '[0.00, 1.65, -75.0 → -85.0]',
      fov: '38°',
      movement: 'Travelling latéral-avant accompagnant l’assemblage mécanique du pont.',
    },
    cameraMobile: {
      pos: '[0.00, 2.45, -66.5]',
      fov: '45°',
      adaptation: 'Progression verticale numérotée 01 → 06 reliée par un filet de bronze continu.',
    },
    depthLayers: {
      z3Background: 'Ouverture lumineuse vers l’horizon du Belvédère.',
      z2Midground3D: '6 dalles en porte-à-faux qui s’alignent horizontalement au fil du scroll.',
      z1ForegroundHTML: '6 jalons méthodologiques concis calés sur le verrouillage des travées.',
    },
    autonomousMotion: 'Scintillement discret des filets d’alignement en laiton.',
    scrollChoreography: 'Verrouillage séquentiel sans rebond (0% overshoot) des paliers 01 à 06.',
  },
  {
    id: 'contact',
    number: '06',
    codeName: 'CONTACT / BELVÉDÈRE',
    architecturalSpace: 'Le Belvédère Ouvert (z = -82m → -96m)',
    narrativeGoal: 'Conclure dans le calme et faciliter une prise de contact professionnelle directe.',
    alignment: 'centered-calm',
    cameraDesktop: {
      pos: '[0.00, 2.05, -83.5 → -86.2]',
      target: '[0.00, 2.00, -96.0]',
      fov: '38°',
      movement: 'Léger recul apaisé stabilisant la composition dans une symétrie ouverte.',
    },
    cameraMobile: {
      pos: '[0.00, 2.10, -85.5]',
      fov: '45°',
      adaptation: 'Carte finale aérée, liens directs accessibles au pouce (≥ 48px hauteur).',
    },
    depthLayers: {
      z3Background: 'Ciel minéral clair et ligne d’horizon dégagée.',
      z2Midground3D: 'Esplanade de pierre calme et garde-corps fin en bronze patiné.',
      z1ForegroundHTML: 'Message final éditorial + E-mail, LinkedIn, GitHub (cols 3–10).',
    },
    autonomousMotion: 'Calme quasi-immobile ; légère brise lumineuse d’horizon.',
    scrollChoreography: 'Décélération douce et stabilisation finale.',
  },
];
