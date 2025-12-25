/** AR Maze Navigation - Navigate a virtual maze by moving physical markers */
var ARMazeNavigation = pc.createScript('arMazeNavigation');

ARMazeNavigation.attributes.add('playerMarkerId', {
    type: 'number',
    default: 50,
    description: 'Marker ID for player avatar'
});

ARMazeNavigation.attributes.add('goalMarkerId', {
    type: 'number',
    default: 51,
    description: 'Marker ID for goal/exit'
});

ARMazeNavigation.attributes.add('mazeSize', {
    type: 'number',
    default: 10,
    description: 'Maze grid size'
});

ARMazeNavigation.prototype.initialize = function() {
    this.maze = [];
    this.player = null;
    this.goal = null;
    this.playerPos = { x: 0, y: 0 };
    this.goalPos = { x: this.mazeSize - 1, y: this.mazeSize - 1 };
    this.timeStarted = Date.now();
    this.completed = false;

    this.generateMaze();
    this.createMazeVisuals();
};

ARMazeNavigation.prototype.generateMaze = function() {
    // Initialize maze grid
    for (let y = 0; y < this.mazeSize; y++) {
        this.maze[y] = [];
        for (let x = 0; x < this.mazeSize; x++) {
            this.maze[y][x] = {
                walls: { north: true, south: true, east: true, west: true },
                visited: false
            };
        }
    }

    // Generate maze using recursive backtracking
    this.carveMaze(0, 0);

    // Ensure start and end are accessible
    this.maze[0][0].walls.north = false;
    this.maze[this.mazeSize - 1][this.mazeSize - 1].walls.south = false;
};

ARMazeNavigation.prototype.carveMaze = function(x, y) {
    this.maze[y][x].visited = true;

    const directions = [
        { dx: 0, dy: -1, wall: 'north', opposite: 'south' },
        { dx: 1, dy: 0, wall: 'east', opposite: 'west' },
        { dx: 0, dy: 1, wall: 'south', opposite: 'north' },
        { dx: -1, dy: 0, wall: 'west', opposite: 'east' }
    ];

    // Shuffle directions
    for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
    }

    for (const dir of directions) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;

        if (nx >= 0 && nx < this.mazeSize && ny >= 0 && ny < this.mazeSize && !this.maze[ny][nx].visited) {
            this.maze[y][x].walls[dir.wall] = false;
            this.maze[ny][nx].walls[dir.opposite] = false;
            this.carveMaze(nx, ny);
        }
    }
};

ARMazeNavigation.prototype.createMazeVisuals = function() {
    const cellSize = 0.1;
    const wallHeight = 0.05;

    for (let y = 0; y < this.mazeSize; y++) {
        for (let x = 0; x < this.mazeSize; x++) {
            const cell = this.maze[y][x];
            const baseX = (x - this.mazeSize / 2) * cellSize;
            const baseZ = (y - this.mazeSize / 2) * cellSize;

            // Create walls
            if (cell.walls.north) this.createWall(baseX, baseZ - cellSize / 2, cellSize, 0.01, wallHeight);
            if (cell.walls.south) this.createWall(baseX, baseZ + cellSize / 2, cellSize, 0.01, wallHeight);
            if (cell.walls.east) this.createWall(baseX + cellSize / 2, baseZ, 0.01, cellSize, wallHeight);
            if (cell.walls.west) this.createWall(baseX - cellSize / 2, baseZ, 0.01, cellSize, wallHeight);
        }
    }
};

ARMazeNavigation.prototype.createWall = function(x, z, width, depth, height) {
    const wall = new pc.Entity('Wall');
    this.entity.addChild(wall);
    wall.addComponent('model', { type: 'box' });
    wall.setLocalPosition(x, height / 2, z);
    wall.setLocalScale(width, height, depth);
};

ARMazeNavigation.prototype.onMarkerDetected = function(markerId, pose) {
    if (markerId === this.playerMarkerId) {
        this.updatePlayer(pose);
    } else if (markerId === this.goalMarkerId) {
        this.updateGoal(pose);
    }
};

ARMazeNavigation.prototype.updatePlayer = function(pose) {
    if (!this.player) {
        this.player = new pc.Entity('Player');
        this.entity.addChild(this.player);
        this.player.addComponent('model', { type: 'sphere' });
        this.player.setLocalScale(0.05, 0.05, 0.05);
    }

    this.player.setPosition(pose.position);
    this.updatePlayerGridPosition(pose.position);
    this.checkWinCondition();
};

ARMazeNavigation.prototype.updatePlayerGridPosition = function(worldPos) {
    const cellSize = 0.1;
    const gridX = Math.floor((worldPos.x + this.mazeSize * cellSize / 2) / cellSize);
    const gridY = Math.floor((worldPos.z + this.mazeSize * cellSize / 2) / cellSize);

    if (gridX >= 0 && gridX < this.mazeSize && gridY >= 0 && gridY < this.mazeSize) {
        this.playerPos = { x: gridX, y: gridY };
    }
};

ARMazeNavigation.prototype.updateGoal = function(pose) {
    if (!this.goal) {
        this.goal = new pc.Entity('Goal');
        this.entity.addChild(this.goal);
        this.goal.addComponent('model', { type: 'cylinder' });
        this.goal.setLocalScale(0.05, 0.1, 0.05);
    }

    this.goal.setPosition(pose.position);
};

ARMazeNavigation.prototype.checkWinCondition = function() {
    if (this.completed) return;

    if (this.playerPos.x === this.goalPos.x && this.playerPos.y === this.goalPos.y) {
        this.completed = true;
        const timeElapsed = (Date.now() - this.timeStarted) / 1000;
        console.log('Maze completed in', timeElapsed.toFixed(2), 'seconds!');
        this.showVictory();
    }
};

ARMazeNavigation.prototype.showVictory = function() {
    // Victory effects - particles, animations, etc.
    if (this.goal) {
        // Animate goal
    }
};

ARMazeNavigation.prototype.reset = function() {
    this.playerPos = { x: 0, y: 0 };
    this.timeStarted = Date.now();
    this.completed = false;
    this.generateMaze();
};
