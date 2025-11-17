/** Clone Graph - Game: "Universe Clone" */
var CloneGraph = pc.createScript('cloneGraph');
CloneGraph.prototype.initialize = function() { this.score = 0; };
CloneGraph.prototype.cloneGraph = function(node) {
    if (!node) return null;
    
    const visited = new Map();
    
    const clone = (n) => {
        if (visited.has(n)) {
            return visited.get(n);
        }
        
        const copy = { val: n.val, neighbors: [] };
        visited.set(n, copy);
        this.score += 10;
        
        for (const neighbor of n.neighbors) {
            copy.neighbors.push(clone(neighbor));
        }
        
        return copy;
    };
    
    return clone(node);
};
