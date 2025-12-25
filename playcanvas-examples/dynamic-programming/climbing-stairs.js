/** Climbing Stairs - Game: "Stairway Challenge" */
var ClimbingStairs = pc.createScript('climbingStairs');
ClimbingStairs.prototype.initialize = function() {
    this.memo = {};
    this.score = 0;
};
ClimbingStairs.prototype.climbStairs = function(n) {
    if (n <= 2) return n;
    if (this.memo[n]) return this.memo[n];
    
    this.memo[n] = this.climbStairs(n - 1) + this.climbStairs(n - 2);
    return this.memo[n];
};
