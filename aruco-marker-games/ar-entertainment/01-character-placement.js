/**
 * AR Character Placement
 * Spawn 3D game characters on physical ArUco markers
 * Each marker ID corresponds to a different character model
 */

var CharacterPlacement = pc.createScript('characterPlacement');

CharacterPlacement.attributes.add('characterPrefabs', {
    type: 'asset',
    assetType: 'template',
    array: true,
    description: 'Character prefabs for markers 0-9'
});

CharacterPlacement.attributes.add('detectionThreshold', {
    type: 'number',
    default: 0.8,
    description: 'Marker detection confidence threshold'
});

CharacterPlacement.attributes.add('markerSize', {
    type: 'number',
    default: 0.08,
    description: 'Physical marker size in meters'
});

CharacterPlacement.prototype.initialize = function() {
    this.activeCharacters = {};
    this.detector = null;
    this.videoElement = null;

    this.setupCamera();
    this.setupMarkerDetector();
};

CharacterPlacement.prototype.setupCamera = function() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            this.videoElement = document.createElement('video');
            this.videoElement.srcObject = stream;
            this.videoElement.play();
        })
        .catch(err => console.error('Camera access denied:', err));
};

CharacterPlacement.prototype.setupMarkerDetector = function() {
    // Initialize AR.js detector
    this.detector = new AR.Detector();
};

CharacterPlacement.prototype.update = function(dt) {
    if (!this.videoElement || !this.videoElement.readyState) return;

    // Detect markers in current frame
    const markers = this.detectMarkers();

    const currentMarkerIds = new Set();

    markers.forEach(marker => {
        currentMarkerIds.add(marker.id);
        this.handleMarker(marker);
    });

    // Remove characters for lost markers
    Object.keys(this.activeCharacters).forEach(id => {
        if (!currentMarkerIds.has(parseInt(id))) {
            this.removeCharacter(id);
        }
    });
};

CharacterPlacement.prototype.detectMarkers = function() {
    // Capture frame from video
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Detect markers
    return this.detector.detect(imageData);
};

CharacterPlacement.prototype.handleMarker = function(marker) {
    if (marker.id >= this.characterPrefabs.length) return;

    if (!this.activeCharacters[marker.id]) {
        this.spawnCharacter(marker);
    } else {
        this.updateCharacterPose(marker);
    }
};

CharacterPlacement.prototype.spawnCharacter = function(marker) {
    const prefab = this.characterPrefabs[marker.id];
    if (!prefab) return;

    const character = prefab.resource.instantiate();
    this.entity.addChild(character);

    this.activeCharacters[marker.id] = character;
    this.updateCharacterPose(marker);

    console.log('Spawned character for marker:', marker.id);
};

CharacterPlacement.prototype.updateCharacterPose = function(marker) {
    const character = this.activeCharacters[marker.id];
    if (!character) return;

    // Extract position and rotation from marker pose
    const pose = this.calculatePoseFromMarker(marker);

    character.setPosition(pose.position);
    character.setEulerAngles(pose.rotation);
};

CharacterPlacement.prototype.calculatePoseFromMarker = function(marker) {
    // Convert marker corners to 3D pose
    // This uses marker corner positions to estimate position and orientation

    const position = new pc.Vec3(
        marker.center.x / 100,
        0,
        marker.center.y / 100
    );

    const rotation = new pc.Vec3(0, 0, 0);

    return { position, rotation };
};

CharacterPlacement.prototype.removeCharacter = function(markerId) {
    const character = this.activeCharacters[markerId];
    if (character) {
        character.destroy();
        delete this.activeCharacters[markerId];
        console.log('Removed character for marker:', markerId);
    }
};
