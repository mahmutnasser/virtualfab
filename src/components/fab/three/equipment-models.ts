import * as THREE from 'three';
import type { EquipmentStation } from '../../../data/equipment';

/**
 * Shared cleanroom material palette for realistic semiconductor equipment.
 * Follows real-world fab industrial design: cleanroom off-white powder coating,
 * dark structural plinths, brushed stainless steel handling surfaces, and
 * realistic crystalline silicon wafers (no sci-fi glowing edges).
 */
export class CleanroomMaterials {
  public static whiteEnclosure = new THREE.MeshStandardMaterial({
    color: 0xf4f6f8, // Cleanroom off-white powder-coated steel
    roughness: 0.32,
    metalness: 0.08,
  });

  public static lightGreyBody = new THREE.MeshStandardMaterial({
    color: 0xd6e0ea, // Modular cleanroom cabinet grey
    roughness: 0.35,
    metalness: 0.12,
  });

  public static darkChassis = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Dark industrial structural plinth
    roughness: 0.45,
    metalness: 0.2,
  });

  public static blackBand = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Recessed service / demarcation horizontal band
    roughness: 0.32,
    metalness: 0.3,
  });

  public static metalChrome = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // Brushed stainless steel load-port surfaces
    roughness: 0.22,
    metalness: 0.75,
  });

  public static dockMetal = new THREE.MeshStandardMaterial({
    color: 0x475569, // Stainless steel kinematic pin docking plate
    roughness: 0.25,
    metalness: 0.65,
  });

  public static glassTinted = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7,
    roughness: 0.12,
    transmission: 0.55,
    transparent: true,
    opacity: 0.7,
  });

  public static foupMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b, // Polycarbonate 300mm FOUP body shell
    roughness: 0.2,
    metalness: 0.15,
    transmission: 0.35,
    transparent: true,
    opacity: 0.88,
  });

  // Authentic crystalline silicon wafer: mirror-reflective dark grey/slate metallic disc (NO cyan glow!)
  public static waferSilicon = new THREE.MeshStandardMaterial({
    color: 0x334155, // Dark crystalline silicon
    roughness: 0.12, // High specular mirror finish
    metalness: 0.95, // Highly reflective pure silicon crystal
  });

  // Hotspot cyan reserved strictly for UI interaction affordances (NOT intrinsic to wafers or tools)
  public static hotspotCyan = new THREE.MeshBasicMaterial({
    color: 0x00a6a6,
    transparent: true,
    opacity: 0.85,
  });

  public static statusIndicator = new THREE.MeshBasicMaterial({
    color: 0x10b981, // Cleanroom green status indicator
  });
}

/**
 * Creates standard dual FOUP load-ports (Equipment Front End Module - EFEM).
 * Uses realistic stainless steel docking plates with kinematic locator pins.
 */
function createLoadPorts(): THREE.Group {
  const group = new THREE.Group();

  // Load port base plinth (touches floor at y = 0)
  const plinthGeom = new THREE.BoxGeometry(1.62, 0.08, 0.77);
  const plinth = new THREE.Mesh(plinthGeom, CleanroomMaterials.darkChassis);
  plinth.position.set(0, 0.04, 0.45);
  group.add(plinth);

  // Load port enclosed white cabinet pedestal
  const pedestalGeom = new THREE.BoxGeometry(1.6, 0.76, 0.75);
  const pedestal = new THREE.Mesh(pedestalGeom, CleanroomMaterials.whiteEnclosure);
  pedestal.position.set(0, 0.46, 0.45);
  group.add(pedestal);

  // Top brushed stainless steel docking shelf plate
  const plateGeom = new THREE.BoxGeometry(1.58, 0.03, 0.73);
  const plate = new THREE.Mesh(plateGeom, CleanroomMaterials.metalChrome);
  plate.position.set(0, 0.855, 0.45);
  group.add(plate);

  // Two 300mm docking stations (Port A and Port B)
  for (const xOffset of [-0.45, 0.45]) {
    const dockGeom = new THREE.BoxGeometry(0.55, 0.03, 0.55);
    const dock = new THREE.Mesh(dockGeom, CleanroomMaterials.dockMetal);
    dock.position.set(xOffset, 0.87, 0.45);
    group.add(dock);

    // Front access door / port bezel (dark tinted window inset)
    const portDoorGeom = new THREE.PlaneGeometry(0.46, 0.52);
    const portDoorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
    });
    const portDoor = new THREE.Mesh(portDoorGeom, portDoorMat);
    portDoor.position.set(xOffset, 0.48, 0.83);
    group.add(portDoor);

    // Kinematic locator pins (3 precision stainless steel pins per port)
    for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 3) {
      const pinGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.025, 8);
      const pin = new THREE.Mesh(pinGeom, CleanroomMaterials.metalChrome);
      pin.position.set(
        xOffset + Math.cos(angle) * 0.16,
        0.89,
        0.45 + Math.sin(angle) * 0.16,
      );
      group.add(pin);
    }
  }

  // Overhead laminar mini-environment filter hood
  const hoodGeom = new THREE.BoxGeometry(1.62, 0.18, 0.5);
  const hood = new THREE.Mesh(hoodGeom, CleanroomMaterials.whiteEnclosure);
  hood.position.set(0, 1.85, 0.4);
  group.add(hood);

  return group;
}

