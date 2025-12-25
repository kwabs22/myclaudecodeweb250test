/** Battle Arena - Multiplayer combat with abilities and power-ups */
var BattleArena = pc.createScript('battleArena');

BattleArena.attributes.add('playerMarkerIDs', {
    type: 'number',
    array: true,
    default: [440, 441, 442, 443],
    description: 'Player markers'
});

BattleArena.attributes.add('weaponMarkerIDs', {
    type: 'number',
    array: true,
    default: [444, 445, 446],
    description: 'Weapon markers (sword, bow, staff)'
});

BattleArena.prototype.initialize = function() {
    this.players = {};
    this.weapons = {};
    this.projectiles = [];
    this.kills = {};
    this.deaths = {};

    this.playerMarkerIDs.forEach(id => {
        this.kills[id] = 0;
        this.deaths[id] = 0;
    });

    this.weaponTypes = {
        444: { name: 'Sword', damage: 30, range: 0.1, attackSpeed: 1.0 },
        445: { name: 'Bow', damage: 20, range: 0.5, attackSpeed: 1.5 },
        446: { name: 'Staff', damage: 25, range: 0.3, attackSpeed: 1.2 }
    };
};

BattleArena.prototype.update = function(dt) {
    this.updateProjectiles(dt);
    this.checkCombat();
};

BattleArena.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.playerMarkerIDs.includes(markerId)) {
        this.updatePlayer(markerId, pose);
    } else if (this.weaponMarkerIDs.includes(markerId)) {
        this.updateWeapon(markerId, pose);
    }
};

BattleArena.prototype.updatePlayer = function(markerId, pose) {
    if (!this.players[markerId]) {
        this.createPlayer(markerId);
    }

    this.players[markerId].entity.setPosition(pose.position);
    this.players[markerId].position = pose.position.clone();

    // Reduce attack cooldown
    if (this.players[markerId].attackCooldown > 0) {
        this.players[markerId].attackCooldown -= 0.016; // Assuming 60fps
    }
};

BattleArena.prototype.createPlayer = function(markerId) {
    const player = new pc.Entity('Player_' + markerId);
    this.entity.addChild(player);

    // Player body
    player.addComponent('model', { type: 'capsule' });
    player.setLocalScale(0.05, 0.08, 0.05);

    // Health bar
    const healthBar = new pc.Entity('HealthBar');
    player.addChild(healthBar);
    healthBar.addComponent('model', { type: 'box' });
    healthBar.setLocalScale(0.08, 0.01, 0.01);
    healthBar.setLocalPosition(0, 0.12, 0);

    if (healthBar.model && healthBar.model.meshInstances[0]) {
        healthBar.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 1, 0.3);
        healthBar.model.meshInstances[0].material.update();
    }

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
        healthBar: healthBar,
        position: new pc.Vec3(),
        health: 100,
        maxHealth: 100,
        weapon: null,
        attackCooldown: 0
    };
};

BattleArena.prototype.updateWeapon = function(markerId, pose) {
    if (!this.weapons[markerId]) {
        this.createWeapon(markerId);
    }

    this.weapons[markerId].entity.setPosition(pose.position);
    this.checkWeaponPickup(markerId, pose.position);
};

BattleArena.prototype.createWeapon = function(markerId) {
    const weaponType = this.weaponTypes[markerId];

    const weapon = new pc.Entity('Weapon_' + weaponType.name);
    this.entity.addChild(weapon);

    weapon.addComponent('model', { type: 'box' });
    weapon.setLocalScale(0.04, 0.08, 0.01);

    const colors = {
        'Sword': new pc.Color(0.7, 0.7, 0.7),
        'Bow': new pc.Color(0.6, 0.4, 0.2),
        'Staff': new pc.Color(0.5, 0.3, 0.7)
    };

    if (weapon.model && weapon.model.meshInstances[0]) {
        weapon.model.meshInstances[0].material.diffuse = colors[weaponType.name];
        weapon.model.meshInstances[0].material.update();
    }

    this.weapons[markerId] = {
        entity: weapon,
        type: weaponType,
        available: true
    };
};

BattleArena.prototype.checkWeaponPickup = function(weaponId, weaponPos) {
    const weapon = this.weapons[weaponId];
    if (!weapon.available) return;

    Object.entries(this.players).forEach(([playerId, player]) => {
        const distance = player.position.distance(weaponPos);

        if (distance < 0.1 && !player.weapon) {
            this.equipWeapon(playerId, weaponId);
        }
    });
};

