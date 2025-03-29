// @ts-check

export class Voxel {
    constructor(x, y, z, name, rotation, handles) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.rotation = rotation;
        this.handles = handles;
    }
}

export class VoxelGrid {
    constructor(size = 100, dictionary) {
        this.size = size;
        this.grid = new Array(size).fill(null).map(() =>
            new Array(size).fill(null).map(() =>
                new Array(size).fill(null)
            )
        );
        this.modelDict = dictionary;
    }

    isWithinBounds(x, y, z) {
        return x >= 0 && x < this.size &&
            y >= 0 && y < this.size &&
            z >= 0 && z < this.size;
    }

    isEmpty(x, y, z) {
        return this.grid[x] && this.grid[x][y] && this.grid[x][y][z] === null;
    }

    addVoxel(x, y, z, name, rotation) {
        if (this.isWithinBounds(x, y, z) && this.isEmpty(x, y, z)) {
            const voxel = new Voxel(
                x,
                y,
                z,
                name,
                rotation,
                this.modelDict[name.concat(rotation)]
            );

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