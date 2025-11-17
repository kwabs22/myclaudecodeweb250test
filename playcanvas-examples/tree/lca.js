/** Lowest Common Ancestor - Game: "Family Tree" */
var LCA = pc.createScript('lca');
LCA.prototype.initialize = function() { this.score = 0; };
LCA.prototype.lowestCommonAncestor = function(root, p, q) {
    if (!root || root === p || root === q) return root;
    
    const left = this.lowestCommonAncestor(root.left, p, q);
    const right = this.lowestCommonAncestor(root.right, p, q);
    
    if (left && right) {
        this.score += 50;
        return root;
    }
    return left || right;
};