BattleArena.prototype.equipWeapon = function(playerId, weaponId) {
    const player = this.players[playerId];
    const weapon = this.weapons[weaponId];

    player.weapon = weapon.type;
    weapon.available = false;
    weapon.entity.enabled = false;

    console.log('Player', playerId, 'equipped', weapon.type.name);
};

BattleArena.prototype.checkCombat = function() {
    Object.entries(this.players).forEach(([attackerId, attacker]) => {
        if (!attacker.weapon || attacker.attackCooldown > 0) return;

        Object.entries(this.players).forEach(([targetId, target]) => {
            if (attackerId === targetId) return;

            const distance = attacker.position.distance(target.position);

            if (distance < attacker.weapon.range) {
                this.attack(attackerId, targetId);
            }
        });
    });
};

BattleArena.prototype.attack = function(attackerId, targetId) {
    const attacker = this.players[attackerId];
    const target = this.players[targetId];

    attacker.attackCooldown = attacker.weapon.attackSpeed;

    // Create projectile for ranged weapons
    if (attacker.weapon.name === 'Bow') {
        this.createProjectile(attackerId, targetId);
    } else {
        // Melee attack
        this.dealDamage(attackerId, targetId, attacker.weapon.damage);
    }
};

BattleArena.prototype.createProjectile = function(attackerId, targetId) {
    const attacker = this.players[attackerId];
    const target = this.players[targetId];

    const projectile = {
        position: attacker.position.clone(),
        target: target.position.clone(),
        attackerId: attackerId,
        targetId: targetId,
        damage: attacker.weapon.damage,
        speed: 0.5
    };

    this.projectiles.push(projectile);
};

BattleArena.prototype.updateProjectiles = function(dt) {
    this.projectiles = this.projectiles.filter(proj => {
        const direction = proj.target.clone().sub(proj.position).normalize();
        proj.position.add(direction.mulScalar(proj.speed * dt));

        const distance = proj.position.distance(proj.target);

        if (distance < 0.05) {
            this.dealDamage(proj.attackerId, proj.targetId, proj.damage);
            return false;
        }

        return true;
    });
};

BattleArena.prototype.dealDamage = function(attackerId, targetId, damage) {
    const target = this.players[targetId];

    target.health -= damage;
    this.updateHealthBar(targetId);

    console.log('Player', attackerId, 'dealt', damage, 'damage to Player', targetId);

    if (target.health <= 0) {
        this.eliminatePlayer(attackerId, targetId);
    }
};

BattleArena.prototype.updateHealthBar = function(playerId) {
    const player = this.players[playerId];
    const healthPercent = player.health / player.maxHealth;

    player.healthBar.setLocalScale(0.08 * healthPercent, 0.01, 0.01);

    // Color based on health
    const color = healthPercent > 0.5 ? new pc.Color(0.3, 1, 0.3) :
                  healthPercent > 0.25 ? new pc.Color(1, 1, 0.3) :
                  new pc.Color(1, 0.3, 0.3);

    if (player.healthBar.model && player.healthBar.model.meshInstances[0]) {
        player.healthBar.model.meshInstances[0].material.diffuse = color;
        player.healthBar.model.meshInstances[0].material.update();
    }
};

BattleArena.prototype.eliminatePlayer = function(killerId, victimId) {
    this.kills[killerId]++;
    this.deaths[victimId]++;

    console.log('═══════════════════════════════════');
    console.log('Player', killerId, 'eliminated Player', victimId + '!');
    console.log('Player', killerId, 'K/D:', this.kills[killerId] + '/' + this.deaths[killerId]);
    console.log('═══════════════════════════════════');

    // Respawn victim
    setTimeout(() => this.respawnPlayer(victimId), 3000);
};

BattleArena.prototype.respawnPlayer = function(playerId) {
    const player = this.players[playerId];

    player.health = player.maxHealth;
    player.weapon = null;
    this.updateHealthBar(playerId);

    console.log('Player', playerId, 'respawned');
};

BattleArena.prototype.getLeaderboard = function() {
    const sorted = Object.entries(this.kills).sort((a, b) => b[1] - a[1]);

    console.log('Leaderboard:');
    sorted.forEach(([playerId, kills], index) => {
        const deaths = this.deaths[playerId];
        const kd = deaths > 0 ? (kills / deaths).toFixed(2) : kills;
        console.log((index + 1) + '. Player', playerId, '-', kills, 'kills,', deaths, 'deaths (K/D:', kd + ')');
    });

    return sorted;
};
