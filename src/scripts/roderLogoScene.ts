import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <path fill="#ff4d00" d="M128 20c4.6 0 9 1.2 13 3.5l60 34.7c8 4.6 13 13.2 13 22.5v31.2c0 8.2-4.4 15.8-11.6 19.9l-38.7 22.3c-7.1 4.1-16 4.1-23.1 0L128 146.9l-12.6 7.2c-7.1 4.1-16 4.1-23.1 0l-38.7-22.3C46.4 127.7 42 120.1 42 111.9V80.7c0-9.3 5-17.9 13-22.5l60-34.7c4-2.3 8.4-3.5 13-3.5Z"/>
  <path fill="#ff4d00" d="M42.2 116.4c3.9-2.3 8.4-3.5 12.9-3.5 4.6 0 9.1 1.2 13.1 3.5l38.8 22.4c7.1 4.1 11.5 11.7 11.5 19.9v14.4l12.6 7.3c7.1 4.1 11.5 11.7 11.5 19.9v44.6c0 8.3-4.4 15.9-11.6 20l-27 15.6c-8.1 4.6-18 4.6-26 0l-60-34.7c-8-4.6-13-13.2-13-22.5v-69.4c0-9.3 5-17.9 13-22.5l24.2-14Z" transform="translate(16 -28)"/>
  <path fill="#111316" d="M137.5 138.8c0-8.2 4.4-15.8 11.5-19.9l38.8-22.4c4-2.3 8.5-3.5 13.1-3.5 4.5 0 9 1.2 12.9 3.5l24.2 14c8 4.6 13 13.2 13 22.5v69.4c0 9.3-5 17.9-13 22.5l-60 34.7c-8 4.6-17.9 4.6-26 0l-27-15.6c-7.2-4.1-11.6-11.7-11.6-20v-44.6c0-8.2 4.4-15.8 11.5-19.9l12.6-7.3v-14.4Z" transform="translate(-11 -7)"/>
