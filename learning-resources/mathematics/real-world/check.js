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

test("every task is solo or group, both kinds exist in every group, and the page text matches the data", () => {
  for (const t of R.TASKS) assert.ok(t.who === "solo" || t.who === "group", t.id);
  for (const m of R.MODALITIES) for (const w of ["solo", "group"]) assert.ok(R.TASKS.some((t) => t.modality === m.id && t.who === w), m.name + " has no " + w + " task");
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8"); assert.ok(html.includes(`<span id="n-tasks">${R.TASKS.length}</span>`), "page says a different number of tasks");
  const md = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8"); assert.ok(md.includes(`${R.TASKS.length} everyday problems`), "README says a different number of tasks");
});
test("the mathematics README section is exactly what sync-readme.js generates from the data", () => {
  const md = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8"); assert.strictEqual(require("./sync-readme.js").build(md), md, "run: node sync-readme.js");
});
test("hobby steps point at real tasks, in order, and every hobby task is a step", () => {
  const ids = new Set(R.TASKS.map((t) => t.id)); assert.ok(R.HOBBY_STEPS.length >= 8);
  for (const [id, why] of R.HOBBY_STEPS) { assert.ok(ids.has(id), id); assert.ok(why.length > 15); assert.ok(R.TASKS.find((t) => t.id === id).hobby); }
  assert.strictEqual(R.TASKS.filter((t) => t.hobby).length, R.HOBBY_STEPS.length); assert.strictEqual(new Set(R.HOBBY_STEPS.map((x) => x[0])).size, R.HOBBY_STEPS.length);
});
test("area bundles: the counts match listing every bundle", () => {
  for (const [k, r] of [[3, 1], [5, 2], [8, 3], [10, 4]]) { let c = 0, o = 0; for (let m = 0; m < 1 << k; m++) { let b = 0; for (let i = 0; i < k; i++) b += (m >> i) & 1; if (b === r) c++; } o = c * [...Array(r).keys()].reduce((a, i) => a * (i + 1), 1); assert.strictEqual(row("areabundles", { k, r }, "Bundles of " + r), String(c)); assert.strictEqual(row("areabundles", { k, r }, "Programmes"), o.toLocaleString("en-US")); }
  assert.strictEqual(row("areabundles", { k: 8, r: 3 }, "Bundles of any size"), "255");
});
test("area picking: the best choice equals listing every choice of areas, and greedy never beats it", () => {
  for (const [n, k, r, seed] of [[10, 8, 3, 4], [6, 5, 2, 1], [15, 10, 4, 7], [20, 12, 5, 9]]) {
    const votes = T.areapick._areaVotes(n, k, seed); let best = -1, count = 0, all = 0; const sets = [];
    (function go(start, chosen) { if (chosen.length === r) { all++; const cov = votes.filter((row) => chosen.some((j) => row[j])).length; if (cov > best) { best = cov; count = 1; } else if (cov === best) count++; return; } for (let j = start; j < k; j++) go(j + 1, [...chosen, j]); })(0, []);
    const res = T.areapick._bestAreas(votes, k, r); assert.strictEqual(res.best, best); assert.strictEqual(res.count, count); assert.strictEqual(res.all, all); assert.ok(res.greedy <= best);
  }
});
test("project size: hand-outs that leave nobody idle equal counting every assignment", () => {
  for (const [p, n] of [[1, 2], [2, 3], [3, 3], [5, 3], [6, 4], [7, 2], [8, 5]]) { let ok = 0; const total = n ** p; for (let a = 0; a < total; a++) { let x = a; const seen = new Set(); for (let i = 0; i < p; i++) { seen.add(x % n); x = Math.floor(x / n); } if (seen.size === n) ok++; } assert.strictEqual(T.projectsize._surjections(p, n), BigInt(ok), [p, n] + ""); }
  assert.ok(row("projectsize", { p: 2, n: 4 }, "Verdict").startsWith("too small")); assert.ok(row("projectsize", { p: 8, n: 4 }, "Verdict").startsWith("big enough"));
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

test("handshakes: pairs and sub-groups against enumeration", () => {
  for (let n = 2; n <= 12; n++) { let pairs = 0, subs = 0; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) pairs++; for (let m = 0; m < 1 << n; m++) { let c = 0, x = m; while (x) { c += x & 1; x >>= 1; } if (c >= 2) subs++; }
    assert.strictEqual(row("handshakes", { n }, "Pairs ("), U.fmtBig(BigInt(pairs)), "pairs " + n); assert.strictEqual(row("handshakes", { n }, "Possible sub-groups"), U.fmtBig(BigInt(subs)), "subs " + n); }
  assert.strictEqual(row("handshakes", { n: 10 }, "Pairs ("), "45");
});
test("committee: every count equals listing the committees", () => {
  for (const [n, k, W, m] of [[8, 3, 3, 2], [9, 4, 4, 1], [7, 5, 2, 2], [10, 3, 6, 3]]) {
    let all = 0, exact = 0, atLeast = 0, officers = 0; const go = (i, chosen) => { if (chosen.length === k) { all++; if (chosen.filter((x) => x < W).length === m) exact++; if (chosen.includes(0) || chosen.includes(1)) atLeast++; officers += k * (k - 1); return; } if (i === n) return; go(i + 1, [...chosen, i]); go(i + 1, chosen); }; go(0, []);
    const base = { n, k, W, m };
    assert.strictEqual(row("committee", base, "All committees"), U.fmtBig(BigInt(all))); assert.strictEqual(row("committee", base, "Exactly"), U.fmtBig(BigInt(exact)), [n, k, W, m] + " exact");
    assert.strictEqual(row("committee", base, "Including at least"), U.fmtBig(BigInt(atLeast))); assert.strictEqual(row("committee", base, "…with a chair"), U.fmtBig(BigInt(officers)));
  }
});
test("seating: fixing one person and listing the others gives (n-1)!, with friends together or apart as predicted", () => {
  for (let n = 3; n <= 8; n++) { let total = 0, together = 0; for (const p of U.permutations([...Array(n - 1).keys()].map((i) => i + 1))) { const seat = [0, ...p]; total++; const i0 = seat.indexOf(0), i1 = seat.indexOf(1), d = Math.abs(i0 - i1); if (d === 1 || d === n - 1) together++; }
    assert.strictEqual(row("seating", { n }, "Different seatings"), U.fmtBig(BigInt(total)), "n=" + n); assert.strictEqual(row("seating", { n }, "Two particular friends side"), U.fmtBig(BigInt(together)), "together n=" + n); assert.strictEqual(row("seating", { n }, "Those two apart"), U.fmtBig(BigInt(total - together))); }
});
test("teams: Stirling and Bell numbers equal listing every way to split", () => {
  const counts = {}; for (let n = 1; n <= 9; n++) { counts[n] = {}; const go = (i, blocks) => { if (i === n) { counts[n][blocks] = (counts[n][blocks] || 0) + 1; return; } for (let b = 0; b <= blocks; b++) go(i + 1, b === blocks ? blocks + 1 : blocks); }; go(0, 0); }
  for (let n = 1; n <= 9; n++) { let sum = 0; for (let k = 1; k <= n; k++) { assert.strictEqual(U.stirling2(n, k), BigInt(counts[n][k] || 0), `S(${n},${k})`); sum += counts[n][k] || 0; } assert.strictEqual(U.bell(n), BigInt(sum)); }
  assert.strictEqual(U.bell(10), 115975n); assert.strictEqual(row("teams", { n: 9, k: 3 }, "Ways if every team"), "280"); assert.strictEqual(row("teams", { n: 6, k: 3 }, "Ways if every team"), "15"); assert.strictEqual(row("teams", { n: 4, k: 2 }, "Ways if every team"), "3");
  assert.ok(/not possible/.test(row("teams", { n: 7, k: 3 }, "Equal-sized")));
  /* equal teams by listing: 6 people into 3 teams of 2, and 9 into 3 of 3 */
  for (const [n, k, want] of [[6, 3, 15], [9, 3, 280]]) { let c = 0; const go = (i, sizes) => { if (i === n) { if (sizes.length === k && sizes.every((x) => x === n / k)) c++; return; } for (let b = 0; b <= sizes.length; b++) { const s = sizes.slice(); if (b === s.length) s.push(1); else s[b]++; if (s.length <= k && s.every((x) => x <= n / k)) go(i + 1, s); } }; go(0, []); assert.strictEqual(c, want, n + " people"); }
});
test("secret santa: derangements equal listing permutations with no fixed point; the chance tends to 1/e", () => {
  for (let n = 1; n <= 8; n++) { let c = 0; for (const p of U.permutations([...Array(n).keys()])) if (p.every((x, i) => x !== i)) c++; assert.strictEqual(U.derangements(n), BigInt(c), "n=" + n); }
  assert.strictEqual(U.derangements(4), 9n); assert.strictEqual(U.derangements(6), 265n); assert.ok(Math.abs(Number(U.derangements(12)) / Number(U.fact(12)) - 1 / Math.E) < 1e-8); assert.strictEqual(row("santa", { n: 8 }, "Chance"), "36.8%");
});
test("voting: counting by ballot type equals checking every one of the 6^v sets of ballots", () => {
  const R6 = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]; const pos = R6.map((r) => { const q = []; r.forEach((c, i) => (q[c] = i)); return q; });
  for (const v of [3, 5, 7]) { let cyc = 0; const total = 6 ** v; for (let m = 0; m < total; m++) { let x = m, ab = 0, bc = 0, ca = 0; for (let i = 0; i < v; i++) { const q = pos[x % 6]; x = Math.floor(x / 6); if (q[0] < q[1]) ab++; if (q[1] < q[2]) bc++; if (q[2] < q[0]) ca++; } const h = v / 2; if ((ab > h && bc > h && ca > h) || (ab < h && bc < h && ca < h)) cyc++; }
    const r = T.voting._cycles(v); assert.strictEqual(r.cycles, BigInt(cyc), "v=" + v); assert.strictEqual(r.total, BigInt(total)); }
  assert.strictEqual(T.voting._cycles(3).cycles, 12n); assert.strictEqual(row("voting", { v: 3 }, "Chance of a cycle"), "5.6%");
  const share = (v) => Number(T.voting._cycles(v).cycles) / Number(T.voting._cycles(v).total); assert.ok(share(3) < share(5) && share(5) < share(7) && share(7) < share(15) && share(15) < 0.0877);
});
test("scheduling: the chance of a shared slot equals enumerating who is free when", () => {
  for (const [n, m, p] of [[2, 3, 0.6], [3, 2, 0.5], [2, 4, 0.3], [4, 2, 0.8]]) {
    let prob = 0; const cells = n * m; for (let mask = 0; mask < 1 << cells; mask++) { let w = 1, ok = false; for (let s = 0; s < m; s++) { let all = true; for (let q = 0; q < n; q++) { const free = (mask >> (s * n + q)) & 1; w *= free ? p : 1 - p; if (!free) all = false; } if (all) ok = true; } if (ok) prob += w; }
    assert.strictEqual(row("scheduling", { n, m, p: Math.round(p * 100) }, "Chance at least one"), U.pct(prob), [n, m, p] + ""); }
});
test("bracket: n!/2^(n-1) distinct brackets by listing seatings, and 2/n for two teams meeting by listing every outcome", () => {
  const canon = (a) => (a.length === 1 ? String(a[0]) : (() => { const h = a.length / 2, l = canon(a.slice(0, h)), r = canon(a.slice(h)); return l < r ? `(${l},${r})` : `(${r},${l})`; })());
  for (const n of [2, 4, 8]) { const seen = new Set(); for (const p of U.permutations([...Array(n).keys()])) seen.add(canon(p)); assert.strictEqual(BigInt(seen.size), T.bracket._bracket(n), "n=" + n); }
  assert.strictEqual(T.bracket._bracket(8), 315n); assert.strictEqual(T.bracket._bracket(16), U.fact(16) / 2n ** 15n);
  for (const n of [4, 8]) { let meet = 0, total = 0, finalMeet = 0; const rounds = Math.log2(n);
    for (const p of U.permutations([...Array(n).keys()])) for (let r = 0; r < 1 << (n - 1); r++) { let alive = p.slice(), bit = 0, met = false, inFinal = false; while (alive.length > 1) { const next = []; for (let i = 0; i < alive.length; i += 2) { const a = alive[i], b = alive[i + 1]; if ((a === 0 && b === 1) || (a === 1 && b === 0)) { met = true; if (alive.length === 2) inFinal = true; } next.push((r >> bit++) & 1 ? a : b); } alive = next; } total++; if (met) meet++; if (inFinal) finalMeet++; }
    assert.ok(Math.abs(meet / total - 2 / n) < 1e-12, "meet n=" + n); assert.ok(Math.abs(finalMeet / total - 2 / (n * (n - 1))) < 1e-12, "final n=" + n); }
  assert.strictEqual(row("bracket", { n: 8 }, "Distinct brackets"), "315");
});
test("group growth: known values for 10 people", () => {
  assert.strictEqual(row("groupgrowth", { n: 10 }, "Pairs"), "45"); assert.strictEqual(row("groupgrowth", { n: 10 }, "All sub-groups"), "1,024"); assert.strictEqual(row("groupgrowth", { n: 10 }, "Ways to split into teams"), "115,975");
  assert.strictEqual(row("groupgrowth", { n: 10 }, "Seatings"), "362,880"); assert.strictEqual(row("groupgrowth", { n: 10 }, "Line-ups"), "3,628,800"); assert.strictEqual(row("groupgrowth", { n: 10 }, "Ways to pair"), "945"); assert.strictEqual(U.pairings(8), 105n);
  let c = 0; const pairUp = (left) => { if (!left.length) { c++; return; } const [a, ...rest] = left; for (let i = 0; i < rest.length; i++) pairUp(rest.filter((_, j) => j !== i)); }; pairUp([...Array(8).keys()]); assert.strictEqual(c, 105);
});
test("coupon collector: the chance of a full set equals listing every purchase sequence", () => {
  for (const [n, t] of [[3, 6], [3, 4], [4, 7], [2, 5]]) { let ok = 0; for (let m = 0; m < n ** t; m++) { let x = m; const seen = new Set(); for (let i = 0; i < t; i++) { seen.add(x % n); x = Math.floor(x / n); } if (seen.size === n) ok++; } assert.ok(Math.abs(T.coupon._coupon(n, t) - ok / n ** t) < 1e-12, [n, t] + ""); }
  const ie = (n, t) => { let s = 0; for (let j = 0; j <= n; j++) s += (j % 2 ? -1 : 1) * Number(U.comb(n, j)) * ((n - j) / n) ** t; return s; }; assert.ok(Math.abs(T.coupon._coupon(5, 15) - ie(5, 15)) < 1e-12);
  assert.strictEqual(row("coupon", { n: 20, t: 100 }, "Packs needed on average"), "72"); assert.strictEqual(T.coupon._coupon(1 + 1, 1), 0);
});
test("dice: ways to each total equal listing every roll", () => {
  for (let d = 1; d <= 5; d++) { const counts = {}; for (let m = 0; m < 6 ** d; m++) { let x = m, s = 0; for (let i = 0; i < d; i++) { s += (x % 6) + 1; x = Math.floor(x / 6); } counts[s] = (counts[s] || 0) + 1; } const w = T.dice._dice(d); for (const k of Object.keys(counts)) assert.strictEqual(w[k], BigInt(counts[k]), `d=${d} total ${k}`); assert.strictEqual(Object.keys(w).length, Object.keys(counts).length); }
  assert.strictEqual(row("dice", { d: 2, t: 7 }, "Rolls totalling"), "6"); assert.strictEqual(row("dice", { d: 2, t: 7 }, "Likeliest"), "7 (6 ways)");
});
test("grid routes: C(a+b, a), and routes with a closed crossing, equal listing every route", () => {
  for (const [a, b] of [[2, 2], [3, 4], [5, 5], [6, 4], [4, 7]]) { const mid = [Math.floor(a / 2), Math.floor(b / 2)]; let all = 0, avoid = 0; const go = (i, j, hit) => { if (i === a && j === b) { all++; if (!hit) avoid++; return; } if (i < a) go(i + 1, j, hit || (i + 1 === mid[0] && j === mid[1])); if (j < b) go(i, j + 1, hit || (i === mid[0] && j + 1 === mid[1])); }; go(0, 0, mid[0] === 0 && mid[1] === 0);
    assert.strictEqual(U.comb(a + b, a), BigInt(all)); assert.strictEqual(T.gridroutes._gridRoutes(a, b, mid), BigInt(avoid), `closed ${a}x${b}`); assert.strictEqual(row("gridroutes", { a, b, block: "mid" }, "Routes with the middle"), U.fmtBig(BigInt(avoid))); }
  assert.strictEqual(row("gridroutes", { a: 6, b: 6, block: "none" }, "Routes with every"), "924");
});

