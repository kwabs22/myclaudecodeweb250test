/** Tug of War - Physical strength competition in AR */
var TugOfWar = pc.createScript('tugOfWar');

TugOfWar.attributes.add('teamAMarkerIDs', {
    type: 'number',
    array: true,
    default: [460, 461],
    description: 'Team A player markers'
});

TugOfWar.attributes.add('teamBMarkerIDs', {
    type: 'number',
    array: true,
    default: [462, 463],
    description: 'Team B player markers'
});

TugOfWar.attributes.add('ropeMarkerID', {
    type: 'number',
    default: 464,
    description: 'Rope center marker'
});

TugOfWar.prototype.initialize = function() {
    this.players = {};
    this.rope = null;
    this.ropePosition = 0; // -1 to 1, negative = Team A winning, positive = Team B winning
    this.gameActive = false;
    this.pullStrengths = { teamA: 0, teamB: 0 };
    this.winThreshold = 0.8;
    this.rounds = { teamA: 0, teamB: 0 };
};

TugOfWar.prototype.update = function(dt) {
    if (!this.gameActive) return;

    // Calculate pull strength for each team
    this.calculatePullStrengths();

    // Update rope position
    const netForce = this.pullStrengths.teamB - this.pullStrengths.teamA;
    this.ropePosition += netForce * dt * 0.5;
    this.ropePosition = Math.max(-1, Math.min(1, this.ropePosition));

    // Update rope visual
    this.updateRopePosition();

    // Check for win
    this.checkWinCondition();
};

TugOfWar.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.teamAMarkerIDs.includes(markerId) || this.teamBMarkerIDs.includes(markerId)) {
        this.updatePlayer(markerId, pose);
    } else if (markerId === this.ropeMarkerID) {
        this.updateRope(pose);
    }
};

TugOfWar.prototype.updatePlayer = function(markerId, pose) {
    if (!this.players[markerId]) {
        this.createPlayer(markerId);
    }

    const oldPosition = this.players[markerId].position.clone();
    this.players[markerId].entity.setPosition(pose.position);
    this.players[markerId].position = pose.position.clone();

    // Calculate pull based on movement
    if (this.gameActive) {
        const movement = pose.position.clone().sub(oldPosition);
        this.players[markerId].pullAmount = movement.length() * 10;
    }
};

TugOfWar.prototype.createPlayer = function(markerId) {
    const isTeamA = this.teamAMarkerIDs.includes(markerId);
    const team = isTeamA ? 'teamA' : 'teamB';

    const player = new pc.Entity('Player_' + markerId);
    this.entity.addChild(player);

    player.addComponent('model', { type: 'capsule' });
    player.setLocalScale(0.05, 0.08, 0.05);

    const color = isTeamA ? new pc.Color(1, 0.3, 0.3) : new pc.Color(0.3, 0.3, 1);

    if (player.model && player.model.meshInstances[0]) {
        player.model.meshInstances[0].material.diffuse = color;
        player.model.meshInstances[0].material.update();
    }

    this.players[markerId] = {
        entity: player,
        position: new pc.Vec3(),
        team: team,
        pullAmount: 0
    };
};

TugOfWar.prototype.updateRope = function(pose) {
    if (!this.rope) {
        this.createRope();
    }

    this.rope.centerPosition = pose.position.clone();
    this.updateRopePosition();
};

TugOfWar.prototype.createRope = function() {
    const ropeEntity = new pc.Entity('Rope');
    this.entity.addChild(ropeEntity);

    // Rope segments
    const segments = [];

    for (let i = 0; i < 5; i++) {
        const segment = new pc.Entity('Segment_' + i);
        ropeEntity.addChild(segment);

        segment.addComponent('model', { type: 'cylinder' });
        segment.setLocalScale(0.015, 0.04, 0.015);
        segment.setLocalEulerAngles(0, 0, 90);

        const color = i === 2 ? new pc.Color(1, 1, 0) : new pc.Color(0.6, 0.4, 0.2);

        if (segment.model && segment.model.meshInstances[0]) {
            segment.model.meshInstances[0].material.diffuse = color;
            segment.model.meshInstances[0].material.update();
        }

        segments.push(segment);
    }

    this.rope = {
        entity: ropeEntity,
        segments: segments,
        centerPosition: new pc.Vec3()
    };
};

TugOfWar.prototype.updateRopePosition = function() {
    if (!this.rope) return;

    const segmentSpacing = 0.08;

    this.rope.segments.forEach((segment, index) => {
        const offset = (index - 2) * segmentSpacing;
        const x = offset + (this.ropePosition * 0.3);

        segment.setLocalPosition(x, 0, 0);
    });

    this.rope.entity.setPosition(this.rope.centerPosition);
};

TugOfWar.prototype.calculatePullStrengths = function() {
    this.pullStrengths.teamA = 0;
    this.pullStrengths.teamB = 0;

    Object.values(this.players).forEach(player => {
        if (player.team === 'teamA') {
            this.pullStrengths.teamA += player.pullAmount;
        } else {
            this.pullStrengths.teamB += player.pullAmount;
        }

        // Decay pull amount
        player.pullAmount *= 0.9;
    });
};

TugOfWar.prototype.checkWinCondition = function() {
    if (this.ropePosition <= -this.winThreshold) {
        this.endRound('teamA');
    } else if (this.ropePosition >= this.winThreshold) {
        this.endRound('teamB');
    }
};

TugOfWar.prototype.endRound = function(winner) {
    this.gameActive = false;
    this.rounds[winner]++;

    console.log('═══════════════════════════════════');
    console.log(winner.toUpperCase(), 'WINS THE ROUND!');
    console.log('Score - Team A:', this.rounds.teamA, 'Team B:', this.rounds.teamB);
    console.log('═══════════════════════════════════');

    // Check for match winner
    if (this.rounds[winner] >= 3) {
        console.log('═══════════════════════════════════');
        console.log('🏆', winner.toUpperCase(), 'WINS THE MATCH! 🏆');
        console.log('═══════════════════════════════════');
    }
};

TugOfWar.prototype.startRound = function() {
    this.gameActive = true;
    this.ropePosition = 0;
    this.pullStrengths = { teamA: 0, teamB: 0 };

    console.log('Tug of War - START!');
};

TugOfWar.prototype.resetMatch = function() {
    this.gameActive = false;
    this.ropePosition = 0;
    this.rounds = { teamA: 0, teamB: 0 };
    this.pullStrengths = { teamA: 0, teamB: 0 };

    console.log('Match reset');
};

TugOfWar.prototype.getMatchStatus = function() {
    const ropePercent = ((this.ropePosition + 1) / 2 * 100).toFixed(0);

    console.log('Match Status:');
    console.log('Rope Position:', ropePercent + '% (0% = Team A, 100% = Team B)');
    console.log('Team A Strength:', this.pullStrengths.teamA.toFixed(2));
    console.log('Team B Strength:', this.pullStrengths.teamB.toFixed(2));
    console.log('Rounds - Team A:', this.rounds.teamA, 'Team B:', this.rounds.teamB);
};
