/** Balanced Tree Check - Game: "Balance Beam" */
var BalancedCheck = pc.createScript('balancedCheck');
BalancedCheck.prototype.initialize = function() { this.score = 0; };
BalancedCheck.prototype.isBalanced = function(root) {
    return this.checkHeight(root) !== -1;
};
BalancedCheck.prototype.checkHeight = function(node) {
    if (!node) return 0;
    
    const left = this.checkHeight(node.left);
    if (left === -1) return -1;
    
    const right = this.checkHeight(node.right);
    if (right === -1) return -1;
    
    if (Math.abs(left - right) > 1) return -1;
    
    this.score += 5;
    return 1 + Math.max(left, right);
};
