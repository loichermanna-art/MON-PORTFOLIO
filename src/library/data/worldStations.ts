import {
  LIBRARY_COLLECTIONS,
  LIBRARY_SPACES,
  PROCESS_STEPS,
  PROFESSIONAL_INTERNSHIPS,
  PROFILE_IDENTITY,
  SELECTED_PROJECTS,
  SPATIAL_TIMELINE_MILESTONES,
  type LibrarySkillCollection,
  type ProcessMethodStep,
  type ProfessionalInternship,
  type ProjectCaseStudy,
  type TimelineMilestone,
} from '../../data/portfolioData';

export type StationKind =
  | 'identity'
  | 'milestone'
  | 'skill'
  | 'project'
  | 'method'
  | 'contact';

export interface RoomWaypoint3D {
  index: number;
  code: string;
  slug: string;
  hash: string;
  title: string;
  subtitle: string;
  architecturalZone: string;
  /** Z range [zStart, zEnd] where zStart > zEnd (walking forward goes toward -Z) */
  zStart: number;
  zEnd: number;
  /** Default arrival standing spot when navigating to this room */
  entryPosition: [number, number, number];
  /** Default gaze target upon arriving in this room */
  entryLookAt: [number, number, number];
  /** Floor medallion position [x, y, z] */
  medallionPosition: [number, number, number];
}

export interface WorldStation3D {
  id: string;
  roomIndex: number;
  kind: StationKind;
  code: string;
  title: string;
  subtitle: string;
  badge: string;
  /** 3D object root position [x, floorY, z] */
  position: [number, number, number];
  /** Y rotation of the 3D station facing the walkway */
  rotationY: number;
  /** Ideal visitor standing position [x, eyeY, z] when inspecting */
  standPosition: [number, number, number];
  /** Ideal gaze target [x, y, z] when inspecting */
  lookAt: [number, number, number];
  milestone?: TimelineMilestone;
  internship?: ProfessionalInternship;
  skill?: LibrarySkillCollection;
  project?: ProjectCaseStudy;
  methodStep?: ProcessMethodStep;
}

/**
 * Computes floor height Y at any Z coordinate along the 118-meter building.
 * Rooms 01–04 sit at Y = 0.00 m.
 * A gentle architectural limestone ramp between Z = -79.5 m and Z = -84.0 m
 * rises +0.60 m to the Strategy Room (05) and Panoramic Belvedere (06).
 */
export function getFloorElevationAtZ(z: number): number {
  if (z >= -79.5) return 0;
  if (z <= -84.0) return 0.6;
  const t = (-79.5 - z) / (-79.5 - -84.0);
  const smooth = t * t * (3 - 2 * t);
  return smooth * 0.6;
}

export const EYE_HEIGHT_ABOVE_FLOOR = 1.66;

export function getEyeHeightAtZ(z: number): number {
  return getFloorElevationAtZ(z) + EYE_HEIGHT_ABOVE_FLOOR;
}

/**
 * Computes camera yaw & pitch (YXZ Euler order) from a standing eye position
 * to a 3D target point.
 */
export function computeAnglesToTarget(
  eye: [number, number, number],
  target: [number, number, number]
): { yaw: number; pitch: number } {
  const dx = target[0] - eye[0];
  const dy = target[1] - eye[1];
  const dz = target[2] - eye[2];
  const horiz = Math.max(0.001, Math.hypot(dx, dz));
  return {
    yaw: Math.atan2(-dx, -dz),
    pitch: Math.max(-0.62, Math.min(0.62, Math.atan2(dy, horiz))),
  };
}

/**
 * Smooth architectural collision & obstacle avoidance so free-roam walking
 * (ZQSD / Arrows / Click-on-floor) never clips through walls, portal jambs,
 * or central tables.
 */
