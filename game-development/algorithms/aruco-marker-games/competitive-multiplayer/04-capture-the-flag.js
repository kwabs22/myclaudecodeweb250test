/** Capture the Flag - Classic CTF game in AR */
var CaptureTheFlag = pc.createScript('captureTheFlag');

CaptureTheFlag.attributes.add('teamAMarkerIDs', {
    type: 'number',
    array: true,
    default: [430, 431],
    description: 'Team A player markers'
});

CaptureTheFlag.attributes.add('teamBMarkerIDs', {
    type: 'number',
    array: true,
    default: [432, 433],
    description: 'Team B player markers'
});

CaptureTheFlag.attributes.add('flagMarkerIDs', {
    type: 'number',
    array: true,
    default: [434, 435],
    description: 'Flag markers (Team A, Team B)'
});

CaptureTheFlag.prototype.initialize = function() {
    this.players = {};
    this.flags = {};
    this.scores = { teamA: 0, teamB: 0 };
    this.flagCarriers = { teamA: null, teamB: null };
    this.tagRadius = 0.12;
};

CaptureTheFlag.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.teamAMarkerIDs.includes(markerId) || this.teamBMarkerIDs.includes(markerId)) {
        this.updatePlayer(markerId, pose);
    } else if (this.flagMarkerIDs.includes(markerId)) {
        this.updateFlag(markerId, pose);
    }
};

CaptureTheFlag.prototype.updatePlayer = function(markerId, pose) {
    if (!this.players[markerId]) {
        this.createPlayer(markerId);
    }

    this.players[markerId].entity.setPosition(pose.position);
    this.players[markerId].position = pose.position.clone();

    this.checkFlagPickup(markerId);
    this.checkTagging(markerId);
};

CaptureTheFlag.prototype.createPlayer = function(markerId) {
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
        hasFlag: false,
        respawnTime: 0
    };
};

CaptureTheFlag.prototype.updateFlag = function(markerId, pose) {
    if (!this.flags[markerId]) {
        this.createFlag(markerId);
    }

    // Only update flag position if not being carried
    const team = markerId === this.flagMarkerIDs[0] ? 'teamA' : 'teamB';

    if (!this.flagCarriers[team]) {
        this.flags[markerId].entity.setPosition(pose.position);
        this.flags[markerId].homePosition = pose.position.clone();
    }
};

CaptureTheFlag.prototype.createFlag = function(markerId) {
    const team = markerId === this.flagMarkerIDs[0] ? 'teamA' : 'teamB';

    const flag = new pc.Entity('Flag_' + team);
    this.entity.addChild(flag);

    // Flag pole
    const pole = new pc.Entity('Pole');
    flag.addChild(pole);
    pole.addComponent('model', { type: 'cylinder' });
    pole.setLocalScale(0.01, 0.1, 0.01);
    pole.setLocalPosition(0, 0.05, 0);

    // Flag
    const banner = new pc.Entity('Banner');
    flag.addChild(banner);
    banner.addComponent('model', { type: 'box' });
    banner.setLocalScale(0.06, 0.04, 0.01);
    banner.setLocalPosition(0.03, 0.08, 0);

    const color = team === 'teamA' ? new pc.Color(1, 0.3, 0.3) : new pc.Color(0.3, 0.3, 1);

    if (banner.model && banner.model.meshInstances[0]) {
        banner.model.meshInstances[0].material.diffuse = color;
        banner.model.meshInstances[0].material.emissive = color.clone().mulScalar(0.3);
        banner.model.meshInstances[0].material.update();
    }

    this.flags[markerId] = {
        entity: flag,
        team: team,
        homePosition: new pc.Vec3(),
        captured: false
    };
};

