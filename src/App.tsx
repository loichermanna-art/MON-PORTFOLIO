import { useCallback, useEffect, useState } from 'react';
import { ArchitecturalHeader } from './components/layout/ArchitecturalHeader';
import { MagneticProjectCursor } from './components/motion/MagneticProjectCursor';
import { SkyZenithIntroLoader } from './components/motion/SkyZenithIntroLoader';
import { ProjectDetailDrawer } from './components/projects/ProjectDetailDrawer';
import type { ProjectCaseStudy } from './data/portfolioData';
import { DesignMockupsGallery } from './mockups/DesignMockupsGallery';
import {
  motionStore,
  setReducedMotionPreference,
  subscribeFocusedProject,
  subscribeReducedMotion,
} from './motion/motionStore';
import { useScrollOrchestrator } from './motion/useScrollOrchestrator';
import { AboutSceneSection } from './sections/AboutSceneSection';
import { ContactSceneSection } from './sections/ContactSceneSection';
import { ExpertiseSceneSection } from './sections/ExpertiseSceneSection';
import { HeroSceneSection } from './sections/HeroSceneSection';
import { ProcessSceneSection } from './sections/ProcessSceneSection';
import { ProjectsSceneSection } from './sections/ProjectsSceneSection';
import { ExperienceCanvas } from './three/ExperienceCanvas';

export function App() {
  const [mode, setMode] = useState<'experience' | 'mockups'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'mockups') return 'mockups';
    }
    return 'experience';
  });

  const [manualReducedMotion, setManualReducedMotion] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(motionStore.reducedMotion);
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);
  const [introReady, setIntroReady] = useState<boolean>(motionStore.reducedMotion);
  const [cursorHoveredProject, setCursorHoveredProject] = useState<boolean>(false);

  useEffect(() => {
    return subscribeReducedMotion((val) => {
      setReducedMotion(val);
      if (val) setIntroReady(true);
    });
  }, []);

  useEffect(() => {
    return subscribeFocusedProject((idx) => {
      setCursorHoveredProject(idx >= 0);
    });
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroReady(true);
  }, []);

  useScrollOrchestrator(mode === 'experience', manualReducedMotion);

  const handleToggleReducedMotion = () => {
    const next = !reducedMotion;
    setManualReducedMotion(next);
    setReducedMotionPreference(next);
  };

  const handleSwitchMode = (nextMode: 'experience' | 'mockups') => {
    setMode(nextMode);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      {mode === 'experience' && (
        <SkyZenithIntroLoader
          reducedMotion={reducedMotion}
          onComplete={handleIntroComplete}
        />
      )}

      <MagneticProjectCursor
        active={mode === 'experience' && cursorHoveredProject && !selectedProject}
        reducedMotion={reducedMotion}
      />

      <ArchitecturalHeader
        mode={mode}
        onSwitchMode={handleSwitchMode}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {mode === 'experience' ? (
        <>
          <ExperienceCanvas onSelectProject={(project) => setSelectedProject(project)} />

          <main id="main-content" className="editorial-layer">
            <HeroSceneSection introReady={introReady} />
            <AboutSceneSection reducedMotion={reducedMotion} />
            <ExpertiseSceneSection />
            <ProjectsSceneSection
              reducedMotion={reducedMotion}
              onSelectProject={(project) => setSelectedProject(project)}
            />
            <ProcessSceneSection />
            <ContactSceneSection />
          </main>
        </>
      ) : (
        <main id="main-content" className="editorial-layer">
          <DesignMockupsGallery onBackToExperience={() => handleSwitchMode('experience')} />
        </main>
      )}

      <ProjectDetailDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
