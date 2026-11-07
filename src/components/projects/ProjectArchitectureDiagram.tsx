import type { ProjectCaseStudy } from '../../data/portfolioData';

interface ProjectArchitectureDiagramProps {
  projectId: ProjectCaseStudy['id'];
}

/**
 * Schémas d'architecture fonctionnelle authentiques « MIDNIGHT BLUE » (0 fausse capture d'écran).
 */
export function ProjectArchitectureDiagram({ projectId }: ProjectArchitectureDiagramProps) {
  if (projectId === 'laura-house') {
    return (
      <svg
        viewBox="0 0 560 180"
        width="100%"
        role="img"
        aria-label="Architecture fonctionnelle LAURA HOUSE : Réservation web, API Node.js, Billets QR PNG HD"
        style={{
          display: 'block',
          background: '#071426',
          border: '1px solid rgba(118, 169, 232, 0.32)',
          borderRadius: '6px',
        }}
      >
        <rect x="24" y="42" width="144" height="96" rx="4" fill="#102747" stroke="#76A9E8" strokeWidth="1.2" />
        <text x="40" y="68" fill="#76A9E8" fontSize="10" fontFamily="monospace">01 · RÉSERVATION</text>
        <text x="40" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">Application Vite</text>
        <text x="40" y="112" fill="#A9BCD6" fontSize="11">Parcours participant</text>

        <line x1="168" y1="90" x2="208" y2="90" stroke="#76A9E8" strokeWidth="1.5" />
        <polygon points="208,90 201,86 201,94" fill="#76A9E8" />

        <rect x="208" y="42" width="148" height="96" rx="4" fill="#102747" stroke="#76A9E8" strokeWidth="1.2" />
        <text x="224" y="68" fill="#76A9E8" fontSize="10" fontFamily="monospace">02 · ALLOCATION</text>
        <text x="224" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">API Node.js</text>
        <text x="224" y="112" fill="#A9BCD6" fontSize="11">Unicité &amp; contrôle</text>

        <line x1="356" y1="90" x2="396" y2="90" stroke="#76A9E8" strokeWidth="1.5" />
        <polygon points="396,90 389,86 389,94" fill="#76A9E8" />

        <rect x="396" y="42" width="140" height="96" rx="4" fill="#174477" stroke="#FFFFFF" strokeWidth="1.2" />
        <text x="412" y="68" fill="#E8EDF5" fontSize="10" fontFamily="monospace">03 · LIVRABLE</text>
        <text x="412" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">Ticket PNG &amp; QR</text>
        <text x="412" y="112" fill="#E8EDF5" fontSize="11">Export individuel HD</text>
      </svg>
    );
  }

  if (projectId === 'sassyskin') {
    return (
      <svg
        viewBox="0 0 560 180"
        width="100%"
        role="img"
        aria-label="Architecture fonctionnelle SassySkin : Identité Skincare, Catalogue produits, Parcours vente"
        style={{
          display: 'block',
          background: '#071426',
          border: '1px solid rgba(118, 169, 232, 0.32)',
          borderRadius: '6px',
        }}
      >
        <rect x="28" y="42" width="152" height="96" rx="4" fill="#102747" stroke="#76A9E8" strokeOpacity="0.6" />
        <text x="44" y="68" fill="#76A9E8" fontSize="10" fontFamily="monospace">01 · VITRINE</text>
        <text x="44" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">Univers Skincare</text>
        <text x="44" y="112" fill="#A9BCD6" fontSize="11">Soins &amp; Beauté</text>

        <line x1="180" y1="90" x2="212" y2="90" stroke="#76A9E8" strokeWidth="1.4" />

        <rect x="212" y="42" width="144" height="96" rx="4" fill="#102747" stroke="#76A9E8" strokeWidth="1.2" />
        <text x="228" y="68" fill="#76A9E8" fontSize="10" fontFamily="monospace">02 · CATALOGUE</text>
        <text x="228" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">Fiches Produits</text>
        <text x="228" y="112" fill="#A9BCD6" fontSize="11">Mobile-First</text>

        <line x1="356" y1="90" x2="388" y2="90" stroke="#76A9E8" strokeWidth="1.4" />

        <rect x="388" y="42" width="144" height="96" rx="4" fill="#174477" stroke="#FFFFFF" strokeWidth="1.2" />
        <text x="404" y="68" fill="#E8EDF5" fontSize="10" fontFamily="monospace">03 · ACTION</text>
        <text x="404" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">Parcours Vente</text>
        <text x="404" y="112" fill="#E8EDF5" fontSize="11">Commande fluide</text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 560 180"
      width="100%"
      role="img"
      aria-label="Architecture fonctionnelle EtuCo : Environnement numérique du Club Études-Conseils"
      style={{
        display: 'block',
        background: '#071426',
        border: '1px solid rgba(118, 169, 232, 0.32)',
        borderRadius: '6px',
      }}
    >
      <rect x="32" y="28" width="496" height="44" rx="4" fill="#174477" stroke="#76A9E8" strokeWidth="1" />
      <text x="52" y="55" fill="#FFFFFF" fontSize="12" fontWeight="600">
        ENVIRONNEMENT NUMÉRIQUE — CLUB ÉTUDES-CONSEILS (EtuCo)
      </text>

      <rect x="32" y="94" width="152" height="58" rx="4" fill="#102747" stroke="#76A9E8" strokeOpacity="0.6" />
      <text x="48" y="118" fill="#76A9E8" fontSize="10" fontFamily="monospace">AXE 01</text>
      <text x="48" y="138" fill="#FFFFFF" fontSize="12" fontWeight="600">Études &amp; Missions</text>

      <rect x="204" y="94" width="152" height="58" rx="4" fill="#102747" stroke="#76A9E8" strokeOpacity="0.6" />
      <text x="220" y="118" fill="#76A9E8" fontSize="10" fontFamily="monospace">AXE 02</text>
      <text x="220" y="138" fill="#FFFFFF" fontSize="12" fontWeight="600">Organisation Club</text>

      <rect x="376" y="94" width="152" height="58" rx="4" fill="#102747" stroke="#76A9E8" strokeOpacity="0.6" />
      <text x="392" y="118" fill="#76A9E8" fontSize="10" fontFamily="monospace">AXE 03</text>
      <text x="392" y="138" fill="#FFFFFF" fontSize="12" fontWeight="600">Coordination</text>
    </svg>
  );
}
