/** Binary Tree Maximum Path Sum - Game: "Gold Rush" */
var MaximumPathSum = pc.createScript('maximumPathSum');
MaximumPathSum.prototype.initialize = function() {
    this.maxSum = -Infinity;
    this.score = 0;
};
MaximumPathSum.prototype.maxPathSum = function(root) {
    this.maxSum = -Infinity;
    this.maxGain(root);
    this.score = Math.max(0, this.maxSum);
    return this.maxSum;
};
MaximumPathSum.prototype.maxGain = function(node) {
    if (!node) return 0;
    
    const leftGain = Math.max(this.maxGain(node.left), 0);
    const rightGain = Math.max(this.maxGain(node.right), 0);
    
    const priceNewPath = node.val + leftGain + rightGain;
    
    this.maxSum = Math.max(this.maxSum, priceNewPath);
    
    return node.val + Math.max(leftGain, rightGain);
};
