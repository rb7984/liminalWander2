import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js';
import { movement } from './scripts/movements.js';
import { locator } from './scripts/locator.js';
import { VoxelGrid, fillVoxelSpace } from './scripts/voxelizer.js';

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

var g2 = new THREE.PlaneGeometry(2000, 2000, 8, 8);
var m2 = new THREE.MeshStandardMaterial({ color: '#2c61d4', side: THREE.DoubleSide });
var plane = new THREE.Mesh(g2, m2);
plane.rotateX( - Math.PI / 2);
plane.translateZ(-0.5);
plane.receiveShadow = true;
scene.add(plane);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0,100,0);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);



// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.5 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// // Load GLTF model
// const loader = new GLTFLoader();
// loader.load('model.gltf', (gltf) => {
//     const model = gltf.scene;
//     model.traverse((child) => {
//         if (child.isMesh) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//         }
//     });
//     scene.add(model);
// });

//locator(scene);

const voxelGrid = new VoxelGrid(50);
const loader = new GLTFLoader();
loader.load('models/a.gltf', (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    fillVoxelSpace(scene, model, voxelGrid, 10);
});

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
//camera.position.set(0, 2, 5);
controls.update();

// Raycaster for collision detection
const raycaster = new THREE.Raycaster();
const direction = new THREE.Vector3();
const speed = 0.1;

function checkCollision() {
    camera.getWorldDirection(direction);
    raycaster.set(camera.position, direction);
    const intersects = raycaster.intersectObjects(scene.children, true);
    return intersects.length > 0 && intersects[0].distance < 1.0;
}

movement(camera, direction, speed, checkCollision);

camera.position.set(100, 100, 100);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
