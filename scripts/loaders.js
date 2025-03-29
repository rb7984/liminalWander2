import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
import { VoxelGrid, fillVoxelSpace } from './voxels.js';
// @ts-check

export async function initialize(gridSize, scene) {
    try {
        const modelDict = await loadCSV();
        let voxelGrid = new VoxelGrid(gridSize, modelDict);
        console.log(voxelGrid)

        const models = await loadModels();

        if (models.length > 0) {
            fillVoxelSpace(scene, models, voxelGrid, gridSize);
        } else {
            console.error("No models loaded.");
        }
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

function loadModels() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        let models = [];
        let loadedCount = 0;
        
        const modelPaths = [
            './models/a.gltf',
            './models/b.gltf',
            // './models/c.gltf',
            // './models/d.gltf',
            // './models/e.gltf',
            // './models/f.gltf',
            // './models/g.gltf',
            // './models/h.gltf',
            // './models/i.gltf'
        ];

        modelPaths.forEach((path, index) => {
            loader.load(
                path,
                (gltf) => {
                    let filename = path.split('/').pop();
                    let letter = filename.split('.').shift();

                    models[index] = {
                        model: gltf.scene,
                        name: letter
                    }

                    models[index].model.scale.set(1, 1, 1);
                    loadedCount++;

                    if (loadedCount === modelPaths.length) {
                        resolve(models);
                    }
                },
                undefined,
                (error) => reject(error)
            );
        });
    });
}

async function loadCSV() {
    try {
        // model, rotation, East, West, North, South, Up, Down
        const response = await fetch('./models/handles.csv');
        const text = await response.text();
        const rows = text.split("\n").slice(1);

        let modelDict = {};
        rows.forEach(row => {
            let [model, ...values] = row.split(",");
            modelDict[model] = values.map(Number);
        });

        console.log(modelDict);
        return modelDict;
    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

//#region Alternative approach 

// export function ModelsLoader(callback) {
//     const loader = new GLTFLoader();
//     const modelPaths = ['./models/a.gltf', './models/b.gltf', './models/c.gltf', './models/d.gltf'];
//     let models = [];

//     let loadedCount = 0;
//     modelPaths.forEach((path, index) => {
//         loader.load(path, (gltf) => {
//             const model = gltf.scene;
//             model.scale.set(1, 1, 1);
//             models[index] = model;

//             loadedCount++;
//             if (loadedCount === modelPaths.length) {
//                 callback(models);
//             }
//         });
//     });
// }

// // Usage:
// ModelsLoader((models) => {
//     console.log(models[0]); // Now this works correctly
// });

//#endregion