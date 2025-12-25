/** Trie (Prefix Tree) - Game: "Auto-Complete" */
var Trie = pc.createScript('trie');
Trie.prototype.initialize = function() {
    this.root = { children: {}, isEnd: false };
    this.score = 0;
};
Trie.prototype.insert = function(word) {
    let node = this.root;
    for (let char of word) {
        if (!node.children[char]) {
            node.children[char] = { children: {}, isEnd: false };
        }
        node = node.children[char];
    }
    node.isEnd = true;
    this.score += 5;
};
Trie.prototype.search = function(word) {
    let node = this.root;
    for (let char of word) {
        if (!node.children[char]) return false;
        node = node.children[char];
    }
    return node.isEnd;
};
Trie.prototype.startsWith = function(prefix) {
    let node = this.root;
    for (let char of prefix) {
        if (!node.children[char]) return false;
        node = node.children[char];
    }
    return true;
};
