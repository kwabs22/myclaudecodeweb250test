/** Virtual Aquarium - Place markers to spawn different fish species */
var VirtualAquarium = pc.createScript('virtualAquarium');

VirtualAquarium.attributes.add('fishMarkerIDs', {
    type: 'number',
    array: true,
    default: [70, 71, 72, 73, 74, 75],
    description: 'Marker IDs for different fish species'
});

VirtualAquarium.attributes.add('tankSize', {
    type: 'vec3',
    default: [2, 1, 1],
    description: 'Aquarium dimensions (width, height, depth)'
});

VirtualAquarium.prototype.initialize = function() {
    this.fish = [];
    this.markers = {};
    this.waterLevel = 0;
    this.foodParticles = [];

    this.fishTypes = {
        70: { name: 'Goldfish', color: new pc.Color(1, 0.8, 0), size: 0.05, speed: 0.1 },
        71: { name: 'Clownfish', color: new pc.Color(1, 0.5, 0), size: 0.04, speed: 0.15 },
        72: { name: 'Blue Tang', color: new pc.Color(0, 0.5, 1), size: 0.06, speed: 0.12 },
        73: { name: 'Angelfish', color: new pc.Color(0.8, 0.8, 0.2), size: 0.07, speed: 0.08 },
        74: { name: 'Tetra', color: new pc.Color(1, 0, 0.5), size: 0.03, speed: 0.2 },
        75: { name: 'Guppy', color: new pc.Color(0.5, 1, 0.5), size: 0.035, speed: 0.18 }
    };

    this.createTank();
};

VirtualAquarium.prototype.createTank = function() {
    const tank = new pc.Entity('AquariumTank');
    this.entity.addChild(tank);

    // Create transparent walls
    this.createTankWall(tank, 0, 0, 0, this.tankSize.x, this.tankSize.y, 0.01); // Front
    this.createTankWall(tank, 0, 0, -this.tankSize.z, this.tankSize.x, this.tankSize.y, 0.01); // Back
    this.createTankWall(tank, -this.tankSize.x/2, 0, -this.tankSize.z/2, 0.01, this.tankSize.y, this.tankSize.z); // Left
    this.createTankWall(tank, this.tankSize.x/2, 0, -this.tankSize.z/2, 0.01, this.tankSize.y, this.tankSize.z); // Right
    this.createTankWall(tank, 0, -this.tankSize.y/2, -this.tankSize.z/2, this.tankSize.x, 0.01, this.tankSize.z); // Bottom

    this.tank = tank;
};

VirtualAquarium.prototype.createTankWall = function(parent, x, y, z, width, height, depth) {
    const wall = new pc.Entity('Wall');
    parent.addChild(wall);
    wall.addComponent('model', { type: 'box' });
    wall.setLocalPosition(x, y, z);
    wall.setLocalScale(width, height, depth);

    if (wall.model && wall.model.meshInstances[0]) {
        const material = wall.model.meshInstances[0].material;
        material.diffuse = new pc.Color(0.6, 0.8, 1);
        material.opacity = 0.3;
        material.blendType = pc.BLEND_NORMAL;
        material.update();
    }
};

VirtualAquarium.prototype.update = function(dt) {
    this.updateFish(dt);
    this.updateWaterEffects(dt);
};

VirtualAquarium.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.fishMarkerIDs.includes(markerId)) {
        if (!this.markers[markerId]) {
            this.spawnFish(markerId, pose);
        }
    }
};

VirtualAquarium.prototype.spawnFish = function(markerId, pose) {
    const fishType = this.fishTypes[markerId];
    if (!fishType) return;

    const fish = new pc.Entity('Fish_' + fishType.name);
    this.tank.addChild(fish);

    // Create fish body
    fish.addComponent('model', { type: 'capsule' });
    fish.setLocalScale(fishType.size * 2, fishType.size, fishType.size);

    if (fish.model && fish.model.meshInstances[0]) {
        fish.model.meshInstances[0].material.diffuse = fishType.color;
        fish.model.meshInstances[0].material.update();
    }

    // Initialize fish properties
    fish.fishData = {
        markerId: markerId,
        type: fishType,
        velocity: new pc.Vec3(
            (Math.random() - 0.5) * fishType.speed,
            (Math.random() - 0.5) * fishType.speed * 0.5,
            (Math.random() - 0.5) * fishType.speed
        ),
        targetPos: this.getRandomTankPosition(),
        hunger: 0,
        energy: 100
    };

    // Random starting position in tank
    const startPos = this.getRandomTankPosition();
    fish.setLocalPosition(startPos);

    this.fish.push(fish);
    this.markers[markerId] = true;

    console.log('Spawned', fishType.name, '- Total fish:', this.fish.length);
};

