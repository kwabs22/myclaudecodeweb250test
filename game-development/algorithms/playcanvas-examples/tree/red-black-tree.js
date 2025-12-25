/** Red-Black Tree - Game: "Color Code" */
var RedBlackTree = pc.createScript('redBlackTree');
RedBlackTree.prototype.initialize = function() {
    this.RED = true;
    this.BLACK = false;
    this.root = null;
    this.score = 0;
};
RedBlackTree.prototype.isRed = function(node) {
    return node ? node.color === this.RED : false;
};
RedBlackTree.prototype.rotateLeft = function(h) {
    const x = h.right;
    h.right = x.left;
    x.left = h;
    x.color = h.color;
    h.color = this.RED;
    this.score += 10;
    return x;
};
RedBlackTree.prototype.rotateRight = function(h) {
    const x = h.left;
    h.left = x.right;
    x.right = h;
    x.color = h.color;
    h.color = this.RED;
    this.score += 10;
    return x;
};
RedBlackTree.prototype.flipColors = function(h) {
    h.color = this.RED;
    h.left.color = this.BLACK;
    h.right.color = this.BLACK;
    this.score += 5;
};
RedBlackTree.prototype.insert = function(node, value) {
    if (!node) {
        return { value, left: null, right: null, color: this.RED };
    }
    
    if (value < node.value) {
        node.left = this.insert(node.left, value);
    } else if (value > node.value) {
        node.right = this.insert(node.right, value);
    }
    
    if (this.isRed(node.right) && !this.isRed(node.left)) {
        node = this.rotateLeft(node);
    }
    
    if (this.isRed(node.left) && this.isRed(node.left.left)) {
        node = this.rotateRight(node);
    }
    
    if (this.isRed(node.left) && this.isRed(node.right)) {
        this.flipColors(node);
    }
    
    return node;
};
