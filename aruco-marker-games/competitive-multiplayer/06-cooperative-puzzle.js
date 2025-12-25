/** Cooperative Puzzle - Team-based puzzle solving with markers */
var CooperativePuzzle = pc.createScript('cooperativePuzzle');

CooperativePuzzle.attributes.add('playerMarkerIDs', {
    type: 'number',
    array: true,
    default: [450, 451, 452, 453],
    description: 'Player markers'
});

CooperativePuzzle.attributes.add('puzzlePieceMarkerIDs', {
    type: 'number',
    array: true,
    default: [454, 455, 456, 457, 458, 459],
    description: 'Puzzle piece markers'
});

CooperativePuzzle.prototype.initialize = function() {
    this.players = {};
    this.puzzlePieces = {};
    this.activePieces = {};
    this.puzzleSolved = false;
    this.startTime = Date.now();

    this.puzzlePattern = [
        [454, 455],
        [456, 457],
        [458, 459]
    ];

    this.requiredDistance = 0.1; // Distance pieces need to be to form connections
};

CooperativePuzzle.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.playerMarkerIDs.includes(markerId)) {
        this.updatePlayer(markerId, pose);
    } else if (this.puzzlePieceMarkerIDs.includes(markerId)) {
        this.updatePuzzlePiece(markerId, pose);
    }
};

CooperativePuzzle.prototype.updatePlayer = function(markerId, pose) {
    if (!this.players[markerId]) {
        this.createPlayer(markerId);
    }

    this.players[markerId].entity.setPosition(pose.position);
    this.players[markerId].position = pose.position.clone();
};

CooperativePuzzle.prototype.createPlayer = function(markerId) {
    const player = new pc.Entity('Player_' + markerId);
    this.entity.addChild(player);

    player.addComponent('model', { type: 'capsule' });
    player.setLocalScale(0.05, 0.08, 0.05);

    const colors = [
        new pc.Color(1, 0.3, 0.3),
        new pc.Color(0.3, 0.3, 1),
        new pc.Color(0.3, 1, 0.3),
        new pc.Color(1, 1, 0.3)
    ];

    const colorIndex = this.playerMarkerIDs.indexOf(markerId);

    if (player.model && player.model.meshInstances[0]) {
        player.model.meshInstances[0].material.diffuse = colors[colorIndex];
        player.model.meshInstances[0].material.update();
    }

    this.players[markerId] = {
        entity: player,
        position: new pc.Vec3(),
        color: colors[colorIndex]
    };
};

CooperativePuzzle.prototype.updatePuzzlePiece = function(markerId, pose) {
    if (!this.puzzlePieces[markerId]) {
        this.createPuzzlePiece(markerId);
    }

    this.puzzlePieces[markerId].entity.setPosition(pose.position);
    this.puzzlePieces[markerId].position = pose.position.clone();
    this.activePieces[markerId] = true;

    this.checkPuzzleConnections();
};

CooperativePuzzle.prototype.createPuzzlePiece = function(markerId) {
    const piece = new pc.Entity('PuzzlePiece_' + markerId);
    this.entity.addChild(piece);

    piece.addComponent('model', { type: 'box' });
    piece.setLocalScale(0.08, 0.08, 0.02);

    // Color based on piece index
    const pieceIndex = this.puzzlePieceMarkerIDs.indexOf(markerId);
    const hue = (pieceIndex / this.puzzlePieceMarkerIDs.length) * 360;
    const color = this.hueToColor(hue);

    if (piece.model && piece.model.meshInstances[0]) {
        piece.model.meshInstances[0].material.diffuse = color;
        piece.model.meshInstances[0].material.update();
    }

    this.puzzlePieces[markerId] = {
        entity: piece,
        position: new pc.Vec3(),
        connected: false,
        connections: []
    };
};