/**
 * Creates a restrained industrial 3-tier cleanroom stack light (Red/Amber/Green).
 */
function createSignalTower(height: number): THREE.Group {
  const tower = new THREE.Group();
  const poleGeom = new THREE.CylinderGeometry(0.016, 0.016, 0.45, 8);
  const pole = new THREE.Mesh(poleGeom, CleanroomMaterials.metalChrome);
  pole.position.set(0, height + 0.22, 0);
  tower.add(pole);

  // 3-tier lenses: Green (bottom), Amber (middle), Red (top)
  const lensGeom = new THREE.CylinderGeometry(0.026, 0.026, 0.06, 12);
  
  // Green tier (normal fab operational status)
  const greenMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });
  const greenLens = new THREE.Mesh(lensGeom, greenMat);
  greenLens.position.set(0, height + 0.47, 0);
  tower.add(greenLens);

  // Amber tier
  const amberMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
  });
  const amberLens = new THREE.Mesh(lensGeom, amberMat);
  amberLens.position.set(0, height + 0.54, 0);
  tower.add(amberLens);

  // Red tier
  const redMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.3,
  });
  const redLens = new THREE.Mesh(lensGeom, redMat);
  redLens.position.set(0, height + 0.61, 0);
  tower.add(redLens);

  return tower;
}

/**
 * Creates an operator interface touch terminal on a dark mounting bracket.
 */
function createOperatorTerminal(): THREE.Group {
  const term = new THREE.Group();

  // Articulated mounting arm
  const armGeom = new THREE.BoxGeometry(0.04, 0.35, 0.04);
  const arm = new THREE.Mesh(armGeom, CleanroomMaterials.darkChassis);
  arm.position.set(0, 0, 0);
  term.add(arm);

  // Flat panel monitor housing
  const screenCaseGeom = new THREE.BoxGeometry(0.48, 0.32, 0.04);
  const screenCase = new THREE.Mesh(screenCaseGeom, CleanroomMaterials.darkChassis);
  screenCase.position.set(0, 0.2, 0.04);
  screenCase.rotation.x = -0.15;
  term.add(screenCase);

  // Screen display face
  const screenFaceGeom = new THREE.PlaneGeometry(0.42, 0.26);
  const screenFaceMat = new THREE.MeshBasicMaterial({ color: 0x0f2744 });
  const screenFace = new THREE.Mesh(screenFaceGeom, screenFaceMat);
  screenFace.position.set(0, 0.205, 0.062);
  screenFace.rotation.x = -0.15;
  term.add(screenFace);

  return term;
}

/**
 * EQ-LITHO-01: Flagship Lithography Scanner
 *
 * Real scanner architecture (ASML Twinscan / modern DUV/EUV cleanroom exterior):
 * - Large monolithic white enclosure with flagship scale relative to neighboring equipment
 * - Elongated rectilinear body with segmented vertical service panels
 * - Thin dark horizontal mid-band (no yellow optical band)
 * - Integrated front EFEM wafer handling region with dual 300mm FOUP ports
 * - Operator touch terminal on mounting arm
 * - Clean top roof with flush utility interface boxes and restrained stack light
 * - Completely enclosed exterior (optical path and projection column are internal)
 */
