/**
 * Shell Sort Visualization
 * Algorithm: Generalized insertion sort with gap sequence
 * Game: "Gap Jumper" - Organize platforms making strategic gap-sized jumps
 */

var ShellSort = pc.createScript('shellSort');

ShellSort.attributes.add('arraySize', { type: 'number', default: 16 });
ShellSort.attributes.add('sortSpeed', { type: 'number', default: 0.5 });

ShellSort.prototype.initialize = function() {
    this.array = [];
    this.entities = [];
    this.sorting = false;
    this.timer = 0;
    this.gap = 0;
    this.i = 0;
    this.j = 0;
    this.score = 0;

    this.generateArray();
    this.createVisualization();
};

ShellSort.prototype.generateArray = function() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.floor(Math.random() * 100) + 1);
    }
};

ShellSort.prototype.createVisualization = function() {
    this.entities.forEach(e => e.destroy());
    this.entities = [];

    const spacing = 1.2;
    const startX = -(this.arraySize - 1) * spacing / 2;

    for (let i = 0; i < this.arraySize; i++) {
        const platform = new pc.Entity('Platform_' + i);
        this.entity.addChild(platform);

        const height = this.array[i] / 20;
        platform.setLocalPosition(startX + i * spacing, height, 0);
        platform.addComponent('model', { type: 'box' });
        platform.setLocalScale(1.0, 0.3, 1.0);

        if (platform.model && platform.model.meshInstances[0]) {
            platform.model.meshInstances[0].material.diffuse = new pc.Color(0.7, 0.6, 0.3);
            platform.model.meshInstances[0].material.update();
        }

        platform.value = this.array[i];
        this.entities.push(platform);
    }
};

ShellSort.prototype.startSort = function() {
    this.sorting = true;
    this.gap = Math.floor(this.arraySize / 2);
    this.i = this.gap;
    this.j = this.i;
};

ShellSort.prototype.shellSortStep = function() {
    if (this.gap < 1) {
        this.sorting = false;
        console.log('Shell sort complete! Score:', this.score);
        this.highlightAll(new pc.Color(0.2, 0.9, 0.2));
        return;
    }

    if (this.i < this.arraySize) {
        if (this.j >= this.gap && this.array[this.j - this.gap] > this.array[this.j]) {
            this.swap(this.j, this.j - this.gap);
            this.highlightPair(this.j, this.j - this.gap);
            this.j -= this.gap;
            this.score += 5;
        } else {
            this.i++;
            this.j = this.i;
        }
    } else {
        this.gap = Math.floor(this.gap / 2);
        this.i = this.gap;
        this.j = this.i;
        console.log('Gap reduced to:', this.gap);
        this.score += 20;
    }
};

ShellSort.prototype.swap = function(i, j) {
    const temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;

    const pos1 = this.entities[i].getLocalPosition().clone();
    const pos2 = this.entities[j].getLocalPosition().clone();

    this.entities[i].setLocalPosition(pos2);
    this.entities[j].setLocalPosition(pos1);

    const tempEntity = this.entities[i];
    this.entities[i] = this.entities[j];
    this.entities[j] = tempEntity;
};

ShellSort.prototype.highlightPair = function(i, j) {
    this.entities.forEach((e, index) => {
        if (e.model && e.model.meshInstances[0]) {
            const color = (index === i || index === j) ?
                new pc.Color(1, 0.5, 0) : new pc.Color(0.7, 0.6, 0.3);
            e.model.meshInstances[0].material.diffuse = color;
            e.model.meshInstances[0].material.update();
        }
    });
};

ShellSort.prototype.highlightAll = function(color) {
    this.entities.forEach(e => {
        if (e.model && e.model.meshInstances[0]) {
            e.model.meshInstances[0].material.diffuse = color;
            e.model.meshInstances[0].material.update();
        }
    });
};

ShellSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;
        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.shellSortStep();
        }
    }
};

ShellSort.prototype.reset = function() {
    this.sorting = false;
    this.generateArray();
    this.createVisualization();
    this.score = 0;
};
