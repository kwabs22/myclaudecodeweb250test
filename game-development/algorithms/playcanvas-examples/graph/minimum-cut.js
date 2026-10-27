/** Minimum Cut - Game: "Siege Warfare" */
var MinimumCut = pc.createScript('minimumCut');
MinimumCut.prototype.initialize = function() { this.score = 0; };
MinimumCut.prototype.minCut = function(graph, source, sink) {
    // Min cut = Max flow (by max-flow min-cut theorem). Use the MaximumFlow script on the same entity when there
    // is one, otherwise compute the flow here so this script works on its own.
    const maxFlowScript = this.entity.script && this.entity.script.maximumFlow;
    const minCutValue = maxFlowScript ? maxFlowScript.maxFlow(graph, source, sink) : this.edmondsKarp(graph, source, sink);
    this.score = 1000 - minCutValue;

    console.log('Minimum cut value:', minCutValue);
    return minCutValue;
};

// Edmonds-Karp: repeatedly push flow along a shortest augmenting path
MinimumCut.prototype.edmondsKarp = function(graph, source, sink) {
    const n = graph.length;
    const residual = graph.map(row => [...row]);
    let flow = 0;

    for (;;) {
        const parent = new Array(n).fill(-1);
        parent[source] = source;
        const queue = [source];
        while (queue.length > 0 && parent[sink] === -1) {
            const u = queue.shift();
            for (let v = 0; v < n; v++) {
                if (parent[v] === -1 && residual[u][v] > 0) {
                    parent[v] = u;
                    queue.push(v);
                }
            }
        }
        if (parent[sink] === -1) return flow;

        let push = Infinity;
        for (let v = sink; v !== source; v = parent[v]) push = Math.min(push, residual[parent[v]][v]);
        for (let v = sink; v !== source; v = parent[v]) {
            residual[parent[v]][v] -= push;
            residual[v][parent[v]] += push;
        }
        flow += push;
    }
};
