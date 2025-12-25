/** House Robber - Game: "Stealth Thief" */
var HouseRobber = pc.createScript('houseRobber');
HouseRobber.prototype.initialize = function() {
    this.score = 0;
};
HouseRobber.prototype.rob = function(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = 0, prev1 = 0;
    
    for (let num of nums) {
        const temp = prev1;
        prev1 = Math.max(prev1, prev2 + num);
        prev2 = temp;
    }
    
    this.score = prev1;
    return prev1;
};