export function createLithographyScanner(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EQ-LITHO-01';

  // 1. Structural dark chassis plinth base
  const plinthGeom = new THREE.BoxGeometry(5.25, 0.22, 4.85);
  const plinth = new THREE.Mesh(plinthGeom, CleanroomMaterials.darkChassis);
  plinth.position.set(0, 0.11, 0);
  group.add(plinth);

  // 2. Main monolithic white scanner enclosure (5.2m wide, 3.5m tall, 4.8m deep)
  const bodyGeom = new THREE.BoxGeometry(5.2, 3.4, 4.8);
  const body = new THREE.Mesh(bodyGeom, CleanroomMaterials.whiteEnclosure);
  body.position.set(0, 1.9, 0);
  group.add(body);

  // 3. Thin dark horizontal service band across the body (y = 1.55m, height 0.16m)
  const bandGeom = new THREE.BoxGeometry(5.22, 0.16, 4.82);
  const band = new THREE.Mesh(bandGeom, CleanroomMaterials.blackBand);
  band.position.set(0, 1.55, 0);
  group.add(band);

  // 4. Segmented vertical service panels (front face seams)
  for (const xSeam of [-1.95, -0.65, 0.65, 1.95]) {
    const seamGeom = new THREE.BoxGeometry(0.02, 3.38, 0.02);
    const seam = new THREE.Mesh(seamGeom, CleanroomMaterials.darkChassis);
    seam.position.set(xSeam, 1.9, 2.41);
    group.add(seam);
  }

  // Segmented vertical service panels (side face seams)
  for (const zSeam of [-1.6, 0, 1.6]) {
    for (const xSide of [-2.61, 2.61]) {
      const seamGeom = new THREE.BoxGeometry(0.02, 3.38, 0.02);
      const seam = new THREE.Mesh(seamGeom, CleanroomMaterials.darkChassis);
      seam.position.set(xSide, 1.9, zSeam);
      group.add(seam);
    }
  }

  // 5. Integrated front EFEM wafer handling interface
  const loadPorts = createLoadPorts();
  loadPorts.position.set(0, 0, 2.2);
  group.add(loadPorts);

  // Operator interface terminal
  const terminal = createOperatorTerminal();
  terminal.position.set(1.4, 1.25, 2.42);
  group.add(terminal);

  // 6. Cleanroom roof utility connection shrouds (exhaust, thermal control hookups)
  const roofBox1Geom = new THREE.BoxGeometry(1.8, 0.22, 2.2);
  const roofBox1 = new THREE.Mesh(roofBox1Geom, CleanroomMaterials.lightGreyBody);
  roofBox1.position.set(-0.8, 3.71, -0.6);
  group.add(roofBox1);

  const roofBox2Geom = new THREE.BoxGeometry(1.2, 0.18, 1.4);
  const roofBox2 = new THREE.Mesh(roofBox2Geom, CleanroomMaterials.lightGreyBody);
  roofBox2.position.set(1.2, 3.69, -0.8);
  group.add(roofBox2);

  // Restrained industrial cleanroom stack light
  const signal = createSignalTower(3.6);
  signal.position.set(2.4, 0, -2.1);
  group.add(signal);

  return group;
}

/**
 * EQ-DEP-01: Chemical Vapor Deposition (CVD) System
 *
 * Real cleanroom CVD tool enclosure (e.g. Applied Materials Centura / Lam Vector style):
 * - Enclosed cleanroom white service cabinet
 * - Front EFEM / dual FOUP load ports
 * - Wider process-module enclosure body behind the front bulkhead
 * - Subtle vertical service panel segmentation
 * - Roof exhaust & utility interface connections
 * - Cluster arrangement is encapsulated internally
 */
