/** AR Tag - Chase game where players tag each other in AR space */
var ARTag = pc.createScript('arTag');

ARTag.attributes.add('playerMarkerIDs', {
    type: 'number',
    array: true,
    default: [400, 401, 402, 403],
    description: 'Marker IDs for players (supports up to 4 players)'
});

ARTag.prototype.initialize = function() {
    this.players = {};
    this.itPlayer = null;
    this.scores = {};
    this.gameTime = 0;
    this.roundTime = 120; // 2 minutes per round
    this.tagCooldown = {};
    this.tagRadius = 0.15;

    this.playerMarkerIDs.forEach(id => {
        this.scores[id] = 0;
        this.tagCooldown[id] = 0;
    });

    this.selectRandomIt();
};

ARTag.prototype.selectRandomIt = function() {
    const randomId = this.playerMarkerIDs[Math.floor(Math.random() * this.playerMarkerIDs.length)];
    this.itPlayer = randomId;
    console.log('Player', randomId, 'is IT!');
};

ARTag.prototype.update = function(dt) {
    this.gameTime += dt;

    // Update cooldowns
    Object.keys(this.tagCooldown).forEach(id => {
        if (this.tagCooldown[id] > 0) {
            this.tagCooldown[id] -= dt;
        }
    });

    // Check for tags
    this.checkForTags();

    // Check round end
    if (this.gameTime >= this.roundTime) {
        this.endRound();
    }
};

ARTag.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.playerMarkerIDs.includes(markerId)) {
        this.updatePlayer(markerId, pose);
    }
};

ARTag.prototype.updatePlayer = function(markerId, pose) {
    if (!this.players[markerId]) {
        this.createPlayer(markerId);
    }

    this.players[markerId].entity.setPosition(pose.position);
    this.players[markerId].position = pose.position.clone();
};

ARTag.prototype.createPlayer = function(markerId) {
    const player = new pc.Entity('Player_' + markerId);
    this.entity.addChild(player);

    player.addComponent('model', { type: 'capsule' });
    player.setLocalScale(0.05, 0.08, 0.05);

    this.players[markerId] = {
        entity: player,
        position: new pc.Vec3(),
        markerId: markerId
    };

    this.updatePlayerColor(markerId);
};

ARTag.prototype.updatePlayerColor = function(markerId) {
    const player = this.players[markerId];
    if (!player || !player.entity.model) return;

    // IT player is red, others are blue
    const color = markerId === this.itPlayer ? new pc.Color(1, 0.2, 0.2) : new pc.Color(0.2, 0.5, 1);

    if (player.entity.model.meshInstances[0]) {
        player.entity.model.meshInstances[0].material.diffuse = color;
        player.entity.model.meshInstances[0].material.update();
    }
};

ARTag.prototype.checkForTags = function() {
    if (!this.itPlayer || !this.players[this.itPlayer]) return;

    const itPlayer = this.players[this.itPlayer];

    Object.keys(this.players).forEach(playerId => {
        if (playerId == this.itPlayer) return;
        if (this.tagCooldown[playerId] > 0) return;

        const player = this.players[playerId];
        const distance = itPlayer.position.distance(player.position);

        if (distance < this.tagRadius) {
            this.tagPlayer(playerId);
        }
    });
};

ARTag.prototype.tagPlayer = function(playerId) {
    console.log('Player', playerId, 'has been tagged!');

    // Award points
    this.scores[this.itPlayer] += 10;

    // Change IT player
    const oldIt = this.itPlayer;
    this.itPlayer = playerId;

    // Update colors
    this.updatePlayerColor(oldIt);
    this.updatePlayerColor(playerId);

    // Set cooldown
    this.tagCooldown[playerId] = 3; // 3 second immunity

    console.log('Player', playerId, 'is now IT!');
    console.log('Score - Player', oldIt + ':', this.scores[oldIt]);
};

ARTag.prototype.endRound = function() {
    console.log('═══════════════════════════════════');
    console.log('Round Complete!');
    console.log('Final Scores:');

    const sortedScores = Object.entries(this.scores).sort((a, b) => b[1] - a[1]);

    sortedScores.forEach(([playerId, score], index) => {
        const place = index + 1;
        console.log(place + '. Player', playerId + ':', score, 'points');
    });

    console.log('═══════════════════════════════════');

    this.resetRound();
};

ARTag.prototype.resetRound = function() {
    this.gameTime = 0;
    Object.keys(this.scores).forEach(id => this.scores[id] = 0);
    this.selectRandomIt();
};

ARTag.prototype.getLeaderboard = function() {
    return Object.entries(this.scores).sort((a, b) => b[1] - a[1]);
};