CooperativePuzzle.prototype.checkPuzzleConnections = function() {
    // Reset all connections
    Object.values(this.puzzlePieces).forEach(piece => {
        piece.connections = [];
        piece.connected = false;
    });

    // Check each row of the puzzle pattern
    this.puzzlePattern.forEach((row, rowIndex) => {
        let rowComplete = true;

        for (let i = 0; i < row.length - 1; i++) {
            const pieceId1 = row[i];
            const pieceId2 = row[i + 1];

            if (!this.activePieces[pieceId1] || !this.activePieces[pieceId2]) {
                rowComplete = false;
                continue;
            }

            const piece1 = this.puzzlePieces[pieceId1];
            const piece2 = this.puzzlePieces[pieceId2];

            const distance = piece1.position.distance(piece2.position);

            if (distance < this.requiredDistance) {
                piece1.connections.push(pieceId2);
                piece2.connections.push(pieceId1);
                piece1.connected = true;
                piece2.connected = true;
            } else {
                rowComplete = false;
            }
        }

        if (rowComplete) {
            console.log('Row', rowIndex + 1, 'completed!');
        }
    });

    // Check if entire puzzle is solved
    const allConnected = Object.values(this.puzzlePieces).every(piece => piece.connected);

    if (allConnected && !this.puzzleSolved) {
        this.solvePuzzle();
    }

    // Update visual connections
    this.updatePuzzleVisuals();
};

CooperativePuzzle.prototype.updatePuzzleVisuals = function() {
    Object.entries(this.puzzlePieces).forEach(([pieceId, piece]) => {
        if (!piece.entity.model) return;

        // Glow if connected
        const emissiveColor = piece.connected ? new pc.Color(0.3, 0.3, 0.3) : new pc.Color(0, 0, 0);

        if (piece.entity.model.meshInstances[0]) {
            piece.entity.model.meshInstances[0].material.emissive = emissiveColor;
            piece.entity.model.meshInstances[0].material.update();
        }
    });
};

CooperativePuzzle.prototype.solvePuzzle = function() {
    this.puzzleSolved = true;
    const solveTime = (Date.now() - this.startTime) / 1000;

    console.log('═══════════════════════════════════');
    console.log('🎉 PUZZLE SOLVED!');
    console.log('Time:', solveTime.toFixed(2), 'seconds');
    console.log('Players:', Object.keys(this.players).length);
    console.log('═══════════════════════════════════');

    this.celebrationEffect();
};

CooperativePuzzle.prototype.celebrationEffect = function() {
    // Flash all pieces
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        Object.values(this.puzzlePieces).forEach(piece => {
            if (!piece.entity.model) return;

            const bright = flashCount % 2 === 0;
            const color = bright ? new pc.Color(1, 1, 1) : piece.entity.model.meshInstances[0].material.diffuse;

            if (piece.entity.model.meshInstances[0]) {
                piece.entity.model.meshInstances[0].material.emissive = bright ? new pc.Color(0.5, 0.5, 0.5) : new pc.Color(0, 0, 0);
                piece.entity.model.meshInstances[0].material.update();
            }
        });

        flashCount++;

        if (flashCount >= 6) {
            clearInterval(flashInterval);
        }
    }, 200);
};

CooperativePuzzle.prototype.hueToColor = function(hue) {
    const h = hue / 360;
    const s = 0.8;
    const l = 0.6;

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = this.hue2rgb(p, q, h + 1/3);
    const g = this.hue2rgb(p, q, h);
    const b = this.hue2rgb(p, q, h - 1/3);

    return new pc.Color(r, g, b);
};

CooperativePuzzle.prototype.hue2rgb = function(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
};

CooperativePuzzle.prototype.resetPuzzle = function() {
    this.puzzleSolved = false;
    this.startTime = Date.now();
    this.activePieces = {};

    Object.values(this.puzzlePieces).forEach(piece => {
        piece.connected = false;
        piece.connections = [];
    });

    console.log('Puzzle reset');
};

CooperativePuzzle.prototype.giveHint = function() {
    // Find first disconnected piece
    for (const row of this.puzzlePattern) {
        for (let i = 0; i < row.length - 1; i++) {
            const piece1 = this.puzzlePieces[row[i]];
            const piece2 = this.puzzlePieces[row[i + 1]];

            if (piece1 && piece2 && !piece1.connections.includes(row[i + 1])) {
                console.log('Hint: Connect piece', row[i], 'with piece', row[i + 1]);
                return;
            }
        }
    }
};
