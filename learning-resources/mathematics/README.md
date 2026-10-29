# Mathematics: combinatorics

Three reference documents and a quiz on counting, plus a map from the questions to the programming tasks in this repository that are closest to them.

| Item | What it is |
|---|---|
| [100 learning questions](combinatorics_learning_questions.md) | Questions in eight groups, from basic counting to challenge problems |
| [Answers](combinatorics_answers.md) | Worked answers; every numeric answer was checked by brute force |
| [Combinatorics Quiz](quiz/index.html) | A page that quizzes you on the 100 questions |
| [Repositories](combinatorics_repositories.md) | GitHub libraries for combinatorics, by language |
| [Combinatorics in the real world](real-world/index.html) | A 3D map of 23 everyday problems (passwords, poker, the birthday problem, test results, delivery routes, schedules, error-correcting codes and more), grouped by the question each one asks, with live numbers. The logic is in `real-world/tasks.js` and `real-world/check.js` checks it |

## Closest tasks in this repository

Counting a thing and generating every one of them are the same problem seen from two sides. Each task below is a runnable script (a PlayCanvas game) that does one of them. The scripts are checked against the counts the questions ask for by `../../game-development/algorithms/playcanvas-examples/tests/combinatorics.test.js` (run `node tests/run.js` in that folder).

| Question group | Closest tasks | What the task shows |
|---|---|---|
| Basic counting and combinations (1-15, 31-45) | [Subset generation](../../game-development/algorithms/playcanvas-examples/backtracking/subset-generation.js), [Combinations](../../game-development/algorithms/playcanvas-examples/backtracking/combinations.js), [Letter combinations](../../game-development/algorithms/playcanvas-examples/backtracking/letter-combinations.js) | 2ⁿ subsets, C(n, k) selections (question 12, binary strings with three 1s, is the six-item subsets of size 3), and the product rule |
| Permutations (16-30) | [Permutations](../../game-development/algorithms/playcanvas-examples/backtracking/permutations.js) | n! orderings. The [travelling salesman](../../game-development/algorithms/playcanvas-examples/graph/traveling-salesman.js) task is also about orderings, but it uses a nearest-neighbour shortcut, not all (n-1)! tours |
| Advanced counting (46-60) | [Climbing stairs](../../game-development/algorithms/playcanvas-examples/dynamic-programming/climbing-stairs.js), [Fibonacci](../../game-development/algorithms/playcanvas-examples/dynamic-programming/fibonacci.js), [Unique paths](../../game-development/algorithms/playcanvas-examples/dynamic-programming/unique-paths.js), [Decode ways](../../game-development/algorithms/playcanvas-examples/dynamic-programming/decode-ways.js), [Generate parentheses](../../game-development/algorithms/playcanvas-examples/string/generate-parentheses.js) | The same recurrence counts stairs and 2 × n domino tilings (question 50) and binary strings with no two 1s in a row (question 94). Grid paths are binomials (question 52). Balanced brackets are Catalan numbers, as are hexagon triangulations and bracketings (questions 55 and 97) |
| Partitions and distributions (61-70) | [Combination sum](../../game-development/algorithms/playcanvas-examples/backtracking/combination-sum.js), [Coin change](../../game-development/algorithms/playcanvas-examples/dynamic-programming/coin-change.js), [Target sum](../../game-development/algorithms/playcanvas-examples/dynamic-programming/target-sum.js), [Partition equal subset](../../game-development/algorithms/playcanvas-examples/dynamic-programming/partition-equal-subset.js), [Perfect squares](../../game-development/algorithms/playcanvas-examples/dynamic-programming/perfect-squares.js) | Choosing items that add to a target, either listing every way or counting them |
| Generating functions (71-80) | [Coin change](../../game-development/algorithms/playcanvas-examples/dynamic-programming/coin-change.js) (its `countWays` method), [Fibonacci](../../game-development/algorithms/playcanvas-examples/dynamic-programming/fibonacci.js) | The change-counting loop multiplies the series 1/(1 - xᶜ) one coin at a time, so its answer is a coefficient (question 73: 121 ways for $1 with pennies, nickels and dimes). The Fibonacci recurrence is question 78 |
| Graph theory and combinatorics (81-90) | [Graph colouring](../../game-development/algorithms/playcanvas-examples/backtracking/graph-coloring.js), [Bipartite check](../../game-development/algorithms/playcanvas-examples/graph/bipartite-check.js), [Kruskal](../../game-development/algorithms/playcanvas-examples/graph/kruskal-mst.js) and [Prim](../../game-development/algorithms/playcanvas-examples/graph/prim-mst.js) spanning trees | Colouring and the chromatic number (questions 60 and 82), two-colourability, building one spanning tree. Counting spanning trees (Cayley's formula, questions 83 and 85) has no task yet |
| Challenge problems (91-100) | [N-Queens](../../game-development/algorithms/playcanvas-examples/backtracking/n-queens.js), [Sudoku solver](../../game-development/algorithms/playcanvas-examples/backtracking/sudoku-solver.js), [Palindrome partitioning](../../game-development/algorithms/playcanvas-examples/backtracking/palindrome-partitioning.js) | Search with constraints. A solved Sudoku is a Latin square of order 9 with an extra block rule (question 96). N-Queens has 92 solutions on an 8 × 8 board |

No task enumerates derangements (question 28), Stirling or Bell numbers (questions 63, 66 and 70), or Latin squares of order 4 (question 96); those are good candidates for the next scripts.

## Practise elsewhere in the repository

- The [Phase 1 quiz](../../ai-ml/careers/ai-engineer-roadmap/quiz-app.html) has combinatorics, probability and complexity questions, each answer computed by code. Filter it to Probability & Statistics.
- The 100 algorithm game ideas are in [100 algorithms to games](../../game-development/algorithms/100-algorithms-to-games.md): numbers 91 to 100 are the backtracking and grid-search ones (N-Queens through Word Search), and number 88 is Generate Parentheses.
