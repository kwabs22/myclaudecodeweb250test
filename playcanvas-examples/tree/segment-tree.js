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
