/** Training Simulator - AR hands-on training scenarios */
var TrainingSimulator = pc.createScript('trainingSimulator');

TrainingSimulator.attributes.add('toolMarkerIDs', {
    type: 'number',
    array: true,
    default: [632, 633, 634],
    description: 'Training tool markers'
});

TrainingSimulator.attributes.add('taskMarkerID', {
    type: 'number',
    default: 635,
    description: 'Task objective marker'
});

TrainingSimulator.prototype.initialize = function() {
    this.tools = {};
    this.task = null;
    this.steps = [];
    this.currentStep = 0;
    this.score = 0;

    this.trainingSteps = [
        { description: 'Pick up tool 1', tool: 632, completed: false },
        { description: 'Use tool 1 on task', tool: 632, completed: false },
        { description: 'Pick up tool 2', tool: 633, completed: false },
        { description: 'Complete assembly', tool: 633, completed: false }
    ];
};

TrainingSimulator.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.toolMarkerIDs.includes(markerId)) {
        this.updateTool(markerId, pose);
    } else if (markerId === this.taskMarkerID) {
        this.updateTask(pose);
    }
};

TrainingSimulator.prototype.updateTool = function(markerId, pose) {
    if (!this.tools[markerId]) {
        this.createTool(markerId);
    }

    this.tools[markerId].entity.setPosition(pose.position);
    this.checkStepCompletion(markerId);
};

TrainingSimulator.prototype.createTool = function(markerId) {
    const tool = new pc.Entity('Tool_' + markerId);
    this.entity.addChild(tool);

    tool.addComponent('model', { type: 'box' });
    tool.setLocalScale(0.05, 0.1, 0.02);

    this.tools[markerId] = {
        entity: tool
    };
};

TrainingSimulator.prototype.updateTask = function(pose) {
    if (!this.task) {
        this.task = new pc.Entity('Task');
        this.entity.addChild(this.task);
        this.task.addComponent('model', { type: 'box' });
        this.task.setLocalScale(0.1, 0.1, 0.1);
    }

    this.task.setPosition(pose.position);
};

TrainingSimulator.prototype.checkStepCompletion = function(toolId) {
    const currentStep = this.trainingSteps[this.currentStep];

    if (currentStep && currentStep.tool === toolId && !currentStep.completed) {
        currentStep.completed = true;
        this.score += 25;
        this.currentStep++;

        console.log('Step completed:', currentStep.description);
        console.log('Score:', this.score);

        if (this.currentStep >= this.trainingSteps.length) {
            console.log('Training complete! Final score:', this.score);
        } else {
            console.log('Next step:', this.trainingSteps[this.currentStep].description);
        }
    }
};
