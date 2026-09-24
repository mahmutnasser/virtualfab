export interface EquipmentStation {
  id: string;
  name: string;
  shortName: string;
  category:
    | 'handling'
    | 'additive'
    | 'track'
    | 'lithography'
    | 'subtractive'
    | 'strip'
    | 'inspection';
  stepIds: string[];
  description: string;
  cleanroomBay: string;
  technologyExamples?: string[];
  exampleMethods?: string[];
  // Three.js spatial layout coordinates (in cleanroom world units / meters)
  dimensions: { width: number; height: number; depth: number };
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  color: string;
  accentColor: string;
  statusLightColor: string;
  realEquipmentReference: string;
}

export const FAB_EQUIPMENT_STATIONS: Record<string, EquipmentStation> = {
  'EQ-START-01': {
    id: 'EQ-START-01',
    name: 'Wafer Load / FOUP Handling',
    shortName: 'FOUP Handling',
    category: 'handling',
    stepIds: ['start'],
    description:
      'Automated material handling system (AMHS) that interfaces with Front Opening Unified Pods (FOUPs) to load 300 mm bare silicon wafers into the fab line.',
    cleanroomBay: 'Bay 0 — Ingress / FOUP Load Port',
    dimensions: { width: 2.2, height: 2.6, depth: 2.0 },
    position: [-10.0, 1.3, -3.0],
    cameraTarget: [-10.0, 1.3, -3.0],
    cameraPosition: [-8.0, 2.0, 0.0],
    color: '#334155',
    accentColor: '#00A6A6',
    statusLightColor: '#10B981',
    realEquipmentReference: '300 mm Automated Material Handling System (AMHS) Load Port',
  },
  'EQ-DEP-01': {
    id: 'EQ-DEP-01',
    name: 'Deposition tool · CVD example',
    shortName: 'Deposition Tool',
    category: 'additive',
    stepIds: ['deposition'],
    description:
      'Multi-chamber chemical vapor deposition system that introduces precursor gases at elevated temperature to deposit thin films across the wafer surface.',
    cleanroomBay: 'Bay 1 — Dielectric & Thin Film Deposition',
    technologyExamples: ['CVD', 'ALD', 'PVD'],
    dimensions: { width: 3.2, height: 2.8, depth: 3.0 },
    position: [-6.0, 1.4, -3.0],
    cameraTarget: [-6.0, 1.4, -3.0],
    cameraPosition: [-4.0, 2.1, 0.5],
    color: '#F4F6F8',
    accentColor: '#00A6A6',
    statusLightColor: '#10B981',
    realEquipmentReference: 'Centura / Producer Platform CVD Multi-Chamber Tool',
  },
  'EQ-TRACK-01': {
    id: 'EQ-TRACK-01',
    name: 'Coater / Developer Track System',
    shortName: 'Coat/Develop Track',
    category: 'track',
    stepIds: ['coat', 'develop'],
    description:
      'Integrated lithography track bay that spin-coats photosensitive resist (Step 2) and rinses away exposed patterns with developer solution (Step 4).',
    cleanroomBay: 'Bay 2 — Lithography Track & Bake',
    dimensions: { width: 4.5, height: 2.5, depth: 2.2 },
    position: [-1.0, 1.25, -3.0],
    cameraTarget: [-1.0, 1.25, -3.0],
    cameraPosition: [1.0, 2.0, 0.5],
    color: '#0F172A',
    accentColor: '#00A6A6',
    statusLightColor: '#10B981',
    realEquipmentReference: 'Clean Track ACT 12 / Lithius Spin Coater Developer',
  },
  'EQ-LITHO-01': {
    id: 'EQ-LITHO-01',
    name: 'Lithography Scanner · DUV/EUV examples',
    shortName: 'Lithography Scanner · DUV/EUV examples',
    category: 'lithography',
    stepIds: ['lithography'],
    description:
      'Generalized optical step-and-scan projection tool that projects circuit stencil patterns from a reticle photomask onto the photosensitive resist layer. The Virtual Fab uses a generalized educational scanner without implying a single tool interchanges DUV and EUV.',
    cleanroomBay: 'Bay 3 — Photolithography Exposure',
    technologyExamples: ['DUV (193nm Immersion)', 'EUV (13.5nm High-NA)'],
    dimensions: { width: 5.2, height: 3.6, depth: 4.8 },
    position: [4.8, 1.75, -3.0],
    cameraTarget: [4.2, 1.6, -2.5],
    cameraPosition: [5.8, 2.4, 4.6],
    color: '#F4F6F8',
    accentColor: '#00A6A6',
    statusLightColor: '#10B981',
    realEquipmentReference: 'Twinscan EUV / DUV High-NA Scanner Monolith Enclosure',
  },
  'EQ-ETCH-01': {
    id: 'EQ-ETCH-01',
    name: 'Reactive Ion Etch (RIE) System',
    shortName: 'Etch Tool',
    category: 'subtractive',
    stepIds: ['etch'],
    description:
      'Inductively coupled plasma dry etching system that uses chemically reactive plasma ions to selectively carve patterns into unprotected films.',
    cleanroomBay: 'Bay 4 — Plasma Etch & Pattern Transfer',
    technologyExamples: ['Inductively Coupled Plasma (ICP)', 'Capacitively Coupled Plasma (CCP)'],
    dimensions: { width: 3.6, height: 2.7, depth: 3.6 },
    position: [10.4, 1.35, -3.0],
    cameraTarget: [9.9, 1.4, -2.5],
    cameraPosition: [11.3, 2.2, 4.0],
    color: '#F4F6F8',
    accentColor: '#00A6A6',
    statusLightColor: '#10B981',
    realEquipmentReference: 'Lam Kiyo / Centris Plasma Dry Etch System',
  },
  'EQ-STRIP-01': {
    id: 'EQ-STRIP-01',
    name: 'Resist Strip Station',
    shortName: 'Resist Strip Station',
    category: 'strip',
    stepIds: ['strip'],
    description:
      'Generalized photoresist removal station that removes the polymeric resist stencil after etching without damaging underlying inorganic layers.',
    cleanroomBay: 'Bay 5 — Photoresist Strip & Cleans',
    exampleMethods: ['Oxygen plasma ashing', 'Wet chemical strip'],
    dimensions: { width: 3.0, height: 2.5, depth: 2.5 },
    position: [15.4, 1.25, -3.0],
    cameraTarget: [14.9, 1.35, -2.5],
    cameraPosition: [16.3, 2.1, 4.0],
    color: '#F4F6F8',
    accentColor: '#00A6A6',
    statusLightColor: '#10B981',
    realEquipmentReference: 'Mattson / Novellus Microwave Oxygen Plasma Ash Chamber',
  },
  'EQ-METRO-01': {
    id: 'EQ-METRO-01',
    name: 'Metrology / Inspection Bay',
    shortName: 'Metrology / Inspection Bay',
    category: 'inspection',
    stepIds: ['adi', 'aei', 'metrology'],
    description:
      'Cross-cutting process-control station visited at multiple checkpoints: After Develop Inspection (ADI) to verify photoresist stencils before destructive etch, and After Etch Inspection (AEI) to verify transferred film patterns.',
    cleanroomBay: 'Bay 6 — Metrology, Inspection & Process Control',
    technologyExamples: ['Critical Dimension SEM (CD-SEM)', 'Optical Overlay Metrology', 'Broadband Optical Defect Inspector'],
    dimensions: { width: 2.6, height: 2.4, depth: 2.2 },
    position: [19.8, 1.2, -3.0],
    cameraTarget: [19.3, 1.3, -2.5],
    cameraPosition: [20.7, 2.1, 4.0],
    color: '#F4F6F8',
    accentColor: '#00A6A6',
    statusLightColor: '#10B981',
    realEquipmentReference: 'Applied Materials VeritySEM / KLA Archer Overlay & Defect Inspector',
  },
};

