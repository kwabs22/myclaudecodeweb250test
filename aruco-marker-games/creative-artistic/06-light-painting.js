/** Light Painting - Create light trails in AR space */
var LightPainting = pc.createScript('lightPainting');

LightPainting.attributes.add('lightMarkerID', {
    type: 'number',
    default: 530,
    description: 'Light source marker'
});

LightPainting.attributes.add('colorMarkerIDs', {
    type: 'number',
    array: true,
    default: [531, 532, 533, 534],
    description: 'Color markers (red, green, blue, white)'
});

LightPainting.prototype.initialize = function() {
    this.lightSource = null;
    this.trails = [];
    this.currentTrail = null;
    this.currentColor = new pc.Color(1, 1, 1);
    this.trailIntensity = 1.0;
    this.isDrawing = false;
    this.lastPosition = null;

    this.colors = {
        531: new pc.Color(1, 0.2, 0.2),
        532: new pc.Color(0.2, 1, 0.2),
        533: new pc.Color(0.2, 0.2, 1),
        534: new pc.Color(1, 1, 1)
    };
};

LightPainting.prototype.update = function(dt) {
    if (this.isDrawing && this.lastPosition) {
        this.updateTrail();
    }
};

LightPainting.prototype.onMarkerDetected = function(markerId, pose) {
    if (markerId === this.lightMarkerID) {
        this.updateLight(pose);
    } else if (this.colorMarkerIDs.includes(markerId)) {
        this.selectColor(markerId);
    }
};

LightPainting.prototype.updateLight = function(pose) {
    if (!this.lightSource) {
        this.createLightSource();
    }

    const newPos = pose.position.clone();
    this.lightSource.setPosition(newPos);

    if (this.lastPosition) {
        const distance = this.lastPosition.distance(newPos);
        this.isDrawing = distance > 0.001;
    }

    this.lastPosition = newPos.clone();
};

LightPainting.prototype.createLightSource = function() {
    this.lightSource = new pc.Entity('LightSource');
    this.entity.addChild(this.lightSource);

    this.lightSource.addComponent('model', { type: 'sphere' });
    this.lightSource.setLocalScale(0.03, 0.03, 0.03);

    if (this.lightSource.model && this.lightSource.model.meshInstances[0]) {
        this.lightSource.model.meshInstances[0].material.diffuse = this.currentColor.clone();
        this.lightSource.model.meshInstances[0].material.emissive = this.currentColor.clone();
        this.lightSource.model.meshInstances[0].material.update();
    }
};

LightPainting.prototype.updateTrail = function() {
    if (!this.currentTrail) {
        this.currentTrail = {
            points: [],
            color: this.currentColor.clone(),
            intensity: this.trailIntensity
        };
        this.trails.push(this.currentTrail);
    }

    const point = this.lastPosition.clone();
    this.currentTrail.points.push(point);

    this.createTrailSegment(point, this.currentColor, this.trailIntensity);
};

LightPainting.prototype.createTrailSegment = function(position, color, intensity) {
    const segment = new pc.Entity('LightTrail');
    this.entity.addChild(segment);

    segment.addComponent('model', { type: 'sphere' });
    segment.setPosition(position);
    segment.setLocalScale(0.015, 0.015, 0.015);

    if (segment.model && segment.model.meshInstances[0]) {
        segment.model.meshInstances[0].material.diffuse = color.clone();
        segment.model.meshInstances[0].material.emissive = color.clone().mulScalar(intensity);
        segment.model.meshInstances[0].material.update();
    }
};

LightPainting.prototype.selectColor = function(markerId) {
    const color = this.colors[markerId];
    if (!color) return;

    this.currentColor = color.clone();
    console.log('Selected color');

    if (this.lightSource && this.lightSource.model && this.lightSource.model.meshInstances[0]) {
        this.lightSource.model.meshInstances[0].material.diffuse = this.currentColor.clone();
        this.lightSource.model.meshInstances[0].material.emissive = this.currentColor.clone();
        this.lightSource.model.meshInstances[0].material.update();
    }

    this.currentTrail = null;
};

LightPainting.prototype.clearPainting = function() {
    this.entity.children.forEach(child => {
        if (child.name === 'LightTrail') {
            child.destroy();
        }
    });

    this.trails = [];
    this.currentTrail = null;
    console.log('Light painting cleared');
};

LightPainting.prototype.setIntensity = function(intensity) {
    this.trailIntensity = Math.max(0, Math.min(2, intensity));
    console.log('Intensity set to', this.trailIntensity);
};
