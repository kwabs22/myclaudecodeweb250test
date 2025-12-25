/** AR Tower Defense - Place physical markers as tower positions */
var ARTowerDefense = pc.createScript('arTowerDefense');

ARTowerDefense.attributes.add('towerMarkerIDs', {
    type: 'number',
    array: true,
    default: [80, 81, 82, 83, 84],
    description: 'Marker IDs for different tower types'
});

ARTowerDefense.attributes.add('pathMarkerID', {
    type: 'number',
    default: 85,
    description: 'Marker ID for enemy path'
});

ARTowerDefense.prototype.initialize = function() {
    this.towers = {};
    this.enemies = [];
    this.projectiles = [];
    this.wave = 1;
    this.lives = 20;
    this.gold = 100;
    this.enemySpawnTimer = 0;
    this.waveActive = false;

    this.towerTypes = {
        80: { name: 'Arrow', damage: 10, range: 0.5, fireRate: 1.0, cost: 50 },
        81: { name: 'Cannon', damage: 25, range: 0.3, fireRate: 2.0, cost: 100 },
        82: { name: 'Magic', damage: 15, range: 0.6, fireRate: 0.8, cost: 75 },
        83: { name: 'Ice', damage: 5, range: 0.4, fireRate: 1.5, cost: 60, slow: 0.5 },
        84: { name: 'Laser', damage: 8, range: 0.7, fireRate: 0.3, cost: 120 }
    };

    this.path = [];
    this.startWave();
};

ARTowerDefense.prototype.update = function(dt) {
    if (this.waveActive) {
        this.spawnEnemies(dt);
        this.updateEnemies(dt);
        this.updateTowers(dt);
        this.updateProjectiles(dt);
        this.checkWaveComplete();
    }
};

ARTowerDefense.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.towerMarkerIDs.includes(markerId)) {
        this.placeTower(markerId, pose);
    } else if (markerId === this.pathMarkerID) {
        this.updatePath(pose);
    }
};

ARTowerDefense.prototype.placeTower = function(markerId, pose) {
    const towerType = this.towerTypes[markerId];

    if (this.towers[markerId]) {
        // Update existing tower position
        this.towers[markerId].entity.setPosition(pose.position);
    } else {
        // Create new tower
        if (this.gold >= towerType.cost) {
            const tower = this.createTower(markerId, pose, towerType);
            this.towers[markerId] = tower;
            this.gold -= towerType.cost;
            console.log('Placed', towerType.name, 'tower - Gold:', this.gold);
        } else {
            console.log('Not enough gold for', towerType.name, '- Need:', towerType.cost, 'Have:', this.gold);
        }
    }
};

ARTowerDefense.prototype.createTower = function(markerId, pose, type) {
    const tower = new pc.Entity('Tower_' + type.name);
    this.entity.addChild(tower);
    tower.setPosition(pose.position);

    // Tower base
    tower.addComponent('model', { type: 'cylinder' });
    tower.setLocalScale(0.08, 0.1, 0.08);

    // Color based on tower type
    const colors = {
        'Arrow': new pc.Color(0.6, 0.4, 0.2),
        'Cannon': new pc.Color(0.3, 0.3, 0.3),
        'Magic': new pc.Color(0.5, 0, 0.8),
        'Ice': new pc.Color(0.5, 0.8, 1),
        'Laser': new pc.Color(1, 0, 0)
    };

    if (tower.model && tower.model.meshInstances[0]) {
        tower.model.meshInstances[0].material.diffuse = colors[type.name];
        tower.model.meshInstances[0].material.update();
    }

    // Tower data
    return {
        entity: tower,
        type: type,
        markerId: markerId,
        cooldown: 0,
        target: null
    };
};

ARTowerDefense.prototype.updatePath = function(pose) {
    this.path = [pose.position];
    // In real implementation, detect multiple path markers to create waypoints
};

ARTowerDefense.prototype.startWave = function() {
    this.waveActive = true;
    this.enemySpawnTimer = 0;
    this.enemiesToSpawn = this.wave * 5;
    this.enemiesSpawned = 0;
    console.log('Wave', this.wave, 'started! Enemies:', this.enemiesToSpawn);
};

ARTowerDefense.prototype.spawnEnemies = function(dt) {
    if (this.enemiesSpawned >= this.enemiesToSpawn) return;

    this.enemySpawnTimer += dt;
    if (this.enemySpawnTimer >= 1.0) {
        this.enemySpawnTimer = 0;
        this.createEnemy();
        this.enemiesSpawned++;
    }
};

