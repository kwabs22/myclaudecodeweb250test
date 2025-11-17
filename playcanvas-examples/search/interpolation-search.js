/** Interpolation Search - Game: "Smart Seeker" */
var InterpolationSearch = pc.createScript('interpolationSearch');
InterpolationSearch.prototype.initialize = function() { this.score = 0; };
InterpolationSearch.prototype.interpolationSearch = function(arr, target) {
    let low = 0, high = arr.length - 1;
    
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low === high) {
            if (arr[low] === target) {
                this.score += 100;
                return low;
            }
            return -1;
        }
        
        const pos = low + Math.floor(((target - arr[low]) / (arr[high] - arr[low])) * (high - low));
        
        if (arr[pos] === target) {
            this.score += 100;
            return pos;
        }
        
        if (arr[pos] < target) {
            low = pos + 1;
        } else {
            high = pos - 1;
        }
        
        this.score += 5;
    }
    
    return -1;
};
