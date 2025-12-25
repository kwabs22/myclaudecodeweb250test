/**
 * Quick Sort Visualization
 * Algorithm: Pick pivot, partition around it, recursively sort partitions
 * Game: "Pivot Master" - Select best pivots to defeat enemies efficiently
 */

var QuickSort = pc.createScript('quickSort');

QuickSort.attributes.add('arraySize', { type: 'number', default: 12, description: 'Number of elements' });
QuickSort.attributes.add('sortSpeed', { type: 'number', default: 0.8, description: 'Seconds between steps' });
QuickSort.attributes.add('spacing', { type: 'number', default: 1.2, description: 'Space between elements' });

QuickSort.prototype.initialize = function() {
    this.array = [];
    this.entities = [];
    this.stack = []; // For iterative quick sort
    this.sorting = false;
    this.timer = 0;
    this.pivotIndex = -1;
    this.score = 0;
    this.comparisons = 0;

    this.generateArray();
    this.createVisualization();
};

QuickSort.prototype.generateArray = function() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.floor(Math.random() * 100) + 1);
    }
};

QuickSort.prototype.createVisualization = function() {
    this.entities.forEach(e => e.destroy());
    this.entities = [];

    const container = new pc.Entity('SortContainer');
    this.entity.addChild(container);

    const startX = -(this.arraySize - 1) * this.spacing / 2;

    for (let i = 0; i < this.arraySize; i++) {
        const bar = new pc.Entity('Bar_' + i);
        container.addChild(bar);

        bar.setLocalPosition(startX + i * this.spacing, this.array[i] / 20, 0);
        bar.addComponent('model', { type: 'box' });
        bar.setLocalScale(0.8, this.array[i] / 10, 0.8);

        if (bar.model && bar.model.meshInstances[0]) {
            bar.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.6, 0.8);
            bar.model.meshInstances[0].material.update();
        }

        bar.value = this.array[i];
        bar.index = i;
        this.entities.push(bar);
    }
};

QuickSort.prototype.startSort = function() {
    this.sorting = true;
    this.stack = [[0, this.arraySize - 1]];
    this.comparisons = 0;
};

QuickSort.prototype.quickSortStep = function() {
    if (this.stack.length === 0) {
        this.sorting = false;
        console.log('Sort complete! Comparisons:', this.comparisons);
        return;
    }

    const [low, high] = this.stack.pop();
    if (low >= high) return;

    const pivotIdx = this.partition(low, high);

    // Add sub-arrays to stack
    if (pivotIdx - 1 > low) this.stack.push([low, pivotIdx - 1]);
    if (pivotIdx + 1 < high) this.stack.push([pivotIdx + 1, high]);
};

QuickSort.prototype.partition = function(low, high) {
    const pivot = this.array[high];
    this.highlightPivot(high);

    let i = low - 1;

    for (let j = low; j < high; j++) {
        this.comparisons++;
        if (this.array[j] < pivot) {
            i++;
            this.swap(i, j);
        }
    }

    this.swap(i + 1, high);
    return i + 1;
};

QuickSort.prototype.swap = function(i, j) {
    if (i === j) return;

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

    this.score += 5;
};

QuickSort.prototype.highlightPivot = function(index) {
    this.entities.forEach((e, i) => {
        if (e.model && e.model.meshInstances[0]) {
            const color = i === index ? new pc.Color(1, 0.5, 0) : new pc.Color(0.3, 0.6, 0.8);
            e.model.meshInstances[0].material.diffuse = color;
            e.model.meshInstances[0].material.update();
        }
    });
};

QuickSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;
        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.quickSortStep();
        }
    }
};

QuickSort.prototype.reset = function() {
    this.sorting = false;
    this.generateArray();
    this.createVisualization();
    this.score = 0;
    this.comparisons = 0;
};
