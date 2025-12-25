/** Path Sum - Game: "Treasure Path" */
var PathSum = pc.createScript('pathSum');
PathSum.prototype.initialize = function() { this.score = 0; };
PathSum.prototype.hasPathSum = function(root, targetSum) {
    if (!root) return false;
    
    if (!root.left && !root.right) {
        return root.val === targetSum;
    }
    
    this.score += 5;
    return this.hasPathSum(root.left, targetSum - root.val) ||
           this.hasPathSum(root.right, targetSum - root.val);
};
