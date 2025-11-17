/**
 * Insertion Sort Visualization
 * Algorithm: Build sorted array by inserting elements one at a time
 * Game: "Card Collector" - Draw cards and insert into sorted hand
 */

var InsertionSort = pc.createScript('insertionSort');

InsertionSort.attributes.add('arraySize', { type: 'number', default: 10, description: 'Number of cards' });
InsertionSort.attributes.add('sortSpeed', { type: 'number', default: 0.6, description: 'Seconds per insertion' });

InsertionSort.prototype.initialize = function() {
    this.array = [];
    this.cards = [];
    this.sorting = false;
    this.timer = 0;
    this.currentIndex = 1;
    this.insertionIndex = 0;
    this.score = 0;
    this.moves = 0;

    this.generateArray();
    this.createCardVisualization();
};

InsertionSort.prototype.generateArray = function() {
    this.array = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.array.push(Math.floor(Math.random() * 100) + 1);
    }
};

InsertionSort.prototype.createCardVisualization = function() {
    this.cards.forEach(c => c.destroy());
    this.cards = [];

    const container = new pc.Entity('CardContainer');
    this.entity.addChild(container);

    const spacing = 1.2;
    const startX = -(this.arraySize - 1) * spacing / 2;

    for (let i = 0; i < this.arraySize; i++) {
        const card = new pc.Entity('Card_' + i);
        container.addChild(card);

        card.setLocalPosition(startX + i * spacing, 0, 0);
        card.addComponent('model', { type: 'box' });
        card.setLocalScale(0.8, 1.5, 0.1);

        if (card.model && card.model.meshInstances[0]) {
            const color = i === 0 ? new pc.Color(0.2, 0.8, 0.2) : new pc.Color(0.7, 0.7, 0.7);
            card.model.meshInstances[0].material.diffuse = color;
            card.model.meshInstances[0].material.update();
        }

        card.value = this.array[i];
        card.arrayIndex = i;
        this.cards.push(card);
    }
};

InsertionSort.prototype.startSort = function() {
    this.sorting = true;
    this.currentIndex = 1;
    this.score = 0;
    this.moves = 0;
};

InsertionSort.prototype.insertionSortStep = function() {
    if (this.currentIndex >= this.arraySize) {
        this.sorting = false;
        console.log('Insertion sort complete! Moves:', this.moves, 'Score:', this.score);
        return;
    }

    const key = this.array[this.currentIndex];
    let j = this.currentIndex - 1;

    // Highlight current card being inserted
    this.highlightCard(this.currentIndex, new pc.Color(1, 0.8, 0));

    // Find insertion position
    while (j >= 0 && this.array[j] > key) {
        this.array[j + 1] = this.array[j];
        this.shiftCard(j, j + 1);
        j--;
        this.moves++;
    }

    this.array[j + 1] = key;

    // Update visualization
    this.updateCardPositions();

    // Mark sorted portion green
    for (let i = 0; i <= this.currentIndex; i++) {
        this.highlightCard(i, new pc.Color(0.2, 0.8, 0.2));
    }

    this.currentIndex++;
    this.score += 10;
};

InsertionSort.prototype.shiftCard = function(from, to) {
    const temp = this.cards[from];
    this.cards[from] = this.cards[to];
    this.cards[to] = temp;
};

InsertionSort.prototype.updateCardPositions = function() {
    const spacing = 1.2;
    const startX = -(this.arraySize - 1) * spacing / 2;

    this.cards.forEach((card, i) => {
        card.setLocalPosition(startX + i * spacing, 0, 0);
        card.arrayIndex = i;
    });
};

InsertionSort.prototype.highlightCard = function(index, color) {
    if (this.cards[index] && this.cards[index].model && this.cards[index].model.meshInstances[0]) {
        this.cards[index].model.meshInstances[0].material.diffuse = color;
        this.cards[index].model.meshInstances[0].material.update();
    }
};

InsertionSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;
        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.insertionSortStep();
        }
    }
};

InsertionSort.prototype.reset = function() {
    this.sorting = false;
    this.currentIndex = 1;
    this.generateArray();
    this.createCardVisualization();
    this.score = 0;
    this.moves = 0;
};
