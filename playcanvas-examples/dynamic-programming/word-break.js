/** Word Break - Game: "Sentence Builder" */
var WordBreak = pc.createScript('wordBreak');
WordBreak.prototype.initialize = function() { this.score = 0; };
WordBreak.prototype.wordBreak = function(s, wordDict) {
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true;
    const wordSet = new Set(wordDict);
    
    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                this.score += 10;
                break;
            }
        }
    }
    return dp[s.length];
};
