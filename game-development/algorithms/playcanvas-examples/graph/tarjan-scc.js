/** Tarjan's Strongly Connected Components - Game: "Social Circles" */
var TarjanSCC = pc.createScript('tarjanSCC');
TarjanSCC.prototype.initialize = function() {
    this.index = 0;
    this.stack = [];
    this.indices = {};
    this.lowlinks = {};
    this.onStack = {};
    this.sccs = [];
    this.score = 0;
};
TarjanSCC.prototype.strongConnect = function(v, graph) {
    this.indices[v] = this.index;
    this.lowlinks[v] = this.index;
    this.index++;
    this.stack.push(v);
    this.onStack[v] = true;
    
    for (const w of (graph[v] || [])) {
        if (this.indices[w] === undefined) {
            this.strongConnect(w, graph);
            this.lowlinks[v] = Math.min(this.lowlinks[v], this.lowlinks[w]);
        } else if (this.onStack[w]) {
            this.lowlinks[v] = Math.min(this.lowlinks[v], this.indices[w]);
        }
    }
    
    if (this.lowlinks[v] === this.indices[v]) {
        const scc = [];
        let w;
        do {
            w = this.stack.pop();
            this.onStack[w] = false;
            scc.push(w);
        } while (w !== v);
        this.sccs.push(scc);
        this.score += 20;
    }
};
TarjanSCC.prototype.findSCCs = function(graph) {
    this.sccs = [];
    for (const v in graph) {
        if (this.indices[v] === undefined) {
            this.strongConnect(v, graph);
        }
    }
    return this.sccs;
};
