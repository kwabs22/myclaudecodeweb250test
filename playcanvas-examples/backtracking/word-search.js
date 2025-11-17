/** Word Search - Game: "Word Hunt" */
var WordSearch = pc.createScript('wordSearch');
WordSearch.prototype.initialize = function() { this.score = 0; };
WordSearch.prototype.exist = function(board, word) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (this.dfs(board, word, 0, i, j)) {
                this.score += 100;
                return true;
            }
        }
    }
    return false;
};
WordSearch.prototype.dfs = function(board, word, index, i, j) {
    if (index === word.length) return true;
    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return false;
    if (board[i][j] !== word[index]) return false;
    
    const temp = board[i][j];
    board[i][j] = '#';
    
    const found = this.dfs(board, word, index + 1, i + 1, j) ||
                  this.dfs(board, word, index + 1, i - 1, j) ||
                  this.dfs(board, word, index + 1, i, j + 1) ||
                  this.dfs(board, word, index + 1, i, j - 1);
    
    board[i][j] = temp;
    return found;
};
