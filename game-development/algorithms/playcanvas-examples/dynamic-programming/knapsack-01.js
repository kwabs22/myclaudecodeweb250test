/**
 * 0/1 Knapsack Problem
 * Algorithm: Select items with max value within weight constraint
 * Game: "Dungeon Looter" - Fill backpack with treasures without exceeding weight
 */

var Knapsack01 = pc.createScript('knapsack01');

Knapsack01.attributes.add('capacity', { type: 'number', default: 50 });
Knapsack01.attributes.add('numItems', { type: 'number', default: 10 });

Knapsack01.prototype.initialize = function() {
    this.items = [];
    this.dp = [];
    this.selectedItems = [];
    this.playerItems = [];
    this.playerWeight = 0;
    this.playerValue = 0;
    this.score = 0;

    this.generateItems();
    this.solveKnapsack();
    this.createVisualization();
};

Knapsack01.prototype.generateItems = function() {
    this.items = [];
    for (let i = 0; i < this.numItems; i++) {
        this.items.push({
            id: i,
            weight: Math.floor(Math.random() * 20) + 5,
            value: Math.floor(Math.random() * 100) + 10,
            name: 'Treasure_' + i
        });
    }
};

Knapsack01.prototype.solveKnapsack = function() {
    const n = this.items.length;
    const W = this.capacity;
    this.dp = Array(n + 1).fill(null).map(() => Array(W + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
            const item = this.items[i - 1];
            if (item.weight <= w) {
                this.dp[i][w] = Math.max(
                    this.dp[i - 1][w],
                    this.dp[i - 1][w - item.weight] + item.value
                );
            } else {
                this.dp[i][w] = this.dp[i - 1][w];
            }
        }
    }

    this.reconstructSolution();
    console.log('Optimal value:', this.dp[n][W]);
    console.log('Selected items:', this.selectedItems);
};

Knapsack01.prototype.reconstructSolution = function() {
    this.selectedItems = [];
    let w = this.capacity;
    let n = this.items.length;

    for (let i = n; i > 0; i--) {
        if (this.dp[i][w] !== this.dp[i - 1][w]) {
            this.selectedItems.push(this.items[i - 1]);
            w -= this.items[i - 1].weight;
        }
    }
};

Knapsack01.prototype.createVisualization = function() {
    const itemSpacing = 1.5;
    const startX = -(this.numItems - 1) * itemSpacing / 2;

    this.items.forEach((item, i) => {
        const treasure = new pc.Entity(item.name);
        this.entity.addChild(treasure);

        treasure.setLocalPosition(startX + i * itemSpacing, 0, 0);
        treasure.addComponent('model', { type: 'box' });

        const scale = item.value / 50;
        treasure.setLocalScale(scale, scale, scale);

        if (treasure.model && treasure.model.meshInstances[0]) {
            const isOptimal = this.selectedItems.includes(item);
            const color = isOptimal ? new pc.Color(1, 0.8, 0) : new pc.Color(0.6, 0.6, 0.6);
            treasure.model.meshInstances[0].material.diffuse = color;
            treasure.model.meshInstances[0].material.update();
        }

        treasure.itemData = item;
    });
};

Knapsack01.prototype.addPlayerItem = function(item) {
    if (this.playerWeight + item.weight <= this.capacity) {
        this.playerItems.push(item);
        this.playerWeight += item.weight;
        this.playerValue += item.value;
        console.log('Added:', item.name, 'Weight:', this.playerWeight, 'Value:', this.playerValue);

        if (this.playerValue === this.dp[this.items.length][this.capacity]) {
            console.log('Optimal solution found! Score:', this.score + 100);
            this.score += 100;
        }
    } else {
        console.log('Too heavy! Over capacity.');
    }
};

Knapsack01.prototype.reset = function() {
    this.playerItems = [];
    this.playerWeight = 0;
    this.playerValue = 0;
    this.score = 0;
};
