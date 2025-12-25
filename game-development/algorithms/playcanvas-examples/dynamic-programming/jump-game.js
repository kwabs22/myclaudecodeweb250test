/** Jump Game - Game: "Platform Jumper" */
var JumpGame = pc.createScript('jumpGame');
JumpGame.prototype.initialize = function() { this.score = 0; };
JumpGame.prototype.canJump = function(nums) {
    let maxReach = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
        this.score += 5;
        if (maxReach >= nums.length - 1) {
            this.score += 50;
            return true;
        }
    }
    
    return true;
};
