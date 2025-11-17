/** Symmetric Tree - Game: "Mirror Palace" */
var SymmetricTree = pc.createScript('symmetricTree');
SymmetricTree.prototype.initialize = function() { this.score = 0; };
SymmetricTree.prototype.isSymmetric = function(root) {
    const isMirror = (t1, t2) => {
        if (!t1 && !t2) return true;
        if (!t1 || !t2) return false;
        this.score += 5;
        return t1.val === t2.val &&
               isMirror(t1.left, t2.right) &&
               isMirror(t1.right, t2.left);
    };
    return root ? isMirror(root.left, root.right) : true;
};
