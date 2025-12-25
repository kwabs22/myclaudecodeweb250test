/** Jump Search - Game: "Block Hopper" */
var JumpSearch = pc.createScript('jumpSearch');
JumpSearch.prototype.initialize = function() { this.score = 0; };
JumpSearch.prototype.jumpSearch = function(arr, target) {
    const n = arr.length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    while (arr[Math.min(step, n) - 1] < target) {
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) return -1;
        this.score += 5;
    }
    
    while (arr[prev] < target) {
        prev++;
        if (prev === Math.min(step, n)) return -1;
        this.score += 2;
    }
    
    if (arr[prev] === target) {
        this.score += 100;
        return prev;
    }
    
    return -1;
};
