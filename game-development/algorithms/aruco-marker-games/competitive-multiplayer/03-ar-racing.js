/** AR Racing - Race through checkpoints with physical markers */
var ARRacing = pc.createScript('arRacing');

ARRacing.attributes.add('racerMarkerIDs', {
    type: 'number',
    array: true,
    default: [420, 421, 422, 423],
    description: 'Marker IDs for racers'
});

ARRacing.attributes.add('checkpointMarkerIDs', {
    type: 'number',
    array: true,
    default: [424, 425, 426, 427, 428],
    description: 'Marker IDs for checkpoints'
});

ARRacing.prototype.initialize = function() {
    this.racers = {};
    this.checkpoints = {};
    this.raceActive = false;
    this.startTime = 0;
    this.finishTimes = {};
    this.lapTimes = {};

    this.racerMarkerIDs.forEach(id => {
        this.lapTimes[id] = [];
    });
};

ARRacing.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.racerMarkerIDs.includes(markerId)) {
        this.updateRacer(markerId, pose);
    } else if (this.checkpointMarkerIDs.includes(markerId)) {
        this.updateCheckpoint(markerId, pose);
    }
};

ARRacing.prototype.updateRacer = function(markerId, pose) {
    if (!this.racers[markerId]) {
        this.createRacer(markerId);
    }

    this.racers[markerId].entity.setPosition(pose.position);
    this.racers[markerId].position = pose.position.clone();

    if (this.raceActive) {
        this.checkCheckpoints(markerId);
    }
};

ARRacing.prototype.createRacer = function(markerId) {
    const racer = new pc.Entity('Racer_' + markerId);
    this.entity.addChild(racer);

    racer.addComponent('model', { type: 'capsule' });
    racer.setLocalScale(0.04, 0.06, 0.04);
    racer.setLocalEulerAngles(0, 0, 90);

    const colors = [
        new pc.Color(1, 0.2, 0.2),
        new pc.Color(0.2, 0.2, 1),
        new pc.Color(0.2, 1, 0.2),
        new pc.Color(1, 1, 0.2)
    ];

    const colorIndex = this.racerMarkerIDs.indexOf(markerId);

    if (racer.model && racer.model.meshInstances[0]) {
        racer.model.meshInstances[0].material.diffuse = colors[colorIndex];
        racer.model.meshInstances[0].material.update();
    }

    this.racers[markerId] = {
        entity: racer,
        position: new pc.Vec3(),
        currentCheckpoint: 0,
        laps: 0
    };
};

ARRacing.prototype.updateCheckpoint = function(markerId, pose) {
    if (!this.checkpoints[markerId]) {
        this.createCheckpoint(markerId);
    }

    this.checkpoints[markerId].entity.setPosition(pose.position);
    this.checkpoints[markerId].position = pose.position.clone();
};

ARRacing.prototype.createCheckpoint = function(markerId) {
    const checkpoint = new pc.Entity('Checkpoint_' + markerId);
    this.entity.addChild(checkpoint);

    checkpoint.addComponent('model', { type: 'torus' });
    checkpoint.setLocalScale(0.1, 0.1, 0.02);
    checkpoint.setLocalEulerAngles(90, 0, 0);

    const checkpointIndex = this.checkpointMarkerIDs.indexOf(markerId);
    const isFinish = checkpointIndex === 0;

    const color = isFinish ? new pc.Color(1, 1, 1) : new pc.Color(1, 0.8, 0);

    if (checkpoint.model && checkpoint.model.meshInstances[0]) {
        checkpoint.model.meshInstances[0].material.diffuse = color;
        checkpoint.model.meshInstances[0].material.emissive = color.clone().mulScalar(0.5);
        checkpoint.model.meshInstances[0].material.update();
    }

    this.checkpoints[markerId] = {
        entity: checkpoint,
        position: new pc.Vec3(),
        index: checkpointIndex,
        radius: 0.1
    };
};

ARRacing.prototype.checkCheckpoints = function(racerId) {
    const racer = this.racers[racerId];
    const nextCheckpointIndex = racer.currentCheckpoint % this.checkpointMarkerIDs.length;
    const nextCheckpointId = this.checkpointMarkerIDs[nextCheckpointIndex];
    const checkpoint = this.checkpoints[nextCheckpointId];

    if (!checkpoint) return;

    const distance = racer.position.distance(checkpoint.position);

    if (distance < checkpoint.radius) {
        racer.currentCheckpoint++;
        console.log('Racer', racerId, 'passed checkpoint', nextCheckpointIndex + 1);

        // Check if completed lap
        if (racer.currentCheckpoint % this.checkpointMarkerIDs.length === 0) {
            racer.laps++;
            const lapTime = (Date.now() - this.startTime) / 1000;
            this.lapTimes[racerId].push(lapTime);
            console.log('Racer', racerId, 'completed lap', racer.laps, 'in', lapTime.toFixed(2) + 's');

            // Check if race finished (e.g., 3 laps)
            if (racer.laps >= 3 && !this.finishTimes[racerId]) {
                this.finishRacer(racerId);
            }
        }
    }
};

ARRacing.prototype.finishRacer = function(racerId) {
    const finishTime = (Date.now() - this.startTime) / 1000;
    this.finishTimes[racerId] = finishTime;

    const position = Object.keys(this.finishTimes).length;

    console.log('═══════════════════════════════════');
    console.log('Racer', racerId, 'FINISHED in position', position + '!');
    console.log('Total time:', finishTime.toFixed(2) + 's');
    console.log('Lap times:', this.lapTimes[racerId].map(t => t.toFixed(2) + 's').join(', '));
    console.log('═══════════════════════════════════');

    // Check if all racers finished
    if (Object.keys(this.finishTimes).length === Object.keys(this.racers).length) {
        this.endRace();
    }
};

ARRacing.prototype.startRace = function() {
    this.raceActive = true;
    this.startTime = Date.now();
    this.finishTimes = {};

    Object.values(this.racers).forEach(racer => {
        racer.currentCheckpoint = 0;
        racer.laps = 0;
    });

    console.log('🏁 Race Started! Complete 3 laps.');
};

ARRacing.prototype.endRace = function() {
    this.raceActive = false;

    const results = Object.entries(this.finishTimes).sort((a, b) => a[1] - b[1]);

    console.log('🏁 Race Results:');
    console.log('═══════════════════════════════════');

    results.forEach(([racerId, time], index) => {
        const medals = ['🥇', '🥈', '🥉'];
        const medal = medals[index] || (index + 1) + '.';
        console.log(medal, 'Racer', racerId, '-', time.toFixed(2) + 's');
    });

    console.log('═══════════════════════════════════');
};

ARRacing.prototype.resetRace = function() {
    this.raceActive = false;
    this.finishTimes = {};

    Object.values(this.racers).forEach(racer => {
        racer.currentCheckpoint = 0;
        racer.laps = 0;
    });

    this.racerMarkerIDs.forEach(id => {
        this.lapTimes[id] = [];
    });
};
