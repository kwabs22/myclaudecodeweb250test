/** Maximum Subarray (Kadane) - Game: "Stock Trader" */
var MaximumSubarray = pc.createScript('maximumSubarray');
MaximumSubarray.prototype.initialize = function() { this.score = 0; };
MaximumSubarray.prototype.maxSubArray = function(nums) {
    let maxSum = nums[0], currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    this.score = Math.max(0, maxSum);
    return maxSum;
};
