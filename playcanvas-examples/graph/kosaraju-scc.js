/** Kosaraju's SCC - Game: "Double Agent" */
var KosarajuSCC = pc.createScript('kosarajuSCC');
KosarajuSCC.prototype.initialize = function() { this.score = 0; };
KosarajuSCC.prototype.kosaraju = function(graph) {
    const visited = new Set();
    const stack = [];
    
    const dfs1 = (v) => {
        visited.add(v);
        for (const w of (graph[v] || [])) {
            if (!visited.has(w)) dfs1(w);
        }
        stack.push(v);
    };
    
    for (const v in graph) {
        if (!visited.has(v)) dfs1(v);
    }
    
    const transpose = {};
    for (const v in graph) {
        for (const w of graph[v]) {
            if (!transpose[w]) transpose[w] = [];
            transpose[w].push(v);
        }
    }
    
    visited.clear();
    const sccs = [];
    
    const dfs2 = (v, scc) => {
        visited.add(v);
        scc.push(v);
        for (const w of (transpose[v] || [])) {
            if (!visited.has(w)) dfs2(w, scc);
        }
    };
    
    while (stack.length > 0) {
        const v = stack.pop();
        if (!visited.has(v)) {
            const scc = [];
            dfs2(v, scc);
            sccs.push(scc);
            this.score += 20;
        }
    }
    
    return sccs;
};
