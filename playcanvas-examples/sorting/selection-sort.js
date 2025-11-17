/**
 * Selection Sort Visualization
 * Algorithm: Find minimum element, swap with first position, repeat
 * Game: "Talent Show" - Select best performer each round, move to front
 */

var SelectionSort = pc.createScript('selectionSort');

SelectionSort.attributes.add('arraySize', { type: 'number', default: 10 });
SelectionSort.attributes.add('sortSpeed', { type: 'number', default: 0.8 });

SelectionSort.prototype.initialize = function() {
    this.array = [];
    this.entities = [];
    this.sorting = false;
    this.timer = 0;
    this.currentIndex = 0;
    this.minIndex = 0;
    this.searchIndex = 0;
    this.phase = 'search'; // 'search' or 'swap'
    this.score = 0;

    this.generateArray();
    this.createVisualization();
};

SelectionSort.prototype.generateArray = function() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.floor(Math.random() * 100) + 1);
    }
};

SelectionSort.prototype.createVisualization = function() {
    this.entities.forEach(e => e.destroy());
    this.entities = [];

    const spacing = 1.5;
    const startX = -(this.arraySize - 1) * spacing / 2;

    for (let i = 0; i < this.arraySize; i++) {
        const performer = new pc.Entity('Performer_' + i);
        this.entity.addChild(performer);

        const height = this.array[i] / 20;
        performer.setLocalPosition(startX + i * spacing, height / 2, 0);
        performer.addComponent('model', { type: 'capsule' });
        performer.setLocalScale(0.6, height, 0.6);

        if (performer.model && performer.model.meshInstances[0]) {
            performer.model.meshInstances[0].material.diffuse = new pc.Color(0.6, 0.4, 0.8);
            performer.model.meshInstances[0].material.update();
        }

        performer.value = this.array[i];
        this.entities.push(performer);
    }
};

SelectionSort.prototype.startSort = function() {
    this.sorting = true;
    this.currentIndex = 0;
    this.phase = 'search';
};

SelectionSort.prototype.selectionSortStep = function() {
    if (this.currentIndex >= this.arraySize - 1) {
        this.sorting = false;
        console.log('Selection sort complete! Score:', this.score);
        this.highlightAll(new pc.Color(0.2, 0.9, 0.2));
        return;
    }

    if (this.phase === 'search') {
        if (this.searchIndex === this.currentIndex) {
            this.minIndex = this.currentIndex;
            this.searchIndex = this.currentIndex + 1;
        }

        if (this.searchIndex < this.arraySize) {
            this.highlightEntity(this.searchIndex, new pc.Color(1, 1, 0));

            if (this.array[this.searchIndex] < this.array[this.minIndex]) {
                this.minIndex = this.searchIndex;
                this.highlightEntity(this.minIndex, new pc.Color(1, 0.5, 0));
            }

            this.searchIndex++;
        } else {
            this.phase = 'swap';
        }
    } else if (this.phase === 'swap') {
        if (this.minIndex !== this.currentIndex) {
            this.swap(this.currentIndex, this.minIndex);
            this.score += 10;
        }

        this.highlightEntity(this.currentIndex, new pc.Color(0.2, 0.9, 0.2));
        this.currentIndex++;
        this.searchIndex = this.currentIndex;
        this.phase = 'search';
    }
};

SelectionSort.prototype.swap = function(i, j) {
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

SelectionSort.prototype.highlightEntity = function(index, color) {
    if (this.entities[index] && this.entities[index].model && this.entities[index].model.meshInstances[0]) {
        this.entities[index].model.meshInstances[0].material.emissive = color;
        this.entities[index].model.meshInstances[0].material.update();
    }
};

SelectionSort.prototype.highlightAll = function(color) {
    this.entities.forEach(e => {
        if (e.model && e.model.meshInstances[0]) {
            e.model.meshInstances[0].material.diffuse = color;
            e.model.meshInstances[0].material.update();
        }
    });
};

SelectionSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;
        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.selectionSortStep();
        }
    }
};

SelectionSort.prototype.reset = function() {
    this.sorting = false;
    this.currentIndex = 0;
    this.generateArray();
    this.createVisualization();
    this.score = 0;
};
