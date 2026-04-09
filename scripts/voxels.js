// TODO Somewhere here to implement a voxelSize.

class Voxel {
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
        this.clusterArchive = new VoxelClusterArchive();
        this.emptyVoxels = 0;
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
                this.modelDict[name.concat("-" + rotation)]
            );

            this.grid[x][y][z] = voxel;
            if (name == "99") this.emptyVoxels++
            return voxel;
        }
        return null;
    }

    // TODO: Radar only looks back now, but there could be a different assemblage order and in that case radar should be looking in all directions
    radar(i, j, k) {
        // Voxel.handles = [East, West, Up, Down, North, South]
        let west = null;
        if (i > 0) west = this.grid[i - 1][j][k].handles[0];

        let down = null;
        if (j > 0) down = this.grid[i][j - 1][k].handles[2];

        let south = null;
        if (k > 0) south = this.grid[i][j][k - 1].handles[4];

        return [null, west, null, down, null, south]
    }

    matcher(constraints) {
        let matches = []
        for (let key in this.modelDict) {
            let values = this.modelDict[key];
            let match = constraints.every((val, index) => val === null || val === values[index]);

            if (match) matches.push(key);
        }

        if (matches.length == 0) return null;
        return matches[Math.floor(Math.random() * matches.length)]
    }

    getDictValues(key) {
        return this.modelDict[key];
    }

    updateClusters(voxel){
        if (voxel.name == "99")
        {
            console.log("true");
        }   

        if (!voxel) return;
    }
}

class VoxelCluster {
    constructor(voxel){
        this.voxels = [voxel];
    }

    AddVoxel(voxel){
        this.voxels.push(voxel);
    }
}

export class VoxelClusterArchive{
    constructor(){
        this.clusters = [];
    }

    AddCluster(cluster){
        this.clusters.push(cluster);
    }
}