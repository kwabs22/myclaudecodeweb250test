/**
 * Counting Sort Visualization
 * Algorithm: Count occurrences, calculate positions, place elements
 * Game: "Inventory Manager" - Count items, arrange on shelves in order
 */

var CountingSort = pc.createScript('countingSort');

CountingSort.attributes.add('arraySize', { type: 'number', default: 20 });
CountingSort.attributes.add('maxValue', { type: 'number', default: 10 });
CountingSort.attributes.add('sortSpeed', { type: 'number', default: 0.4 });

CountingSort.prototype.initialize = function() {
    this.array = [];
    this.count = [];
    this.output = [];
    this.entities = [];
    this.countEntities = [];
    this.sorting = false;
    this.timer = 0;
    this.phase = 'count'; // 'count', 'accumulate', 'place'
    this.currentIndex = 0;
    this.score = 0;

    this.generateArray();
    this.createVisualization();
};

SelectionSort.prototype.generateArray = function() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.floor(Math.random() * this.maxValue) + 1);
    }
    this.count = new Array(this.maxValue + 1).fill(0);
    this.output = new Array(this.arraySize);
};

CountingSort.prototype.createVisualization = function() {
    this.entities.forEach(e => e.destroy());
    this.countEntities.forEach(e => e.destroy());
    this.entities = [];
    this.countEntities = [];

    const itemSpacing = 0.8;
    const startX = -(this.arraySize - 1) * itemSpacing / 2;

    // Create items
    for (let i = 0; i < this.arraySize; i++) {
        const item = new pc.Entity('Item_' + i);
        this.entity.addChild(item);

        item.setLocalPosition(startX + i * itemSpacing, 2, 0);
        item.addComponent('model', { type: 'box' });
        item.setLocalScale(0.6, 0.6, 0.6);

        if (item.model && item.model.meshInstances[0]) {
            const hue = this.array[i] / this.maxValue;
            item.model.meshInstances[0].material.diffuse = new pc.Color(hue, 0.5, 1 - hue);
            item.model.meshInstances[0].material.update();
        }

        item.value = this.array[i];
        this.entities.push(item);
    }

    // Create count buckets
    const bucketSpacing = 1.5;
    const bucketStartX = -(this.maxValue) * bucketSpacing / 2;

    for (let i = 0; i <= this.maxValue; i++) {
        const bucket = new pc.Entity('Bucket_' + i);
        this.entity.addChild(bucket);

        bucket.setLocalPosition(bucketStartX + i * bucketSpacing, -2, 0);
        bucket.addComponent('model', { type: 'cylinder' });
        bucket.setLocalScale(0.5, 0.2, 0.5);

        if (bucket.model && bucket.model.meshInstances[0]) {
            bucket.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.3, 0.3);
            bucket.model.meshInstances[0].material.update();
        }

        bucket.count = 0;
        this.countEntities.push(bucket);
    }
};

CountingSort.prototype.startSort = function() {
    this.sorting = true;
    this.phase = 'count';
    this.currentIndex = 0;
    this.count.fill(0);
};

CountingSort.prototype.countingSortStep = function() {
    if (this.phase === 'count') {
        if (this.currentIndex < this.arraySize) {
            const value = this.array[this.currentIndex];
            this.count[value]++;

            // Visualize counting
            this.highlightBucket(value);
            this.currentIndex++;
            this.score += 2;
        } else {
            this.phase = 'accumulate';
            this.currentIndex = 1;
            console.log('Counting complete!');
        }
    } else if (this.phase === 'accumulate') {
        if (this.currentIndex <= this.maxValue) {
            this.count[this.currentIndex] += this.count[this.currentIndex - 1];
            this.currentIndex++;
        } else {
            this.phase = 'place';
            this.currentIndex = this.arraySize - 1;
            console.log('Accumulation complete!');
        }
    } else if (this.phase === 'place') {
        if (this.currentIndex >= 0) {
            const value = this.array[this.currentIndex];
            this.output[this.count[value] - 1] = value;
            this.count[value]--;

            // Move item to output position
            this.moveItemToOutput(this.currentIndex, this.count[value]);
            this.currentIndex--;
            this.score += 5;
        } else {
            this.sorting = false;
            this.array = [...this.output];
            console.log('Counting sort complete! Score:', this.score);
        }
    }
};

CountingSort.prototype.highlightBucket = function(value) {
    if (this.countEntities[value]) {
        const bucket = this.countEntities[value];
        const newHeight = 0.2 + this.count[value] * 0.3;
        bucket.setLocalScale(0.5, newHeight, 0.5);

        if (bucket.model && bucket.model.meshInstances[0]) {
            const intensity = Math.min(1, this.count[value] / 5);
            bucket.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.3 + intensity * 0.7, 0.3);
            bucket.model.meshInstances[0].material.update();
        }
    }
};

CountingSort.prototype.moveItemToOutput = function(itemIndex, outputPosition) {
    const item = this.entities[itemIndex];
    if (!item) return;

    const itemSpacing = 0.8;
    const startX = -(this.arraySize - 1) * itemSpacing / 2;
    item.setLocalPosition(startX + outputPosition * itemSpacing, 0, 0);

    if (item.model && item.model.meshInstances[0]) {
        item.model.meshInstances[0].material.emissive = new pc.Color(0, 1, 0);
        item.model.meshInstances[0].material.update();
    }
};

CountingSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;
        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.countingSortStep();
        }
    }
};

CountingSort.prototype.reset = function() {
    this.sorting = false;
    this.phase = 'count';
    this.currentIndex = 0;
    this.generateArray();
    this.createVisualization();
    this.score = 0;
};
