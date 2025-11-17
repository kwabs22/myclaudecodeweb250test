/** Building Blocks - AR construction game using markers */
var BuildingBlocks = pc.createScript('buildingBlocks');
BuildingBlocks.attributes.add('blockTypes', { type: 'number', array: true, default: [20, 21, 22, 23, 24] });
BuildingBlocks.prototype.initialize = function() {
    this.blocks = {};
    this.structure = [];
    this.snapDistance = 0.05;
};
BuildingBlocks.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.blockTypes.includes(markerId)) {
        if (!this.blocks[markerId]) {
            this.createBlock(markerId, pose);
        } else {
            this.updateBlock(markerId, pose);
        }
    }
};
BuildingBlocks.prototype.createBlock = function(markerId, pose) {
    const blockType = this.blockTypes.indexOf(markerId);
    const block = new pc.Entity('Block_' + markerId);
    this.entity.addChild(block);
    block.addComponent('model', { type: 'box' });
    block.setLocalScale(0.1, 0.1, 0.1);
    this.blocks[markerId] = block;
};
BuildingBlocks.prototype.updateBlock = function(markerId, pose) {
    const block = this.blocks[markerId];
    const snappedPos = this.findSnapPosition(pose.position);
    block.setPosition(snappedPos);
};
BuildingBlocks.prototype.findSnapPosition = function(pos) {
    for (const block of Object.values(this.blocks)) {
        const dist = block.getPosition().distance(pos);
        if (dist < this.snapDistance) {
            return block.getPosition().clone().add(new pc.Vec3(0, 0.1, 0));
        }
    }
    return pos;
};
