# 100 Unique Algorithms from LeetCode Repos - Repurposed as Mini Games

This document lists 100 unique algorithms found across the analyzed LeetCode repositories and describes how each can be repurposed into engaging mini games.

## Sorting Algorithms

### 1. Bubble Sort
**Algorithm**: Compare adjacent elements and swap if out of order, repeat until sorted.
**Game Idea**: "Bubble Rescue" - Bubbles with numbers rise to the surface. Players swap adjacent bubbles to sort them before time runs out. Correct swaps earn points, wrong swaps cost energy.

### 2. Quick Sort
**Algorithm**: Pick pivot, partition around it, recursively sort partitions.
**Game Idea**: "Pivot Master" - Players select the best pivot in an array to divide enemies into two groups. Choosing optimal pivots defeats enemies faster in this strategy battle game.

### 3. Merge Sort
**Algorithm**: Divide array in half, recursively sort, then merge sorted halves.
**Game Idea**: "Kingdom Merger" - Split your army into smaller battalions, organize them, then merge them back in perfect formation to march into battle.

### 4. Heap Sort
**Algorithm**: Build max heap, repeatedly extract maximum element.
**Game Idea**: "Priority Rescue" - Build a heap of survivors with different priorities. Extract the highest priority person each round to save them from a disaster zone.

### 5. Insertion Sort
**Algorithm**: Build sorted array by inserting elements one at a time in correct position.
**Game Idea**: "Card Collector" - Draw cards one by one and insert them into your sorted hand. Complete sets faster than opponents to win.

### 6. Selection Sort
**Algorithm**: Find minimum element, swap with first position, repeat for remaining.
**Game Idea**: "Talent Show" - Select the best performer each round and move them to the front of the line. Build the perfect performance order.

### 7. Counting Sort
**Algorithm**: Count occurrences of each value, calculate positions, place elements.
**Game Idea**: "Inventory Manager" - Count items in a warehouse, then arrange them on shelves in sorted order. Speed and accuracy determine your score.

### 8. Radix Sort
**Algorithm**: Sort by individual digits/characters, from least to most significant.
**Game Idea**: "Mail Sorter" - Sort mail by zip code, digit by digit. Start with the last digit and work your way to the first, organizing mail into the correct delivery routes.

### 9. Bucket Sort
**Algorithm**: Distribute elements into buckets, sort buckets, concatenate.
**Game Idea**: "Treasure Buckets" - Toss gems into buckets by value range, organize each bucket, then collect all sorted treasures.

### 10. Shell Sort
**Algorithm**: Generalized insertion sort with gap sequence, reducing gap until 1.
**Game Idea**: "Gap Jumper" - Organize platforms by making strategic gap-sized jumps. Start with large gaps and gradually reduce to make fine adjustments.

## Search Algorithms

### 11. Binary Search
**Algorithm**: Search sorted array by repeatedly halving search interval.
**Game Idea**: "Number Detective" - Guess a hidden number using binary search strategy. Minimize guesses to earn more points. Perfect for teaching computational thinking!

### 12. Depth-First Search (DFS)
**Algorithm**: Explore as far as possible along each branch before backtracking.
**Game Idea**: "Maze Explorer" - Navigate a dungeon using DFS strategy. Mark dead ends, backtrack when stuck, find the treasure at the deepest point.

### 13. Breadth-First Search (BFS)
**Algorithm**: Explore all neighbors at current depth before moving deeper.
**Game Idea**: "Flood Fill Paint" - Fill adjacent cells level by level like a spreading paint spill. Create art patterns while learning BFS concepts.

### 14. Binary Search on Answer
**Algorithm**: Binary search on the solution space rather than array indices.
**Game Idea**: "Resource Allocation" - Binary search for the minimum resources needed to complete a mission. Too few fails, too many wastes points.

### 15. Interpolation Search
**Algorithm**: Estimate position based on value, like searching a dictionary.
**Game Idea**: "Smart Seeker" - Use value estimation to find targets faster in a sorted world. Better estimations = bonus points.

