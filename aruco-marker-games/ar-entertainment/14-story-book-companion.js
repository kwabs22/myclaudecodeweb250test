/** Story Book Companion - Interactive AR storytelling with marker-triggered scenes */
var StoryBookCompanion = pc.createScript('storyBookCompanion');

StoryBookCompanion.attributes.add('pageMarkerIDs', {
    type: 'number',
    array: true,
    default: [110, 111, 112, 113, 114, 115, 116, 117, 118, 119],
    description: 'Marker IDs for book pages (one per page)'
});

StoryBookCompanion.prototype.initialize = function() {
    this.currentPage = null;
    this.characters = {};
    this.animations = {};
    this.audioPlaying = false;

    this.storyData = this.initializeStory();
    this.soundEffects = {};
};

StoryBookCompanion.prototype.initializeStory = function() {
    return {
        110: {
            pageNumber: 1,
            title: "The Beginning",
            text: "Once upon a time, in a magical forest...",
            characters: [
                { name: 'hero', model: 'capsule', position: [0, 0.05, 0], scale: 0.05 }
            ],
            animation: 'spawn',
            sound: 'page1_narration.mp3',
            effects: ['sparkles', 'birds']
        },
        111: {
            pageNumber: 2,
            title: "Meeting the Guide",
            text: "A wise owl appeared to guide the hero.",
            characters: [
                { name: 'hero', model: 'capsule', position: [-0.1, 0.05, 0], scale: 0.05 },
                { name: 'owl', model: 'sphere', position: [0.1, 0.1, 0], scale: 0.04 }
            ],
            animation: 'conversation',
            sound: 'page2_narration.mp3',
            effects: ['feathers']
        },
        112: {
            pageNumber: 3,
            title: "The Challenge",
            text: "They discovered a mysterious cave.",
            characters: [
                { name: 'hero', model: 'capsule', position: [0, 0.05, 0], scale: 0.05 },
                { name: 'cave', model: 'box', position: [0.15, 0.08, 0], scale: 0.1 }
            ],
            animation: 'approach',
            sound: 'page3_narration.mp3',
            effects: ['fog', 'glowing_entrance']
        },
        113: {
            pageNumber: 4,
            title: "Inside the Cave",
            text: "The cave was filled with glowing crystals.",
            characters: [
                { name: 'hero', model: 'capsule', position: [0, 0.05, 0], scale: 0.05 },
                { name: 'crystal1', model: 'box', position: [0.08, 0.04, 0.08], scale: 0.02 },
                { name: 'crystal2', model: 'box', position: [-0.08, 0.03, 0.08], scale: 0.025 },
                { name: 'crystal3', model: 'box', position: [0, 0.05, 0.1], scale: 0.03 }
            ],
            animation: 'explore',
            sound: 'page4_narration.mp3',
            effects: ['crystal_glow', 'echo']
        },
        114: {
            pageNumber: 5,
            title: "The Guardian",
            text: "A dragon guarded the treasure.",
            characters: [
                { name: 'hero', model: 'capsule', position: [-0.1, 0.05, 0], scale: 0.05 },
                { name: 'dragon', model: 'capsule', position: [0.1, 0.08, 0], scale: 0.08 }
            ],
            animation: 'confrontation',
            sound: 'page5_narration.mp3',
            effects: ['fire', 'roar']
        },
        115: {
            pageNumber: 6,
            title: "The Riddle",
            text: "The dragon posed a riddle.",
            characters: [
                { name: 'hero', model: 'capsule', position: [-0.08, 0.05, 0], scale: 0.05 },
                { name: 'dragon', model: 'capsule', position: [0.08, 0.08, 0], scale: 0.08 }
            ],
            animation: 'thinking',
            sound: 'page6_narration.mp3',
            effects: ['question_marks', 'thought_bubble']
        },
        116: {
            pageNumber: 7,
            title: "The Answer",
            text: "The hero solved the riddle!",
            characters: [
                { name: 'hero', model: 'capsule', position: [0, 0.05, 0], scale: 0.05 },
                { name: 'dragon', model: 'capsule', position: [0.12, 0.08, 0], scale: 0.08 }
            ],
            animation: 'celebration',
            sound: 'page7_narration.mp3',
            effects: ['sparkles', 'victory']
        },
        117: {
            pageNumber: 8,
            title: "The Treasure",
            text: "The dragon revealed a magical artifact.",
            characters: [
                { name: 'hero', model: 'capsule', position: [-0.05, 0.05, 0], scale: 0.05 },
                { name: 'treasure', model: 'sphere', position: [0.05, 0.06, 0], scale: 0.03 }
            ],
            animation: 'reveal',
            sound: 'page8_narration.mp3',
            effects: ['golden_glow', 'chimes']
        },
        118: {
            pageNumber: 9,
            title: "The Return",
            text: "The hero returned home victorious.",
            characters: [
                { name: 'hero', model: 'capsule', position: [0, 0.05, 0], scale: 0.05 },
                { name: 'village', model: 'box', position: [0.15, 0.04, 0], scale: 0.06 }
            ],
            animation: 'walk_home',
            sound: 'page9_narration.mp3',
            effects: ['sunset', 'happy_music']
        },
        119: {
            pageNumber: 10,
            title: "The End",
            text: "And they lived happily ever after.",
            characters: [
                { name: 'hero', model: 'capsule', position: [0, 0.05, 0], scale: 0.05 }
            ],
            animation: 'happy_ending',
            sound: 'page10_narration.mp3',
            effects: ['fireworks', 'celebration']
        }
    };
};

StoryBookCompanion.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.pageMarkerIDs.includes(markerId)) {
        this.displayPage(markerId, pose);
    }
};

