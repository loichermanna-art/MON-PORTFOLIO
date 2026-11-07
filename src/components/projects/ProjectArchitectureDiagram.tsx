interface ProjectArchitectureDiagramProps {
  projectId: string;
}

/**
 * Schémas d'architecture fonctionnelle vérifiée des 4 projets en palette « MIDNIGHT BLUE »
 * (#071426 / #102747 / #174477 / #76A9E8 / #E8EDF5 / #FFFFFF).
 */
export function ProjectArchitectureDiagram({ projectId }: ProjectArchitectureDiagramProps) {
  if (projectId === 'sassyskin') {
    return (
      <svg
        viewBox="0 0 600 172"
        role="img"
        aria-label="Flux fonctionnel vérifié de SassySkin : Catalogue double entrée vers Panier et Commande WhatsApp"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '0.45rem',
          background: '#071426',
          border: '1px solid rgba(118, 169, 232, 0.28)',
        }}
      >
        <rect x="20" y="32" width="168" height="108" rx="6" fill="#102747" stroke="#174477" />
        <text x="34" y="58" fill="#76A9E8" fontSize="10" fontFamily="monospace">01 · DÉCOUVERTE</text>
        <text x="34" y="82" fill="#FFFFFF" fontSize="13" fontWeight="600">13 Univers &amp; 13 Cat.</text>
        <text x="34" y="104" fill="#E8EDF5" fontSize="10">Filtres actifs, prix FCFA</text>
        <text x="34" y="122" fill="#A9BCD6" fontSize="10">9 avis photo &amp; 4 guides</text>

        <line x1="188" y1="86" x2="216" y2="86" stroke="#76A9E8" strokeWidth="1.4" />

        <rect x="216" y="32" width="168" height="108" rx="6" fill="#102747" stroke="#174477" />
        <text x="230" y="58" fill="#76A9E8" fontSize="10" fontFamily="monospace">02 · COMMANDE</text>
        <text x="230" y="82" fill="#FFFFFF" fontSize="13" fontWeight="600">Panier &amp; Coordonnées</text>
        <text x="230" y="104" fill="#E8EDF5" fontSize="10">Nom, contact, quartier</text>
        <text x="230" y="122" fill="#A9BCD6" fontSize="10">&amp; repères de livraison</text>

        <line x1="384" y1="86" x2="412" y2="86" stroke="#76A9E8" strokeWidth="1.4" />

        <rect x="412" y="32" width="168" height="108" rx="6" fill="#174477" stroke="#76A9E8" />
        <text x="426" y="58" fill="#E8EDF5" fontSize="10" fontFamily="monospace">03 · CONFIRMATION</text>
        <text x="426" y="82" fill="#FFFFFF" fontSize="13" fontWeight="700">Envoi WhatsApp</text>
        <text x="426" y="104" fill="#E8EDF5" fontSize="10">Validation humaine &amp;</text>
        <text x="426" y="122" fill="#FFFFFF" fontSize="10" fontWeight="600">Paiement à la livraison</text>
      </svg>
    );
  }

  if (projectId === 'ae-ecs') {
    return (
      <svg
        viewBox="0 0 600 172"
        role="img"
        aria-label="Architecture éditoriale multi-pages du portail institutionnel AE-ECS sur Cloudflare Workers"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '0.45rem',
          background: '#071426',
          border: '1px solid rgba(118, 169, 232, 0.28)',
        }}
      >
        <rect x="20" y="22" width="560" height="44" rx="6" fill="#174477" stroke="#76A9E8" />
        <text x="38" y="49" fill="#FFFFFF" fontSize="12" fontWeight="700">
          AE-ECS · Portail Officiel ESCAE — INP-HB (Cloudflare Workers · Zéro pistage)
        </text>

        <rect x="20" y="84" width="130" height="66" rx="6" fill="#102747" stroke="#174477" />
        <text x="32" y="108" fill="#76A9E8" fontSize="10" fontFamily="monospace">FILIÈRE ECS</text>
        <text x="32" y="128" fill="#FFFFFF" fontSize="11" fontWeight="600">Cursus S1–S6</text>
        <text x="32" y="142" fill="#A9BCD6" fontSize="9">Salle Bloomberg</text>

        <rect x="163" y="84" width="130" height="66" rx="6" fill="#102747" stroke="#174477" />
        <text x="175" y="108" fill="#76A9E8" fontSize="10" fontFamily="monospace">7 CLUBS</text>
        <text x="175" y="128" fill="#FFFFFF" fontSize="11" fontWeight="600">Études-Conseils</text>
        <text x="175" y="142" fill="#A9BCD6" fontSize="9">J-ECS, JBC, Info-Promo…</text>

        <rect x="306" y="84" width="130" height="66" rx="6" fill="#102747" stroke="#174477" />
        <text x="318" y="108" fill="#76A9E8" fontSize="10" fontFamily="monospace">5 TEMPS FORTS</text>
        <text x="318" y="128" fill="#FFFFFF" fontSize="11" fontWeight="600">RDL, JEF, GTL</text>
        <text x="318" y="142" fill="#A9BCD6" fontSize="9">Sortie &amp; Debate</text>

        <rect x="449" y="84" width="131" height="66" rx="6" fill="#102747" stroke="#76A9E8" />
        <text x="461" y="108" fill="#76A9E8" fontSize="10" fontFamily="monospace">RÉSEAU 1984</text>
        <text x="461" y="128" fill="#FFFFFF" fontSize="11" fontWeight="600">500+ Alumni</text>
        <text x="461" y="142" fill="#A9BCD6" fontSize="9">35%+ de l’OECCI</text>
      </svg>
    );
  }

  if (projectId === 'laura-house') {
    return (
      <svg
        viewBox="0 0 600 172"
        role="img"
        aria-label="Processus réel de réservation et de validation manuelle Wave de LAURA HOUSE"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '0.45rem',
          background: '#071426',
          border: '1px solid rgba(118, 169, 232, 0.28)',
        }}
      >
        <rect x="16" y="34" width="132" height="104" rx="6" fill="#102747" stroke="#174477" />
        <text x="28" y="58" fill="#76A9E8" fontSize="9.5" fontFamily="monospace">01 · RÉSERVATION</text>
        <text x="28" y="80" fill="#FFFFFF" fontSize="11.5" fontWeight="600">Places &amp; Noms</text>
        <text x="28" y="100" fill="#E8EDF5" fontSize="9.5">Quantités &amp; infos</text>
        <text x="28" y="116" fill="#A9BCD6" fontSize="9.5">des participants</text>

        <line x1="148" y1="86" x2="164" y2="86" stroke="#76A9E8" strokeWidth="1.3" />

        <rect x="164" y="34" width="132" height="104" rx="6" fill="#102747" stroke="#174477" />
        <text x="176" y="58" fill="#76A9E8" fontSize="9.5" fontFamily="monospace">02 · PAIEMENT</text>
        <text x="176" y="80" fill="#FFFFFF" fontSize="11.5" fontWeight="600">Lien Wave</text>
        <text x="176" y="100" fill="#E8EDF5" fontSize="9.5">Lien marchand +</text>
        <text x="176" y="116" fill="#A9BCD6" fontSize="9.5">envoi de preuve</text>

        <line x1="296" y1="86" x2="312" y2="86" stroke="#76A9E8" strokeWidth="1.3" />

        <rect x="312" y="34" width="132" height="104" rx="6" fill="#102747" stroke="#76A9E8" />
        <text x="324" y="58" fill="#76A9E8" fontSize="9.5" fontFamily="monospace">03 · CONTRÔLE</text>
        <text x="324" y="80" fill="#FFFFFF" fontSize="11.5" fontWeight="600">Validation cliente</text>
        <text x="324" y="100" fill="#E8EDF5" fontSize="9.5">Vérification</text>
        <text x="324" y="116" fill="#A9BCD6" fontSize="9.5">manuelle humaine</text>

        <line x1="444" y1="86" x2="460" y2="86" stroke="#76A9E8" strokeWidth="1.3" />

        <rect x="460" y="34" width="124" height="104" rx="6" fill="#174477" stroke="#76A9E8" />
        <text x="472" y="58" fill="#E8EDF5" fontSize="9.5" fontFamily="monospace">04 · ÉMISSION</text>
        <text x="472" y="80" fill="#FFFFFF" fontSize="11.5" fontWeight="700">Billet PNG QR</text>
        <text x="472" y="100" fill="#E8EDF5" fontSize="9.5">QR code unique</text>
        <text x="472" y="116" fill="#FFFFFF" fontSize="9.5">transmis au client</text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 600 172"
      role="img"
      aria-label="Architecture hors-ligne et moteur biomécanique SVG de GYM OS SPORT"
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '0.45rem',
        background: '#071426',
        border: '1px solid rgba(118, 169, 232, 0.28)',
      }}
    >
      <rect x="20" y="32" width="168" height="108" rx="6" fill="#102747" stroke="#174477" />
      <text x="34" y="58" fill="#76A9E8" fontSize="10" fontFamily="monospace">01 · PROFIL &amp; PLAN</text>
      <text x="34" y="82" fill="#FFFFFF" fontSize="13" fontWeight="600">buildProgram()</text>
      <text x="34" y="104" fill="#E8EDF5" fontSize="10">Sèche / Masse / Force</text>
      <text x="34" y="122" fill="#A9BCD6" fontSize="10">3 à 6 séances / sem.</text>

      <line x1="188" y1="86" x2="216" y2="86" stroke="#76A9E8" strokeWidth="1.4" />

      <rect x="216" y="32" width="168" height="108" rx="6" fill="#102747" stroke="#76A9E8" />
      <text x="230" y="58" fill="#76A9E8" fontSize="10" fontFamily="monospace">02 · MOTEUR IK2</text>
      <text x="230" y="82" fill="#FFFFFF" fontSize="13" fontWeight="600">52 Figures SVG</text>
      <text x="230" y="104" fill="#E8EDF5" fontSize="10">pose.ts + render.ts</text>
      <text x="230" y="122" fill="#A9BCD6" fontSize="10">20 muscles · 0 vidéo</text>

      <line x1="384" y1="86" x2="412" y2="86" stroke="#76A9E8" strokeWidth="1.4" />

      <rect x="412" y="32" width="168" height="108" rx="6" fill="#174477" stroke="#76A9E8" />
      <text x="426" y="58" fill="#E8EDF5" fontSize="10" fontFamily="monospace">03 · PWA SALLE</text>
      <text x="426" y="82" fill="#FFFFFF" fontSize="13" fontWeight="700">Séance &amp; Suivi</text>
      <text x="426" y="104" fill="#E8EDF5" fontSize="10">Chrono repos, records</text>
      <text x="426" y="122" fill="#FFFFFF" fontSize="10" fontWeight="600">100 % hors-ligne</text>
    </svg>
  );
}
