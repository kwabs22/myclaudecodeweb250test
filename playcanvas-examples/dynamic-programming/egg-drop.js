/** Egg Drop Problem - Game: "Egg Lab" */
var EggDrop = pc.createScript('eggDrop');
EggDrop.prototype.initialize = function() { this.score = 0; };
EggDrop.prototype.eggDrop = function(eggs, floors) {
    const dp = Array(eggs + 1).fill(null).map(() => Array(floors + 1).fill(0));
    
    for (let i = 1; i <= eggs; i++) {
        dp[i][0] = 0;
        dp[i][1] = 1;
    }
    
    for (let j = 1; j <= floors; j++) {
        dp[1][j] = j;
    }
    
    for (let i = 2; i <= eggs; i++) {
        for (let j = 2; j <= floors; j++) {
            dp[i][j] = Infinity;
            
            for (let k = 1; k <= j; k++) {
                const res = 1 + Math.max(dp[i - 1][k - 1], dp[i][j - k]);
                dp[i][j] = Math.min(dp[i][j], res);
                this.score += 1;
            }
        }
    }
    
    return dp[eggs][floors];
};