</svg>`;

type LogoStage = HTMLElement & {
  dataset: DOMStringMap & {
    roderSceneMounted?: string;
    roderSceneReady?: string;
    roderSceneFrame?: string;
    roderSceneRotation?: string;
  };
};

type Fragment = {
  angle: number;
  radiusX: number;
  radiusY: number;
  speed: number;
  z: number;
  size: number;
};

export function initRoderLogoScene(selector = "[data-roder-logo-scene]") {
  const stages = Array.from(document.querySelectorAll<LogoStage>(selector));

  stages.forEach((stage) => {
    if (stage.dataset.roderSceneMounted === "true") return;

    const canvas = stage.querySelector<HTMLCanvasElement>("[data-roder-logo-canvas]");
    if (!canvas) return;

    stage.dataset.roderSceneMounted = "true";

    try {
      mountLogoScene(stage, canvas);
    } catch {
      stage.classList.add("is-fallback");
    }
  });
}

function mountLogoScene(stage: LogoStage, canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 1200);
  camera.position.set(0, 0, 470);

  const logoRoot = buildExtrudedLogo();
  const spaceRoot = buildSpaceRig();
  const fragments = buildFragments();

  scene.add(spaceRoot.root, logoRoot, fragments.mesh);
  addLights(scene);

  const pointer = new THREE.Vector2();
  const targetPointer = new THREE.Vector2();
  const startTime = performance.now();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animationFrame = 0;
  let renderedFrames = 0;

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const compactScale = width < 380 ? 0.76 : 0.9;
    logoRoot.scale.setScalar(compactScale);
    spaceRoot.root.scale.setScalar(width < 380 ? 0.82 : 1);
  };

  const onPointerMove = (event: PointerEvent) => {
    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    targetPointer.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1));
  };

  const onPointerLeave = () => targetPointer.set(0, 0);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerleave", onPointerLeave);
  resize();

  const animate = () => {
    animationFrame = window.requestAnimationFrame(animate);

    const elapsed = (performance.now() - startTime) / 1000;
    pointer.lerp(targetPointer, 0.055);

    if (reducedMotion.matches) {
      logoRoot.rotation.set(-0.24 + pointer.y * 0.08, 0.26 + pointer.x * 0.1, -0.02);
      spaceRoot.rings.rotation.set(0.14, 0.08, 0.08);
    } else {
      logoRoot.rotation.x = -0.25 + Math.sin(elapsed * 0.82) * 0.05 + pointer.y * 0.18;
      logoRoot.rotation.y = 0.18 + elapsed * 0.24 + pointer.x * 0.18;
      logoRoot.rotation.z = Math.sin(elapsed * 0.55) * 0.035;

      spaceRoot.rings.rotation.x = 0.15 + Math.sin(elapsed * 0.44) * 0.06;
      spaceRoot.rings.rotation.y = elapsed * 0.18;
      spaceRoot.rings.rotation.z = elapsed * 0.1;
      spaceRoot.grid.position.z = -72 + Math.sin(elapsed * 0.6) * 5;
      updateFragments(fragments, elapsed);
    }

    renderer.render(scene, camera);
    renderedFrames += 1;

    if (renderedFrames === 1) {
      stage.classList.add("is-3d-ready");
      stage.dataset.roderSceneReady = "true";
    }

    if (renderedFrames % 12 === 0) {
      stage.dataset.roderSceneFrame = String(renderedFrames);
      stage.dataset.roderSceneRotation = logoRoot.rotation.y.toFixed(4);
    }
  };

  animate();

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    renderer.dispose();
  }, { once: true });
}

function buildExtrudedLogo() {
  const loader = new SVGLoader();
  const parsed = loader.parse(LOGO_SVG);
  const logo = new THREE.Group();

  parsed.paths.forEach((path, pathIndex) => {
    const fill = path.userData?.style?.fill || (pathIndex === 2 ? "#111316" : "#ff4d00");
    const shapes = SVGLoader.createShapes(path);
    const materials = createLogoMaterials(fill, pathIndex);

    shapes.forEach((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 34,
        bevelEnabled: true,
        bevelSize: 4.6,
        bevelThickness: 5.4,
        bevelSegments: 10,
        curveSegments: 18,
      });

      geometry.scale(1, -1, 1);
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.z = pathIndex === 2 ? 2.4 : pathIndex === 1 ? 1.2 : 0;
      mesh.renderOrder = pathIndex;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      logo.add(mesh);
    });
  });

  const box = new THREE.Box3().setFromObject(logo);
  const center = box.getCenter(new THREE.Vector3());
  logo.position.sub(center);
  logo.position.z -= 10;
  logo.rotation.set(-0.25, 0.36, -0.02);

  return logo;
}

function createLogoMaterials(fill: string, pathIndex: number) {
  const dark = pathIndex === 2 || fill.toLowerCase() === "#111316";
  const faceColor = new THREE.Color(dark ? "#11161c" : pathIndex === 1 ? "#ff3f0b" : "#ff6817");
  const sideColor = new THREE.Color(dark ? "#080a0d" : "#b72805");

  const face = new THREE.MeshPhysicalMaterial({
    color: faceColor,
    roughness: dark ? 0.36 : 0.42,
    metalness: dark ? 0.34 : 0.18,
    clearcoat: dark ? 0.55 : 0.7,
    clearcoatRoughness: 0.28,
    emissive: dark ? new THREE.Color("#020304") : new THREE.Color("#351006"),
    emissiveIntensity: dark ? 0.05 : 0.08,
  });

  const side = new THREE.MeshPhysicalMaterial({
    color: sideColor,
    roughness: 0.48,
    metalness: dark ? 0.28 : 0.16,
    clearcoat: 0.42,
    clearcoatRoughness: 0.34,
  });

  return [face, side];
}

function addLights(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 1.15));

  const key = new THREE.DirectionalLight(0xffffff, 3.4);
  key.position.set(-120, 130, 250);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xff6a1a, 2.8);
  rim.position.set(180, -90, 170);
  scene.add(rim);

  const graphiteEdge = new THREE.PointLight(0x99b5ff, 14, 360);
  graphiteEdge.position.set(110, 70, 145);
  scene.add(graphiteEdge);
}

function buildSpaceRig() {
  const root = new THREE.Group();
  const rings = new THREE.Group();

  const orangeLine = new THREE.MeshBasicMaterial({
    color: 0xff4d00,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });

  const graphiteLine = new THREE.MeshBasicMaterial({
    color: 0x111316,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });

  const ringSpecs = [
    { radius: 150, tube: 0.42, rotation: [0.95, 0.12, 0.18], material: orangeLine },
    { radius: 184, tube: 0.36, rotation: [1.18, -0.34, -0.1], material: graphiteLine },
    { radius: 218, tube: 0.28, rotation: [1.42, 0.28, 0.3], material: orangeLine },
  ] as const;

  ringSpecs.forEach((spec) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(spec.radius, spec.tube, 8, 180), spec.material);
    ring.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2]);
    rings.add(ring);
  });

  const grid = new THREE.GridHelper(520, 18, 0xff4d00, 0x9aa19a);
  grid.position.set(0, -144, -74);

  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
  gridMaterials.forEach((material) => {
    material.transparent = true;
    material.opacity = 0.13;
    material.depthWrite = false;
  });

  root.add(rings, grid);
  return { root, rings, grid };
}

function buildFragments() {
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff4d00,
    transparent: true,
    opacity: 0.46,
    depthWrite: false,
  });
  const fragments: Fragment[] = Array.from({ length: 22 }, (_, index) => ({
    angle: index * 0.72,
    radiusX: 132 + (index % 5) * 18,
    radiusY: 72 + (index % 4) * 13,
    speed: 0.08 + (index % 6) * 0.018,
    z: -38 + (index % 7) * 12,
    size: 0.55 + (index % 4) * 0.16,
  }));

  const mesh = new THREE.InstancedMesh(geometry, material, fragments.length);
  updateFragments({ mesh, fragments }, 0);
  return { mesh, fragments };
}

function updateFragments(fragmentRig: { mesh: THREE.InstancedMesh; fragments: Fragment[] }, elapsed: number) {
  const matrixTarget = new THREE.Object3D();

  fragmentRig.fragments.forEach((fragment, index) => {
    const angle = fragment.angle + elapsed * fragment.speed;
    matrixTarget.position.set(
      Math.cos(angle) * fragment.radiusX,
      Math.sin(angle * 1.17) * fragment.radiusY,
      fragment.z + Math.sin(angle * 1.4) * 24,
    );
    matrixTarget.rotation.set(angle * 0.3, angle * 0.7, angle);
    matrixTarget.scale.setScalar(fragment.size);
    matrixTarget.updateMatrix();
    fragmentRig.mesh.setMatrixAt(index, matrixTarget.matrix);
  });

  fragmentRig.mesh.instanceMatrix.needsUpdate = true;
}
