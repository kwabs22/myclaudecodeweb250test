/**
 * Binary Tree Preorder Traversal (Root-Left-Right)
 * Game: "Tree Walker - Preorder Path"
 */

var PreorderTraversal = pc.createScript('preorderTraversal');

PreorderTraversal.prototype.initialize = function() {
    this.result = [];
    this.score = 0;
};

PreorderTraversal.prototype.preorderTraversal = function(root) {
    this.result = [];
    this.traverse(root);
    return this.result;
};

PreorderTraversal.prototype.traverse = function(node) {
    if (!node) return;
    
    this.result.push(node.val);
    this.score += 5;
    this.traverse(node.left);
    this.traverse(node.right);
};

PreorderTraversal.prototype.iterative = function(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);
        this.score += 5;
        
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    
    return result;
};
