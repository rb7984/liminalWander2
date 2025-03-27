import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';
// import { Voxel, VoxelGrid } from './voxelizer';

export function ModelsLoader() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        let models = [];
        let loadedCount = 0;
        const modelPaths = [
            './models/a.gltf',
            './models/b.gltf',
            './models/c.gltf',
            './models/d.gltf',
            './models/e.gltf',
            './models/f.gltf',
            './models/g.gltf',
            './models/h.gltf',
            './models/i.gltf'
        ];

        modelPaths.forEach((path, index) => {
            loader.load(
                path,
                (gltf) => {
                    models[index] = gltf.scene;
                    models[index].scale.set(1, 1, 1);
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

function BlockChooser(v, vg)
{

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