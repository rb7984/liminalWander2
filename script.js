import { initialize } from './scripts/loaders.js';
import { primer } from './scripts/primer.js';

//#region Primer
let sceneCameraRenderer = primer();
let scene = sceneCameraRenderer[0];
let camera = sceneCameraRenderer[1];
let renderer = sceneCameraRenderer[2];

export const gridSize = 20;

initialize(gridSize, scene, camera);

//#endregion

//#region Grid change
document.getElementById("gridSizeInput").addEventListener("change", async (event) => {
    let newSize = parseInt(event.target.value, 10);
    if (newSize > 0) {
        console.log("Updating grid size to:", newSize);

        document.body.removeChild(renderer.domElement);

        sceneCameraRenderer = primer();
        scene = sceneCameraRenderer[0];
        camera = sceneCameraRenderer[1];
        renderer = sceneCameraRenderer[2];

        document.body.appendChild(renderer.domElement);

        await initialize(newSize, scene, camera);
    }
});

//#endregion

//#region Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

//#endregion

//#region Window Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
//#endregion