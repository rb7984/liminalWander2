// TODO Somewhere here to implement a voxelSize.
class Voxel {
    constructor(x, y, z, name = null, rotation = null, handles = null, states = null) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.rotation = rotation;
        this.collapsed = false;
        //East, West, Up, Down, South, North
        this.handles = null;
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

    collapse(voxelGrid) {
        if (this.states.length == 1) {
            this.handles = this.states[0];
            voxelGrid.removeNeighbourhHandles(this);

            this.collapsed = true;

            let matches = voxelGrid.modelDict[this.handles];

            let match = matches[Math.floor(Math.random() * matches.length)];

            let params = match.split('-');

            this.name = params[0];
            this.rotation = params[1];
        }
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
        this.allStates = Object.keys(this.modelDict).map(a => a.split(','));
        console.log(this.allStates);
        this.collapseQueue = [];

        this.initializeEmptyGrid();
        this.generateShell();

        this.generateInterior();

        this.getInfo();
    }

    initializeEmptyGrid() {
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.height; j++)
                for (let k = 0; k < this.size; k++)
                    if (this.isWithinBounds(i, j, k) && this.isEmpty(i, j, k)) {
                        // x, y, z, name = null, rotation = null, handles = null, states = null
                        const voxel = new Voxel(
                            i, j, k,
                            null,
                            null,
                            null,
                            this.allStates
                        );

                        this.grid[i][j][k] = voxel;

                        if (!voxel.collapsed) this.collapseQueue.push(voxel);
                    }
    }

    generateShell() {
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.height; j++)
                for (let k = 0; k < this.size; k++)
                    if (
                        i == 0 ||
                        i == this.size - 1 ||
                        j == 0 ||
                        j == this.height - 1 ||  //This line is the top
                        k == 0 ||
                        k == this.size - 1) {
                        this.grid[i][j][k].states = [[1, 1, 1, 1, 1, 1]];

                        this.grid[i][j][k].collapse(this);

                        this.removeNeighbourhHandles(this.grid[i][j][k]);

                        this.collapseQueue.splice(this.collapseQueue.indexOf(this.grid[i][j][k]), 1);
                    }
    }

    generateInterior() {
        while (this.collapseQueue.length > 0) {

            this.collapseQueue.sort(l => l.states.length);

            if (this.collapseQueue[0].states.length > 0) {
                this.collapseQueue[0].states = [this.collapseQueue[0].states[Math.floor(Math.random() * this.collapseQueue[0].states.length)]];

                this.collapseQueue[0].collapse(this);

                this.removeNeighbourhHandles(this.collapseQueue[0]);
            }
            else {
                console.log("Couldn't find match for " + this.collapseQueue[0]);
            }

            this.collapseQueue.splice(0, 1);
        }
    }

    getInfo() {
        this.totalVoxels = this.grid[0][0].length * this.grid[0].length * this.grid.length;
        // this.clusterArchive = new VoxelClusterArchive();
        // this.walkableVoxels = 0;
        this.failedVoxel = this.grid.flat(2).filter(obj => obj && obj.collapsed === false).length;
    }

    removeNeighbourhHandles(voxel) {
        if (voxel.x < this.size - 1) {
            let neighbourEast = this.grid[voxel.x + 1][voxel.y][voxel.z]; // East
            neighbourEast.states = neighbourEast.states.filter(l => Number(l[1]) === Number(voxel.handles[0]));
        }
        if (voxel.x > 0) {
            let neighbourWest = this.grid[voxel.x - 1][voxel.y][voxel.z]; // West
            neighbourWest.states = neighbourWest.states.filter(l => Number(l[0]) === Number(voxel.handles[1]));
        }

        if (voxel.y < this.height - 1) {
            let neighbourUp = this.grid[voxel.x][voxel.y + 1][voxel.z]; // Up
            neighbourUp.states = neighbourUp.states.filter(l => Number(l[3]) === Number(voxel.handles[2]));
        }
        if (voxel.y > 0) {
            let neighbourDown = this.grid[voxel.x][voxel.y - 1][voxel.z]; // Down
            neighbourDown.states = neighbourDown.states.filter(l => Number(l[2]) === Number(voxel.handles[3]));
        }

        if (voxel.z < this.size - 1) {
            let neighbourSouth = this.grid[voxel.x][voxel.y][voxel.z + 1]; // South
            neighbourSouth.states = neighbourSouth.states.filter(l => Number(l[5]) === Number(voxel.handles[4]));
        }
        if (voxel.z > 0) {
            let neighbourNorth = this.grid[voxel.x][voxel.y][voxel.z - 1]; // North
            neighbourNorth.states = neighbourNorth.states.filter(l => Number(l[4]) === Number(voxel.handles[5]));
        }
    }

    isWithinBounds(x, y, z) {
        return x >= 0 && x < this.size &&
            y >= 0 && y < this.size &&
            z >= 0 && z < this.size;
    }

    isEmpty(x, y, z) {
        return this.grid[x] && this.grid[x][y] && this.grid[x][y][z] === null;
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