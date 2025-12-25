/**
 * Radix Sort Visualization
 * Algorithm: Sort by individual digits, from least to most significant
 * Game: "Mail Sorter" - Sort mail by zip code, digit by digit
 */

var RadixSort = pc.createScript('radixSort');

RadixSort.attributes.add('arraySize', { type: 'number', default: 15 });
RadixSort.attributes.add('sortSpeed', { type: 'number', default: 0.5 });

RadixSort.prototype.initialize = function() {
    this.array = [];
    this.entities = [];
    this.sorting = false;
    this.timer = 0;
    this.currentDigit = 0;
    this.maxDigits = 0;
    this.score = 0;

    this.generateArray();
    this.createVisualization();
};

RadixSort.prototype.generateArray = function() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.floor(Math.random() * 999) + 1);
    }
    this.maxDigits = Math.max(...this.array).toString().length;
};

RadixSort.prototype.createVisualization = function() {
    this.entities.forEach(e => e.destroy());
    this.entities = [];

    const spacing = 1.2;
    const startX = -(this.arraySize - 1) * spacing / 2;

    for (let i = 0; i < this.arraySize; i++) {
        const mail = new pc.Entity('Mail_' + i);
        this.entity.addChild(mail);

        mail.setLocalPosition(startX + i * spacing, 0, 0);
        mail.addComponent('model', { type: 'box' });
        mail.setLocalScale(0.9, 0.6, 0.1);

        if (mail.model && mail.model.meshInstances[0]) {
            mail.model.meshInstances[0].material.diffuse = new pc.Color(0.9, 0.9, 0.7);
            mail.model.meshInstances[0].material.update();
        }

        mail.value = this.array[i];
        this.entities.push(mail);
    }
};

RadixSort.prototype.startSort = function() {
    this.sorting = true;
    this.currentDigit = 0;
};

RadixSort.prototype.radixSortStep = function() {
    if (this.currentDigit >= this.maxDigits) {
        this.sorting = false;
        console.log('Radix sort complete! Score:', this.score);
        return;
    }

    this.countingSortByDigit(this.currentDigit);
    this.currentDigit++;
    this.score += 20;
    this.updateVisualization();
};

RadixSort.prototype.countingSortByDigit = function(digitPosition) {
    const output = new Array(this.arraySize);
    const count = new Array(10).fill(0);

    // Count occurrences
    for (let i = 0; i < this.arraySize; i++) {
        const digit = this.getDigit(this.array[i], digitPosition);
        count[digit]++;
    }

    // Accumulate
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Build output
    for (let i = this.arraySize - 1; i >= 0; i--) {
        const digit = this.getDigit(this.array[i], digitPosition);
        output[count[digit] - 1] = this.array[i];
        count[digit]--;
    }

    this.array = output;
};

RadixSort.prototype.getDigit = function(num, position) {
    return Math.floor(num / Math.pow(10, position)) % 10;
};

RadixSort.prototype.updateVisualization = function() {
    const spacing = 1.2;
    const startX = -(this.arraySize - 1) * spacing / 2;

    this.array.forEach((value, i) => {
        this.entities[i].setLocalPosition(startX + i * spacing, 0, 0);
        this.entities[i].value = value;

        if (this.entities[i].model && this.entities[i].model.meshInstances[0]) {
            const digit = this.getDigit(value, this.currentDigit - 1);
            const hue = digit / 10;
            this.entities[i].model.meshInstances[0].material.diffuse = new pc.Color(hue, 0.8, 1 - hue);
            this.entities[i].model.meshInstances[0].material.update();
        }
    });
};

RadixSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;
        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.radixSortStep();
        }
    }
};

RadixSort.prototype.reset = function() {
    this.sorting = false;
    this.currentDigit = 0;
    this.generateArray();
    this.createVisualization();
    this.score = 0;
};
