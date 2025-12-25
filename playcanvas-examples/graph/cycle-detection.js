/** Cycle Detection - Game: "Loop Detective" */
var CycleDetection = pc.createScript('cycleDetection');
CycleDetection.prototype.initialize = function() { this.score = 0; };
CycleDetection.prototype.hasCycle = function(graph) {
    const visited = new Set();
    const recStack = new Set();
    
    const dfs = (node) => {
        visited.add(node);
        recStack.add(node);
        
        for (const neighbor of (graph[node] || [])) {
            if (!visited.has(neighbor)) {
                if (dfs(neighbor)) return true;
            } else if (recStack.has(neighbor)) {
                return true;
            }
        }
        
        recStack.delete(node);
        return false;
    };
    
    for (const node in graph) {
        if (!visited.has(node) && dfs(node)) {
            return true;
        }
    }
    
    this.score += 50;
    return false;
};
