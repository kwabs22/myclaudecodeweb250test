/** Island Counting - Game: "Island Explorer" */
var IslandCounting = pc.createScript('islandCounting');
IslandCounting.prototype.initialize = function() { this.score = 0; };
IslandCounting.prototype.numIslands = function(grid) {
    if (!grid || grid.length === 0) return 0;
    
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    
    const dfs = (i, j) => {
        if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] === '0') return;
        
        grid[i][j] = '0';
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    };
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                count++;
                dfs(i, j);
                this.score += 50;
            }
        }
    }
    
    return count;
};
