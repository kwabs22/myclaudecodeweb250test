# Mathematics: combinatorics

Three reference documents and a quiz on counting, plus a map from the questions to the programming tasks in this repository that are closest to them.

| Item | What it is |
|---|---|
| [100 learning questions](combinatorics_learning_questions.md) | Questions in eight groups, from basic counting to challenge problems |
| [Answers](combinatorics_answers.md) | Worked answers; every numeric answer was checked by brute force |
| [Combinatorics Quiz](quiz/index.html) | A page that quizzes you on the 100 questions |
| [Repositories](combinatorics_repositories.md) | GitHub libraries for combinatorics, by language |
| [Combinatorics in the real world](real-world/index.html) | A 3D map of 53 everyday problems (passwords, poker, the birthday problem, test results, seating, Secret Santa, team splits, voting, delivery routes, schedules, error-correcting codes and more), grouped by the question each one asks and by solo or group, with live numbers. The logic is in `real-world/tasks.js` and `real-world/check.js` checks it |

## Combinatorics in the real world

The [real-world page](real-world/index.html) is a 3D map of 53 everyday problems, grouped by the question each one asks. Prediction is one group: when outcomes are equally likely, a forecast is a count of what you care about divided by a count of everything that could happen.

Each problem is also marked **solo** (21 tasks: one person or system faces it alone, such as a ticket, a hand, a route or a data set) or **group** (32 tasks: the answer depends on how several people or agents fit, meet, share or compete, such as a team, a league or a crowd). Solo tasks grow with the number of options; group tasks also grow with the number of people, usually much faster: pairs grow with n², sub-groups with 2ⁿ and line-ups with n!. Each task has live numbers; `real-world/check.js` tests them against brute force.

| Group | The question | Solo tasks | Group tasks |
|---|---|---|---|
| Counting | How many are there? | How many passwords?; Licence plates and product codes; Poker hands; Counting routes across a city grid; Your ancestors: more places than people; Mashups from a pile of source works | Handshakes and who talks to whom; Picking a committee; Seating people round a table; Splitting people into teams; How fast groups blow up; Sharing the hosting; Bundles of interests to choose from; How many friendship networks are there?; Who was derived from whom? |
| Prediction | What is likely to happen? | What a positive test really means; Guessing the next word; Lottery odds; Collecting a complete set; What will the dice show?; How many steps away is everyone? | Surprising coincidences (the birthday problem); Chances of reaching a target in a season; Can a majority vote go in a circle?; Finding a time everyone can meet; Will anyone else share my hobby?; How many people to invite for a full session |
| Search size | Could we simply try them all? | DNA and the number of short words; Choosing a set of features | Game trees (chess, Go and friends) |
| Optimisation | Which choice is best? | A delivery route; Loading a truck | Matching workers to jobs; Founding members who cover every role; Which days should the group meet?; Fair teams for a pick-up game; Picking areas that most members care about |
| Feasibility | Is there a valid arrangement, and how many? | Sudoku, rotas and Latin squares; Fitting clubs into my own week | Colouring a map or a timetable; Shift rotas with rules; Secret Santa: nobody draws themselves; Is the project big enough for the group?; Is a trio of friends or strangers unavoidable?; Which sources can legally be combined? |
| Coverage and design | How do we arrange things so nothing is missed? | Testing software settings | A league where everyone plays everyone; A code that repairs a flipped bit; A knockout tournament; Mixing the tables so everyone meets |
| Sampling and randomness | How many ways could the draw have gone? | Shuffling a deck; Resampling your own data (the bootstrap) | Picking a survey sample |

### Starting a hobby group

14 of the tasks make up a path for starting a hobby group, in the order the questions usually come up. The page walks through it step by step, and its **Hobby groups** button highlights these tasks.

1. **Fitting clubs into my own week**: Before starting, check what fits into your own week.
2. **Will anyone else share my hobby?**: Will anyone else share your hobby?
3. **Bundles of interests to choose from**: A single small activity is too little for a group: see how many bundles of areas there are.
4. **Picking areas that most members care about**: Pick the areas that reach the most members.
5. **Is the project big enough for the group?**: Check the project is big enough to keep everyone busy.
6. **How many people to invite for a full session**: Invite enough people for a full session.
7. **Which days should the group meet?**: Pick the meeting days that suit the most members.
8. **Finding a time everyone can meet**: Check the chance a given time suits everyone.
9. **Founding members who cover every role**: Make sure every role the hobby needs is covered.
10. **Picking a committee**: Choose organisers.
11. **Sharing the hosting**: Share the hosting fairly.
12. **Fair teams for a pick-up game**: Split into fair teams for games.
13. **Mixing the tables so everyone meets**: Mix the tables so members meet each other.
14. **A league where everyone plays everyone**: Run a league where everyone plays everyone.

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
