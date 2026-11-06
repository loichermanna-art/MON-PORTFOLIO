import { lazy, Suspense, useEffect, useState } from 'react';
import { ArchitecturalHeader } from './components/layout/ArchitecturalHeader';
import { ElevationMeter } from './components/layout/ElevationMeter';
import { MockupsStudioDeck } from './mockups/MockupsStudioDeck';
import { motionStore, subscribeReducedMotion } from './motion/motionStore';
import { useScrollOrchestrator } from './motion/useScrollOrchestrator';
import { AboutSceneSection } from './sections/AboutSceneSection';
import { ContactSceneSection } from './sections/ContactSceneSection';
import { ExpertiseSceneSection } from './sections/ExpertiseSceneSection';
import { HeroSceneSection } from './sections/HeroSceneSection';
import { ProcessSceneSection } from './sections/ProcessSceneSection';
import { ProjectsSceneSection } from './sections/ProjectsSceneSection';
import { WebGLFallback } from './three/WebGLFallback';

const ExperienceCanvas = lazy(() =>
  import('./three/ExperienceCanvas').then((m) => ({ default: m.ExperienceCanvas }))
);

export function App() {
  const [mode, setMode] = useState<'experience' | 'mockups'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'mockups') return 'mockups';
    }
    return 'experience';
  });

  const [manualReduced, setManualReduced] = useState<boolean | null>(null);
  const [reducedActive, setReducedActive] = useState<boolean>(motionStore.reducedMotion);

  useScrollOrchestrator(mode === 'experience', manualReduced);

  useEffect(() => {
    return subscribeReducedMotion((reduced) => setReducedActive(reduced));
  }, []);

  const handleModeSwitch = (nextMode: 'experience' | 'mockups') => {
    setMode(nextMode);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleToggleReducedMotion = () => {
    setManualReduced((prev) => (prev === null ? !reducedActive : !prev));
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <ArchitecturalHeader
        mode={mode}
        onSwitchMode={handleModeSwitch}
        reducedMotion={reducedActive}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      {mode === 'experience' && (
        <>
          <Suspense fallback={<WebGLFallback />}>
            <ExperienceCanvas />
          </Suspense>
          <ElevationMeter />
        </>
      )}

      <main id="main-content" className="editorial-layer">
        {mode === 'experience' ? (
          <>
            <HeroSceneSection />
            <AboutSceneSection />
            <ExpertiseSceneSection />
            <ProjectsSceneSection />
            <ProcessSceneSection />
            <ContactSceneSection onOpenMockups={() => handleModeSwitch('mockups')} />
          </>
        ) : (
          <MockupsStudioDeck onBackToPrototype={() => handleModeSwitch('experience')} />
        )}
      </main>
    </>
  );
}
