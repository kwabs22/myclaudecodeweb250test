/** Programming Basics - AR visual programming and coding concepts */
var ProgrammingBasics = pc.createScript('programmingBasics');

ProgrammingBasics.attributes.add('commandMarkerIDs', {
    type: 'number',
    array: true,
    default: [310, 311, 312, 313, 314, 315, 316, 317],
    description: 'Marker IDs for programming commands'
});

ProgrammingBasics.attributes.add('robotMarkerID', {
    type: 'number',
    default: 318,
    description: 'Marker ID for robot/character to program'
});

ProgrammingBasics.prototype.initialize = function() {
    this.commands = {};
    this.program = [];
    this.robot = null;
    this.executing = false;
    this.executionIndex = 0;
    this.gridSize = 5;
    this.robotPos = { x: 0, y: 0 };
    this.grid = null;

    this.commandTypes = {
        310: { name: 'Move Forward', icon: '↑', action: 'forward', color: new pc.Color(0.3, 0.7, 1) },
        311: { name: 'Turn Left', icon: '↺', action: 'turnLeft', color: new pc.Color(1, 0.7, 0.3) },
        312: { name: 'Turn Right', icon: '↻', action: 'turnRight', color: new pc.Color(1, 0.3, 0.7) },
        313: { name: 'Loop 3x', icon: '⟲', action: 'loop3', color: new pc.Color(0.7, 0.3, 1) },
        314: { name: 'If/Then', icon: '?', action: 'if', color: new pc.Color(0.3, 1, 0.7) },
        315: { name: 'Function A', icon: 'A', action: 'functionA', color: new pc.Color(1, 1, 0.3) },
        316: { name: 'Pick Up', icon: '⬆', action: 'pickup', color: new pc.Color(0.6, 1, 0.3) },
        317: { name: 'Put Down', icon: '⬇', action: 'putdown', color: new pc.Color(1, 0.6, 0.3) }
    };

    this.robotDirection = 0; // 0=North, 1=East, 2=South, 3=West
    this.robotInventory = [];

    this.createGrid();
};

ProgrammingBasics.prototype.createGrid = function() {
    this.grid = new pc.Entity('ProgrammingGrid');
    this.entity.addChild(this.grid);

    const cellSize = 0.1;

    for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
            const cell = new pc.Entity('Cell_' + x + '_' + y);
            this.grid.addChild(cell);

            cell.addComponent('model', { type: 'box' });
            cell.setLocalScale(cellSize * 0.9, 0.01, cellSize * 0.9);

            const worldX = (x - this.gridSize / 2) * cellSize;
            const worldZ = (y - this.gridSize / 2) * cellSize;
            cell.setLocalPosition(worldX, 0, worldZ);

            const isLight = (x + y) % 2 === 0;
            const color = isLight ? new pc.Color(0.8, 0.8, 0.8) : new pc.Color(0.6, 0.6, 0.6);

            if (cell.model && cell.model.meshInstances[0]) {
                cell.model.meshInstances[0].material.diffuse = color;
                cell.model.meshInstances[0].material.update();
            }
        }
    }
};

ProgrammingBasics.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.commandMarkerIDs.includes(markerId)) {
        this.showCommand(markerId, pose);
    } else if (markerId === this.robotMarkerID) {
        this.showRobot(pose);
    }
};

ProgrammingBasics.prototype.showCommand = function(markerId, pose) {
    const commandData = this.commandTypes[markerId];
    if (!commandData) return;

    if (!this.commands[markerId]) {
        this.createCommandBlock(markerId, commandData);
    }

    this.commands[markerId].entity.setPosition(pose.position);
};

ProgrammingBasics.prototype.createCommandBlock = function(markerId, data) {
    const block = new pc.Entity('Command_' + data.name.replace(/\s+/g, '_'));
    this.entity.addChild(block);

    block.addComponent('model', { type: 'box' });
    block.setLocalScale(0.06, 0.06, 0.02);

    if (block.model && block.model.meshInstances[0]) {
        block.model.meshInstances[0].material.diffuse = data.color;
        block.model.meshInstances[0].material.update();
    }

    this.commands[markerId] = {
        entity: block,
        data: data
    };

    console.log('Command:', data.name, data.icon);
};

