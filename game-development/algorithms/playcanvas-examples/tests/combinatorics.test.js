// Checks that the counting and enumerating tasks give the numbers combinatorics predicts.
// These are the tasks learning-resources/mathematics/README.md points to, so the two stay in step.
const { instance } = require("./harness"); const assert = require("assert");
const R = require("path").join(__dirname, "..") + "/";
const results = [];
function T(file, name, fn) {
  try { const { o } = instance(R + file + ".js"); o.initialize && o.initialize(); fn(o); results.push([file, name, "ok"]); }
  catch (e) { results.push([file, name, "FAIL " + e.message.split("\n")[0].slice(0, 150)]); }
}
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const choose = (n, k) => fact(n) / (fact(k) * fact(n - k));
const catalan = (n) => choose(2 * n, n) / (n + 1);
const fib = (n) => { let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; };
const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

T("backtracking/permutations", "n! orderings for n = 1..6", (o) => { for (let n = 1; n <= 6; n++) { o.initialize(); assert.strictEqual(o.permute(range(n)).length, fact(n), "n=" + n); } });
T("backtracking/combinations", "C(n,k) selections", (o) => { for (const [n, k] of [[5, 2], [6, 3], [8, 4], [7, 0], [7, 7], [10, 3]]) { assert.strictEqual(o.combine(n, k).length, choose(n, k), n + "," + k); } });
T("backtracking/subset-generation", "2^n subsets for n = 0..8", (o) => { for (let n = 0; n <= 8; n++) { o.initialize(); assert.strictEqual(o.subsets(range(n)).length, 2 ** n, "n=" + n); } });
T("backtracking/subset-generation", "C(6,3) = 20 subsets of size 3 (question 12: binary strings with three 1s)", (o) => { assert.strictEqual(o.subsets(range(6)).filter((s) => s.length === 3).length, 20); });
T("string/generate-parentheses", "Catalan(n) balanced strings for n = 1..7", (o) => { for (let n = 1; n <= 7; n++) { o.initialize(); assert.strictEqual(o.generateParenthesis(n).length, catalan(n), "n=" + n); } });
T("dynamic-programming/unique-paths", "C(m+n-2, m-1) grid paths (question 52: 5 right, 5 up = 252)", (o) => { assert.strictEqual(o.uniquePaths(6, 6), 252); for (const [m, n] of [[3, 7], [4, 4], [2, 9], [5, 8]]) assert.strictEqual(o.uniquePaths(m, n), choose(m + n - 2, m - 1), m + "x" + n); });
T("dynamic-programming/climbing-stairs", "Fibonacci(n+1) ways (question 50: tilings of a 2 x n board with dominoes)", (o) => { for (let n = 1; n <= 15; n++) { o.initialize(); assert.strictEqual(o.climbStairs(n), fib(n + 1), "n=" + n); } });
T("dynamic-programming/target-sum", "n ones, target k: C(n, (n+k)/2) sign choices", (o) => { for (const [n, k] of [[5, 3], [6, 0], [6, 2], [7, 1], [8, 4]]) assert.strictEqual(o.findTargetSumWays(Array(n).fill(1), k), choose(n, (n + k) / 2), n + "," + k); });
T("dynamic-programming/coin-change", "countWays: 121 ways to make 100 cents from 1, 5, 10 (question 73)", (o) => { assert.strictEqual(o.countWays([1, 5, 10], 100), 121); assert.strictEqual(o.countWays([1, 2, 5], 5), 4); assert.strictEqual(o.countWays([2], 3), 0); assert.strictEqual(o.countWays([1, 5, 10, 25, 50], 100), 292); });
T("dynamic-programming/coin-change", "countWays with only pennies is always 1; order does not matter", (o) => { for (let a = 0; a <= 20; a++) assert.strictEqual(o.countWays([1], a), 1); assert.strictEqual(o.countWays([1, 2, 3], 4), o.countWays([3, 2, 1], 4)); });
T("backtracking/graph-coloring", "K4 needs 4 colours; a 4-cycle needs 2 (questions 60 and 82)", (o) => { const k4 = [[0,1,1,1],[1,0,1,1],[1,1,0,1],[1,1,1,0]]; assert.ok(!o.graphColoring(k4, 3)); assert.ok(o.graphColoring(k4, 4)); const c4 = [[0,1,0,1],[1,0,1,0],[0,1,0,1],[1,0,1,0]]; assert.ok(!o.graphColoring(c4, 1)); assert.ok(o.graphColoring(c4, 2)); });
T("graph/bipartite-check", "even cycle is bipartite, odd cycle is not", (o) => { const c4 = [[1,3],[0,2],[1,3],[0,2]]; const c5 = [[1,4],[0,2],[1,3],[2,4],[3,0]]; assert.ok(o.isBipartite(c4)); assert.ok(!o.isBipartite(c5)); });

const bad = results.filter((r) => r[2] !== "ok");
for (const r of results) console.log((r[2] === "ok" ? "ok   " : "FAIL ") + r[0] + ": " + r[1] + (r[2] === "ok" ? "" : "  -> " + r[2]));
if (bad.length) process.exit(1);
