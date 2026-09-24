import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FabViewport from '@/components/fab/FabViewport';
import { isWebGLAvailable } from '@/components/fab/three/webgl-detect';
import { getStationIdForNode, getWaypointForNode } from '@/components/fab/three/route-graph';
import { CameraRig } from '@/components/fab/three/camera-rig';
import { createCleanroomShell } from '@/components/fab/three/cleanroom-shell';
import { createEquipmentModel, createFoupCarrier } from '@/components/fab/three/equipment-models';
import { FAB_EQUIPMENT_STATIONS } from '@/data/equipment';
import * as THREE from 'three';

describe('FabViewport & Three.js 3D Fab World (VF-010)', () => {
  describe('WebGL Detection & 2D Fallback', () => {
    it('gracefully renders the approved 2D cleanroom fallback when forceFallback is true', () => {
      render(<FabViewport forceFallback />);
      const fallback = screen.getByTestId('fab-viewport-fallback');
      expect(fallback).toBeDefined();
      expect(screen.getByText('Start')).toBeDefined();
      expect(screen.getByText('Bare silicon wafer')).toBeDefined();
      expect(screen.getByText('CLEANER')).toBeDefined();
    });

    it('respects webgl=false query parameter in isWebGLAvailable()', () => {
      const originalLocation = window.location;
      // Mock window.location.search with ?webgl=false
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...originalLocation, search: '?webgl=false', hash: '' },
      });

      expect(isWebGLAvailable()).toBe(false);

      // Restore
      Object.defineProperty(window, 'location', {
        writable: true,
        value: originalLocation,
      });
    });
  });

  describe('Route Graph & Physical Station Revisits', () => {
    it('maps both coat and develop steps to the shared Track station (EQ-TRACK-01)', () => {
      const coatStationId = getStationIdForNode('coat');
      const developStationId = getStationIdForNode('develop');

      expect(coatStationId).toBe('EQ-TRACK-01');
      expect(developStationId).toBe('EQ-TRACK-01');
    });

    it('maps both ADI and AEI checkpoints to the shared Metrology station (EQ-METRO-01)', () => {
      const adiStationId = getStationIdForNode('adi');
      const aeiStationId = getStationIdForNode('aei');

      expect(adiStationId).toBe('EQ-METRO-01');
      expect(aeiStationId).toBe('EQ-METRO-01');
    });

    it('provides valid waypoint data with 3D camera coordinates for each node', () => {
      const waypoints = ['start', 'deposition', 'coat', 'lithography', 'develop', 'adi', 'etch', 'aei', 'strip'];
      for (const nodeId of waypoints) {
        const wp = getWaypointForNode(nodeId);
        expect(wp).toBeDefined();
        expect(wp.cameraPosition).toHaveLength(3);
        expect(wp.cameraTarget).toHaveLength(3);
      }
    });
  });

  describe('Cleanroom Shell & Equipment Models Procedural Generation', () => {
    it('generates cleanroom shell with reflective floor, ceiling FFUs, and AMHS rails', () => {
      const { shellGroup, lightsGroup } = createCleanroomShell();
      expect(shellGroup).toBeDefined();
      expect(lightsGroup).toBeDefined();
      expect(shellGroup.name).toBe('CleanroomShell');
      expect(lightsGroup.name).toBe('CleanroomLighting');

      // Verify ceiling FFUs, floor, and AMHS rail meshes exist
      const meshCount = shellGroup.children.length;
      expect(meshCount).toBeGreaterThan(10);
    });

    it('generates distinct physical equipment models for each cleanroom station', () => {
      const stations = Object.values(FAB_EQUIPMENT_STATIONS);
      expect(stations.length).toBeGreaterThanOrEqual(7);

      for (const station of stations) {
        const model = createEquipmentModel(station);
        expect(model).toBeDefined();
        expect(model.name).toBe(station.id);
        expect(model.children.length).toBeGreaterThan(0);
      }
    });

    it('generates FOUP carrier with wafer slots', () => {
      const foup = createFoupCarrier();
      expect(foup).toBeDefined();
      expect(foup.name).toBe('FOUP-Carrier');
      expect(foup.children.length).toBeGreaterThan(1);
    });
  });

  describe('CameraRig Named Poses & Damping', () => {
    it('resolves OVERVIEW, AISLE, STATION_APPROACH, and EQUIPMENT_FOCUS poses', () => {
      const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.1, 100);
      const rig = new CameraRig(camera);

      const overviewPose = rig.resolvePose('OVERVIEW');
      expect(overviewPose.name).toBe('OVERVIEW');
      expect(overviewPose.position).toEqual([3.5, 5.5, 9.5]);

      const aislePose = rig.resolvePose('AISLE');
      expect(aislePose.name).toBe('AISLE');
      expect(aislePose.position).toEqual([-10.5, 1.8, 2.0]);

      const lithoApproach = rig.resolvePose('STATION_APPROACH', 'lithography');
      expect(lithoApproach.name).toBe('STATION_APPROACH');
      expect(lithoApproach.position).toEqual(getWaypointForNode('lithography').cameraPosition);

      const metroFocus = rig.resolvePose('EQUIPMENT_FOCUS', 'adi');
      expect(metroFocus.name).toBe('EQUIPMENT_FOCUS');
    });

    it('snaps immediately without interpolation when reducedMotion is active', () => {
      const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.1, 100);
      const rig = new CameraRig(camera);
      rig.reducedMotion = true;

      rig.approachNode('lithography');
      const expectedPos = getWaypointForNode('lithography').cameraPosition;
      expect(camera.position.x).toBeCloseTo(expectedPos[0], 2);
      expect(camera.position.y).toBeCloseTo(expectedPos[1], 2);
      expect(camera.position.z).toBeCloseTo(expectedPos[2], 2);
    });
  });

  describe('Bounded Texture Cache & Shared Plate Reuse', () => {
    it('shares physical plate textures for Track (coat + develop), Metrology (adi + aei), and Overview (overview + repeat)', async () => {
      const { STATION_PLATES } = await import('@/components/fab/three/FabWorldScene');

      expect(STATION_PLATES['coat']).toBe(STATION_PLATES['develop']);
      expect(STATION_PLATES['adi']).toBe(STATION_PLATES['aei']);
      expect(STATION_PLATES['overview']).toBe(STATION_PLATES['repeat']);
      expect(STATION_PLATES['fab-overview']).toBe(STATION_PLATES['repeat']);
    });
  });
});
