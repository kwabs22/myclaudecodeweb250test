/** Rabin-Karp Algorithm - Game: "Hash Detective" */
var RabinKarp = pc.createScript('rabinKarp');
RabinKarp.prototype.initialize = function() { this.score = 0; };
RabinKarp.prototype.search = function(text, pattern) {
    const d = 256, q = 101;
    const m = pattern.length, n = text.length;
    let p = 0, t = 0, h = 1;
    const matches = [];
    
    for (let i = 0; i < m - 1; i++) h = (h * d) % q;
    
    for (let i = 0; i < m; i++) {
        p = (d * p + pattern.charCodeAt(i)) % q;
        t = (d * t + text.charCodeAt(i)) % q;
    }
    
    for (let i = 0; i <= n - m; i++) {
        if (p === t) {
            let j;
            for (j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) break;
            }
            if (j === m) {
                matches.push(i);
                this.score += 20;
            }
        }
        
        if (i < n - m) {
            t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
            if (t < 0) t += q;
        }
    }
    
    return matches;
};
