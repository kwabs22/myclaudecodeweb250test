/**
 * Binary Search on Answer
 * Algorithm: Binary search on solution space rather than array
 * Game: "Resource Allocation" - Find minimum resources needed
 */

var BinarySearchOnAnswer = pc.createScript('binarySearchOnAnswer');

BinarySearchOnAnswer.prototype.initialize = function() {
    this.score = 0;
};

BinarySearchOnAnswer.prototype.minDaysToMakeBouquets = function(bloomDay, m, k) {
    if (m * k > bloomDay.length) return -1;
    
    const canMake = (days) => {
        let bouquets = 0;
        let flowers = 0;
        
        for (const bloom of bloomDay) {
            if (bloom <= days) {
                flowers++;
                if (flowers === k) {
                    bouquets++;
                    flowers = 0;
                }
            } else {
                flowers = 0;
            }
        }
        
        return bouquets >= m;
    };
    
    let left = Math.min(...bloomDay);
    let right = Math.max(...bloomDay);
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canMake(mid)) {
            result = mid;
            right = mid - 1;
            this.score += 10;
        } else {
            left = mid + 1;
        }
    }
    
    return result;
};

BinarySearchOnAnswer.prototype.splitArray = function(nums, m) {
    const canSplit = (maxSum) => {
        let count = 1;
        let currentSum = 0;
        
        for (const num of nums) {
            if (currentSum + num > maxSum) {
                count++;
                currentSum = num;
                if (count > m) return false;
            } else {
                currentSum += num;
            }
        }
        
        return true;
    };
    
    let left = Math.max(...nums);
    let right = nums.reduce((a, b) => a + b, 0);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canSplit(mid)) {
            right = mid;
            this.score += 10;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
};