### 16. Exponential Search
**Algorithm**: Find range using exponential increments, then binary search.
**Game Idea**: "Range Finder" - Quickly jump exponentially through space to bracket your target, then narrow down precisely.

### 17. Ternary Search
**Algorithm**: Divide search space into three parts for unimodal functions.
**Game Idea**: "Peak Finder" - Find the highest mountain peak by dividing the range into thirds. Used for archery to find optimal trajectory angle.

### 18. Jump Search
**Algorithm**: Jump ahead by fixed steps, then linear search in block.
**Game Idea**: "Block Hopper" - Jump through blocks to find hidden items. Optimize jump size to minimize total moves.

## Dynamic Programming

### 19. Fibonacci Sequence
**Algorithm**: F(n) = F(n-1) + F(n-2) with memoization.
**Game Idea**: "Rabbit Population" - Manage rabbit breeding following Fibonacci growth. Predict populations to manage resources.

### 20. Longest Common Subsequence (LCS)
**Algorithm**: Find longest subsequence common to two sequences.
**Game Idea**: "DNA Matcher" - Find matching genetic sequences between two DNA strands. Longer matches = better compatibility score.

### 21. Longest Increasing Subsequence (LIS)
**Algorithm**: Find longest strictly increasing subsequence.
**Game Idea**: "Stock Market Prophet" - Find the longest sequence of increasing stock prices to maximize investment strategy.

### 22. 0/1 Knapsack
**Algorithm**: Select items with max value within weight constraint.
**Game Idea**: "Dungeon Looter" - Fill your backpack with treasures without exceeding weight limit. Optimize value before escaping!

### 23. Unbounded Knapsack
**Algorithm**: Unlimited quantity of each item type available.
**Game Idea**: "Potion Brewer" - Mix unlimited ingredients to create maximum value potions within cauldron capacity.

### 24. Edit Distance (Levenshtein)
**Algorithm**: Minimum edits to transform one string to another.
**Game Idea**: "Word Morph" - Transform one word into another with minimum changes. Each edit costs energy in this puzzle game.

### 25. Coin Change
**Algorithm**: Minimum coins needed to make amount, or number of ways.
**Game Idea**: "Cashier Challenge" - Give exact change using minimum coins. Speed rounds increase difficulty with different coin systems.

### 26. Matrix Chain Multiplication
**Algorithm**: Optimal parenthesization for minimum multiplications.
**Game Idea**: "Factory Optimizer" - Arrange production lines in optimal order to minimize total operations and maximize factory output.

### 27. Longest Palindromic Subsequence
**Algorithm**: Find longest palindrome that can be formed as subsequence.
**Game Idea**: "Mirror Words" - Create the longest palindrome from available letters. Bonus points for using all letters.

### 28. Climbing Stairs
**Algorithm**: Count distinct ways to climb n stairs with 1 or 2 steps.
**Game Idea**: "Stairway Challenge" - How many different paths can you take? Visualize each unique climbing pattern with animations.

### 29. House Robber
**Algorithm**: Max sum from non-adjacent array elements.
**Game Idea**: "Stealth Thief" - Rob houses on a street without alerting adjacent homes (alarms). Maximize loot without getting caught!

### 30. House Robber II (Circular)
**Algorithm**: Houses arranged in circle, can't rob first and last together.
**Game Idea**: "Neighborhood Heist" - Circular street adds strategy - plan your route carefully to maximize loot on the circular block.

### 31. Maximum Subarray (Kadane's Algorithm)
**Algorithm**: Find contiguous subarray with maximum sum.
**Game Idea**: "Stock Trader" - Find the best consecutive trading days for maximum profit. Visualize profit/loss waves.

### 32. Word Break
**Algorithm**: Check if string can be segmented into dictionary words.
**Game Idea**: "Sentence Builder" - Break encrypted messages into valid words. More solutions = higher level decryption skills.

