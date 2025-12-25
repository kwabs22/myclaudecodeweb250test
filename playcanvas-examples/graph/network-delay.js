/** Network Delay Time - Game: "Message Broadcast" */
var NetworkDelay = pc.createScript('networkDelay');
NetworkDelay.prototype.initialize = function() { this.score = 0; };
NetworkDelay.prototype.networkDelayTime = function(times, n, k) {
    const graph = Array(n + 1).fill(null).map(() => []);
    
    for (const [u, v, w] of times) {
        graph[u].push([v, w]);
    }
    
    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;
    
    const pq = [[0, k]];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a[0] - b[0]);
        const [time, node] = pq.shift();
        
        if (time > dist[node]) continue;
        
        for (const [neighbor, weight] of graph[node]) {
            const newDist = time + weight;
            if (newDist < dist[neighbor]) {
                dist[neighbor] = newDist;
                pq.push([newDist, neighbor]);
                this.score += 5;
            }
        }
    }
    
    const maxDist = Math.max(...dist.slice(1));
    return maxDist === Infinity ? -1 : maxDist;
};
