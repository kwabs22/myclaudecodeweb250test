/**
 * N-Queens Problem
 * Algorithm: Place N queens on N×N board with no conflicts using backtracking
 * Game: "Queen's Guard" - Position queens so none can attack each other
 */

var NQueens = pc.createScript('nQueens');

// Attributes
NQueens.attributes.add('boardSize', {
    type: 'number',
    default: 8,
    min: 4,
    max: 12,
    description: 'Size of chess board (NxN)'
});

NQueens.attributes.add('autoSolve', {
    type: 'boolean',
    default: false,
    description: 'Automatically solve the puzzle'
});

NQueens.attributes.add('showAllSolutions', {
    type: 'boolean',
    default: false,
    description: 'Find all solutions instead of just one'
});

NQueens.attributes.add('cellSize', {
    type: 'number',
    default: 1,
    description: 'Size of each board cell'
});

// Initialize
NQueens.prototype.initialize = function() {
    this.board = [];
    this.queens = [];
    this.solutions = [];
    this.solving = false;
    this.currentRow = 0;
    this.playerQueens = [];

    // Create board
    this.createBoard();

    // Setup input
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onCellClick, this);

    if (this.autoSolve) {
        this.solveNQueens();
    }
};

// Create chess board
NQueens.prototype.createBoard = function() {
    // Clear old board
    const oldBoard = this.entity.findByName('ChessBoard');
    if (oldBoard) oldBoard.destroy();

    const boardEntity = new pc.Entity('ChessBoard');
    this.entity.addChild(boardEntity);

    // Initialize board state
    this.board = [];
    for (let i = 0; i < this.boardSize; i++) {
        this.board[i] = new Array(this.boardSize).fill(0);
    }

    // Create cells
    const offset = (this.boardSize - 1) * this.cellSize / 2;

    for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
            const cell = new pc.Entity('Cell_' + row + '_' + col);
            boardEntity.addChild(cell);

            const x = col * this.cellSize - offset;
            const z = row * this.cellSize - offset;
            cell.setLocalPosition(x, 0, z);

            cell.addComponent('model', { type: 'box' });
            cell.setLocalScale(this.cellSize * 0.9, 0.1, this.cellSize * 0.9);

            // Checkerboard pattern
            const isLight = (row + col) % 2 === 0;
            const color = isLight ? new pc.Color(0.9, 0.9, 0.9) : new pc.Color(0.4, 0.4, 0.4);

            if (cell.model && cell.model.meshInstances[0]) {
                cell.model.meshInstances[0].material.diffuse = color;
                cell.model.meshInstances[0].material.update();
            }

            cell.row = row;
            cell.col = col;
        }
    }
};

// Solve N-Queens using backtracking
NQueens.prototype.solveNQueens = function() {
    this.solutions = [];
    this.solving = true;

    const startTime = Date.now();

    if (this.showAllSolutions) {
        this.solveAll(0, []);
    } else {
        this.solveOne(0, []);
    }

    const elapsed = Date.now() - startTime;

    console.log('Found', this.solutions.length, 'solution(s) in', elapsed, 'ms');

    if (this.solutions.length > 0) {
        this.displaySolution(this.solutions[0]);
    }

    this.solving = false;
};

// Solve for one solution
NQueens.prototype.solveOne = function(row, queens) {
    if (row === this.boardSize) {
        this.solutions.push([...queens]);
        return true;
    }

    for (let col = 0; col < this.boardSize; col++) {
        if (this.isSafe(row, col, queens)) {
            queens.push(col);

            if (this.solveOne(row + 1, queens)) {
                return true;
            }

            queens.pop(); // Backtrack
        }
    }

    return false;
};

// Solve for all solutions
NQueens.prototype.solveAll = function(row, queens) {
    if (row === this.boardSize) {
        this.solutions.push([...queens]);
        return;
    }

    for (let col = 0; col < this.boardSize; col++) {
        if (this.isSafe(row, col, queens)) {
            queens.push(col);
            this.solveAll(row + 1, queens);
            queens.pop(); // Backtrack
        }
    }
};

// Check if placing queen at (row, col) is safe
NQueens.prototype.isSafe = function(row, col, queens) {
    // Check previous queens
    for (let prevRow = 0; prevRow < queens.length; prevRow++) {
        const prevCol = queens[prevRow];

        // Same column
        if (prevCol === col) return false;

        // Same diagonal
        if (Math.abs(prevRow - row) === Math.abs(prevCol - col)) {
            return false;
        }
    }

    return true;
};

// Display a solution
NQueens.prototype.displaySolution = function(solution) {
    // Clear existing queens
    this.queens.forEach(queen => queen.destroy());
    this.queens = [];

    const offset = (this.boardSize - 1) * this.cellSize / 2;

    solution.forEach((col, row) => {
        const queen = this.createQueen(row, col);
        this.queens.push(queen);
    });

    console.log('Solution displayed:', solution);
};

