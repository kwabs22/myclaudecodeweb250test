/** Valid Parentheses - Game: "Bracket Matcher" */
var ValidParentheses = pc.createScript('validParentheses');
ValidParentheses.prototype.initialize = function() {
    this.score = 0;
};
ValidParentheses.prototype.isValid = function(s) {
    const stack = [];
    const pairs = { '(': ')', '[': ']', '{': '}' };
    
    for (let char of s) {
        if (pairs[char]) {
            stack.push(char);
        } else {
            const last = stack.pop();
            if (!last || pairs[last] !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
};
