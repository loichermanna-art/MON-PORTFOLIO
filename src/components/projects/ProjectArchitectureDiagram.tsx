import type { ProjectCaseStudy } from '../../data/portfolioData';

interface ProjectArchitectureDiagramProps {
  projectId: ProjectCaseStudy['id'];
}

/**
 * Schémas d'architecture fonctionnelle « MONUMENTAL CHIAROSCURO » (0 fausse capture d'écran).
 */
export function ProjectArchitectureDiagram({ projectId }: ProjectArchitectureDiagramProps) {
  if (projectId === 'laura-house') {
    return (
      <svg
        viewBox="0 0 560 176"
        width="100%"
        role="img"
        aria-label="Architecture fonctionnelle LAURA HOUSE : Réservation web, API Node.js, Billets QR PNG HD"
        style={{
          display: 'block',
          background: '#0C0F15',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '10px',
        }}
      >
        <rect x="24" y="38" width="144" height="100" rx="8" fill="#141923" stroke="rgba(255,255,255,0.24)" strokeWidth="1" />
        <text x="40" y="66" fill="#96A2B4" fontSize="10" fontFamily="monospace">01 · RÉSERVATION</text>
        <text x="40" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">Application Vite</text>
        <text x="40" y="114" fill="#B8C2D0" fontSize="11">Parcours participant</text>

        <line x1="168" y1="88" x2="208" y2="88" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
        <polygon points="208,88 201,84 201,92" fill="#FFFFFF" />

        <rect x="208" y="38" width="148" height="100" rx="8" fill="#141923" stroke="rgba(255,255,255,0.24)" strokeWidth="1" />
        <text x="224" y="66" fill="#96A2B4" fontSize="10" fontFamily="monospace">02 · ALLOCATION</text>
        <text x="224" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">API Node.js</text>
        <text x="224" y="114" fill="#B8C2D0" fontSize="11">Unicité &amp; contrôle</text>

        <line x1="356" y1="88" x2="396" y2="88" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
        <polygon points="396,88 389,84 389,92" fill="#FFFFFF" />

        <rect x="396" y="38" width="140" height="100" rx="8" fill="#F2F5FA" stroke="#FFFFFF" strokeWidth="1" />
        <text x="412" y="66" fill="#465062" fontSize="10" fontFamily="monospace">03 · LIVRABLE</text>
        <text x="412" y="92" fill="#0A0C10" fontSize="13" fontWeight="700">Ticket PNG &amp; QR</text>
        <text x="412" y="114" fill="#2E3646" fontSize="11">Export individuel HD</text>
      </svg>
    );
  }

  if (projectId === 'sassyskin') {
    return (
      <svg
        viewBox="0 0 560 176"
        width="100%"
        role="img"
        aria-label="Architecture fonctionnelle SassySkin : Identité Skincare, Catalogue produits, Parcours vente"
        style={{
          display: 'block',
          background: '#0C0F15',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '10px',
        }}
      >
        <rect x="28" y="38" width="152" height="100" rx="8" fill="#141923" stroke="rgba(255,255,255,0.24)" />
        <text x="44" y="66" fill="#96A2B4" fontSize="10" fontFamily="monospace">01 · VITRINE</text>
        <text x="44" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">Univers Skincare</text>
        <text x="44" y="114" fill="#B8C2D0" fontSize="11">Soins &amp; Beauté</text>

        <line x1="180" y1="88" x2="212" y2="88" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />

        <rect x="212" y="38" width="144" height="100" rx="8" fill="#141923" stroke="rgba(255,255,255,0.24)" strokeWidth="1" />
        <text x="228" y="66" fill="#96A2B4" fontSize="10" fontFamily="monospace">02 · CATALOGUE</text>
        <text x="228" y="92" fill="#FFFFFF" fontSize="13" fontWeight="600">Fiches Produits</text>
        <text x="228" y="114" fill="#B8C2D0" fontSize="11">Mobile-First</text>

        <line x1="356" y1="88" x2="388" y2="88" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />

        <rect x="388" y="38" width="144" height="100" rx="8" fill="#F2F5FA" stroke="#FFFFFF" strokeWidth="1" />
        <text x="404" y="66" fill="#465062" fontSize="10" fontFamily="monospace">03 · CONVERSION</text>
        <text x="404" y="92" fill="#0A0C10" fontSize="13" fontWeight="700">Parcours Vente</text>
        <text x="404" y="114" fill="#2E3646" fontSize="11">Commande fluide</text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 560 176"
      width="100%"
      role="img"
      aria-label="Architecture fonctionnelle EtuCo : Environnement numérique du Club Études-Conseils"
      style={{
        display: 'block',
        background: '#0C0F15',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '10px',
      }}
    >
      <rect x="32" y="26" width="496" height="44" rx="8" fill="#F2F5FA" />
      <text x="52" y="53" fill="#0A0C10" fontSize="12" fontWeight="700">
        ENVIRONNEMENT NUMÉRIQUE — CLUB ÉTUDES-CONSEILS (EtuCo)
      </text>

      <rect x="32" y="92" width="152" height="58" rx="8" fill="#141923" stroke="rgba(255,255,255,0.22)" />
      <text x="48" y="116" fill="#96A2B4" fontSize="10" fontFamily="monospace">AXE 01</text>
      <text x="48" y="136" fill="#FFFFFF" fontSize="12" fontWeight="600">Études &amp; Missions</text>

      <rect x="204" y="92" width="152" height="58" rx="8" fill="#141923" stroke="rgba(255,255,255,0.22)" />
      <text x="220" y="116" fill="#96A2B4" fontSize="10" fontFamily="monospace">AXE 02</text>
      <text x="220" y="136" fill="#FFFFFF" fontSize="12" fontWeight="600">Organisation Club</text>

      <rect x="376" y="92" width="152" height="58" rx="8" fill="#141923" stroke="rgba(255,255,255,0.22)" />
      <text x="392" y="116" fill="#96A2B4" fontSize="10" fontFamily="monospace">AXE 03</text>
      <text x="392" y="136" fill="#FFFFFF" fontSize="12" fontWeight="600">Coordination</text>
    </svg>
  );
}
