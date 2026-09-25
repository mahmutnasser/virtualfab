import * as THREE from 'three';
import { FAB_EQUIPMENT_STATIONS } from '../../../data/equipment';
import { createCleanroomShell } from './cleanroom-shell';
import {
  createEquipmentModel,
  createFoupCarrier,
  createStationHotspot,
} from './equipment-models';
import {
  createRouteVisualization,
  getStationForNode,
} from './route-graph';
import { CameraRig } from './camera-rig';
import type { FabWorldSceneOptions, FabRenderMode, CameraPoseName } from './types';

export const STATION_PLATES: Record<string, string> = {
  'fab-overview': '/images/plates/fab_overview.jpg',
  overview: '/images/plates/fab_overview.jpg',
  start: '/images/plates/start_foop.jpg',
  deposition: '/images/plates/deposition.jpg',
  coat: '/images/plates/coat_develop_track.jpg',
  lithography: '/images/plates/asml_twinscan.jpg',
  develop: '/images/plates/coat_develop_track.jpg',
  adi: '/images/plates/asml_yieldstar.jpg',
  etch: '/images/plates/etch.jpg',
  aei: '/images/plates/metrology.jpg',
  strip: '/images/plates/strip.jpg',
  repeat: '/images/plates/fab_overview.jpg',
  mobile_overview: '/images/plates/mobile_overview.jpg',
};

/**
 * Controller for the Virtual Fab cleanroom world.
 * Supports dual render modes:
 * - 'photoreal-2.5d' (Default): Hybrid architecture layering photorealistic cleanroom plates,
 *   subtle camera parallax, 3D floor route overlay, and interactive 3D station hotspots.
 * - 'procedural-3d': Procedurally modeled cleanroom shell and modular equipment bays.
 */
