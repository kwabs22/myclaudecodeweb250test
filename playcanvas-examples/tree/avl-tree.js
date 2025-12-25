/** AVL Tree - Game: "Balance Master" */
var AVLTree = pc.createScript('avlTree');
AVLTree.prototype.initialize = function() {
    this.root = null;
    this.score = 0;
};
AVLTree.prototype.height = function(node) {
    return node ? node.height : 0;
};
AVLTree.prototype.getBalance = function(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
};
AVLTree.prototype.rotateRight = function(y) {
    const x = y.left;
    const T2 = x.right;
    
    x.right = y;
    y.left = T2;
    
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    
    this.score += 10;
    return x;
};
AVLTree.prototype.rotateLeft = function(x) {
    const y = x.right;
    const T2 = y.left;
    
    y.left = x;
    x.right = T2;
    
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    
    this.score += 10;
    return y;
};
AVLTree.prototype.insert = function(node, value) {
    if (!node) {
        return { value, left: null, right: null, height: 1 };
    }
    
    if (value < node.value) {
        node.left = this.insert(node.left, value);
    } else if (value > node.value) {
        node.right = this.insert(node.right, value);
    } else {
        return node;
    }
    
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    
    const balance = this.getBalance(node);
    
    if (balance > 1 && value < node.left.value) {
        return this.rotateRight(node);
    }
    
    if (balance < -1 && value > node.right.value) {
        return this.rotateLeft(node);
    }
    
    if (balance > 1 && value > node.left.value) {
        node.left = this.rotateLeft(node.left);
        return this.rotateRight(node);
    }
    
    if (balance < -1 && value < node.right.value) {
        node.right = this.rotateRight(node.right);
        return this.rotateLeft(node);
    }
    
    return node;
};
