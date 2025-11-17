/**
 * Binary Tree Postorder Traversal (Left-Right-Root)
 * Game: "Tree Walker - Postorder Path"
 */

var PostorderTraversal = pc.createScript('postorderTraversal');

PostorderTraversal.prototype.initialize = function() {
    this.result = [];
    this.score = 0;
};

PostorderTraversal.prototype.postorderTraversal = function(root) {
    this.result = [];
    this.traverse(root);
    return this.result;
};

PostorderTraversal.prototype.traverse = function(node) {
    if (!node) return;
    
    this.traverse(node.left);
    this.traverse(node.right);
    this.result.push(node.val);
    this.score += 5;
};

PostorderTraversal.prototype.iterative = function(root) {
    if (!root) return [];
    
    const result = [];
    const stack1 = [root];
    const stack2 = [];
    
    while (stack1.length > 0) {
        const node = stack1.pop();
        stack2.push(node);
        
        if (node.left) stack1.push(node.left);
        if (node.right) stack1.push(node.right);
    }
    
    while (stack2.length > 0) {
        result.push(stack2.pop().val);
        this.score += 5;
    }
    
    return result;
};
