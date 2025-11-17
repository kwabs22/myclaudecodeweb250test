/** Augmented Chess - Physical chess board with AR piece animations */
var AugmentedChess = pc.createScript('augmentedChess');

AugmentedChess.attributes.add('boardMarkerID', {
    type: 'number',
    default: 90,
    description: 'Marker ID for chess board'
});

AugmentedChess.attributes.add('pieceMarkerIDs', {
    type: 'number',
    array: true,
    default: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102],
    description: 'Marker IDs for chess pieces'
});

AugmentedChess.prototype.initialize = function() {
    this.board = null;
    this.pieces = {};
    this.selectedPiece = null;
    this.gameState = {
        currentPlayer: 'white',
        moveHistory: [],
        capturedPieces: { white: [], black: [] }
    };

    this.boardGrid = this.initializeBoard();
    this.pieceTypes = this.initializePieceTypes();
};

AugmentedChess.prototype.initializeBoard = function() {
    const grid = [];
    for (let row = 0; row < 8; row++) {
        grid[row] = [];
        for (let col = 0; col < 8; col++) {
            grid[row][col] = {
                row, col,
                piece: null,
                highlighted: false,
                validMove: false
            };
        }
    }
    return grid;
};

AugmentedChess.prototype.initializePieceTypes = function() {
    return {
        91: { type: 'pawn', color: 'white' },
        92: { type: 'pawn', color: 'black' },
        93: { type: 'rook', color: 'white' },
        94: { type: 'rook', color: 'black' },
        95: { type: 'knight', color: 'white' },
        96: { type: 'knight', color: 'black' },
        97: { type: 'bishop', color: 'white' },
        98: { type: 'bishop', color: 'black' },
        99: { type: 'queen', color: 'white' },
        100: { type: 'queen', color: 'black' },
        101: { type: 'king', color: 'white' },
        102: { type: 'king', color: 'black' }
    };
};

AugmentedChess.prototype.onMarkerDetected = function(markerId, pose) {
    if (markerId === this.boardMarkerID) {
        this.updateBoard(pose);
    } else if (this.pieceMarkerIDs.includes(markerId)) {
        this.updatePiece(markerId, pose);
    }
};

AugmentedChess.prototype.updateBoard = function(pose) {
    if (!this.board) {
        this.createBoard();
    }
    this.board.setPosition(pose.position);
    this.board.setRotation(pose.rotation);
};

AugmentedChess.prototype.createBoard = function() {
    this.board = new pc.Entity('ChessBoard');
    this.entity.addChild(this.board);

    const cellSize = 0.1;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = new pc.Entity('Cell_' + row + '_' + col);
            this.board.addChild(cell);

            const x = (col - 4) * cellSize;
            const z = (row - 4) * cellSize;

            cell.setLocalPosition(x, 0, z);
            cell.addComponent('model', { type: 'box' });
            cell.setLocalScale(cellSize * 0.95, 0.01, cellSize * 0.95);

            const isLight = (row + col) % 2 === 0;
            const color = isLight ? new pc.Color(0.9, 0.9, 0.8) : new pc.Color(0.4, 0.3, 0.2);

            if (cell.model && cell.model.meshInstances[0]) {
                cell.model.meshInstances[0].material.diffuse = color;
                cell.model.meshInstances[0].material.update();
            }

            cell.gridPos = { row, col };
        }
    }
};

AugmentedChess.prototype.updatePiece = function(markerId, pose) {
    const pieceData = this.pieceTypes[markerId];
    if (!pieceData) return;

    if (!this.pieces[markerId]) {
        this.createPiece(markerId, pieceData);
    }

    const piece = this.pieces[markerId];
    piece.setPosition(pose.position);

    if (this.board) {
        const gridPos = this.worldToGrid(pose.position);
        if (gridPos) {
            this.updatePieceGridPosition(markerId, gridPos);
            this.showValidMoves(markerId, gridPos);
        }
    }
};

AugmentedChess.prototype.createPiece = function(markerId, pieceData) {
    const piece = new pc.Entity('Piece_' + pieceData.type);
    this.entity.addChild(piece);

    // Create piece model based on type
    const modelType = this.getPieceModelType(pieceData.type);
    piece.addComponent('model', { type: modelType });

    const scale = 0.05;
    piece.setLocalScale(scale, scale * 1.5, scale);

    // Color based on piece color
    const color = pieceData.color === 'white' ? new pc.Color(1, 1, 1) : new pc.Color(0.1, 0.1, 0.1);

    if (piece.model && piece.model.meshInstances[0]) {
        piece.model.meshInstances[0].material.diffuse = color;
        piece.model.meshInstances[0].material.update();
    }

    piece.pieceData = {
        markerId: markerId,
        type: pieceData.type,
        color: pieceData.color,
        gridPos: null,
        hasMoved: false
    };

    this.pieces[markerId] = piece;
};

