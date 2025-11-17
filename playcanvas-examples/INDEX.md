# PlayCanvas Algorithm Examples Index

Quick reference guide to all algorithm implementations in this directory.

## Currently Implemented Examples

### Sorting Algorithms
1. **bubble-sort.js** - Bubble Sort visualization with manual and auto-sort modes
   - Game: "Bubble Rescue" - swap adjacent bubbles to sort them
   - Features: Visual animations, scoring, manual swapping

### Search Algorithms
2. **binary-search.js** - Binary Search game with optimal path highlighting
   - Game: "Number Detective" - guess numbers using binary search strategy
   - Features: Optimal guess suggestions, efficiency tracking, visualization

### Graph Algorithms
3. **dijkstra.js** - Dijkstra's Shortest Path algorithm
   - Game: "Delivery Driver" - find shortest routes in a city network
   - Features: Step-by-step animation, path visualization, weighted edges

### Dynamic Programming
4. **coin-change.js** - Coin Change problem solver
   - Game: "Cashier Challenge" - make exact change with minimum coins
   - Features: DP table visualization, hints, optimal solution display

### Tree Algorithms
5. **binary-tree-traversal.js** - All binary tree traversals (Inorder, Preorder, Postorder, Level-order)
   - Game: "Tree Explorer" - collect nodes in correct traversal order
   - Features: Multiple traversal modes, animations, player interaction

### Backtracking
6. **n-queens.js** - N-Queens puzzle solver
   - Game: "Queen's Guard" - place queens without conflicts
   - Features: Visual attack lines, solution checker, hints, all solutions mode

---

## Remaining Algorithms to Implement (94)

### Sorting (4 remaining)
- [ ] quick-sort.js - Pivot Master game
- [ ] merge-sort.js - Kingdom Merger game
- [ ] heap-sort.js - Priority Rescue game
- [ ] insertion-sort.js - Card Collector game
- [ ] selection-sort.js - Talent Show game
- [ ] counting-sort.js - Inventory Manager game
- [ ] radix-sort.js - Mail Sorter game
- [ ] bucket-sort.js - Treasure Buckets game
- [ ] shell-sort.js - Gap Jumper game

### Search (6 remaining)
- [ ] dfs.js - Maze Explorer game
- [ ] bfs.js - Flood Fill Paint game
- [ ] binary-search-on-answer.js - Resource Allocation game
- [ ] interpolation-search.js - Smart Seeker game
- [ ] exponential-search.js - Range Finder game
- [ ] ternary-search.js - Peak Finder game
- [ ] jump-search.js - Block Hopper game
- [ ] a-star.js - Smart Navigator game

### Dynamic Programming (18 remaining)
- [ ] fibonacci.js - Rabbit Population game
- [ ] longest-common-subsequence.js - DNA Matcher game
- [ ] longest-increasing-subsequence.js - Stock Market Prophet game
- [ ] knapsack-01.js - Dungeon Looter game
- [ ] knapsack-unbounded.js - Potion Brewer game
- [ ] edit-distance.js - Word Morph game
- [ ] matrix-chain-multiplication.js - Factory Optimizer game
- [ ] longest-palindromic-subsequence.js - Mirror Words game
- [ ] climbing-stairs.js - Stairway Challenge game
- [ ] house-robber.js - Stealth Thief game
- [ ] house-robber-ii.js - Neighborhood Heist game
- [ ] maximum-subarray.js - Stock Trader game
- [ ] word-break.js - Sentence Builder game
- [ ] decode-ways.js - Secret Message game
- [ ] partition-equal-subset.js - Fair Division game
- [ ] target-sum.js - Number Wizard game
- [ ] minimum-path-sum.js - Toll Road game
- [ ] unique-paths.js - Robot Navigator game
- [ ] jump-game.js - Platform Jumper game
- [ ] perfect-squares.js - Square Builder game
- [ ] egg-drop.js - Egg Lab game