export class FabWorldScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraRig: CameraRig;
  private clock = new THREE.Clock();

  public renderMode: FabRenderMode = 'photoreal-2.5d';

  // 2.5D Photoreal Layering
  private plateGroup: THREE.Group | null = null;
  private currentPlateMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null;
  private nextPlateMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null;
  private textureLoader = new THREE.TextureLoader();
  private static readonly MAX_CACHED_TEXTURES = 4;
  private textureCache = new Map<string, THREE.Texture>();
  private pendingTextureLoads = new Map<string, Array<(tex: THREE.Texture) => void>>();
  private activePlatePath = '';
  private isTransitioning = false;
  private transitionProgress = 1;
  private routeGroup25D: THREE.Group | null = null;
  private routePoints: THREE.Vector3[] = [];
  private activeStationMarker: THREE.Mesh | null = null;
  private diagnosticCube: THREE.Mesh | null = null;

  // 3D Procedural elements (preserved for procedural-3d mode)
  private foupCarrier: THREE.Group | null = null;
  private routePathGroup: THREE.Group | null = null;
  private hotspotMeshes: THREE.Object3D[] = [];

  private activeNodeId = 'deposition';
  private currentViewMode: 'fab-overview' | 'station-focus' = 'fab-overview';
  private onSelectNode?: (nodeId: string) => void;
  private onTransitionStart?: () => void;
  private onTransitionComplete?: (nodeId: string, viewMode: string) => void;
  private showDiagnostics = false;
  private reducedMotionMediaQuery: MediaQueryList | null = null;

  private isRunning = false;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  constructor(options: FabWorldSceneOptions) {
    this.container = options.container;
    this.onSelectNode = options.onSelectNode;
    this.onTransitionStart = options.onTransitionStart;
    this.onTransitionComplete = options.onTransitionComplete;
    this.activeNodeId = options.initialNodeId ?? 'deposition';
    this.renderMode = options.renderMode ?? 'photoreal-2.5d';
    this.showDiagnostics = options.showDiagnostics ?? false;

    // 1. Initialize Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c1e33);

    const width = this.container.clientWidth || 1200;
    const height = this.container.clientHeight || 700;
    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);

    // 2. Initialize CameraRig and reduced-motion detection
    this.cameraRig = new CameraRig(this.camera);
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.cameraRig.reducedMotion = options.reducedMotion ?? this.reducedMotionMediaQuery.matches;
      try {
        this.reducedMotionMediaQuery.addEventListener('change', this.handleReducedMotionChange);
      } catch {
        // Fallback for older browsers
        this.reducedMotionMediaQuery.addListener?.(this.handleReducedMotionChange);
      }
    } else if (options.reducedMotion) {
      this.cameraRig.reducedMotion = true;
    }

    // 3. Initialize WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.setAttribute('role', 'img');
    this.renderer.domElement.setAttribute(
      'aria-label',
      'Interactive 3D cleanroom scene showing semiconductor fabrication bays and automated material handling.'
    );

    // 4. Initialize Scene Content based on renderMode
    if (this.renderMode === 'photoreal-2.5d') {
      this.buildPhotoreal25DScene();
    } else {
      this.buildProcedural3DScene();
    }

    // 5. Event Listeners & Resize
    this.setupEventListeners();
    this.setupResizeObserver();

    // 6. Initial Camera Positioning
    if (this.renderMode === 'photoreal-2.5d') {
      this.cameraRig.setPose('PHOTOREAL_OVERVIEW', true);
    } else {
      this.cameraRig.setPose('OVERVIEW', true, this.activeNodeId);
    }

    // 7. Start Animation Loop
    this.start();
  }

  /**
   * Builds the hybrid 2.5D layered photoreal cleanroom scene.
   * Includes high-resolution visual plates, 3D spatial route overlay,
   * subtle parallax, and 3D interactive station hotspots.
   */
  private buildPhotoreal25DScene(): void {
    // Ambient illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(ambientLight);

    // 1. Background Visual Plates Group
    this.plateGroup = new THREE.Group();
    this.plateGroup.name = 'BackgroundPlateLayer';

    // Current primary plate mesh
    const currentMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    this.currentPlateMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), currentMat);
    this.currentPlateMesh.position.set(0, 0, -4.0);
    this.plateGroup.add(this.currentPlateMesh);

    // Secondary plate mesh for smooth cross-fading
    const nextMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.nextPlateMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), nextMat);
    this.nextPlateMesh.position.set(0, 0, -3.99);
    this.plateGroup.add(this.nextPlateMesh);

    this.scene.add(this.plateGroup);

    // Load initial plate texture
    const initialPlatePath =
      this.camera.aspect < 1.0
        ? STATION_PLATES['mobile_overview']
        : STATION_PLATES['fab-overview'];
    this.loadPlateTexture(initialPlatePath, (tex) => {
      if (this.currentPlateMesh) {
        this.currentPlateMesh.material.map = tex;
        this.currentPlateMesh.material.needsUpdate = true;
      }
      this.activePlatePath = initialPlatePath;
    });

    // Bounded texture cache: preload only the likely next station (Deposition)
    this.loadPlateTexture(STATION_PLATES['deposition'], () => {});

    // 2. 3D Route Overlay Layer
    this.build25DRouteOverlay();

    // On mobile viewports, hide nonessential floor overlays behind cards
    const isMobile = this.camera.aspect < 1.0;
    if (this.routeGroup25D) this.routeGroup25D.visible = !isMobile;

    // 4. Temporary runtime verification diagnostic: rotating magenta wireframe cube
    if (this.showDiagnostics) {
      const diagGeom = new THREE.BoxGeometry(0.35, 0.35, 0.35);
      const diagMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
      this.diagnosticCube = new THREE.Mesh(diagGeom, diagMat);
      this.diagnosticCube.name = 'DiagnosticMarker';
      this.diagnosticCube.position.set(-3.2, 1.4, -2.2);
      this.scene.add(this.diagnosticCube);
    }
  }

  private build25DRouteOverlay(): void {
    const routeGroup = new THREE.Group();
    routeGroup.name = 'RouteOverlay3D';

    // Route points aligned to cleanroom floor perspective (receding towards back-right)
    this.routePoints = [
      new THREE.Vector3(-3.4, -1.55, 0.4),  // Start
      new THREE.Vector3(-1.8, -1.58, 0.2),  // Deposition
      new THREE.Vector3(-0.4, -1.60, 0.0),  // Track (Coat)
      new THREE.Vector3(1.0, -1.62, -0.2),  // Lithography
      new THREE.Vector3(1.8, -1.64, -0.4),  // Metrology (ADI)
      new THREE.Vector3(2.5, -1.66, -0.6),  // Etch / Strip
    ];

    // 1. One thin cyan route aligned to the cleanroom floor perspective
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00a6a6,
      transparent: true,
      opacity: 0.35,
    });
    const lineGeom = new THREE.BufferGeometry().setFromPoints(this.routePoints);
    const line = new THREE.Line(lineGeom, lineMat);
    routeGroup.add(line);

    // 2. Subtle directional chevrons pointing along the route segments
    const chevronMat = new THREE.LineBasicMaterial({
      color: 0x00a6a6,
      transparent: true,
      opacity: 0.4,
    });

    for (let i = 0; i < this.routePoints.length - 1; i++) {
      const p1 = this.routePoints[i];
      const p2 = this.routePoints[i + 1];
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const normal = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

      const chevronSize = 0.055;
      const tip = new THREE.Vector3().copy(mid).addScaledVector(dir, chevronSize * 0.6);
      const leftWing = new THREE.Vector3().copy(mid).addScaledVector(dir, -chevronSize * 0.4).addScaledVector(normal, chevronSize * 0.5);
      const rightWing = new THREE.Vector3().copy(mid).addScaledVector(dir, -chevronSize * 0.4).addScaledVector(normal, -chevronSize * 0.5);

      const chevronGeom = new THREE.BufferGeometry().setFromPoints([leftWing, tip, rightWing]);
      const chevronMesh = new THREE.Line(chevronGeom, chevronMat);
      routeGroup.add(chevronMesh);
    }

    // 3. Maximum one active station marker on the floor (restrained flat ring, low opacity)
    const ringGeom = new THREE.RingGeometry(0.06, 0.09, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00a6a6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
    });
    this.activeStationMarker = new THREE.Mesh(ringGeom, ringMat);
    this.activeStationMarker.rotation.x = -Math.PI / 2.3;
    this.activeStationMarker.position.copy(this.routePoints[1]); // Default to Deposition
    routeGroup.add(this.activeStationMarker);

    this.routeGroup25D = routeGroup;
    this.scene.add(routeGroup);
  }

  public update25DRouteOverlay(nodeId: string): void {
    if (!this.routePoints.length || !this.activeStationMarker) return;

    const nodeIndexMap: Record<string, number> = {
      start: 0,
      deposition: 1,
      coat: 2,
      lithography: 3,
      develop: 2, // Revisit to Track
      adi: 4,     // Revisit to Metrology
      etch: 5,
      aei: 4,     // Revisit to Metrology
      strip: 5,
      repeat: 0,
    };

    const targetIdx = nodeIndexMap[nodeId] ?? 1;
    const targetPt = this.routePoints[targetIdx] ?? this.routePoints[1];
    this.activeStationMarker.position.copy(targetPt);
  }

  /**
   * Builds procedural 3D cleanroom scene (preserved for procedural-3d mode).
   */
  private buildProcedural3DScene(): void {
    this.scene.fog = new THREE.Fog(0xecf1f6, 16, 48);

    const { shellGroup, lightsGroup } = createCleanroomShell();
    this.scene.add(shellGroup);
    this.scene.add(lightsGroup);

    const baysGroup = new THREE.Group();
    baysGroup.name = 'EquipmentBays';
    for (const station of Object.values(FAB_EQUIPMENT_STATIONS)) {
      const model = createEquipmentModel(station);
      baysGroup.add(model);

      const hotspot = createStationHotspot(station.id);
      hotspot.position.set(
        station.position[0],
        station.dimensions.height + 0.6,
        station.position[2] + 1.2
      );
      baysGroup.add(hotspot);
      this.hotspotMeshes.push(hotspot);
    }
    this.scene.add(baysGroup);

    this.foupCarrier = createFoupCarrier();
    this.scene.add(this.foupCarrier);
    this.positionFoupAtStation(this.activeNodeId);

    this.updateRouteGuideway();
  }

  private loadPlateTexture(path: string, callback: (tex: THREE.Texture) => void): void {
    if (this.textureCache.has(path)) {
      const tex = this.textureCache.get(path)!;
      // Refresh MRU position in cache map
      this.textureCache.delete(path);
      this.textureCache.set(path, tex);
      callback(tex);
      return;
    }

    // Deduplicate in-flight texture requests
    const pending = this.pendingTextureLoads.get(path);
    if (pending) {
      pending.push(callback);
      return;
    }
    this.pendingTextureLoads.set(path, [callback]);

    this.textureLoader.load(
      path,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;

        this.textureCache.set(path, tex);
        this.pruneTextureCache();

        const callbacks = this.pendingTextureLoads.get(path) ?? [];
        this.pendingTextureLoads.delete(path);
        for (const cb of callbacks) {
          cb(tex);
        }
      },
      undefined,
      (err) => {
        this.pendingTextureLoads.delete(path);
        console.warn(`Failed to load visual plate texture at ${path}:`, err);
      }
    );
  }

  /**
   * Enforces bounded texture cache (max 3-4 unique textures in GPU memory).
   * Safely evicts LRU textures that are not currently displayed on active meshes.
   * Shared textures (Track, Metrology, Overview) are naturally reused.
   */
  private pruneTextureCache(): void {
    if (this.textureCache.size <= FabWorldScene.MAX_CACHED_TEXTURES) {
      return;
    }

    const currentMap = this.currentPlateMesh?.material.map;
    const nextMap = this.nextPlateMesh?.material.map;

    for (const [key, texture] of this.textureCache.entries()) {
      if (this.textureCache.size <= FabWorldScene.MAX_CACHED_TEXTURES) {
        break;
      }
      // Never evict textures currently actively displayed on plate meshes
      if (texture === currentMap || texture === nextMap) {
        continue;
      }
      // Stale texture: dispose from GPU memory and remove from cache
      texture.dispose();
      this.textureCache.delete(key);
    }
  }

  /**
   * Proactively preloads the likely next station plate for seamless, stutter-free transitions.
   * Leverages shared plates (Track for Coat/Develop, Metrology for ADI/AEI, Overview for Repeat).
   */
  private preloadLikelyNextPlate(nodeId: string): void {
    const nextNodeMap: Record<string, string> = {
      overview: 'deposition',
      start: 'deposition',
      deposition: 'coat',
      coat: 'lithography',
      lithography: 'develop',
      develop: 'adi',
      adi: 'etch',
      etch: 'aei',
      aei: 'strip',
      strip: 'repeat',
      repeat: 'overview',
    };
    const nextNode = nextNodeMap[nodeId];
    if (nextNode) {
      const nextPlate = this.getPlateAndPoseForNode(nextNode).platePath;
      this.loadPlateTexture(nextPlate, () => {});
    }
  }

  private handleReducedMotionChange = (e: MediaQueryListEvent | MediaQueryList): void => {
    this.cameraRig.reducedMotion = e.matches;
  };

  private transitionToPlate(targetPath: string): void {
    if (!this.currentPlateMesh || !this.nextPlateMesh) {
      return;
    }

    if (targetPath === this.activePlatePath) {
      if (!this.isTransitioning) {
        this.onTransitionComplete?.(this.activeNodeId, this.currentViewMode);
      }
      return;
    }

    // Preload destination plate before starting camera / crossfade
    this.loadPlateTexture(targetPath, (tex) => {
      if (!this.nextPlateMesh || !this.currentPlateMesh) return;

      this.activePlatePath = targetPath;

      if (this.cameraRig.reducedMotion) {
        // Reduced motion: snap instantly without crossfade
        this.currentPlateMesh.material.map = tex;
        this.currentPlateMesh.material.opacity = 1;
        this.currentPlateMesh.material.needsUpdate = true;
        this.nextPlateMesh.material.opacity = 0;
        this.nextPlateMesh.material.needsUpdate = true;
        this.isTransitioning = false;
        this.transitionProgress = 1;
        this.pruneTextureCache();
        this.preloadLikelyNextPlate(this.activeNodeId);
        this.onTransitionComplete?.(this.activeNodeId, this.currentViewMode);
        return;
      }

      this.nextPlateMesh.material.map = tex;
      this.nextPlateMesh.material.opacity = 0;
      this.nextPlateMesh.material.needsUpdate = true;
      this.isTransitioning = true;
      this.transitionProgress = 0;
      this.onTransitionStart?.();
    });
  }

  private positionFoupAtStation(nodeId: string): void {
    if (!this.foupCarrier) return;
    const station = getStationForNode(nodeId);
    this.foupCarrier.position.set(
      station.position[0] - 0.45,
      0.9,
      station.position[2] + 1.5
    );
  }

  private updateRouteGuideway(): void {
    if (this.routePathGroup) {
      this.scene.remove(this.routePathGroup);
      this.routePathGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      });
    }

    this.routePathGroup = createRouteVisualization(this.activeNodeId);
    this.scene.add(this.routePathGroup);
  }

  private getPlateAndPoseForNode(nodeId: string): { platePath: string; poseName: CameraPoseName } {
    const isMobile = this.camera.aspect < 1.0;
    switch (nodeId) {
      case 'start':
        return {
          platePath: STATION_PLATES['start'],
          poseName: 'PHOTOREAL_START',
        };
      case 'deposition':
        return {
          platePath: STATION_PLATES['deposition'],
          poseName: 'PHOTOREAL_DEPOSITION',
        };
      case 'coat':
      case 'develop':
        return {
          platePath: STATION_PLATES['coat'],
          poseName: 'PHOTOREAL_TRACK',
        };
      case 'lithography':
        return {
          platePath: STATION_PLATES['lithography'],
          poseName: 'PHOTOREAL_LITHOGRAPHY',
        };
      case 'adi':
        return {
          platePath: STATION_PLATES['adi'],
          poseName: 'PHOTOREAL_METROLOGY',
        };
      case 'aei':
      case 'metrology':
        return {
          platePath: STATION_PLATES['aei'],
          poseName: 'PHOTOREAL_METROLOGY',
        };
      case 'etch':
        return {
          platePath: STATION_PLATES['etch'],
          poseName: 'PHOTOREAL_ETCH',
        };
      case 'strip':
        return {
          platePath: STATION_PLATES['strip'],
          poseName: 'PHOTOREAL_STRIP',
        };
      case 'repeat':
      default:
        return {
          platePath: isMobile ? STATION_PLATES['mobile_overview'] : STATION_PLATES['fab-overview'],
          poseName: 'PHOTOREAL_OVERVIEW',
        };
    }
  }

  public setActiveNode(
    nodeId: string,
    pose: 'OVERVIEW' | 'STATION_APPROACH' | 'EQUIPMENT_FOCUS' = 'STATION_APPROACH'
  ): void {
    this.activeNodeId = nodeId;

    if (this.renderMode === 'photoreal-2.5d') {
      const isMobile = this.camera.aspect < 1.0;
      let targetPath = isMobile ? STATION_PLATES['mobile_overview'] : STATION_PLATES['fab-overview'];
      let targetPose: CameraPoseName = 'PHOTOREAL_OVERVIEW';

      if (this.currentViewMode === 'station-focus') {
        if (this.routeGroup25D) this.routeGroup25D.visible = false;

        const resolved = this.getPlateAndPoseForNode(nodeId);
        targetPath = resolved.platePath;
        targetPose = resolved.poseName;
      } else {
        const show3DOverlays = !isMobile;
        if (this.routeGroup25D) this.routeGroup25D.visible = show3DOverlays;
        this.update25DRouteOverlay(nodeId);
      }

      this.transitionToPlate(targetPath);
      this.cameraRig.setPose(targetPose, false, nodeId);
    } else {
      this.positionFoupAtStation(nodeId);
      this.updateRouteGuideway();
      this.cameraRig.setPose(pose, false, nodeId);
    }
  }

  public setViewMode(view: 'fab-overview' | 'station-focus'): void {
    this.currentViewMode = view;

    if (this.renderMode === 'photoreal-2.5d') {
      const isMobile = this.camera.aspect < 1.0;
      if (view === 'fab-overview') {
        const show3DOverlays = !isMobile;
        if (this.routeGroup25D) this.routeGroup25D.visible = show3DOverlays;
        this.update25DRouteOverlay(this.activeNodeId);
        const targetPath = isMobile ? STATION_PLATES['mobile_overview'] : STATION_PLATES['fab-overview'];
        this.transitionToPlate(targetPath);
        this.cameraRig.setPose('PHOTOREAL_OVERVIEW', false);
      } else if (view === 'station-focus') {
        if (this.routeGroup25D) this.routeGroup25D.visible = false;

        const resolved = this.getPlateAndPoseForNode(this.activeNodeId);
        this.transitionToPlate(resolved.platePath);
        this.cameraRig.setPose(resolved.poseName, false, this.activeNodeId);
      }
    } else {
      if (view === 'fab-overview') {
        this.cameraRig.returnToOverview();
      } else if (view === 'station-focus') {
        this.cameraRig.approachNode(this.activeNodeId);
      }
    }
  }

  private setupEventListeners(): void {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('click', this.handleCanvasClick);
    canvas.addEventListener('mousemove', this.handleCanvasMouseMove);
  }

  private handleCanvasClick = (event: MouseEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hotspotMeshes, true);

    if (intersects.length > 0) {
      let current: THREE.Object3D | null = intersects[0].object;
      while (current) {
        if (current.userData && (current.userData.stepId || current.userData.stationId)) {
          const stepId = current.userData.stepId || current.userData.stationId;
          const station = FAB_EQUIPMENT_STATIONS[stepId];
          const primaryStepId = station?.stepIds[0] ?? stepId;
          this.onSelectNode?.(primaryStepId);
          break;
        }
        current = current.parent;
      }
    }
  };

  private handleCanvasMouseMove = (event: MouseEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hotspotMeshes, true);

    this.renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
  };

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
          this.cameraRig.setPose(this.cameraRig.getCurrentPoseName(), false, this.activeNodeId);

          if (this.renderMode === 'photoreal-2.5d') {
            const isMobile = this.camera.aspect < 1.0;
            const show3DOverlays = !isMobile && this.currentViewMode === 'fab-overview';
            if (this.routeGroup25D) this.routeGroup25D.visible = show3DOverlays;

            if (this.currentViewMode === 'fab-overview') {
              const targetPath = isMobile ? STATION_PLATES['mobile_overview'] : STATION_PLATES['fab-overview'];
              this.transitionToPlate(targetPath);
            }
          }
        }
      }
    });

    this.resizeObserver.observe(this.container);
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.tick();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private tick = (): void => {
    if (!this.isRunning) return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Cross-fade Plate Transitions (2.5D mode)
    if (this.renderMode === 'photoreal-2.5d' && this.isTransitioning) {
      if (this.cameraRig.reducedMotion) {
        this.transitionProgress = 1;
      } else {
        // Smoothstep ~500ms cubic hermite easing
        this.transitionProgress += delta * 2.0;
      }

      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
        this.isTransitioning = false;
        if (this.currentPlateMesh && this.nextPlateMesh) {
          this.currentPlateMesh.material.map = this.nextPlateMesh.material.map;
          this.currentPlateMesh.material.opacity = 1;
          this.currentPlateMesh.material.needsUpdate = true;
          this.nextPlateMesh.material.opacity = 0;
          this.nextPlateMesh.material.needsUpdate = true;
        }
        this.pruneTextureCache();
        this.preloadLikelyNextPlate(this.activeNodeId);
        this.onTransitionComplete?.(this.activeNodeId, this.currentViewMode);
      } else {
        const p = this.transitionProgress;
        const eased = p * p * (3 - 2 * p);
        if (this.currentPlateMesh && this.nextPlateMesh) {
          this.nextPlateMesh.material.opacity = eased;
          this.currentPlateMesh.material.opacity = 1 - eased;
          this.nextPlateMesh.material.needsUpdate = true;
          this.currentPlateMesh.material.needsUpdate = true;
        }
      }
    }

    // 2. Camera Rig Update & Subtle Parallax
    this.cameraRig.update(delta);

    if (this.renderMode === 'photoreal-2.5d' && !this.cameraRig.reducedMotion) {
      // Gentle parallax displacement based on mouse pointer
      this.camera.position.x += this.pointer.x * 0.04;
      this.camera.position.y += this.pointer.y * 0.02;
    }

    // 3. Animate Hotspots (gentle pulsing and rotation, disabled under reduced motion)
    if (!this.cameraRig.reducedMotion) {
      for (const hotspot of this.hotspotMeshes) {
        hotspot.rotation.y += delta * 0.8;
        const pulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
        hotspot.scale.set(pulse, pulse, pulse);
      }
    }

    // Temporary diagnostic: rotate magenta wireframe cube
    if (this.diagnosticCube) {
      this.diagnosticCube.rotation.x += delta * 1.5;
      this.diagnosticCube.rotation.y += delta * 2.0;
    }

    // 4. Render
    this.renderer.render(this.scene, this.camera);

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  /**
   * Complete clean disposal of Three.js resources.
   */
  public dispose(): void {
    this.stop();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('click', this.handleCanvasClick);
    canvas.removeEventListener('mousemove', this.handleCanvasMouseMove);

    if (this.reducedMotionMediaQuery) {
      try {
        this.reducedMotionMediaQuery.removeEventListener('change', this.handleReducedMotionChange);
      } catch {
        this.reducedMotionMediaQuery.removeListener?.(this.handleReducedMotionChange);
      }
      this.reducedMotionMediaQuery = null;
    }

    // Dispose cached textures
    for (const tex of this.textureCache.values()) {
      tex.dispose();
    }
    this.textureCache.clear();

    // Dispose all scene objects
    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      }
    });

    this.renderer.dispose();
    if (canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
  }
}
