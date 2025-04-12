import * as THREE from 'https://esm.sh/three';
import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
import { VoxelGrid } from './voxels.js';
import { debugMode } from './globals.js';
import { vertexShader, fragmentShader } from './shader.js';
// @ts-check

export async function initialize(gridSize, scene, camera, renderer) {
    try {
        const modelDict = await loadCSV();
        let voxelGrid = new VoxelGrid(gridSize, modelDict);
        //console.log(voxelGrid)
        let cameraPosition = [0, 0, 0]

        const models = await loadModels(renderer, camera);

        if (models.length > 0) {
            cameraPosition = fillVoxelSpace(scene, models, voxelGrid, gridSize);

            camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
            camera.lookAt(cameraPosition[0] + 1, cameraPosition[1], cameraPosition[2] + 1);
        } else {
            console.error("No models loaded.");
        }
        
        return models;
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

function loadModels(renderer, camera) {
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
            './models/12.gltf',
            './models/13.gltf',
            './models/14.gltf'
        ];

        modelPaths.forEach((path, index) => {
            loader.load(
                path,
                (gltf) => {
                    let filename = path.split('/').pop();
                    let letter = filename.split('.').shift();

                    //#region Shader approach

                    let texture = null;

                    // Traverse the scene to find a mesh and get its texture
                    gltf.scene.traverse((child) => {
                        if (child.isMesh && child.material.map) {
                            texture = child.material.map;
                        }
                    });

                    if (!texture) {
                        console.warn(`No texture found for model: ${path}`);
                        loadedCount++;
                        return;
                    }

                    // Create the shader material using the extracted texture
                    const fadeMaterial = new THREE.ShaderMaterial({
                        uniforms: {
                            uTexture: { value: texture },
                            uCameraPosition: { value: camera.position.clone() },
                            uFadeStart: { value: 30.0 },
                            uFadeEnd: { value: 100.0 },
                            uColor: { value: new THREE.Color(0xcccccc) }
                        },
                        vertexShader: `
                           varying vec3 vWorldPosition;
                           varying vec2 vUv;
                                        
                           void main() {
                               vUv = uv;
                               vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                               vWorldPosition = worldPosition.xyz;
                               gl_Position = projectionMatrix * viewMatrix * worldPosition;
                           }
                       `,
                        fragmentShader: `
                           uniform sampler2D uTexture;
                           uniform vec3 uCameraPosition;
                           uniform vec3 uColor;
                           uniform float uFadeStart;
                           uniform float uFadeEnd;
                                        
                           varying vec3 vWorldPosition;
                           varying vec2 vUv;
                                        
                           void main() {
                               float dist = distance(vWorldPosition, uCameraPosition);
                               float fadeFactor = clamp((dist - uFadeStart) / (uFadeEnd - uFadeStart), 0.0, 1.0);
                                        
                               vec4 texColor = texture2D(uTexture, vUv);
                               vec4 baseColor = vec4(uColor, 1.0);
                                        
                               gl_FragColor = mix(texColor, baseColor, fadeFactor);
                           }
                       `,
                        transparent: false
                    });

                    // Apply the shader material to all meshes in the model
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            child.material = fadeMaterial;
                        }
                    });

                    models[index] = {
                        model: gltf.scene,
                        name: letter,
                        fadeMaterial
                    };
                    //#endregion

                    models[index] = {
                        model: gltf.scene,
                        name: letter,
                        fadeMaterial
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
            if (!row.trim()) return;

            let [name, rotation, ...values] = row.split(";");

            if (!name || !rotation || values.length === 0) return;

            modelDict[name.concat("-" + rotation)] = values.map(Number);
        });

        //console.log(modelDict);
        return modelDict;

    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

function fillVoxelSpace(scene, objects, voxelGrid, gridSize) {
    let emptyVoxel = null;

    let colorList = [
        new THREE.Color('skyblue'), // 0
        new THREE.Color('tomato'), // 1
        new THREE.Color('gold'), // 2
        new THREE.Color('mediumseagreen'), // 3
        new THREE.Color('deepskyblue'), // 4
        new THREE.Color('orchid'), // 5
        new THREE.Color('slategray'), // 6
        new THREE.Color('crimson'), // 7
        new THREE.Color('limegreen'), // 8
        new THREE.Color('darkorange'), // 9
        new THREE.Color('dodgerblue'), // 10
        new THREE.Color('plum'), // 11
        new THREE.Color('teal'), // 12
        new THREE.Color('indianred'), // 13
        new THREE.Color('lightcoral') // 14
    ]

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./models/texture.png');

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    // i=x; j=z; k=y
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < 6; j++) {
            for (let k = 0; k < gridSize; k++) {
                // radar return the constraints contextual to the new voxel.
                // e.g. returns the west constraint based on the east handle of the i-1 voxel
                let constraints = voxelGrid.radar(i, j, k);
                let dictionaryKey = voxelGrid.matcher(constraints);
                // console.log("block: " + i + "; " + j + "; " + k);
                // console.log("dictionaryKey: " + dictionaryKey);

                // match not found - red 0-0
                let debugColor = dictionaryKey == null ? new THREE.Color('red') : null;
                // TODO here for default non matching
                if (dictionaryKey == null) dictionaryKey = "99-0";

                if (
                    i == 0 || i == gridSize - 1 ||
                    j == 0 ||
                    // j == 6 - 1 ||  //This line is the top
                    k == 0 || k == gridSize - 1)
                    dictionaryKey = "0-0";

                // match found (forced/not)
                let params = dictionaryKey.split("-").map(Number);

                if (params[0] == 99) {
                    voxelGrid.addVoxel(i, j, k, "99", 0);
                    // console.log("constraints: " + constraints);
                    // console.log("Choosen block: " + params + "; handles: " + voxelGrid.getDictValues(dictionaryKey));
                    // console.log("---------------------");

                    if (emptyVoxel == null) emptyVoxel = [i, j, k];

                    continue;
                }
                else {
                    // color except for not found
                    if (debugColor == null) debugColor = colorList[params[0]];

                    let object = objects[params[0]];
                    let rotationIndex = params[1];

                    // console.log("constraints: " + constraints);
                    // console.log("Choosen block: " + params + "; handles: " + voxelGrid.getDictValues(dictionaryKey));
                    // console.log("---------------------");

                    if (voxelGrid.isEmpty(i, j, k)) {
                        let model = object.model.clone();
                        let name = object.name;

                        model.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                                model.rotation.y = rotationIndex * Math.PI / 2;
                                if (debugMode) child.material = new THREE.MeshStandardMaterial({ color: debugColor });
                            }
                        });

                        let voxel = voxelGrid.addVoxel(i, j, k, name, rotationIndex);
                        if (voxel) {
                            model.position.set(i, j, k);
                            scene.add(model);
                        }
                    }
                }

                //debugPoints(i, j, k, scene);
            }
        }
    }

    return emptyVoxel;
}

function debugPoints(i, j, k, scene) {
    //debug points
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