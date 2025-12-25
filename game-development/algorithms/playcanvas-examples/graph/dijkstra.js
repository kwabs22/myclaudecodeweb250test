/**
 * Dijkstra's Shortest Path Algorithm
 * Algorithm: Find shortest path from source to all vertices using greedy approach
 * Game: "Delivery Driver" - Find shortest route to deliver packages across the city
 */

var Dijkstra = pc.createScript('dijkstra');

// Attributes
Dijkstra.attributes.add('showSteps', {
    type: 'boolean',
    default: true,
    description: 'Animate algorithm steps'
});

Dijkstra.attributes.add('stepDelay', {
    type: 'number',
    default: 0.5,
    description: 'Delay between steps (seconds)'
});

// Initialize
Dijkstra.prototype.initialize = function() {
    this.graph = {};
    this.nodes = [];
    this.edges = [];
    this.sourceNode = null;
    this.targetNode = null;
    this.running = false;
    this.currentStep = 0;
    this.timer = 0;

    // Create example graph
    this.createExampleGraph();

    // Algorithm state
    this.distances = {};
    this.previous = {};
    this.unvisited = new Set();
    this.visited = new Set();
};

// Create example city graph
BinarySearch.prototype.createExampleGraph = function() {
    // Define nodes (city locations)
    const nodePositions = {
        'Home': { x: 0, y: 0, z: 0 },
        'Store': { x: 3, y: 0, z: 2 },
        'School': { x: -2, y: 0, z: 3 },
        'Park': { x: 2, y: 0, z: -2 },
        'Hospital': { x: 5, y: 0, z: 0 },
        'Library': { x: -3, y: 0, z: -2 }
    };

    // Create node entities
    Object.keys(nodePositions).forEach(name => {
        const node = new pc.Entity(name);
        this.entity.addChild(node);

        const pos = nodePositions[name];
        node.setLocalPosition(pos.x, pos.y, pos.z);

        node.addComponent('model', { type: 'sphere' });
        node.setLocalScale(0.5, 0.5, 0.5);

        node.nodeName = name;
        this.nodes.push(node);
        this.graph[name] = {};
    });

    // Define edges (roads with distances/weights)
    const connections = [
        { from: 'Home', to: 'Store', weight: 5 },
        { from: 'Home', to: 'School', weight: 3 },
        { from: 'Home', to: 'Park', weight: 4 },
        { from: 'Store', to: 'Hospital', weight: 2 },
        { from: 'Store', to: 'Park', weight: 3 },
        { from: 'School', to: 'Library', weight: 4 },
        { from: 'School', to: 'Park', weight: 5 },
        { from: 'Park', to: 'Hospital', weight: 6 },
        { from: 'Library', to: 'Hospital', weight: 8 }
    ];

    // Create edges (bidirectional)
    connections.forEach(conn => {
        this.addEdge(conn.from, conn.to, conn.weight);
        this.createEdgeVisual(conn.from, conn.to, conn.weight);
    });

    this.sourceNode = 'Home';
    this.targetNode = 'Hospital';
};

// Add edge to graph
Dijkstra.prototype.addEdge = function(from, to, weight) {
    this.graph[from][to] = weight;
    this.graph[to][from] = weight; // Bidirectional
};

// Create visual representation of edge
Dijkstra.prototype.createEdgeVisual = function(from, to, weight) {
    const fromNode = this.nodes.find(n => n.nodeName === from);
    const toNode = this.nodes.find(n => n.nodeName === to);

    if (!fromNode || !toNode) return;

    const edge = new pc.Entity('Edge_' + from + '_' + to);
    this.entity.addChild(edge);

    const fromPos = fromNode.getPosition();
    const toPos = toNode.getPosition();
    const midpoint = new pc.Vec3().add2(fromPos, toPos).scale(0.5);

    edge.setPosition(midpoint);

    // Create line between nodes (would use a custom line renderer in real implementation)
    edge.addComponent('model', { type: 'cylinder' });

    const distance = fromPos.distance(toPos);
    edge.setLocalScale(0.1, distance / 2, 0.1);

    // Rotate to point from one node to other
    const direction = new pc.Vec3().sub2(toPos, fromPos);
    edge.lookAt(toPos);
    edge.rotateLocal(90, 0, 0);

    edge.fromNode = from;
    edge.toNode = to;
    edge.weight = weight;

    this.edges.push(edge);
};

