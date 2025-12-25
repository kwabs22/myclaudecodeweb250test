/** Longest Palindromic Substring - Game: "Palindrome Paradise" */
var LongestPalindrome = pc.createScript('longestPalindrome');
LongestPalindrome.prototype.initialize = function() { this.score = 0; };
LongestPalindrome.prototype.longestPalindrome = function(s) {
    if (s.length < 2) return s;
    
    let start = 0, maxLen = 1;
    
    const expandAroundCenter = (left, right) => {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return right - left - 1;
    };
    
    for (let i = 0; i < s.length; i++) {
        const len1 = expandAroundCenter(i, i);
        const len2 = expandAroundCenter(i, i + 1);
        const len = Math.max(len1, len2);
        
        if (len > maxLen) {
            maxLen = len;
            start = i - Math.floor((len - 1) / 2);
            this.score += 10;
        }
    }
    
    return s.substring(start, start + maxLen);
};
