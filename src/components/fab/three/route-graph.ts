import * as THREE from 'three';
import {
  CLEANROOM_WAYPOINT_ROUTE,
  FAB_EQUIPMENT_STATIONS,
  type FabRouteWaypoint,
} from '../../../data/equipment';

/**
 * Maps any canonical route node to its physical EquipmentStation ID.
 * Key architectural invariant:
 * - EQ-TRACK-01 is visited at 'coat' and revisited at 'develop'.
 * - EQ-METRO-01 is visited at 'adi' and revisited at 'aei'.
 */
export function getStationIdForNode(nodeId: string): string {
  const waypoint = CLEANROOM_WAYPOINT_ROUTE.find((w) => w.id === nodeId);
  if (waypoint) {
    return waypoint.stationId;
  }
  // Fallbacks
  if (nodeId === 'metrology') return 'EQ-METRO-01';
  return 'EQ-DEP-01';
}

export function getWaypointForNode(nodeId: string): FabRouteWaypoint {
  const wp = CLEANROOM_WAYPOINT_ROUTE.find((w) => w.id === nodeId);
  return wp ?? CLEANROOM_WAYPOINT_ROUTE[1]; // fallback to Deposition
}

export function getStationForNode(nodeId: string) {
  const stationId = getStationIdForNode(nodeId);
  return FAB_EQUIPMENT_STATIONS[stationId] ?? FAB_EQUIPMENT_STATIONS['EQ-DEP-01'];
}

/**
 * Procedurally generates the 3D floor route path showing the learner's journey.
 * Renders floor guidance with restrained cyan accents, explicitly connecting
 * physical stations and demonstrating station revisits.
 */
export function createRouteVisualization(activeNodeId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = 'NavigationPath';

  // Extract waypoint floor positions in canonical order
  // Position slightly in front of load ports at y = 0.02
  const points: THREE.Vector3[] = CLEANROOM_WAYPOINT_ROUTE.map((wp) => {
    return new THREE.Vector3(wp.position[0], 0.025, wp.position[2] + 2.2);
  });

  if (points.length < 2) return group;

  // 1. Overall base route guideway line (dim cyan/slate)
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.45,
    linewidth: 2,
  });

  const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
  const baseLine = new THREE.Line(lineGeom, lineMat);
  group.add(baseLine);

  // 2. Active segment highlight
  const activeIndex = CLEANROOM_WAYPOINT_ROUTE.findIndex((w) => w.id === activeNodeId);
  if (activeIndex >= 0 && activeIndex < points.length - 1) {
    const p1 = points[activeIndex];
    const p2 = points[activeIndex + 1];

    const activeGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const activeMat = new THREE.LineBasicMaterial({
      color: 0x00a6a6,
      transparent: true,
      opacity: 0.95,
      linewidth: 4,
    });
    const activeLine = new THREE.Line(activeGeom, activeMat);
    group.add(activeLine);

    // Directional chevron indicator midway along the active segment
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const chevronGeom = new THREE.ConeGeometry(0.18, 0.4, 3);
    const chevronMat = new THREE.MeshBasicMaterial({ color: 0x00a6a6 });
    const chevron = new THREE.Mesh(chevronGeom, chevronMat);
    chevron.position.copy(mid);
    chevron.position.y = 0.04;

    // Orient chevron toward p2
    const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
    chevron.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    group.add(chevron);
  }

  // 3. Station floor nodes
  const nodeGeom = new THREE.RingGeometry(0.2, 0.28, 16);
  const nodeMat = new THREE.MeshBasicMaterial({
    color: 0x00a6a6,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
  });

  points.forEach((pt, idx) => {
    const isCurrent = idx === activeIndex;
    const marker = new THREE.Mesh(
      nodeGeom,
      isCurrent
        ? new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
        : nodeMat,
    );
    marker.rotation.x = -Math.PI / 2;
    marker.position.copy(pt);
    group.add(marker);
  });

  return group;
}
