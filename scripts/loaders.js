import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
import { VoxelGrid } from './voxels.js';
// @ts-check

export async function initialize(gridSize, scene) {
    try {
        const modelDict = await loadCSV();
        let voxelGrid = new VoxelGrid(gridSize, modelDict);
        //console.log(voxelGrid)

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
            './models/0.gltf',
            './models/1.gltf',
            './models/2.gltf',
            './models/3.gltf',
            './models/4.gltf',
            './models/5.gltf',
            './models/6.gltf',
            './models/7.gltf',
            './models/8.gltf',
            './models/9.gltf',
            './models/10.gltf',
            './models/11.gltf',
            './models/12.gltf'
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
            modelDict[name.concat("-" + rotation)] = values.map(Number);
        });

        //console.log(modelDict);
        return modelDict;

    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

function fillVoxelSpace(scene, objects, voxelGrid, gridSize) {
    // i=x; j=z; k=y
    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < 1; j++) {
            for (let k = 0; k < gridSize; k++) {
                let constraints = voxelGrid.radar(i, j, k);

                let dictionaryKey = voxelGrid.matcher(constraints);
                console.log(dictionaryKey);
                let params = dictionaryKey.split("-").map(Number);;
                console.log(params);
                let object = objects[params[0]];
                let rotationIndex = params[1];

                if (voxelGrid.isEmpty(i, j, k)) {
                    let model = object.model.clone();
                    let name = object.name;

                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            model.rotation.y = rotationIndex * Math.PI / 2
                        }
                    });

                    let voxel = voxelGrid.addVoxel(i, j, k, name, rotationIndex);
                    if (voxel) {
                        model.position.set(i, j, k);
                        scene.add(model);
                    }
                }

                //debug points
                {
                    let pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    let pointGeometry = new THREE.SphereGeometry(0.05);

                    let pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
                    pointMesh.position.set(i + 0.5, j - 0.5, k - 0.5);
                    scene.add(pointMesh);
                    
                    let pointMesh1 = new THREE.Mesh(pointGeometry, pointMaterial);
                    pointMesh1.position.set(i - 0.5, j - 0.5, k - 0.5);
                    scene.add(pointMesh1);

                    let pointMesh2 = new THREE.Mesh(pointGeometry, pointMaterial);
                    pointMesh2.position.set(i + 0.5, j + 0.5, k - 0.5);
                    scene.add(pointMesh2);

                    let pointMesh3 = new THREE.Mesh(pointGeometry, pointMaterial);
                    pointMesh3.position.set(i - 0.5, j + 0.5, k - 0.5);
                    scene.add(pointMesh3);

                    let pointMesh4 = new THREE.Mesh(pointGeometry, pointMaterial);
                    pointMesh4.position.set(i + 0.5, j + 0.5, k + 0.5);
                    scene.add(pointMesh4);

                    let pointMesh5 = new THREE.Mesh(pointGeometry, pointMaterial);
                    pointMesh5.position.set(i - 0.5, j + 0.5, k + 0.5);
                    scene.add(pointMesh5);

                    let pointMesh6 = new THREE.Mesh(pointGeometry, pointMaterial);
                    pointMesh6.position.set(i + 0.5, j - 0.5, k + 0.5);
                    scene.add(pointMesh6);

                    let pointMesh7 = new THREE.Mesh(pointGeometry, pointMaterial);
                    pointMesh7.position.set(i - 0.5, j - 0.5, k + 0.5);
                    scene.add(pointMesh7);
                }
            }
        }
    }
}