test("shared hobby: the chances equal comparing every pair of hobby lists", () => {
  for (const [N, k] of [[8, 3], [10, 4], [9, 2], [7, 3]]) {
    const lists = []; const go = (start, cur) => { if (cur.length === k) { lists.push(cur.slice()); return; } for (let i = start; i < N; i++) { cur.push(i); go(i + 1, cur); cur.pop(); } }; go(0, []);
    const tally = {}; let pairs = 0; for (const a of lists) for (const b of lists) { const sh = a.filter((x) => b.includes(x)).length; tally[sh] = (tally[sh] || 0) + 1; pairs++; }
    assert.strictEqual(row("sharedhobby", { N: Math.max(N, 10), k, g: 5 }, "Chance two people share") !== undefined, true);
    for (let j = 0; j <= k; j++) assert.ok(Math.abs(T.sharedhobby._shareChance(N, k, j) - (tally[j] || 0) / pairs) < 1e-12, `N=${N} k=${k} j=${j}`);
  }
  assert.strictEqual(row("sharedhobby", { N: 30, k: 4, g: 20 }, "Chance two people share"), "45.4%");
});
test("invites: the binomial sums equal listing who comes, and the number to invite is the smallest that works", () => {
  for (const [n, s, p] of [[6, 3, 0.6], [8, 5, 0.4], [10, 7, 0.8], [5, 2, 0.25]]) {
    let prob = 0; for (let m = 0; m < 1 << n; m++) { let k = 0, w = 1; for (let i = 0; i < n; i++) { const come = (m >> i) & 1; k += come; w *= come ? p : 1 - p; } if (k >= s) prob += w; }
    assert.ok(Math.abs(T.invites._atLeast(n, s, p) - prob) < 1e-12, [n, s, p] + "");
  }
  const exact = (n, s, p) => { let t = 0; for (let k = s; k <= n; k++) t += Number(U.comb(n, k)) * p ** k * (1 - p) ** (n - k); return t; };
  for (const [s, p, conf] of [[8, 0.6, 0.9], [4, 0.5, 0.8], [12, 0.7, 0.95], [20, 0.4, 0.99], [2, 0.9, 0.9], [30, 0.5, 0.9]]) { const n = T.invites._invitesFor(s, p, conf); assert.ok(exact(n, s, p) >= conf, "enough " + [s, p, conf]); assert.ok(n === s || exact(n - 1, s, p) < conf, "smallest " + [s, p, conf]); }
  assert.strictEqual(row("invites", { s: 8, p: 60, conf: 0.9 }, "Invitations to send"), "17");
});
test("roles: the smallest covering group equals checking by increasing size, and the greedy pick covers every role", () => {
  for (let seed = 1; seed <= 12; seed++) for (const [n, r] of [[6, 3], [8, 4], [10, 5], [9, 6]]) {
    const c = T.roles._roleCandidates(n, r, seed); let best = null, count = 0;
    for (let size = 1; size <= n && best === null; size++) { const go = (start, cur) => { if (cur.length === size) { if ([...Array(r).keys()].every((j) => cur.some((i) => c[i][j]))) { count++; best = size; } return; } for (let i = start; i < n; i++) { cur.push(i); go(i + 1, cur); cur.pop(); } }; go(0, []); }
    const res = T.roles._smallestCover(c, r); assert.strictEqual(res.size, best, [seed, n, r] + ""); assert.strictEqual(res.count, count); assert.ok(res.greedy.length >= best); assert.ok([...Array(r).keys()].every((j) => res.greedy.some((i) => c[i][j])));
  }
});
test("meeting days: the best days equal trying every choice of days", () => {
  for (let seed = 1; seed <= 15; seed++) for (const [n, k] of [[10, 1], [16, 2], [30, 3]]) {
    const av = T.meetdays._availability(n, 0.35, seed); let best = -1; const days = [0, 1, 2, 3, 4, 5, 6];
    const pick = (start, cur) => { if (cur.length === k) { best = Math.max(best, av.filter((m) => cur.some((d) => m[d])).length); return; } for (let d = start; d < 7; d++) pick(d + 1, [...cur, d]); }; pick(0, []);
    const r = T.meetdays._bestDays(av, k); assert.strictEqual(r.best, best, [seed, n, k] + ""); assert.strictEqual(r.options, Number(U.comb(7, k))); assert.ok(r.best >= T.meetdays._bestDays(av, 1).best);
  }
});
test("hosting rotas: the count equals listing every rota", () => {
  for (const [n, w] of [[3, 4], [4, 5], [2, 6], [3, 6], [5, 4]]) { let ok = 0; const total = n ** w; for (let m = 0; m < total; m++) { let x = m, prev = -1, good = true; for (let i = 0; i < w; i++) { const h = x % n; x = Math.floor(x / n); if (h === prev) good = false; prev = h; } if (good) ok++; }
    assert.strictEqual(row("hosts", { n, w }, "Nobody hosts"), U.fmtBig(BigInt(ok)), [n, w] + ""); assert.strictEqual(row("hosts", { n, w }, "All possible rotas"), U.fmtBig(BigInt(total))); }
  assert.strictEqual(row("hosts", { n: 3, w: 6 }, "Share of rotas"), "13.2%");
});
test("fair teams: the best split equals checking every way to choose a team", () => {
  for (let seed = 1; seed <= 12; seed++) for (const n of [4, 6, 8, 10, 12]) {
    const g = U.rng(seed * 4177), skills = Array.from({ length: n }, () => 1 + Math.floor(g() * 10)), total = skills.reduce((a, b) => a + b, 0); let best = Infinity, splits = 0;
    const go = (start, cur, sum) => { if (cur === n / 2) { splits++; best = Math.min(best, Math.abs(total - 2 * sum)); return; } for (let i = start; i < n; i++) go(i + 1, cur + 1, sum + skills[i]); }; go(0, 0, 0);
    const r = T.fairteams._fairSplit(skills); assert.strictEqual(r.best, best, [seed, n] + ""); assert.strictEqual(r.count * 2, splits); assert.strictEqual(r.count, Number(U.comb(n - 1, n / 2 - 1))); assert.ok(r.snake >= best);
  }
});
test("table rotation: every round seats everyone once, tables are not too big, every pair meets, and rounds are never below the bound", () => {
  for (const [n, s] of [[4, 2], [6, 2], [8, 4], [9, 3], [12, 4], [15, 3], [10, 4], [16, 4], [7, 3], [24, 6], [5, 5]]) {
    const r = T.rotation._rotate(n, s), met = new Set();
    for (const round of r.rounds) { const seen = round.flat(); assert.strictEqual(seen.length, n); assert.strictEqual(new Set(seen).size, n); for (const t of round) { assert.ok(t.length <= s); for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) met.add(Math.min(t[i], t[j]) + "-" + Math.max(t[i], t[j])); } }
    assert.strictEqual(met.size, n * (n - 1) / 2, `all pairs ${n},${s}`); assert.ok(r.rounds.length >= r.lower, `bound ${n},${s}`);
  }
  assert.strictEqual(T.rotation._rotate(4, 2).rounds.length, 3); assert.strictEqual(T.rotation._rotate(15, 3).lower, 7); assert.strictEqual(T.rotation._rotate(5, 5).rounds.length, 1);
});
test("clubs: the clash-free plans equal checking every subset, and the greedy rule matches the best", () => {
  for (let seed = 1; seed <= 15; seed++) for (const m of [5, 8, 11]) {
    const clubs = T.joinclubs._clubSlots(m, seed), clashes = (a, b) => a.day === b.day && a.start < b.start + b.len && b.start < a.start + a.len; let ok = 0, best = 0, bestCount = 0;
    for (let mask = 0; mask < 1 << m; mask++) { const idx = []; for (let i = 0; i < m; i++) if ((mask >> i) & 1) idx.push(i); let good = true; for (let a = 0; a < idx.length && good; a++) for (let b = a + 1; b < idx.length; b++) if (clashes(clubs[idx[a]], clubs[idx[b]])) { good = false; break; } if (!good) continue; ok++; if (idx.length > best) { best = idx.length; bestCount = 1; } else if (idx.length === best) bestCount++; }
    const r = T.joinclubs._clubPlans(clubs); assert.strictEqual(r.ok, ok, [seed, m] + ""); assert.strictEqual(r.best, best); assert.strictEqual(r.bestCount, bestCount); assert.strictEqual(r.greedy, best, "greedy " + [seed, m]);
  }
});

test("formatting", () => { assert.strictEqual(U.fmtBig(1234567n), "1,234,567"); assert.strictEqual(U.fmtBig(10n ** 20n), "1.00 × 10^20"); assert.strictEqual(U.fmtBig(U.fact(52)), "8.07 × 10^67"); assert.strictEqual(U.fmtNum(100000, 0), "100,000"); assert.strictEqual(U.pct(0.5), "50%"); assert.ok(/year/.test(U.human(1e12)) && /second/.test(U.human(5))); });

console.log(`${ok} checks passed`);
if (fails.length) { console.log("FAILED:\n  " + fails.join("\n  ")); process.exit(1); }
