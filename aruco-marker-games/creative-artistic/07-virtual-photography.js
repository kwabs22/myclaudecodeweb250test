/** Virtual Photography - AR photography with filters and effects */
var VirtualPhotography = pc.createScript('virtualPhotography');

VirtualPhotography.attributes.add('cameraMarkerID', {
    type: 'number',
    default: 535,
    description: 'Camera marker'
});

VirtualPhotography.attributes.add('subjectMarkerIDs', {
    type: 'number',
    array: true,
    default: [536, 537, 538],
    description: 'Subject/prop markers'
});

VirtualPhotography.attributes.add('filterMarkerIDs', {
    type: 'number',
    array: true,
    default: [539, 540, 541],
    description: 'Filter markers (sepia, grayscale, vibrant)'
});

VirtualPhotography.prototype.initialize = function() {
    this.camera = null;
    this.subjects = {};
    this.photos = [];
    this.currentFilter = 'none';

    this.filters = {
        539: 'sepia',
        540: 'grayscale',
        541: 'vibrant'
    };

    this.photoCount = 0;
};

VirtualPhotography.prototype.onMarkerDetected = function(markerId, pose) {
    if (markerId === this.cameraMarkerID) {
        this.updateCamera(pose);
    } else if (this.subjectMarkerIDs.includes(markerId)) {
        this.updateSubject(markerId, pose);
    } else if (this.filterMarkerIDs.includes(markerId)) {
        this.selectFilter(markerId);
    }
};

VirtualPhotography.prototype.updateCamera = function(pose) {
    if (!this.camera) {
        this.createCamera();
    }

    this.camera.setPosition(pose.position);
    this.camera.setRotation(pose.rotation);
};

VirtualPhotography.prototype.createCamera = function() {
    this.camera = new pc.Entity('Camera');
    this.entity.addChild(this.camera);

    // Camera body
    const body = new pc.Entity('CameraBody');
    this.camera.addChild(body);
    body.addComponent('model', { type: 'box' });
    body.setLocalScale(0.08, 0.05, 0.03);

    // Lens
    const lens = new pc.Entity('Lens');
    this.camera.addChild(lens);
    lens.addComponent('model', { type: 'cylinder' });
    lens.setLocalScale(0.03, 0.02, 0.03);
    lens.setLocalPosition(0, 0, 0.04);
    lens.setLocalEulerAngles(90, 0, 0);

    if (body.model && body.model.meshInstances[0]) {
        body.model.meshInstances[0].material.diffuse = new pc.Color(0.2, 0.2, 0.2);
        body.model.meshInstances[0].material.update();
    }

    if (lens.model && lens.model.meshInstances[0]) {
        lens.model.meshInstances[0].material.diffuse = new pc.Color(0.1, 0.1, 0.1);
        lens.model.meshInstances[0].material.emissive = new pc.Color(0.2, 0.2, 0.2);
        lens.model.meshInstances[0].material.update();
    }
};

VirtualPhotography.prototype.updateSubject = function(markerId, pose) {
    if (!this.subjects[markerId]) {
        this.createSubject(markerId);
    }

    this.subjects[markerId].entity.setPosition(pose.position);
    this.subjects[markerId].position = pose.position.clone();
};

VirtualPhotography.prototype.createSubject = function(markerId) {
    const subject = new pc.Entity('Subject_' + markerId);
    this.entity.addChild(subject);

    subject.addComponent('model', { type: 'capsule' });
    subject.setLocalScale(0.05, 0.08, 0.05);

    const colors = [
        new pc.Color(1, 0.5, 0.5),
        new pc.Color(0.5, 1, 0.5),
        new pc.Color(0.5, 0.5, 1)
    ];

    const colorIndex = this.subjectMarkerIDs.indexOf(markerId);

    if (subject.model && subject.model.meshInstances[0]) {
        subject.model.meshInstances[0].material.diffuse = colors[colorIndex];
        subject.model.meshInstances[0].material.update();
    }

    this.subjects[markerId] = {
        entity: subject,
        position: new pc.Vec3()
    };
};

VirtualPhotography.prototype.selectFilter = function(markerId) {
    const filter = this.filters[markerId];
    if (filter) {
        this.currentFilter = filter;
        console.log('Selected filter:', filter);
        this.applyFilter();
    }
};

VirtualPhotography.prototype.applyFilter = function() {
    Object.values(this.subjects).forEach(subject => {
        if (!subject.entity.model || !subject.entity.model.meshInstances[0]) return;

        const originalColor = subject.entity.model.meshInstances[0].material.diffuse.clone();
        let filteredColor = originalColor.clone();

        switch(this.currentFilter) {
            case 'sepia':
                filteredColor = new pc.Color(
                    originalColor.r * 0.9,
                    originalColor.g * 0.7,
                    originalColor.b * 0.4
                );
                break;

            case 'grayscale':
                const gray = (originalColor.r + originalColor.g + originalColor.b) / 3;
                filteredColor = new pc.Color(gray, gray, gray);
                break;

            case 'vibrant':
                filteredColor = new pc.Color(
                    Math.min(1, originalColor.r * 1.3),
                    Math.min(1, originalColor.g * 1.3),
                    Math.min(1, originalColor.b * 1.3)
                );
                break;

            default:
                filteredColor = originalColor;
        }

        subject.entity.model.meshInstances[0].material.diffuse = filteredColor;
        subject.entity.model.meshInstances[0].material.update();
    });
};

VirtualPhotography.prototype.takePhoto = function() {
    if (!this.camera) {
        console.log('No camera detected');
        return;
    }

    this.photoCount++;

    const photo = {
        id: this.photoCount,
        timestamp: Date.now(),
        filter: this.currentFilter,
        cameraPosition: this.camera.getPosition().clone(),
        subjects: Object.entries(this.subjects).map(([id, subj]) => ({
            id: id,
            position: subj.position.clone()
        }))
    };

    this.photos.push(photo);

    console.log('📸 Photo #' + this.photoCount + ' taken!');
    console.log('Filter:', this.currentFilter);
    console.log('Subjects:', photo.subjects.length);

    this.flashEffect();
};

VirtualPhotography.prototype.flashEffect = function() {
    // Flash animation
    console.log('✨ Flash!');
};

VirtualPhotography.prototype.viewGallery = function() {
    console.log('Photo Gallery (' + this.photos.length + ' photos):');
    console.log('═══════════════════════════════════');

    this.photos.forEach(photo => {
        const date = new Date(photo.timestamp);
        console.log('Photo #' + photo.id);
        console.log('Time:', date.toLocaleTimeString());
        console.log('Filter:', photo.filter);
        console.log('Subjects:', photo.subjects.length);
        console.log('───────────────────────────────────');
    });
};

VirtualPhotography.prototype.deletePhoto = function(photoId) {
    const index = this.photos.findIndex(p => p.id === photoId);

    if (index !== -1) {
        this.photos.splice(index, 1);
        console.log('Photo #' + photoId + ' deleted');
    }
};

VirtualPhotography.prototype.clearGallery = function() {
    this.photos = [];
    this.photoCount = 0;
    console.log('Gallery cleared');
};
