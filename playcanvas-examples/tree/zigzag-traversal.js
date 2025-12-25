/** ZigZag Level Order Traversal - Game: "Ski Slalom" */
var ZigZagTraversal = pc.createScript('zigZagTraversal');
ZigZagTraversal.prototype.initialize = function() { this.score = 0; };
ZigZagTraversal.prototype.zigzagLevelOrder = function(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    let leftToRight = true;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        if (!leftToRight) {
            currentLevel.reverse();
        }
        
        result.push(currentLevel);
        leftToRight = !leftToRight;
        this.score += 10;
    }
    
    return result;
};
