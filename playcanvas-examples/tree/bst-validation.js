/**
 * Binary Search Tree Validation
 * Algorithm: Check if tree maintains BST property
 * Game: "Tree Inspector" - Validate organizational hierarchy
 */

var BSTValidation = pc.createScript('bstValidation');

BSTValidation.prototype.initialize = function() {
    this.root = null;
    this.score = 0;

    this.buildExampleTree();
    this.validateTree();
};

BSTValidation.prototype.validateBST = function(node, min = -Infinity, max = Infinity) {
    if (!node) return true;

    if (node.value <= min || node.value >= max) {
        return false;
    }

    return this.validateBST(node.left, min, node.value) &&
           this.validateBST(node.right, node.value, max);
};

BSTValidation.prototype.buildExampleTree = function() {
    function TreeNode(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }

    this.root = new TreeNode(10);
    this.root.left = new TreeNode(5);
    this.root.right = new TreeNode(15);
    this.root.left.left = new TreeNode(2);
    this.root.left.right = new TreeNode(7);
    this.root.right.right = new TreeNode(20);
};

BSTValidation.prototype.validateTree = function() {
    const isValid = this.validateBST(this.root);
    console.log('BST is valid:', isValid);

    if (isValid) {
        this.score += 100;
    }
};

BSTValidation.prototype.reset = function() {
    this.score = 0;
};
