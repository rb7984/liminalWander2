import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
import { VoxelGrid } from './voxels.js';
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
            let [name, rotation, ...values] = row.split(";");
            modelDict[name.concat(rotation)] = values.map(Number);
        });

        console.log(modelDict);
        return modelDict;

    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

function fillVoxelSpace(scene, objects, voxelGrid, gridSize) {
    // i=x; j=z; k=y
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            for (let k = 0; k < gridSize; k++) {

                let constraints = voxelGrid.radar(i,j,k);
                console.log(constraints);

                let params = Configurator();
                let object = objects[params[0]];

                if (voxelGrid.isEmpty(i, j, k)) {
                    let model = object.model.clone();
                    let name = object.name;

                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            model.rotation.y = params[1] * Math.PI / 2
                        }
                    });

                    let voxel = voxelGrid.addVoxel(i, j, k, name, params[1]);
                    if (voxel) {
                        model.position.set(i, j, k);
                        scene.add(model);
                    }
                }
            }
        }
    }
}

function Configurator() {
    // model index, rotation
    return [1, 1];
}