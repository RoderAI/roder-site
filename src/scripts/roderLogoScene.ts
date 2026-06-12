import * as THREE from "three";

type LogoStage = HTMLElement & {
  dataset: DOMStringMap & {
    roderSceneMounted?: string;
    roderSceneReady?: string;
    roderSceneFrame?: string;
    roderSceneRotation?: string;
  };
};

const OUTER_RADIUS = 118;
const INNER_RADIUS = 58;
const CUT_HALF_GAP = 7;
const CORNER_RADIUS = 9;
const EXTRUDE_DEPTH = 26;

type PieceTone = "orange-bright" | "orange-deep" | "graphite";

// Triad pieces: top, lower-left, lower-right — matching the brand mark.
const TRIAD_PIECES: Array<{ rotationDeg: number; tone: PieceTone }> = [
  { rotationDeg: 0, tone: "orange-bright" },
  { rotationDeg: 120, tone: "orange-deep" },
  { rotationDeg: 240, tone: "graphite" },
];

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
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 1200);
  camera.position.set(0, 0, 470);

  const triad = buildTriadLogo();
  const logoRoot = triad.root;
  scene.add(logoRoot);
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

    logoRoot.scale.setScalar(width < 380 ? 0.84 : 1.06);
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
      logoRoot.rotation.set(-0.2 + pointer.y * 0.08, pointer.x * 0.1, 0);
    } else {
      // Lively sway around a readable front pose; never spins edge-on.
      logoRoot.rotation.x = -0.22 + Math.sin(elapsed * 0.66) * 0.11 + pointer.y * 0.2;
      logoRoot.rotation.y = Math.sin(elapsed * 0.45) * 0.42 + pointer.x * 0.3;
      logoRoot.rotation.z = Math.sin(elapsed * 0.32) * 0.04;
      logoRoot.position.y = Math.sin(elapsed * 0.85) * 7;

      // Triad pieces breathe apart and reassemble.
      const spread = (Math.sin(elapsed * 0.55 - Math.PI / 2) + 1) * 0.5; // 0..1
      const drift = spread * spread * 16;
      triad.pieces.forEach((piece, index) => {
        const dir = piece.userData.driftDirection as THREE.Vector2;
        piece.position.set(dir.x * drift, dir.y * drift, Math.sin(elapsed * 0.7 + index * 2.1) * 6);
        piece.rotation.z = piece.userData.baseRotationZ + spread * 0.045 * (index - 1);
      });
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

/**
 * Builds the Roder mark as a true triad: a hexagonal ring split into three
 * chevron segments (two orange, one graphite) with radial cut gaps, matching
 * the 2D brand mark instead of extruding its overlapping SVG paths.
 */
function buildTriadLogo() {
  const root = new THREE.Group();
  const shape = buildTriadSegmentShape();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: EXTRUDE_DEPTH,
    bevelEnabled: true,
    bevelSize: 2.6,
    bevelThickness: 3.2,
    bevelSegments: 6,
    curveSegments: 12,
  });
  geometry.translate(0, 0, -EXTRUDE_DEPTH / 2);
  geometry.computeVertexNormals();

  const pieces = TRIAD_PIECES.map((piece) => {
    const mesh = new THREE.Mesh(geometry, createPieceMaterials(piece.tone));
    const baseRotationZ = THREE.MathUtils.degToRad(piece.rotationDeg);
    mesh.rotation.z = baseRotationZ;
    // Each segment's centroid direction: outward from center through its midpoint.
    const centroidAngle = THREE.MathUtils.degToRad(90 + piece.rotationDeg);
    mesh.userData.baseRotationZ = baseRotationZ;
    mesh.userData.driftDirection = new THREE.Vector2(
      Math.cos(centroidAngle),
      Math.sin(centroidAngle),
    );
    root.add(mesh);
    return mesh;
  });

  root.rotation.set(-0.2, 0.1, 0);
  return { root, pieces };
}

/**
 * The top segment of the triad: covers the two upper edges of a pointy-top
 * hexagonal ring (vertices at 30°/90°/150°), with the cut ends inset along
 * the edges so the three rotated copies leave clean radial gaps.
 */
function buildTriadSegmentShape() {
  const at = (deg: number, radius: number) => {
    const rad = THREE.MathUtils.degToRad(deg);
    return new THREE.Vector2(Math.cos(rad) * radius, Math.sin(rad) * radius);
  };

  const outerRight = at(30, OUTER_RADIUS);
  const outerTop = at(90, OUTER_RADIUS);
  const outerLeft = at(150, OUTER_RADIUS);
  const innerRight = at(30, INNER_RADIUS);
  const innerTop = at(90, INNER_RADIUS);
  const innerLeft = at(150, INNER_RADIUS);

  const insetFrom = (corner: THREE.Vector2, towards: THREE.Vector2) =>
    corner.clone().add(towards.clone().sub(corner).normalize().multiplyScalar(CUT_HALF_GAP));

  const points = [
    insetFrom(outerRight, outerTop),
    outerTop,
    insetFrom(outerLeft, outerTop),
    insetFrom(innerLeft, innerTop),
    innerTop,
    insetFrom(innerRight, innerTop),
  ];

  return buildRoundedShape(points, CORNER_RADIUS);
}

function buildRoundedShape(points: THREE.Vector2[], radius: number) {
  const shape = new THREE.Shape();
  const count = points.length;

  points.forEach((corner, index) => {
    const prev = points[(index + count - 1) % count];
    const next = points[(index + 1) % count];
    const toPrev = prev.clone().sub(corner);
    const toNext = next.clone().sub(corner);
    const cornerRadius = Math.min(radius, toPrev.length() / 2, toNext.length() / 2);
    const entry = corner.clone().add(toPrev.normalize().multiplyScalar(cornerRadius));
    const exit = corner.clone().add(toNext.normalize().multiplyScalar(cornerRadius));

    if (index === 0) {
      shape.moveTo(entry.x, entry.y);
    } else {
      shape.lineTo(entry.x, entry.y);
    }
    shape.quadraticCurveTo(corner.x, corner.y, exit.x, exit.y);
  });

  shape.closePath();
  return shape;
}

function createPieceMaterials(tone: PieceTone) {
  const palette = {
    "orange-bright": { face: "#ff6a10", side: "#d8480a" },
    "orange-deep": { face: "#f64402", side: "#bb3804" },
    graphite: { face: "#1c2027", side: "#0d0f13" },
  }[tone];

  const dark = tone === "graphite";

  const face = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(palette.face),
    roughness: dark ? 0.42 : 0.4,
    metalness: dark ? 0.18 : 0.04,
    clearcoat: 0.4,
    clearcoatRoughness: 0.42,
  });

  const side = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(palette.side),
    roughness: 0.45,
    metalness: dark ? 0.22 : 0.08,
    clearcoat: 0.5,
    clearcoatRoughness: 0.32,
  });

  return [face, side];
}

function addLights(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));

  const hemi = new THREE.HemisphereLight(0xffffff, 0xb9b9bd, 0.7);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(-140, 180, 260);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xfff3ea, 0.8);
  fill.position.set(170, -60, 220);
  scene.add(fill);
}
