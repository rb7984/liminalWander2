//import * as THREE from 'https://esm.sh/three';
// @ts-check

export class Voxel {
    constructor(x, y, z, model, name, rotation) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.model = model;
        this.handles = this.Handles(name, rotation);
    }

    Handles(name, rotation) {
        return [null, null, null, null, null, null]
    }
}

export class VoxelGrid {
    constructor(size = 100) {
        this.size = size;
        this.grid = new Array(size).fill(null).map(() =>
            new Array(size).fill(null).map(() =>
                new Array(size).fill(null)
            )
        );
    }

    isWithinBounds(x, y, z) {
        return x >= 0 && x < this.size &&
            y >= 0 && y < this.size &&
            z >= 0 && z < this.size;
    }

    isEmpty(x, y, z) {
        return this.grid[x] && this.grid[x][y] && this.grid[x][y][z] === null;
    }

    addVoxel(x, y, z, model, name, rotation) {
        if (this.isWithinBounds(x, y, z) && this.isEmpty(x, y, z)) {
            const voxel = new Voxel(x, y, z, model, name, rotation);
            this.grid[x][y][z] = voxel;
            return voxel;
        }
        return null;
    }
}

export function fillVoxelSpace(scene, objects, voxelGrid, gridSize) {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            for (let k = 0; k < gridSize; k++) {

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

                    let voxel = voxelGrid.addVoxel(i, j, k, model, name, params[1]);
                    if (voxel) {
                        voxel.model.position.set(i, j, k);
                        scene.add(voxel.model);
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