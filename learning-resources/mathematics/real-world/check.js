// Checks the numbers on the page against independent calculations and brute force.
// Run with: node check.js   (no installs; Node 18 or newer)
const R = require("./tasks.js"); const assert = require("assert"); const fs = require("fs"); const path = require("path");
const U = R.util; const T = Object.fromEntries(R.TASKS.map((t) => [t.id, t]));
let ok = 0; const fails = [];
function test(name, fn) { try { fn(); ok++; } catch (e) { fails.push(name + ": " + e.message.split("\n")[0]); } }
const defaults = (t) => Object.fromEntries(t.controls.map((c) => [c.key, c.value]));
const row = (t, vals, label) => { const o = T[t].compute(Object.assign(defaults(T[t]), vals)); const r = o.rows.find((x) => x[0].startsWith(label)); assert.ok(r, "no row " + label + " in " + t); return r[1]; };

test("every group has tasks and every task has the required parts", () => {
  const ids = new Set(R.MODALITIES.map((m) => m.id)); assert.strictEqual(ids.size, 7);
  for (const t of R.TASKS) { assert.ok(ids.has(t.modality), t.id); for (const k of ["title", "ask", "idea"]) assert.ok(t[k] && t[k].length > (k === "title" ? 8 : 20), t.id + " " + k); assert.ok(t.controls.length >= 1); }
  for (const m of R.MODALITIES) assert.ok(R.TASKS.filter((t) => t.modality === m.id).length >= 3, m.id);
  assert.strictEqual(new Set(R.TASKS.map((t) => t.id)).size, R.TASKS.length);
});
test("every control extreme computes without a blank, NaN or undefined", () => {
  for (const t of R.TASKS) {
    const base = defaults(t); const cases = [base];
    for (const c of t.controls) { if (c.type === "range") { cases.push({ ...base, [c.key]: c.min }); const max = c.maxFor ? c.maxFor(base) : c.max; cases.push({ ...base, [c.key]: max }); } if (c.type === "select") for (const o of c.options) cases.push({ ...base, [c.key]: o[0] }); }
    for (const v of cases) { const o = t.compute(v); assert.ok(o.rows.length >= 2, t.id); for (const [a, b] of o.rows) { assert.ok(a && String(b).length, t.id + " blank"); assert.ok(!/NaN|undefined|Infinity/.test(a + " " + b), t.id + " " + a + " = " + b + " for " + JSON.stringify(v)); } }
  }
});
test("question numbers are real and repository links exist", () => {
  for (const t of R.TASKS) { for (const q of t.questions) assert.ok(q >= 1 && q <= 100, t.id + " question " + q); for (const [label, p] of t.repo) assert.ok(fs.existsSync(path.join(__dirname, p)), t.id + " missing " + p); }
});

