/** Combinations - Game: "Lottery Picker" */
var Combinations = pc.createScript('combinations');
Combinations.prototype.initialize = function() {
    this.result = [];
    this.score = 0;
};
Combinations.prototype.combine = function(n, k) {
    this.result = [];
    this.backtrack(1, n, k, []);
    console.log('Found', this.result.length, 'combinations');
    return this.result;
};
Combinations.prototype.backtrack = function(start, n, k, current) {
    if (current.length === k) {
        this.result.push([...current]);
        this.score += 1;
        return;
    }
    
    for (let i = start; i <= n; i++) {
        current.push(i);
        this.backtrack(i + 1, n, k, current);
        current.pop();
    }
};
