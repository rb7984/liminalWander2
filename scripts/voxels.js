// TODO Somewhere here to implement a voxelSize.
class Voxel {
    constructor(x, y, z, name = null, rotation = null, handles = null, states = null) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.rotation = rotation;
        this.collapsed = false;
        //East, West, North, South, Up, Down
        // this.handles = handles;
        if (states.length == 1) {
            this.handles = states[0];
            this.collapsed = true;
        }
        this.states = states;
    }

    constrainBasedOn(neighbor, faceIndex, neighborHandle) {
        const previousCount = this.possibleStates.length;

        this.possibleStates = this.possibleStates.filter(state => {
            return state.handles[faceIndex] === neighborHandle;
        });

        return this.possibleStates.length !== previousCount;
    }
}

export class VoxelGrid {
    constructor(size, height, dictionary) {
        this.size = size;
        this.height = height;
        this.grid = new Array(size).fill(null).map(() =>
            new Array(height).fill(null).map(() =>
                new Array(size).fill(null)
            )
        );
        this.modelDict = dictionary;
        this.unstableVoxels = [];

        this.clusterArchive = new VoxelClusterArchive();
        this.emptyVoxels = 0;
        this.walkableVoxels = 0;
        this.failedVoxel = 0;
        this.totalVoxels = this.grid[0][0].length * this.grid[0].length * this.grid.length;
        this.filledVoxels = 0;

        this.initializeShell();
    }

    initializeShell() {
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.height; j++)
                for (let k = 0; k < this.size; k++)
                    if (
                        i == 0 ||
                        i == this.size - 1 ||
                        j == 0 ||
                        j == this.height - 1 ||  //This line is the top
                        k == 0 ||
                        k == this.size - 1)
                        this.addVoxel(i, j, k, 99, 0, [[1, 1, 1, 1, 1, 1]], [[1, 1, 1, 1, 1, 1]], false);
    }

    addVoxel(x, y, z, name, rotation, handles, states, matchFailed) {
        if (this.isWithinBounds(x, y, z) && this.isEmpty(x, y, z)) {
            const voxel = new Voxel(
                x,
                y,
                z,
                name,
                rotation,
                handles,
                states
            );

            this.grid[x][y][z] = voxel;

            if (matchFailed) this.failedVoxel++;

            this.filledVoxels++;

            if (voxel.collapsed) this.collapsedVoxels++;
            return voxel;
        }

        return null;
    }

    propagate(voxel) {
        let queue = [voxel];

        while (queue.length > 0) {
            let v = queue.shift();

            // neighbour = [neighbourVoxel,
            // 0 = East, 1 = West, 2 = Up, 3 = Down, 4 = South, 5 = North OF TESTED VOXEL,
            // neighborHandle of TESTED VOXEL]
            // HERE qui sbagliato perchè ho fatto neighbour è una lista
            for (let neighbour of this.getNeighbours(v)) {
                let changed = neighbour.constrainBasedOn(v);

                if (changed) {
                    // Se il vicino ha perso opzioni, deve influenzare i suoi vicini
                    queue.push(neighbour);
                }

                if (neighbour.states.length === 0) {
                    throw new Error("PARADOSSO: Nessun modello compatibile trovato!");
                }
            }
        }
    }

    getNeighbours(voxel) {
        let neighbours = [];

        if (voxel.x < this.size - 1) neighbours.push([this.grid[voxel.x + 1][voxel.y][voxel.z], 0, null]); // East
        if (voxel.x > 0) neighbours.push([this.grid[voxel.x - 1][voxel.y][voxel.z], 1, null]); // West

        if (voxel.y < this.height - 1) neighbours.push([this.grid[voxel.x][voxel.y + 1][voxel.z], 2, null]); // Up
        if (voxel.y > 0) neighbours.push([this.grid[voxel.x][voxel.y - 1][voxel.z], 3, null]); // Down

        if (voxel.z < this.size - 1) neighbours.push([this.grid[voxel.x][voxel.y][voxel.z + 1], 4, null]); // South
        if (voxel.z > 0) neighbours.push([this.grid[voxel.x][voxel.y][voxel.z - 1], 5, null]); // North

        return neighbours;
    }

    getRemainingVoxels() {
        return this.totalVoxels - this.filledVoxels;
    }

    isWithinBounds(x, y, z) {
        return x >= 0 && x < this.size &&
            y >= 0 && y < this.size &&
            z >= 0 && z < this.size;
    }

    isEmpty(x, y, z) {
        return this.grid[x] && this.grid[x][y] && this.grid[x][y][z] === null;
    }

    collapse(voxel) {
        if (voxel.states.length == 1) {
            voxel.handles = voxel.states[0];
        }
    }

    // TODO: Radar only looks back now, but there could be a different assemblage order and in that case radar should be looking in all directions
    radar(i, j, k) {
        // Voxel.handles = [East, West, Up, Down, South, North]
        let west = null;
        if (i > 0) west = this.grid[i - 1][j][k].handles[0];

        let down = null;
        if (j > 0) down = this.grid[i][j - 1][k].handles[2];

        let north = null;
        if (k > 0) north = this.grid[i][j][k - 1].handles[4];

        return [null, west, null, down, null, north]
    }

    matcher(constraints) {
        let possibleMatches = [];

        for (let charKey in this.modelDict) {
            const values = charKey.split(",").map(Number);

            let isMatch = true;
            for (let i = 0; i < 6; i++) {
                if (constraints[i] !== null && constraints[i] !== values[i]) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                this.modelDict[charKey].forEach(modelName => {
                    possibleMatches.push({
                        config: modelName,
                        handles: values
                    });
                });
            }
        }

        if (possibleMatches.length === 0) return null;

        const selected = possibleMatches[Math.floor(Math.random() * possibleMatches.length)];

        return [selected.config, selected.handles];
    }

    getDictValues(key) {
        return this.modelDict[key];
    }

    updateClusters(voxel) {
        if (voxel.name == "99") this.emptyVoxels++
        if (voxel.name == "99" && this.grid[voxel.x][voxel.y - 1][voxel.z].handles[2] == "0") this.walkableVoxels++

        if (!voxel) return;
    }
}

class VoxelCluster {
    constructor(voxel) {
        this.voxels = [voxel];
    }

    AddVoxel(voxel) {
        this.voxels.push(voxel);
    }
}

export class VoxelClusterArchive {
    constructor() {
        this.clusters = [];
    }

    AddCluster(cluster) {
        this.clusters.push(cluster);
    }
}