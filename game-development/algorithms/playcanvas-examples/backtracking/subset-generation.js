/** Subset Generation - Game: "Team Builder" */
var SubsetGeneration = pc.createScript('subsetGeneration');
SubsetGeneration.prototype.initialize = function() { this.result = []; this.score = 0; };
SubsetGeneration.prototype.subsets = function(nums) {
    this.result = [];
    this.backtrack(nums, 0, []);
    return this.result;
};
SubsetGeneration.prototype.backtrack = function(nums, start, current) {
    this.result.push([...current]);
    this.score += 1;
    
    for (let i = start; i < nums.length; i++) {
        current.push(nums[i]);
        this.backtrack(nums, i + 1, current);
        current.pop();
    }
};
