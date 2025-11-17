/** Animation Studio - Create stop-motion animations with markers */
var AnimationStudio = pc.createScript('animationStudio');

AnimationStudio.attributes.add('characterMarkerIDs', {
    type: 'number',
    array: true,
    default: [520, 521, 522],
    description: 'Character/object markers'
});

AnimationStudio.attributes.add('cameraMarkerID', {
    type: 'number',
    default: 523,
    description: 'Camera marker'
});

AnimationStudio.prototype.initialize = function() {
    this.characters = {};
    this.frames = [];
    this.currentFrame = 0;
    this.isRecording = false;
    this.isPlaying = false;
    this.frameRate = 12; // fps
    this.playbackTimer = 0;
};

AnimationStudio.prototype.update = function(dt) {
    if (this.isPlaying && this.frames.length > 0) {
        this.playbackTimer += dt;

        if (this.playbackTimer >= 1 / this.frameRate) {
            this.playbackTimer = 0;
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.displayFrame(this.currentFrame);
        }
    }
};

AnimationStudio.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.characterMarkerIDs.includes(markerId)) {
        this.updateCharacter(markerId, pose);
    }
};

AnimationStudio.prototype.updateCharacter = function(markerId, pose) {
    if (!this.characters[markerId]) {
        this.createCharacter(markerId);
    }

    this.characters[markerId].entity.setPosition(pose.position);
    this.characters[markerId].position = pose.position.clone();
    this.characters[markerId].rotation = pose.rotation.clone();
};

AnimationStudio.prototype.createCharacter = function(markerId) {
    const character = new pc.Entity('Character_' + markerId);
    this.entity.addChild(character);

    character.addComponent('model', { type: 'capsule' });
    character.setLocalScale(0.05, 0.08, 0.05);

    const colors = [
        new pc.Color(1, 0.3, 0.3),
        new pc.Color(0.3, 1, 0.3),
        new pc.Color(0.3, 0.3, 1)
    ];

    const colorIndex = this.characterMarkerIDs.indexOf(markerId);

    if (character.model && character.model.meshInstances[0]) {
        character.model.meshInstances[0].material.diffuse = colors[colorIndex];
        character.model.meshInstances[0].material.update();
    }

    this.characters[markerId] = {
        entity: character,
        position: new pc.Vec3(),
        rotation: new pc.Quat()
    };
};

AnimationStudio.prototype.captureFrame = function() {
    const frame = {};

    Object.entries(this.characters).forEach(([id, char]) => {
        frame[id] = {
            position: char.position.clone(),
            rotation: char.rotation.clone()
        };
    });

    this.frames.push(frame);
    console.log('Frame', this.frames.length, 'captured');
};

AnimationStudio.prototype.displayFrame = function(frameIndex) {
    const frame = this.frames[frameIndex];

    Object.entries(frame).forEach(([id, data]) => {
        const char = this.characters[id];
        if (char) {
            char.entity.setPosition(data.position);
            char.entity.setRotation(data.rotation);
        }
    });
};

AnimationStudio.prototype.play = function() {
    if (this.frames.length === 0) {
        console.log('No frames to play');
        return;
    }

    this.isPlaying = true;
    this.currentFrame = 0;
    console.log('Playing animation -', this.frames.length, 'frames at', this.frameRate, 'fps');
};

AnimationStudio.prototype.stop = function() {
    this.isPlaying = false;
    this.currentFrame = 0;
    console.log('Playback stopped');
};

AnimationStudio.prototype.deleteFrame = function() {
    if (this.frames.length > 0) {
        this.frames.pop();
        console.log('Deleted last frame. Frames remaining:', this.frames.length);
    }
};

AnimationStudio.prototype.clearAnimation = function() {
    this.frames = [];
    this.currentFrame = 0;
    this.isPlaying = false;
    console.log('Animation cleared');
};
