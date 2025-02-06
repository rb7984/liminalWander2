export function movement(camera, direction, speed, checkCollision) {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'w' && !checkCollision()) {
            camera.position.addScaledVector(direction, speed);
        }
        if (event.key === 's' && !checkCollision()) {
            camera.position.addScaledVector(direction, -speed);
        }
    });
}