export function createDepositionCluster(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EQ-DEP-01';

  // Base plinth
  const plinthGeom = new THREE.BoxGeometry(4.25, 0.2, 3.85);
  const plinth = new THREE.Mesh(plinthGeom, CleanroomMaterials.darkChassis);
  plinth.position.set(0, 0.1, -0.4);
  group.add(plinth);

  // 1. Front EFEM service cabinet bulkhead (width 3.6m, height 2.6m, depth 1.4m)
  const frontGeom = new THREE.BoxGeometry(3.6, 2.5, 1.4);
  const frontBody = new THREE.Mesh(frontGeom, CleanroomMaterials.whiteEnclosure);
  frontBody.position.set(0, 1.35, 0.6);
  group.add(frontBody);

  // 2. Rear wider process-module enclosure body (width 4.2m, height 2.7m, depth 2.6m)
  const rearGeom = new THREE.BoxGeometry(4.2, 2.6, 2.6);
  const rearBody = new THREE.Mesh(rearGeom, CleanroomMaterials.lightGreyBody);
  rearBody.position.set(0, 1.4, -1.3);
  group.add(rearBody);

  // Vertical service panel seams on front bulkhead
  for (const xSeam of [-1.1, 1.1]) {
    const seamGeom = new THREE.BoxGeometry(0.015, 2.48, 0.02);
    const seam = new THREE.Mesh(seamGeom, CleanroomMaterials.darkChassis);
    seam.position.set(xSeam, 1.35, 1.31);
    group.add(seam);
  }

  // Front EFEM Load Ports
  const loadPorts = createLoadPorts();
  loadPorts.position.set(0, 0, 1.15);
  group.add(loadPorts);

  // Operator terminal
  const terminal = createOperatorTerminal();
  terminal.position.set(1.25, 1.15, 1.32);
  group.add(terminal);

  // Roof utility manifold ducting
  const ductGeom = new THREE.BoxGeometry(1.6, 0.2, 1.6);
  const duct = new THREE.Mesh(ductGeom, CleanroomMaterials.metalChrome);
  duct.position.set(0, 2.8, -1.3);
  group.add(duct);

  // Stack light
  const signal = createSignalTower(2.7);
  signal.position.set(1.9, 0, -2.2);
  group.add(signal);

  return group;
}

/**
 * EQ-TRACK-01: Coater / Developer Track System
 *
 * Real track cleanroom enclosure (e.g. Clean Track ACT 12 / Lithius style):
 * - Long modular enclosed body with spin-cup and bake inspection windows
 * - Front EFEM dual load port
 * - Modular bay dividers and clean service panels
 */
export function createTrackSystem(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EQ-TRACK-01';

  // Base plinth
  const plinthGeom = new THREE.BoxGeometry(4.65, 0.2, 2.45);
  const plinth = new THREE.Mesh(plinthGeom, CleanroomMaterials.darkChassis);
  plinth.position.set(0, 0.1, 0);
  group.add(plinth);

  // 1. Long modular track body (4.6m x 2.4m x 2.4m)
  const bodyGeom = new THREE.BoxGeometry(4.6, 2.3, 2.4);
  const body = new THREE.Mesh(bodyGeom, CleanroomMaterials.whiteEnclosure);
  body.position.set(0, 1.25, 0);
  group.add(body);

  // 2. Three modular inspection windows (spin-coat, bake, develop bays)
  const windowGeom = new THREE.BoxGeometry(0.75, 0.42, 0.04);
  for (let i = -1; i <= 1; i++) {
    const xPos = i * 1.35;

    const win = new THREE.Mesh(windowGeom, CleanroomMaterials.glassTinted);
    win.position.set(xPos, 1.6, 1.21);
    group.add(win);

    const frameGeom = new THREE.BoxGeometry(0.82, 0.48, 0.03);
    const frame = new THREE.Mesh(frameGeom, CleanroomMaterials.metalChrome);
    frame.position.set(xPos, 1.6, 1.2);
    group.add(frame);

    // Module divider seam
    if (i < 1) {
      const divGeom = new THREE.BoxGeometry(0.02, 2.28, 0.02);
      const div = new THREE.Mesh(divGeom, CleanroomMaterials.darkChassis);
      div.position.set(xPos + 0.675, 1.25, 1.21);
      group.add(div);
    }
  }

  // Front EFEM Load Ports
  const loadPorts = createLoadPorts();
  loadPorts.position.set(0, 0, 1.05);
  group.add(loadPorts);

  // Operator terminal
  const terminal = createOperatorTerminal();
  terminal.position.set(1.7, 1.15, 1.22);
  group.add(terminal);

  // Stack light
  const signal = createSignalTower(2.4);
  signal.position.set(2.1, 0, -1.0);
  group.add(signal);

  return group;
}

/**
 * EQ-ETCH-01: Reactive Ion Etch (RIE) System
 *
 * Real cleanroom dry etch enclosure (e.g. Lam Kiyo / TEL Tactras style):
 * - Enclosed modular etch system with clean service cabinet exterior
 * - Front EFEM / dual FOUP load ports
 * - Process modules internally housed (no exposed RF plasma chamber on cleanroom face)
 * - Top exhaust ventilation interface
 */
