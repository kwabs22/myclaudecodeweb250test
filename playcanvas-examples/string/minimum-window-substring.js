/** Minimum Window Substring - Game: "Tight Fit" */
var MinimumWindowSubstring = pc.createScript('minimumWindowSubstring');
MinimumWindowSubstring.prototype.initialize = function() { this.score = 0; };
MinimumWindowSubstring.prototype.minWindow = function(s, t) {
    if (s.length === 0 || t.length === 0) return '';
    
    const dictT = {};
    for (const char of t) {
        dictT[char] = (dictT[char] || 0) + 1;
    }
    
    const required = Object.keys(dictT).length;
    let formed = 0;
    const windowCounts = {};
    
    let left = 0, right = 0;
    let ans = [Infinity, 0, 0];
    
    while (right < s.length) {
        const char = s[right];
        windowCounts[char] = (windowCounts[char] || 0) + 1;
        
        if (dictT[char] && windowCounts[char] === dictT[char]) {
            formed++;
        }
        
        while (left <= right && formed === required) {
            const leftChar = s[left];
            
            if (right - left + 1 < ans[0]) {
                ans = [right - left + 1, left, right];
                this.score += 10;
            }
            
            windowCounts[leftChar]--;
            if (dictT[leftChar] && windowCounts[leftChar] < dictT[leftChar]) {
                formed--;
            }
            
            left++;
        }
        
        right++;
    }
    
    return ans[0] === Infinity ? '' : s.substring(ans[1], ans[2] + 1);
};