### 33. Decode Ways
**Algorithm**: Count ways to decode a digit string to letters.
**Game Idea**: "Secret Message" - Decode numbered messages where 1=A, 2=B, etc. Multiple valid decodings create puzzle complexity.

### 34. Partition Equal Subset Sum
**Algorithm**: Check if array can be partitioned into two equal sum subsets.
**Game Idea**: "Fair Division" - Divide treasures equally between two teams. Can you balance the scales perfectly?

### 35. Target Sum
**Algorithm**: Count ways to assign +/- to reach target sum.
**Game Idea**: "Number Wizard" - Use + and - signs to hit target scores. Limited moves make this a brain-teasing challenge.

### 36. Minimum Path Sum
**Algorithm**: Find path from top-left to bottom-right with minimum sum.
**Game Idea**: "Toll Road" - Navigate grid paying minimum total tolls. Each cell has a cost; find the cheapest route.

### 37. Unique Paths
**Algorithm**: Count paths in grid from top-left to bottom-right.
**Game Idea**: "Robot Navigator" - Program a robot to find all possible paths home. Visualize each unique route.

### 38. Jump Game
**Algorithm**: Determine if you can reach last index with given jump lengths.
**Game Idea**: "Platform Jumper" - Each platform shows max jump distance. Can you reach the goal? Plan your route!

### 39. Perfect Squares
**Algorithm**: Minimum perfect squares that sum to n.
**Game Idea**: "Square Builder" - Build target number using minimum perfect square blocks (1, 4, 9, 16...). Optimize your construction!

### 40. Egg Drop Problem
**Algorithm**: Minimum trials to find critical floor with limited eggs.
**Game Idea**: "Egg Lab" - Test egg strength by dropping from building floors. Minimize breaks while finding the critical floor.

## Graph Algorithms

### 41. Dijkstra's Shortest Path
**Algorithm**: Find shortest path from source to all vertices.
**Game Idea**: "Delivery Driver" - Find shortest route to deliver packages across the city. Traffic (weights) affects route choice.

### 42. Bellman-Ford Algorithm
**Algorithm**: Shortest path allowing negative weights, detects negative cycles.
**Game Idea**: "Time Traveler" - Navigate paths where time can go backward (negative weights). Detect time paradoxes (negative cycles)!

### 43. Floyd-Warshall
**Algorithm**: All-pairs shortest paths using dynamic programming.
**Game Idea**: "Network Architect" - Calculate optimal paths between all city pairs. Build the most efficient transportation network.

### 44. Topological Sort
**Algorithm**: Linear ordering of directed acyclic graph vertices.
**Game Idea**: "Course Planner" - Arrange courses considering prerequisites. Complete your degree in the right order!

### 45. Kruskal's MST
**Algorithm**: Minimum spanning tree by adding cheapest edges without cycles.
**Game Idea**: "Bridge Builder" - Connect islands with minimum total bridge cost. Avoid creating loops!

### 46. Prim's MST
**Algorithm**: Grow MST by adding cheapest edge from tree to new vertex.
**Game Idea**: "Power Grid" - Expand electrical grid from power plant. Connect all houses with minimum cable cost.

### 47. Tarjan's SCC
**Algorithm**: Find strongly connected components using DFS.
**Game Idea**: "Social Circles" - Identify friend groups where everyone knows everyone. Reveal hidden communities!

### 48. Kosaraju's SCC
**Algorithm**: Alternative SCC algorithm using two DFS passes.
**Game Idea**: "Double Agent" - Two-pass investigation reveals spy networks. Find all connected conspiracies.

### 49. Union-Find (Disjoint Set)
**Algorithm**: Track connected components with union and find operations.
**Game Idea**: "Clan Merger" - Merge tribes and quickly check if two people belong to same clan. Build alliances!

### 50. Cycle Detection
**Algorithm**: Detect cycles in directed/undirected graphs.
**Game Idea**: "Loop Detective" - Find infinite loops in a program flow or circular dependencies in a project.