export function clampWalkablePosition(
  rawX: number,
  rawZ: number
): { x: number; z: number } {
  const z = Math.max(-105.6, Math.min(13.4, rawZ));

  let maxHalfWidth = 3.4;
  if (z > 8.6) {
    // Grand Peristyle Forecourt between the reflecting pools
    maxHalfWidth = 3.85;
  } else if (z > 0.85) {
    maxHalfWidth = 3.25;
  } else if (z >= -0.85) {
    // Open double walnut portal threshold (clear width 3.4 m -> comfortable ±1.48 m eye clearance)
    maxHalfWidth = 1.48;
  } else if (z > -25.0) {
    maxHalfWidth = 3.25;
  } else if (z > -50.0) {
    maxHalfWidth = 5.15;
  } else if (z > -79.5) {
    maxHalfWidth = 5.45;
  } else if (z > -84.0) {
    maxHalfWidth = 3.75;
  } else if (z > -96.0) {
    maxHalfWidth = 4.75;
  } else {
    maxHalfWidth = 5.25;
  }

  let x = Math.max(-maxHalfWidth, Math.min(maxHalfWidth, rawX));

  // Soft circular obstacle repulsion for central furniture & side lecterns
  const obstacles: Array<{ cx: number; cz: number; radius: number }> = [
    // Room 01 Identity Desk on right side
    { cx: 2.25, cz: 4.3, radius: 1.05 },
    // Room 05 Central Walnut Strategy & Chess Table
    { cx: 0, cz: -89.5, radius: 1.65 },
    // Room 06 Central Belvedere Correspondence Desk
    { cx: 0, cz: -103.2, radius: 1.48 },
  ];

  for (const obs of obstacles) {
    const dx = x - obs.cx;
    const dz = z - obs.cz;
    const dist = Math.hypot(dx, dz);
    if (dist < obs.radius) {
      if (dist < 0.001) {
        x = obs.cx - obs.radius;
      } else {
        const push = obs.radius / dist;
        x = obs.cx + dx * push;
      }
      x = Math.max(-maxHalfWidth, Math.min(maxHalfWidth, x));
    }
  }

  return { x, z };
}

export const ROOMS_3D: RoomWaypoint3D[] = [
  {
    index: 0,
    code: LIBRARY_SPACES[0].code,
    slug: LIBRARY_SPACES[0].slug,
    hash: '#entree',
    title: LIBRARY_SPACES[0].title,
    subtitle: LIBRARY_SPACES[0].subtitle,
    architecturalZone: 'Péristyle monumental, Bassins de réflexion & Parvis d’Identité',
    zStart: 14.0,
    zEnd: -1.2,
    entryPosition: [0, 1.66, 11.2],
    entryLookAt: [0, 2.05, -14.0],
    medallionPosition: [0, 0.014, 5.4],
  },
  {
    index: 1,
    code: LIBRARY_SPACES[1].code,
    slug: LIBRARY_SPACES[1].slug,
    hash: '#parcours',
    title: LIBRARY_SPACES[1].title,
    subtitle: LIBRARY_SPACES[1].subtitle,
    architecturalZone: LIBRARY_SPACES[1].architecturalZone,
    zStart: -1.2,
    zEnd: -25.0,
    entryPosition: [0, 1.66, -2.6],
    entryLookAt: [0, 1.7, -20.0],
    medallionPosition: [0, 0.012, -3.2],
  },
  {
    index: 2,
    code: LIBRARY_SPACES[2].code,
    slug: LIBRARY_SPACES[2].slug,
    hash: '#competences',
    title: LIBRARY_SPACES[2].title,
    subtitle: LIBRARY_SPACES[2].subtitle,
    architecturalZone: LIBRARY_SPACES[2].architecturalZone,
    zStart: -25.0,
    zEnd: -50.0,
    entryPosition: [0, 1.66, -26.4],
    entryLookAt: [0, 2.1, -44.0],
    medallionPosition: [0, 0.012, -26.8],
  },
  {
    index: 3,
    code: LIBRARY_SPACES[3].code,
    slug: LIBRARY_SPACES[3].slug,
    hash: '#projets',
    title: LIBRARY_SPACES[3].title,
    subtitle: LIBRARY_SPACES[3].subtitle,
    architecturalZone: LIBRARY_SPACES[3].architecturalZone,
    zStart: -50.0,
    zEnd: -80.0,
    entryPosition: [0, 1.66, -51.4],
    entryLookAt: [-1.4, 2.15, -64.0],
    medallionPosition: [0, 0.012, -51.8],
  },
  {
    index: 4,
    code: LIBRARY_SPACES[4].code,
    slug: LIBRARY_SPACES[4].slug,
    hash: '#methode',
    title: LIBRARY_SPACES[4].title,
    subtitle: LIBRARY_SPACES[4].subtitle,
    architecturalZone: LIBRARY_SPACES[4].architecturalZone,
    zStart: -80.0,
    zEnd: -96.0,
    entryPosition: [0, 2.26, -84.4],
    entryLookAt: [0, 1.75, -91.5],
    medallionPosition: [0, 0.612, -84.8],
  },
  {
    index: 5,
    code: LIBRARY_SPACES[5].code,
    slug: LIBRARY_SPACES[5].slug,
    hash: '#contact',
    title: LIBRARY_SPACES[5].title,
    subtitle: LIBRARY_SPACES[5].subtitle,
    architecturalZone: LIBRARY_SPACES[5].architecturalZone,
    zStart: -96.0,
    zEnd: -108.5,
    entryPosition: [0, 2.26, -98.4],
    entryLookAt: [0, 1.95, -106.0],
    medallionPosition: [0, 0.612, -98.8],
  },
];

