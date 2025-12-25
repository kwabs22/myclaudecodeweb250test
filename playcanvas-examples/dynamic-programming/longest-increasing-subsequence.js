/** Longest Increasing Subsequence - Game: "Stock Market Prophet" */
var LIS = pc.createScript('lis');
LIS.prototype.initialize = function() {
    this.score = 0;
};
LIS.prototype.lengthOfLIS = function(nums) {
    if (nums.length === 0) return 0;
    
    const dp = new Array(nums.length).fill(1);
    let maxLen = 1;
    
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    
    this.score = maxLen * 10;
    return maxLen;
};
