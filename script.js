import { initialize } from './scripts/loaders.js';
import { primer } from './scripts/primer.js';
import { debugMode, SetDebugMode, gridSize, SetGridSize } from './scripts/globals.js';

//#region Primer
let sceneCameraRenderer = primer();
let scene = sceneCameraRenderer[0];
let camera = sceneCameraRenderer[1];
let renderer = sceneCameraRenderer[2];

initialize(gridSize, scene, camera);

//#endregion

//#region Grid change
document.getElementById("gridSizeInput").addEventListener("change", async (event) => {
    let newSize = parseInt(event.target.value, 10);
    SetGridSize(newSize);

    if (newSize > 0) {
        console.log("Updating grid size to:", newSize);

        document.body.removeChild(renderer.domElement);

        sceneCameraRenderer = primer();
        scene = sceneCameraRenderer[0];
        camera = sceneCameraRenderer[1];
        renderer = sceneCameraRenderer[2];

        document.body.appendChild(renderer.domElement);

        await initialize(gridSize, scene, camera);
    }
});

//#endregion

//#region Debug Mode

document.getElementById('debugModeInput').addEventListener('change', async(event)=> {
    const isChecked = event.target.checked;
    SetDebugMode(isChecked);
    console.log("Debug mode set to:", debugMode);
    
    document.body.removeChild(renderer.domElement);
    
    sceneCameraRenderer = primer();
    scene = sceneCameraRenderer[0];
    camera = sceneCameraRenderer[1];
    renderer = sceneCameraRenderer[2];
    
    document.body.appendChild(renderer.domElement);
    
    await initialize(gridSize, scene, camera);
})
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