### 51. Bipartite Graph Check
**Algorithm**: Check if graph can be 2-colored with BFS/DFS.
**Game Idea**: "Team Divider" - Divide people into two teams where no teammates are enemies. Can it be done?

### 52. Island Counting
**Algorithm**: Count connected components in 2D grid using DFS/BFS.
**Game Idea**: "Island Explorer" - Discover and count all islands in an ocean grid. Mark explored territory!

### 53. Word Ladder
**Algorithm**: Shortest transformation sequence between words changing one letter.
**Game Idea**: "Word Morph Ladder" - Transform START word to END word, one letter at a time. Shortest path wins!

### 54. Clone Graph
**Algorithm**: Deep copy a graph with connected nodes.
**Game Idea**: "Universe Clone" - Duplicate an entire social network. Ensure all relationships are preserved in the copy.

### 55. Course Schedule (Cycle Detection)
**Algorithm**: Check if courses can be completed given prerequisites.
**Game Idea**: "Academic Advisor" - Validate student course selections. Detect impossible prerequisite loops!

### 56. Network Delay Time
**Algorithm**: Time for signal to reach all nodes from source.
**Game Idea**: "Message Broadcast" - Send alerts through network. Calculate minimum time for everyone to receive the message.

### 57. Maximum Flow (Ford-Fulkerson)
**Algorithm**: Find maximum flow in a flow network.
**Game Idea**: "Pipeline Manager" - Maximize water/oil flow through pipeline network. Upgrade pipes strategically!

### 58. Minimum Cut
**Algorithm**: Find minimum capacity cut separating source and sink.
**Game Idea**: "Siege Warfare" - Find weakest defense points to separate enemy fortress from supplies.

### 59. Traveling Salesman (Approximations)
**Algorithm**: Find shortest route visiting all cities once.
**Game Idea**: "World Tour" - Visit all landmarks with minimum travel distance. Use heuristics for near-optimal routes.

### 60. A* Pathfinding
**Algorithm**: Informed search using heuristic for shortest path.
**Game Idea**: "Smart Navigator" - Find paths using distance estimates. Better heuristics = faster solutions and bonus points!

## Tree Algorithms

### 61. Binary Tree Inorder Traversal
**Algorithm**: Visit left, root, right recursively.
**Game Idea**: "Tree Walker" - Collect items in specific order. Left treasures first, then center, then right. Perfect sequence wins!

### 62. Binary Tree Preorder Traversal
**Algorithm**: Visit root, left, right recursively.
**Game Idea**: "Tree Scout" - Scout locations in preorder. Mark parent before exploring children in this strategy game.

### 63. Binary Tree Postorder Traversal
**Algorithm**: Visit left, right, root recursively.
**Game Idea**: "Bottom-Up Builder" - Build from leaves up to root. Children must be completed before parents.

### 64. Level Order Traversal
**Algorithm**: Visit nodes level by level using BFS.
**Game Idea**: "Floor by Floor" - Clear building floor by floor from top to bottom. Complete each level to progress.

### 65. ZigZag Level Order
**Algorithm**: Alternate left-to-right and right-to-left by level.
**Game Idea**: "Ski Slalom" - Navigate tree in zigzag pattern. Hit gates in correct order while switching directions!

### 66. Binary Search Tree Validation
**Algorithm**: Check if tree maintains BST property.
**Game Idea**: "Tree Inspector" - Validate that organizational hierarchy follows rules. Find violations in the structure.

### 67. Lowest Common Ancestor (LCA)
**Algorithm**: Find lowest common ancestor of two nodes.
**Game Idea**: "Family Tree" - Find common ancestor of two people. Trace lineages to discover relationships!

### 68. Maximum Depth
**Algorithm**: Find longest path from root to leaf.
**Game Idea**: "Deep Diver" - How deep is the ocean trench? Measure maximum depth of underwater cave system.

