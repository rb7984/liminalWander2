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
            camera.rotation.y -= 0.05;
        }
        if (event.key === 'a') {
            camera.rotation.y += 0.05;
        }
    });
}