export function createEtchTool(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EQ-ETCH-01';

  // Base plinth
  const plinthGeom = new THREE.BoxGeometry(3.65, 0.2, 3.65);
  const plinth = new THREE.Mesh(plinthGeom, CleanroomMaterials.darkChassis);
  plinth.position.set(0, 0.1, -0.3);
  group.add(plinth);

  // 1. Front EFEM service cabinet (width 3.4m, height 2.6m, depth 1.4m)
  const frontGeom = new THREE.BoxGeometry(3.4, 2.5, 1.4);
  const frontBody = new THREE.Mesh(frontGeom, CleanroomMaterials.whiteEnclosure);
  frontBody.position.set(0, 1.35, 0.6);
  group.add(frontBody);

  // 2. Rear enclosed process cabinet (width 3.6m, height 2.7m, depth 2.4m)
  const rearGeom = new THREE.BoxGeometry(3.6, 2.6, 2.4);
  const rearBody = new THREE.Mesh(rearGeom, CleanroomMaterials.lightGreyBody);
  rearBody.position.set(0, 1.4, -1.2);
  group.add(rearBody);

  // Vertical panel seams
  for (const xSeam of [-1.0, 1.0]) {
    const seamGeom = new THREE.BoxGeometry(0.015, 2.48, 0.02);
    const seam = new THREE.Mesh(seamGeom, CleanroomMaterials.darkChassis);
    seam.position.set(xSeam, 1.35, 1.31);
    group.add(seam);
  }

  // Front EFEM Load Ports
  const loadPorts = createLoadPorts();
  loadPorts.position.set(0, 0, 1.15);
  group.add(loadPorts);

  // Operator terminal
  const terminal = createOperatorTerminal();
  terminal.position.set(1.2, 1.15, 1.32);
  group.add(terminal);

  // Top exhaust ventilation duct shroud
  const ventGeom = new THREE.BoxGeometry(1.4, 0.25, 1.2);
  const vent = new THREE.Mesh(ventGeom, CleanroomMaterials.metalChrome);
  vent.position.set(0, 2.82, -1.2);
  group.add(vent);

  // Stack light
  const signal = createSignalTower(2.7);
  signal.position.set(1.6, 0, -2.1);
  group.add(signal);

  return group;
}

/**
 * EQ-STRIP-01: Resist Strip Station
 *
 * Method-neutral cleanroom strip tool:
 * - Enclosed modular cabinet with cleanroom white finish
 * - Front EFEM load port interface
 * - Vertical panel dividers and top exhaust stack
 * - Strictly method-neutral (no visual fusion of plasma ash and wet strip)
 */
export function createStripTool(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EQ-STRIP-01';

  // Base plinth
  const plinthGeom = new THREE.BoxGeometry(3.1, 0.2, 2.6);
  const plinth = new THREE.Mesh(plinthGeom, CleanroomMaterials.darkChassis);
  plinth.position.set(0, 0.1, 0);
  group.add(plinth);

  // Main enclosure (3.0m x 2.5m x 2.5m)
  const bodyGeom = new THREE.BoxGeometry(3.0, 2.4, 2.5);
  const body = new THREE.Mesh(bodyGeom, CleanroomMaterials.whiteEnclosure);
  body.position.set(0, 1.3, 0);
  group.add(body);

  // Vertical panel seams
  for (const xSeam of [-0.85, 0.85]) {
    const seamGeom = new THREE.BoxGeometry(0.015, 2.38, 0.02);
    const seam = new THREE.Mesh(seamGeom, CleanroomMaterials.darkChassis);
    seam.position.set(xSeam, 1.3, 1.26);
    group.add(seam);
  }

  // Exhaust ventilation interface duct on top
  const exhaustGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16);
  const exhaust = new THREE.Mesh(exhaustGeom, CleanroomMaterials.metalChrome);
  exhaust.position.set(0, 2.75, -0.4);
  group.add(exhaust);

  // Front EFEM Load Ports
  const loadPorts = createLoadPorts();
  loadPorts.position.set(0, 0, 1.1);
  group.add(loadPorts);

  // Operator terminal
  const terminal = createOperatorTerminal();
  terminal.position.set(1.05, 1.15, 1.27);
  group.add(terminal);

  // Stack light
  const signal = createSignalTower(2.5);
  signal.position.set(1.3, 0, -1.1);
  group.add(signal);

  return group;
}

