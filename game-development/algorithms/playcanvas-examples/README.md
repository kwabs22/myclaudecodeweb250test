# PlayCanvas Algorithm Game Examples

This folder contains PlayCanvas script implementations for the 100 algorithms listed in `100-algorithms-to-games.md`.

## Folder Structure

- **sorting/** - Sorting algorithm visualizations and games (Bubble, Quick, Merge, Heap, etc.)
- **search/** - Search algorithm implementations (Binary Search, DFS, BFS, A*, etc.)
- **dynamic-programming/** - DP-based games (Knapsack, Coin Change, LCS, etc.)
- **graph/** - Graph algorithm visualizations (Dijkstra, MST, Topological Sort, etc.)
- **tree/** - Tree-based games (Traversals, BST operations, Segment Trees, etc.)
- **string/** - String algorithm games (KMP, Palindromes, Pattern matching, etc.)
- **backtracking/** - Backtracking puzzles (N-Queens, Sudoku, Combinations, etc.)

## Using These Examples

Each example is a PlayCanvas script that can be attached to entities in your PlayCanvas project:

1. **Create a new Script** in your PlayCanvas project
2. **Copy the code** from the example file
3. **Attach the script** to an entity in your scene
4. **Configure** any script attributes as needed
5. **Launch** the game to see the algorithm in action

## Script Structure

Most scripts follow this pattern:

```javascript
var AlgorithmName = pc.createScript('algorithmName');

// Attributes (configurable properties)
AlgorithmName.attributes.add('property', { type: 'number', default: 10 });

// Initialize method
AlgorithmName.prototype.initialize = function() {
    // Setup code
};

// Update method
AlgorithmName.prototype.update = function(dt) {
    // Game loop code
};

// Algorithm implementation
AlgorithmName.prototype.algorithmMethod = function() {
    // Core algorithm logic
};
```

## Dependencies

Some examples may require:
- **UI Elements**: Text elements, buttons, sprites
- **3D Models**: Cubes, spheres, or custom models
- **Materials**: Different colors for visualization
- **Input**: Mouse and keyboard handlers

## Learning Path

**Beginners**: Start with sorting/bubble-sort.js or search/binary-search.js
**Intermediate**: Try dynamic-programming/coin-change.js or tree/bst-visualization.js
**Advanced**: Challenge yourself with graph/dijkstra.js or backtracking/n-queens.js

## Contributing

Each algorithm implementation includes:
- Clear comments explaining the algorithm
- Visual feedback for algorithm steps
- Game mechanics that teach the concept
- Score/timer systems where appropriate

## Tests

The algorithms are tested in plain Node, without a browser: run `node tests/run.js` from this folder. See [tests/README.md](tests/README.md) for what is covered. The tests found and fixed these problems in October 2026:

- `search/jump-search.js` threw an error for any target past the first block (a `const` that was reassigned).
- `tree/fenwick-tree.js` had a method called `update(i, delta)`. PlayCanvas calls `update(dt)` on every script every frame, so once the tree was initialised the page froze in an endless loop. The method is now `add(i, delta)`.
- `graph/kosaraju-scc.js` and `graph/tarjan-scc.js` returned wrong components when neighbour lists held numbers, and Tarjan returned nothing the second time it ran.
- `graph/kruskal-mst.js`, `graph/topological-sort.js` and `string/kmp-pattern-matching.js` gave wrong results (zero cost, a false "cycle detected", duplicate matches) when run a second time, for example from a button.
- `graph/minimum-cut.js` only worked when `MaximumFlow` was on the same entity; it now works alone.
- `tree/red-black-tree.js` had no way to keep the root black, so it gained `put(value)`. `tree/avl-tree.js` gained `put(value)` too, so both can be driven without passing nodes around.