export interface FabRouteWaypoint {
  id: string;
  name: string;
  type: 'setup' | 'operation' | 'checkpoint' | 'loop';
  stationId: string;
  stationName: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  description: string;
}

/**
 * Authoritative 3D Cleanroom Route Plan for Three.js navigation.
 * Demonstrates authentic interleaved routing: the wafer carrier visits
 * the Metrology station (Bay 6) at ADI (post-develop) and AEI (post-etch).
 */
export const CLEANROOM_WAYPOINT_ROUTE: FabRouteWaypoint[] = [
  {
    id: 'start',
    name: 'Start wafer',
    type: 'setup',
    stationId: 'EQ-START-01',
    stationName: 'Wafer Load / FOUP Handling',
    position: [-10.5, 1.25, -3.0],
    cameraTarget: [-10.9, 1.35, -2.5],
    cameraPosition: [-9.7, 2.1, 4.0],
    description: 'Wafer loaded from FOUP into fab track',
  },
  {
    id: 'deposition',
    name: '1. Deposition',
    type: 'operation',
    stationId: 'EQ-DEP-01',
    stationName: 'Deposition tool · CVD example',
    position: [-6.0, 1.4, -3.0],
    cameraTarget: [-6.4, 1.4, -2.5],
    cameraPosition: [-5.2, 2.2, 4.2],
    description: 'Add dielectric thin film across wafer surface',
  },
  {
    id: 'coat',
    name: '2. Coat Resist',
    type: 'operation',
    stationId: 'EQ-TRACK-01',
    stationName: 'Coater / Developer Track System',
    position: [-1.0, 1.25, -3.0],
    cameraTarget: [-1.4, 1.35, -2.5],
    cameraPosition: [-0.2, 2.1, 4.0],
    description: 'Spin-coat photosensitive resist layer',
  },
  {
    id: 'lithography',
    name: '3. Lithography / Exposure',
    type: 'operation',
    stationId: 'EQ-LITHO-01',
    stationName: 'Lithography Scanner · DUV/EUV examples',
    position: [4.8, 1.75, -3.0],
    cameraTarget: [4.2, 1.6, -2.5],
    cameraPosition: [5.8, 2.4, 4.6],
    description: 'Expose circuit patterns into photoresist',
  },
  {
    id: 'develop',
    name: '4. Develop',
    type: 'operation',
    stationId: 'EQ-TRACK-01',
    stationName: 'Coater / Developer Track System',
    position: [-1.0, 1.25, -3.0],
    cameraTarget: [-1.4, 1.35, -2.5],
    cameraPosition: [-0.2, 2.1, 4.0],
    description: 'Developer removes exposed regions of positive-tone resist',
  },
  {
    id: 'adi',
    name: 'ADI Metrology Checkpoint',
    type: 'checkpoint',
    stationId: 'EQ-METRO-01',
    stationName: 'Metrology / Inspection Bay',
    position: [19.8, 1.2, -3.0],
    cameraTarget: [19.3, 1.3, -2.5],
    cameraPosition: [20.7, 2.1, 4.0],
    description: 'After Develop Inspection: conceptually compare developed resist pattern before etch',
  },
  {
    id: 'etch',
    name: '5. Etch',
    type: 'operation',
    stationId: 'EQ-ETCH-01',
    stationName: 'Reactive Ion Etch (RIE) System',
    position: [10.4, 1.35, -3.0],
    cameraTarget: [9.9, 1.4, -2.5],
    cameraPosition: [11.3, 2.2, 4.0],
    description: 'Transfer resist-defined openings into target dielectric film',
  },
  {
    id: 'aei',
    name: 'AEI Metrology Checkpoint',
    type: 'checkpoint',
    stationId: 'EQ-METRO-01',
    stationName: 'Metrology / Inspection Bay',
    position: [19.8, 1.2, -3.0],
    cameraTarget: [19.3, 1.3, -2.5],
    cameraPosition: [20.7, 2.1, 4.0],
    description: 'After Etch Inspection: conceptual pattern-transfer check after etch',
  },
  {
    id: 'strip',
    name: '6. Strip',
    type: 'operation',
    stationId: 'EQ-STRIP-01',
    stationName: 'Resist Strip Station',
    position: [15.4, 1.25, -3.0],
    cameraTarget: [14.9, 1.35, -2.5],
    cameraPosition: [16.3, 2.1, 4.0],
    description: 'Remove the remaining photoresist mask.',
  },
  {
    id: 'repeat',
    name: 'Repeat Loop',
    type: 'loop',
    stationId: 'EQ-START-01',
    stationName: 'Wafer Load / FOUP Handling',
    position: [-10.5, 1.25, -3.0],
    cameraTarget: [-10.5, 1.25, -3.0],
    cameraPosition: [-8.5, 2.0, 0.5],
    description: 'This patterning cycle is repeated many times while the chip\'s layer stack is built',
  },
];

export function getEquipmentForStep(stepId: string): EquipmentStation | undefined {
  return Object.values(FAB_EQUIPMENT_STATIONS).find((eq) =>
    eq.stepIds.includes(stepId),
  );
}

export function getAllEquipment(): EquipmentStation[] {
  return Object.values(FAB_EQUIPMENT_STATIONS);
}
