import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js';
import { movement } from './scripts/movements.js';
import { locator } from './scripts/locator.js';
import { VoxelGrid, fillVoxelSpace } from './scripts/voxelizer.js';
import { ModelsLoader } from './scripts/modelsLoader.js';

// Scene
export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

var g2 = new THREE.PlaneGeometry(2000, 2000, 8, 8);
var m2 = new THREE.MeshStandardMaterial({ color: '#2c61d4', side: THREE.DoubleSide });
var plane = new THREE.Mesh(g2, m2);
plane.receiveShadow = true;

plane.rotateX( - Math.PI / 2);
plane.translateZ(-0.5);
scene.add(plane);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0,500,0);
light.castShadow = true;

light.shadow.mapSize.width = 1024; 
light.shadow.mapSize.height = 1024; 
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;

light.shadow.camera.left = -50;
light.shadow.camera.right = 50;
light.shadow.camera.top = 50;
light.shadow.camera.bottom = -50;

scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

// Orientation cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.translateY(1);
scene.add( cube );

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.5 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

//locator(scene);

export const gridSize = 10;
export const voxelGrid = new VoxelGrid(gridSize);

ModelsLoader().then(models => {
    console.log('Models Loaded:', models);
    if (models.length > 0) {
        fillVoxelSpace(scene, models, voxelGrid, gridSize);
    } else {
        console.error("No models loaded.");
    }
}).catch(error => console.error("Error loading models:", error));

// const loader = new GLTFLoader();
// loader.load('models/a.gltf', (gltf) => {
//     const model = gltf.scene;
//     model.scale.set(1, 1, 1);
//     fillVoxelSpace(scene, model, voxelGrid, gridSize);
// });

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
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

camera.position.set(10, 10, 10);
camera.lookAt(0, 10, 0);

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