// Start Dijkstra's algorithm
Dijkstra.prototype.startDijkstra = function(source, target) {
    this.sourceNode = source || this.sourceNode;
    this.targetNode = target || this.targetNode;

    // Initialize
    this.distances = {};
    this.previous = {};
    this.unvisited = new Set();
    this.visited = new Set();

    // Set all distances to infinity
    Object.keys(this.graph).forEach(node => {
        this.distances[node] = Infinity;
        this.previous[node] = null;
        this.unvisited.add(node);
    });

    // Distance to source is 0
    this.distances[this.sourceNode] = 0;

    this.running = true;
    this.currentStep = 0;

    console.log('Finding shortest path from', this.sourceNode, 'to', this.targetNode);
};

// Perform one step of Dijkstra's algorithm
Dijkstra.prototype.dijkstraStep = function() {
    if (this.unvisited.size === 0) {
        this.running = false;
        this.displayPath();
        return;
    }

    // Find unvisited node with smallest distance
    let currentNode = null;
    let minDistance = Infinity;

    this.unvisited.forEach(node => {
        if (this.distances[node] < minDistance) {
            minDistance = this.distances[node];
            currentNode = node;
        }
    });

    if (currentNode === null || minDistance === Infinity) {
        this.running = false;
        console.log('No path found!');
        return;
    }

    // Mark as visited
    this.unvisited.delete(currentNode);
    this.visited.add(currentNode);

    // Highlight current node
    this.highlightNode(currentNode, new pc.Color(1, 1, 0));

    // If we reached target, we're done
    if (currentNode === this.targetNode) {
        this.running = false;
        this.displayPath();
        return;
    }

    // Update distances to neighbors
    const neighbors = this.graph[currentNode];
    Object.keys(neighbors).forEach(neighbor => {
        if (this.visited.has(neighbor)) return;

        const distance = this.distances[currentNode] + neighbors[neighbor];

        if (distance < this.distances[neighbor]) {
            this.distances[neighbor] = distance;
            this.previous[neighbor] = currentNode;

            // Highlight edge being considered
            this.highlightEdge(currentNode, neighbor, new pc.Color(0, 1, 0));
        }
    });

    this.currentStep++;
};

// Reconstruct and display shortest path
Dijkstra.prototype.displayPath = function() {
    const path = [];
    let current = this.targetNode;

    while (current !== null) {
        path.unshift(current);
        current = this.previous[current];
    }

    if (path[0] !== this.sourceNode) {
        console.log('No path exists!');
        return;
    }

    console.log('Shortest path:', path.join(' -> '));
    console.log('Total distance:', this.distances[this.targetNode]);

    // Visualize path
    for (let i = 0; i < path.length - 1; i++) {
        this.highlightEdge(path[i], path[i + 1], new pc.Color(0, 0, 1));
    }

    path.forEach(nodeName => {
        this.highlightNode(nodeName, new pc.Color(0, 0, 1));
    });
};

// Highlight a node
Dijkstra.prototype.highlightNode = function(nodeName, color) {
    const node = this.nodes.find(n => n.nodeName === nodeName);
    if (!node || !node.model) return;

    node.model.meshInstances.forEach(mi => {
        mi.material.emissive = color;
        mi.material.update();
    });
};

// Highlight an edge
Dijkstra.prototype.highlightEdge = function(from, to, color) {
    const edge = this.edges.find(e =>
        (e.fromNode === from && e.toNode === to) ||
        (e.fromNode === to && e.toNode === from)
    );

    if (!edge || !edge.model) return;

    edge.model.meshInstances.forEach(mi => {
        mi.material.diffuse = color;
        mi.material.update();
    });
};

// Update loop
Dijkstra.prototype.update = function(dt) {
    if (this.running && this.showSteps) {
        this.timer += dt;

        if (this.timer >= this.stepDelay) {
            this.timer = 0;
            this.dijkstraStep();
        }
    }
};

// Run algorithm instantly (no animation)
Dijkstra.prototype.runInstant = function(source, target) {
    this.startDijkstra(source, target);

    while (this.running) {
        this.dijkstraStep();
    }
};

// Get shortest path between two nodes
Dijkstra.prototype.getShortestPath = function(source, target) {
    this.runInstant(source, target);

    const path = [];
    let current = target;

    while (current !== null) {
        path.unshift(current);
        current = this.previous[current];
    }

    return {
        path: path,
        distance: this.distances[target],
        exists: path[0] === source
    };
};
