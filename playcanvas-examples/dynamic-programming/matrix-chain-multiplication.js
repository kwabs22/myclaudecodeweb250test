/** Matrix Chain Multiplication - Game: "Factory Optimizer" */
var MatrixChain = pc.createScript('matrixChain');
MatrixChain.prototype.initialize = function() { this.score = 0; };
MatrixChain.prototype.matrixChainOrder = function(dims) {
    const n = dims.length - 1;
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));
    
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i < n - len + 1; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    this.score += 5;
                }
            }
        }
    }
    
    return dp[0][n - 1];
};
