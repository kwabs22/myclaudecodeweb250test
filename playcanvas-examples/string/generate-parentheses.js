/** Generate Parentheses - Game: "Combination Creator" */
var GenerateParentheses = pc.createScript('generateParentheses');
GenerateParentheses.prototype.initialize = function() { this.result = []; this.score = 0; };
GenerateParentheses.prototype.generateParenthesis = function(n) {
    this.result = [];
    this.backtrack('', 0, 0, n);
    return this.result;
};
GenerateParentheses.prototype.backtrack = function(current, open, close, max) {
    if (current.length === max * 2) {
        this.result.push(current);
        this.score += 10;
        return;
    }
    
    if (open < max) {
        this.backtrack(current + '(', open + 1, close, max);
    }
    if (close < open) {
        this.backtrack(current + ')', open, close + 1, max);
    }
};
