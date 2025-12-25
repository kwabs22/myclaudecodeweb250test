/** Virtual Garden - Grow and maintain AR plants on physical markers */
var VirtualGarden = pc.createScript('virtualGarden');

VirtualGarden.attributes.add('plantMarkerIDs', {
    type: 'number',
    array: true,
    default: [120, 121, 122, 123, 124, 125, 126, 127],
    description: 'Marker IDs for planting spots'
});

VirtualGarden.attributes.add('toolMarkerIDs', {
    type: 'number',
    array: true,
    default: [128, 129],
    description: 'Marker IDs for tools (watering can, fertilizer)'
});

VirtualGarden.prototype.initialize = function() {
    this.plants = {};
    this.tools = {};
    this.weather = 'sunny';
    this.timeOfDay = 0;
    this.seasonProgress = 0;

    this.plantTypes = {
        'flower': { growthTime: 30, waterNeeds: 0.5, maxHeight: 0.15, color: new pc.Color(1, 0.5, 0.8) },
        'tree': { growthTime: 60, waterNeeds: 0.3, maxHeight: 0.3, color: new pc.Color(0.3, 0.6, 0.2) },
        'vegetable': { growthTime: 45, waterNeeds: 0.7, maxHeight: 0.1, color: new pc.Color(0.8, 0.4, 0.2) },
        'herb': { growthTime: 20, waterNeeds: 0.6, maxHeight: 0.08, color: new pc.Color(0.4, 0.8, 0.3) },
        'cactus': { growthTime: 90, waterNeeds: 0.1, maxHeight: 0.12, color: new pc.Color(0.3, 0.7, 0.3) },
        'vine': { growthTime: 40, waterNeeds: 0.5, maxHeight: 0.2, color: new pc.Color(0.2, 0.5, 0.2) },
        'mushroom': { growthTime: 15, waterNeeds: 0.8, maxHeight: 0.06, color: new pc.Color(0.6, 0.3, 0.2) },
        'bamboo': { growthTime: 50, waterNeeds: 0.4, maxHeight: 0.25, color: new pc.Color(0.5, 0.8, 0.3) }
    };

    this.toolTypes = {
        128: 'wateringCan',
        129: 'fertilizer'
    };
};

VirtualGarden.prototype.update = function(dt) {
    this.updatePlants(dt);
    this.updateEnvironment(dt);
    this.updateTimeOfDay(dt);
};

VirtualGarden.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.plantMarkerIDs.includes(markerId)) {
        this.updatePlant(markerId, pose);
    } else if (this.toolMarkerIDs.includes(markerId)) {
        this.updateTool(markerId, pose);
    }
};

VirtualGarden.prototype.updatePlant = function(markerId, pose) {
    if (!this.plants[markerId]) {
        this.plantSeed(markerId, pose);
    } else {
        this.plants[markerId].entity.setPosition(pose.position);
    }
};

VirtualGarden.prototype.plantSeed = function(markerId, pose) {
    // Randomly select plant type
    const plantTypeNames = Object.keys(this.plantTypes);
    const randomType = plantTypeNames[Math.floor(Math.random() * plantTypeNames.length)];
    const plantType = this.plantTypes[randomType];

    const plant = new pc.Entity('Plant_' + markerId);
    this.entity.addChild(plant);
    plant.setPosition(pose.position);

    // Create stem
    const stem = new pc.Entity('Stem');
    plant.addChild(stem);
    stem.addComponent('model', { type: 'cylinder' });
    stem.setLocalScale(0.01, 0.01, 0.01); // Start small

    // Create flower/leaves
    const top = new pc.Entity('Top');
    plant.addChild(top);
    top.addComponent('model', { type: randomType === 'tree' ? 'sphere' : 'cone' });
    top.setLocalPosition(0, 0.02, 0);
    top.setLocalScale(0.02, 0.02, 0.02);

    // Apply colors
    if (stem.model && stem.model.meshInstances[0]) {
        stem.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.5, 0.2);
        stem.model.meshInstances[0].material.update();
    }

    if (top.model && top.model.meshInstances[0]) {
        top.model.meshInstances[0].material.diffuse = plantType.color;
        top.model.meshInstances[0].material.update();
    }

    this.plants[markerId] = {
        entity: plant,
        stem: stem,
        top: top,
        type: randomType,
        typeData: plantType,
        age: 0,
        growth: 0,
        water: 50,
        health: 100,
        lastWatered: Date.now(),
        fertilized: false,
        bloomStage: 0
    };

    console.log('Planted', randomType, 'at marker', markerId);
};

