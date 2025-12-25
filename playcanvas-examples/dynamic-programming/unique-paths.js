/** Unique Paths - Game: "Robot Navigator" */
var UniquePaths = pc.createScript('uniquePaths');
UniquePaths.prototype.initialize = function() { this.score = 0; };
UniquePaths.prototype.uniquePaths = function(m, n) {
    const dp = Array(m).fill(null).map(() => Array(n).fill(1));
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    this.score = dp[m - 1][n - 1];
    return dp[m - 1][n - 1];
};
