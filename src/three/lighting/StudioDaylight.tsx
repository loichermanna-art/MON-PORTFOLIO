import { Environment, Lightformer } from '@react-three/drei';

interface StudioDaylightProps {
  isMobile: boolean;
}

/**
 * Éclairage Architectural Réaliste à « l'Heure Bleue » (Inspiré de la photographie d'architecture
 * contemporaine : Tadao Ando / Peter Zumthor / Foster + Partners) :
 * - Lumière naturelle froide du ciel crépusculaire entrant par l'oculus et les claire-voies.
 * - Lumière muséale rasante neutre (blanc froid naturel #EEF4FC, jamais de bleu électrique saturé)
 *   révélant le micro-relief NormalMap du béton banché et du basalte adouci.
 */
export function StudioDaylight({ isMobile }: StudioDaylightProps) {
  return (
    <>
      <color attach="background" args={['#06101E']} />
      <fogExp2 attach="fog" args={['#071426', 0.0145]} />

      {/* Diffusion zénithale douce d'heure bleue (ombres lisibles mais profondes) */}
      <hemisphereLight
        color="#6E99CC"
        groundColor="#050B14"
        intensity={0.62}
        position={[0, 20, 0]}
      />

      {/* Lumière directionnelle naturelle traversant l'ouverture monumentale */}
      <directionalLight
        position={[6.5, 9.2, -12.0]}
        intensity={2.45}
        color="#E4EFFC"
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={72}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={12}
        shadow-camera-bottom={-4}
        shadow-bias={-0.00025}
        shadow-normalBias={0.02}
      />

      {/* Lumière rasante latérale révélant le grain NormalMap du béton banché */}
      <directionalLight
        position={[-7.5, 6.0, 6.5]}
        intensity={0.48}
        color="#4B74A6"
      />

      {/* Éclairage architectural intérieur rasant (blanc muséal doux, décroissance physique) */}
      <pointLight
        position={[2.6, 4.4, -3.2]}
        intensity={9.5}
        distance={20}
        decay={2}
        color="#DCEBFA"
      />
      <pointLight
        position={[3.6, 3.1, 1.8]}
        intensity={3.2}
        distance={9}
        decay={2}
        color="#E8F1FC"
      />

      {/* Continuité lumineuse naturelle le long de la nef muséale (Scènes 02 -> 06) */}
      <pointLight position={[1.8, 4.6, -18]} intensity={8} distance={22} decay={2} color="#D4E6FA" />
      <pointLight position={[2.0, 4.6, -32]} intensity={9} distance={24} decay={2} color="#D4E6FA" />
      <pointLight position={[2.2, 4.6, -50]} intensity={10} distance={26} decay={2} color="#DDEBFB" />
      <pointLight position={[1.8, 4.6, -72]} intensity={9} distance={24} decay={2} color="#D4E6FA" />
      <pointLight position={[1.2, 5.2, -94]} intensity={16} distance={34} decay={2} color="#E6F1FD" />

      {/* Carte d'environnement PBR sobre et réaliste (aucun cercle fluo artificiel) */}
      <Environment resolution={isMobile ? 128 : 256} frames={1}>
        {/* Horizon naturel d'heure bleue */}
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#CFE3F9"
          position={[4, 3.2, -12]}
          scale={[22, 7, 1]}
        />
        {/* Voûte céleste crépusculaire */}
        <Lightformer
          form="rect"
          intensity={0.85}
          color="#2B5486"
          position={[0, 12, -6]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[32, 32, 1]}
        />
        {/* Rebond latéral doux */}
        <Lightformer
          form="rect"
          intensity={0.45}
          color="#17355B"
          position={[-12, 4, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[28, 10, 1]}
        />
      </Environment>
    </>
  );
}
