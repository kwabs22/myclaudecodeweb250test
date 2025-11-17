/** 3D Sculpting - Create and manipulate 3D sculptures in AR */
var Sculpting3D = pc.createScript('sculpting3D');

Sculpting3D.attributes.add('sculptMarkerID', {
    type: 'number',
    default: 510,
    description: 'Sculpture base marker'
});

Sculpting3D.attributes.add('toolMarkerIDs', {
    type: 'number',
    array: true,
    default: [511, 512, 513, 514],
    description: 'Tool markers (add, remove, smooth, pinch)'
});

Sculpting3D.prototype.initialize = function() {
    this.sculpture = null;
    this.voxels = [];
    this.currentTool = 'add';
    this.voxelSize = 0.025;
    this.gridSize = 10;

    this.tools = {
        511: 'add',
        512: 'remove',
        513: 'smooth',
        514: 'pinch'
    };

    this.createSculptureBase();
};

Sculpting3D.prototype.createSculptureBase = function() {
    this.sculpture = new pc.Entity('Sculpture');
    this.entity.addChild(this.sculpture);

    // Create base grid
    for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
            for (let z = 0; z < this.gridSize; z++) {
                const voxel = {
                    pos: { x, y, z },
                    active: y === 0, // Base layer
                    entity: null
                };

                if (voxel.active) {
                    this.createVoxelEntity(voxel);
                }

                this.voxels.push(voxel);
            }
        }
    }
};

Sculpting3D.prototype.createVoxelEntity = function(voxel) {
    const entity = new pc.Entity('Voxel_' + voxel.pos.x + '_' + voxel.pos.y + '_' + voxel.pos.z);
    this.sculpture.addChild(entity);

    entity.addComponent('model', { type: 'box' });
    entity.setLocalScale(this.voxelSize, this.voxelSize, this.voxelSize);

    const worldPos = new pc.Vec3(
        (voxel.pos.x - this.gridSize / 2) * this.voxelSize,
        voxel.pos.y * this.voxelSize,
        (voxel.pos.z - this.gridSize / 2) * this.voxelSize
    );

    entity.setLocalPosition(worldPos);

    if (entity.model && entity.model.meshInstances[0]) {
        entity.model.meshInstances[0].material.diffuse = new pc.Color(0.7, 0.6, 0.5);
        entity.model.meshInstances[0].material.update();
    }

    voxel.entity = entity;
};

Sculpting3D.prototype.onMarkerDetected = function(markerId, pose) {
    if (markerId === this.sculptMarkerID) {
        this.updateSculpture(pose);
    } else if (this.toolMarkerIDs.includes(markerId)) {
        this.selectTool(markerId);
    }
};

Sculpting3D.prototype.updateSculpture = function(pose) {
    this.sculpture.setPosition(pose.position);
};

Sculpting3D.prototype.selectTool = function(markerId) {
    const tool = this.tools[markerId];
    if (tool) {
        this.currentTool = tool;
        console.log('Selected tool:', tool);
    }
};

Sculpting3D.prototype.addVoxelAt = function(x, y, z) {
    const voxel = this.getVoxel(x, y, z);
    if (voxel && !voxel.active) {
        voxel.active = true;
        this.createVoxelEntity(voxel);
        console.log('Added voxel at', x, y, z);
    }
};

Sculpting3D.prototype.removeVoxelAt = function(x, y, z) {
    const voxel = this.getVoxel(x, y, z);
    if (voxel && voxel.active && y > 0) {
        voxel.active = false;
        if (voxel.entity) {
            voxel.entity.destroy();
            voxel.entity = null;
        }
        console.log('Removed voxel at', x, y, z);
    }
};

Sculpting3D.prototype.getVoxel = function(x, y, z) {
    return this.voxels.find(v => v.pos.x === x && v.pos.y === y && v.pos.z === z);
};

Sculpting3D.prototype.getSculptureStats = function() {
    const activeVoxels = this.voxels.filter(v => v.active).length;
    console.log('Sculpture Stats:');
    console.log('Active Voxels:', activeVoxels);
    console.log('Current Tool:', this.currentTool);
};
