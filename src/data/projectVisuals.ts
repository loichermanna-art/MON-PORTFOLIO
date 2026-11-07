import type { ProjectCaseStudy } from './portfolioData';

export interface ProjectVisualMeta {
  imageSrc: string;
  imageAlt: string;
  badgeLabel: string;
  isLive: boolean;
}

export const PROJECT_VISUALS: Record<ProjectCaseStudy['id'], ProjectVisualMeta> = {
  'laura-house': {
    imageSrc: '/projects/work-laura.jpg',
    imageAlt: 'Espace événementiel architectural lumineux illustrant LAURA HOUSE',
    badgeLabel: 'BILLETTERIE QR · HD',
    isLive: true,
  },
  sassyskin: {
    imageSrc: '/projects/work-sassy.jpg',
    imageAlt: 'Flacons de soins botaniques sur pierre naturelle au soleil pour SassySkin',
    badgeLabel: 'SKINCARE · E-COMMERCE',
    isLive: true,
  },
  etuco: {
    imageSrc: '/projects/work-etuco.jpg',
    imageAlt: 'Atrium universitaire vitré baigné de lumière naturelle pour le Club EtuCo INP-HB',
    badgeLabel: 'ÉTUDES-CONSEILS · INP-HB',
    isLive: false,
  },
};
