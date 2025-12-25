/** Longest Substring Without Repeating - Game: "Unique Path" */
var LongestUniqueSubstring = pc.createScript('longestUniqueSubstring');
LongestUniqueSubstring.prototype.initialize = function() { this.score = 0; };
LongestUniqueSubstring.prototype.lengthOfLongestSubstring = function(s) {
    const seen = new Map();
    let maxLen = 0, start = 0;
    
    for (let end = 0; end < s.length; end++) {
        if (seen.has(s[end])) {
            start = Math.max(start, seen.get(s[end]) + 1);
        }
        seen.set(s[end], end);
        maxLen = Math.max(maxLen, end - start + 1);
        this.score = maxLen * 5;
    }
    
    return maxLen;
};
