import * as THREE from 'https://esm.sh/three';

const yAxis = new THREE.Vector3(0, 1, 0);
const lookAtDir = new THREE.Vector3();

export function movement(camera, direction, speed, checkCollision) {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'w' && !checkCollision()) {
            camera.position.addScaledVector(direction, speed);
        }
        if (event.key === 's') {
            camera.position.addScaledVector(direction, -speed);
        }
        if (event.key === 'd') {
            camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -0.08);
        }
        if (event.key === 'a') {
            camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), +0.08);
        }
        if (event.key === 'e') {
            camera.getWorldDirection(lookAtDir);

            let sideAxis = new THREE.Vector3().crossVectors(lookAtDir, yAxis).normalize();
            camera.rotateOnWorldAxis(sideAxis, +0.08);
        }
        if (event.key === 'r') {
            camera.getWorldDirection(lookAtDir);
            
            lookAtDir.y = 0;
            lookAtDir.normalize();
            
            let target = new THREE.Vector3().addVectors(camera.position, lookAtDir);
            
            camera.lookAt(target);
        }
        
        // #region Debug
        // X +
        if (event.key === 'ArrowRight') {
            camera.position.set(camera.position.x + 1, camera.position.y, camera.position.z);
        }
        // X -
        if (event.key === 'ArrowLeft') {
            camera.position.set(camera.position.x -1, camera.position.y, camera.position.z);
        }
        // Y +
        if (event.key === 'ArrowUp') {
            camera.position.set(camera.position.x, camera.position.y + 1, camera.position.z);
        }
        // Y +
        if (event.key === 'ArrowDown') {
            camera.position.set(camera.position.x, camera.position.y - 1, camera.position.z);
        }
        // Z +
        if (event.key === 'x') {
            camera.position.set(camera.position.x, camera.position.y, camera.position.z +1);
        }
        // Z +
        if (event.key === 'z') {
            camera.position.set(camera.position.x, camera.position.y, camera.position.z -1);
        }
        // Reset
        if (event.key === 'c') {
            camera.position.set(2, 2.5, 2.5);
            camera.lookAt(2, 2, 2);
        }
        //#endregion
    });
}
