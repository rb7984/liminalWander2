import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';

export function locator(modelScene) {
    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load('model.gltf', (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        modelScene.add(model);
    });
}