### 69. Minimum Depth
**Algorithm**: Find shortest path from root to leaf.
**Game Idea**: "Quick Escape" - Find shortest path to exit the tree structure. Escape the maze fastest!

### 70. Balanced Tree Check
**Algorithm**: Check if tree heights differ by at most 1.
**Game Idea**: "Balance Beam" - Check if the tree structure is balanced. Wobbly trees (unbalanced) need fixing!

### 71. Symmetric Tree Check
**Algorithm**: Check if tree is mirror image of itself.
**Game Idea**: "Mirror Palace" - Verify that palace architecture is perfectly symmetric. Find asymmetries!

### 72. Path Sum
**Algorithm**: Check if root-to-leaf path sums to target.
**Game Idea**: "Treasure Path" - Find paths where collected gems sum to exact target value. X marks the spot!

### 73. Binary Tree Maximum Path Sum
**Algorithm**: Find path with maximum sum (can start/end anywhere).
**Game Idea**: "Gold Rush" - Find the most valuable path through the mine. Start and end anywhere for max gold!

### 74. Serialize and Deserialize Tree
**Algorithm**: Convert tree to string and back.
**Game Idea**: "Save & Load" - Save your game tree state to text, then restore it perfectly. Test data integrity!

### 75. Trie (Prefix Tree) Construction
**Algorithm**: Build tree for efficient string prefix operations.
**Game Idea**: "Auto-Complete" - Build a word suggestion system. Faster, more accurate suggestions = higher scores.

### 76. Segment Tree
**Algorithm**: Tree for range queries and updates.
**Game Idea**: "Territory Manager" - Query and update ranges of controlled territory efficiently during empire expansion.

### 77. Binary Indexed Tree (Fenwick)
**Algorithm**: Tree for cumulative frequency tables.
**Game Idea**: "Score Tracker" - Track cumulative scores across game regions. Quick queries win competitive advantages.

### 78. AVL Tree Rotations
**Algorithm**: Self-balancing BST using rotations.
**Game Idea**: "Balance Master" - Rotate tree nodes to maintain perfect balance after each insertion. Keep the tree stable!

### 79. Red-Black Tree Operations
**Algorithm**: Self-balancing BST using color properties.
**Game Idea**: "Color Code" - Maintain tree using red/black coloring rules. Recolor and rotate to keep properties.

### 80. N-ary Tree Traversal
**Algorithm**: Traverse tree where nodes have multiple children.
**Game Idea**: "Family Reunion" - Visit extended family where parents have many children. Plan optimal visiting order!

## String Algorithms

### 81. KMP Pattern Matching
**Algorithm**: Efficient string matching using partial match table.
**Game Idea**: "Pattern Hunter" - Find patterns in ancient texts efficiently. Skip unnecessary comparisons to save time!

### 82. Rabin-Karp Algorithm
**Algorithm**: String matching using rolling hash.
**Game Idea**: "Hash Detective" - Use fingerprints (hashes) to quickly find matching text sequences. False positives add challenge!

### 83. Longest Palindromic Substring
**Algorithm**: Find longest palindrome in a string.
**Game Idea**: "Palindrome Paradise" - Discover the longest mirror-word hidden in encrypted messages. Expand around centers!

### 84. Manacher's Algorithm
**Algorithm**: Linear time longest palindrome algorithm.
**Game Idea**: "Speed Palindrome" - Find palindromes lightning fast using Manacher's technique. Beat the speed records!

### 85. String to Integer (atoi)
**Algorithm**: Parse string to integer handling edge cases.
**Game Idea**: "Number Parser" - Convert written numbers to digits while handling errors. Accuracy and edge cases matter!

### 86. Regular Expression Matching
**Algorithm**: Match string against pattern with * and . wildcards.
**Game Idea**: "Wildcard Wizard" - Match patterns to unlock doors. Learn regex through pattern-matching puzzles!

### 87. Valid Parentheses
**Algorithm**: Check if brackets are properly matched using stack.
**Game Idea**: "Bracket Matcher" - Balance nested parentheses to keep bridges stable. Unmatched brackets cause collapse!

