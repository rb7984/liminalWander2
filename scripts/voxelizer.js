import * as THREE from 'https://esm.sh/three';

class Voxel {
    constructor(x, y, z, model) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.model = model;
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

    addVoxel(x, y, z, model) {
        if (this.isWithinBounds(x, y, z) && this.isEmpty(x, y, z)) {
            const voxel = new Voxel(x, y, z, model);
            this.grid[x][y][z] = voxel;
            return voxel;
        }
        return null;
    }
}

export function fillVoxelSpace(scene, models, voxelGrid, gridSize) {

    for (let i = 1; i < gridSize; i += 2) {
        for (let j = 1; j < gridSize; j += 2) {
            for (let k = 1; k < gridSize; k += 2) {

                let model = models[Math.floor(Math.random() * 4)];

                if (voxelGrid.isEmpty(i, j, k)) {
                    let m = model.clone();

                    m.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    let voxel = voxelGrid.addVoxel(i, j, k, m);
                    if (voxel) {
                        voxel.model.position.set(i, j, k);
                        scene.add(voxel.model);
                    }
                }
            }
        }
    }
}
