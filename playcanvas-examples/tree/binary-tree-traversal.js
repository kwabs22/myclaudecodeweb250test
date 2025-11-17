/**
 * Binary Tree Traversals
 * Algorithms: Inorder, Preorder, Postorder, Level-order traversals
 * Game: "Tree Explorer" - Collect items in specific traversal order
 */

var BinaryTreeTraversal = pc.createScript('binaryTreeTraversal');

// Attributes
BinaryTreeTraversal.attributes.add('traversalMode', {
    type: 'string',
    enum: [
        { 'Inorder': 'inorder' },
        { 'Preorder': 'preorder' },
        { 'Postorder': 'postorder' },
        { 'Level Order': 'levelorder' }
    ],
    default: 'inorder',
    description: 'Tree traversal algorithm to use'
});

BinaryTreeTraversal.attributes.add('treeDepth', {
    type: 'number',
    default: 3,
    min: 1,
    max: 5,
    description: 'Maximum depth of tree'
});

BinaryTreeTraversal.attributes.add('animateTraversal', {
    type: 'boolean',
    default: true,
    description: 'Animate traversal step by step'
});

BinaryTreeTraversal.attributes.add('stepDelay', {
    type: 'number',
    default: 0.5,
    description: 'Delay between traversal steps'
});

// Tree Node class
function TreeNode(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.entity = null;
}

// Initialize
BinaryTreeTraversal.prototype.initialize = function() {
    this.root = null;
    this.traversalOrder = [];
    this.currentStep = 0;
    this.animating = false;
    this.timer = 0;
    this.playerOrder = [];
    this.score = 0;

    // Build tree
    this.buildTree();

    // Calculate correct traversal
    this.calculateTraversal();

    // Setup input
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onNodeClick, this);
};

// Build random binary tree
BinaryTreeTraversal.prototype.buildTree = function() {
    // Clear old tree
    const oldTree = this.entity.findByName('TreeContainer');
    if (oldTree) oldTree.destroy();

    const container = new pc.Entity('TreeContainer');
    this.entity.addChild(container);

    // Create balanced tree
    const values = [];
    for (let i = 1; i <= Math.pow(2, this.treeDepth) - 1; i++) {
        values.push(i);
    }

    this.root = this.buildTreeRecursive(values, 0, values.length - 1, 0, 0, 0);
    this.createTreeVisuals(this.root, 0, 0, 0, 4);
};

// Build tree recursively
BinaryTreeTraversal.prototype.buildTreeRecursive = function(values, start, end, depth, x, y) {
    if (start > end || depth >= this.treeDepth) return null;

    const mid = Math.floor((start + end) / 2);
    const node = new TreeNode(values[mid]);

    const horizontalSpacing = 4 / Math.pow(2, depth);

    node.left = this.buildTreeRecursive(values, start, mid - 1, depth + 1, x - horizontalSpacing, y - 2);
    node.right = this.buildTreeRecursive(values, mid + 1, end, depth + 1, x + horizontalSpacing, y - 2);

    return node;
};

// Create visual representation of tree
BinaryTreeTraversal.prototype.createTreeVisuals = function(node, x, y, z, spacing) {
    if (!node) return;

    const container = this.entity.findByName('TreeContainer');

    // Create node entity
    const nodeEntity = new pc.Entity('Node_' + node.value);
    container.addChild(nodeEntity);

    nodeEntity.setLocalPosition(x, y, z);
    nodeEntity.addComponent('model', { type: 'sphere' });
    nodeEntity.setLocalScale(0.5, 0.5, 0.5);

    // Color
    if (nodeEntity.model && nodeEntity.model.meshInstances[0]) {
        nodeEntity.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.7, 0.3);
        nodeEntity.model.meshInstances[0].material.update();
    }

    node.entity = nodeEntity;
    nodeEntity.treeNode = node;

    // Create edges to children
    if (node.left) {
        const leftPos = new pc.Vec3(x - spacing / 2, y - 2, z);
        this.createEdge(nodeEntity.getPosition(), leftPos);
        this.createTreeVisuals(node.left, leftPos.x, leftPos.y, leftPos.z, spacing / 2);
    }

    if (node.right) {
        const rightPos = new pc.Vec3(x + spacing / 2, y - 2, z);
        this.createEdge(nodeEntity.getPosition(), rightPos);
        this.createTreeVisuals(node.right, rightPos.x, rightPos.y, rightPos.z, spacing / 2);
    }
};

// Create edge between nodes
BinaryTreeTraversal.prototype.createEdge = function(from, to) {
    const container = this.entity.findByName('TreeContainer');
    const edge = new pc.Entity('Edge');
    container.addChild(edge);

    const midpoint = new pc.Vec3().add2(from, to).scale(0.5);
    edge.setPosition(midpoint);

    edge.addComponent('model', { type: 'cylinder' });

    const distance = from.distance(to);
    edge.setLocalScale(0.05, distance / 2, 0.05);

    // Orient cylinder to connect nodes
    edge.lookAt(to);
    edge.rotateLocal(90, 0, 0);

    if (edge.model && edge.model.meshInstances[0]) {
        edge.model.meshInstances[0].material.diffuse = new pc.Color(0.5, 0.5, 0.5);
        edge.model.meshInstances[0].material.update();
    }
};

