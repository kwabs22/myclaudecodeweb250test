/** Math Problem Solver - Interactive AR math learning with visual aids */
var MathProblemSolver = pc.createScript('mathProblemSolver');

MathProblemSolver.attributes.add('numberMarkerIDs', {
    type: 'number',
    array: true,
    default: [200, 201, 202, 203, 204, 205, 206, 207, 208, 209],
    description: 'Marker IDs for digits 0-9'
});

MathProblemSolver.attributes.add('operatorMarkerIDs', {
    type: 'number',
    array: true,
    default: [210, 211, 212, 213],
    description: 'Marker IDs for operators (+, -, ×, ÷)'
});

MathProblemSolver.prototype.initialize = function() {
    this.numbers = {};
    this.operators = {};
    this.expression = [];
    this.visualObjects = [];
    this.currentProblem = null;
    this.score = 0;
    this.problemsSolved = 0;

    this.operatorSymbols = {
        210: '+',
        211: '-',
        212: '×',
        213: '÷'
    };

    this.generateProblem();
};

MathProblemSolver.prototype.generateProblem = function() {
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let num1, num2, answer;

    switch(operator) {
        case '+':
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 20) + 10;
            num2 = Math.floor(Math.random() * num1);
            answer = num1 - num2;
            break;
        case '×':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 * num2;
            break;
    }

    this.currentProblem = {
        num1: num1,
        num2: num2,
        operator: operator,
        answer: answer,
        userAnswer: null
    };

    console.log('New problem:', num1, operator, num2, '= ?');
    this.spawnProblemVisuals();
};

MathProblemSolver.prototype.spawnProblemVisuals = function() {
    // Clear old visuals
    this.visualObjects.forEach(obj => obj.destroy());
    this.visualObjects = [];

    const prob = this.currentProblem;

    // Create visual representation based on operator
    if (prob.operator === '+') {
        this.createAdditionVisual(prob.num1, prob.num2);
    } else if (prob.operator === '-') {
        this.createSubtractionVisual(prob.num1, prob.num2);
    } else if (prob.operator === '×') {
        this.createMultiplicationVisual(prob.num1, prob.num2);
    }
};

MathProblemSolver.prototype.createAdditionVisual = function(num1, num2) {
    // Create objects for first number
    for (let i = 0; i < num1; i++) {
        const obj = this.createCountingObject(i, 0, new pc.Color(0.2, 0.6, 1));
        this.visualObjects.push(obj);
    }

    // Create objects for second number
    for (let i = 0; i < num2; i++) {
        const obj = this.createCountingObject(i, 1, new pc.Color(1, 0.6, 0.2));
        this.visualObjects.push(obj);
    }
};

MathProblemSolver.prototype.createSubtractionVisual = function(num1, num2) {
    // Create all objects
    for (let i = 0; i < num1; i++) {
        const willRemove = i < num2;
        const color = willRemove ? new pc.Color(1, 0.3, 0.3) : new pc.Color(0.3, 1, 0.3);
        const obj = this.createCountingObject(i, 0, color);
        this.visualObjects.push(obj);
    }
};

MathProblemSolver.prototype.createMultiplicationVisual = function(num1, num2) {
    // Create grid of objects
    for (let row = 0; row < num2; row++) {
        for (let col = 0; col < num1; col++) {
            const x = col * 0.05 - (num1 * 0.025);
            const z = row * 0.05 - (num2 * 0.025);
            const obj = this.createCountingObject(col, row, new pc.Color(0.6, 0.3, 1));
            obj.setLocalPosition(x, 0.02, z);
            this.visualObjects.push(obj);
        }
    }
};

MathProblemSolver.prototype.createCountingObject = function(index, row, color) {
    const obj = new pc.Entity('CountObj_' + index + '_' + row);
    this.entity.addChild(obj);

    obj.addComponent('model', { type: 'sphere' });
    const size = 0.03;
    obj.setLocalScale(size, size, size);

    const x = (index % 10) * 0.05 - 0.225;
    const z = row * 0.06;
    obj.setLocalPosition(x, 0.02, z);

    if (obj.model && obj.model.meshInstances[0]) {
        obj.model.meshInstances[0].material.diffuse = color;
        obj.model.meshInstances[0].material.update();
    }

    return obj;
};

MathProblemSolver.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.numberMarkerIDs.includes(markerId)) {
        this.showNumber(markerId, pose);
    } else if (this.operatorMarkerIDs.includes(markerId)) {
        this.showOperator(markerId, pose);
    }
};

MathProblemSolver.prototype.showNumber = function(markerId, pose) {
    const digit = this.numberMarkerIDs.indexOf(markerId);

    if (!this.numbers[markerId]) {
        const numEntity = this.createNumberVisual(digit);
        this.numbers[markerId] = numEntity;
    }

    this.numbers[markerId].setPosition(pose.position);
};

MathProblemSolver.prototype.createNumberVisual = function(digit) {
    const entity = new pc.Entity('Number_' + digit);
    this.entity.addChild(entity);

    entity.addComponent('model', { type: 'box' });
    entity.setLocalScale(0.05, 0.05, 0.01);

    if (entity.model && entity.model.meshInstances[0]) {
        entity.model.meshInstances[0].material.diffuse = new pc.Color(1, 1, 0.3);
        entity.model.meshInstances[0].material.update();
    }

    entity.digit = digit;
    return entity;
};

MathProblemSolver.prototype.showOperator = function(markerId, pose) {
    const symbol = this.operatorSymbols[markerId];

    if (!this.operators[markerId]) {
        const opEntity = this.createOperatorVisual(symbol);
        this.operators[markerId] = opEntity;
    }

    this.operators[markerId].setPosition(pose.position);
};

MathProblemSolver.prototype.createOperatorVisual = function(symbol) {
    const entity = new pc.Entity('Operator_' + symbol);
    this.entity.addChild(entity);

    entity.addComponent('model', { type: 'box' });
    entity.setLocalScale(0.04, 0.04, 0.01);

    if (entity.model && entity.model.meshInstances[0]) {
        entity.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 1, 0.3);
        entity.model.meshInstances[0].material.update();
    }

    entity.symbol = symbol;
    return entity;
};

MathProblemSolver.prototype.submitAnswer = function(answer) {
    if (!this.currentProblem) return;

    if (answer === this.currentProblem.answer) {
        this.score += 10;
        this.problemsSolved++;
        console.log('Correct! Answer is', answer);
        console.log('Score:', this.score, '- Problems solved:', this.problemsSolved);
        this.showCorrectFeedback();

        setTimeout(() => this.generateProblem(), 2000);
    } else {
        console.log('Incorrect. Try again! (Answer is', this.currentProblem.answer + ')');
        this.showIncorrectFeedback();
    }
};

MathProblemSolver.prototype.showCorrectFeedback = function() {
    // Green flash, success particles
    console.log('✓ Correct!');
};

MathProblemSolver.prototype.showIncorrectFeedback = function() {
    // Red flash, try again message
    console.log('✗ Try again');
};

MathProblemSolver.prototype.getCurrentProblem = function() {
    if (!this.currentProblem) return null;
    return {
        problem: this.currentProblem.num1 + ' ' + this.currentProblem.operator + ' ' + this.currentProblem.num2,
        answer: this.currentProblem.answer
    };
};

MathProblemSolver.prototype.getStats = function() {
    return {
        score: this.score,
        problemsSolved: this.problemsSolved,
        accuracy: this.problemsSolved > 0 ? '100%' : 'N/A'
    };
};
