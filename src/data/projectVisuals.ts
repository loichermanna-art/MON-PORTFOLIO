import { SELECTED_PROJECTS, type ProjectCaseStudy } from './portfolioData';

export interface ProjectVisualMeta {
  imageSrc: string;
  imageAlt: string;
  badgeLabel: string;
  domainLabel: string;
  isLive: boolean;
}

export const PROJECT_VISUALS: Record<ProjectCaseStudy['id'], ProjectVisualMeta> =
  SELECTED_PROJECTS.reduce(
    (acc, project) => {
      const primary = project.visuals[0];
      acc[project.id] = {
        imageSrc: primary.src,
        imageAlt: primary.alt,
        badgeLabel: project.pavilionCode,
        domainLabel: project.liveUrlLabel,
        isLive: true,
      };
      return acc;
    },
    {} as Record<ProjectCaseStudy['id'], ProjectVisualMeta>
  );
