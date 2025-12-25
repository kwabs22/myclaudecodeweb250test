/** Graph Coloring - Game: "Map Painter" */
var GraphColoring = pc.createScript('graphColoring');
GraphColoring.prototype.initialize = function() { this.score = 0; };
GraphColoring.prototype.graphColoring = function(graph, m) {
    const n = graph.length;
    const colors = new Array(n).fill(0);
    
    const isSafe = (node, color) => {
        for (let i = 0; i < n; i++) {
            if (graph[node][i] && colors[i] === color) {
                return false;
            }
        }
        return true;
    };
    
    const solve = (node) => {
        if (node === n) {
            return true;
        }
        
        for (let color = 1; color <= m; color++) {
            if (isSafe(node, color)) {
                colors[node] = color;
                
                if (solve(node + 1)) {
                    this.score += 10;
                    return true;
                }
                
                colors[node] = 0;
            }
        }
        
        return false;
    };
    
    if (solve(0)) {
        console.log('Graph can be colored with', m, 'colors');
        console.log('Coloring:', colors);
        return true;
    }
    
    return false;
};
