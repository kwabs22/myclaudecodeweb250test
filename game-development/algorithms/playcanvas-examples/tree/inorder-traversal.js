/**
 * Binary Tree Inorder Traversal (Left-Root-Right)
 * Game: "Tree Walker - Inorder Path"
 */

var InorderTraversal = pc.createScript('inorderTraversal');

InorderTraversal.prototype.initialize = function() {
    this.result = [];
    this.score = 0;
};

InorderTraversal.prototype.inorderTraversal = function(root) {
    this.result = [];
    this.traverse(root);
    return this.result;
};

InorderTraversal.prototype.traverse = function(node) {
    if (!node) return;
    
    this.traverse(node.left);
    this.result.push(node.val);
    this.score += 5;
    this.traverse(node.right);
};

InorderTraversal.prototype.iterative = function(root) {
    const result = [];
    const stack = [];
    let current = root;
    
    while (current || stack.length > 0) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        current = stack.pop();
        result.push(current.val);
        this.score += 5;
        current = current.right;
    }
    
    return result;
};
