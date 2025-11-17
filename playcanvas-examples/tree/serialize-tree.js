/** Serialize/Deserialize Tree - Game: "Save & Load" */
var SerializeTree = pc.createScript('serializeTree');
SerializeTree.prototype.initialize = function() { this.score = 0; };
SerializeTree.prototype.serialize = function(root) {
    if (!root) return 'null';
    return root.val + ',' + this.serialize(root.left) + ',' + this.serialize(root.right);
};
SerializeTree.prototype.deserialize = function(data) {
    const values = data.split(',');
    const build = () => {
        const val = values.shift();
        if (val === 'null') return null;
        const node = { val: parseInt(val), left: null, right: null };
        node.left = build();
        node.right = build();
        this.score += 5;
        return node;
    };
    return build();
};
