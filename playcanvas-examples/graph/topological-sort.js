/**
 * Topological Sort
 * Algorithm: Linear ordering of directed acyclic graph vertices
 * Game: "Course Planner" - Arrange courses considering prerequisites
 */

var TopologicalSort = pc.createScript('topologicalSort');

TopologicalSort.prototype.initialize = function() {
    this.graph = {};
    this.inDegree = {};
    this.sorted = [];
    this.score = 0;

    this.buildCourseGraph();
    this.topologicalSort();
};

TopologicalSort.prototype.buildCourseGraph = function() {
    // Example: Course prerequisites
    const courses = ['Math', 'Physics', 'Chemistry', 'Biology', 'AdvMath', 'AdvPhysics'];

    courses.forEach(course => {
        this.graph[course] = [];
        this.inDegree[course] = 0;
    });

    // Add prerequisites (edges)
    this.addEdge('Math', 'AdvMath');
    this.addEdge('Math', 'Physics');
    this.addEdge('Physics', 'AdvPhysics');
    this.addEdge('Chemistry', 'Biology');
};

TopologicalSort.prototype.addEdge = function(from, to) {
    this.graph[from].push(to);
    this.inDegree[to]++;
};

TopologicalSort.prototype.topologicalSort = function() {
    const queue = [];

    // Find all nodes with no incoming edges
    for (const node in this.inDegree) {
        if (this.inDegree[node] === 0) {
            queue.push(node);
        }
    }

    while (queue.length > 0) {
        const current = queue.shift();
        this.sorted.push(current);

        this.graph[current].forEach(neighbor => {
            this.inDegree[neighbor]--;

            if (this.inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        });
    }

    console.log('Course order:', this.sorted.join(' -> '));

    if (this.sorted.length === Object.keys(this.graph).length) {
        console.log('Valid course schedule!');
        this.score += 100;
    } else {
        console.log('Cycle detected! No valid schedule.');
    }
};

TopologicalSort.prototype.reset = function() {
    this.sorted = [];
    this.score = 0;
};