// Create queen entity
NQueens.prototype.createQueen = function(row, col, isPlayer = false) {
    const offset = (this.boardSize - 1) * this.cellSize / 2;

    const queen = new pc.Entity('Queen_' + row + '_' + col);
    this.entity.addChild(queen);

    const x = col * this.cellSize - offset;
    const z = row * this.cellSize - offset;
    queen.setLocalPosition(x, 0.5, z);

    queen.addComponent('model', { type: 'cone' });
    queen.setLocalScale(0.4, 0.8, 0.4);

    // Color based on whether it's player-placed or solution
    const color = isPlayer ? new pc.Color(0, 0, 1) : new pc.Color(1, 0.8, 0);

    if (queen.model && queen.model.meshInstances[0]) {
        queen.model.meshInstances[0].material.diffuse = color;
        queen.model.meshInstances[0].material.update();
    }

    queen.row = row;
    queen.col = col;

    return queen;
};

// Handle cell click
NQueens.prototype.onCellClick = function(event) {
    if (this.solving || this.autoSolve) return;

    const camera = this.app.root.findByName('Camera');
    if (!camera) return;

    const from = camera.getPosition();
    const to = camera.camera.screenToWorld(event.x, event.y, camera.getPosition().z + 10);

    const result = this.app.systems.rigidbody.raycastFirst(from, to);

    if (result && result.entity.row !== undefined) {
        this.playerPlaceQueen(result.entity.row, result.entity.col);
    }
};

// Player places a queen
NQueens.prototype.playerPlaceQueen = function(row, col) {
    // Check if already queen in this row
    const existingInRow = this.playerQueens.find(q => q.row === row);
    if (existingInRow) {
        console.log('Already have a queen in this row!');
        return;
    }

    // Check if position is safe
    const currentQueenPositions = this.playerQueens.map(q => q.col);

    if (!this.isSafe(row, col, currentQueenPositions)) {
        console.log('This position is under attack!');
        this.visualizeAttack(row, col);
        return;
    }

    // Place queen
    const queen = this.createQueen(row, col, true);
    this.playerQueens.push(queen);

    console.log('Queen placed at', row, col);

    // Check if puzzle is solved
    if (this.playerQueens.length === this.boardSize) {
        console.log('Congratulations! You solved the', this.boardSize, '-Queens problem!');
        this.checkPlayerSolution();
    }
};

// Visualize attack lines
NQueens.prototype.visualizeAttack = function(row, col) {
    // Highlight cells that are under attack
    const offset = (this.boardSize - 1) * this.cellSize / 2;

    this.playerQueens.forEach(queen => {
        const qRow = queen.row;
        const qCol = queen.col;

        // Check if this queen attacks the position
        if (qCol === col || Math.abs(qRow - row) === Math.abs(qCol - col)) {
            // Create visual line showing attack
            const attackLine = new pc.Entity('AttackLine');
            this.entity.addChild(attackLine);

            const fromPos = new pc.Vec3(
                qCol * this.cellSize - offset,
                0.5,
                qRow * this.cellSize - offset
            );

            const toPos = new pc.Vec3(
                col * this.cellSize - offset,
                0.5,
                row * this.cellSize - offset
            );

            const midpoint = new pc.Vec3().add2(fromPos, toPos).scale(0.5);
            attackLine.setPosition(midpoint);

            attackLine.addComponent('model', { type: 'cylinder' });

            const distance = fromPos.distance(toPos);
            attackLine.setLocalScale(0.05, distance / 2, 0.05);

            attackLine.lookAt(toPos);
            attackLine.rotateLocal(90, 0, 0);

            if (attackLine.model && attackLine.model.meshInstances[0]) {
                attackLine.model.meshInstances[0].material.diffuse = new pc.Color(1, 0, 0);
                attackLine.model.meshInstances[0].material.emissive = new pc.Color(1, 0, 0);
                attackLine.model.meshInstances[0].material.update();
            }

            // Remove after 1 second
            setTimeout(() => attackLine.destroy(), 1000);
        }
    });
};

// Check player's solution
NQueens.prototype.checkPlayerSolution = function() {
    const playerSolution = this.playerQueens.map(q => q.col);

    // Verify it's a valid solution
    for (let row = 0; row < playerSolution.length; row++) {
        if (!this.isSafe(row, playerSolution[row], playerSolution.slice(0, row))) {
            console.log('Error: Invalid solution!');
            return false;
        }
    }

    console.log('Valid solution! Your configuration:', playerSolution);
    return true;
};

// Reset the game
NQueens.prototype.reset = function() {
    this.playerQueens.forEach(queen => queen.destroy());
    this.playerQueens = [];

    this.queens.forEach(queen => queen.destroy());
    this.queens = [];

    this.solutions = [];
};

// Get hint for next queen placement
NQueens.prototype.getHint = function() {
    if (this.solutions.length === 0) {
        this.solveNQueens();
    }

    if (this.solutions.length > 0) {
        const solution = this.solutions[0];
        const nextRow = this.playerQueens.length;

        if (nextRow < solution.length) {
            const hintCol = solution[nextRow];
            console.log('Hint: Try placing a queen at row', nextRow, 'column', hintCol);
            return { row: nextRow, col: hintCol };
        }
    }

    return null;
};

// Update loop
NQueens.prototype.update = function(dt) {
    // Update UI
};