/**
 * EQ-METRO-01: Inline Metrology & Defect Inspection
 *
 * Shared physical precision station visited at ADI and AEI:
 * - Visibly more compact than lithography (width 2.6m, height 2.4m, depth 2.2m)
 * - Solid vibration-controlled granite plinth base with corner pneumatic dampers
 * - Clean, fully enclosed precision instrument housing (no exposed sensor columns)
 * - Front EFEM load port for 300mm wafer loading
 * - Results remain conceptual application-state comparisons
 */
export function createMetrologyTool(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EQ-METRO-01';

  // 1. Granite vibration-isolation plinth base
  const plinthGeom = new THREE.BoxGeometry(2.7, 0.28, 2.3);
  const plinth = new THREE.Mesh(plinthGeom, CleanroomMaterials.darkChassis);
  plinth.position.set(0, 0.14, 0);
  group.add(plinth);

  // Corner pneumatic vibration-isolation damper pads
  for (const [dx, dz] of [
    [-1.2, -1.0],
    [1.2, -1.0],
    [-1.2, 1.0],
    [1.2, 1.0],
  ]) {
    const padGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 12);
    const pad = new THREE.Mesh(padGeom, CleanroomMaterials.metalChrome);
    pad.position.set(dx, 0.06, dz);
    group.add(pad);
  }

  // 2. Precision instrument enclosure body (2.6m wide x 2.3m tall x 2.2m deep)
  const bodyGeom = new THREE.BoxGeometry(2.6, 2.2, 2.2);
  const body = new THREE.Mesh(bodyGeom, CleanroomMaterials.whiteEnclosure);
  body.position.set(0, 1.38, 0);
  group.add(body);

  // Upper enclosed sensor shroud (clean, fully enclosed precision optical/beam head)
  const shroudGeom = new THREE.BoxGeometry(1.4, 0.45, 1.4);
  const shroud = new THREE.Mesh(shroudGeom, CleanroomMaterials.lightGreyBody);
  shroud.position.set(0, 2.6, -0.2);
  group.add(shroud);

  // Front EFEM Load Port
  const loadPorts = createLoadPorts();
  loadPorts.position.set(0, 0, 0.95);
  group.add(loadPorts);

  // Operator inspection terminal
  const terminal = createOperatorTerminal();
  terminal.position.set(0.95, 1.15, 1.12);
  group.add(terminal);

  // Stack light
  const signal = createSignalTower(2.5);
  signal.position.set(1.1, 0, -0.9);
  group.add(signal);

  return group;
}

/**
 * EQ-START-01: Wafer Load / FOUP Handling
 * Automated Material Handling System buffer rack with ingress staging ports.
 */
export function createStartStation(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'EQ-START-01';

  // Base dark plinth (touches floor at y = 0)
  const plinthGeom = new THREE.BoxGeometry(2.25, 0.1, 2.05);
  const plinth = new THREE.Mesh(plinthGeom, CleanroomMaterials.darkChassis);
  plinth.position.set(0, 0.05, 0);
  group.add(plinth);

  // Main cleanroom white staging rack cabinet
  const rackGeom = new THREE.BoxGeometry(2.2, 2.45, 2.0);
  const rack = new THREE.Mesh(rackGeom, CleanroomMaterials.whiteEnclosure);
  rack.position.set(0, 1.32, 0);
  group.add(rack);

  // Upper AMHS overhead track interface guide
  const guideGeom = new THREE.BoxGeometry(2.3, 0.15, 0.4);
  const guide = new THREE.Mesh(guideGeom, CleanroomMaterials.metalChrome);
  guide.position.set(0, 2.55, 0);
  group.add(guide);

  // Dual load staging ports
  const loadPorts = createLoadPorts();
  loadPorts.position.set(0, 0, 0.85);
  group.add(loadPorts);

  // Unpacked 300mm crystalline silicon wafer disc on front load station
  const waferGeom = new THREE.CylinderGeometry(0.26, 0.26, 0.008, 32);
  const wafer = new THREE.Mesh(waferGeom, CleanroomMaterials.waferSilicon);
  wafer.position.set(-0.45, 0.91, 1.3);
  group.add(wafer);

  // Restrained cleanroom stack light
  const signal = createSignalTower(2.5);
  signal.position.set(0.9, 0, -0.8);
  group.add(signal);

  return group;
}

