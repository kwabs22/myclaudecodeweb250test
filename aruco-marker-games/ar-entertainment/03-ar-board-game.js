/**
 * AR Board Game
 * Transform traditional board games with AR elements
 * Game board on one marker, pieces on others, digital effects overlay
 */

var ARBoardGame = pc.createScript('arBoardGame');

ARBoardGame.attributes.add('boardMarkerID', {
    type: 'number',
    default: 0,
    description: 'Marker ID for game board'
});

ARBoardGame.attributes.add('playerMarkerIDs', {
    type: 'number',
    array: true,
    default: [1, 2, 3, 4],
    description: 'Marker IDs for player pieces'
});

ARBoardGame.attributes.add('boardSize', {
    type: 'number',
    default: 8,
    description: 'Board grid size (e.g., 8x8 for chess)'
});

ARBoardGame.prototype.initialize = function() {
    this.board = null;
    this.pieces = {};
    this.gameState = {
        currentPlayer: 0,
        turnNumber: 1,
        scores: [0, 0, 0, 0]
    };

    this.boardGrid = this.initializeBoard();
    this.setupGame();
};

ARBoardGame.prototype.initializeBoard = function() {
    const grid = [];
    for (let row = 0; row < this.boardSize; row++) {
        grid[row] = [];
        for (let col = 0; col < this.boardSize; col++) {
            grid[row][col] = {
                row, col,
                occupied: false,
                occupant: null,
                highlighted: false
            };
        }
    }
    return grid;
};

ARBoardGame.prototype.setupGame = function() {
    // Game-specific setup
    console.log('Board game initialized');
};

ARBoardGame.prototype.update = function(dt) {
    this.updateBoardVisuals();
    this.checkForMoves();
};

ARBoardGame.prototype.onMarkerDetected = function(markerId, pose) {
    if (markerId === this.boardMarkerID) {
        this.updateBoardPosition(pose);
    } else if (this.playerMarkerIDs.includes(markerId)) {
        this.updatePiecePosition(markerId, pose);
    }
};

ARBoardGame.prototype.updateBoardPosition = function(pose) {
    if (!this.board) {
        this.spawnBoard();
    }

    // Update board position based on marker pose
    this.board.setPosition(pose.position);
    this.board.setRotation(pose.rotation);
};

ARBoardGame.prototype.spawnBoard = function() {
    this.board = new pc.Entity('GameBoard');
    this.entity.addChild(this.board);

    // Create visual board
    this.createBoardVisuals();
};

ARBoardGame.prototype.createBoardVisuals = function() {
    const cellSize = 0.1;

    for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
            const cell = new pc.Entity('Cell_' + row + '_' + col);
            this.board.addChild(cell);

            const x = (col - this.boardSize / 2) * cellSize;
            const z = (row - this.boardSize / 2) * cellSize;

            cell.setLocalPosition(x, 0, z);
            cell.addComponent('model', { type: 'box' });
            cell.setLocalScale(cellSize * 0.9, 0.01, cellSize * 0.9);

            const isLight = (row + col) % 2 === 0;
            const color = isLight ? new pc.Color(0.9, 0.9, 0.9) : new pc.Color(0.3, 0.3, 0.3);

            if (cell.model && cell.model.meshInstances[0]) {
                cell.model.meshInstances[0].material.diffuse = color;
                cell.model.meshInstances[0].material.update();
            }

            cell.gridPos = { row, col };
        }
    }
};

ARBoardGame.prototype.updatePiecePosition = function(markerId, pose) {
    const playerIndex = this.playerMarkerIDs.indexOf(markerId);

    if (!this.pieces[playerIndex]) {
        this.spawnPiece(playerIndex);
    }

    const piece = this.pieces[playerIndex];
    piece.setPosition(pose.position);

    // Snap to grid if over board
    if (this.board) {
        const gridPos = this.worldToGrid(pose.position);
        if (gridPos) {
            this.highlightCell(gridPos.row, gridPos.col);
        }
    }
};

ARBoardGame.prototype.spawnPiece = function(playerIndex) {
    const piece = new pc.Entity('Player_' + playerIndex);
    this.entity.addChild(piece);

    piece.addComponent('model', { type: 'cylinder' });
    piece.setLocalScale(0.05, 0.1, 0.05);

    const colors = [
        new pc.Color(1, 0, 0),
        new pc.Color(0, 0, 1),
        new pc.Color(0, 1, 0),
        new pc.Color(1, 1, 0)
    ];

    if (piece.model && piece.model.meshInstances[0]) {
        piece.model.meshInstances[0].material.diffuse = colors[playerIndex];
        piece.model.meshInstances[0].material.update();
    }

    this.pieces[playerIndex] = piece;
};

ARBoardGame.prototype.worldToGrid = function(worldPos) {
    if (!this.board) return null;

    const boardPos = this.board.getPosition();
    const relativePos = worldPos.clone().sub(boardPos);

    const cellSize = 0.1;
    const col = Math.floor((relativePos.x + this.boardSize * cellSize / 2) / cellSize);
    const row = Math.floor((relativePos.z + this.boardSize * cellSize / 2) / cellSize);

    if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
        return { row, col };
    }

    return null;
};

ARBoardGame.prototype.highlightCell = function(row, col) {
    // Clear previous highlights
    this.boardGrid.forEach(rowCells => {
        rowCells.forEach(cell => cell.highlighted = false);
    });

    // Highlight new cell
    this.boardGrid[row][col].highlighted = true;
};

ARBoardGame.prototype.updateBoardVisuals = function() {
    // Update visual highlights, effects, etc.
};

ARBoardGame.prototype.checkForMoves = function() {
    // Check if pieces are in valid positions for moves
};

ARBoardGame.prototype.nextTurn = function() {
    this.gameState.currentPlayer = (this.gameState.currentPlayer + 1) % this.playerMarkerIDs.length;
    this.gameState.turnNumber++;

    console.log('Turn', this.gameState.turnNumber, '- Player', this.gameState.currentPlayer);
};
