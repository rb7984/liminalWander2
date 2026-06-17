import * as THREE from 'https://esm.sh/three';

const yAxis = new THREE.Vector3(0, 1, 0);
const lookAtDir = new THREE.Vector3();

const keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false,
    e: false
};

export function clickMovements(camera) {
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (key in keysPressed) {
            keysPressed[key] = true;
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
            camera.position.set(camera.position.x - 1, camera.position.y, camera.position.z);
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
        if (event.key === '5') {
            camera.position.set(camera.position.x, camera.position.y, camera.position.z + 1);
        }
        // Z -
        if (event.key === '8') {
            camera.position.set(camera.position.x, camera.position.y, camera.position.z - 1);
        }
        // Reset
        if (event.key === 'c') {
            camera.position.set(2, 2.5, 2.5);
            camera.lookAt(2, 2, 2);
        }
        //#endregion
    });

    document.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        if (key in keysPressed) {
            keysPressed[key] = false;
        }
    });
}

export function movement(camera, direction, speed, checkCollision) {
    if (keysPressed.w && !checkCollision()) {
        camera.position.addScaledVector(direction, speed);
    }
    if (keysPressed.s) {
        camera.position.addScaledVector(direction, -speed);
    }
    if (keysPressed.d) {
        camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -0.03);
    }
    if (keysPressed.a) {
        camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), +0.03);
    }
    if (keysPressed.e) {
        camera.getWorldDirection(lookAtDir);

        let sideAxis = new THREE.Vector3().crossVectors(lookAtDir, yAxis).normalize();
        camera.rotateOnWorldAxis(sideAxis, +0.03);
    }
};
