/** Bellman-Ford - Game: "Time Traveler" */
var BellmanFord = pc.createScript('bellmanFord');
BellmanFord.prototype.initialize = function() { this.score = 0; };
BellmanFord.prototype.bellmanFord = function(n, edges, src) {
    const dist = new Array(n).fill(Infinity);
    dist[src] = 0;
    
    for (let i = 0; i < n - 1; i++) {
        for (const [u, v, w] of edges) {
            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                this.score += 5;
            }
        }
    }
    
    // Check for negative cycles
    for (const [u, v, w] of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
            console.log('Negative cycle detected!');
            return null;
        }
    }
    
    return dist;
};