VirtualGarden.prototype.updatePlants = function(dt) {
    Object.values(this.plants).forEach(plant => {
        // Age the plant
        plant.age += dt;

        // Calculate growth based on conditions
        const waterFactor = plant.water / 100;
        const healthFactor = plant.health / 100;
        const fertilizerBonus = plant.fertilized ? 1.5 : 1.0;

        const growthRate = (1 / plant.typeData.growthTime) * waterFactor * healthFactor * fertilizerBonus;
        plant.growth = Math.min(1, plant.growth + growthRate * dt);

        // Update visual size
        const currentHeight = plant.growth * plant.typeData.maxHeight;
        plant.stem.setLocalScale(0.01, currentHeight, 0.01);
        plant.top.setLocalPosition(0, currentHeight * 2, 0);

        const topSize = 0.02 + (plant.growth * 0.03);
        plant.top.setLocalScale(topSize, topSize, topSize);

        // Decrease water over time
        plant.water = Math.max(0, plant.water - plant.typeData.waterNeeds * dt);

        // Update health based on care
        if (plant.water < 20) {
            plant.health = Math.max(0, plant.health - 10 * dt); // Dying from lack of water
        } else if (plant.water > 80) {
            plant.health = Math.max(0, plant.health - 5 * dt); // Over-watered
        } else {
            plant.health = Math.min(100, plant.health + 2 * dt); // Recovering
        }

        // Check bloom stage
        if (plant.growth > 0.8 && plant.health > 70) {
            plant.bloomStage = Math.min(1, plant.bloomStage + dt * 0.5);
            this.updateBloomVisual(plant);
        }

        // Weather effects
        if (this.weather === 'rain') {
            plant.water = Math.min(100, plant.water + 5 * dt);
        }

        // Update plant color based on health
        this.updatePlantColor(plant);
    });
};

VirtualGarden.prototype.updateBloomVisual = function(plant) {
    if (plant.bloomStage > 0.5 && !plant.bloom) {
        // Add bloom/fruit
        const bloom = new pc.Entity('Bloom');
        plant.top.addChild(bloom);
        bloom.addComponent('model', { type: 'sphere' });
        bloom.setLocalScale(0.5, 0.5, 0.5);
        bloom.setLocalPosition(0, 1.2, 0);

        if (bloom.model && bloom.model.meshInstances[0]) {
            bloom.model.meshInstances[0].material.diffuse = new pc.Color(1, 0.9, 0.2);
            bloom.model.meshInstances[0].material.update();
        }

        plant.bloom = bloom;
    }

    if (plant.bloom) {
        const bloomSize = plant.bloomStage * 0.5;
        plant.bloom.setLocalScale(bloomSize, bloomSize, bloomSize);
    }
};

VirtualGarden.prototype.updatePlantColor = function(plant) {
    if (!plant.stem.model || !plant.stem.model.meshInstances[0]) return;

    const healthColor = new pc.Color(
        plant.health < 50 ? 0.5 : 0.3,
        0.3 + (plant.health / 100) * 0.3,
        plant.health < 30 ? 0.1 : 0.2
    );

    plant.stem.model.meshInstances[0].material.diffuse = healthColor;
    plant.stem.model.meshInstances[0].material.update();
};

VirtualGarden.prototype.updateTool = function(markerId, pose) {
    const toolType = this.toolTypes[markerId];

    if (!this.tools[markerId]) {
        this.createTool(markerId, toolType);
    }

    this.tools[markerId].setPosition(pose.position);

    // Check for interaction with plants
    this.checkToolPlantInteraction(markerId, toolType, pose.position);
};

