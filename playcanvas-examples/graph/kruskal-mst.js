/**
 * Kruskal's Minimum Spanning Tree
 * Algorithm: Build MST by adding cheapest edges without cycles
 * Game: "Bridge Builder" - Connect islands with minimum total bridge cost
 */

var KruskalMST = pc.createScript('kruskalMST');

KruskalMST.prototype.initialize = function() {
    this.edges = [];
    this.mst = [];
    this.parent = {};
    this.rank = {};
    this.score = 0;

    this.buildGraph();
    this.kruskal();
};

KruskalMST.prototype.makeSet = function(x) {
    this.parent[x] = x;
    this.rank[x] = 0;
};

KruskalMST.prototype.find = function(x) {
    if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
};

KruskalMST.prototype.union = function(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
    } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
    }

    return true;
};

KruskalMST.prototype.buildGraph = function() {
    const nodes = ['A', 'B', 'C', 'D', 'E'];
    nodes.forEach(node => this.makeSet(node));

    this.addEdge('A', 'B', 4);
    this.addEdge('A', 'C', 2);
    this.addEdge('B', 'C', 1);
    this.addEdge('B', 'D', 5);
    this.addEdge('C', 'D', 8);
    this.addEdge('C', 'E', 10);
    this.addEdge('D', 'E', 2);
};

KruskalMST.prototype.addEdge = function(u, v, weight) {
    this.edges.push({ u, v, weight });
};

KruskalMST.prototype.kruskal = function() {
    this.edges.sort((a, b) => a.weight - b.weight);

    let totalCost = 0;

    this.edges.forEach(edge => {
        if (this.union(edge.u, edge.v)) {
            this.mst.push(edge);
            totalCost += edge.weight;
            console.log('Added edge:', edge.u, '-', edge.v, 'weight:', edge.weight);
        }
    });

    console.log('MST total cost:', totalCost);
    this.score = 1000 - totalCost;
};

KruskalMST.prototype.reset = function() {
    this.mst = [];
    this.score = 0;
};
