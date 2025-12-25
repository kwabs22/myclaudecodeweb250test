/** Minimum Cut - Game: "Siege Warfare" */
var MinimumCut = pc.createScript('minimumCut');
MinimumCut.prototype.initialize = function() { this.score = 0; };
MinimumCut.prototype.minCut = function(graph, source, sink) {
    // Min cut = Max flow (by max-flow min-cut theorem)
    const maxFlowScript = this.entity.script.maximumFlow;
    if (!maxFlowScript) {
        console.error('MaximumFlow script required');
        return 0;
    }
    
    const minCutValue = maxFlowScript.maxFlow(graph, source, sink);
    this.score = 1000 - minCutValue;
    
    console.log('Minimum cut value:', minCutValue);
    return minCutValue;
};
