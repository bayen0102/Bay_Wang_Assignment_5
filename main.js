import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 20, 80);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 8, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2, 0);
controls.enableDamping = true;

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// Textures
const grassTexture = textureLoader.load('./textures/Grass006_1K-JPG_Color.jpg');
const woodTexture = textureLoader.load('./textures/Wood095_1K-JPG_Color.jpg');

// Optional texture settings
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(30, 30);

woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.set(1, 1);


// Skybox
const skyboxTexture = cubeTextureLoader.load([
  './skybox/px.png',
  './skybox/nx.png',
  './skybox/py.png',
  './skybox/ny.png',
  './skybox/pz.png',
  './skybox/nz.png',
]);
scene.background = skyboxTexture;
scene.environment = skyboxTexture;

// Lights - Need at least 3 different lights
// 1. Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
scene.add(ambientLight);

// 2. Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
directionalLight.position.set(12, 18, 8);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 3. Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0x88aaff, 0x445533, 0.8);
scene.add(hemisphereLight);

// 4. Point Light for wow feature
const orbLight = new THREE.PointLight(0x66ffff, 3, 16);
orbLight.position.set(0, 4, 0);
scene.add(orbLight);

// Fireflies (wow atmosphere)

const fireflyGeometry = new THREE.SphereGeometry(0.05, 8, 8);
const fireflyMaterial = new THREE.MeshBasicMaterial({ color: 0xffff88 });

const fireflies = [];

for (let i = 0; i < 25; i++) {
  const firefly = new THREE.Mesh(fireflyGeometry, fireflyMaterial);

  firefly.position.set(
    (Math.random() - 0.5) * 30,
    Math.random() * 6 + 1,
    (Math.random() - 0.5) * 30
  );

  scene.add(firefly);
  fireflies.push(firefly);
}

// Ground
const groundGeometry = new THREE.PlaneGeometry(40, 40);
const groundMaterial = new THREE.MeshStandardMaterial({
  map: grassTexture,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Path / Platform
const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x8a8175 });

for (let i = -2; i <= 2; i++) {
  const path = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.15, 2),
    pathMaterial
  );
  path.position.set(i * 2.7, 0.05, 6);
  scene.add(path);
}

// Houses - Each house = box + cone
function createHouse(x, z) {
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2.5, 3),
    new THREE.MeshStandardMaterial({ map: woodTexture })
  );
  base.position.set(x, 1.25, z);
  base.castShadow = true;
  base.receiveShadow = true;
  scene.add(base);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(2.5, 1.8, 4),
    new THREE.MeshStandardMaterial({ color: 0x8b2f2f })
  );
  roof.position.set(x, 3.4, z);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  scene.add(roof);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x4b2e1f })
  );
  door.position.set(x, 0.6, z + 1.55);
  scene.add(door);
}

createHouse(-9, -5);
createHouse(9, -4);

// Primitive Trees- Each tree = cylinder + sphere
function createPrimitiveTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 2.2, 16),
    new THREE.MeshStandardMaterial({ color: 0x6b4423 })
  );
  trunk.position.set(x, 1.1, z);
  trunk.castShadow = true;
  scene.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x2c8a45 })
  );
  leaves.position.set(x, 2.8, z);
  leaves.castShadow = true;
  scene.add(leaves);
}

createPrimitiveTree(-12, 6);
createPrimitiveTree(-8, 9);
createPrimitiveTree(-4, 10);
createPrimitiveTree(4, 10);
createPrimitiveTree(8, 9);
createPrimitiveTree(12, 6);

// Rocks
function createRock(x, z, scaleX = 1, scaleY = 1, scaleZ = 1) {
  const rock = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 18, 18),
    new THREE.MeshStandardMaterial({ color: 0x777777 })
  );
  rock.position.set(x, 0.5, z);
  rock.scale.set(scaleX, scaleY, scaleZ);
  rock.castShadow = true;
  rock.receiveShadow = true;
  scene.add(rock);
}

createRock(-6, 2, 1.3, 0.7, 1);
createRock(-3, 3, 0.9, 0.6, 1.2);
createRock(4, 2, 1.1, 0.8, 0.9);
createRock(7, 3, 1.4, 0.6, 1.1);
createRock(-10, -1, 1.0, 0.7, 1.0);
createRock(10, 0, 1.2, 0.7, 1.0);

// Wooden Crates
function createCrate(x, z) {
  const crate = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshStandardMaterial({ map: woodTexture })
  );
  crate.position.set(x, 0.75, z);
  crate.castShadow = true;
  crate.receiveShadow = true;
  scene.add(crate);
}

createCrate(-5, -8);
createCrate(-3, -8);
createCrate(3, -8);
createCrate(5, -8);

// Cylinders / Pillars
function createPillar(x, z) {
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 3, 20),
    new THREE.MeshStandardMaterial({ color: 0x999999 })
  );
  pillar.position.set(x, 1.5, z);
  pillar.castShadow = true;
  pillar.receiveShadow = true;
  scene.add(pillar);
}

createPillar(-13, -10);
createPillar(13, -10);

// Wow Feature: Floating Orb
const orbMaterial = new THREE.MeshStandardMaterial({
  color: 0x66ffff,
  emissive: 0x00ffff,
  emissiveIntensity: 3,
});

const orb = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  orbMaterial
);
orb.position.set(0, 4, 0);
orb.castShadow = true;
scene.add(orb);

// Orb pedestal
const pedestal = new THREE.Mesh(
  new THREE.CylinderGeometry(1.8, 2.2, 1.2, 24),
  new THREE.MeshStandardMaterial({ color: 0x666666 })
);
pedestal.position.set(0, 0.6, 0);
pedestal.receiveShadow = true;
scene.add(pedestal);

// Additional decorative cones
function createCone(x, z, color) {
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 2, 16),
    new THREE.MeshStandardMaterial({ color })
  );
  cone.position.set(x, 1, z);
  cone.castShadow = true;
  scene.add(cone);
}

createCone(-14, 12, 0xaa8844);
createCone(14, 12, 0xaa8844);

// Load GLB model
gltfLoader.load(
  './models/low_poly_tree_scene_free.glb',
  (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 0, -50);
    model.scale.set(2.2, 2.2, 2.2);

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('Error loading GLB model:', error);
  }
);


// Count note
// Primitive objects included:
// Ground(1)
// Path(5)
// Houses: each 3 parts => 6
// Trees: 6 trees x 2 parts => 12
// Rocks(6)
// Crates(4)
// Pillars(2)
// Orb(1)
// Pedestal(1)
// Cones(2)
// Total well above 20


// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Floating orb animation
  orb.position.y = 4 + Math.sin(elapsedTime * 2) * 0.5;
  orb.rotation.y += 0.01;

  // Move orb light with orb
  orbLight.position.copy(orb.position);
  // firefly animation
  fireflies.forEach((firefly, i) => {
  firefly.position.y += Math.sin(elapsedTime + i) * 0.002;
  firefly.position.x += Math.cos(elapsedTime + i) * 0.002;
});

  // Slight animated directional light movement
  directionalLight.position.x = Math.sin(elapsedTime * 0.3) * 14;
  directionalLight.position.z = Math.cos(elapsedTime * 0.3) * 10;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});