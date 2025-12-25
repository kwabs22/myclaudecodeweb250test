/** Fitness Tracker - AR workout tracking and form monitoring */
var FitnessTracker = pc.createScript('fitnessTracker');

FitnessTracker.attributes.add('bodyMarkerIDs', {
    type: 'number',
    array: true,
    default: [611, 612, 613, 614],
    description: 'Body tracking markers (head, hands, feet)'
});

FitnessTracker.prototype.initialize = function() {
    this.bodyPoints = {};
    this.reps = 0;
    this.sets = 0;
    this.calories = 0;
    this.workoutTime = 0;
    this.lastHeight = 0;
};

FitnessTracker.prototype.update = function(dt) {
    this.workoutTime += dt;
    this.detectExercise();
};

FitnessTracker.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.bodyMarkerIDs.includes(markerId)) {
        this.updateBodyPoint(markerId, pose);
    }
};

FitnessTracker.prototype.updateBodyPoint = function(markerId, pose) {
    if (!this.bodyPoints[markerId]) {
        this.createBodyPoint(markerId);
    }

    this.bodyPoints[markerId].entity.setPosition(pose.position);
    this.bodyPoints[markerId].position = pose.position.clone();
};

FitnessTracker.prototype.createBodyPoint = function(markerId) {
    const point = new pc.Entity('BodyPoint_' + markerId);
    this.entity.addChild(point);

    point.addComponent('model', { type: 'sphere' });
    point.setLocalScale(0.03, 0.03, 0.03);

    this.bodyPoints[markerId] = {
        entity: point,
        position: new pc.Vec3()
    };
};

FitnessTracker.prototype.detectExercise = function() {
    if (Object.keys(this.bodyPoints).length < 2) return;

    const handPoint = this.bodyPoints[612];
    if (!handPoint) return;

    const currentHeight = handPoint.position.y;

    // Detect squat or similar vertical movement
    if (this.lastHeight > 0) {
        const movement = currentHeight - this.lastHeight;

        if (movement > 0.1) {
            this.reps++;
            this.calories += 5;
            console.log('Rep completed! Total:', this.reps);
        }
    }

    this.lastHeight = currentHeight;
};

FitnessTracker.prototype.getStats = function() {
    console.log('Workout Stats:');
    console.log('Time:', Math.floor(this.workoutTime), 'seconds');
    console.log('Reps:', this.reps);
    console.log('Sets:', this.sets);
    console.log('Calories:', this.calories);
};
