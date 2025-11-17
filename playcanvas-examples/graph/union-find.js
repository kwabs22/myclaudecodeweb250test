/** Union-Find (Disjoint Set) - Game: "Clan Merger" */
var UnionFind = pc.createScript('unionFind');
UnionFind.prototype.initialize = function() {
    this.parent = {};
    this.rank = {};
    this.score = 0;
};
UnionFind.prototype.makeSet = function(x) {
    this.parent[x] = x;
    this.rank[x] = 0;
};
UnionFind.prototype.find = function(x) {
    if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
};
UnionFind.prototype.union = function(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX !== rootY) {
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        this.score += 10;
    }
};
