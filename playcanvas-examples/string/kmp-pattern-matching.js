/**
 * KMP Pattern Matching
 * Algorithm: Efficient string matching using partial match table
 * Game: "Pattern Hunter" - Find patterns in ancient texts efficiently
 */

var KMP = pc.createScript('kmp');

KMP.attributes.add('text', { type: 'string', default: 'ABABDABACDABABCABAB' });
KMP.attributes.add('pattern', { type: 'string', default: 'ABABCABAB' });

KMP.prototype.initialize = function() {
    this.lps = [];
    this.matches = [];
    this.score = 0;

    this.computeLPS();
    this.searchPattern();
    this.createVisualization();
};

KMP.prototype.computeLPS = function() {
    const m = this.pattern.length;
    this.lps = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    while (i < m) {
        if (this.pattern[i] === this.pattern[len]) {
            len++;
            this.lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = this.lps[len - 1];
            } else {
                this.lps[i] = 0;
                i++;
            }
        }
    }
};

KMP.prototype.searchPattern = function() {
    const n = this.text.length;
    const m = this.pattern.length;
    let i = 0, j = 0;

    while (i < n) {
        if (this.pattern[j] === this.text[i]) {
            i++;
            j++;
        }

        if (j === m) {
            this.matches.push(i - j);
            console.log('Pattern found at index', i - j);
            this.score += 50;
            j = this.lps[j - 1];
        } else if (i < n && this.pattern[j] !== this.text[i]) {
            if (j !== 0) {
                j = this.lps[j - 1];
            } else {
                i++;
            }
        }
    }

    console.log('Total matches:', this.matches.length);
};

KMP.prototype.createVisualization = function() {
    // Visualize text and pattern with matches highlighted
};

KMP.prototype.reset = function() {
    this.matches = [];
    this.score = 0;
};
