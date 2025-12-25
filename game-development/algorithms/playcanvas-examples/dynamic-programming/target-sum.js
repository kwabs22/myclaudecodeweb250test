/** Target Sum - Game: "Number Wizard" */
var TargetSum = pc.createScript('targetSum');
TargetSum.prototype.initialize = function() { this.score = 0; };
TargetSum.prototype.findTargetSumWays = function(nums, target) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (Math.abs(target) > sum || (sum + target) % 2 !== 0) return 0;
    
    const subsetSum = (sum + target) / 2;
    const dp = new Array(subsetSum + 1).fill(0);
    dp[0] = 1;
    
    for (const num of nums) {
        for (let i = subsetSum; i >= num; i--) {
            dp[i] += dp[i - num];
            this.score += 1;
        }
    }
    
    return dp[subsetSum];
};
