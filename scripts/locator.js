import { GLTFLoader } from 'https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js';

export function locator(modelScene) {
    const loader = new GLTFLoader();
    loader.load('models/a.gltf', (gltf) => {
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