/** Letter Combinations of Phone Number - Game: "Old Phone" */
var LetterCombinations = pc.createScript('letterCombinations');
LetterCombinations.prototype.initialize = function() {
    this.result = [];
    this.score = 0;
    this.phoneMap = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };
};
LetterCombinations.prototype.letterCombinations = function(digits) {
    if (!digits) return [];
    
    this.result = [];
    this.backtrack(digits, 0, '');
    return this.result;
};
LetterCombinations.prototype.backtrack = function(digits, index, current) {
    if (index === digits.length) {
        this.result.push(current);
        this.score += 5;
        return;
    }
    
    const letters = this.phoneMap[digits[index]];
    
    for (const letter of letters) {
        this.backtrack(digits, index + 1, current + letter);
    }
};
