/** Word Ladder - Game: "Word Morph Ladder" */
var WordLadder = pc.createScript('wordLadder');
WordLadder.prototype.initialize = function() { this.score = 0; };
WordLadder.prototype.ladderLength = function(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    const queue = [[beginWord, 1]];
    const visited = new Set([beginWord]);
    
    while (queue.length > 0) {
        const [word, level] = queue.shift();
        
        if (word === endWord) {
            this.score += level * 10;
            return level;
        }
        
        for (let i = 0; i < word.length; i++) {
            for (let c = 97; c <= 122; c++) {
                const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
                
                if (wordSet.has(newWord) && !visited.has(newWord)) {
                    queue.push([newWord, level + 1]);
                    visited.add(newWord);
                }
            }
        }
    }
    
    return 0;
};
