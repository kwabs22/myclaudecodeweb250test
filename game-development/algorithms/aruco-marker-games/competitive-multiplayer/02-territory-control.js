/** Territory Control - Capture and hold zones to earn points */
var TerritoryControl = pc.createScript('territoryControl');

TerritoryControl.attributes.add('playerMarkerIDs', {
    type: 'number',
    array: true,
    default: [410, 411, 412, 413],
    description: 'Marker IDs for players'
});

TerritoryControl.attributes.add('zoneMarkerIDs', {
    type: 'number',
    array: true,
    default: [414, 415, 416],
    description: 'Marker IDs for capture zones'
});

TerritoryControl.prototype.initialize = function() {
    this.players = {};
    this.zones = {};
    this.scores = {};
    this.gameTime = 0;
    this.pointsPerSecond = 1;

    this.playerMarkerIDs.forEach(id => {
        this.scores[id] = 0;
    });
};

TerritoryControl.prototype.update = function(dt) {
    this.gameTime += dt;

    // Award points for controlled zones
    Object.values(this.zones).forEach(zone => {
        if (zone.controller) {
            this.scores[zone.controller] += this.pointsPerSecond * dt;
        }
    });

    // Check zone control
    this.updateZoneControl();
};

TerritoryControl.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.playerMarkerIDs.includes(markerId)) {
        this.updatePlayer(markerId, pose);
    } else if (this.zoneMarkerIDs.includes(markerId)) {
        this.updateZone(markerId, pose);
    }
};

TerritoryControl.prototype.updatePlayer = function(markerId, pose) {
    if (!this.players[markerId]) {
        this.createPlayer(markerId);
    }

    this.players[markerId].entity.setPosition(pose.position);
    this.players[markerId].position = pose.position.clone();
};

TerritoryControl.prototype.createPlayer = function(markerId) {
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

TerritoryControl.prototype.updateZone = function(markerId, pose) {
    if (!this.zones[markerId]) {
        this.createZone(markerId);
    }

    this.zones[markerId].entity.setPosition(pose.position);
    this.zones[markerId].position = pose.position.clone();
};

TerritoryControl.prototype.createZone = function(markerId) {
    const zone = new pc.Entity('Zone_' + markerId);
    this.entity.addChild(zone);

    zone.addComponent('model', { type: 'cylinder' });
    zone.setLocalScale(0.15, 0.02, 0.15);

    if (zone.model && zone.model.meshInstances[0]) {
        zone.model.meshInstances[0].material.diffuse = new pc.Color(0.7, 0.7, 0.7);
        zone.model.meshInstances[0].material.update();
    }

    this.zones[markerId] = {
        entity: zone,
        position: new pc.Vec3(),
        controller: null,
        captureProgress: {},
        radius: 0.15
    };
};

TerritoryControl.prototype.updateZoneControl = function() {
    Object.values(this.zones).forEach(zone => {
        // Find players in zone
        const playersInZone = [];

        Object.entries(this.players).forEach(([playerId, player]) => {
            const distance = player.position.distance(zone.position);
            if (distance < zone.radius) {
                playersInZone.push(playerId);
            }
        });

        if (playersInZone.length === 1) {
            // One player in zone, they capture it
            const capturingPlayer = playersInZone[0];

            if (zone.controller !== capturingPlayer) {
                zone.controller = capturingPlayer;
                this.updateZoneColor(zone);
                console.log('Player', capturingPlayer, 'captured zone!');
            }
        } else if (playersInZone.length === 0) {
            // No one in zone, becomes neutral if no controller
        }
        // If multiple players, zone is contested (no capture)
    });
};

TerritoryControl.prototype.updateZoneColor = function(zone) {
    if (!zone.entity.model) return;

    const color = zone.controller ? this.players[zone.controller].color : new pc.Color(0.7, 0.7, 0.7);

    if (zone.entity.model.meshInstances[0]) {
        zone.entity.model.meshInstances[0].material.diffuse = color.clone();
        zone.entity.model.meshInstances[0].material.emissive = color.clone().mulScalar(0.3);
        zone.entity.model.meshInstances[0].material.update();
    }
};

TerritoryControl.prototype.getScoreboard = function() {
    const sorted = Object.entries(this.scores).sort((a, b) => b[1] - a[1]);

    console.log('Scoreboard:');
    sorted.forEach(([playerId, score]) => {
        console.log('Player', playerId + ':', Math.floor(score), 'points');
    });

    return sorted;
};
