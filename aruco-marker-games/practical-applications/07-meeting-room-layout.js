/** Meeting Room Layout - AR conference room planning */
var MeetingRoomLayout = pc.createScript('meetingRoomLayout');

MeetingRoomLayout.attributes.add('furnitureMarkerIDs', {
    type: 'number',
    array: true,
    default: [625, 626, 627, 628],
    description: 'Furniture markers (table, chairs, screen, whiteboard)'
});

MeetingRoomLayout.prototype.initialize = function() {
    this.furniture = {};
    this.capacity = 0;

    this.furnitureTypes = {
        625: { name: 'Table', size: [0.2, 0.05, 0.12], capacity: 0 },
        626: { name: 'Chair', size: [0.05, 0.08, 0.05], capacity: 1 },
        627: { name: 'Screen', size: [0.15, 0.1, 0.02], capacity: 0 },
        628: { name: 'Whiteboard', size: [0.15, 0.1, 0.02], capacity: 0 }
    };
};

MeetingRoomLayout.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.furnitureMarkerIDs.includes(markerId)) {
        this.placeFurniture(markerId, pose);
    }
};

MeetingRoomLayout.prototype.placeFurniture = function(markerId, pose) {
    if (!this.furniture[markerId]) {
        this.createFurniture(markerId);
    }

    this.furniture[markerId].entity.setPosition(pose.position);
    this.updateCapacity();
};

MeetingRoomLayout.prototype.createFurniture = function(markerId) {
    const type = this.furnitureTypes[markerId];

    const furniture = new pc.Entity('Furniture_' + type.name);
    this.entity.addChild(furniture);

    furniture.addComponent('model', { type: 'box' });
    furniture.setLocalScale(type.size[0], type.size[1], type.size[2]);

    this.furniture[markerId] = {
        entity: furniture,
        type: type
    };

    console.log('Placed', type.name);
};

MeetingRoomLayout.prototype.updateCapacity = function() {
    this.capacity = Object.values(this.furniture).reduce((sum, furn) => sum + furn.type.capacity, 0);
    console.log('Room capacity:', this.capacity, 'people');
};