/**
 * 300 mm Front Opening Unified Pod (FOUP) Carrier Model.
 * Renders an authentic dark polycarbonate pod with handle and real crystalline silicon wafers.
 * Strictly uses crystalline silicon mirror finish (NO sci-fi cyan glow!).
 */
export function createFoupCarrier(): THREE.Group {
  const foup = new THREE.Group();
  foup.name = 'FOUP-Carrier';

  // Pod shell (approx 42cm cube with cleanroom bevels)
  const shellGeom = new THREE.BoxGeometry(0.44, 0.4, 0.44);
  const shell = new THREE.Mesh(shellGeom, CleanroomMaterials.foupMaterial);
  shell.position.set(0, 0.22, 0);
  foup.add(shell);

  // AMHS robotic lifting handle on top
  const handleGeom = new THREE.BoxGeometry(0.12, 0.05, 0.24);
  const handle = new THREE.Mesh(handleGeom, CleanroomMaterials.darkChassis);
  handle.position.set(0, 0.44, 0);
  foup.add(handle);

  // Front door gasket / latch line (dark industrial slate, NOT cyan)
  const latchGeom = new THREE.BoxGeometry(0.42, 0.02, 0.01);
  const latch = new THREE.Mesh(latchGeom, CleanroomMaterials.darkChassis);
  latch.position.set(0, 0.22, 0.221);
  foup.add(latch);

  // Internal wafer discs: authentic crystalline silicon mirror discs (NO cyan glow!)
  for (let yOffset = 0.12; yOffset <= 0.28; yOffset += 0.05) {
    const waferGeom = new THREE.CylinderGeometry(0.175, 0.175, 0.008, 32);
    const wafer = new THREE.Mesh(waferGeom, CleanroomMaterials.waferSilicon);
    wafer.position.set(0, yOffset, 0);
    foup.add(wafer);
  }

  return foup;
}

/**
 * Interactive Hotspot Beacon for 3D station selection.
 * Restrained UI interaction affordance positioned above equipment bays.
 */
export function createStationHotspot(stationId: string): THREE.Group {
  const hotspot = new THREE.Group();
  hotspot.name = `hotspot-${stationId}`;
  hotspot.userData = { stationId, isHotspot: true };

  // Outer glowing ring
  const ringGeom = new THREE.TorusGeometry(0.45, 0.03, 8, 32);
  const ring = new THREE.Mesh(ringGeom, CleanroomMaterials.hotspotCyan);
  ring.rotation.x = Math.PI / 2;
  hotspot.add(ring);

  // Inner beacon disc
  const discGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.02, 16);
  const disc = new THREE.Mesh(discGeom, CleanroomMaterials.hotspotCyan);
  hotspot.add(disc);

  // Hover detection hit volume
  const hitGeom = new THREE.SphereGeometry(0.65, 8, 8);
  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const hitMesh = new THREE.Mesh(hitGeom, hitMat);
  hitMesh.userData = { stationId, isHotspotHit: true };
  hotspot.add(hitMesh);

  return hotspot;
}

/**
 * Factory creating the corresponding physical 3D model for any EquipmentStation.
 */
export function createEquipmentModel(station: EquipmentStation): THREE.Group {
  let model: THREE.Group;

  switch (station.id) {
    case 'EQ-START-01':
      model = createStartStation();
      break;
    case 'EQ-DEP-01':
      model = createDepositionCluster();
      break;
    case 'EQ-TRACK-01':
      model = createTrackSystem();
      break;
    case 'EQ-LITHO-01':
      model = createLithographyScanner();
      break;
    case 'EQ-ETCH-01':
      model = createEtchTool();
      break;
    case 'EQ-STRIP-01':
      model = createStripTool();
      break;
    case 'EQ-ADI-01':
      model = createMetrologyTool();
      model.name = 'EQ-ADI-01';
      break;
    case 'EQ-METRO-01':
      model = createMetrologyTool();
      break;
    default:
      model = createDepositionCluster();
      break;
  }

  model.position.set(station.position[0], 0, station.position[2]);
  return model;
}
