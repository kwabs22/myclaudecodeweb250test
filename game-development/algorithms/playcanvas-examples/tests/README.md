# Tests for the algorithm scripts

These run the scripts in plain Node, with a small stand-in for the PlayCanvas engine (`harness.js`), and check their results against known answers or an independent implementation. No browser and no installs: `node tests/run.js`.

| File | What it checks |
|---|---|
| `answers.test.js` | About 60 algorithms against known answers (DP, backtracking, string, search, tree, graph) |
| `sorting.test.js` | Nine animated sorts end with a sorted array, 25 random arrays each |
| `mazes.test.js` | BFS, DFS and A* agree with an independent search on 60 random mazes each |
| `dijkstra.test.js` | Dijkstra distances for every pair in the example graph |
| `graphs-and-trees.test.js` | Floyd-Warshall, SCCs, flow, MSTs, AVL and red-black invariants, segment and Fenwick trees |
| `puzzles.test.js` | Sudoku, N-Queens, knapsack, coin change, LCS, KMP, Kruskal, topological sort |
| `combinatorics.test.js` | The counting and listing tasks against combinatorics formulas: n! permutations, C(n, k) combinations, 2ⁿ subsets, Catalan numbers, grid paths, Fibonacci tilings, sign choices, and 121 ways to make change |
| `rerun.test.js` | Methods behave the same when a button runs them a second time |
| `binary-search-game.test.js` | 200 games of optimal play finish within the stated optimum |

The stand-in engine only covers what the scripts call, so the tests cover the algorithms, not the 3D drawing. The scripts were also linted with ESLint (`no-const-assign`, `no-undef` and similar): the only error was in `jump-search.js`, now fixed.
