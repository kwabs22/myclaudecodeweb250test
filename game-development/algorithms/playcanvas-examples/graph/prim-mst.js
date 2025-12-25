/** Prim's MST - Game: "Power Grid" */
var PrimMST = pc.createScript('primMST');
PrimMST.prototype.initialize = function() { this.score = 0; };
PrimMST.prototype.primMST = function(graph) {
    const n = graph.length;
    const visited = new Array(n).fill(false);
    const minCost = new Array(n).fill(Infinity);
    const parent = new Array(n).fill(-1);
    
    minCost[0] = 0;
    let totalCost = 0;
    
    for (let i = 0; i < n; i++) {
        let u = -1;
        for (let v = 0; v < n; v++) {
            if (!visited[v] && (u === -1 || minCost[v] < minCost[u])) {
                u = v;
            }
        }
        
        visited[u] = true;
        totalCost += minCost[u];
        
        for (let v = 0; v < n; v++) {
            if (graph[u][v] && !visited[v] && graph[u][v] < minCost[v]) {
                minCost[v] = graph[u][v];
                parent[v] = u;
            }
        }
    }
    
    this.score = 1000 - totalCost;
    return totalCost;
};
