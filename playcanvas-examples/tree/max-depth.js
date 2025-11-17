/** Maximum Depth - Game: "Deep Diver" */
var MaxDepth = pc.createScript('maxDepth');
MaxDepth.prototype.initialize = function() { this.score = 0; };
MaxDepth.prototype.maxDepth = function(root) {
    if (!root) return 0;
    
    const leftDepth = this.maxDepth(root.left);
    const rightDepth = this.maxDepth(root.right);
    
    const depth = 1 + Math.max(leftDepth, rightDepth);
    this.score = depth * 10;
    return depth;
};
