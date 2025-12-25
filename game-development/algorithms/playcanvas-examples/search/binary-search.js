/**
 * Binary Search Game
 * Algorithm: Search sorted array by repeatedly halving search interval
 * Game: "Number Detective" - Guess hidden number using binary search strategy
 */

var BinarySearch = pc.createScript('binarySearch');

// Attributes
BinarySearch.attributes.add('minValue', {
    type: 'number',
    default: 1,
    description: 'Minimum value in range'
});

BinarySearch.attributes.add('maxValue', {
    type: 'number',
    default: 100,
    description: 'Maximum value in range'
});

BinarySearch.attributes.add('showOptimalPath', {
    type: 'boolean',
    default: true,
    description: 'Highlight optimal binary search path'
});

// Initialize
BinarySearch.prototype.initialize = function() {
    this.targetNumber = 0;
    this.guesses = [];
    this.low = this.minValue;
    this.high = this.maxValue;
    this.gameActive = false;
    this.score = 1000;
    this.optimalGuesses = 0;

    this.startNewGame();

    // Listen for keyboard input
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
};

// Start new game
BinarySearch.prototype.startNewGame = function() {
    // Pick random target number
    this.targetNumber = Math.floor(Math.random() * (this.maxValue - this.minValue + 1)) + this.minValue;

    // Calculate optimal number of guesses (log2 of range)
    this.optimalGuesses = Math.ceil(Math.log2(this.maxValue - this.minValue + 1));

    this.guesses = [];
    this.low = this.minValue;
    this.high = this.maxValue;
    this.gameActive = true;
    this.score = 1000;

    console.log('New game started! Guess the number between', this.minValue, 'and', this.maxValue);
    console.log('Optimal guesses:', this.optimalGuesses);

    this.createNumberLine();
};

// Create visual number line
BinarySearch.prototype.createNumberLine = function() {
    // Clear previous number line
    const oldLine = this.entity.findByName('NumberLine');
    if (oldLine) oldLine.destroy();

    const numberLine = new pc.Entity('NumberLine');
    this.entity.addChild(numberLine);

    const range = this.maxValue - this.minValue;
    const spacing = 10 / range; // Spread across 10 units

    // Create markers for important numbers
    const markers = [this.minValue, this.maxValue];
    for (let i = 0; i < 9; i++) {
        markers.push(Math.floor(this.minValue + (range / 10) * (i + 1)));
    }

    markers.forEach(num => {
        const marker = new pc.Entity('Marker_' + num);
        numberLine.addChild(marker);

        const x = ((num - this.minValue) / range) * 10 - 5;
        marker.setLocalPosition(x, 0, 0);

        // Add visual representation (would need cube/sphere model)
        marker.addComponent('model', { type: 'cylinder' });
        marker.setLocalScale(0.1, 0.1, 0.1);

        marker.value = num;
    });
};

// Make a guess
BinarySearch.prototype.makeGuess = function(guess) {
    if (!this.gameActive) return;

    if (guess < this.low || guess > this.high) {
        console.log('Guess must be between', this.low, 'and', this.high);
        return;
    }

    this.guesses.push(guess);
    this.score -= 50; // Penalty per guess

    console.log('Guess #' + this.guesses.length + ':', guess);

    if (guess === this.targetNumber) {
        // Correct!
        this.gameActive = false;

        const bonus = (this.guesses.length <= this.optimalGuesses) ? 500 : 0;
        this.score += bonus;

        console.log('Correct! Found', this.targetNumber, 'in', this.guesses.length, 'guesses');
        console.log('Final score:', this.score);

        if (this.guesses.length <= this.optimalGuesses) {
            console.log('Perfect! Used optimal strategy!');
        }

        this.visualizeGuessPath();

    } else if (guess < this.targetNumber) {
        // Too low
        this.low = guess + 1;
        console.log('Too low! New range:', this.low, '-', this.high);
        this.highlightRange();

    } else {
        // Too high
        this.high = guess - 1;
        console.log('Too high! New range:', this.low, '-', this.high);
        this.highlightRange();
    }
};