ProgrammingBasics.prototype.showRobot = function(pose) {
    if (!this.robot) {
        this.createRobot();
    }

    // Update robot visual position (but keep grid position separate)
    if (this.grid) {
        this.robot.setPosition(this.grid.getPosition().clone().add(new pc.Vec3(0, 0.05, 0)));
    } else {
        this.robot.setPosition(pose.position);
    }
};

ProgrammingBasics.prototype.createRobot = function() {
    this.robot = new pc.Entity('Robot');
    this.entity.addChild(this.robot);

    // Robot body
    const body = new pc.Entity('Body');
    this.robot.addChild(body);
    body.addComponent('model', { type: 'box' });
    body.setLocalScale(0.05, 0.05, 0.05);

    // Robot head
    const head = new pc.Entity('Head');
    this.robot.addChild(head);
    head.addComponent('model', { type: 'sphere' });
    head.setLocalScale(0.03, 0.03, 0.03);
    head.setLocalPosition(0, 0.04, 0);

    // Direction indicator
    const arrow = new pc.Entity('Arrow');
    this.robot.addChild(arrow);
    arrow.addComponent('model', { type: 'cone' });
    arrow.setLocalScale(0.02, 0.03, 0.02);
    arrow.setLocalPosition(0, 0.06, 0.03);
    arrow.setLocalEulerAngles(-90, 0, 0);

    if (body.model && body.model.meshInstances[0]) {
        body.model.meshInstances[0].material.diffuse = new pc.Color(0.2, 0.6, 1);
        body.model.meshInstances[0].material.update();
    }

    if (head.model && head.model.meshInstances[0]) {
        head.model.meshInstances[0].material.diffuse = new pc.Color(1, 1, 0.3);
        head.model.meshInstances[0].material.update();
    }

    if (arrow.model && arrow.model.meshInstances[0]) {
        arrow.model.meshInstances[0].material.diffuse = new pc.Color(1, 0.3, 0.3);
        arrow.model.meshInstances[0].material.update();
    }

    this.updateRobotGridPosition();
};

ProgrammingBasics.prototype.addCommandToProgram = function(commandMarkerId) {
    const command = this.commands[commandMarkerId];
    if (!command) return;

    this.program.push(command.data);
    console.log('Added to program:', command.data.name);
    console.log('Program length:', this.program.length);
    this.displayProgram();
};

ProgrammingBasics.prototype.displayProgram = function() {
    console.log('Current Program:');
    console.log('═══════════════════════════════');

    this.program.forEach((cmd, index) => {
        console.log((index + 1) + '.', cmd.icon, cmd.name);
    });

    console.log('═══════════════════════════════');
};

ProgrammingBasics.prototype.executeProgram = function() {
    if (this.program.length === 0) {
        console.log('No commands in program!');
        return;
    }

    this.executing = true;
    this.executionIndex = 0;

    console.log('▶ Executing program...');
    this.executeNextCommand();
};

ProgrammingBasics.prototype.executeNextCommand = function() {
    if (this.executionIndex >= this.program.length) {
        this.executing = false;
        console.log('✓ Program complete!');
        return;
    }

    const command = this.program[this.executionIndex];
    console.log('Executing:', command.name);

    this.performAction(command.action);

    this.executionIndex++;

    // Continue after delay
    setTimeout(() => {
        if (this.executing) {
            this.executeNextCommand();
        }
    }, 500);
};

ProgrammingBasics.prototype.performAction = function(action) {
    switch(action) {
        case 'forward':
            this.moveRobotForward();
            break;
        case 'turnLeft':
            this.turnRobotLeft();
            break;
        case 'turnRight':
            this.turnRobotRight();
            break;
        case 'loop3':
            // Execute next 3 commands 3 times (simplified)
            console.log('Loop started');
            break;
        case 'pickup':
            this.robotPickup();
            break;
        case 'putdown':
            this.robotPutdown();
            break;
        case 'if':
            console.log('Conditional check');
            break;
        case 'functionA':
            console.log('Function A called');
            break;
    }
};

