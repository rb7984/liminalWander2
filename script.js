import { initialize } from './scripts/loaders.js';
import { primer } from './scripts/primer.js';
import { gridSize, SetGridSize, debugMode, ToggleDebugMode, fogMode, ToggleFogMode } from './scripts/globals.js';

//#region Primer
let sceneCameraRenderer = primer();
let scene = sceneCameraRenderer[0];
let camera = sceneCameraRenderer[1];
let renderer = sceneCameraRenderer[2];

initialize(gridSize, scene, camera, renderer).then(models => {
    if (Array.isArray(models)) {
        // animate(models);
        animateWithoutShader();
    } else {
        console.error("Models not loaded correctly", models);
    }
});

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
    ToggleDebugMode(isChecked);
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

//#region Fog Mode
document.getElementById('fogInput').addEventListener('change', async(event)=>{
    const isChecked = event.target.checked;
    ToggleFogMode(isChecked);
    console.log("Fog Mode set to:", fogMode);

    document.body.removeChild(renderer.domElement);
    
    sceneCameraRenderer = primer();
    scene = sceneCameraRenderer[0];
    camera = sceneCameraRenderer[1];
    renderer = sceneCameraRenderer[2];
    
    document.body.appendChild(renderer.domElement);
    
    await initialize(gridSize, scene, camera);
})
//#endregion

//#region Regenerate Model
document.getElementById("regenerateButton").addEventListener("click", async(event) => {
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
// function animate(models) {
//     requestAnimationFrame(() => animate(models));

//     models.forEach(({ fadeMaterials }) => {
//         if (Array.isArray(fadeMaterials)) {
//             fadeMaterials.forEach((material) => {
//                 if (material.uniforms.uCameraPosition) {
//                     material.uniforms.uCameraPosition.value.copy(camera.position);
//                 }
//             });
//         }
//     });

//     renderer.render(scene, camera);
// }

function animateWithoutShader() {
    requestAnimationFrame(animateWithoutShader);
    renderer.render(scene, camera);
}

//#endregion

//#region Window Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
//#endregion