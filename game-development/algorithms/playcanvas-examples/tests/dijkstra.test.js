const { instance } = require("./harness");
const R = require("path").join(__dirname, "..") + "/";
const { o, logs } = instance(R + "graph/dijkstra.js"); o.initialize();
console.log("graph:", JSON.stringify(o.graph).slice(0, 300));
function dij(g, s) { const d = {}; Object.keys(g).forEach((k) => d[k] = Infinity); d[s] = 0; const seen = new Set(); while (true) { let u = null; for (const k in d) if (!seen.has(k) && (u === null || d[k] < d[u])) u = k; if (u === null || d[u] === Infinity) break; seen.add(u); const nb = g[u] || {}; const list = Array.isArray(nb) ? nb : Object.entries(nb).map(([to, w]) => ({ to, weight: w })); for (const e of list) { const to = e.to || e.node || e.target, w = e.weight ?? e.w; if (d[u] + w < d[to]) d[to] = d[u] + w; } } return d; }
const names = Object.keys(o.graph);
let ok = 0, bad = [];
for (const s of names) for (const t of names) {
  if (s === t) continue;
  const i = instance(R + "graph/dijkstra.js"); i.o.initialize(); i.o.startDijkstra(s, t); let n = 0; while (i.o.running !== false && n < 1000) { i.o.update(100); n++; }
  const truth = dij(i.o.graph, s)[t];
  const got = i.o.distances[t];
  if (got === truth) ok++; else bad.push([s, t, got, truth]);
}
console.log("dijkstra distances match an independent run:", ok, "of", names.length * (names.length - 1), bad.slice(0, 4));
