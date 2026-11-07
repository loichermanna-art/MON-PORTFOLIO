interface ProjectArchitectureDiagramProps {
  projectId: string;
}

/**
 * Schémas d'architecture fonctionnelle « TWILIGHT ZENITH » (#080F1C / #111F36 / #E8EEF6 / #F2B24B).
 * Basse luminance oculaire, zéro éblouissement et lisibilité vectorielle maximale.
 */
export function ProjectArchitectureDiagram({ projectId }: ProjectArchitectureDiagramProps) {
  if (projectId === 'laura-bio-event') {
    return (
      <svg
        viewBox="0 0 560 176"
        role="img"
        aria-label="Architecture fonctionnelle de la plateforme événementielle Laura Bio Event"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '0.85rem',
          background: '#091221',
          border: '1px solid rgba(195, 207, 224, 0.16)',
        }}
      >
        <rect x="24" y="38" width="144" height="100" rx="10" fill="#101E34" stroke="rgba(195,207,224,0.22)" strokeWidth="1" />
        <text x="40" y="66" fill="#8FA2BC" fontSize="10" fontFamily="monospace">01 · FRONT-END</text>
        <text x="40" y="92" fill="#E8EEF6" fontSize="13" fontWeight="600">Application Vite</text>
        <text x="40" y="114" fill="#C3CFE0" fontSize="10">Inscription &amp; validation</text>

        <line x1="168" y1="88" x2="208" y2="88" stroke="#8FA2BC" strokeWidth="1.3" />
        <polygon points="208,88 201,84 201,92" fill="#8FA2BC" />

        <rect x="208" y="38" width="148" height="100" rx="10" fill="#101E34" stroke="rgba(195,207,224,0.22)" strokeWidth="1" />
        <text x="224" y="66" fill="#8FA2BC" fontSize="10" fontFamily="monospace">02 · BACK-END</text>
        <text x="224" y="92" fill="#E8EEF6" fontSize="13" fontWeight="600">API Node.js</text>
        <text x="224" y="114" fill="#C3CFE0" fontSize="10">Express + SQLite</text>

        <line x1="356" y1="88" x2="396" y2="88" stroke="#F2B24B" strokeWidth="1.5" />
        <polygon points="396,88 389,84 389,92" fill="#F2B24B" />

        <rect x="396" y="38" width="140" height="100" rx="10" fill="#162846" stroke="rgba(242,178,75,0.48)" strokeWidth="1.2" />
        <text x="412" y="66" fill="#F2B24B" fontSize="10" fontFamily="monospace">03 · SORTIE</text>
        <text x="412" y="92" fill="#F8FAFC" fontSize="13" fontWeight="700">Ticket PNG &amp; QR</text>
        <text x="412" y="114" fill="#C3CFE0" fontSize="10">Scan porte temps réel</text>
      </svg>
    );
  }

  if (projectId === 'sassy-cosmetics') {
    return (
      <svg
        viewBox="0 0 560 176"
        role="img"
        aria-label="Architecture du parcours client e-commerce Sassy Cosmetics"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '0.85rem',
          background: '#091221',
          border: '1px solid rgba(195, 207, 224, 0.16)',
        }}
      >
        <rect x="28" y="38" width="152" height="100" rx="10" fill="#101E34" stroke="rgba(195,207,224,0.22)" />
        <text x="44" y="66" fill="#8FA2BC" fontSize="10" fontFamily="monospace">IDENTITÉ</text>
        <text x="44" y="92" fill="#E8EEF6" fontSize="13" fontWeight="600">Univers Skincare</text>
        <text x="44" y="114" fill="#C3CFE0" fontSize="10">Sobriété &amp; désirabilité</text>

        <line x1="180" y1="88" x2="212" y2="88" stroke="#8FA2BC" strokeWidth="1.3" />

        <rect x="212" y="38" width="144" height="100" rx="10" fill="#101E34" stroke="rgba(195,207,224,0.22)" strokeWidth="1" />
        <text x="228" y="66" fill="#8FA2BC" fontSize="10" fontFamily="monospace">CATALOGUE</text>
        <text x="228" y="92" fill="#E8EEF6" fontSize="13" fontWeight="600">Fiches Produits</text>
        <text x="228" y="114" fill="#C3CFE0" fontSize="10">Hiérarchie &amp; rassurance</text>

        <line x1="356" y1="88" x2="388" y2="88" stroke="#F2B24B" strokeWidth="1.5" />

        <rect x="388" y="38" width="144" height="100" rx="10" fill="#162846" stroke="rgba(242,178,75,0.48)" strokeWidth="1.2" />
        <text x="404" y="66" fill="#F2B24B" fontSize="10" fontFamily="monospace">CONVERSION</text>
        <text x="404" y="92" fill="#F8FAFC" fontSize="13" fontWeight="700">Parcours Vente</text>
        <text x="404" y="114" fill="#C3CFE0" fontSize="10">Panier &amp; action directe</text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 560 176"
      role="img"
      aria-label="Architecture institutionnelle du site Junior-Entreprise ETUCO"
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '0.85rem',
        background: '#091221',
        border: '1px solid rgba(195, 207, 224, 0.16)',
      }}
    >
      <rect x="32" y="26" width="496" height="44" rx="10" fill="#162846" stroke="rgba(242,178,75,0.42)" />
      <text x="52" y="53" fill="#F8FAFC" fontSize="12" fontWeight="700">
        ETUCO — Junior-Entreprise · Vitrine Institutionnelle
      </text>

      <rect x="32" y="92" width="152" height="58" rx="10" fill="#101E34" stroke="rgba(195,207,224,0.22)" />
      <text x="48" y="116" fill="#8FA2BC" fontSize="10" fontFamily="monospace">PÔLE 01</text>
      <text x="48" y="136" fill="#E8EEF6" fontSize="12" fontWeight="600">Études &amp; Missions</text>

      <rect x="204" y="92" width="152" height="58" rx="10" fill="#101E34" stroke="rgba(195,207,224,0.22)" />
      <text x="220" y="116" fill="#8FA2BC" fontSize="10" fontFamily="monospace">PÔLE 02</text>
      <text x="220" y="136" fill="#E8EEF6" fontSize="12" fontWeight="600">Organisation Club</text>

      <rect x="376" y="92" width="152" height="58" rx="10" fill="#101E34" stroke="rgba(242,178,75,0.34)" />
      <text x="392" y="116" fill="#F2B24B" fontSize="10" fontFamily="monospace">CONTACT PRO</text>
      <text x="392" y="136" fill="#E8EEF6" fontSize="12" fontWeight="600">Coordination</text>
    </svg>
  );
}
