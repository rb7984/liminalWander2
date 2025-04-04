import * as THREE from 'https://esm.sh/three';

export function movement(camera, direction, speed, checkCollision) {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'w' && !checkCollision()) {
            camera.position.addScaledVector(direction, speed);
        }
        if (event.key === 's') {
            camera.position.addScaledVector(direction, -speed);
        }
        if (event.key === 'd') {
            camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -0.05);
        }
        if (event.key === 'a') {
            camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), +0.05);
        }
        if (event.key === 'ArrowUp') {
            camera.position.set(camera.position.x, camera.position.y + 1, camera.position.z);
        }
        if (event.key === 'ArrowDown') {
            camera.position.set(camera.position.x, camera.position.y - 1, camera.position.z);
        }
    });
}
