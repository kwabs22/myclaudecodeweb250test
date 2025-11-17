/**
 * Sudoku Solver
 * Algorithm: Fill 9×9 grid following Sudoku rules using backtracking
 * Game: "Number Detective" - Solve Sudoku puzzles with smart backtracking
 */

var SudokuSolver = pc.createScript('sudokuSolver');

SudokuSolver.prototype.initialize = function() {
    this.board = [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]
    ];

    this.cells = [];
    this.score = 0;

    this.createVisualization();
};

SudokuSolver.prototype.solveSudoku = function() {
    return this.solve();
};

SudokuSolver.prototype.solve = function() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (this.board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (this.isValid(row, col, num)) {
                        this.board[row][col] = num;

                        if (this.solve()) {
                            return true;
                        }

                        this.board[row][col] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
};

SudokuSolver.prototype.isValid = function(row, col, num) {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (this.board[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
        if (this.board[r][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (this.board[r][c] === num) return false;
        }
    }

    return true;
};

SudokuSolver.prototype.createVisualization = function() {
    // Create 9x9 grid visualization
    const cellSize = 0.8;
    const offset = 4.5 * cellSize;

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = new pc.Entity('Cell_' + row + '_' + col);
            this.entity.addChild(cell);

            cell.setLocalPosition(col * cellSize - offset, 0, row * cellSize - offset);
            cell.addComponent('model', { type: 'box' });
            cell.setLocalScale(0.7, 0.1, 0.7);

            if (cell.model && cell.model.meshInstances[0]) {
                const isGiven = this.board[row][col] !== 0;
                const color = isGiven ? new pc.Color(0.3, 0.3, 0.3) : new pc.Color(0.9, 0.9, 0.9);
                cell.model.meshInstances[0].material.diffuse = color;
                cell.model.meshInstances[0].material.update();
            }

            this.cells.push(cell);
        }
    }
};

SudokuSolver.prototype.reset = function() {
    this.score = 0;
};
