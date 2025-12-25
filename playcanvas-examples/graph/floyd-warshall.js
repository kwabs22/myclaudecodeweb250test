/** Floyd-Warshall All-Pairs Shortest Path - Game: "Network Architect" */
var FloydWarshall = pc.createScript('floydWarshall');
FloydWarshall.prototype.initialize = function() { this.score = 0; };
FloydWarshall.prototype.floydWarshall = function(graph) {
    const n = graph.length;
    const dist = graph.map(row => [...row]);
    
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                    this.score += 1;
                }
            }
        }
    }
    return dist;
};
