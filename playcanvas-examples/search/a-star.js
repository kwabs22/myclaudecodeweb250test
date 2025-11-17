/**
 * A* Pathfinding Algorithm
 * Algorithm: Informed search using heuristic (f = g + h)
 * Game: "Smart Navigator" - Find optimal paths using distance estimates
 */

var AStar = pc.createScript('aStar');

AStar.attributes.add('gridSize', { type: 'number', default: 15 });
AStar.attributes.add('searchSpeed', { type: 'number', default: 0.15 });
AStar.attributes.add('wallDensity', { type: 'number', default: 0.3 });

AStar.prototype.initialize = function() {
    this.grid = [];
    this.cells = [];
    this.openSet = [];
    this.closedSet = new Set();
    this.searching = false;
    this.timer = 0;
    this.start = { row: 0, col: 0 };
    this.goal = { row: this.gridSize - 1, col: this.gridSize - 1 };
    this.score = 0;

    this.createMaze();
};

AStar.prototype.createMaze = function() {
    this.cells.forEach(c => c.destroy());
    this.cells = [];
    this.grid = [];

    for (let row = 0; row < this.gridSize; row++) {
        this.grid[row] = [];
        for (let col = 0; col < this.gridSize; col++) {
            const isWall = Math.random() < this.wallDensity &&
                !(row === 0 && col === 0) && !(row === this.gridSize - 1 && col === this.gridSize - 1);

            this.grid[row][col] = {
                row, col, isWall,
                g: Infinity, // Cost from start
                h: 0, // Heuristic to goal
                f: Infinity, // g + h
                parent: null
            };

            this.createCell(row, col, isWall);
        }
    }
};

AStar.prototype.createCell = function(row, col, isWall) {
    const cell = new pc.Entity('Cell_' + row + '_' + col);
    this.entity.addChild(cell);

    const spacing = 0.9;
    const offset = (this.gridSize - 1) * spacing / 2;
    cell.setLocalPosition(col * spacing - offset, 0, row * spacing - offset);

    cell.addComponent('model', { type: 'box' });
    cell.setLocalScale(0.8, 0.2, 0.8);

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

AStar.prototype.startAStar = function() {
    this.searching = true;
    this.openSet = [];
    this.closedSet.clear();

    const startNode = this.grid[this.start.row][this.start.col];
    startNode.g = 0;
    startNode.h = this.heuristic(this.start, this.goal);
    startNode.f = startNode.h;

    this.openSet.push(startNode);
};

AStar.prototype.heuristic = function(a, b) {
    // Manhattan distance
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

AStar.prototype.aStarStep = function() {
    if (this.openSet.length === 0) {
        this.searching = false;
        console.log('No path found!');
        return;
    }

    // Find node with lowest f score
    let current = this.openSet[0];
    let currentIndex = 0;

    for (let i = 1; i < this.openSet.length; i++) {
        if (this.openSet[i].f < current.f) {
            current = this.openSet[i];
            currentIndex = i;
        }
    }

    // Remove from open set
    this.openSet.splice(currentIndex, 1);
    this.closedSet.add(current.row + ',' + current.col);

    // Highlight as explored
    this.highlightCell(current.row, current.col, new pc.Color(0.3, 0.6, 1));

    // Check if goal reached
    if (current.row === this.goal.row && current.col === this.goal.col) {
        this.searching = false;
        this.reconstructPath(current);
        console.log('Path found! Score:', this.score);
        return;
    }

    // Explore neighbors
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    for (const [dr, dc] of directions) {
        const newRow = current.row + dr;
        const newCol = current.col + dc;

        if (!this.isValid(newRow, newCol)) continue;

        const neighbor = this.grid[newRow][newCol];
        const key = newRow + ',' + newCol;

        if (this.closedSet.has(key)) continue;

        const tentativeG = current.g + 1;

        if (tentativeG < neighbor.g) {
            neighbor.parent = current;
            neighbor.g = tentativeG;
            neighbor.h = this.heuristic({ row: newRow, col: newCol }, this.goal);
            neighbor.f = neighbor.g + neighbor.h;

            if (!this.openSet.includes(neighbor)) {
                this.openSet.push(neighbor);
                // Highlight as in open set
                this.highlightCell(newRow, newCol, new pc.Color(0.7, 0.9, 0.7));
                this.score += 1;
            }
        }
    }
};

AStar.prototype.reconstructPath = function(node) {
    const path = [];
    let current = node;

    while (current) {
        path.unshift(current);
        current = current.parent;
    }

    console.log('Path length:', path.length);

    path.forEach((node, i) => {
        setTimeout(() => {
            this.highlightCell(node.row, node.col, new pc.Color(1, 0.8, 0));
        }, i * 100);
    });

    this.score += 100;
};

AStar.prototype.isValid = function(row, col) {
    return row >= 0 && row < this.gridSize &&
        col >= 0 && col < this.gridSize &&
        !this.grid[row][col].isWall;
};

AStar.prototype.highlightCell = function(row, col, color) {
    const index = row * this.gridSize + col;
    const cell = this.cells[index];

    if (cell && cell.model && cell.model.meshInstances[0]) {
        cell.model.meshInstances[0].material.diffuse = color;
        cell.model.meshInstances[0].material.update();
    }
};

AStar.prototype.update = function(dt) {
    if (this.searching) {
        this.timer += dt;
        if (this.timer >= this.searchSpeed) {
            this.timer = 0;
            this.aStarStep();
        }
    }
};

AStar.prototype.reset = function() {
    this.searching = false;
    this.openSet = [];
    this.closedSet.clear();
    this.score = 0;
    this.createMaze();
};
