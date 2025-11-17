/** Fenwick Tree (Binary Indexed Tree) - Game: "Score Tracker" */
var FenwickTree = pc.createScript('fenwickTree');
FenwickTree.prototype.initialize = function() {
    this.tree = [];
    this.score = 0;
};
FenwickTree.prototype.init = function(n) {
    this.tree = new Array(n + 1).fill(0);
};
FenwickTree.prototype.update = function(i, delta) {
    while (i < this.tree.length) {
        this.tree[i] += delta;
        i += i & (-i);
        this.score += 1;
    }
};
FenwickTree.prototype.query = function(i) {
    let sum = 0;
    while (i > 0) {
        sum += this.tree[i];
        i -= i & (-i);
    }
    return sum;
};
FenwickTree.prototype.rangeQuery = function(left, right) {
    return this.query(right) - this.query(left - 1);
};
