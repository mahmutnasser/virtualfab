import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

type MotionProps = { scene: number; progress: number; coated: boolean; onUnavailable: () => void };
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** One persistent wafer mesh is carried through the handling, chamber and return shots. */
export default function WaferMotion3D({ scene, progress, coated, onUnavailable }: MotionProps) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef({ scene, progress, coated });
  const unavailable = useRef(onUnavailable);
  const yaw = useRef(0);
  const drag = useRef<number | null>(null);
  state.current = { scene, progress, coated };
  unavailable.current = onUnavailable;

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      unavailable.current();
      return;
    }
    const contextLost = (event: Event) => { event.preventDefault(); unavailable.current(); };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    element.appendChild(renderer.domElement);
    const scene3d = new THREE.Scene();
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentMap = pmrem.fromScene(environment);
    scene3d.environment = environmentMap.texture;
    scene3d.add(new THREE.AmbientLight(0xe7f4ff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(-3, 6, 7); scene3d.add(key);
    const rim = new THREE.DirectionalLight(0xb6d9f0, 1.9);
    rim.position.set(4, 3, -4); scene3d.add(rim);
    const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, .1, 100);
    camera.position.set(0, 3.9, 10);
    camera.lookAt(0, 0, 0);

    const rig = new THREE.Group();
    scene3d.add(rig);
    const silicon = new THREE.MeshPhysicalMaterial({ color: 0x87939b, metalness: .78, roughness: .2, clearcoat: .45, clearcoatRoughness: .16, side: THREE.DoubleSide });
    const bevel = new THREE.MeshStandardMaterial({ color: 0x536572, metalness: .9, roughness: .3 });
    const oxide = new THREE.MeshPhysicalMaterial({ color: 0xb0d4e8, metalness: .19, roughness: .17, transparent: true, opacity: 0, depthWrite: false, clearcoat: .9, clearcoatRoughness: .12, side: THREE.DoubleSide });
    const forkMaterial = new THREE.MeshStandardMaterial({ color: 0xb8c3ca, metalness: .88, roughness: .24, transparent: true });
    const wafer = new THREE.Mesh(new THREE.CylinderGeometry(1.37, 1.37, .035, 128), [bevel, silicon, silicon]);
    rig.add(wafer);
    const film = new THREE.Mesh(new THREE.CylinderGeometry(1.374, 1.374, .009, 128), oxide);
    film.position.y = .025; rig.add(film);
    const edge = new THREE.Mesh(new THREE.TorusGeometry(1.369, .009, 10, 128), bevel);
    edge.rotation.x = Math.PI / 2; rig.add(edge);
    const handler = new THREE.Group();
    const arm = new THREE.Mesh(new THREE.BoxGeometry(2.7, .09, .3), forkMaterial);
    arm.position.set(2.3, -.085, 0); handler.add(arm);
    for (const z of [-.65, .65]) {
      const tine = new THREE.Mesh(new THREE.BoxGeometry(1.6, .045, .12), forkMaterial);
      tine.position.set(.45, -.075, z); handler.add(tine);
    }
    const joint = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, .16, 28), forkMaterial);
    joint.position.set(3.6, -.05, 0); handler.add(joint);
    rig.add(handler);
    const gas = new THREE.Group();
    const gasGeometry = new THREE.SphereGeometry(.025, 8, 8);
    const gasMaterial = new THREE.MeshBasicMaterial({ color: 0xb0d4e8, transparent: true, opacity: .38, depthWrite: false });
    for (let index = 0; index < 18; index++) {
      const molecule = new THREE.Mesh(gasGeometry, gasMaterial);
      molecule.position.set(Math.sin(index * 2.4) * 2.1, 0, Math.cos(index * 2.4) * .7);
      gas.add(molecule);
    }
    scene3d.add(gas);

    let animation = 0;
    const resize = () => {
      const width = element.clientWidth || 960, height = element.clientHeight || 540;
      renderer.setSize(width, height);
      const aspect = width / height;
      camera.left = -5; camera.right = 5;
      camera.top = 5 / aspect; camera.bottom = -5 / aspect;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element); resize();
    const render = () => {
      animation = requestAnimationFrame(render);
      const { scene: chapter, progress: p, coated: hasFilm } = state.current;
      if (chapter !== 3 && chapter !== 4 && chapter !== 5 && chapter !== 7) return;
      const transfer = smooth((p - .1) / .78);
      if (chapter === 3) rig.position.set(-2.65 + transfer * 4.35, -.5, 0);
      else if (chapter === 4) rig.position.set(3.2 - smooth((p - .08) / .7) * 3.2, -.93, 0);
      else if (chapter === 5) rig.position.set(0, -.93, 0);
      else rig.position.set(3.1 - smooth((p - .03) / .7) * 3.45, -.22, 0);
      rig.scale.setScalar(chapter === 3 ? 1.14 : chapter === 7 ? 1.18 : 1.82);
      handler.visible = chapter !== 5;
      forkMaterial.opacity = chapter === 4 ? 1 - smooth((p - .74) / .18) : 1;
      oxide.opacity = chapter === 5 ? smooth((p - .28) / .55) : chapter === 7 || hasFilm ? 1 : 0;
      gas.visible = chapter === 5 && p > .12 && p < .88;
      gas.children.forEach((molecule, index) => {
        const phase = (p * 3.7 + index * .19) % 1;
        molecule.position.y = 1.2 - phase * 1.9;
      });
      camera.position.x = yaw.current;
      camera.lookAt(0, 0, 0);
      renderer.render(scene3d, camera);
    };
    render();
    return () => {
      cancelAnimationFrame(animation); observer.disconnect();
      const geometries = new Set<THREE.BufferGeometry>();
      scene3d.traverse(object => {
        if (object instanceof THREE.Mesh) geometries.add(object.geometry);
      });
      geometries.forEach(geometry => geometry.dispose());
      [silicon, bevel, oxide, forkMaterial].forEach(material => material.dispose());
      gasMaterial.dispose(); environmentMap.dispose(); pmrem.dispose(); environment.dispose(); renderer.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      element.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} className="journey-three" aria-hidden="true"
    onPointerDown={event => { drag.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }}
    onPointerMove={event => { if (drag.current !== null) { yaw.current = Math.max(-.35, Math.min(.35, yaw.current + (event.clientX - drag.current) * .002)); drag.current = event.clientX; } }}
    onPointerUp={() => { drag.current = null; }} />;
}
