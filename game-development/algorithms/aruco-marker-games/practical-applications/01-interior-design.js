/** Interior Design - Place and arrange furniture in AR */
var InteriorDesign = pc.createScript('interiorDesign');

InteriorDesign.attributes.add('furnitureMarkerIDs', {
    type: 'number',
    array: true,
    default: [600, 601, 602, 603, 604],
    description: 'Furniture markers (sofa, table, chair, lamp, shelf)'
});

InteriorDesign.prototype.initialize = function() {
    this.furniture = {};

    this.furnitureTypes = {
        600: { name: 'Sofa', size: [0.15, 0.06, 0.08], color: new pc.Color(0.6, 0.4, 0.3) },
        601: { name: 'Table', size: [0.12, 0.05, 0.12], color: new pc.Color(0.5, 0.35, 0.2) },
        602: { name: 'Chair', size: [0.05, 0.08, 0.05], color: new pc.Color(0.7, 0.5, 0.3) },
        603: { name: 'Lamp', size: [0.03, 0.12, 0.03], color: new pc.Color(1, 0.9, 0.6) },
        604: { name: 'Shelf', size: [0.15, 0.1, 0.04], color: new pc.Color(0.4, 0.3, 0.2) }
    };
};

InteriorDesign.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.furnitureMarkerIDs.includes(markerId)) {
        this.updateFurniture(markerId, pose);
    }
};

InteriorDesign.prototype.updateFurniture = function(markerId, pose) {
    if (!this.furniture[markerId]) {
        this.createFurniture(markerId);
    }

    this.furniture[markerId].entity.setPosition(pose.position);
    this.furniture[markerId].entity.setRotation(pose.rotation);
};

InteriorDesign.prototype.createFurniture = function(markerId) {
    const furnitureType = this.furnitureTypes[markerId];

    const furniture = new pc.Entity('Furniture_' + furnitureType.name);
    this.entity.addChild(furniture);

    furniture.addComponent('model', { type: 'box' });
    furniture.setLocalScale(furnitureType.size[0], furnitureType.size[1], furnitureType.size[2]);

    if (furniture.model && furniture.model.meshInstances[0]) {
        furniture.model.meshInstances[0].material.diffuse = furnitureType.color;
        furniture.model.meshInstances[0].material.update();
    }

    this.furniture[markerId] = {
        entity: furniture,
        type: furnitureType
    };

    console.log('Placed', furnitureType.name);
};

InteriorDesign.prototype.saveLayout = function() {
    const layout = Object.entries(this.furniture).map(([id, furn]) => ({
        type: furn.type.name,
        position: furn.entity.getPosition(),
        rotation: furn.entity.getRotation()
    }));

    console.log('Layout saved:', layout.length, 'items');
    return layout;
};
