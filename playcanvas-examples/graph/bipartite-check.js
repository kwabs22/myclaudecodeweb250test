/** Bipartite Graph Check - Game: "Team Divider" */
var BipartiteCheck = pc.createScript('bipartiteCheck');
BipartiteCheck.prototype.initialize = function() { this.score = 0; };
BipartiteCheck.prototype.isBipartite = function(graph) {
    const color = new Array(graph.length).fill(-1);
    
    for (let i = 0; i < graph.length; i++) {
        if (color[i] === -1) {
            const queue = [i];
            color[i] = 0;
            
            while (queue.length > 0) {
                const node = queue.shift();
                
                for (const neighbor of graph[node]) {
                    if (color[neighbor] === -1) {
                        color[neighbor] = 1 - color[node];
                        queue.push(neighbor);
                    } else if (color[neighbor] === color[node]) {
                        return false;
                    }
                }
            }
        }
    }
    
    this.score += 100;
    return true;
};
