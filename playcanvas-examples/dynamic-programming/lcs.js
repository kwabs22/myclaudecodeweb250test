/**
 * Longest Common Subsequence (LCS)
 * Algorithm: Find longest subsequence common to two sequences
 * Game: "DNA Matcher" - Find matching genetic sequences between DNA strands
 */

var LCS = pc.createScript('lcs');

LCS.attributes.add('string1', { type: 'string', default: 'ABCDGH' });
LCS.attributes.add('string2', { type: 'string', default: 'AEDFHR' });

LCS.prototype.initialize = function() {
    this.dp = [];
    this.lcsString = '';
    this.score = 0;

    this.calculateLCS();
    this.createVisualization();
};

LCS.prototype.calculateLCS = function() {
    const m = this.string1.length;
    const n = this.string2.length;
    this.dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (this.string1[i - 1] === this.string2[j - 1]) {
                this.dp[i][j] = this.dp[i - 1][j - 1] + 1;
            } else {
                this.dp[i][j] = Math.max(this.dp[i - 1][j], this.dp[i][j - 1]);
            }
        }
    }

    this.reconstructLCS();
    console.log('LCS length:', this.dp[m][n]);
    console.log('LCS:', this.lcsString);
};

LCS.prototype.reconstructLCS = function() {
    let i = this.string1.length;
    let j = this.string2.length;
    const result = [];

    while (i > 0 && j > 0) {
        if (this.string1[i - 1] === this.string2[j - 1]) {
            result.unshift(this.string1[i - 1]);
            i--;
            j--;
        } else if (this.dp[i - 1][j] > this.dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    this.lcsString = result.join('');
};

LCS.prototype.createVisualization = function() {
    // Create DNA strand visualization
    this.createStrand(this.string1, 2, new pc.Color(0.3, 0.8, 0.3));
    this.createStrand(this.string2, -2, new pc.Color(0.3, 0.3, 0.8));
    this.highlightMatches();
};

LCS.prototype.createStrand = function(str, yPos, color) {
    const spacing = 0.8;
    const startX = -(str.length - 1) * spacing / 2;

    for (let i = 0; i < str.length; i++) {
        const base = new pc.Entity('Base_' + str + '_' + i);
        this.entity.addChild(base);

        base.setLocalPosition(startX + i * spacing, yPos, 0);
        base.addComponent('model', { type: 'sphere' });
        base.setLocalScale(0.5, 0.5, 0.5);

        if (base.model && base.model.meshInstances[0]) {
            base.model.meshInstances[0].material.diffuse = color;
            base.model.meshInstances[0].material.update();
        }

        base.character = str[i];
    }
};

LCS.prototype.highlightMatches = function() {
    // Highlight LCS characters
    for (let char of this.lcsString) {
        this.score += 10;
    }
};

LCS.prototype.reset = function() {
    this.score = 0;
};