export function detectRoomIndexAtZ(z: number): number {
  for (let i = 0; i < ROOMS_3D.length; i++) {
    const r = ROOMS_3D[i];
    if (z <= r.zStart && z > r.zEnd) {
      return i;
    }
  }
  return z > ROOMS_3D[0].zStart ? 0 : ROOMS_3D.length - 1;
}

const internshipByMilestoneId: Record<string, ProfessionalInternship | undefined> = {
  'stage-iacg': PROFESSIONAL_INTERNSHIPS.find((i) => i.id === 'iacg'),
  'stage-drone-groupe': PROFESSIONAL_INTERNSHIPS.find(
    (i) => i.id === 'drone-groupe-ci'
  ),
};

// Build all 24 physical 3D interactive stations across Rooms 01 -> 06
export const WORLD_STATIONS_3D: WorldStation3D[] = [
  // ================= ROOM 01: IDENTITY DESK =================
  {
    id: 'station-identity',
    roomIndex: 0,
    kind: 'identity',
    code: '01 · IDENTITÉ',
    title: PROFILE_IDENTITY.fullName,
    subtitle: 'Cycle Ingénieur Finance (3e année) · INP-HB',
    badge: 'AUDIT · COMPTABILITÉ · DIGITAL',
    position: [2.25, 0, 4.3],
    rotationY: -0.52,
    standPosition: [0.45, 1.66, 5.55],
    lookAt: [2.15, 1.38, 4.3],
  },

  // ================= ROOM 02: 6 TIMELINE STELES =================
  ...SPATIAL_TIMELINE_MILESTONES.map((m, idx): WorldStation3D => {
    const isLeft = idx % 2 === 0;
    const z = -4.5 - idx * 3.55;
    const x = isLeft ? -2.75 : 2.75;
    const rotY = isLeft ? 0.44 : -0.44;
    return {
      id: `station-milestone-${m.id}`,
      roomIndex: 1,
      kind: 'milestone',
      code: `JALON ${m.order}`,
      title: m.title,
      subtitle: `${m.period} · ${m.organization}`,
      badge: m.category.toUpperCase(),
      position: [x, 0, z],
      rotationY: rotY,
      standPosition: [isLeft ? -0.65 : 0.65, 1.66, z + 1.45],
      lookAt: [x, 1.52, z],
      milestone: m,
      internship: internshipByMilestoneId[m.id],
    };
  }),

  // ================= ROOM 03: 6 SKILL COLLECTION PILLARS =================
  ...LIBRARY_COLLECTIONS.map((col, idx): WorldStation3D => {
    const isLeft = idx % 2 === 0;
    const row = Math.floor(idx / 2);
    const z = -29.8 - row * 7.6;
    const x = isLeft ? -3.65 : 3.65;
    const rotY = isLeft ? 0.48 : -0.48;
    return {
      id: `station-skill-${col.id}`,
      roomIndex: 2,
      kind: 'skill',
      code: col.callNumber,
      title: col.title,
      subtitle: col.toolsContext.join(' · '),
      badge: `COLLECTION 0${idx + 1}`,
      position: [x, 0, z],
      rotationY: rotY,
      standPosition: [isLeft ? -1.05 : 1.05, 1.66, z + 1.85],
      lookAt: [x, 1.62, z],
      skill: col,
    };
  }),

  // ================= ROOM 04: 4 GIANT PROJECT EXHIBITION SCREENS =================
  ...SELECTED_PROJECTS.map((proj, idx): WorldStation3D => {
    const isLeft = idx % 2 === 0;
    const z = -55.0 - idx * 6.9;
    const x = isLeft ? -4.15 : 4.15;
    const rotY = isLeft ? 0.52 : -0.52;
    return {
      id: `station-project-${proj.id}`,
      roomIndex: 3,
      kind: 'project',
      code: `PROJET ${proj.index}`,
      title: proj.name,
      subtitle: proj.liveUrlLabel,
      badge: proj.category,
      position: [x, 0, z],
      rotationY: rotY,
      standPosition: [isLeft ? -0.85 : 0.85, 1.66, z + 2.55],
      lookAt: [x, 2.15, z],
      project: proj,
    };
  }),

  // ================= ROOM 05: 6 STRATEGY & METHOD STATIONS =================
  ...PROCESS_STEPS.map((step, idx): WorldStation3D => {
    const isLeft = idx % 2 === 0;
    const row = Math.floor(idx / 2);
    const z = -85.8 - row * 3.7;
    const x = isLeft ? -3.15 : 3.15;
    const rotY = isLeft ? 0.5 : -0.5;
    return {
      id: `station-method-${step.step}`,
      roomIndex: 4,
      kind: 'method',
      code: `COUP ${step.step}`,
      title: step.title,
      subtitle: step.realExample.projectOrContext,
      badge: 'MÉTHODE & STRATÉGIE',
      position: [x, 0.6, z],
      rotationY: rotY,
      standPosition: [isLeft ? -1.85 : 1.85, 2.26, z + 1.45],
      lookAt: [x, 2.08, z],
      methodStep: step,
    };
  }),

  // ================= ROOM 06: BELVEDERE CORRESPONDENCE DESK =================
  {
    id: 'station-contact',
    roomIndex: 5,
    kind: 'contact',
    code: '06 · CONTACT',
    title: 'Correspondance & CV Officiel',
    subtitle: `${PROFILE_IDENTITY.contacts.email} · ${PROFILE_IDENTITY.contacts.phonePrimary}`,
    badge: 'INP-HB · CÔTE D’IVOIRE',
    position: [0, 0.6, -103.2],
    rotationY: 0,
    standPosition: [0, 2.26, -100.1],
    lookAt: [0, 1.88, -103.2],
  },
];

export function getStationById(id: string | null): WorldStation3D | undefined {
  if (!id) return undefined;
  return WORLD_STATIONS_3D.find((s) => s.id === id);
}

export function getStationsForRoom(roomIndex: number): WorldStation3D[] {
  return WORLD_STATIONS_3D.filter((s) => s.roomIndex === roomIndex);
}