CaptureTheFlag.prototype.checkFlagPickup = function(playerId) {
    const player = this.players[playerId];
    if (!player || player.hasFlag) return;

    // Check enemy flag
    const enemyTeam = player.team === 'teamA' ? 'teamB' : 'teamA';
    const enemyFlagId = player.team === 'teamA' ? this.flagMarkerIDs[1] : this.flagMarkerIDs[0];
    const enemyFlag = this.flags[enemyFlagId];

    if (!enemyFlag || this.flagCarriers[enemyTeam]) return;

    const distance = player.position.distance(enemyFlag.entity.getPosition());

    if (distance < 0.15) {
        this.pickupFlag(playerId, enemyTeam, enemyFlagId);
    }
};

CaptureTheFlag.prototype.pickupFlag = function(playerId, flagTeam, flagId) {
    const player = this.players[playerId];

    player.hasFlag = true;
    this.flagCarriers[flagTeam] = playerId;

    console.log('Player', playerId, 'picked up', flagTeam, 'flag!');

    // Attach flag to player
    const flag = this.flags[flagId];
    flag.entity.reparent(player.entity);
    flag.entity.setLocalPosition(0, 0.12, 0);
};

CaptureTheFlag.prototype.checkTagging = function(playerId) {
    const player = this.players[playerId];
    if (!player || !player.hasFlag) return;

    // Check if tagged by enemy
    Object.entries(this.players).forEach(([enemyId, enemy]) => {
        if (enemy.team === player.team) return;

        const distance = player.position.distance(enemy.position);

        if (distance < this.tagRadius) {
            this.tagPlayer(playerId, enemyId);
        }
    });

    // Check if reached home base with enemy flag
    const ownFlagId = player.team === 'teamA' ? this.flagMarkerIDs[0] : this.flagMarkerIDs[1];
    const ownFlag = this.flags[ownFlagId];

    if (ownFlag) {
        const distanceToBase = player.position.distance(ownFlag.homePosition);

        if (distanceToBase < 0.15) {
            this.captureFlag(playerId);
        }
    }
};

CaptureTheFlag.prototype.tagPlayer = function(carrierId, taggerId) {
    const carrier = this.players[carrierId];
    const flagTeam = carrier.team === 'teamA' ? 'teamB' : 'teamA';
    const flagId = carrier.team === 'teamA' ? this.flagMarkerIDs[1] : this.flagMarkerIDs[0];

    console.log('Player', carrierId, 'was tagged by Player', taggerId + '!');

    // Drop flag
    this.dropFlag(carrierId, flagTeam, flagId);
};

CaptureTheFlag.prototype.dropFlag = function(playerId, flagTeam, flagId) {
    const player = this.players[playerId];
    const flag = this.flags[flagId];

    player.hasFlag = false;
    this.flagCarriers[flagTeam] = null;

    // Return flag to home
    flag.entity.reparent(this.entity);
    flag.entity.setPosition(flag.homePosition);

    console.log(flagTeam, 'flag returned to base');
};

CaptureTheFlag.prototype.captureFlag = function(playerId) {
    const player = this.players[playerId];
    const flagTeam = player.team === 'teamA' ? 'teamB' : 'teamA';
    const flagId = player.team === 'teamA' ? this.flagMarkerIDs[1] : this.flagMarkerIDs[0];

    this.scores[player.team]++;

    console.log('═══════════════════════════════════');
    console.log(player.team.toUpperCase(), 'SCORES!');
    console.log('Player', playerId, 'captured the flag!');
    console.log('Score - Team A:', this.scores.teamA, 'Team B:', this.scores.teamB);
    console.log('═══════════════════════════════════');

    this.dropFlag(playerId, flagTeam, flagId);
};

CaptureTheFlag.prototype.getScoreboard = function() {
    console.log('Scoreboard:');
    console.log('Team A:', this.scores.teamA);
    console.log('Team B:', this.scores.teamB);

    if (this.scores.teamA > this.scores.teamB) {
        console.log('Team A is winning!');
    } else if (this.scores.teamB > this.scores.teamA) {
        console.log('Team B is winning!');
    } else {
        console.log('Tied game!');
    }
};
