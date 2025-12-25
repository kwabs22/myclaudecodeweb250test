/**
 * Heap Sort Visualization
 * Algorithm: Build max heap, repeatedly extract maximum element
 * Game: "Priority Rescue" - Build heap of survivors, extract highest priority
 */

var HeapSort = pc.createScript('heapSort');

HeapSort.attributes.add('arraySize', { type: 'number', default: 15, description: 'Number of elements' });
HeapSort.attributes.add('sortSpeed', { type: 'number', default: 0.7, description: 'Seconds between steps' });

HeapSort.prototype.initialize = function() {
    this.array = [];
    this.entities = [];
    this.heapSize = 0;
    this.sorting = false;
    this.timer = 0;
    this.phase = 'build'; // 'build' or 'extract'
    this.currentIndex = 0;
    this.score = 0;

    this.generateArray();
    this.createHeapVisualization();
};

HeapSort.prototype.generateArray = function() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.floor(Math.random() * 100) + 1);
    }
    this.heapSize = this.arraySize;
};

HeapSort.prototype.createHeapVisualization = function() {
    this.entities.forEach(e => e.destroy());
    this.entities = [];

    const container = new pc.Entity('HeapContainer');
    this.entity.addChild(container);

    // Create heap as tree structure
    let level = 0;
    let nodeInLevel = 0;

    for (let i = 0; i < this.arraySize; i++) {
        const node = new pc.Entity('Node_' + i);
        container.addChild(node);

        // Calculate position in tree
        const maxInLevel = Math.pow(2, level);
        const levelWidth = maxInLevel * 2;
        const x = (nodeInLevel - maxInLevel / 2) * (10 / maxInLevel);
        const y = 5 - level * 2;

        node.setLocalPosition(x, y, 0);
        node.addComponent('model', { type: 'sphere' });

        const scale = this.array[i] / 50;
        node.setLocalScale(scale, scale, scale);

        if (node.model && node.model.meshInstances[0]) {
            const intensity = this.array[i] / 100;
            node.model.meshInstances[0].material.diffuse = new pc.Color(1, intensity, 0.2);
            node.model.meshInstances[0].material.update();
        }

        node.value = this.array[i];
        node.heapIndex = i;
        this.entities.push(node);

        // Draw edge to parent
        if (i > 0) {
            const parentIdx = Math.floor((i - 1) / 2);
            this.createEdge(container, parentIdx, i);
        }

        nodeInLevel++;
        if (nodeInLevel >= maxInLevel) {
            level++;
            nodeInLevel = 0;
        }
    }
};

HeapSort.prototype.createEdge = function(container, parentIdx, childIdx) {
    const edge = new pc.Entity('Edge_' + parentIdx + '_' + childIdx);
    container.addChild(edge);

    // Position will be updated in visualization
    edge.addComponent('model', { type: 'cylinder' });
    edge.setLocalScale(0.05, 1, 0.05);

    if (edge.model && edge.model.meshInstances[0]) {
        edge.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.3, 0.3);
        edge.model.meshInstances[0].material.update();
    }
};

HeapSort.prototype.startSort = function() {
    this.sorting = true;
    this.phase = 'build';
    this.currentIndex = Math.floor(this.arraySize / 2) - 1;
    this.heapSize = this.arraySize;
};

HeapSort.prototype.heapSortStep = function() {
    if (this.phase === 'build') {
        if (this.currentIndex >= 0) {
            this.heapify(this.currentIndex);
            this.currentIndex--;
        } else {
            this.phase = 'extract';
            this.currentIndex = this.heapSize - 1;
            console.log('Max heap built!');
        }
    } else if (this.phase === 'extract') {
        if (this.currentIndex > 0) {
            this.swap(0, this.currentIndex);
            this.heapSize--;
            this.currentIndex--;
            this.heapify(0);
            this.score += 10;
        } else {
            this.sorting = false;
            console.log('Heap sort complete! Score:', this.score);
        }
    }

    this.updateVisualization();
};

HeapSort.prototype.heapify = function(i) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;

    if (left < this.heapSize && this.array[left] > this.array[largest]) {
        largest = left;
    }

    if (right < this.heapSize && this.array[right] > this.array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        this.swap(i, largest);
        this.heapify(largest);
    }
};

HeapSort.prototype.swap = function(i, j) {
    const temp = this.array[i];
    this.array[i] = this.array[j];
    this.array[j] = temp;

    const tempEntity = this.entities[i];
    this.entities[i] = this.entities[j];
    this.entities[j] = tempEntity;

    this.entities[i].heapIndex = i;
    this.entities[j].heapIndex = j;
};

HeapSort.prototype.updateVisualization = function() {
    this.entities.forEach((node, i) => {
        if (node.model && node.model.meshInstances[0]) {
            const scale = this.array[i] / 50;
            node.setLocalScale(scale, scale, scale);

            const intensity = this.array[i] / 100;
            const color = i < this.heapSize ?
                new pc.Color(1, intensity, 0.2) : new pc.Color(0.3, 1, 0.3);

            node.model.meshInstances[0].material.diffuse = color;
            node.model.meshInstances[0].material.update();
        }
    });
};

HeapSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;
        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.heapSortStep();
        }
    }
};

HeapSort.prototype.reset = function() {
    this.sorting = false;
    this.phase = 'build';
    this.generateArray();
    this.createHeapVisualization();
    this.score = 0;
};