// Make optimal binary search guess (AI helper)
BinarySearch.prototype.makeOptimalGuess = function() {
    if (!this.gameActive) return;

    const guess = Math.floor((this.low + this.high) / 2);
    this.makeGuess(guess);
};

// Visualize the guess path
BinarySearch.prototype.visualizeGuessPath = function() {
    const pathEntity = new pc.Entity('GuessPath');
    this.entity.addChild(pathEntity);

    this.guesses.forEach((guess, index) => {
        const guessMarker = new pc.Entity('Guess_' + index);
        pathEntity.addChild(guessMarker);

        const range = this.maxValue - this.minValue;
        const x = ((guess - this.minValue) / range) * 10 - 5;
        const y = index * 0.5; // Stack vertically

        guessMarker.setLocalPosition(x, y, 0);
        guessMarker.addComponent('model', { type: 'sphere' });
        guessMarker.setLocalScale(0.3, 0.3, 0.3);

        // Color based on result
        const isOptimal = this.isOptimalGuess(guess, index);
        const color = isOptimal ? new pc.Color(0, 1, 0) : new pc.Color(1, 1, 0);

        if (guessMarker.model && guessMarker.model.meshInstances[0]) {
            guessMarker.model.meshInstances[0].material.diffuse = color;
            guessMarker.model.meshInstances[0].material.update();
        }
    });
};

// Check if guess was optimal at that step
BinarySearch.prototype.isOptimalGuess = function(guess, step) {
    // Simulate binary search to check if guess was optimal
    let low = this.minValue;
    let high = this.maxValue;

    for (let i = 0; i <= step; i++) {
        const optimalGuess = Math.floor((low + high) / 2);

        if (i === step) {
            return guess === optimalGuess;
        }

        if (this.guesses[i] < this.targetNumber) {
            low = this.guesses[i] + 1;
        } else {
            high = this.guesses[i] - 1;
        }
    }

    return false;
};

// Highlight current search range
BinarySearch.prototype.highlightRange = function() {
    const rangeEntity = this.entity.findByName('CurrentRange');
    if (rangeEntity) rangeEntity.destroy();

    const range = new pc.Entity('CurrentRange');
    this.entity.addChild(range);

    const totalRange = this.maxValue - this.minValue;
    const x1 = ((this.low - this.minValue) / totalRange) * 10 - 5;
    const x2 = ((this.high - this.minValue) / totalRange) * 10 - 5;
    const centerX = (x1 + x2) / 2;
    const width = x2 - x1;

    range.setLocalPosition(centerX, -0.5, 0);
    range.addComponent('model', { type: 'box' });
    range.setLocalScale(width, 0.1, 0.5);

    if (range.model && range.model.meshInstances[0]) {
        range.model.meshInstances[0].material.diffuse = new pc.Color(0, 0.5, 1, 0.3);
        range.model.meshInstances[0].material.opacity = 0.3;
        range.model.meshInstances[0].material.blendType = pc.BLEND_NORMAL;
        range.model.meshInstances[0].material.update();
    }
};

// Keyboard input handler
BinarySearch.prototype.onKeyDown = function(event) {
    if (event.key === pc.KEY_SPACE) {
        // Auto-make optimal guess
        this.makeOptimalGuess();
    } else if (event.key === pc.KEY_R) {
        // Reset game
        this.startNewGame();
    }
};

// Update loop
BinarySearch.prototype.update = function(dt) {
    // Update UI elements
    // this.updateUI();
};

// Get current game stats
BinarySearch.prototype.getStats = function() {
    return {
        guesses: this.guesses.length,
        optimalGuesses: this.optimalGuesses,
        efficiency: Math.round((this.optimalGuesses / Math.max(1, this.guesses.length)) * 100),
        score: this.score,
        rangeSize: this.high - this.low + 1
    };
};
