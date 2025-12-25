/** Combination Sum - Game: "Coin Collector" */
var CombinationSum = pc.createScript('combinationSum');
CombinationSum.prototype.initialize = function() { this.result = []; this.score = 0; };
CombinationSum.prototype.combinationSum = function(candidates, target) {
    this.result = [];
    this.backtrack(candidates, target, 0, []);
    return this.result;
};
CombinationSum.prototype.backtrack = function(candidates, target, start, current) {
    if (target === 0) {
        this.result.push([...current]);
        this.score += 20;
        return;
    }
    if (target < 0) return;
    
    for (let i = start; i < candidates.length; i++) {
        current.push(candidates[i]);
        this.backtrack(candidates, target - candidates[i], i, current);
        current.pop();
    }
};