VirtualAquarium.prototype.getRandomTankPosition = function() {
    return new pc.Vec3(
        (Math.random() - 0.5) * this.tankSize.x * 0.8,
        (Math.random() - 0.5) * this.tankSize.y * 0.8,
        (Math.random() - 0.5) * this.tankSize.z * 0.8
    );
};

VirtualAquarium.prototype.updateFish = function(dt) {
    this.fish.forEach(fish => {
        const data = fish.fishData;

        // Move towards target
        const currentPos = fish.getLocalPosition();
        const direction = data.targetPos.clone().sub(currentPos);
        const distance = direction.length();

        if (distance < 0.1) {
            // Reached target, pick new one
            data.targetPos = this.getRandomTankPosition();
        } else {
            // Move towards target
            direction.normalize();
            data.velocity.lerp(data.velocity, direction.mulScalar(data.type.speed), dt * 2);

            const newPos = currentPos.clone().add(data.velocity.clone().mulScalar(dt));

            // Keep fish inside tank bounds
            newPos.x = Math.max(-this.tankSize.x/2 * 0.9, Math.min(this.tankSize.x/2 * 0.9, newPos.x));
            newPos.y = Math.max(-this.tankSize.y/2 * 0.9, Math.min(this.tankSize.y/2 * 0.9, newPos.y));
            newPos.z = Math.max(-this.tankSize.z/2 * 0.9, Math.min(this.tankSize.z/2 * 0.9, newPos.z));

            fish.setLocalPosition(newPos);

            // Rotate fish to face movement direction
            if (data.velocity.length() > 0.01) {
                fish.lookAt(newPos.clone().add(data.velocity));
            }
        }

        // Update fish stats
        data.hunger += dt * 5;
        data.energy -= dt * 2;

        if (data.hunger > 100) data.hunger = 100;
        if (data.energy < 0) data.energy = 0;
    });
};

VirtualAquarium.prototype.feedFish = function() {
    // Drop food particles
    const food = {
        position: new pc.Vec3(0, this.tankSize.y/2, 0),
        velocity: new pc.Vec3(0, -0.1, 0)
    };

    this.foodParticles.push(food);
    console.log('Food added to aquarium');

    // Fish react to food
    this.fish.forEach(fish => {
        if (fish.fishData.hunger > 50) {
            fish.fishData.targetPos = food.position.clone();
        }
    });
};

VirtualAquarium.prototype.updateWaterEffects = function(dt) {
    // Animate water with subtle wave effect
    this.waterLevel = Math.sin(Date.now() * 0.001) * 0.01;

    // Update food particles
    this.foodParticles = this.foodParticles.filter(food => {
        food.position.add(food.velocity.clone().mulScalar(dt));

        // Check if fish eat the food
        for (const fish of this.fish) {
            const dist = fish.getLocalPosition().distance(food.position);
            if (dist < 0.1) {
                fish.fishData.hunger = Math.max(0, fish.fishData.hunger - 30);
                fish.fishData.energy = Math.min(100, fish.fishData.energy + 20);
                return false; // Remove food
            }
        }

        // Remove food if it hits bottom
        return food.position.y > -this.tankSize.y/2;
    });
};

VirtualAquarium.prototype.removeFish = function(markerId) {
    const index = this.fish.findIndex(f => f.fishData.markerId === markerId);
    if (index !== -1) {
        this.fish[index].destroy();
        this.fish.splice(index, 1);
        delete this.markers[markerId];
        console.log('Fish removed - Total fish:', this.fish.length);
    }
};

VirtualAquarium.prototype.getAquariumStats = function() {
    return {
        totalFish: this.fish.length,
        avgHunger: this.fish.reduce((sum, f) => sum + f.fishData.hunger, 0) / this.fish.length || 0,
        avgEnergy: this.fish.reduce((sum, f) => sum + f.fishData.energy, 0) / this.fish.length || 0
    };
};