### 88. Generate Parentheses
**Algorithm**: Generate all valid n-pair parentheses combinations.
**Game Idea**: "Combination Creator" - Create all possible valid bracket sequences. More complex = higher levels!

### 89. Longest Substring Without Repeating
**Algorithm**: Find longest substring with unique characters.
**Game Idea**: "Unique Path" - Collect items without picking duplicates. Maximize streak length for bonus points!

### 90. Minimum Window Substring
**Algorithm**: Find smallest window containing all target characters.
**Game Idea**: "Tight Fit" - Find the smallest area containing all required items. Minimize waste, maximize efficiency!

## Backtracking & Recursion

### 91. N-Queens Problem
**Algorithm**: Place N queens on N×N board with no conflicts.
**Game Idea**: "Queen's Guard" - Position queens so none can attack each other. Visualize solutions on chessboard!

### 92. Sudoku Solver
**Algorithm**: Fill 9×9 grid following Sudoku rules using backtracking.
**Game Idea**: "Number Detective" - Solve Sudoku puzzles with smart backtracking. Hint system teaches technique!

### 93. Graph Coloring
**Algorithm**: Color graph nodes so adjacent nodes differ.
**Game Idea**: "Map Painter" - Color map regions so neighbors have different colors. Minimize total colors used!

### 94. Subset Generation
**Algorithm**: Generate all possible subsets of a set.
**Game Idea**: "Team Builder" - Create all possible team combinations from available players. Explore the power set!

### 95. Permutations
**Algorithm**: Generate all possible arrangements of elements.
**Game Idea**: "Lineup Master" - Arrange players in all possible orders. Find the winning formation!

### 96. Combinations
**Algorithm**: Generate all k-element combinations from n elements.
**Game Idea**: "Lottery Picker" - Choose k numbers from n options. Generate all possible lottery tickets!

### 97. Combination Sum
**Algorithm**: Find combinations summing to target (with reuse allowed).
**Game Idea**: "Coin Collector" - Combine coins to reach exact target. Multiple solutions increase difficulty!

### 98. Letter Combinations of Phone Number
**Algorithm**: Generate all letter combinations from digit phone number.
**Game Idea**: "Old Phone" - Type on classic phone keypad. Generate all possible words from number sequences!

### 99. Palindrome Partitioning
**Algorithm**: Partition string into all palindromic substrings.
**Game Idea**: "Word Slicer" - Cut words into palindrome pieces. All pieces must be mirror-words!

### 100. Word Search in Grid
**Algorithm**: Find if word exists in 2D grid using backtracking DFS.
**Game Idea**: "Word Hunt" - Search for hidden words in letter grid. Connect adjacent letters to form words!

---

## Summary Statistics

- **Sorting Algorithms**: 10
- **Search Algorithms**: 8
- **Dynamic Programming**: 22
- **Graph Algorithms**: 20
- **Tree Algorithms**: 20
- **String Algorithms**: 10
- **Backtracking & Recursion**: 10

**Total**: 100 unique algorithms

## Game Design Patterns Identified

1. **Puzzle Games**: Edit distance, Sudoku, Word search
2. **Strategy Games**: Knapsack problems, Graph coloring, Resource allocation
3. **Speed/Reflex Games**: Sorting visualizations, Pattern matching
4. **Educational Games**: Algorithm visualization, Step-by-step learning
5. **Optimization Games**: Pathfinding, Maximum flow, MST
6. **Logic Games**: Valid parentheses, BST validation, Bipartite checking

Each algorithm can be enhanced with:
- **Visual feedback**: Animations showing algorithm steps
- **Scoring systems**: Time-based, move-based, or accuracy-based
- **Difficulty progression**: Larger inputs, more constraints, time limits
- **Multiplayer modes**: Competitive solving, cooperative optimization
- **Narrative integration**: Story-driven algorithm challenges
