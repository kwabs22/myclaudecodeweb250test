/**
 * Fibonacci Sequence with Memoization
 * Algorithm: F(n) = F(n-1) + F(n-2) with caching
 * Game: "Rabbit Population" - Manage rabbit breeding following Fibonacci growth
 */

var Fibonacci = pc.createScript('fibonacci');

Fibonacci.attributes.add('maxN', { type: 'number', default: 15 });
Fibonacci.attributes.add('calculateSpeed', { type: 'number', default: 0.5 });

Fibonacci.prototype.initialize = function() {
    this.memo = {};
    this.currentN = 0;
    this.calculating = false;
    this.timer = 0;
    this.rabbits = [];
    this.score = 0;

    this.createVisualization();
};

Fibonacci.prototype.fib = function(n) {
    if (n <= 1) return n;
    if (this.memo[n]) return this.memo[n];

    this.memo[n] = this.fib(n - 1) + this.fib(n - 2);
    return this.memo[n];
};

Fibonacci.prototype.startCalculation = function() {
    this.calculating = true;
    this.currentN = 0;
    this.memo = {};
};

Fibonacci.prototype.calculateStep = function() {
    if (this.currentN > this.maxN) {
        this.calculating = false;
        console.log('Fibonacci complete! Final value:', this.fib(this.maxN));
        return;
    }

    const value = this.fib(this.currentN);
    console.log('F(' + this.currentN + ') =', value);
    this.visualizeRabbits(this.currentN, value);
    this.currentN++;
    this.score += 10;
};

Fibonacci.prototype.createVisualization = function() {
    // Creates rabbit population visualization
};

Fibonacci.prototype.visualizeRabbits = function(generation, count) {
    // Visual representation of rabbit population
    const spacing = 0.5;
    const maxDisplay = Math.min(count, 50);

    for (let i = 0; i < maxDisplay; i++) {
        const rabbit = new pc.Entity('Rabbit_' + generation + '_' + i);
        this.entity.addChild(rabbit);

        const x = (i % 10) * spacing - 2;
        const z = generation * 1.5 - this.maxN * 0.75;
        const y = Math.floor(i / 10) * spacing;

        rabbit.setLocalPosition(x, y, z);
        rabbit.addComponent('model', { type: 'sphere' });
        rabbit.setLocalScale(0.3, 0.3, 0.3);

        if (rabbit.model && rabbit.model.meshInstances[0]) {
            rabbit.model.meshInstances[0].material.diffuse = new pc.Color(0.8, 0.6, 0.4);
            rabbit.model.meshInstances[0].material.update();
        }

        this.rabbits.push(rabbit);
    }
};

Fibonacci.prototype.update = function(dt) {
    if (this.calculating) {
        this.timer += dt;
        if (this.timer >= this.calculateSpeed) {
            this.timer = 0;
            this.calculateStep();
        }
    }
};

Fibonacci.prototype.reset = function() {
    this.rabbits.forEach(r => r.destroy());
    this.rabbits = [];
    this.calculating = false;
    this.currentN = 0;
    this.memo = {};
    this.score = 0;
};
