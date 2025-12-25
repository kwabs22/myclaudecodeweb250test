/**
 * Bucket Sort Visualization
 * Algorithm: Distribute elements into buckets, sort buckets, concatenate
 * Game: "Treasure Buckets" - Toss gems into value buckets, organize each
 */

var BucketSort = pc.createScript('bucketSort');

BucketSort.attributes.add('arraySize', { type: 'number', default: 20 });
BucketSort.attributes.add('numBuckets', { type: 'number', default: 5 });
BucketSort.attributes.add('sortSpeed', { type: 'number', default: 0.3 });

BucketSort.prototype.initialize = function() {
    this.array = [];
    this.buckets = [];
    this.entities = [];
    this.bucketEntities = [];
    this.sorting = false;
    this.timer = 0;
    this.phase = 'distribute'; // 'distribute', 'sort', 'gather'
    this.currentIndex = 0;
    this.currentBucket = 0;
    this.score = 0;

    this.generateArray();
    this.createVisualization();
};

BucketSort.prototype.generateArray = function() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.random()); // Values between 0 and 1
    }

    this.buckets = Array.from({ length: this.numBuckets }, () => []);
};

BucketSort.prototype.createVisualization = function() {
    this.entities.forEach(e => e.destroy());
    this.bucketEntities.forEach(e => e.destroy());
    this.entities = [];
    this.bucketEntities = [];

    // Create gems
    const gemSpacing = 0.8;
    const startX = -(this.arraySize - 1) * gemSpacing / 2;

    for (let i = 0; i < this.arraySize; i++) {
        const gem = new pc.Entity('Gem_' + i);
        this.entity.addChild(gem);

        gem.setLocalPosition(startX + i * gemSpacing, 3, 0);
        gem.addComponent('model', { type: 'sphere' });
        gem.setLocalScale(0.4, 0.4, 0.4);

        if (gem.model && gem.model.meshInstances[0]) {
            const value = this.array[i];
            gem.model.meshInstances[0].material.diffuse = new pc.Color(value, 0.5, 1 - value);
            gem.model.meshInstances[0].material.update();
        }

        gem.value = this.array[i];
        this.entities.push(gem);
    }

    // Create buckets
    const bucketSpacing = 4;
    const bucketStartX = -(this.numBuckets - 1) * bucketSpacing / 2;

    for (let i = 0; i < this.numBuckets; i++) {
        const bucket = new pc.Entity('Bucket_' + i);
        this.entity.addChild(bucket);

        bucket.setLocalPosition(bucketStartX + i * bucketSpacing, -1, 0);
        bucket.addComponent('model', { type: 'cylinder' });
        bucket.setLocalScale(1.5, 0.5, 1.5);

        if (bucket.model && bucket.model.meshInstances[0]) {
            bucket.model.meshInstances[0].material.diffuse = new pc.Color(0.4, 0.3, 0.2);
            bucket.model.meshInstances[0].material.update();
        }

        bucket.bucketIndex = i;
        this.bucketEntities.push(bucket);
    }
};

BucketSort.prototype.startSort = function() {
    this.sorting = true;
    this.phase = 'distribute';
    this.currentIndex = 0;
    this.buckets.forEach(b => b.length = 0);
};

BucketSort.prototype.bucketSortStep = function() {
    if (this.phase === 'distribute') {
        if (this.currentIndex < this.arraySize) {
            const value = this.array[this.currentIndex];
            const bucketIndex = Math.min(Math.floor(value * this.numBuckets), this.numBuckets - 1);
            this.buckets[bucketIndex].push(value);

            // Move gem to bucket
            this.moveGemToBucket(this.currentIndex, bucketIndex);
            this.currentIndex++;
            this.score += 2;
        } else {
            this.phase = 'sort';
            this.currentBucket = 0;
            console.log('Distribution complete!');
        }
    } else if (this.phase === 'sort') {
        if (this.currentBucket < this.numBuckets) {
            this.buckets[this.currentBucket].sort((a, b) => a - b);
            this.highlightBucket(this.currentBucket);
            this.currentBucket++;
            this.score += 10;
        } else {
            this.phase = 'gather';
            this.currentIndex = 0;
            console.log('Sorting buckets complete!');
        }
    } else if (this.phase === 'gather') {
        this.array = [].concat(...this.buckets);
        this.updateFinalVisualization();
        this.sorting = false;
        console.log('Bucket sort complete! Score:', this.score);
    }
};

BucketSort.prototype.moveGemToBucket = function(gemIndex, bucketIndex) {
    const gem = this.entities[gemIndex];
    const bucket = this.bucketEntities[bucketIndex];

    if (gem && bucket) {
        const bucketPos = bucket.getPosition();
        const itemsInBucket = this.buckets[bucketIndex].length;
        gem.setPosition(bucketPos.x + (itemsInBucket % 3) * 0.5 - 0.5, bucketPos.y + 1 + Math.floor(itemsInBucket / 3) * 0.5, bucketPos.z);
    }
};

BucketSort.prototype.highlightBucket = function(bucketIndex) {
    const bucket = this.bucketEntities[bucketIndex];
    if (bucket && bucket.model && bucket.model.meshInstances[0]) {
        bucket.model.meshInstances[0].material.emissive = new pc.Color(0, 1, 0);
        bucket.model.meshInstances[0].material.update();
    }
};

BucketSort.prototype.updateFinalVisualization = function() {
    const gemSpacing = 0.8;
    const startX = -(this.arraySize - 1) * gemSpacing / 2;

    this.array.forEach((value, i) => {
        this.entities[i].setLocalPosition(startX + i * gemSpacing, 0, 0);
    });
};

BucketSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;
        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.bucketSortStep();
        }
    }
};

BucketSort.prototype.reset = function() {
    this.sorting = false;
    this.phase = 'distribute';
    this.currentIndex = 0;
    this.generateArray();
    this.createVisualization();
    this.score = 0;
};
