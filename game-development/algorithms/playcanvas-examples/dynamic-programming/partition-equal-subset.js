/** Partition Equal Subset Sum - Game: "Fair Division" */
var PartitionEqualSubset = pc.createScript('partitionEqualSubset');
PartitionEqualSubset.prototype.initialize = function() { this.score = 0; };
PartitionEqualSubset.prototype.canPartition = function(nums) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum % 2 !== 0) return false;
    
    const target = sum / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    
    for (const num of nums) {
        for (let i = target; i >= num; i--) {
            dp[i] = dp[i] || dp[i - num];
            this.score += 1;
        }
    }
    
    return dp[target];
};