ProgrammingBasics.prototype.moveRobotForward = function() {
    const directions = [
        { x: 0, y: -1 }, // North
        { x: 1, y: 0 },  // East
        { x: 0, y: 1 },  // South
        { x: -1, y: 0 }  // West
    ];

    const dir = directions[this.robotDirection];
    const newX = this.robotPos.x + dir.x;
    const newY = this.robotPos.y + dir.y;

    // Check bounds
    if (newX >= 0 && newX < this.gridSize && newY >= 0 && newY < this.gridSize) {
        this.robotPos.x = newX;
        this.robotPos.y = newY;
        this.updateRobotGridPosition();
        console.log('Moved to', this.robotPos.x + ',', this.robotPos.y);
    } else {
        console.log('Cannot move - out of bounds!');
    }
};

ProgrammingBasics.prototype.turnRobotLeft = function() {
    this.robotDirection = (this.robotDirection + 3) % 4; // -1 mod 4
    this.updateRobotRotation();
    console.log('Turned left');
};

ProgrammingBasics.prototype.turnRobotRight = function() {
    this.robotDirection = (this.robotDirection + 1) % 4;
    this.updateRobotRotation();
    console.log('Turned right');
};

ProgrammingBasics.prototype.updateRobotGridPosition = function() {
    if (!this.robot || !this.grid) return;

    const cellSize = 0.1;
    const x = (this.robotPos.x - this.gridSize / 2) * cellSize;
    const z = (this.robotPos.y - this.gridSize / 2) * cellSize;

    const gridPos = this.grid.getPosition();
    this.robot.setPosition(gridPos.x + x, gridPos.y + 0.05, gridPos.z + z);
};

ProgrammingBasics.prototype.updateRobotRotation = function() {
    if (!this.robot) return;

    const angles = [0, 90, 180, 270];
    this.robot.setLocalEulerAngles(0, angles[this.robotDirection], 0);
};

ProgrammingBasics.prototype.robotPickup = function() {
    this.robotInventory.push('item');
    console.log('Picked up item. Inventory:', this.robotInventory.length);
};

ProgrammingBasics.prototype.robotPutdown = function() {
    if (this.robotInventory.length > 0) {
        this.robotInventory.pop();
        console.log('Put down item. Inventory:', this.robotInventory.length);
    } else {
        console.log('Nothing to put down!');
    }
};

ProgrammingBasics.prototype.clearProgram = function() {
    this.program = [];
    this.executionIndex = 0;
    this.executing = false;
    console.log('Program cleared');
};

ProgrammingBasics.prototype.resetRobot = function() {
    this.robotPos = { x: 0, y: 0 };
    this.robotDirection = 0;
    this.robotInventory = [];
    this.updateRobotGridPosition();
    this.updateRobotRotation();
    console.log('Robot reset');
};

ProgrammingBasics.prototype.createChallenge = function(challengeId) {
    const challenges = {
        1: {
            name: 'Move to Target',
            description: 'Move robot to position (2, 2)',
            target: { x: 2, y: 2 },
            maxCommands: 5
        },
        2: {
            name: 'Collect Items',
            description: 'Pick up 3 items',
            requiredPickups: 3,
            maxCommands: 10
        },
        3: {
            name: 'Navigate Maze',
            description: 'Reach the goal without hitting walls',
            target: { x: 4, y: 4 },
            maxCommands: 15
        }
    };

    const challenge = challenges[challengeId];
    if (challenge) {
        console.log('Challenge:', challenge.name);
        console.log(challenge.description);
        console.log('Max commands:', challenge.maxCommands);
    }

    return challenge;
};

ProgrammingBasics.prototype.checkChallenge = function(challenge) {
    if (challenge.target) {
        const success = this.robotPos.x === challenge.target.x && this.robotPos.y === challenge.target.y;
        console.log(success ? '✓ Challenge completed!' : '✗ Challenge not completed');
        return success;
    }

    if (challenge.requiredPickups) {
        const success = this.robotInventory.length >= challenge.requiredPickups;
        console.log(success ? '✓ Challenge completed!' : '✗ Need more items');
        return success;
    }

    return false;
};