AugmentedChess.prototype.getPieceModelType = function(type) {
    const models = {
        'pawn': 'cone',
        'rook': 'box',
        'knight': 'capsule',
        'bishop': 'cylinder',
        'queen': 'sphere',
        'king': 'cylinder'
    };
    return models[type] || 'box';
};

AugmentedChess.prototype.worldToGrid = function(worldPos) {
    if (!this.board) return null;

    const boardPos = this.board.getPosition();
    const relativePos = worldPos.clone().sub(boardPos);

    const cellSize = 0.1;
    const col = Math.floor((relativePos.x + 4 * cellSize) / cellSize);
    const row = Math.floor((relativePos.z + 4 * cellSize) / cellSize);

    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        return { row, col };
    }

    return null;
};

AugmentedChess.prototype.updatePieceGridPosition = function(markerId, gridPos) {
    const piece = this.pieces[markerId];
    if (!piece) return;

    // Clear old position
    if (piece.pieceData.gridPos) {
        const oldCell = this.boardGrid[piece.pieceData.gridPos.row][piece.pieceData.gridPos.col];
        if (oldCell.piece === markerId) {
            oldCell.piece = null;
        }
    }

    // Update new position
    piece.pieceData.gridPos = gridPos;
    this.boardGrid[gridPos.row][gridPos.col].piece = markerId;
};

AugmentedChess.prototype.showValidMoves = function(markerId, currentPos) {
    const piece = this.pieces[markerId];
    if (!piece || piece.pieceData.color !== this.gameState.currentPlayer) return;

    // Clear previous highlights
    this.clearHighlights();

    // Calculate valid moves based on piece type
    const validMoves = this.getValidMoves(piece.pieceData, currentPos);

    validMoves.forEach(move => {
        this.boardGrid[move.row][move.col].highlighted = true;
        this.boardGrid[move.row][move.col].validMove = true;
    });
};

AugmentedChess.prototype.getValidMoves = function(pieceData, pos) {
    const moves = [];

    switch(pieceData.type) {
        case 'pawn':
            this.getPawnMoves(pieceData, pos, moves);
            break;
        case 'rook':
            this.getRookMoves(pos, moves);
            break;
        case 'knight':
            this.getKnightMoves(pos, moves);
            break;
        case 'bishop':
            this.getBishopMoves(pos, moves);
            break;
        case 'queen':
            this.getRookMoves(pos, moves);
            this.getBishopMoves(pos, moves);
            break;
        case 'king':
            this.getKingMoves(pos, moves);
            break;
    }

    return moves.filter(move => this.isValidPosition(move));
};

AugmentedChess.prototype.getPawnMoves = function(pieceData, pos, moves) {
    const direction = pieceData.color === 'white' ? -1 : 1;
    const startRow = pieceData.color === 'white' ? 6 : 1;

    // Move forward
    moves.push({ row: pos.row + direction, col: pos.col });

    // Initial double move
    if (pos.row === startRow) {
        moves.push({ row: pos.row + direction * 2, col: pos.col });
    }

    // Capture diagonally
    moves.push({ row: pos.row + direction, col: pos.col - 1 });
    moves.push({ row: pos.row + direction, col: pos.col + 1 });
};

AugmentedChess.prototype.getRookMoves = function(pos, moves) {
    // Horizontal and vertical moves
    for (let i = 0; i < 8; i++) {
        if (i !== pos.row) moves.push({ row: i, col: pos.col });
        if (i !== pos.col) moves.push({ row: pos.row, col: i });
    }
};

AugmentedChess.prototype.getKnightMoves = function(pos, moves) {
    const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    knightOffsets.forEach(([dr, dc]) => {
        moves.push({ row: pos.row + dr, col: pos.col + dc });
    });
};

AugmentedChess.prototype.getBishopMoves = function(pos, moves) {
    // Diagonal moves
    for (let i = 1; i < 8; i++) {
        moves.push({ row: pos.row + i, col: pos.col + i });
        moves.push({ row: pos.row + i, col: pos.col - i });
        moves.push({ row: pos.row - i, col: pos.col + i });
        moves.push({ row: pos.row - i, col: pos.col - i });
    }
};

AugmentedChess.prototype.getKingMoves = function(pos, moves) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
                moves.push({ row: pos.row + dr, col: pos.col + dc });
            }
        }
    }
};

AugmentedChess.prototype.isValidPosition = function(pos) {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

AugmentedChess.prototype.clearHighlights = function() {
    this.boardGrid.forEach(row => {
        row.forEach(cell => {
            cell.highlighted = false;
            cell.validMove = false;
        });
    });
};

AugmentedChess.prototype.switchPlayer = function() {
    this.gameState.currentPlayer = this.gameState.currentPlayer === 'white' ? 'black' : 'white';
    console.log('Current player:', this.gameState.currentPlayer);
};
