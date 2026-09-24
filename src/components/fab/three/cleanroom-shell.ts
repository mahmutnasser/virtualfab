import * as THREE from 'three';

export interface CleanroomShellResult {
  shellGroup: THREE.Group;
  lightsGroup: THREE.Group;
}

/**
 * Creates the authentic semiconductor cleanroom architectural shell.
 * Includes controlled semi-matte polymer floor, modular wall panels,
 * ceiling laminar airflow grid with Fan Filter Units (FFUs), dedicated luminaires,
 * and overhead Automated Material Handling System (AMHS) rails.
 */
export function createCleanroomShell(): CleanroomShellResult {
  const shellGroup = new THREE.Group();
  shellGroup.name = 'CleanroomShell';

  const lightsGroup = new THREE.Group();
  lightsGroup.name = 'CleanroomLighting';

  // 1. Cleanroom Semi-Matte Epoxy/Polymer Floor
  // Bright off-white/light grey cleanroom floor with controlled satin sheen
  const floorGeom = new THREE.PlaneGeometry(64, 36);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xdfe5ec, // Controlled cleanroom light grey epoxy
    roughness: 0.36, // Satin polymer sheen reflecting overhead luminaires
    metalness: 0.02, // Non-metallic epoxy
  });
  const floor = new THREE.Mesh(floorGeom, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(4, 0, 0);
  floor.receiveShadow = true;
  shellGroup.add(floor);

  // Cleanroom aisle navigation demarcation lines (ESD perimeter marking)
  for (const zLine of [1.6, 2.8]) {
    const laneGeom = new THREE.PlaneGeometry(54, 0.04);
    const laneMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.6,
    });
    const lane = new THREE.Mesh(laneGeom, laneMat);
    lane.rotation.x = -Math.PI / 2;
    lane.position.set(4, 0.005, zLine);
    shellGroup.add(lane);
  }

  // Raised access floor perforated air return tiles in front of equipment bays
  // Authentic cleanroom laminar airflow return grilles
  const perfMat = new THREE.MeshStandardMaterial({
    color: 0xa8b4c2,
    roughness: 0.55,
    metalness: 0.35,
  });
  for (let x = -10; x <= 22; x += 4.2) {
    const perfGeom = new THREE.PlaneGeometry(1.2, 0.9);
    const perfTile = new THREE.Mesh(perfGeom, perfMat);
    perfTile.rotation.x = -Math.PI / 2;
    perfTile.position.set(x, 0.008, 0.9);
    shellGroup.add(perfTile);
  }

  // 2. Back Cleanroom Wall with Modular Panel Lines
  const backWallGeom = new THREE.PlaneGeometry(64, 7.5);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9, // Bright cleanroom off-white modular wall
    roughness: 0.45,
    metalness: 0.03,
  });
  const backWall = new THREE.Mesh(backWallGeom, wallMat);
  backWall.position.set(4, 3.75, -6.5);
  backWall.receiveShadow = true;
  shellGroup.add(backWall);

  // Horizontal wall panel division strip (cleanroom blue bumper guard)
  const wallStripeGeom = new THREE.PlaneGeometry(64, 0.1);
  const wallStripeMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
  const wallStripe = new THREE.Mesh(wallStripeGeom, wallStripeMat);
  wallStripe.position.set(4, 2.6, -6.48);
  shellGroup.add(wallStripe);

  // Vertical modular wall seam lines
  for (let x = -24; x <= 32; x += 4.0) {
    const seamGeom = new THREE.PlaneGeometry(0.015, 7.5);
    const seamMat = new THREE.MeshBasicMaterial({ color: 0xcbd5e1 });
    const seam = new THREE.Mesh(seamGeom, seamMat);
    seam.position.set(x, 3.75, -6.49);
    shellGroup.add(seam);
  }

  // Structural fab columns (as seen in cleanroom reference photos with B3, C1 labels)
  const pillarGeom = new THREE.BoxGeometry(0.8, 6.0, 0.8);
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35,
    metalness: 0.05,
  });
  const pillarBaseMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.45,
  });

  const pillarPositions = [-13, -2, 7.6, 17.5];
  for (const px of pillarPositions) {
    // Column body
    const pillar = new THREE.Mesh(pillarGeom, pillarMat);
    pillar.position.set(px, 3.0, -5.2);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    shellGroup.add(pillar);

    // Column dark protective base
    const pBaseGeom = new THREE.BoxGeometry(0.84, 0.3, 0.84);
    const pBase = new THREE.Mesh(pBaseGeom, pillarBaseMat);
    pBase.position.set(px, 0.15, -5.2);
    shellGroup.add(pBase);

    // Column stack light beacon
    const colLightPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
    );
    colLightPole.position.set(px + 0.42, 4.2, -5.2);
    shellGroup.add(colLightPole);

    const greenLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.08, 12),
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 0.8,
      })
    );
    greenLens.position.set(px + 0.42, 4.4, -5.2);
    shellGroup.add(greenLens);
  }

  // 3. Cleanroom Ceiling Grid with Fan Filter Units (FFUs) & Dedicated Luminaires
  const ceilingGeom = new THREE.PlaneGeometry(64, 36);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.65,
  });
  const ceiling = new THREE.Mesh(ceilingGeom, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(4, 5.8, 0);
  shellGroup.add(ceiling);

  // Modular Fan Filter Units (FFUs) - HEPA/ULPA filter grilles
  const ffuGeom = new THREE.PlaneGeometry(1.6, 1.1);
  const ffuMat = new THREE.MeshStandardMaterial({
    color: 0xdbe3ea, // Anodized aluminum / white filter panel
    roughness: 0.6,
    metalness: 0.1,
  });

  // Dedicated Cleanroom Luminaires:
  // Flush LED light troffers mounted between FFU modules along the grid
  const luminaireGeom = new THREE.PlaneGeometry(0.2, 1.1);
  const luminaireMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    emissive: 0xffffff,
    emissiveIntensity: 1.2,
  });

  for (let x = -20; x <= 28; x += 4.5) {
    for (let z = -4; z <= 6; z += 3.8) {
      // FFU airflow filter panel
      const ffu = new THREE.Mesh(ffuGeom, ffuMat);
      ffu.rotation.x = Math.PI / 2;
      ffu.position.set(x, 5.78, z);
      shellGroup.add(ffu);

      // Cleanroom luminaire troffer beside the FFU panel
      const luminaire = new THREE.Mesh(luminaireGeom, luminaireMat);
      luminaire.rotation.x = Math.PI / 2;
      luminaire.position.set(x + 0.95, 5.77, z);
      shellGroup.add(luminaire);
    }
  }

  // 4. Overhead Automated Material Handling System (AMHS) Rails
  const railGeom = new THREE.BoxGeometry(56, 0.08, 0.08);
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.2,
  });

  for (const zOffset of [0.2, 0.8]) {
    const rail = new THREE.Mesh(railGeom, railMat);
    rail.position.set(4, 4.6, zOffset);
    shellGroup.add(rail);
  }

  // AMHS Rail ceiling suspension hangers
  const hangerGeom = new THREE.CylinderGeometry(0.018, 0.018, 1.2, 8);
  for (let x = -20; x <= 28; x += 5.5) {
    const hanger = new THREE.Mesh(hangerGeom, railMat);
    hanger.position.set(x, 5.2, 0.5);
    shellGroup.add(hanger);
  }

  // Suspended OHT (Overhead Hoist Transport) vehicle carriers on the rail
  const ohtGeom = new THREE.BoxGeometry(0.7, 0.45, 0.5);
  const ohtMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.3,
    metalness: 0.1,
  });
  for (const ohtX of [-3.5, 12.0]) {
    const oht = new THREE.Mesh(ohtGeom, ohtMat);
    oht.position.set(ohtX, 4.25, 0.5);
    shellGroup.add(oht);

    // OHT gripper / bracket attaching to rails
    const mountGeom = new THREE.BoxGeometry(0.2, 0.15, 0.65);
    const mount = new THREE.Mesh(mountGeom, railMat);
    mount.position.set(ohtX, 4.55, 0.5);
    shellGroup.add(mount);

    // Small status indicator on OHT
    const ohtLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.04, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    ohtLight.position.set(ohtX, 4.15, 0.76);
    shellGroup.add(ohtLight);
  }

  // 5. Cleanroom Lighting (Bright, balanced semiconductor cleanroom illumination)
  // Ambient illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
  lightsGroup.add(ambientLight);

  // Key directional cleanroom bank lighting
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.25);
  dirLight1.position.set(6, 12, 8);
  dirLight1.castShadow = true;
  dirLight1.shadow.mapSize.width = 1024;
  dirLight1.shadow.mapSize.height = 1024;
  dirLight1.shadow.camera.near = 0.5;
  dirLight1.shadow.camera.far = 32;
  dirLight1.shadow.camera.left = -25;
  dirLight1.shadow.camera.right = 30;
  dirLight1.shadow.camera.top = 15;
  dirLight1.shadow.camera.bottom = -15;
  lightsGroup.add(dirLight1);

  // Soft fill light from upper left aisle
  const dirLight2 = new THREE.DirectionalLight(0xdbeafe, 0.5);
  dirLight2.position.set(-15, 9, -2);
  lightsGroup.add(dirLight2);

  // Secondary soft fill from right to avoid deep shadows
  const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.4);
  dirLight3.position.set(20, 10, 4);
  lightsGroup.add(dirLight3);

  return { shellGroup, lightsGroup };
}
