const { instance } = require("./harness");
const R = require("path").join(__dirname, "..") + "/";
function seeded(seed) { let s = seed; const M = Object.create(Math); M.random = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; return M; }
function reach(grid, n, diag) {
  const seen = new Set(["0,0"]), q = [[0, 0, 0]]; const dirs = [[1,0],[-1,0],[0,1],[0,-1]]; if (diag) dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
  while (q.length) { const [r, c, d] = q.shift(); if (r === n - 1 && c === n - 1) return d; for (const [dr, dc] of dirs) { const a = r + dr, b = c + dc; if (a < 0 || b < 0 || a >= n || b >= n || grid[a][b].isWall || seen.has(a + "," + b)) continue; seen.add(a + "," + b); q.push([a, b, d + 1]); } }
  return -1;
}
for (const [file, start, flag, re] of [["search/bfs","startBFS","searching",/Goal found/],["search/dfs","startDFS","searching",/Goal found/],["graph/a-star","startAStar","searching",/Path found/]]) {
  let ok = 0, bad = [];
  for (let seed = 1; seed <= 60; seed++) {
    const { o, logs } = instance(R + file + ".js", { Math: seeded(seed) });
    o.initialize(); o[start](); let i = 0; while (o[flag] !== false && i < 20000) { o.update(100); i++; }
    const text = logs.join(" | "), said = re.test(text) && !/No path/.test(text);
    const truth = reach(o.grid, o.gridSize, false) >= 0;
    const m = /(?:level|length)[: ]+(\d+)/i.exec(text);
    if (said === truth && (!said || file !== "search/bfs" || !m || +m[1] === reach(o.grid, o.gridSize, false))) ok++; else bad.push({ seed, said, truth, text: text.slice(-90), real: reach(o.grid, o.gridSize, false) });
  }
  console.log(file.padEnd(14), ok + "/60 agree with an independent search", bad.slice(0, 2).map((b) => JSON.stringify(b)).join(" "));
}
