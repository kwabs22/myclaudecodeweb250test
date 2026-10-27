const { instance } = require("./harness");
const R = require("path").join(__dirname, "..") + "/";
const cases = [["graph/kruskal-mst","kruskal"],["graph/topological-sort","topologicalSort"],["string/kmp-pattern-matching","searchPattern"],["string/kmp-pattern-matching","computeLPS"],["dynamic-programming/lcs","calculateLCS"],["dynamic-programming/lcs","reconstructLCS"],["dynamic-programming/coin-change","calculateMinCoins"],["dynamic-programming/knapsack-01","solveKnapsack"],["dynamic-programming/knapsack-01","reconstructSolution"],["backtracking/sudoku-solver","solveSudoku"],["backtracking/n-queens","solveNQueens"],["tree/binary-tree-traversal","calculateTraversal"],["tree/bst-validation","validateTree"],["dynamic-programming/fibonacci","startCalculation"]];
for (const [f, m] of cases) {
  try {
    const a = instance(R + f + ".js"); a.o.initialize(); const init = a.logs.slice(); a.logs.length = 0; a.o[m](); const first = a.logs.slice();
    a.logs.length = 0; a.o[m](); const second = a.logs.slice();
    // fresh instance, call once, to compare with a call after initialize's own work
    const norm = (a) => JSON.stringify(a.map((l) => l.replace(/in \d+ ms/, 'in N ms')));
    // Methods that log nothing (computeLPS, reconstruct...) have nothing to compare
    const same = first.length === 0 || (norm(first) === norm(second) && (init.length === 0 || norm(init.slice(-first.length)) === norm(first)));
    console.log((same ? "ok       " : "DIFFERS  ") + f + " " + m + (same ? "" : "\n     init: " + init.join(" / ").slice(0, 100) + "\n     1st: " + first.join(" / ").slice(0, 110) + "\n     2nd: " + second.join(" / ").slice(0, 110)));
  } catch (e) { console.log("ERROR    " + f + " " + m + " " + e.message.slice(0, 100)); }
}
