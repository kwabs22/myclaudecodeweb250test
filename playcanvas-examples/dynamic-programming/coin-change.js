/**
 * Coin Change Problem
 * Algorithm: Find minimum coins needed to make amount using dynamic programming
 * Game: "Cashier Challenge" - Give exact change using minimum coins
 */

var CoinChange = pc.createScript('coinChange');

// Attributes
CoinChange.attributes.add('targetAmount', {
    type: 'number',
    default: 37,
    description: 'Amount to make with coins'
});

CoinChange.attributes.add('coinDenominations', {
    type: 'json',
    schema: [{
        name: 'denominations',
        type: 'number',
        array: true
    }],
    default: [1, 5, 10, 25],
    description: 'Available coin denominations'
});

CoinChange.attributes.add('showDPTable', {
    type: 'boolean',
    default: true,
    description: 'Visualize DP table'
});

// Initialize
CoinChange.prototype.initialize = function() {
    this.coins = this.coinDenominations || [1, 5, 10, 25];
    this.dp = [];
    this.coinCombination = [];
    this.playerCoins = [];
    this.playerTotal = 0;
    this.score = 0;
    this.level = 1;

    // Calculate optimal solution
    this.calculateMinCoins();

    // Setup UI
    this.createCoinEntities();
};

// Calculate minimum coins using dynamic programming
CoinChange.prototype.calculateMinCoins = function() {
    const amount = this.targetAmount;

    // Initialize DP array
    this.dp = new Array(amount + 1).fill(Infinity);
    this.dp[0] = 0;

    // Track which coin was used for each amount
    const coinUsed = new Array(amount + 1).fill(-1);

    // Fill DP table
    for (let i = 1; i <= amount; i++) {
        for (let j = 0; j < this.coins.length; j++) {
            const coin = this.coins[j];

            if (coin <= i && this.dp[i - coin] + 1 < this.dp[i]) {
                this.dp[i] = this.dp[i - coin] + 1;
                coinUsed[i] = coin;
            }
        }
    }

    // Reconstruct solution
    this.coinCombination = [];
    let remaining = amount;

    while (remaining > 0 && coinUsed[remaining] !== -1) {
        const coin = coinUsed[remaining];
        this.coinCombination.push(coin);
        remaining -= coin;
    }

    console.log('Target amount:', amount);
    console.log('Minimum coins needed:', this.dp[amount]);
    console.log('Optimal combination:', this.coinCombination);

    if (this.showDPTable) {
        this.visualizeDPTable();
    }
};

// Visualize DP table
CoinChange.prototype.visualizeDPTable = function() {
    const tableEntity = new pc.Entity('DPTable');
    this.entity.addChild(tableEntity);

    const maxDisplay = Math.min(20, this.targetAmount + 1);

    for (let i = 0; i < maxDisplay; i++) {
        const cell = new pc.Entity('Cell_' + i);
        tableEntity.addChild(cell);

        cell.setLocalPosition(i * 0.8 - maxDisplay * 0.4, 2, 0);
        cell.addComponent('model', { type: 'box' });
        cell.setLocalScale(0.7, 0.7, 0.1);

        // Color based on value
        const value = this.dp[i];
        const intensity = value === Infinity ? 0 : 1 / (value + 1);
        const color = new pc.Color(intensity, intensity, 1);

        if (cell.model && cell.model.meshInstances[0]) {
            cell.model.meshInstances[0].material.diffuse = color;
            cell.model.meshInstances[0].material.update();
        }

        // Add text showing the value (would need text element in real implementation)
        cell.minCoins = value;
        cell.amount = i;
    }
};

// Create visual coin entities
CoinChange.prototype.createCoinEntities = function() {
    const coinContainer = new pc.Entity('CoinContainer');
    this.entity.addChild(coinContainer);

    this.coins.forEach((denomination, index) => {
        const coinPile = new pc.Entity('Coin_' + denomination);
        coinContainer.addChild(coinPile);

        coinPile.setLocalPosition(index * 2 - this.coins.length, 0, 0);
        coinPile.addComponent('model', { type: 'cylinder' });

        const scale = 0.3 + (denomination / 25) * 0.3;
        coinPile.setLocalScale(scale, 0.1, scale);

        // Color based on denomination
        const colors = [
            new pc.Color(0.8, 0.5, 0.2), // Penny - copper
            new pc.Color(0.7, 0.7, 0.7), // Nickel - silver
            new pc.Color(0.6, 0.6, 0.6), // Dime - silver
            new pc.Color(0.9, 0.9, 0.9)  // Quarter - silver
        ];

        const color = colors[index] || new pc.Color(0.5, 0.5, 0.5);

        if (coinPile.model && coinPile.model.meshInstances[0]) {
            coinPile.model.meshInstances[0].material.diffuse = color;
            coinPile.model.meshInstances[0].material.update();
        }

        coinPile.denomination = denomination;
        coinPile.clickable = true;
    });

    // Setup input for coin selection
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onCoinClick, this);
};

