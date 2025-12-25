/** Anatomy Explorer - Interactive 3D human body exploration with AR markers */
var AnatomyExplorer = pc.createScript('anatomyExplorer');

AnatomyExplorer.attributes.add('bodySystemMarkerIDs', {
    type: 'number',
    array: true,
    default: [220, 221, 222, 223, 224, 225, 226, 227],
    description: 'Marker IDs for body systems (skeletal, muscular, circulatory, nervous, digestive, respiratory, lymphatic, endocrine)'
});

AnatomyExplorer.attributes.add('bodyMarkerID', {
    type: 'number',
    default: 219,
    description: 'Main body marker'
});

AnatomyExplorer.prototype.initialize = function() {
    this.bodyModel = null;
    this.currentSystem = null;
    this.organModels = {};
    this.infoLabels = {};
    this.selectedOrgan = null;

    this.bodySystems = {
        220: {
            name: 'Skeletal',
            color: new pc.Color(0.9, 0.9, 0.9),
            organs: ['skull', 'ribcage', 'spine', 'pelvis', 'femur', 'humerus']
        },
        221: {
            name: 'Muscular',
            color: new pc.Color(0.8, 0.3, 0.3),
            organs: ['biceps', 'triceps', 'quadriceps', 'hamstrings', 'pectorals', 'abdominals']
        },
        222: {
            name: 'Circulatory',
            color: new pc.Color(1, 0.2, 0.2),
            organs: ['heart', 'arteries', 'veins', 'capillaries']
        },
        223: {
            name: 'Nervous',
            color: new pc.Color(1, 1, 0.3),
            organs: ['brain', 'spinal_cord', 'nerves']
        },
        224: {
            name: 'Digestive',
            color: new pc.Color(0.6, 0.4, 0.2),
            organs: ['stomach', 'liver', 'intestines', 'esophagus', 'pancreas']
        },
        225: {
            name: 'Respiratory',
            color: new pc.Color(0.5, 0.8, 1),
            organs: ['lungs', 'trachea', 'bronchi', 'diaphragm']
        },
        226: {
            name: 'Lymphatic',
            color: new pc.Color(0.7, 1, 0.7),
            organs: ['lymph_nodes', 'spleen', 'thymus']
        },
        227: {
            name: 'Endocrine',
            color: new pc.Color(0.9, 0.5, 1),
            organs: ['pituitary', 'thyroid', 'adrenal', 'pancreas']
        }
    };

    this.organInfo = {
        'heart': 'Pumps blood throughout the body',
        'lungs': 'Facilitate breathing and gas exchange',
        'brain': 'Control center of the nervous system',
        'stomach': 'Digests food using acids and enzymes',
        'liver': 'Filters blood and produces bile',
        'kidneys': 'Filter waste from blood',
        'intestines': 'Absorb nutrients from food'
    };
};

AnatomyExplorer.prototype.onMarkerDetected = function(markerId, pose) {
    if (markerId === this.bodyMarkerID) {
        this.updateBodyPosition(pose);
    } else if (this.bodySystemMarkerIDs.includes(markerId)) {
        this.showBodySystem(markerId, pose);
    }
};

AnatomyExplorer.prototype.updateBodyPosition = function(pose) {
    if (!this.bodyModel) {
        this.createBodyModel();
    }

    this.bodyModel.setPosition(pose.position);
    this.bodyModel.setRotation(pose.rotation);
};

AnatomyExplorer.prototype.createBodyModel = function() {
    this.bodyModel = new pc.Entity('HumanBody');
    this.entity.addChild(this.bodyModel);

    // Create simple body outline
    const torso = new pc.Entity('Torso');
    this.bodyModel.addChild(torso);
    torso.addComponent('model', { type: 'capsule' });
    torso.setLocalScale(0.08, 0.15, 0.08);
    torso.setLocalPosition(0, 0.15, 0);

    // Head
    const head = new pc.Entity('Head');
    this.bodyModel.addChild(head);
    head.addComponent('model', { type: 'sphere' });
    head.setLocalScale(0.05, 0.05, 0.05);
    head.setLocalPosition(0, 0.32, 0);

    // Arms
    const leftArm = this.createLimb('LeftArm', -0.09, 0.2);
    const rightArm = this.createLimb('RightArm', 0.09, 0.2);
    this.bodyModel.addChild(leftArm);
    this.bodyModel.addChild(rightArm);

    // Legs
    const leftLeg = this.createLimb('LeftLeg', -0.03, 0);
    const rightLeg = this.createLimb('RightLeg', 0.03, 0);
    this.bodyModel.addChild(leftLeg);
    this.bodyModel.addChild(rightLeg);

    // Set base color
    this.setBodyColor(new pc.Color(0.8, 0.7, 0.6));
};

AnatomyExplorer.prototype.createLimb = function(name, x, y) {
    const limb = new pc.Entity(name);
    limb.addComponent('model', { type: 'capsule' });
    limb.setLocalScale(0.025, 0.08, 0.025);
    limb.setLocalPosition(x, y, 0);
    return limb;
};

