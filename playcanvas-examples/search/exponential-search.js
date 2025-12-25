/** Exponential Search - Game: "Range Finder" */
var ExponentialSearch = pc.createScript('exponentialSearch');
ExponentialSearch.prototype.initialize = function() { this.score = 0; };
ExponentialSearch.prototype.exponentialSearch = function(arr, target) {
    if (arr[0] === target) {
        this.score += 100;
        return 0;
    }
    
    let i = 1;
    while (i < arr.length && arr[i] <= target) {
        i *= 2;
        this.score += 5;
    }
    
    return this.binarySearch(arr, target, Math.floor(i / 2), Math.min(i, arr.length - 1));
};
ExponentialSearch.prototype.binarySearch = function(arr, target, low, high) {
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        
        if (arr[mid] === target) {
            this.score += 50;
            return mid;
        }
        
        if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
        
        this.score += 2;
    }
    
    return -1;
};
