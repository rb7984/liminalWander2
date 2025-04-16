import * as THREE from 'https://esm.sh/three';
import { OrbitControls } from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js';
import { movement } from './movements.js';

export function primer() {
    /** @typedef {import('three')} THREE */

    //#region Scene
    const scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2( 0x814085, 0.002 );
    //scene.fog = new THREE.Fog(0x403e37, 6, 10);
    //#endregion


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.bias = -0.001;

    //#region Plane
    var g2 = new THREE.PlaneGeometry(2000, 2000, 8, 8);
    var m2 = new THREE.MeshStandardMaterial({ color: '#2c61d4', side: THREE.DoubleSide });
    var plane = new THREE.Mesh(g2, m2);
    plane.receiveShadow = true;

    plane.rotateX(- Math.PI / 2);
    plane.translateZ(-0.5);
    scene.add(plane);
    //#endregion

    //#region Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 2;

    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 100;

    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);
    //#endregion

    //#region Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    //#endregion

    //#region Raycaster
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();
    const speed = 0.1;

    function checkCollision(offset = new THREE.Vector3(0, 0, 0)) {
        camera.getWorldDirection(direction);
        direction.add(offset).normalize();

        raycaster.set(camera.position, direction);
        const intersects = raycaster.intersectObjects(scene.children, true);
        return intersects.length > 0 && intersects[0].distance < 0.05;
    }

    movement(camera, direction, speed, checkCollision);
    //#endregion

    camera.position.set(-5, 1, -5);
    camera.lookAt(0, 1, 0);

    // const axesHelper = new THREE.AxesHelper(10);
    // scene.add(axesHelper);

    return [scene, camera, renderer];
}