AnatomyExplorer.prototype.showBodySystem = function(markerId, pose) {
    const system = this.bodySystems[markerId];
    if (!system) return;

    // Clear previous system
    this.clearCurrentSystem();

    this.currentSystem = markerId;
    console.log('Showing', system.name, 'System');

    // Change body color to system color
    if (this.bodyModel) {
        this.setBodyColor(system.color);
    }

    // Create organ models for this system
    this.createOrganModels(system);
};

AnatomyExplorer.prototype.createOrganModels = function(system) {
    system.organs.forEach((organName, index) => {
        const organ = this.createOrgan(organName, system.color, index);
        this.organModels[organName] = organ;
    });
};

AnatomyExplorer.prototype.createOrgan = function(name, color, index) {
    const organ = new pc.Entity('Organ_' + name);

    if (this.bodyModel) {
        this.bodyModel.addChild(organ);
    } else {
        this.entity.addChild(organ);
    }

    // Position based on organ type
    const pos = this.getOrganPosition(name);
    organ.setLocalPosition(pos.x, pos.y, pos.z);

    // Shape based on organ type
    const modelType = this.getOrganModelType(name);
    organ.addComponent('model', { type: modelType });

    const scale = this.getOrganScale(name);
    organ.setLocalScale(scale, scale, scale);

    // Color
    if (organ.model && organ.model.meshInstances[0]) {
        organ.model.meshInstances[0].material.diffuse = color;
        organ.model.meshInstances[0].material.update();
    }

    organ.organName = name;
    return organ;
};

AnatomyExplorer.prototype.getOrganPosition = function(name) {
    const positions = {
        // Skeletal
        'skull': { x: 0, y: 0.32, z: 0 },
        'ribcage': { x: 0, y: 0.18, z: 0 },
        'spine': { x: 0, y: 0.15, z: -0.02 },
        'pelvis': { x: 0, y: 0.05, z: 0 },
        // Circulatory
        'heart': { x: 0.02, y: 0.2, z: 0.02 },
        'arteries': { x: 0, y: 0.15, z: 0.01 },
        // Digestive
        'stomach': { x: 0.01, y: 0.16, z: 0.03 },
        'liver': { x: 0.04, y: 0.18, z: 0.02 },
        'intestines': { x: 0, y: 0.1, z: 0.03 },
        // Respiratory
        'lungs': { x: 0, y: 0.22, z: 0.02 },
        'trachea': { x: 0, y: 0.28, z: 0.01 },
        // Nervous
        'brain': { x: 0, y: 0.32, z: 0 },
        'spinal_cord': { x: 0, y: 0.15, z: -0.02 }
    };

    return positions[name] || { x: 0, y: 0.15, z: 0.05 };
};

AnatomyExplorer.prototype.getOrganModelType = function(name) {
    const types = {
        'heart': 'sphere',
        'brain': 'sphere',
        'stomach': 'capsule',
        'liver': 'box',
        'lungs': 'capsule',
        'kidney': 'capsule',
        'intestines': 'torus'
    };

    return types[name] || 'box';
};

AnatomyExplorer.prototype.getOrganScale = function(name) {
    const scales = {
        'heart': 0.03,
        'brain': 0.04,
        'lungs': 0.04,
        'stomach': 0.035,
        'liver': 0.04,
        'intestines': 0.05,
        'skull': 0.05,
        'ribcage': 0.08
    };

    return scales[name] || 0.03;
};

AnatomyExplorer.prototype.setBodyColor = function(color) {
    if (!this.bodyModel) return;

    this.bodyModel.children.forEach(part => {
        if (part.model && part.model.meshInstances[0]) {
            part.model.meshInstances[0].material.diffuse = color.clone();
            part.model.meshInstances[0].material.update();
        }
    });
};

AnatomyExplorer.prototype.clearCurrentSystem = function() {
    Object.values(this.organModels).forEach(organ => organ.destroy());
    this.organModels = {};
    this.currentSystem = null;
};

AnatomyExplorer.prototype.selectOrgan = function(organName) {
    this.selectedOrgan = organName;
    const info = this.organInfo[organName];

    if (info) {
        console.log('Organ:', organName.replace('_', ' '));
        console.log('Info:', info);
    }

    // Highlight selected organ
    const organ = this.organModels[organName];
    if (organ && organ.model && organ.model.meshInstances[0]) {
        organ.model.meshInstances[0].material.emissive = new pc.Color(0.3, 0.3, 0.3);
        organ.model.meshInstances[0].material.update();
    }
};

AnatomyExplorer.prototype.getSystemInfo = function() {
    if (!this.currentSystem) return null;

    const system = this.bodySystems[this.currentSystem];
    return {
        name: system.name,
        organCount: system.organs.length,
        organs: system.organs.map(o => o.replace('_', ' '))
    };
};
