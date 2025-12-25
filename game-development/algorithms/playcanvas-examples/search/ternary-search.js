/** Ternary Search - Game: "Peak Finder" */
var TernarySearch = pc.createScript('ternarySearch');
TernarySearch.prototype.initialize = function() { this.score = 0; };
TernarySearch.prototype.ternarySearch = function(arr, target, low = 0, high = arr.length - 1) {
    if (high >= low) {
        const mid1 = low + Math.floor((high - low) / 3);
        const mid2 = high - Math.floor((high - low) / 3);
        
        if (arr[mid1] === target) {
            this.score += 100;
            return mid1;
        }
        if (arr[mid2] === target) {
            this.score += 100;
            return mid2;
        }
        
        if (target < arr[mid1]) {
            return this.ternarySearch(arr, target, low, mid1 - 1);
        } else if (target > arr[mid2]) {
            return this.ternarySearch(arr, target, mid2 + 1, high);
        } else {
            return this.ternarySearch(arr, target, mid1 + 1, mid2 - 1);
        }
    }
    
    return -1;
};
TernarySearch.prototype.findPeak = function(arr) {
    let low = 0, high = arr.length - 1;
    
    while (low < high) {
        const mid1 = low + Math.floor((high - low) / 3);
        const mid2 = high - Math.floor((high - low) / 3);
        
        if (arr[mid1] < arr[mid2]) {
            low = mid1 + 1;
        } else {
            high = mid2 - 1;
        }
        
        this.score += 10;
    }
    
    return low;
};
