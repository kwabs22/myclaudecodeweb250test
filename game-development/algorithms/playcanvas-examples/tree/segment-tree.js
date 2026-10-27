/** Segment Tree - Game: "Territory Manager" */
var SegmentTree = pc.createScript('segmentTree');
SegmentTree.prototype.initialize = function() {
    this.tree = [];
    this.arr = [1, 3, 5, 7, 9, 11];
    this.buildTree(0, 0, this.arr.length - 1);
};
SegmentTree.prototype.buildTree = function(node, start, end) {
    if (start === end) {
        this.tree[node] = this.arr[start];
    } else {
        const mid = Math.floor((start + end) / 2);
        this.buildTree(2 * node + 1, start, mid);
        this.buildTree(2 * node + 2, mid + 1, end);
        this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
};
SegmentTree.prototype.query = function(node, start, end, l, r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree[node];
    const mid = Math.floor((start + end) / 2);
    return this.query(2 * node + 1, start, mid, l, r) +
           this.query(2 * node + 2, mid + 1, end, l, r);
};
// Point update: set arr[index] to value and fix the sums above it. Named setValue(), not update(), because
// PlayCanvas calls a script's update(dt) every frame.
SegmentTree.prototype.setValue = function(index, value, node = 0, start = 0, end = this.arr.length - 1) {
    if (start === end) {
        this.arr[index] = value;
        this.tree[node] = value;
        return;
    }
    const mid = Math.floor((start + end) / 2);
    if (index <= mid) this.setValue(index, value, 2 * node + 1, start, mid);
    else this.setValue(index, value, 2 * node + 2, mid + 1, end);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
};