test("the mathematics README table lists every group, its question and every task", () => {
  const md = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
  for (const m of R.MODALITIES) { const line = md.split("\n").find((l) => l.startsWith("| " + m.name + " |")); assert.ok(line, "no row for " + m.name); assert.ok(line.includes(m.ask), m.name + " question"); for (const t of R.TASKS.filter((t) => t.modality === m.id)) assert.ok(line.includes(t.title), t.title + " missing from the " + m.name + " row"); }
});
test("passwords: 94^8 and a four digit PIN", () => { assert.strictEqual(row("passwords", { a: 94, L: 8 }, "Possible"), "6,095,689,385,410,816"); assert.strictEqual(row("passwords", { a: 10, L: 4 }, "Possible"), "10,000"); });
test("plates", () => { assert.strictEqual(row("plates", { L: 3, D: 3 }, "Codes (characters may"), "17,576,000"); assert.strictEqual(row("plates", { L: 3, D: 3 }, "Codes with no"), "11,232,000"); });
test("poker: all 2,598,960 hands classified by brute force match the formulas", () => {
  const counts = {}; const rank = (c) => c % 13, suit = (c) => Math.floor(c / 13);
  function classify(h) {
    const ranks = h.map(rank).sort((a, b) => a - b), flush = h.every((c) => suit(c) === suit(h[0])), cnt = {}; ranks.forEach((r) => (cnt[r] = (cnt[r] || 0) + 1));
    const groups = Object.values(cnt).sort((a, b) => b - a).join("");
    const uniq = new Set(ranks).size === 5, straight = uniq && (ranks[4] - ranks[0] === 4 || ranks.join() === "0,1,2,3,12"), royal = flush && ranks.join() === "8,9,10,11,12";
    if (royal) return 0; if (straight && flush) return 1; if (groups === "41") return 2; if (groups === "32") return 3; if (flush) return 4; if (straight) return 5; if (groups === "311") return 6; if (groups === "221") return 7; if (groups === "2111") return 8; return 9;
  }
  for (let a = 0; a < 52; a++) for (let b = a + 1; b < 52; b++) for (let c = b + 1; c < 52; c++) for (let d = c + 1; d < 52; d++) for (let e = d + 1; e < 52; e++) { const k = classify([a, b, c, d, e]); counts[k] = (counts[k] || 0) + 1; }
  R.HANDS.forEach((h, i) => assert.strictEqual(BigInt(counts[i]), h[1](), h[0]));
  assert.strictEqual(R.HANDS.reduce((s, h) => s + h[1](), 0n), U.comb(52, 5));
});
test("birthday: 23 people give 50.7%, 57 give over 99%, and a brute-force check on a tiny case", () => {
  assert.ok(Math.abs(R.birthday(23, 365) - 0.507297) < 1e-6); assert.ok(R.birthday(57, 365) > 0.99); assert.strictEqual(row("birthday", { N: 365, n: 23 }, "Smallest group"), "23");
  let match = 0; for (let m = 0; m < 125; m++) { const d = [m % 5, Math.floor(m / 5) % 5, Math.floor(m / 25)]; if (new Set(d).size < 3) match++; } assert.ok(Math.abs(R.birthday(3, 5) - match / 125) < 1e-12);
});
test("bayes: 1% prevalence, 90% and 95% gives 15.4%", () => { assert.strictEqual(row("bayes", { prev: 1, sens: 90, spec: 95 }, "Chance of the"), "15.4%"); const p = 0.9 * 0.01 / (0.9 * 0.01 + 0.05 * 0.99); assert.ok(Math.abs(p - 0.1538) < 1e-4); });
test("next word: counts agree with an independent recount", () => {
  for (const w of ["the", "cat", "sat", "on", "ran", "dog", "mouse"]) {
    const text = R.CORPUS.join(" . "); const re = new RegExp("\\b" + w + " (\\w+)", "g"); const c = {}; let m; while ((m = re.exec(text))) c[m[1]] = (c[m[1]] || 0) + 1;
    const mine = Object.fromEntries(R.followers(w)); assert.deepStrictEqual(mine, c, w);
  }
  assert.ok(row("nextword", { word: "the" }, "next word").includes("of 19"));
});
test("season: enumerating every result sequence agrees (fair and weighted coins)", () => {
  for (const [g, w] of [[5, 3], [8, 4], [10, 6], [12, 12], [7, 0]]) {
    let count = 0, prob = 0; for (let m = 0; m < 1 << g; m++) { let k = 0; for (let i = 0; i < g; i++) k += (m >> i) & 1; if (k >= w) { count++; prob += 0.7 ** k * 0.3 ** (g - k); } }
    assert.strictEqual(row("season", { g, w, p: 50 }, "Sequences with"), U.fmtBig(BigInt(count)), g + "," + w);
    const shown = row("season", { g, w, p: 70 }, "Chance"); assert.strictEqual(shown, U.pct(Math.min(prob, 1)), "weighted " + g + "," + w);
  }
});
test("lottery: 6 from 49 is 13,983,816; 3 from 10 matches checked by enumerating tickets", () => {
  assert.strictEqual(row("lottery", { N: 49, k: 6 }, "Possible"), "13,983,816");
  const N = 10, k = 3, draw = [0, 1, 2], tally = {}; for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) for (let c = b + 1; c < N; c++) { const m = [a, b, c].filter((x) => draw.includes(x)).length; tally[m] = (tally[m] || 0) + 1; }
  assert.strictEqual(row("lottery", { N, k }, "Match exactly 2"), "1 in " + Math.round(120 / tally[2]));
  assert.strictEqual(row("lottery", { N, k }, "Match all 3"), "1 in 120"); assert.strictEqual(tally[3], 1); assert.strictEqual(row("lottery", { N, k }, "Match exactly 1"), "1 in " + Math.round(120 / tally[1]));
});
test("k-mers, game trees and subsets", () => { assert.strictEqual(row("kmers", { a: 4, k: 12 }, "Possible"), "16,777,216"); assert.strictEqual(row("gametree", { b: 35, d: 10 }, "Lines"), "2,758,547,353,515,625"); assert.strictEqual(row("subsets", { n: 30, k: 5 }, "All subsets"), "1,073,741,824"); assert.strictEqual(row("subsets", { n: 30, k: 5 }, "Subsets of exactly"), "142,506"); });
test("tsp: the exact tour equals a separate brute force, and nearest neighbour is never shorter", () => {
  for (let seed = 1; seed <= 12; seed++) for (const n of [4, 6, 8]) {
    const P = T.tsp._points(n, seed), ex = T.tsp._tspExact(P); let best = Infinity; const rest = [...Array(n - 1).keys()].map((i) => i + 1);
    for (const p of U.permutations(rest)) { const o = [0, ...p]; let s = 0; for (let i = 0; i < n; i++) { const a = P[o[i]], b = P[o[(i + 1) % n]]; s += Math.hypot(a[0] - b[0], a[1] - b[1]); } best = Math.min(best, s); }
    assert.ok(Math.abs(best - ex.best) < 1e-9, `seed ${seed} n ${n}`); assert.strictEqual(ex.count, Number(U.fact(n - 1) / 2n));
    const nn = T.tsp._tspNearest(P); assert.strictEqual(new Set(nn).size, n);
  }
  assert.strictEqual(row("tsp", { n: 8, seed: 3 }, "Distinct tours"), "2,520");
});
test("knapsack: dynamic programming equals trying every subset; greedy never beats it", () => {
  for (let seed = 1; seed <= 25; seed++) { const r = U.rng(seed * 104729); const n = 6 + (seed % 7), items = Array.from({ length: n }, () => [1 + Math.floor(r() * 20), 1 + Math.floor(r() * 40)]); const cap = Math.floor(items.reduce((s, x) => s + x[0], 0) * 0.4);
    let best = 0; for (let m = 0; m < 1 << n; m++) { let w = 0, v = 0; for (let i = 0; i < n; i++) if ((m >> i) & 1) { w += items[i][0]; v += items[i][1]; } if (w <= cap && v > best) best = v; }
    const ex = T.knapsack._knap(items, cap), gr = T.knapsack._greedy(items, cap); assert.strictEqual(ex.value, best, "seed " + seed); assert.ok(gr.value <= best); assert.strictEqual(ex.pick.reduce((s, i) => s + items[i][1], 0), best); assert.ok(ex.pick.reduce((s, i) => s + items[i][0], 0) <= cap); }
});
test("assignment: exact total equals an independent permutation search; counts n!", () => {
  for (let seed = 1; seed <= 15; seed++) for (const n of [3, 5, 6]) { const r = U.rng(seed * 15485863), C = Array.from({ length: n }, () => Array.from({ length: n }, () => 1 + Math.floor(r() * 20)));
    let best = Infinity; const go = (i, used, s) => { if (s >= best) return; if (i === n) { best = s; return; } for (let j = 0; j < n; j++) if (!(used >> j & 1)) go(i + 1, used | 1 << j, s + C[i][j]); }; go(0, 0, 0);
    const ex = T.assignment._exact(C); assert.strictEqual(ex.best, best); assert.strictEqual(ex.count, Number(U.fact(n))); assert.ok(T.assignment._greedy(C).total >= best); }
});
test("colouring: chromatic numbers and proper colourings", () => {
  const want = { pentagon: 3, wheel: 4, k4: 4, petersen: 3, grid: 2 };
  for (const [k, w] of Object.entries(want)) { const r = T.colouring._chromatic(k); assert.strictEqual(r.k, w, k); for (const [a, b] of T.colouring._graphs[k].edges) assert.notStrictEqual(r.colouring[a], r.colouring[b], k); assert.ok(r.colouring.every((c) => c >= 0 && c < w)); }
  assert.strictEqual(T.colouring._graphs.petersen.edges.length, 15);
});
test("latin squares: 1, 2, 12, 576, 161,280", () => { [1, 2, 12, 576, 161280].forEach((c, i) => assert.strictEqual(T.latin._latin(i + 1).count, c, "n=" + (i + 1))); });
test("roster: Fibonacci equals counting binary strings with no two 1s in a row", () => { for (let n = 1; n <= 20; n++) assert.strictEqual(BigInt(T.roster._valid(n)), U.fib(n + 2), "n=" + n); assert.strictEqual(row("roster", { n: 7 }, "Valid patterns"), "34"); assert.strictEqual(T.roster.compute({ n: 4 }).viz.items.length, 8); });
test("round robin: every pair once, nobody twice in a round, right number of rounds", () => {
  for (let n = 3; n <= 16; n++) { const rounds = T.roundrobin._roundRobin(n), seen = new Set(); rounds.forEach((rd) => { const inRound = new Set(); rd.forEach(([a, b]) => { assert.ok(!inRound.has(a) && !inRound.has(b), "twice " + n); inRound.add(a); inRound.add(b); const k = Math.min(a, b) + "-" + Math.max(a, b); assert.ok(!seen.has(k), "repeat " + k); seen.add(k); }); });
    assert.strictEqual(seen.size, n * (n - 1) / 2); assert.strictEqual(rounds.length, n % 2 ? n : n - 1); }
});
test("hamming: every message with every single-bit flip is repaired; the code is perfect", () => {
  const H = T.hamming._H;
  for (let m = 0; m < 16; m++) { const d = [m >> 3 & 1, m >> 2 & 1, m >> 1 & 1, m & 1], c = H.encode(d); for (let f = 0; f <= 7; f++) { const g = c.slice(); if (f) g[f - 1] ^= 1; assert.deepStrictEqual(H.decode(g).data, d, `m=${m} flip=${f}`); } }
  const words = new Map(); for (let m = 0; m < 16; m++) { const c = H.encode([m >> 3 & 1, m >> 2 & 1, m >> 1 & 1, m & 1]); for (let f = 0; f <= 7; f++) { const g = c.slice(); if (f) g[f - 1] ^= 1; const k = g.join(""); words.set(k, (words.get(k) || 0) + 1); } }
  assert.strictEqual(words.size, 128); assert.ok([...words.values()].every((v) => v === 1));
  assert.strictEqual(row("hamming", { bits: [1, 0, 1, 1], flip: 5 }, "Matches what"), "yes");
});
test("pairwise: every pair of values is covered, far fewer runs than all combinations", () => {
  for (let p = 3; p <= 6; p++) for (let v = 2; v <= 4; v++) { const r = T.pairwise._pairwise(p, v); assert.ok(r.covers(r.tests), p + "," + v); assert.ok(r.tests.length >= v * v); assert.ok(r.tests.length <= v ** p); if (p >= 4 && v >= 3) assert.ok(r.tests.length < v ** p / 3); const key = new Set(r.tests.map((t) => t.join())); assert.strictEqual(key.size, r.tests.length); }
  assert.strictEqual(row("pairwise", { p: 4, v: 3 }, "Every combination"), "81");
});
test("shuffle, survey and bootstrap", () => {
  assert.ok(U.fact(52).toString().startsWith("80658175170943878571660636856403766975289505440883277824")); assert.strictEqual(U.fact(52).toString().length, 68);
  assert.strictEqual(U.comb(500, 20), U.fact(500) / (U.fact(20) * U.fact(480)));
  for (let n = 2; n <= 6; n++) { let multisets = 0; const go = (i, left) => { if (i === n - 1) { multisets++; return; } for (let c = 0; c <= left; c++) go(i + 1, left - c); }; go(0, n); assert.strictEqual(BigInt(multisets), U.comb(2 * n - 1, n), "n=" + n); }
  assert.strictEqual(row("bootstrap", { n: 10 }, "Distinct resamples"), "92,378");
});
test("formatting", () => { assert.strictEqual(U.fmtBig(1234567n), "1,234,567"); assert.strictEqual(U.fmtBig(10n ** 20n), "1.00 × 10^20"); assert.strictEqual(U.fmtBig(U.fact(52)), "8.07 × 10^67"); assert.strictEqual(U.fmtNum(100000, 0), "100,000"); assert.strictEqual(U.pct(0.5), "50%"); assert.ok(/year/.test(U.human(1e12)) && /second/.test(U.human(5))); });

console.log(`${ok} checks passed`);
if (fails.length) { console.log("FAILED:\n  " + fails.join("\n  ")); process.exit(1); }