// Calculate traversal order
BinaryTreeTraversal.prototype.calculateTraversal = function() {
    this.traversalOrder = [];

    switch (this.traversalMode) {
        case 'inorder':
            this.inorderTraversal(this.root);
            break;
        case 'preorder':
            this.preorderTraversal(this.root);
            break;
        case 'postorder':
            this.postorderTraversal(this.root);
            break;
        case 'levelorder':
            this.levelOrderTraversal(this.root);
            break;
    }

    console.log(this.traversalMode + ' traversal:', this.traversalOrder.map(n => n.value).join(' -> '));
};

// Inorder: Left -> Root -> Right
BinaryTreeTraversal.prototype.inorderTraversal = function(node) {
    if (!node) return;

    this.inorderTraversal(node.left);
    this.traversalOrder.push(node);
    this.inorderTraversal(node.right);
};

// Preorder: Root -> Left -> Right
BinaryTreeTraversal.prototype.preorderTraversal = function(node) {
    if (!node) return;

    this.traversalOrder.push(node);
    this.preorderTraversal(node.left);
    this.preorderTraversal(node.right);
};

// Postorder: Left -> Right -> Root
BinaryTreeTraversal.prototype.postorderTraversal = function(node) {
    if (!node) return;

    this.postorderTraversal(node.left);
    this.postorderTraversal(node.right);
    this.traversalOrder.push(node);
};

// Level Order: BFS, level by level
BinaryTreeTraversal.prototype.levelOrderTraversal = function(root) {
    if (!root) return;

    const queue = [root];

    while (queue.length > 0) {
        const node = queue.shift();
        this.traversalOrder.push(node);

        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
};

// Start automatic traversal animation
BinaryTreeTraversal.prototype.startAnimation = function() {
    this.animating = true;
    this.currentStep = 0;
    this.timer = 0;

    // Reset all node colors
    this.resetNodeColors();
};

// Reset all node colors
BinaryTreeTraversal.prototype.resetNodeColors = function() {
    this.traversalOrder.forEach(node => {
        if (node.entity && node.entity.model && node.entity.model.meshInstances[0]) {
            node.entity.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.7, 0.3);
            node.entity.model.meshInstances[0].material.update();
        }
    });
};

// Animate one step
BinaryTreeTraversal.prototype.animateStep = function() {
    if (this.currentStep >= this.traversalOrder.length) {
        this.animating = false;
        console.log('Traversal complete!');
        return;
    }

    const node = this.traversalOrder[this.currentStep];

    // Highlight current node
    if (node.entity && node.entity.model && node.entity.model.meshInstances[0]) {
        node.entity.model.meshInstances[0].material.emissive = new pc.Color(1, 1, 0);
        node.entity.model.meshInstances[0].material.update();
    }

    this.currentStep++;
};

// Handle node click
BinaryTreeTraversal.prototype.onNodeClick = function(event) {
    if (this.animating) return;

    const camera = this.app.root.findByName('Camera');
    if (!camera) return;

    const from = camera.getPosition();
    const to = camera.camera.screenToWorld(event.x, event.y, camera.getPosition().z + 10);

    const result = this.app.systems.rigidbody.raycastFirst(from, to);

    if (result && result.entity.treeNode) {
        this.playerClickNode(result.entity.treeNode);
    }
};

// Player clicks a node
BinaryTreeTraversal.prototype.playerClickNode = function(node) {
    this.playerOrder.push(node);

    console.log('Clicked node:', node.value);

    // Check if click is correct
    const expectedNode = this.traversalOrder[this.playerOrder.length - 1];

    if (node === expectedNode) {
        // Correct!
        if (node.entity && node.entity.model && node.entity.model.meshInstances[0]) {
            node.entity.model.meshInstances[0].material.diffuse = new pc.Color(0, 1, 0);
            node.entity.model.meshInstances[0].material.update();
        }

        this.score += 10;

        if (this.playerOrder.length === this.traversalOrder.length) {
            console.log('Perfect! You completed the', this.traversalMode, 'traversal!');
            this.score += 100;
        }

    } else {
        // Wrong!
        console.log('Wrong node! Expected:', expectedNode.value);

        if (node.entity && node.entity.model && node.entity.model.meshInstances[0]) {
            node.entity.model.meshInstances[0].material.diffuse = new pc.Color(1, 0, 0);
            node.entity.model.meshInstances[0].material.update();
        }

        this.score -= 5;
        this.resetPlayerProgress();
    }
};

// Reset player progress
BinaryTreeTraversal.prototype.resetPlayerProgress = function() {
    this.playerOrder = [];
    this.resetNodeColors();
};

// Update loop
BinaryTreeTraversal.prototype.update = function(dt) {
    if (this.animating && this.animateTraversal) {
        this.timer += dt;

        if (this.timer >= this.stepDelay) {
            this.timer = 0;
            this.animateStep();
        }
    }
};

// Change traversal mode
BinaryTreeTraversal.prototype.setTraversalMode = function(mode) {
    this.traversalMode = mode;
    this.calculateTraversal();
    this.resetPlayerProgress();
};
