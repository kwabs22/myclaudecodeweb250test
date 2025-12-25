/**
 * Virtual Pet Care
 * Place a virtual pet on a marker that players must care for
 * Pet appears on marker, interact using UI or other markers
 */

var VirtualPet = pc.createScript('virtualPet');

VirtualPet.attributes.add('petPrefab', {
    type: 'asset',
    assetType: 'template',
    description: 'Pet 3D model'
});

VirtualPet.attributes.add('petMarkerID', {
    type: 'number',
    default: 0,
    description: 'Marker ID for pet placement'
});

VirtualPet.attributes.add('foodMarkerID', {
    type: 'number',
    default: 1,
    description: 'Marker ID for feeding'
});

VirtualPet.attributes.add('toyMarkerID', {
    type: 'number',
    default: 2,
    description: 'Marker ID for playing'
});

VirtualPet.prototype.initialize = function() {
    this.pet = null;
    this.petState = {
        hunger: 50,
        happiness: 50,
        energy: 100,
        health: 100
    };

    this.lastUpdate = Date.now();
    this.detectedMarkers = new Set();

    this.setupMarkerDetection();
};

VirtualPet.prototype.update = function(dt) {
    this.updatePetNeeds(dt);
    this.checkMarkerInteractions();
    this.updatePetAnimation();
};

VirtualPet.prototype.updatePetNeeds = function(dt) {
    const now = Date.now();
    const timePassed = (now - this.lastUpdate) / 1000;

    // Decrease stats over time
    this.petState.hunger = Math.max(0, this.petState.hunger - timePassed * 0.5);
    this.petState.happiness = Math.max(0, this.petState.happiness - timePassed * 0.3);

    // Health depends on other stats
    if (this.petState.hunger < 20 || this.petState.happiness < 20) {
        this.petState.health = Math.max(0, this.petState.health - timePassed * 0.2);
    }

    this.lastUpdate = now;
};

VirtualPet.prototype.checkMarkerInteractions = function() {
    // Check if pet marker and food marker are close
    if (this.detectedMarkers.has(this.petMarkerID) && 
        this.detectedMarkers.has(this.foodMarkerID)) {
        this.feedPet();
    }

    // Check if pet marker and toy marker are close
    if (this.detectedMarkers.has(this.petMarkerID) && 
        this.detectedMarkers.has(this.toyMarkerID)) {
        this.playWithPet();
    }
};

VirtualPet.prototype.feedPet = function() {
    this.petState.hunger = Math.min(100, this.petState.hunger + 25);
    this.petState.health = Math.min(100, this.petState.health + 5);

    if (this.pet) {
        this.playAnimation('eating');
    }

    console.log('Pet fed! Hunger:', this.petState.hunger);
};

VirtualPet.prototype.playWithPet = function() {
    this.petState.happiness = Math.min(100, this.petState.happiness + 20);
    this.petState.energy = Math.max(0, this.petState.energy - 10);

    if (this.pet) {
        this.playAnimation('playing');
    }

    console.log('Playing with pet! Happiness:', this.petState.happiness);
};

VirtualPet.prototype.updatePetAnimation = function() {
    if (!this.pet) return;

    // Change animation based on state
    if (this.petState.hunger < 30) {
        this.playAnimation('hungry');
    } else if (this.petState.happiness < 30) {
        this.playAnimation('sad');
    } else if (this.petState.energy < 30) {
        this.playAnimation('sleeping');
    } else {
        this.playAnimation('idle');
    }
};

VirtualPet.prototype.playAnimation = function(animName) {
    if (this.pet && this.pet.anim) {
        this.pet.anim.play(animName);
    }
};

VirtualPet.prototype.setupMarkerDetection = function() {
    // Setup marker detection (integrate with AR system)
};

VirtualPet.prototype.onMarkerDetected = function(markerId) {
    this.detectedMarkers.add(markerId);

    if (markerId === this.petMarkerID && !this.pet) {
        this.spawnPet();
    }
};

VirtualPet.prototype.onMarkerLost = function(markerId) {
    this.detectedMarkers.delete(markerId);

    if (markerId === this.petMarkerID && this.pet) {
        this.hidePet();
    }
};

VirtualPet.prototype.spawnPet = function() {
    if (!this.petPrefab) return;

    this.pet = this.petPrefab.resource.instantiate();
    this.entity.addChild(this.pet);

    console.log('Pet spawned!');
};

VirtualPet.prototype.hidePet = function() {
    if (this.pet) {
        this.pet.enabled = false;
    }
};
