/** Minimum Depth - Game: "Quick Escape" */
var MinimumDepth = pc.createScript('minimumDepth');
MinimumDepth.prototype.initialize = function() { this.score = 0; };
MinimumDepth.prototype.minDepth = function(root) {
    if (!root) return 0;
    
    if (!root.left && !root.right) {
        return 1;
    }
    
    let minDepth = Infinity;
    
    if (root.left) {
        minDepth = Math.min(minDepth, this.minDepth(root.left));
    }
    
    if (root.right) {
        minDepth = Math.min(minDepth, this.minDepth(root.right));
    }
    
    this.score = (100 / minDepth) * 10;
    return minDepth + 1;
};
