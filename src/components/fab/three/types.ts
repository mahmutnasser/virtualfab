import type { EquipmentStation, FabRouteWaypoint } from '../../../data/equipment';

export type CameraPoseName =
  | 'OVERVIEW'
  | 'AISLE'
  | 'STATION_APPROACH'
  | 'EQUIPMENT_FOCUS'
  | 'PHOTOREAL_OVERVIEW'
  | 'PHOTOREAL_START'
  | 'PHOTOREAL_DEPOSITION'
  | 'PHOTOREAL_TRACK'
  | 'PHOTOREAL_LITHOGRAPHY'
  | 'PHOTOREAL_METROLOGY'
  | 'PHOTOREAL_ETCH'
  | 'PHOTOREAL_STRIP';

export interface CameraPose {
  name: CameraPoseName;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export type FabRenderMode = 'photoreal-2.5d' | 'procedural-3d';

export interface FabWorldSceneOptions {
  container: HTMLElement;
  initialNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
  onTransitionStart?: () => void;
  onTransitionComplete?: (nodeId: string, viewMode: string) => void;
  reducedMotion?: boolean;
  renderMode?: FabRenderMode;
  showDiagnostics?: boolean;
}

export interface ActiveStationInfo {
  station: EquipmentStation;
  waypoint: FabRouteWaypoint;
  pose: CameraPose;
}
