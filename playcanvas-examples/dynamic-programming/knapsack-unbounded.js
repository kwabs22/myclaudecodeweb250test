/** Unbounded Knapsack - Game: "Potion Brewer" */
var UnboundedKnapsack = pc.createScript('unboundedKnapsack');
UnboundedKnapsack.prototype.initialize = function() { this.score = 0; };
UnboundedKnapsack.prototype.unboundedKnapsack = function(capacity, weights, values) {
    const dp = new Array(capacity + 1).fill(0);
    
    for (let w = 0; w <= capacity; w++) {
        for (let i = 0; i < weights.length; i++) {
            if (weights[i] <= w) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
                this.score += 1;
            }
        }
    }
    
    return dp[capacity];
};
