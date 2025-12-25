/** N-ary Tree Traversal - Game: "Family Reunion" */
var NaryTreeTraversal = pc.createScript('naryTreeTraversal');
NaryTreeTraversal.prototype.initialize = function() { this.score = 0; };
NaryTreeTraversal.prototype.preorder = function(root) {
    const result = [];
    
    const traverse = (node) => {
        if (!node) return;
        
        result.push(node.val);
        this.score += 5;
        
        for (const child of node.children || []) {
            traverse(child);
        }
    };
    
    traverse(root);
    return result;
};
NaryTreeTraversal.prototype.postorder = function(root) {
    const result = [];
    
    const traverse = (node) => {
        if (!node) return;
        
        for (const child of node.children || []) {
            traverse(child);
        }
        
        result.push(node.val);
        this.score += 5;
    };
    
    traverse(root);
    return result;
};
NaryTreeTraversal.prototype.levelOrder = function(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            for (const child of node.children || []) {
                queue.push(child);
            }
        }
        
        result.push(currentLevel);
        this.score += 10;
    }
    
    return result;
};
