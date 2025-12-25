/**
 * Bubble Sort Visualization Game
 * Algorithm: Compare adjacent elements and swap if out of order
 * Game: "Bubble Rescue" - Swap adjacent bubbles to sort them before time runs out
 */

var BubbleSort = pc.createScript('bubbleSort');

// Attributes
BubbleSort.attributes.add('arraySize', {
    type: 'number',
    default: 10,
    description: 'Number of elements to sort'
});

BubbleSort.attributes.add('bubbleSpacing', {
    type: 'number',
    default: 1.5,
    description: 'Space between bubbles'
});

BubbleSort.attributes.add('sortSpeed', {
    type: 'number',
    default: 0.5,
    description: 'Time between comparisons (seconds)'
});

BubbleSort.attributes.add('bubblePrefab', {
    type: 'asset',
    assetType: 'template',
    description: 'Prefab for bubble entities'
});

// Initialize
BubbleSort.prototype.initialize = function() {
    this.bubbles = [];
    this.values = [];
    this.sorting = false;
    this.score = 0;
    this.timer = 0;
    this.currentIndex = 0;
    this.passComplete = false;

    // Generate random array
    this.generateArray();

    // Create visual bubbles
    this.createBubbles();

    // Setup input
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
};

// Generate random array
BubbleSort.prototype.generateArray = function() {
    this.values = [];
    for (let i = 0; i < this.arraySize; i++) {
        this.values.push(Math.floor(Math.random() * 100) + 1);
    }
};

// Create bubble entities
BubbleSort.prototype.createBubbles = function() {
    // Clear existing bubbles
    this.bubbles.forEach(bubble => bubble.destroy());
    this.bubbles = [];

    const startX = -(this.arraySize - 1) * this.bubbleSpacing / 2;

    for (let i = 0; i < this.arraySize; i++) {
        const bubble = this.bubblePrefab.resource.instantiate();
        this.entity.addChild(bubble);

        bubble.setLocalPosition(startX + i * this.bubbleSpacing, 0, 0);

        // Scale based on value
        const scale = this.values[i] / 100;
        bubble.setLocalScale(scale, scale, scale);

        // Color based on value (blue to red gradient)
        const color = new pc.Color(this.values[i] / 100, 0.3, 1 - this.values[i] / 100);
        bubble.model.meshInstances[0].material.diffuse = color;
        bubble.model.meshInstances[0].material.update();

        // Store value in bubble
        bubble.value = this.values[i];
        bubble.index = i;

        this.bubbles.push(bubble);
    }
};

// Update loop
BubbleSort.prototype.update = function(dt) {
    if (this.sorting) {
        this.timer += dt;

        if (this.timer >= this.sortSpeed) {
            this.timer = 0;
            this.bubbleSortStep();
        }
    }

    // Update UI
    this.updateUI();
};

// Perform one step of bubble sort
BubbleSort.prototype.bubbleSortStep = function() {
    if (this.currentIndex < this.arraySize - 1) {
        // Compare adjacent elements
        if (this.values[this.currentIndex] > this.values[this.currentIndex + 1]) {
            // Swap
            this.swap(this.currentIndex, this.currentIndex + 1);
            this.score += 10;
        }

        this.currentIndex++;

    } else {
        // Pass complete, check if sorted
        if (this.isSorted()) {
            this.sorting = false;
            this.score += 100;
            console.log('Sorting complete! Final score: ' + this.score);
        } else {
            // Start new pass
            this.currentIndex = 0;
        }
    }
};

// Swap two elements
BubbleSort.prototype.swap = function(i, j) {
    // Swap in values array
    const temp = this.values[i];
    this.values[i] = this.values[j];
    this.values[j] = temp;

    // Swap bubble positions
    const bubble1 = this.bubbles[i];
    const bubble2 = this.bubbles[j];

    const pos1 = bubble1.getLocalPosition().clone();
    const pos2 = bubble2.getLocalPosition().clone();

    bubble1.setLocalPosition(pos2);
    bubble2.setLocalPosition(pos1);

    // Swap in bubbles array
    this.bubbles[i] = bubble2;
    this.bubbles[j] = bubble1;

    // Update indices
    bubble1.index = j;
    bubble2.index = i;
};

// Check if array is sorted
BubbleSort.prototype.isSorted = function() {
    for (let i = 0; i < this.values.length - 1; i++) {
        if (this.values[i] > this.values[i + 1]) {
            return false;
        }
    }
    return true;
};

// Mouse click handler for manual swapping
BubbleSort.prototype.onMouseDown = function(event) {
    if (this.sorting) return;

    const camera = this.app.root.findByName('Camera');
    const from = camera.getPosition();
    const to = camera.camera.screenToWorld(event.x, event.y, camera.getPosition().z + 10);

    // Raycast to find clicked bubble
    const result = this.app.systems.rigidbody.raycastFirst(from, to);
    if (result && result.entity.parent === this.entity) {
        const clickedBubble = result.entity;

        if (!this.selectedBubble) {
            // First bubble selected
            this.selectedBubble = clickedBubble;
            clickedBubble.model.meshInstances[0].material.emissive = new pc.Color(1, 1, 0);
            clickedBubble.model.meshInstances[0].material.update();
        } else {
            // Second bubble selected, try to swap
            if (Math.abs(this.selectedBubble.index - clickedBubble.index) === 1) {
                // Adjacent bubbles, allow swap
                this.swap(this.selectedBubble.index, clickedBubble.index);
                this.score += 5;
            } else {
                // Not adjacent, penalty
                this.score -= 2;
            }

            // Deselect
            this.selectedBubble.model.meshInstances[0].material.emissive = new pc.Color(0, 0, 0);
            this.selectedBubble.model.meshInstances[0].material.update();
            this.selectedBubble = null;
        }
    }
};

// Start automatic sorting
BubbleSort.prototype.startAutoSort = function() {
    this.sorting = true;
    this.currentIndex = 0;
};

// Reset the game
BubbleSort.prototype.reset = function() {
    this.sorting = false;
    this.score = 0;
    this.currentIndex = 0;
    this.selectedBubble = null;
    this.generateArray();
    this.createBubbles();
};

// Update UI elements
BubbleSort.prototype.updateUI = function() {
    // This would update UI text elements in your scene
    // Example: this.entity.script.uiManager.updateScore(this.score);
};
