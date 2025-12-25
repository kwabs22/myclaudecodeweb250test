/** Measurement Tool - AR measuring and dimensioning */
var MeasurementTool = pc.createScript('measurementTool');

MeasurementTool.attributes.add('pointMarkerIDs', {
    type: 'number',
    array: true,
    default: [605, 606],
    description: 'Measurement point markers'
});

MeasurementTool.prototype.initialize = function() {
    this.points = {};
    this.measurements = [];
};

MeasurementTool.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.pointMarkerIDs.includes(markerId)) {
        this.updatePoint(markerId, pose);
        this.calculateDistance();
    }
};

MeasurementTool.prototype.updatePoint = function(markerId, pose) {
    if (!this.points[markerId]) {
        this.createPoint(markerId);
    }

    this.points[markerId].entity.setPosition(pose.position);
    this.points[markerId].position = pose.position.clone();
};

MeasurementTool.prototype.createPoint = function(markerId) {
    const point = new pc.Entity('Point_' + markerId);
    this.entity.addChild(point);

    point.addComponent('model', { type: 'sphere' });
    point.setLocalScale(0.02, 0.02, 0.02);

    this.points[markerId] = {
        entity: point,
        position: new pc.Vec3()
    };
};

MeasurementTool.prototype.calculateDistance = function() {
    if (Object.keys(this.points).length < 2) return;

    const pointArray = Object.values(this.points);
    const distance = pointArray[0].position.distance(pointArray[1].position);

    console.log('Distance:', (distance * 100).toFixed(2), 'cm');
};
