// @ts-check

export class Voxel {
    constructor(x, y, z, name, rotation, handles) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.rotation = rotation;
        //East, West, North, South, Up, Down
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

    radar(i, j, k) {
        // Voxel.handles = [East, West, North, South, Up, Down]
        let west = null;
        if (i > 0) west = this.grid[i - 1][j][k].handles[0];

        let down = null;
        if (j > 0) down = this.grid[i][j - 1][k].handles[4];

        let south = null;
        if (k > 0) south = this.grid[i][j][k - 1].handles[2];

        return [null, west, null, south, null, down]
    }
}