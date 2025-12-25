/** Palindrome Partitioning - Game: "Word Slicer" */
var PalindromePartitioning = pc.createScript('palindromePartitioning');
PalindromePartitioning.prototype.initialize = function() { this.result = []; this.score = 0; };
PalindromePartitioning.prototype.partition = function(s) {
    this.result = [];
    this.backtrack(s, 0, []);
    return this.result;
};
PalindromePartitioning.prototype.isPalindrome = function(s, left, right) {
    while (left < right) {
        if (s[left++] !== s[right--]) return false;
    }
    return true;
};
PalindromePartitioning.prototype.backtrack = function(s, start, current) {
    if (start === s.length) {
        this.result.push([...current]);
        this.score += 15;
        return;
    }
    
    for (let end = start; end < s.length; end++) {
        if (this.isPalindrome(s, start, end)) {
            current.push(s.substring(start, end + 1));
            this.backtrack(s, end + 1, current);
            current.pop();
        }
    }
};