// Handle coin click
CoinChange.prototype.onCoinClick = function(event) {
    // Raycast to find clicked coin
    const camera = this.app.root.findByName('Camera');
    if (!camera) return;

    const from = camera.getPosition();
    const to = camera.camera.screenToWorld(event.x, event.y, camera.getPosition().z + 10);

    const result = this.app.systems.rigidbody.raycastFirst(from, to);

    if (result && result.entity.denomination !== undefined) {
        this.addPlayerCoin(result.entity.denomination);
    }
};

// Player adds a coin
CoinChange.prototype.addPlayerCoin = function(denomination) {
    if (this.playerTotal >= this.targetAmount) {
        console.log('Already at target amount!');
        return;
    }

    this.playerCoins.push(denomination);
    this.playerTotal += denomination;

    console.log('Added coin:', denomination, 'Total:', this.playerTotal);

    this.visualizePlayerCoins();

    if (this.playerTotal === this.targetAmount) {
        this.checkSolution();
    } else if (this.playerTotal > this.targetAmount) {
        console.log('Over the target! Try again.');
        this.resetPlayerCoins();
    }
};

// Visualize player's selected coins
CoinChange.prototype.visualizePlayerCoins = function() {
    const playerArea = this.entity.findByName('PlayerArea');
    if (playerArea) playerArea.destroy();

    const area = new pc.Entity('PlayerArea');
    this.entity.addChild(area);

    this.playerCoins.forEach((denom, index) => {
        const coin = new pc.Entity('PlayerCoin_' + index);
        area.addChild(coin);

        coin.setLocalPosition(index * 0.5 - this.playerCoins.length * 0.25, -2, 0);
        coin.addComponent('model', { type: 'cylinder' });
        coin.setLocalScale(0.3, 0.1, 0.3);

        if (coin.model && coin.model.meshInstances[0]) {
            coin.model.meshInstances[0].material.diffuse = new pc.Color(1, 0.8, 0);
            coin.model.meshInstances[0].material.update();
        }
    });
};

// Check if player's solution is optimal
CoinChange.prototype.checkSolution = function() {
    const optimalCount = this.dp[this.targetAmount];
    const playerCount = this.playerCoins.length;

    console.log('Your solution:', playerCount, 'coins');
    console.log('Optimal solution:', optimalCount, 'coins');

    if (playerCount === optimalCount) {
        console.log('Perfect! You found the optimal solution!');
        this.score += 100;
        this.levelUp();
    } else {
        console.log('Good, but not optimal. Try again!');
        this.score += 50;
        this.showOptimalSolution();
    }
};

// Show optimal solution
CoinChange.prototype.showOptimalSolution = function() {
    console.log('Optimal coin combination:', this.coinCombination);

    const solutionArea = new pc.Entity('SolutionArea');
    this.entity.addChild(solutionArea);

    this.coinCombination.forEach((denom, index) => {
        const coin = new pc.Entity('OptimalCoin_' + index);
        solutionArea.addChild(coin);

        coin.setLocalPosition(index * 0.5 - this.coinCombination.length * 0.25, -3, 0);
        coin.addComponent('model', { type: 'cylinder' });
        coin.setLocalScale(0.3, 0.1, 0.3);

        if (coin.model && coin.model.meshInstances[0]) {
            coin.model.meshInstances[0].material.diffuse = new pc.Color(0, 1, 0);
            coin.model.meshInstances[0].material.update();
        }
    });
};

// Reset player's coins
CoinChange.prototype.resetPlayerCoins = function() {
    this.playerCoins = [];
    this.playerTotal = 0;

    const playerArea = this.entity.findByName('PlayerArea');
    if (playerArea) playerArea.destroy();
};

// Level up to new challenge
CoinChange.prototype.levelUp = function() {
    this.level++;
    this.targetAmount = Math.floor(Math.random() * 50) + 20 + this.level * 5;
    this.resetPlayerCoins();
    this.calculateMinCoins();

    console.log('Level', this.level, '- New target:', this.targetAmount);
};

// Update loop
CoinChange.prototype.update = function(dt) {
    // Update UI elements
};

// Get hints for player
CoinChange.prototype.getHint = function() {
    if (this.playerCoins.length === 0) {
        // Suggest starting with largest coin possible
        const largestUsable = this.coins.filter(c => c <= this.targetAmount).sort((a, b) => b - a)[0];
        return 'Try starting with a ' + largestUsable + ' coin';
    }

    const remaining = this.targetAmount - this.playerTotal;
    const nextCoin = this.coins.filter(c => c <= remaining).sort((a, b) => b - a)[0];

    return 'You need ' + remaining + ' more. Consider using a ' + nextCoin + ' coin';
};
