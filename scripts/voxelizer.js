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

export function fillVoxelSpace(scene, model, voxelGrid, targetCount = 100) {
    const startX = 0, startY = 0, startZ = 0;
    const range = 50;
    let count = 0;

    while (count < targetCount) {
        let x = startX + Math.floor(Math.random() * range);
        let y = startY + Math.floor(Math.random() * range);
        let z = startZ + Math.floor(Math.random() * range);

        if (voxelGrid.isEmpty(x, y, z)) {
            let voxel = voxelGrid.addVoxel(x, y, z, model.clone());
            if (voxel) {
                voxel.model.position.set(x, y, z);
                scene.add(voxel.model);
                count++;
            }
        }
    }
}
