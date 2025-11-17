/** Manacher's Algorithm - Game: "Speed Palindrome" */
var Manacher = pc.createScript('manacher');
Manacher.prototype.initialize = function() { this.score = 0; };
Manacher.prototype.longestPalindrome = function(s) {
    const t = '#' + s.split('').join('#') + '#';
    const n = t.length;
    const p = new Array(n).fill(0);
    let center = 0, right = 0;
    let maxLen = 0, centerIndex = 0;
    
    for (let i = 0; i < n; i++) {
        const mirror = 2 * center - i;
        
        if (i < right) {
            p[i] = Math.min(right - i, p[mirror]);
        }
        
        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && 
               t[i + p[i] + 1] === t[i - p[i] - 1]) {
            p[i]++;
        }
        
        if (i + p[i] > right) {
            center = i;
            right = i + p[i];
        }
        
        if (p[i] > maxLen) {
            maxLen = p[i];
            centerIndex = i;
        }
        
        this.score += 1;
    }
    
    const start = (centerIndex - maxLen) / 2;
    return s.substring(start, start + maxLen);
};
