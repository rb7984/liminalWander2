import * as THREE from 'https://esm.sh/three';
import { OrbitControls } from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js';
import { movement } from './movements.js';

export function primer() {
    const scene = new THREE.Scene();
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

    plane.rotateX(- Math.PI / 2);
    plane.translateZ(-0.5);
    scene.add(plane);

    //#region Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(500, 500, 500);
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

    const light2 = new THREE.DirectionalLight(0x948cdb, 1);
    light2.position.set(-100, 100, -100);
    light2.castShadow = true;

    light2.shadow.mapSize.width = 1024;
    light2.shadow.mapSize.height = 1024;

    scene.add(light2);

    //#endregion
    
    const hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( hemisphereLight );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Raycaster
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

    camera.position.set(-5, 5, -5);
    camera.lookAt(0, 0, 0);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    return [scene, camera, renderer];
}
