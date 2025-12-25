/** Traveling Salesman (Approximation) - Game: "World Tour" */
var TravelingSalesman = pc.createScript('travelingSalesman');
TravelingSalesman.prototype.initialize = function() { this.score = 0; };
TravelingSalesman.prototype.tspNearestNeighbor = function(graph) {
    const n = graph.length;
    const visited = new Array(n).fill(false);
    const path = [0];
    visited[0] = true;
    let totalCost = 0;
    
    for (let i = 0; i < n - 1; i++) {
        const current = path[path.length - 1];
        let nearest = -1;
        let minDist = Infinity;
        
        for (let j = 0; j < n; j++) {
            if (!visited[j] && graph[current][j] < minDist) {
                minDist = graph[current][j];
                nearest = j;
            }
        }
        
        path.push(nearest);
        visited[nearest] = true;
        totalCost += minDist;
        this.score += 10;
    }
    
    totalCost += graph[path[path.length - 1]][0];
    
    console.log('TSP path:', path, 'Cost:', totalCost);
    this.score = Math.max(0, 1000 - totalCost);
    
    return { path, cost: totalCost };
};