VirtualGarden.prototype.createTool = function(markerId, toolType) {
    const tool = new pc.Entity('Tool_' + toolType);
    this.entity.addChild(tool);

    tool.addComponent('model', { type: toolType === 'wateringCan' ? 'cone' : 'box' });
    tool.setLocalScale(0.05, 0.05, 0.05);

    const color = toolType === 'wateringCan' ? new pc.Color(0.5, 0.7, 1) : new pc.Color(0.6, 0.4, 0.2);

    if (tool.model && tool.model.meshInstances[0]) {
        tool.model.meshInstances[0].material.diffuse = color;
        tool.model.meshInstances[0].material.update();
    }

    this.tools[markerId] = tool;
};

VirtualGarden.prototype.checkToolPlantInteraction = function(toolMarkerId, toolType, toolPosition) {
    Object.entries(this.plants).forEach(([plantMarkerId, plant]) => {
        const distance = plant.entity.getPosition().distance(toolPosition);

        if (distance < 0.1) {
            if (toolType === 'wateringCan') {
                this.waterPlant(plantMarkerId);
            } else if (toolType === 'fertilizer') {
                this.fertilizePlant(plantMarkerId);
            }
        }
    });
};

VirtualGarden.prototype.waterPlant = function(markerId) {
    const plant = this.plants[markerId];
    if (!plant) return;

    const timeSinceWatered = Date.now() - plant.lastWatered;
    if (timeSinceWatered < 2000) return; // Cooldown

    plant.water = Math.min(100, plant.water + 30);
    plant.lastWatered = Date.now();

    console.log('Watered plant at marker', markerId, '- Water level:', plant.water.toFixed(0) + '%');
    this.spawnWaterParticles(plant.entity.getPosition());
};

VirtualGarden.prototype.fertilizePlant = function(markerId) {
    const plant = this.plants[markerId];
    if (!plant) return;

    if (plant.fertilized) {
        console.log('Plant already fertilized');
        return;
    }

    plant.fertilized = true;
    plant.health = Math.min(100, plant.health + 20);

    console.log('Fertilized plant at marker', markerId);
    this.spawnFertilizerEffect(plant.entity.getPosition());
};

VirtualGarden.prototype.spawnWaterParticles = function(position) {
    // Create water drop particles
    console.log('Water particles at', position);
};

VirtualGarden.prototype.spawnFertilizerEffect = function(position) {
    // Create fertilizer sparkle effect
    console.log('Fertilizer effect at', position);
};

VirtualGarden.prototype.updateEnvironment = function(dt) {
    // Randomly change weather
    if (Math.random() < 0.001) {
        const weathers = ['sunny', 'rain', 'cloudy'];
        this.weather = weathers[Math.floor(Math.random() * weathers.length)];
        console.log('Weather changed to:', this.weather);
    }

    // Progress season
    this.seasonProgress += dt * 0.01;
    if (this.seasonProgress >= 100) {
        this.seasonProgress = 0;
        console.log('New season!');
    }
};

VirtualGarden.prototype.updateTimeOfDay = function(dt) {
    this.timeOfDay = (this.timeOfDay + dt * 0.1) % 24;
};

VirtualGarden.prototype.harvestPlant = function(markerId) {
    const plant = this.plants[markerId];
    if (!plant) return;

    if (plant.growth >= 1.0 && plant.bloomStage >= 1.0) {
        console.log('Harvested', plant.type, '!');
        plant.entity.destroy();
        delete this.plants[markerId];
        return true;
    } else {
        console.log('Plant not ready to harvest yet. Growth:', (plant.growth * 100).toFixed(0) + '%');
        return false;
    }
};

VirtualGarden.prototype.getGardenStats = function() {
    const totalPlants = Object.keys(this.plants).length;
    const avgHealth = Object.values(this.plants).reduce((sum, p) => sum + p.health, 0) / totalPlants || 0;
    const avgGrowth = Object.values(this.plants).reduce((sum, p) => sum + p.growth, 0) / totalPlants || 0;

    return {
        totalPlants: totalPlants,
        avgHealth: avgHealth.toFixed(1) + '%',
        avgGrowth: (avgGrowth * 100).toFixed(1) + '%',
        weather: this.weather,
        timeOfDay: this.timeOfDay.toFixed(1)
    };
};
