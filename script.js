import { initialize } from './scripts/loaders.js';
import { environmentPrimer } from './scripts/environmentPrimer.js';
import { gridSize, SetGridSize, height, debugMode, ToggleDebugMode, fogMode, ToggleFogMode, setDefaultBlock } from './scripts/globals.js';

//#region Primer
let sceneCameraRenderer = environmentPrimer(debugMode);
let scene = sceneCameraRenderer[0];
let camera = sceneCameraRenderer[1];
let renderer = sceneCameraRenderer[2];

initialize(scene, camera, renderer, gridSize, height).then(models => {
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
        // console.log("Updating grid size to:", newSize);

        // TODO all of these function restart everything, they can be refactored
        document.body.removeChild(renderer.domElement);

        sceneCameraRenderer = environmentPrimer(debugMode);
        scene = sceneCameraRenderer[0];
        camera = sceneCameraRenderer[1];
        renderer = sceneCameraRenderer[2];

        document.body.appendChild(renderer.domElement);

        await initialize(scene, camera, renderer, gridSize, height);
    }
});

//#endregion

//#region Debug Mode
document.getElementById('debugModeInput').addEventListener('change', async (event) => {
    const isChecked = event.target.checked;
    ToggleDebugMode(isChecked);
    console.log("Debug mode set to:", debugMode);

    document.body.removeChild(renderer.domElement);

    sceneCameraRenderer = environmentPrimer(debugMode);
    scene = sceneCameraRenderer[0];
    camera = sceneCameraRenderer[1];
    renderer = sceneCameraRenderer[2];

    document.body.appendChild(renderer.domElement);

    await initialize(scene, camera, renderer, gridSize, height);
})
//#endregion

//#region Fog Mode
document.getElementById('fogInput').addEventListener('change', async (event) => {
    const isChecked = event.target.checked;
    ToggleFogMode(isChecked);
    console.log("Fog Mode set to:", fogMode);

    document.body.removeChild(renderer.domElement);

    sceneCameraRenderer = environmentPrimer(debugMode);
    scene = sceneCameraRenderer[0];
    camera = sceneCameraRenderer[1];
    renderer = sceneCameraRenderer[2];

    document.body.appendChild(renderer.domElement);

    await initialize(scene, camera, renderer, gridSize, height);
})
//#endregion

//#region Default Block
document.getElementById("partCatalog").addEventListener('change', async (event) => {
    if (event.target && event.target.type === 'radio') {
        const selectedValue = event.target.value;

        console.log("Cambio blocco predefinito a:", selectedValue);

        setDefaultBlock(selectedValue);

        document.body.removeChild(renderer.domElement);

        sceneCameraRenderer = environmentPrimer(debugMode);
        scene = sceneCameraRenderer[0];
        camera = sceneCameraRenderer[1];
        renderer = sceneCameraRenderer[2];

        document.body.appendChild(renderer.domElement);

        await initialize(scene, camera, renderer, gridSize, height);
    }
});
//#endregion

//#region Regenerate Model
document.getElementById("regenerateButton").addEventListener("click", async (event) => {
    document.body.removeChild(renderer.domElement);

    sceneCameraRenderer = environmentPrimer(debugMode);
    scene = sceneCameraRenderer[0];
    camera = sceneCameraRenderer[1];
    renderer = sceneCameraRenderer[2];

    document.body.appendChild(renderer.domElement);

    await initialize(scene, camera, renderer, gridSize, height);
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

//#region Debug Window
(function () {
    // Creazione del contenitore CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #debug-panel {
            position: fixed;
            bottom: 10px;
            left: 10px;
            width: 250px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            pointer-events: none; /* Non intralcia i click sulla pagina */
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            display: none;
        }
        .debug-entry { margin-bottom: 4px; border-bottom: 1px solid #333; }
        .debug-label { font-weight: bold; color: #ffcc00; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    document.body.appendChild(panel);

    const debugData = {};

    window.DebugWrite = function (field, data) {
        debugData[field] = data; // Aggiorna il valore

        // Renderizza tutti i campi nel pannello
        panel.innerHTML = Object.keys(debugData).map(key => `
            <div class="debug-entry">
                <span class="debug-label">${key}:</span> ${debugData[key]}
            </div>
        `).join('');
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === 'm') {
            const panel = document.getElementById('debug-panel');
            if (panel.style.display === 'none' || panel.style.display === '') {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        }
    });
})();
//#endregion