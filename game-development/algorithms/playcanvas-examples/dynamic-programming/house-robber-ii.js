/** House Robber II (Circular) - Game: "Neighborhood Heist" */
var HouseRobberII = pc.createScript('houseRobberII');
HouseRobberII.prototype.initialize = function() { this.score = 0; };
HouseRobberII.prototype.rob = function(nums) {
    if (nums.length === 1) return nums[0];
    
    const robRange = (start, end) => {
        let prev2 = 0, prev1 = 0;
        for (let i = start; i <= end; i++) {
            const temp = prev1;
            prev1 = Math.max(prev1, prev2 + nums[i]);
            prev2 = temp;
            this.score += 2;
        }
        return prev1;
    };
    
    return Math.max(robRange(0, nums.length - 2), robRange(1, nums.length - 1));
};
