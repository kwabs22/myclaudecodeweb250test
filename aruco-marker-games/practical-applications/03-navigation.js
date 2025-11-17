/** Navigation - AR wayfinding and route guidance */
var ARNavigation = pc.createScript('arNavigation');

ARNavigation.attributes.add('waypointMarkerIDs', {
    type: 'number',
    array: true,
    default: [607, 608, 609, 610],
    description: 'Waypoint markers for navigation route'
});

ARNavigation.prototype.initialize = function() {
    this.waypoints = {};
    this.route = [];
    this.currentWaypoint = 0;
};

ARNavigation.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.waypointMarkerIDs.includes(markerId)) {
        this.updateWaypoint(markerId, pose);
    }
};

ARNavigation.prototype.updateWaypoint = function(markerId, pose) {
    if (!this.waypoints[markerId]) {
        this.createWaypoint(markerId);
    }

    this.waypoints[markerId].entity.setPosition(pose.position);
    this.waypoints[markerId].position = pose.position.clone();

    this.buildRoute();
};

ARNavigation.prototype.createWaypoint = function(markerId) {
    const waypoint = new pc.Entity('Waypoint_' + markerId);
    this.entity.addChild(waypoint);

    waypoint.addComponent('model', { type: 'cone' });
    waypoint.setLocalScale(0.05, 0.1, 0.05);
    waypoint.setLocalEulerAngles(180, 0, 0);

    const waypointIndex = this.waypointMarkerIDs.indexOf(markerId);
    const color = waypointIndex === 0 ? new pc.Color(0.3, 1, 0.3) : new pc.Color(0.3, 0.6, 1);

    if (waypoint.model && waypoint.model.meshInstances[0]) {
        waypoint.model.meshInstances[0].material.diffuse = color;
        waypoint.model.meshInstances[0].material.emissive = color.clone().mulScalar(0.5);
        waypoint.model.meshInstances[0].material.update();
    }

    this.waypoints[markerId] = {
        entity: waypoint,
        position: new pc.Vec3(),
        index: waypointIndex
    };
};

ARNavigation.prototype.buildRoute = function() {
    this.route = Object.values(this.waypoints).sort((a, b) => a.index - b.index);

    if (this.route.length > 1) {
        const totalDistance = this.calculateTotalDistance();
        console.log('Route built:', this.route.length, 'waypoints');
        console.log('Total distance:', totalDistance.toFixed(2), 'm');
    }
};

ARNavigation.prototype.calculateTotalDistance = function() {
    let total = 0;

    for (let i = 0; i < this.route.length - 1; i++) {
        total += this.route[i].position.distance(this.route[i + 1].position);
    }

    return total;
};

ARNavigation.prototype.getNextWaypoint = function() {
    if (this.currentWaypoint < this.route.length) {
        const waypoint = this.route[this.currentWaypoint];
        console.log('Next waypoint:', waypoint.index);
        return waypoint;
    }

    console.log('Route complete!');
    return null;
};
