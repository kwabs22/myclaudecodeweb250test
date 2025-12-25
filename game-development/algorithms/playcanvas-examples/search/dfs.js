/**
 * Depth-First Search (DFS)
 * Algorithm: Explore as far as possible along each branch before backtracking
 * Game: "Maze Explorer" - Navigate dungeon using DFS, mark dead ends
 */

var DFS = pc.createScript('dfs');

DFS.attributes.add('gridSize', { type: 'number', default: 10 });
DFS.attributes.add('searchSpeed', { type: 'number', default: 0.3 });
DFS.attributes.add('wallDensity', { type: 'number', default: 0.3, min: 0, max: 0.5 });

DFS.prototype.initialize = function() {
    this.grid = [];
    this.cells = [];
    this.stack = [];
    this.visited = new Set();
    this.searching = false;
    this.timer = 0;
    this.start = { row: 0, col: 0 };
    this.goal = { row: this.gridSize - 1, col: this.gridSize - 1 };
    this.score = 0;
    this.pathFound = false;

    this.createMaze();
};

DFS.prototype.createMaze = function() {
    this.cells.forEach(c => c.destroy());
    this.cells = [];
    this.grid = [];

    for (let row = 0; row < this.gridSize; row++) {
        this.grid[row] = [];
        for (let col = 0; col < this.gridSize; col++) {
            const isWall = Math.random() < this.wallDensity &&
                !(row === 0 && col === 0) && !(row === this.gridSize - 1 && col === this.gridSize - 1);

            this.grid[row][col] = {
                row, col,
                isWall,
                visited: false,
                inPath: false
            };

            this.createCell(row, col, isWall);
        }
    }
};

DFS.prototype.createCell = function(row, col, isWall) {
    const cell = new pc.Entity('Cell_' + row + '_' + col);
    this.entity.addChild(cell);

    const spacing = 1.2;
    const offset = (this.gridSize - 1) * spacing / 2;
    cell.setLocalPosition(col * spacing - offset, 0, row * spacing - offset);

    cell.addComponent('model', { type: 'box' });
    cell.setLocalScale(1, 0.2, 1);

    if (cell.model && cell.model.meshInstances[0]) {
        let color;
        if (row === this.start.row && col === this.start.col) {
            color = new pc.Color(0, 1, 0); // Start - green
        } else if (row === this.goal.row && col === this.goal.col) {
            color = new pc.Color(1, 0, 0); // Goal - red
        } else if (isWall) {
            color = new pc.Color(0.2, 0.2, 0.2); // Wall - dark
        } else {
            color = new pc.Color(0.8, 0.8, 0.8); // Empty - light
        }

        cell.model.meshInstances[0].material.diffuse = color;
        cell.model.meshInstances[0].material.update();
    }

    cell.gridRow = row;
    cell.gridCol = col;
    this.cells.push(cell);
};

DFS.prototype.startDFS = function() {
    this.searching = true;
    this.stack = [this.start];
    this.visited.clear();
    this.pathFound = false;
    this.visited.add(this.start.row + ',' + this.start.col);
};

DFS.prototype.dfsStep = function() {
    if (this.stack.length === 0) {
        this.searching = false;
        if (!this.pathFound) {
            console.log('No path found!');
        }
        return;
    }

    const current = this.stack.pop();
    this.highlightCell(current.row, current.col, new pc.Color(0, 0.5, 1));

    if (current.row === this.goal.row && current.col === this.goal.col) {
        this.searching = false;
        this.pathFound = true;
        console.log('Goal found! Score:', this.score);
        this.highlightCell(current.row, current.col, new pc.Color(1, 0.8, 0));
        return;
    }

    // Explore neighbors (up, right, down, left)
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    for (const [dr, dc] of directions) {
        const newRow = current.row + dr;
        const newCol = current.col + dc;
        const key = newRow + ',' + newCol;

        if (this.isValid(newRow, newCol) && !this.visited.has(key)) {
            this.visited.add(key);
            this.stack.push({ row: newRow, col: newCol });
            this.highlightCell(newRow, newCol, new pc.Color(0.5, 0.7, 1));
            this.score += 1;
        }
    }
};

DFS.prototype.isValid = function(row, col) {
    return row >= 0 && row < this.gridSize &&
        col >= 0 && col < this.gridSize &&
        !this.grid[row][col].isWall;
};

DFS.prototype.highlightCell = function(row, col, color) {
    const index = row * this.gridSize + col;
    const cell = this.cells[index];

    if (cell && cell.model && cell.model.meshInstances[0]) {
        cell.model.meshInstances[0].material.diffuse = color;
        cell.model.meshInstances[0].material.update();
    }
};

DFS.prototype.update = function(dt) {
    if (this.searching) {
        this.timer += dt;
        if (this.timer >= this.searchSpeed) {
            this.timer = 0;
            this.dfsStep();
        }
    }
};

DFS.prototype.reset = function() {
    this.searching = false;
    this.stack = [];
    this.visited.clear();
    this.score = 0;
    this.createMaze();
};