StoryBookCompanion.prototype.displayPage = function(markerId, pose) {
    if (this.currentPage === markerId) {
        // Update existing page position
        this.updatePagePosition(pose);
        return;
    }

    // New page detected
    this.clearCurrentPage();
    this.currentPage = markerId;

    const pageData = this.storyData[markerId];
    if (!pageData) return;

    console.log('Page', pageData.pageNumber + ':', pageData.title);
    console.log(pageData.text);

    this.spawnPageElements(pageData, pose);
    this.playAnimation(pageData.animation);
    this.playNarration(pageData.sound);
    this.triggerEffects(pageData.effects);
};

StoryBookCompanion.prototype.spawnPageElements = function(pageData, pose) {
    pageData.characters.forEach(charData => {
        const character = new pc.Entity(charData.name);
        this.entity.addChild(character);

        character.addComponent('model', { type: charData.model });

        const worldPos = pose.position.clone().add(new pc.Vec3(
            charData.position[0],
            charData.position[1],
            charData.position[2]
        ));

        character.setPosition(worldPos);
        character.setLocalScale(charData.scale, charData.scale, charData.scale);

        // Apply character-specific colors
        this.applyCharacterColor(character, charData.name);

        this.characters[charData.name] = character;
    });
};

StoryBookCompanion.prototype.applyCharacterColor = function(entity, name) {
    const colors = {
        'hero': new pc.Color(0.3, 0.5, 1),
        'owl': new pc.Color(0.6, 0.4, 0.2),
        'dragon': new pc.Color(1, 0.2, 0.2),
        'cave': new pc.Color(0.3, 0.3, 0.3),
        'crystal1': new pc.Color(0.5, 1, 1),
        'crystal2': new pc.Color(1, 0.5, 1),
        'crystal3': new pc.Color(1, 1, 0.5),
        'treasure': new pc.Color(1, 0.84, 0),
        'village': new pc.Color(0.5, 0.35, 0.2)
    };

    const color = colors[name] || new pc.Color(0.5, 0.5, 0.5);

    if (entity.model && entity.model.meshInstances[0]) {
        entity.model.meshInstances[0].material.diffuse = color;
        entity.model.meshInstances[0].material.update();
    }
};

StoryBookCompanion.prototype.playAnimation = function(animationType) {
    // Play page-specific animation
    console.log('Playing animation:', animationType);

    switch(animationType) {
        case 'spawn':
            this.animateSpawn();
            break;
        case 'conversation':
            this.animateConversation();
            break;
        case 'approach':
            this.animateApproach();
            break;
        case 'explore':
            this.animateExplore();
            break;
        case 'confrontation':
            this.animateConfrontation();
            break;
        case 'celebration':
            this.animateCelebration();
            break;
    }
};

StoryBookCompanion.prototype.animateSpawn = function() {
    if (this.characters['hero']) {
        const hero = this.characters['hero'];
        const startScale = 0;
        const targetScale = 0.05;
        // Animate scale from 0 to target over time
    }
};

StoryBookCompanion.prototype.animateConversation = function() {
    // Bounce animation between characters
    if (this.characters['hero'] && this.characters['owl']) {
        // Animate both characters
    }
};

StoryBookCompanion.prototype.animateApproach = function() {
    // Hero moves toward target
    if (this.characters['hero']) {
        // Animate movement
    }
};

StoryBookCompanion.prototype.animateExplore = function() {
    // Hero looks around, crystals pulse
    Object.keys(this.characters).forEach(name => {
        if (name.startsWith('crystal')) {
            // Pulse animation
        }
    });
};

StoryBookCompanion.prototype.animateConfrontation = function() {
    // Face off between characters
    if (this.characters['hero'] && this.characters['dragon']) {
        // Shake/rotate animations
    }
};

StoryBookCompanion.prototype.animateCelebration = function() {
    // Victory animation
    Object.values(this.characters).forEach(char => {
        // Jump/bounce animation
    });
};

StoryBookCompanion.prototype.playNarration = function(soundFile) {
    if (!soundFile || this.audioPlaying) return;

    console.log('Playing narration:', soundFile);
    this.audioPlaying = true;

    // In real implementation, load and play audio file
    setTimeout(() => {
        this.audioPlaying = false;
    }, 3000);
};

StoryBookCompanion.prototype.triggerEffects = function(effects) {
    effects.forEach(effect => {
        console.log('Triggering effect:', effect);
        this.spawnEffect(effect);
    });
};

StoryBookCompanion.prototype.spawnEffect = function(effectType) {
    // Create particle systems, visual effects based on type
    switch(effectType) {
        case 'sparkles':
        case 'fireworks':
            // Particle system
            break;
        case 'fire':
        case 'fog':
            // Animated effect
            break;
        case 'golden_glow':
        case 'crystal_glow':
            // Light/glow effect
            break;
    }
};

StoryBookCompanion.prototype.updatePagePosition = function(pose) {
    // Update all characters to follow marker pose
    Object.values(this.characters).forEach(char => {
        const offset = char.userData?.positionOffset || new pc.Vec3();
        char.setPosition(pose.position.clone().add(offset));
    });
};

StoryBookCompanion.prototype.clearCurrentPage = function() {
    // Remove all characters and effects
    Object.values(this.characters).forEach(char => char.destroy());
    this.characters = {};
    this.currentPage = null;
};

StoryBookCompanion.prototype.getProgress = function() {
    const totalPages = this.pageMarkerIDs.length;
    const currentPageNum = this.currentPage ? this.storyData[this.currentPage]?.pageNumber : 0;
    return {
        currentPage: currentPageNum,
        totalPages: totalPages,
        percentage: (currentPageNum / totalPages * 100).toFixed(0) + '%'
    };
};
