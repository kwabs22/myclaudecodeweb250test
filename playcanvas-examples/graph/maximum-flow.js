/** Maximum Flow (Ford-Fulkerson) - Game: "Pipeline Manager" */
var MaximumFlow = pc.createScript('maximumFlow');
MaximumFlow.prototype.initialize = function() { this.score = 0; };
MaximumFlow.prototype.maxFlow = function(graph, source, sink) {
    const residual = graph.map(row => [...row]);
    const parent = new Array(graph.length).fill(-1);
    let maxFlow = 0;
    
    const bfs = () => {
        const visited = new Array(graph.length).fill(false);
        const queue = [source];
        visited[source] = true;
        
        while (queue.length > 0) {
            const u = queue.shift();
            
            for (let v = 0; v < graph.length; v++) {
                if (!visited[v] && residual[u][v] > 0) {
                    visited[v] = true;
                    parent[v] = u;
                    queue.push(v);
                    
                    if (v === sink) return true;
                }
            }
        }
        
        return false;
    };
    
    while (bfs()) {
        let pathFlow = Infinity;
        
        for (let v = sink; v !== source; v = parent[v]) {
            const u = parent[v];
            pathFlow = Math.min(pathFlow, residual[u][v]);
        }
        
        for (let v = sink; v !== source; v = parent[v]) {
            const u = parent[v];
            residual[u][v] -= pathFlow;
            residual[v][u] += pathFlow;
        }
        
        maxFlow += pathFlow;
        this.score += pathFlow;
    }
    
    return maxFlow;
};
