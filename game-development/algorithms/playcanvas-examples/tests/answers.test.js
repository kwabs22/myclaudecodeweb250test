const { instance } = require("./harness"); const assert = require("assert");
const R = require("path").join(__dirname, "..") + "/";
const results = []; 
function T(file, name, fn) {
  try { const { o } = instance(R + file + ".js"); o.initialize && o.initialize(); fn(o); results.push([file, name, "ok"]); }
  catch (e) { results.push([file, name, "FAIL " + e.message.split("\n")[0].slice(0, 150)]); }
}
const same = (a, b) => assert.strictEqual(JSON.stringify(a), JSON.stringify(b));
const sorted = (a) => a.map((x) => Array.isArray(x) ? x.slice().sort() : x).map((x) => JSON.stringify(x)).sort();
const N = (v, l, r) => ({ val: v, left: l || null, right: r || null });
// ---- backtracking
T("backtracking/combination-sum", "[2,3,6,7] target 7", (o) => same(sorted(o.combinationSum([2, 3, 6, 7], 7)), sorted([[2, 2, 3], [7]])));
T("backtracking/combinations", "C(4,2)", (o) => assert.strictEqual(o.combine(4, 2).length, 6));
T("backtracking/graph-coloring", "triangle needs 3", (o) => { const g = [[0,1,1],[1,0,1],[1,1,0]]; assert.ok(o.graphColoring(g, 3)); assert.ok(!o.graphColoring(g, 2)); });
T("backtracking/letter-combinations", "23", (o) => same(o.letterCombinations("23").slice().sort(), ["ad","ae","af","bd","be","bf","cd","ce","cf"]));
T("backtracking/palindrome-partitioning", "aab", (o) => same(sorted(o.partition("aab")), sorted([["a","a","b"],["aa","b"]])));
T("backtracking/permutations", "3 items", (o) => assert.strictEqual(o.permute([1,2,3]).length, 6));
T("backtracking/subset-generation", "3 items", (o) => assert.strictEqual(o.subsets([1,2,3]).length, 8));
T("backtracking/word-search", "ABCCED / SEE / ABCB", (o) => { const b = () => [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]; assert.ok(o.exist(b(),"ABCCED")); assert.ok(o.exist(b(),"SEE")); assert.ok(!o.exist(b(),"ABCB")); });
// ---- dynamic programming
T("dynamic-programming/climbing-stairs", "5 -> 8", (o) => assert.strictEqual(o.climbStairs(5), 8));
T("dynamic-programming/decode-ways", "226 -> 3, 06 -> 0", (o) => { assert.strictEqual(o.numDecodings("226"), 3); assert.strictEqual(o.numDecodings("06"), 0); });
T("dynamic-programming/edit-distance", "horse/ros -> 3", (o) => { assert.strictEqual(o.minDistance("horse","ros"), 3); assert.strictEqual(o.minDistance("intention","execution"), 5); });
T("dynamic-programming/egg-drop", "2 eggs 10 floors -> 4", (o) => { assert.strictEqual(o.eggDrop(2,10), 4); assert.strictEqual(o.eggDrop(1,5), 5); });
T("dynamic-programming/fibonacci", "fib(10)=55", (o) => assert.strictEqual(o.fib(10), 55));
T("dynamic-programming/house-robber", "[2,7,9,3,1] -> 12", (o) => assert.strictEqual(o.rob([2,7,9,3,1]), 12));
T("dynamic-programming/house-robber-ii", "circular", (o) => { assert.strictEqual(o.rob([2,3,2]), 3); assert.strictEqual(o.rob([1,2,3,1]), 4); assert.strictEqual(o.rob([1]), 1); });
T("dynamic-programming/jump-game", "reachable", (o) => { assert.ok(o.canJump([2,3,1,1,4])); assert.ok(!o.canJump([3,2,1,0,4])); });
T("dynamic-programming/knapsack-unbounded", "cap 8", (o) => assert.strictEqual(o.unboundedKnapsack(8, [2,3,4], [4,5,8]), 16));
T("dynamic-programming/longest-increasing-subsequence", "LIS", (o) => assert.strictEqual(o.lengthOfLIS([10,9,2,5,3,7,101,18]), 4));
T("dynamic-programming/longest-palindromic-subsequence", "bbbab -> 4", (o) => assert.strictEqual(o.longestPalindromeSubseq("bbbab"), 4));
T("dynamic-programming/matrix-chain-multiplication", "[10,30,5,60] -> 4500", (o) => assert.strictEqual(o.matrixChainOrder([10,30,5,60]), 4500));
T("dynamic-programming/maximum-subarray", "Kadane", (o) => { assert.strictEqual(o.maxSubArray([-2,1,-3,4,-1,2,1,-5,4]), 6); assert.strictEqual(o.maxSubArray([-3,-1,-2]), -1); });
T("dynamic-programming/minimum-path-sum", "7", (o) => assert.strictEqual(o.minPathSum([[1,3,1],[1,5,1],[4,2,1]]), 7));
T("dynamic-programming/partition-equal-subset", "partition", (o) => { assert.ok(o.canPartition([1,5,11,5])); assert.ok(!o.canPartition([1,2,3,5])); });
T("dynamic-programming/perfect-squares", "12 -> 3, 13 -> 2", (o) => { assert.strictEqual(o.numSquares(12), 3); assert.strictEqual(o.numSquares(13), 2); });
T("dynamic-programming/target-sum", "[1,1,1,1,1] 3 -> 5", (o) => assert.strictEqual(o.findTargetSumWays([1,1,1,1,1], 3), 5));
T("dynamic-programming/unique-paths", "3x7 -> 28", (o) => assert.strictEqual(o.uniquePaths(3,7), 28));
T("dynamic-programming/word-break", "leetcode", (o) => { assert.ok(o.wordBreak("leetcode", ["leet","code"])); assert.ok(!o.wordBreak("catsandog", ["cats","dog","sand","and","cat"])); });
// ---- graph
T("graph/bellman-ford", "distances and negative cycle", (o) => { same(o.bellmanFord(5, [[0,1,6],[0,2,7],[1,2,8],[1,3,5],[1,4,-4],[2,3,-3],[2,4,9],[3,1,-2],[4,3,7],[4,0,2]], 0), [0,2,7,4,-2]); assert.strictEqual(o.bellmanFord(3, [[0,1,1],[1,2,-1],[2,0,-1]], 0), null); });
T("graph/bipartite-check", "even and odd cycle", (o) => { assert.ok(o.isBipartite([[1,3],[0,2],[1,3],[0,2]])); assert.ok(!o.isBipartite([[1,2,3],[0,2],[0,1,3],[0,2]])); });
T("graph/course-schedule", "cycle", (o) => { assert.ok(o.canFinish(2, [[1,0]])); assert.ok(!o.canFinish(2, [[1,0],[0,1]])); });
T("graph/island-counting", "3 islands", (o) => assert.strictEqual(o.numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]), 3));
T("graph/network-delay", "2", (o) => assert.strictEqual(o.networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2), 2));
T("graph/word-ladder", "hit -> cog = 5", (o) => { assert.strictEqual(o.ladderLength("hit","cog",["hot","dot","dog","lot","log","cog"]), 5); assert.strictEqual(o.ladderLength("hit","cog",["hot","dot","dog","lot","log"]), 0); });
T("graph/union-find", "connectivity", (o) => { [1,2,3,4].forEach((x) => o.makeSet(x)); o.union(1,2); o.union(3,4); assert.strictEqual(o.find(1), o.find(2)); assert.notStrictEqual(o.find(1), o.find(3)); o.union(2,3); assert.strictEqual(o.find(1), o.find(4)); });
// ---- search
T("search/binary-search-on-answer", "bouquets and split array", (o) => { assert.strictEqual(o.minDaysToMakeBouquets([1,10,3,10,2],3,1), 3); assert.strictEqual(o.minDaysToMakeBouquets([1,10,3,10,2],3,2), -1); assert.strictEqual(o.splitArray([7,2,5,10,8],2), 18); });
const arr = [1,3,5,7,9,11,13,15,17,19,21];
T("search/exponential-search", "find and miss", (o) => { assert.strictEqual(o.exponentialSearch(arr, 13), 6); assert.strictEqual(o.exponentialSearch(arr, 1), 0); assert.strictEqual(o.exponentialSearch(arr, 4), -1); });
T("search/interpolation-search", "find and miss", (o) => { assert.strictEqual(o.interpolationSearch(arr, 17), 8); assert.strictEqual(o.interpolationSearch(arr, 4), -1); });
T("search/jump-search", "find and miss", (o) => { assert.strictEqual(o.jumpSearch(arr, 19), 9); assert.strictEqual(o.jumpSearch(arr, 1), 0); assert.strictEqual(o.jumpSearch(arr, 2), -1); });
T("search/ternary-search", "find and peak", (o) => { assert.strictEqual(o.ternarySearch(arr, 9), 4); assert.strictEqual(o.ternarySearch(arr, 10), -1); const p = o.findPeak([1,3,8,12,9,4]); assert.ok(p === 3 || p === 12, "peak index or value: " + p); });
// ---- string
T("string/atoi", "cases", (o) => { assert.strictEqual(o.myAtoi("  -42"), -42); assert.strictEqual(o.myAtoi("4193 with words"), 4193); assert.strictEqual(o.myAtoi("words and 987"), 0); assert.strictEqual(o.myAtoi("-91283472332"), -2147483648); assert.strictEqual(o.myAtoi("91283472332"), 2147483647); });
T("string/generate-parentheses", "n=3", (o) => same(o.generateParenthesis(3).slice().sort(), ["((()))","(()())","(())()","()(())","()()()"]));
T("string/longest-palindrome", "babad", (o) => { assert.ok(["bab","aba"].includes(o.longestPalindrome("babad"))); assert.strictEqual(o.longestPalindrome("cbbd"), "bb"); });
T("string/manacher", "babad", (o) => { assert.ok(["bab","aba"].includes(o.longestPalindrome("babad"))); assert.strictEqual(o.longestPalindrome("cbbd"), "bb"); assert.strictEqual(o.longestPalindrome("a"), "a"); });
T("string/longest-unique-substring", "abcabcbb", (o) => { assert.strictEqual(o.lengthOfLongestSubstring("abcabcbb"), 3); assert.strictEqual(o.lengthOfLongestSubstring("bbbbb"), 1); assert.strictEqual(o.lengthOfLongestSubstring(""), 0); });
T("string/minimum-window-substring", "BANC", (o) => { assert.strictEqual(o.minWindow("ADOBECODEBANC","ABC"), "BANC"); assert.strictEqual(o.minWindow("a","aa"), ""); });
T("string/rabin-karp", "finds all", (o) => { const r = o.search("hello world, world","world"); assert.ok(JSON.stringify(r) === "[6,13]" || r === 6, "got " + JSON.stringify(r)); });
T("string/regex-matching", "cases", (o) => { assert.ok(!o.isMatch("aa","a")); assert.ok(o.isMatch("aa","a*")); assert.ok(o.isMatch("ab",".*")); assert.ok(!o.isMatch("mississippi","mis*is*p*.")); assert.ok(o.isMatch("aab","c*a*b")); });
T("string/valid-parentheses", "cases", (o) => { assert.ok(o.isValid("()[]{}")); assert.ok(!o.isValid("(]")); assert.ok(!o.isValid("([)]")); assert.ok(o.isValid("{[]}")); assert.ok(!o.isValid("(")); });
// ---- tree
const tree = N(3, N(9), N(20, N(15), N(7)));
T("tree/max-depth", "3", (o) => assert.strictEqual(o.maxDepth(tree), 3));
T("tree/minimum-depth", "2", (o) => { assert.strictEqual(o.minDepth(tree), 2); assert.strictEqual(o.minDepth(N(2, null, N(3, null, N(4)))), 3); });
T("tree/balanced-check", "balanced and not", (o) => { assert.ok(o.isBalanced(tree)); assert.ok(!o.isBalanced(N(1, N(2, N(3, N(4))), N(2)))); });
T("tree/inorder-traversal", "3 versions agree", (o) => { same(o.inorderTraversal(tree), [9,3,15,20,7]); same(o.iterative(tree), [9,3,15,20,7]); });
T("tree/preorder-traversal", "preorder", (o) => { same(o.preorderTraversal(tree), [3,9,20,15,7]); same(o.iterative(tree), [3,9,20,15,7]); });
T("tree/postorder-traversal", "postorder", (o) => { same(o.postorderTraversal(tree), [9,15,7,20,3]); same(o.iterative(tree), [9,15,7,20,3]); });
T("tree/zigzag-traversal", "zigzag", (o) => same(o.zigzagLevelOrder(tree), [[3],[20,9],[15,7]]));
T("tree/path-sum", "22", (o) => { const t = N(5, N(4, N(11, N(7), N(2))), N(8, N(13), N(4, null, N(1)))); assert.ok(o.hasPathSum(t, 22)); assert.ok(!o.hasPathSum(t, 100)); });
T("tree/maximum-path-sum", "42", (o) => { assert.strictEqual(o.maxPathSum(N(-10, N(9), N(20, N(15), N(7)))), 42); assert.strictEqual(o.maxPathSum(N(-3)), -3); });
T("tree/symmetric-tree", "cases", (o) => { assert.ok(o.isSymmetric(N(1, N(2, N(3), N(4)), N(2, N(4), N(3))))); assert.ok(!o.isSymmetric(N(1, N(2, null, N(3)), N(2, null, N(3))))); });
T("tree/lca", "cases", (o) => { const n5 = N(5, N(6), N(2, N(7), N(4))), n1 = N(1, N(0), N(8)); const root = N(3, n5, n1); assert.strictEqual(o.lowestCommonAncestor(root, n5, n1).val, 3); assert.strictEqual(o.lowestCommonAncestor(root, n5, n5.right.right).val, 5); });
T("tree/serialize-tree", "round trip", (o) => { const t = N(1, N(2), N(3, N(4), N(5))); const s = o.serialize(t); const d = o.deserialize(s); same(JSON.parse(JSON.stringify(d)), JSON.parse(JSON.stringify(t))); });
T("tree/trie", "insert search prefix", (o) => { o.insert("apple"); assert.ok(o.search("apple")); assert.ok(!o.search("app")); assert.ok(o.startsWith("app")); o.insert("app"); assert.ok(o.search("app")); assert.ok(!o.startsWith("b")); });
T("tree/fenwick-tree", "prefix and range sums", (o) => { o.init(8); [5,3,7,9,6,4,1,2].forEach((v, i) => o.add(i + 1, v)); assert.strictEqual(o.query(4), 24); assert.strictEqual(o.rangeQuery(2,5), 25); });
T("tree/n-ary-tree-traversal", "orders", (o) => { const t = { val: 1, children: [{ val: 3, children: [{ val: 5, children: [] }, { val: 6, children: [] }] }, { val: 2, children: [] }, { val: 4, children: [] }] }; same(o.preorder(t), [1,3,5,6,2,4]); same(o.postorder(t), [5,6,3,2,4,1]); same(o.levelOrder(t), [[1],[3,2,4],[5,6]]); });
const bad = results.filter((r) => r[2] !== "ok");
console.log(results.length, "checks;", results.length - bad.length, "pass;", bad.length, "fail");
bad.forEach((r) => console.log("  FAIL", r[0], "|", r[1], "|", r[2]));
