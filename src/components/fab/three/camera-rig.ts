import * as THREE from 'three';
import type { CameraPose, CameraPoseName } from './types';
import { getWaypointForNode, getStationForNode } from './route-graph';

export class CameraRig {
  private camera: THREE.PerspectiveCamera;
  private currentTarget = new THREE.Vector3();
  private desiredPosition = new THREE.Vector3();
  private desiredTarget = new THREE.Vector3();
  private currentPoseName: CameraPoseName = 'OVERVIEW';
  public reducedMotion = false;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.setPose('OVERVIEW', true);
  }

  /**
   * Resolves the 3D position and lookAt target for a named camera pose.
   */
  public resolvePose(poseName: CameraPoseName, activeNodeId = 'deposition'): CameraPose {
    const waypoint = getWaypointForNode(activeNodeId);
    const station = getStationForNode(activeNodeId);

    switch (poseName) {
      case 'OVERVIEW':
        if (this.camera.aspect < 1.0) {
          return {
            name: 'OVERVIEW',
            position: [-1.2, 2.6, 6.5],
            target: [2.2, 1.4, -1.8],
            fov: 58,
          };
        }
        return {
          name: 'OVERVIEW',
          position: [3.5, 5.5, 9.5],
          target: [3.5, 1.3, -2.5],
          fov: 48,
        };

      case 'AISLE':
        return {
          name: 'AISLE',
          position: [-10.5, 1.8, 2.0],
          target: [12.0, 1.8, -2.5],
          fov: 52,
        };

      case 'STATION_APPROACH':
        if (this.camera.aspect < 1.0) {
          return {
            name: 'STATION_APPROACH',
            position: [
              waypoint.cameraPosition[0] - 0.4,
              waypoint.cameraPosition[1] + 0.35,
              waypoint.cameraPosition[2] + 0.8,
            ],
            target: [
              waypoint.cameraTarget[0],
              waypoint.cameraTarget[1] + 0.2,
              waypoint.cameraTarget[2],
            ],
            fov: 52,
          };
        }
        return {
          name: 'STATION_APPROACH',
          position: waypoint.cameraPosition,
          target: waypoint.cameraTarget,
          fov: 46,
        };

      case 'EQUIPMENT_FOCUS':
        return {
          name: 'EQUIPMENT_FOCUS',
          position: [
            station.position[0] + 0.6,
            station.position[1] + 0.2,
            station.position[2] + 3.2,
          ],
          target: [
            station.position[0],
            station.position[1] + 0.1,
            station.position[2],
          ],
          fov: 42,
        };

      case 'PHOTOREAL_OVERVIEW':
        if (this.camera.aspect < 1.0) {
          return {
            name: 'PHOTOREAL_OVERVIEW',
            position: [0, 0, 4.8],
            target: [0, 0, 0],
            fov: 54,
          };
        }
        return {
          name: 'PHOTOREAL_OVERVIEW',
          position: [0, 0, 4.5],
          target: [0, 0, 0],
          fov: 48,
        };

      case 'PHOTOREAL_START':
        return {
          name: 'PHOTOREAL_START',
          position: [-0.2, 0.05, 4.35],
          target: [-0.2, 0, 0],
          fov: 46,
        };

      case 'PHOTOREAL_DEPOSITION':
        return {
          name: 'PHOTOREAL_DEPOSITION',
          position: [-0.3, 0.05, 4.3],
          target: [-0.3, 0, 0],
          fov: 46,
        };

      case 'PHOTOREAL_TRACK':
        return {
          name: 'PHOTOREAL_TRACK',
          position: [-0.25, 0.05, 4.3],
          target: [-0.25, 0, 0],
          fov: 46,
        };

      case 'PHOTOREAL_LITHOGRAPHY':
        return {
          name: 'PHOTOREAL_LITHOGRAPHY',
          position: [0.2, 0.05, 4.3],
          target: [0.2, 0, 0],
          fov: 46,
        };

      case 'PHOTOREAL_METROLOGY':
        return {
          name: 'PHOTOREAL_METROLOGY',
          position: [-0.25, 0.05, 4.3],
          target: [-0.25, 0, 0],
          fov: 46,
        };

      case 'PHOTOREAL_ETCH':
        return {
          name: 'PHOTOREAL_ETCH',
          position: [-0.2, 0.05, 4.3],
          target: [-0.2, 0, 0],
          fov: 46,
        };

      case 'PHOTOREAL_STRIP':
        return {
          name: 'PHOTOREAL_STRIP',
          position: [-0.2, 0.05, 4.3],
          target: [-0.2, 0, 0],
          fov: 46,
        };

      default:
        return {
          name: 'OVERVIEW',
          position: [3.5, 5.5, 9.5],
          target: [3.5, 1.3, -2.5],
          fov: 48,
        };
    }
  }

  /**
   * Sets target camera pose. If instant or reducedMotion is active, snaps immediately.
   */
  public setPose(poseName: CameraPoseName, instant = false, activeNodeId = 'deposition'): void {
    this.currentPoseName = poseName;
    const pose = this.resolvePose(poseName, activeNodeId);

    this.desiredPosition.set(...pose.position);
    this.desiredTarget.set(...pose.target);

    if (pose.fov && this.camera.fov !== pose.fov) {
      this.camera.fov = pose.fov;
      this.camera.updateProjectionMatrix();
    }

    if (instant || this.reducedMotion) {
      this.camera.position.copy(this.desiredPosition);
      this.currentTarget.copy(this.desiredTarget);
      this.camera.lookAt(this.currentTarget);
    }
  }

  /**
   * Navigates toward a station node with approach view.
   */
  public approachNode(nodeId: string, instant = false): void {
    this.setPose('STATION_APPROACH', instant, nodeId);
  }

  /**
   * Focuses directly on a station node.
   */
  public focusNode(nodeId: string, instant = false): void {
    this.setPose('EQUIPMENT_FOCUS', instant, nodeId);
  }

  /**
   * Returns camera to global Overview.
   */
  public returnToOverview(instant = false): void {
    this.setPose('OVERVIEW', instant);
  }

  /**
   * Per-frame smooth interpolation update.
   */
  public update(deltaSeconds: number): void {
    if (this.reducedMotion) return;

    // Smooth damping factor
    const damp = Math.min(1, deltaSeconds * 4.5);

    this.camera.position.lerp(this.desiredPosition, damp);
    this.currentTarget.lerp(this.desiredTarget, damp);
    this.camera.lookAt(this.currentTarget);
  }

  public getCurrentPoseName(): CameraPoseName {
    return this.currentPoseName;
  }
}
