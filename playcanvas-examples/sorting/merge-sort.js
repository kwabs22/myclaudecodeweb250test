/**
 * Merge Sort Visualization
 * Algorithm: Divide array in half, recursively sort, then merge sorted halves
 * Game: "Kingdom Merger" - Split armies, organize them, merge back in formation
 */

var MergeSort = pc.createScript('mergeSort');

MergeSort.attributes.add('arraySize', { type: 'number', default: 16, description: 'Number of elements' });
MergeSort.attributes.add('sortSpeed', { type: 'number', default: 0.6, description: 'Seconds between steps' });
MergeSort.attributes.add('spacing', { type: 'number', default: 1.0, description: 'Space between elements' });

MergeSort.prototype.initialize = function() {
    this.array = [];
    this.entities = [];
    this.sorting = false;
    this.timer = 0;
    this.steps = [];
    this.currentStep = 0;
    this.score = 0;

    this.generateArray();
    this.createVisualization();
};

MergeSort.prototype.generateArray = function() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.floor(Math.random() * 100) + 1);
    }
};

MergeSort.prototype.createVisualization = function() {
    this.entities.forEach(e => e.destroy());
    this.entities = [];

    const container = new pc.Entity('MergeContainer');
    this.entity.addChild(container);

    const startX = -(this.arraySize - 1) * this.spacing / 2;

    for (let i = 0; i < this.arraySize; i++) {
        const bar = new pc.Entity('Bar_' + i);
        container.addChild(bar);

        const height = this.array[i] / 10;
        bar.setLocalPosition(startX + i * this.spacing, height / 2, 0);
        bar.addComponent('model', { type: 'box' });
        bar.setLocalScale(0.7, height, 0.7);

        if (bar.model && bar.model.meshInstances[0]) {
            bar.model.meshInstances[0].material.diffuse = new pc.Color(0.5, 0.3, 0.8);
            bar.model.meshInstances[0].material.update();
        }

        bar.value = this.array[i];
        bar.index = i;
        this.entities.push(bar);
    }
};

MergeSort.prototype.startSort = function() {
    this.steps = [];
    this.currentStep = 0;
    this.mergeSort(0, this.arraySize - 1);
    this.sorting = true;
};

MergeSort.prototype.mergeSort = function(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    this.steps.push({ type: 'divide', left, mid, right });

    this.mergeSort(left, mid);
    this.mergeSort(mid + 1, right);

    this.merge(left, mid, right);
};

MergeSort.prototype.merge = function(left, mid, right) {
    const leftArray = this.array.slice(left, mid + 1);
    const rightArray = this.array.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            this.array[k] = leftArray[i];
            i++;
        } else {
            this.array[k] = rightArray[j];
            j++;
        }
        k++;
    }

    while (i < leftArray.length) {
        this.array[k] = leftArray[i];
        i++;
        k++;
    }

    while (j < rightArray.length) {
        this.array[k] = rightArray[j];
        j++;
        k++;
    }

    this.steps.push({ type: 'merge', left, right, array: [...this.array] });
};

MergeSort.prototype.executeStep = function() {
    if (this.currentStep >= this.steps.length) {
        this.sorting = false;
        console.log('Merge sort complete!');
        return;
    }

    const step = this.steps[this.currentStep];

    if (step.type === 'divide') {
        this.highlightDivision(step.left, step.mid, step.right);
    } else if (step.type === 'merge') {
        this.updateVisualization(step.array);
        this.highlightMerge(step.left, step.right);
        this.score += 10;
    }

    this.currentStep++;
};

MergeSort.prototype.highlightDivision = function(left, mid, right) {
    this.entities.forEach((e, i) => {
        if (e.model && e.model.meshInstances[0]) {
            let color;
            if (i >= left && i <= mid) {
                color = new pc.Color(0.3, 0.8, 0.3);
            } else if (i > mid && i <= right) {
                color = new pc.Color(0.8, 0.8, 0.3);
            } else {
                color = new pc.Color(0.5, 0.3, 0.8);
            }
            e.model.meshInstances[0].material.diffuse = color;
            e.model.meshInstances[0].material.update();
        }
    });
};

MergeSort.prototype.highlightMerge = function(left, right) {
    this.entities.forEach((e, i) => {
        if (e.model && e.model.meshInstances[0]) {
            const color = (i >= left && i <= right) ?
                new pc.Color(0.2, 0.6, 1) : new pc.Color(0.5, 0.3, 0.8);
            e.model.meshInstances[0].material.diffuse = color;
            e.model.meshInstances[0].material.update();
        }
    });
};

MergeSort.prototype.updateVisualization = function(newArray) {
    const startX = -(this.arraySize - 1) * this.spacing / 2;

    newArray.forEach((value, i) => {
        const bar = this.entities[i];
        const height = value / 10;
        bar.setLocalPosition(startX + i * this.spacing, height / 2, 0);
        bar.setLocalScale(0.7, height, 0.7);
        bar.value = value;
    });
};

MergeSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;
        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.executeStep();
        }
    }
};

MergeSort.prototype.reset = function() {
    this.sorting = false;
    this.generateArray();
    this.createVisualization();
    this.score = 0;
};
