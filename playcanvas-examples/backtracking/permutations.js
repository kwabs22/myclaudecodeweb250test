/** Permutations - Game: "Lineup Master" */
var Permutations = pc.createScript('permutations');
Permutations.prototype.initialize = function() {
    this.result = [];
    this.score = 0;
};
Permutations.prototype.permute = function(nums) {
    this.result = [];
    this.backtrack(nums, []);
    console.log('Found', this.result.length, 'permutations');
    return this.result;
};
Permutations.prototype.backtrack = function(nums, current) {
    if (current.length === nums.length) {
        this.result.push([...current]);
        this.score += 1;
        return;
    }
    
    for (let num of nums) {
        if (current.includes(num)) continue;
        current.push(num);
        this.backtrack(nums, current);
        current.pop();
    }
};
