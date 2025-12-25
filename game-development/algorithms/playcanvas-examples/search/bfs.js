/**
 * Breadth-First Search (BFS)
 * Algorithm: Explore all neighbors at current depth before moving deeper
 * Game: "Flood Fill Paint" - Fill adjacent cells level by level
 */

var BFS = pc.createScript('bfs');

BFS.attributes.add('gridSize', { type: 'number', default: 12 });
BFS.attributes.add('searchSpeed', { type: 'number', default: 0.2 });
BFS.attributes.add('wallDensity', { type: 'number', default: 0.25, min: 0, max: 0.5 });

BFS.prototype.initialize = function() {
    this.grid = [];
    this.cells = [];
    this.queue = [];
    this.visited = new Set();
    this.searching = false;
    this.timer = 0;
    this.start = { row: 0, col: 0 };
    this.goal = { row: this.gridSize - 1, col: this.gridSize - 1 };
    this.score = 0;
    this.level = 0;

    this.createMaze();
};

BFS.prototype.createMaze = function() {
    this.cells.forEach(c => c.destroy());
    this.cells = [];
    this.grid = [];

    for (let row = 0; row < this.gridSize; row++) {
        this.grid[row] = [];
        for (let col = 0; col < this.gridSize; col++) {
            const isWall = Math.random() < this.wallDensity &&
                !(row === 0 && col === 0) && !(row === this.gridSize - 1 && col === this.gridSize - 1);

            this.grid[row][col] = { row, col, isWall, level: -1 };
            this.createCell(row, col, isWall);
        }
    }
};

BFS.prototype.createCell = function(row, col, isWall) {
    const cell = new pc.Entity('Cell_' + row + '_' + col);
    this.entity.addChild(cell);

    const spacing = 1.0;
    const offset = (this.gridSize - 1) * spacing / 2;
    cell.setLocalPosition(col * spacing - offset, 0, row * spacing - offset);

    cell.addComponent('model', { type: 'box' });
    cell.setLocalScale(0.9, 0.2, 0.9);

    if (cell.model && cell.model.meshInstances[0]) {
        let color;
        if (row === this.start.row && col === this.start.col) {
            color = new pc.Color(0, 1, 0);
        } else if (row === this.goal.row && col === this.goal.col) {
            color = new pc.Color(1, 0, 0);
        } else if (isWall) {
            color = new pc.Color(0.2, 0.2, 0.2);
        } else {
            color = new pc.Color(0.9, 0.9, 0.9);
        }

        cell.model.meshInstances[0].material.diffuse = color;
        cell.model.meshInstances[0].material.update();
    }

    cell.gridRow = row;
    cell.gridCol = col;
    this.cells.push(cell);
};

BFS.prototype.startBFS = function() {
    this.searching = true;
    this.queue = [{ ...this.start, level: 0 }];
    this.visited.clear();
    this.visited.add(this.start.row + ',' + this.start.col);
    this.level = 0;
    this.grid[this.start.row][this.start.col].level = 0;
};

BFS.prototype.bfsStep = function() {
    if (this.queue.length === 0) {
        this.searching = false;
        console.log('BFS complete! Score:', this.score);
        return;
    }

    const current = this.queue.shift();
    this.level = Math.max(this.level, current.level);

    // Color based on level (wave effect)
    const hue = (current.level % 10) / 10;
    this.highlightCell(current.row, current.col, new pc.Color(hue, 0.7, 1 - hue));

    if (current.row === this.goal.row && current.col === this.goal.col) {
        console.log('Goal found at level', current.level, '! Shortest path length:', current.level);
        this.highlightCell(current.row, current.col, new pc.Color(1, 0.8, 0));
        this.score += 100;
    }

    // Add neighbors to queue
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    for (const [dr, dc] of directions) {
        const newRow = current.row + dr;
        const newCol = current.col + dc;
        const key = newRow + ',' + newCol;

        if (this.isValid(newRow, newCol) && !this.visited.has(key)) {
            this.visited.add(key);
            this.queue.push({ row: newRow, col: newCol, level: current.level + 1 });
            this.grid[newRow][newCol].level = current.level + 1;
            this.score += 1;
        }
    }
};

BFS.prototype.isValid = function(row, col) {
    return row >= 0 && row < this.gridSize &&
        col >= 0 && col < this.gridSize &&
        !this.grid[row][col].isWall;
};

BFS.prototype.highlightCell = function(row, col, color) {
    const index = row * this.gridSize + col;
    const cell = this.cells[index];

    if (cell && cell.model && cell.model.meshInstances[0]) {
        cell.model.meshInstances[0].material.diffuse = color;
        cell.model.meshInstances[0].material.update();
    }
};

BFS.prototype.update = function(dt) {
    if (this.searching) {
        this.timer += dt;
        if (this.timer >= this.searchSpeed) {
            this.timer = 0;
            this.bfsStep();
        }
    }
};

BFS.prototype.reset = function() {
    this.searching = false;
    this.queue = [];
    this.visited.clear();
    this.score = 0;
    this.level = 0;
    this.createMaze();
};