ARTowerDefense.prototype.createEnemy = function() {
    const enemy = new pc.Entity('Enemy_' + this.enemies.length);
    this.entity.addChild(enemy);

    enemy.addComponent('model', { type: 'sphere' });
    enemy.setLocalScale(0.05, 0.05, 0.05);

    if (enemy.model && enemy.model.meshInstances[0]) {
        enemy.model.meshInstances[0].material.diffuse = new pc.Color(1, 0, 0);
        enemy.model.meshInstances[0].material.update();
    }

    const health = 50 + this.wave * 10;
    const speed = 0.2 + this.wave * 0.02;

    enemy.enemyData = {
        health: health,
        maxHealth: health,
        speed: speed,
        baseSpeed: speed,
        pathIndex: 0,
        distanceAlongPath: 0,
        goldValue: 10 + this.wave * 2
    };

    if (this.path.length > 0) {
        enemy.setPosition(this.path[0].clone());
    }

    this.enemies.push(enemy);
};

ARTowerDefense.prototype.updateEnemies = function(dt) {
    this.enemies = this.enemies.filter(enemy => {
        const data = enemy.enemyData;

        // Move along path
        data.distanceAlongPath += data.speed * dt;

        // Simple movement (in real implementation, follow waypoint path)
        const currentPos = enemy.getPosition();
        const moveDir = new pc.Vec3(1, 0, 0);
        const newPos = currentPos.clone().add(moveDir.mulScalar(data.speed * dt));
        enemy.setPosition(newPos);

        // Check if reached end
        if (newPos.x > 2) {
            this.lives--;
            console.log('Enemy reached end! Lives:', this.lives);
            enemy.destroy();
            return false;
        }

        // Reset speed (in case it was slowed)
        data.speed = pc.math.lerp(data.speed, data.baseSpeed, dt * 2);

        return true;
    });

    if (this.lives <= 0) {
        this.gameOver();
    }
};

ARTowerDefense.prototype.updateTowers = function(dt) {
    Object.values(this.towers).forEach(tower => {
        tower.cooldown -= dt;

        if (tower.cooldown <= 0) {
            // Find target
            tower.target = this.findNearestEnemy(tower.entity.getPosition(), tower.type.range);

            if (tower.target) {
                this.fireTower(tower);
                tower.cooldown = tower.type.fireRate;
            }
        }
    });
};

ARTowerDefense.prototype.findNearestEnemy = function(position, range) {
    let nearest = null;
    let nearestDist = range;

    this.enemies.forEach(enemy => {
        const dist = enemy.getPosition().distance(position);
        if (dist < nearestDist) {
            nearest = enemy;
            nearestDist = dist;
        }
    });

    return nearest;
};

ARTowerDefense.prototype.fireTower = function(tower) {
    const projectile = {
        position: tower.entity.getPosition().clone(),
        target: tower.target,
        damage: tower.type.damage,
        speed: 1.5,
        slow: tower.type.slow || 0
    };

    this.projectiles.push(projectile);
};

ARTowerDefense.prototype.updateProjectiles = function(dt) {
    this.projectiles = this.projectiles.filter(proj => {
        if (!proj.target || !proj.target.enemyData) return false;

        const targetPos = proj.target.getPosition();
        const direction = targetPos.clone().sub(proj.position).normalize();
        proj.position.add(direction.mulScalar(proj.speed * dt));

        // Check if hit target
        const dist = proj.position.distance(targetPos);
        if (dist < 0.05) {
            this.damageEnemy(proj.target, proj.damage, proj.slow);
            return false;
        }

        return true;
    });
};

ARTowerDefense.prototype.damageEnemy = function(enemy, damage, slow) {
    enemy.enemyData.health -= damage;

    if (slow > 0) {
        enemy.enemyData.speed *= (1 - slow);
    }

    if (enemy.enemyData.health <= 0) {
        this.killEnemy(enemy);
    }
};

ARTowerDefense.prototype.killEnemy = function(enemy) {
    this.gold += enemy.enemyData.goldValue;
    const index = this.enemies.indexOf(enemy);
    if (index !== -1) {
        this.enemies.splice(index, 1);
    }
    enemy.destroy();
};

ARTowerDefense.prototype.checkWaveComplete = function() {
    if (this.enemiesSpawned >= this.enemiesToSpawn && this.enemies.length === 0) {
        this.waveActive = false;
        this.wave++;
        this.gold += 50;
        console.log('Wave complete! Next wave:', this.wave, 'Gold:', this.gold);
        setTimeout(() => this.startWave(), 5000);
    }
};

ARTowerDefense.prototype.gameOver = function() {
    this.waveActive = false;
    console.log('Game Over! Reached wave:', this.wave);
};
