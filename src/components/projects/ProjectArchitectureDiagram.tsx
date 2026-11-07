import type { ProjectCaseStudy } from '../../data/portfolioData';

interface ProjectArchitectureDiagramProps {
  projectId: ProjectCaseStudy['id'];
}

/**
 * Schémas d'architecture vectoriels SVG haute précision (Palette Horizon Monolithique :
 * Blanc pur #FFFFFF, Brume #F2F4F8, Encre Obsidienne #0F1218).
 */
export function ProjectArchitectureDiagram({ projectId }: ProjectArchitectureDiagramProps) {
  if (projectId === 'laura-house') {
    return (
      <svg
        viewBox="0 0 560 180"
        width="100%"
        role="img"
        aria-label="Architecture fonctionnelle LAURA HOUSE : Formulaire client, API Node.js, Génération QR PNG HD"
        style={{
          display: 'block',
          background: '#F2F4F8',
          border: '1px solid rgba(15, 18, 24, 0.12)',
          borderRadius: '10px',
        }}
      >
        <g stroke="#0F1218" strokeOpacity="0.06" strokeWidth="1">
          <line x1="0" y1="45" x2="560" y2="45" />
          <line x1="0" y1="90" x2="560" y2="90" />
          <line x1="0" y1="135" x2="560" y2="135" />
        </g>

        <rect x="24" y="42" width="144" height="96" rx="8" fill="#FFFFFF" stroke="#0F1218" strokeWidth="1.2" />
        <text x="40" y="68" fill="#474E5B" fontSize="10" fontFamily="monospace">01 · RÉSERVATION</text>
        <text x="40" y="90" fill="#0F1218" fontSize="13" fontWeight="600">Application Vite</text>
        <text x="40" y="110" fill="#474E5B" fontSize="11">Parcours participant</text>

        <line x1="168" y1="90" x2="208" y2="90" stroke="#0F1218" strokeWidth="1.5" />
        <polygon points="208,90 201,86 201,94" fill="#0F1218" />

        <rect x="208" y="42" width="148" height="96" rx="8" fill="#FFFFFF" stroke="#0F1218" strokeWidth="1.4" />
        <text x="224" y="68" fill="#474E5B" fontSize="10" fontFamily="monospace">02 · ALLOCATION</text>
        <text x="224" y="90" fill="#0F1218" fontSize="13" fontWeight="600">API Node.js</text>
        <text x="224" y="110" fill="#474E5B" fontSize="11">Unicité &amp; contrôle</text>

        <line x1="356" y1="90" x2="396" y2="90" stroke="#0F1218" strokeWidth="1.5" />
        <polygon points="396,90 389,86 389,94" fill="#0F1218" />

        <rect x="396" y="42" width="140" height="96" rx="8" fill="#0F1218" />
        <text x="412" y="68" fill="#C2CAD6" fontSize="10" fontFamily="monospace">03 · LIVRABLE</text>
        <text x="412" y="90" fill="#FFFFFF" fontSize="13" fontWeight="600">Ticket PNG &amp; QR</text>
        <text x="412" y="110" fill="#C2CAD6" fontSize="11">Export individuel HD</text>
      </svg>
    );
  }

  if (projectId === 'sassyskin') {
    return (
      <svg
        viewBox="0 0 560 180"
        width="100%"
        role="img"
        aria-label="Architecture fonctionnelle SassySkin : Catalogue visuel Skincare, Parcours Mobile-first, Tunnel de commande"
        style={{
          display: 'block',
          background: '#F8EAEC',
          border: '1px solid rgba(15, 18, 24, 0.1)',
          borderRadius: '10px',
        }}
      >
        <rect x="28" y="42" width="152" height="96" rx="8" fill="#FFFFFF" stroke="#0F1218" strokeOpacity="0.2" />
        <text x="44" y="68" fill="#474E5B" fontSize="10" fontFamily="monospace">IDENTITÉ MARQUE</text>
        <text x="44" y="92" fill="#0F1218" fontSize="13" fontWeight="600">Univers Skincare</text>
        <text x="44" y="112" fill="#474E5B" fontSize="11">Hiérarchie éditoriale</text>

        <line x1="180" y1="90" x2="212" y2="90" stroke="#0F1218" strokeWidth="1.4" />

        <rect x="212" y="42" width="144" height="96" rx="8" fill="#FFFFFF" stroke="#0F1218" strokeWidth="1.3" />
        <text x="228" y="68" fill="#474E5B" fontSize="10" fontFamily="monospace">CATALOGUE SOINS</text>
        <text x="228" y="92" fill="#0F1218" fontSize="13" fontWeight="600">Fiches Produits</text>
        <text x="228" y="112" fill="#474E5B" fontSize="11">Lecture Mobile-First</text>

        <line x1="356" y1="90" x2="388" y2="90" stroke="#0F1218" strokeWidth="1.4" />

        <rect x="388" y="42" width="144" height="96" rx="8" fill="#0F1218" />
        <text x="404" y="68" fill="#C2CAD6" fontSize="10" fontFamily="monospace">CONVERSION</text>
        <text x="404" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">Prise de Commande</text>
        <text x="404" y="112" fill="#C2CAD6" fontSize="11">Parcours simplifié</text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 560 180"
      width="100%"
      role="img"
      aria-label="Architecture fonctionnelle EtuCo : Portail institutionnel, Pôles Études-Conseils, Coordination membres"
      style={{
        display: 'block',
        background: '#F2F4F8',
        border: '1px solid rgba(15, 18, 24, 0.12)',
        borderRadius: '10px',
      }}
    >
      <rect x="32" y="32" width="496" height="44" rx="8" fill="#0F1218" />
      <text x="52" y="58" fill="#FFFFFF" fontSize="12" fontWeight="600">
        PORTAIL INSTITUTIONNEL — CLUB ÉTUDES-CONSEILS (EtuCo)
      </text>

      <rect x="32" y="96" width="152" height="56" rx="8" fill="#FFFFFF" stroke="#0F1218" strokeOpacity="0.22" />
      <text x="48" y="120" fill="#474E5B" fontSize="10" fontFamily="monospace">PÔLE 01</text>
      <text x="48" y="138" fill="#0F1218" fontSize="12" fontWeight="600">Missions &amp; Études</text>

      <rect x="204" y="96" width="152" height="56" rx="8" fill="#FFFFFF" stroke="#0F1218" strokeOpacity="0.22" />
      <text x="220" y="120" fill="#474E5B" fontSize="10" fontFamily="monospace">PÔLE 02</text>
      <text x="220" y="138" fill="#0F1218" fontSize="12" fontWeight="600">Gouvernance Club</text>

      <rect x="376" y="96" width="152" height="56" rx="8" fill="#FFFFFF" stroke="#0F1218" strokeOpacity="0.22" />
      <text x="392" y="120" fill="#474E5B" fontSize="10" fontFamily="monospace">PÔLE 03</text>
      <text x="392" y="138" fill="#0F1218" fontSize="12" fontWeight="600">Espace Membres</text>
    </svg>
  );
}