### Graph Algorithms (17 remaining)
- [ ] bellman-ford.js - Time Traveler game
- [ ] floyd-warshall.js - Network Architect game
- [ ] topological-sort.js - Course Planner game
- [ ] kruskal-mst.js - Bridge Builder game
- [ ] prim-mst.js - Power Grid game
- [ ] tarjan-scc.js - Social Circles game
- [ ] kosaraju-scc.js - Double Agent game
- [ ] union-find.js - Clan Merger game
- [ ] cycle-detection.js - Loop Detective game
- [ ] bipartite-check.js - Team Divider game
- [ ] island-counting.js - Island Explorer game
- [ ] word-ladder.js - Word Morph Ladder game
- [ ] clone-graph.js - Universe Clone game
- [ ] course-schedule.js - Academic Advisor game
- [ ] network-delay.js - Message Broadcast game
- [ ] maximum-flow.js - Pipeline Manager game
- [ ] minimum-cut.js - Siege Warfare game
- [ ] traveling-salesman.js - World Tour game

### Tree Algorithms (14 remaining)
- [ ] zigzag-traversal.js - Ski Slalom game
- [ ] bst-validation.js - Tree Inspector game
- [ ] lowest-common-ancestor.js - Family Tree game
- [ ] maximum-depth.js - Deep Diver game
- [ ] minimum-depth.js - Quick Escape game
- [ ] balanced-tree-check.js - Balance Beam game
- [ ] symmetric-tree.js - Mirror Palace game
- [ ] path-sum.js - Treasure Path game
- [ ] maximum-path-sum.js - Gold Rush game
- [ ] serialize-deserialize-tree.js - Save & Load game
- [ ] trie.js - Auto-Complete game
- [ ] segment-tree.js - Territory Manager game
- [ ] fenwick-tree.js - Score Tracker game
- [ ] avl-tree.js - Balance Master game
- [ ] red-black-tree.js - Color Code game
- [ ] n-ary-tree-traversal.js - Family Reunion game

### String Algorithms (9 remaining)
- [ ] kmp-pattern-matching.js - Pattern Hunter game
- [ ] rabin-karp.js - Hash Detective game
- [ ] longest-palindromic-substring.js - Palindrome Paradise game
- [ ] manacher.js - Speed Palindrome game
- [ ] atoi.js - Number Parser game
- [ ] regex-matching.js - Wildcard Wizard game
- [ ] valid-parentheses.js - Bracket Matcher game
- [ ] generate-parentheses.js - Combination Creator game
- [ ] longest-substring-without-repeating.js - Unique Path game
- [ ] minimum-window-substring.js - Tight Fit game

### Backtracking & Recursion (9 remaining)
- [ ] sudoku-solver.js - Number Detective game
- [ ] graph-coloring.js - Map Painter game
- [ ] subset-generation.js - Team Builder game
- [ ] permutations.js - Lineup Master game
- [ ] combinations.js - Lottery Picker game
- [ ] combination-sum.js - Coin Collector game
- [ ] letter-combinations.js - Old Phone game
- [ ] palindrome-partitioning.js - Word Slicer game
- [ ] word-search-grid.js - Word Hunt game

---

## Implementation Guidelines

Each algorithm implementation should include:

1. **Clear Documentation**
   - Algorithm explanation
   - Game mechanics description
   - Usage instructions

2. **Script Attributes**
   - Configurable parameters
   - Sensible defaults
   - Helpful descriptions

3. **Core Features**
   - Algorithm visualization
   - Interactive gameplay
   - Scoring system
   - Reset functionality

4. **Optional Features**
   - Hints system
   - Multiple difficulty levels
   - Statistics tracking
   - Multiple solutions display

5. **Visual Feedback**
   - Color-coded states
   - Animations
   - Progress indicators
   - Success/failure feedback

## Contributing

When adding new algorithm implementations:
1. Follow the existing code structure
2. Include comprehensive comments
3. Test with different input sizes
4. Update this index file
5. Add to appropriate category folder

## Testing Checklist

- [ ] Script compiles without errors
- [ ] Attributes work correctly
- [ ] Algorithm produces correct results
- [ ] Visual feedback is clear
- [ ] Game mechanics are engaging
- [ ] Edge cases are handled
- [ ] Performance is acceptable
- [ ] Code is well-documented

---

## Resources

- Main algorithm list: `../100-algorithms-to-games.md`
- PlayCanvas documentation: https://developer.playcanvas.com/
- Algorithm visualizations: https://visualgo.net/

## License

These examples are provided for educational purposes.
