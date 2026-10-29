/* Combinatorics tasks from the real world, grouped by what is being asked of them.
 * Plain logic with no page code, so Node can test it (see check.js) and the page can draw it (app.js).
 * Every task has controls and a compute(values) that returns rows of [label, value], a note, and sometimes a viz. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.RealWorld = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ------------------------------------------------------------------ number helpers (exact, with BigInt) */
  const B = BigInt;
  function fact(n) { let r = 1n; for (let i = 2n; i <= B(n); i++) r *= i; return r; }
  function perm(n, k) { let r = 1n; for (let i = 0n; i < B(k); i++) r *= B(n) - i; return r; }
  function comb(n, k) {
    n = B(n); k = B(k);
    if (k < 0n || k > n) return 0n;
    if (k > n - k) k = n - k;
    let r = 1n;
    for (let i = 1n; i <= k; i++) r = (r * (n - k + i)) / i;
    return r;
  }
  function pow(a, b) { return B(a) ** B(b); }
  function fib(n) { let a = 0n, b = 1n; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; }
  function commas(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  /* Whole numbers in full up to 18 digits, then 1.23 × 10^n */
  function fmtBig(x) {
    const neg = x < 0n; const s = (neg ? -x : x).toString();
    let out;
    if (s.length <= 18) out = commas(s);
    else {
      let m = Math.round(Number(s.slice(0, 4)) / 10), e = s.length - 1;
      if (m === 1000) { m = 100; e++; }
      out = `${(m / 100).toFixed(2)} × 10^${e}`;
    }
    return (neg ? "-" : "") + out;
  }
  function fmtNum(x, digits = 2) {
    if (!isFinite(x)) return "∞";
    if (x !== 0 && Math.abs(x) >= 1e15) { let e = Math.floor(Math.log10(Math.abs(x))), m = (x / 10 ** e).toFixed(2); if (Number(m) >= 10) { m = "1.00"; e++; } return `${m} × 10^${e}`; }
    const t = Number(x).toFixed(digits);
    return commas(t.includes(".") ? t.replace(/\.?0+$/, "") : t);
  }
  function pct(p) {
    if (p === 0) return "0%";
    if (p >= 0.9995 && p < 1) return "99.9%+";
    if (p < 0.0001) return p.toExponential(1).replace("e-", " × 10^-") + " of the time";
    return (p * 100).toFixed(p < 0.01 ? 3 : 1).replace(/\.?0+$/, "") + "%";
  }
  function oneIn(x) { return "1 in " + (typeof x === "bigint" ? fmtBig(x) : fmtNum(x, 0)); }
  /* seconds → words */
  function human(sec) {
    if (!isFinite(sec)) return "longer than anything you could measure";
    if (sec < 1e-3) return "under a millisecond";
    if (sec < 1) return `${(sec * 1000).toFixed(0)} milliseconds`;
    const units = [["second", 60], ["minute", 60], ["hour", 24], ["day", 365.25], ["year", 1e3]];
    let v = sec, i = 0;
    while (i < units.length - 1 && v >= units[i][1]) { v /= units[i][1]; i++; }
    if (i === 4 && v >= 1) {
      const years = sec / (365.25 * 86400);
      if (years >= 1e3) return `${fmtNum(years, 0)} years` + (years > 1.4e10 ? " (longer than the universe has existed)" : "");
    }
    const n = v < 10 ? v.toFixed(1).replace(/\.0$/, "") : Math.round(v).toString();
    return `${n} ${units[i][0]}${n === "1" ? "" : "s"}`;
  }
  function rng(seed) {                       /* mulberry32: the same seed always gives the same numbers */
    let a = (seed >>> 0) || 1;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function* permutations(arr) {              /* Heap's algorithm over a copy */
    const a = arr.slice(), c = new Array(a.length).fill(0);
    yield a.slice();
    let i = 0;
    while (i < a.length) {
      if (c[i] < i) { const j = i % 2 === 0 ? 0 : c[i]; [a[j], a[i]] = [a[i], a[j]]; yield a.slice(); c[i]++; i = 0; }
      else { c[i] = 0; i++; }
    }
  }

  /* ------------------------------------------------------------------ the groups */
  const MODALITIES = [
    { id: "counting", name: "Counting", ask: "How many are there?", color: "#3a63d8",
      blurb: "The plain question: how many passwords, hands or codes exist? The answer is a product or a binomial coefficient, and it is usually far bigger than intuition says." },
    { id: "prediction", name: "Prediction", ask: "What is likely to happen?", color: "#e8590c",
      blurb: "When outcomes are equally likely, a probability is a count of the outcomes you care about divided by a count of all outcomes. Prediction is counting in disguise: forecasts of coincidences, test results, matches and word choices all reduce to it." },
    { id: "search", name: "Search size", ask: "Could we simply try them all?", color: "#8b5cf6",
      blurb: "Brute force lists every possibility. Combinatorics tells you in advance whether that finishes in a second or outlasts the universe." },
    { id: "optimisation", name: "Optimisation", ask: "Which choice is best?", color: "#0f9d58",
      blurb: "Routes, packing and assignments all have a huge number of candidate answers and one best one. These are the live examples: the page really searches them." },
    { id: "feasibility", name: "Feasibility", ask: "Is there a valid arrangement, and how many?", color: "#0891b2",
      blurb: "Timetables, maps and rosters come with rules. The question is whether any arrangement obeys all of them, and how many do." },
    { id: "design", name: "Coverage and design", ask: "How do we arrange things so nothing is missed?", color: "#c026d3",
      blurb: "Schedules, test plans and codes are built so that every case is covered, every pair meets once, or every single error can be fixed." },
    { id: "sampling", name: "Sampling and randomness", ask: "How many ways could the draw have gone?", color: "#ca8a04",
      blurb: "Shuffles, surveys and resampling pick from a vast set of possible outcomes. Counting that set shows why randomness works and what it cannot promise." },
  ];

  const T = [];                              /* the tasks, filled below */
  function task(t) { T.push(t); return t; }
  const range = (key, label, min, max, value, extra = {}) => Object.assign({ key, label, type: "range", min, max, step: 1, value }, extra);
  const select = (key, label, options, value) => ({ key, label, type: "select", options, value });
  const seed = (value = 1) => ({ key: "seed", label: "Random map", type: "seed", value });
  const Q = "../combinatorics_learning_questions.md";
  const REPO = "../../../game-development/algorithms/playcanvas-examples/";

  /* ================================================================== COUNTING */
  task({
    id: "passwords", modality: "counting", title: "How many passwords?",
    ask: "How many passwords of a given length can be made, and how long would it take to try them all?",
    idea: "The product rule: with an alphabet of a symbols and length L there are a × a × … × a = a^L passwords. Adding one character multiplies the count by a; the length matters more than the alphabet.",
    questions: [1, 2, 3], repo: [["Letter combinations", REPO + "backtracking/letter-combinations.js"]],
    controls: [
      select("a", "Characters allowed", [[10, "digits (10)"], [26, "lowercase letters (26)"], [52, "upper and lower case (52)"], [62, "letters and digits (62)"], [94, "every printable keyboard character (94)"]], 62),
      range("L", "Length", 4, 20, 8),
      select("rate", "Guesses per second", [[1e3, "1,000 (an online login with limits)"], [1e9, "a billion (one fast computer, offline)"], [1e12, "a trillion (a cluster, offline)"]], 1e9),
    ],
    compute(v) {
      const total = pow(v.a, v.L); const bits = v.L * Math.log2(v.a);
      return { rows: [["Possible passwords", fmtBig(total)], ["Strength", `${bits.toFixed(1)} bits`], ["Time to try half of them", human(Number(total) / 2 / v.rate)]],
        note: "Real cracking tools try likely words and patterns first, so a password a person chose is weaker than this count suggests." };
    },
  });
  task({
    id: "plates", modality: "counting", title: "Licence plates and product codes",
    ask: "A code is some letters followed by some digits. How many different codes are there?",
    idea: "Independent choices multiply. If characters may not repeat, each choice leaves one fewer option, which gives the permutation count P(n, k) = n!/(n − k)!.",
    questions: [1, 2, 7, 15], repo: [["Permutations", REPO + "backtracking/permutations.js"]],
    controls: [range("L", "Letters", 0, 6, 3), range("D", "Digits", 0, 6, 3)],
    compute(v) {
      const any = pow(26, v.L) * pow(10, v.D), norep = perm(26, v.L) * perm(10, v.D);
      return { rows: [["Codes (characters may repeat)", fmtBig(any)], ["Codes with no repeated character", fmtBig(norep)], ["Share with no repeat", pct(Number(norep) / Number(any))]],
        note: "A plain 3 letters and 3 digits gives 17,576,000 codes, enough for a small region." };
    },
  });
  const HANDS = [
    ["Royal flush", () => 4n], ["Straight flush", () => 36n], ["Four of a kind", () => 13n * 48n],
    ["Full house", () => 13n * comb(4, 3) * 12n * comb(4, 2)], ["Flush", () => 4n * (comb(13, 5) - 10n)],
    ["Straight", () => 10n * (4n ** 5n - 4n)], ["Three of a kind", () => 13n * comb(4, 3) * comb(12, 2) * 16n],
    ["Two pair", () => comb(13, 2) * comb(4, 2) ** 2n * 44n], ["One pair", () => 13n * comb(4, 2) * comb(12, 3) * 64n],
    ["High card", () => (comb(13, 5) - 10n) * (4n ** 5n - 4n)],
  ];
  task({
    id: "poker", modality: "counting", title: "Poker hands",
    ask: "How many five-card hands are a flush, a full house, a pair?",
    idea: "Count by building the hand step by step: choose the rank, choose the suits with a binomial coefficient, choose the other cards. The ten hand types add up to every possible hand, C(52, 5).",
    questions: [31, 32, 33, 34], repo: [["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [select("hand", "Hand", HANDS.map((h, i) => [i, h[0]]), 4)],
    compute(v) {
      const total = comb(52, 5), ways = HANDS[v.hand][1]();
      return { rows: [["All five-card hands", fmtBig(total)], [`Ways to be a ${HANDS[v.hand][0].toLowerCase()}`, fmtBig(ways)], ["Chance", pct(Number(ways) / Number(total))], ["Odds", oneIn(total / ways)]],
        viz: { type: "bars", items: HANDS.map((h, i) => ({ label: h[0], value: Number(h[1]()), on: i === v.hand })), log: true },
        note: "Bars use a log scale: a high card is 100 000 times more common than a royal flush." };
    },
  });

  /* ================================================================== PREDICTION */
  const POOLS = [[365, "birthdays in a year (365)"], [1000000, "customer IDs out of 1,000,000"], [4294967296, "32-bit hash values (4,294,967,296)"]];
  function birthday(n, N) { let p = 1; for (let i = 0; i < n; i++) p *= 1 - i / N; return 1 - p; }
  task({
    id: "birthday", modality: "prediction", title: "Surprising coincidences (the birthday problem)",
    ask: "In a group of n people, how likely is it that two share a birthday? The same arithmetic predicts duplicate IDs and hash collisions.",
    idea: "Count the ways everyone can avoid a match: N × (N − 1) × … × (N − n + 1) out of N^n equally likely outcomes. The chance of a match is one minus that. The number of pairs grows as n²/2, which is why coincidences come early: about 1.18 √N items give an even chance.",
    questions: [47, 55], repo: [],
    controls: [select("N", "What is being matched", POOLS, 365),
      range("n", "How many people or items", 2, 100, 23, { maxFor: (v) => (v.N === 365 ? 100 : v.N === 1000000 ? 4000 : 120000), stepFor: (v) => (v.N === 365 ? 1 : v.N === 1000000 ? 10 : 100) })],
    compute(v) {
      const n = Math.min(v.n, v.N), p = birthday(n, v.N); let half = 1; while (half < v.N && birthday(half, v.N) < 0.5) half++;
      return { rows: [["Chance that at least two match", pct(p)], ["Pairs to compare", fmtBig(comb(n, 2))], ["Smallest group with an even chance", fmtNum(half, 0)], ["Rule of thumb 1.18 √N", fmtNum(1.1774 * Math.sqrt(v.N), 0)]],
        note: "For 365 days, 23 people give just over a 50% chance and 57 give over 99%." };
    },
  });
  task({
    id: "bayes", modality: "prediction", title: "What a positive test really means",
    ask: "A medical test is positive. How likely is the condition?",
    idea: "Count people, not probabilities. Out of 100,000 people, count those with the condition who test positive and those without it who also test positive. The chance is the first group divided by both groups. When the condition is rare, the false positives can outnumber the true ones.",
    questions: [], repo: [],
    controls: [range("prev", "Share of people with the condition (%)", 0.1, 20, 1, { step: 0.1 }), range("sens", "Test finds the condition (%)", 50, 100, 90), range("spec", "Test clears the healthy (%)", 50, 100, 95)],
    compute(v) {
      const pop = 100000, sick = pop * v.prev / 100, healthy = pop - sick, tp = sick * v.sens / 100, fp = healthy * (1 - v.spec / 100);
      return { rows: [["People tested", fmtNum(pop, 0)], ["Have the condition", fmtNum(sick, 0)], ["Positive and have it (true positives)", fmtNum(tp, 0)], ["Positive but healthy (false positives)", fmtNum(fp, 0)], ["Chance of the condition, given a positive", pct(tp / (tp + fp))]],
        viz: { type: "bars", items: [{ label: "True positives", value: tp, on: true }, { label: "False positives", value: fp }], log: false },
        note: "With 1% prevalence, 90% sensitivity and 95% specificity, only about 15% of positives are real." };
    },
  });
  const CORPUS = ["the cat sat on the mat", "the cat chased the mouse", "the dog chased the cat", "the dog sat on the rug", "a cat sat on the sofa", "the mouse ran under the sofa", "the cat ran to the door", "the dog ran to the door", "the mouse sat on the mat", "the dog sat on the mat"];
  function followers(word) {
    const c = new Map();
    for (const s of CORPUS) { const w = s.split(" "); for (let i = 0; i < w.length - 1; i++) if (w[i] === word) c.set(w[i + 1], (c.get(w[i + 1]) || 0) + 1); }
    return [...c.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  }
  const VOCAB = [...new Set(CORPUS.flatMap((s) => s.split(" ")))].filter((w) => followers(w).length).sort();
  task({
    id: "nextword", modality: "prediction", title: "Guessing the next word",
    ask: "After a given word, which word is most likely next? A language model does this at a vast scale; here it is done by counting pairs in ten short sentences.",
    idea: "Count how often each word follows the one you have: that is a bigram table. The predicted probability of a next word is its count divided by the count of all followers. Large language models replace the table with a learned function, but the question being answered is the same.",
    questions: [], repo: [],
    controls: [select("word", "Previous word", VOCAB.map((w) => [w, w]), "the")],
    compute(v) {
      const f = followers(v.word), tot = f.reduce((s, x) => s + x[1], 0);
      const chain = [v.word]; for (let i = 0; i < 5; i++) { const nx = followers(chain[chain.length - 1]); if (!nx.length) break; chain.push(nx[0][0]); }
      return { rows: [...f.map(([w, c]) => [`next word "${w}"`, `${c} of ${tot} (${pct(c / tot)})`]), ["Always taking the likeliest word", chain.join(" ")]],
        viz: { type: "list", items: CORPUS, title: "The ten sentences it learned from" },
        note: "With so little text the guesses are blunt, and the repeated phrase at the end shows a known weakness of always choosing the top word." };
    },
  });
  task({
    id: "season", modality: "prediction", title: "Chances of reaching a target in a season",
    ask: "A team has g games left and needs w more wins. How many of the possible results get it there, and how likely is that?",
    idea: "Each game is a win or a loss, so g games have 2^g result sequences. The sequences with at least w wins number C(g, w) + C(g, w+1) + … + C(g, g). If every game is an independent coin flip with win chance p, each sequence with k wins has probability p^k (1 − p)^(g − k).",
    questions: [12, 16], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"]],
    controls: [range("g", "Games left", 1, 38, 10), range("w", "Wins needed", 0, 38, 6, { maxFor: (v) => v.g }), range("p", "Chance of winning each game (%)", 10, 90, 50, { step: 5 })],
    compute(v) {
      const w = Math.min(v.w, v.g); let ok = 0n, prob = 0; const p = v.p / 100;
      for (let k = w; k <= v.g; k++) { ok += comb(v.g, k); prob += Number(comb(v.g, k)) * p ** k * (1 - p) ** (v.g - k); }
      return { rows: [["Possible result sequences", fmtBig(pow(2, v.g))], [`Sequences with at least ${w} wins`, fmtBig(ok)], ["Chance of reaching the target", pct(Math.min(prob, 1))]],
        note: "This treats games as independent with the same chance each. Real seasons have strong and weak opponents, injuries and momentum, so use it as a baseline, not a forecast." };
    },
  });
  function matchProb(N, k, m) { return Number(comb(k, m) * comb(N - k, k - m)) / Number(comb(N, k)); }
  task({
    id: "lottery", modality: "prediction", title: "Lottery odds",
    ask: "Pick k numbers from a pool of N. How likely is each prize, and what is a ticket worth on average?",
    idea: "Every ticket is one of C(N, k) equally likely sets. Matching exactly m of the winning k means choosing m winners and k − m of the N − k losers: C(k, m) × C(N − k, k − m) ways.",
    questions: [31, 33, 38], repo: [["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [range("N", "Numbers in the pool", 10, 80, 49), range("k", "Numbers you pick", 2, 8, 6), range("jackpot", "Jackpot (millions)", 1, 500, 10), range("price", "Ticket price", 1, 5, 2)],
    compute(v) {
      const k = Math.min(v.k, v.N - 1), total = comb(v.N, k), ev = (v.jackpot * 1e6) / Number(total);
      const rows = [["Possible tickets", fmtBig(total)], [`Match all ${k}`, oneIn(total)]];
      for (let m = k - 1; m >= Math.max(k - 2, 1); m--) rows.push([`Match exactly ${m}`, oneIn(Math.round(1 / matchProb(v.N, k, m)))]);
      rows.push(["Average jackpot return per ticket", `${(ev < 0.01 ? ev.toExponential(1) : ev.toFixed(2))} (price ${v.price})`]);
      return { rows, note: "The average ignores smaller prizes, tax and several winners sharing the jackpot. For 6 from 49 it is about 1 in 13,983,816." };
    },
  });

  /* ================================================================== SEARCH SIZE */
  task({
    id: "kmers", modality: "search", title: "DNA and the number of short words",
    ask: "How many different strings of length k can be written in an alphabet of a letters, and can a computer list them all?",
    idea: "a^k grows exponentially in k. DNA has 4 bases, so there are 4^k possible k-mers; at k = 16 that is already larger than the roughly three billion letters of a human genome, so most 16-mers occur at most once or twice.",
    questions: [1], repo: [],
    controls: [select("a", "Alphabet", [[2, "bits (2)"], [4, "DNA bases (4)"], [20, "amino acids (20)"], [26, "letters (26)"]], 4), range("k", "Length k", 1, 40, 12)],
    compute(v) {
      const t = pow(v.a, v.k);
      return { rows: [["Possible strings", fmtBig(t)], ["Time to list them at a billion a second", human(Number(t) / 1e9)]],
        note: "At 4^12 = 16,777,216 listing is instant; by length 30 it is out of reach." };
    },
  });
  task({
    id: "gametree", modality: "search", title: "Game trees (chess, Go and friends)",
    ask: "With b legal moves per turn, how many different lines of play are there after d moves?",
    idea: "Each move multiplies the possibilities by b, so after d moves there are b^d lines. Game programs cannot search them all; they prune, estimate and sample instead.",
    questions: [], repo: [["N-Queens", REPO + "backtracking/n-queens.js"]],
    controls: [range("b", "Moves available each turn", 2, 60, 35), range("d", "Moves ahead", 1, 100, 10)],
    compute(v) {
      const t = pow(v.b, v.d);
      return { rows: [["Lines of play", fmtBig(t)], ["Time to look at all of them at a billion a second", human(Number(t) / 1e9)]],
        note: "About 35 moves a turn is the commonly quoted average for chess. Ten moves ahead is already 2.8 × 10^15 lines." };
    },
  });
  task({
    id: "subsets", modality: "search", title: "Choosing a set of features",
    ask: "Which subset of n options works best? How many subsets are there to check?",
    idea: "Each option is in or out, so there are 2^n subsets in all, and C(n, k) of exactly size k. Choosing features for a model, ingredients for a recipe or stocks for a fund all face this blow-up.",
    questions: [10, 12, 31], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"], ["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [range("n", "Options", 1, 100, 30), range("k", "Subset size", 1, 100, 5, { maxFor: (v) => v.n })],
    compute(v) {
      const k = Math.min(v.k, v.n), all = pow(2, v.n), t = comb(v.n, k);
      return { rows: [["All subsets (size 0 to n)", fmtBig(all)], [`Subsets of exactly ${k}`, fmtBig(t)], ["Time to check every subset at a billion a second", human(Number(all) / 1e9)]],
        note: "Thirty options give just over a billion subsets: fine. Sixty give 10^18: out of reach." };
    },
  });

  /* ================================================================== OPTIMISATION (live search) */
  function points(n, seedv) { const r = rng(seedv * 7919); return Array.from({ length: n }, () => [Math.round(r() * 100), Math.round(r() * 100)]); }
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function tourLen(P, order) { let s = 0; for (let i = 0; i < order.length; i++) s += dist(P[order[i]], P[order[(i + 1) % order.length]]); return s; }
  function tspExact(P) {
    const n = P.length; let best = Infinity, bestOrder = null, count = 0;
    for (const p of permutations([...Array(n - 1).keys()].map((i) => i + 1))) {
      if (p[0] > p[p.length - 1]) continue;         /* each tour and its reverse are the same, count once */
      count++; const o = [0, ...p], l = tourLen(P, o); if (l < best) { best = l; bestOrder = o; }
    }
    return { best, order: bestOrder, count };
  }
  function tspNearest(P) {
    const n = P.length, seen = new Set([0]), o = [0];
    while (o.length < n) { let b = -1, bd = Infinity; for (let i = 0; i < n; i++) if (!seen.has(i)) { const d = dist(P[o[o.length - 1]], P[i]); if (d < bd) { bd = d; b = i; } } seen.add(b); o.push(b); }
    return o;
  }
  task({
    id: "tsp", modality: "optimisation", title: "A delivery route",
    ask: "A van must visit n stops and return. Which order is shortest?",
    idea: "Fixing the start and ignoring direction, there are (n − 1)!/2 distinct tours. For a handful of stops the page checks every one; beyond about a dozen that is hopeless, so real routing software uses clever shortcuts such as the nearest-neighbour rule shown here, which is quick but not always best.",
    questions: [16, 24, 58], repo: [["Permutations", REPO + "backtracking/permutations.js"], ["Travelling salesman (nearest neighbour)", REPO + "graph/traveling-salesman.js"]],
    controls: [range("n", "Stops", 4, 9, 8), seed(3)],
    compute(v) {
      const P = points(v.n, v.seed), ex = tspExact(P), nn = tspNearest(P), nl = tourLen(P, nn);
      const big = (n) => fact(n - 1) / 2n;
      return { rows: [["Distinct tours", fmtBig(big(v.n))], ["Tours checked by this page", fmtBig(B(ex.count))], ["Shortest route", ex.best.toFixed(1)], ["Nearest-neighbour route", `${nl.toFixed(1)} (${((nl / ex.best - 1) * 100).toFixed(1)}% longer)`],
        ["If there were 15 stops", `${fmtBig(big(15))} tours, ${human(Number(big(15)) / 1e9)} to check all`], ["If there were 25 stops", `${fmtBig(big(25))} tours, ${human(Number(big(25)) / 1e9)}`]],
        viz: { type: "route", points: P, best: ex.order, greedy: nn }, note: "Green is the shortest route found by checking every tour; the dashed line is the nearest-neighbour shortcut." };
    },
    _tspExact: tspExact, _tspNearest: tspNearest, _points: points,
  });
  function knap(items, cap) {
    const n = items.length, dp = Array.from({ length: n + 1 }, () => new Array(cap + 1).fill(0));
    for (let i = 1; i <= n; i++) for (let c = 0; c <= cap; c++) { dp[i][c] = dp[i - 1][c]; const [w, val] = items[i - 1]; if (w <= c && dp[i - 1][c - w] + val > dp[i][c]) dp[i][c] = dp[i - 1][c - w] + val; }
    const pick = []; let c = cap; for (let i = n; i >= 1; i--) if (dp[i][c] !== dp[i - 1][c]) { pick.push(i - 1); c -= items[i - 1][0]; }
    return { value: dp[n][cap], pick: pick.reverse() };
  }
  function knapGreedy(items, cap) {
    const idx = items.map((_, i) => i).sort((a, b) => items[b][1] / items[b][0] - items[a][1] / items[a][0] || a - b); let w = 0, val = 0; const pick = [];
    for (const i of idx) if (w + items[i][0] <= cap) { w += items[i][0]; val += items[i][1]; pick.push(i); }
    return { value: val, pick: pick.sort((a, b) => a - b) };
  }
  task({
    id: "knapsack", modality: "optimisation", title: "Loading a truck",
    ask: "Each parcel has a weight and a value. Which parcels give the most value without overloading the truck?",
    idea: "Every parcel is in or out, so n parcels have 2^n loads. Dynamic programming finds the best without listing them all by building the best value for every smaller capacity. The greedy rule of taking the best value per kilo first is quick but can miss the optimum.",
    questions: [10, 12], repo: [["0/1 knapsack", REPO + "dynamic-programming/knapsack-01.js"], ["Partition equal subset", REPO + "dynamic-programming/partition-equal-subset.js"], ["Target sum", REPO + "dynamic-programming/target-sum.js"]],
    controls: [range("n", "Parcels", 6, 16, 12), range("capPct", "Truck capacity (% of all weight)", 20, 80, 40, { step: 5 }), seed(5)],
    compute(v) {
      const r = rng(v.seed * 104729), items = Array.from({ length: v.n }, () => [1 + Math.floor(r() * 20), 1 + Math.floor(r() * 40)]);
      const cap = Math.max(1, Math.floor(items.reduce((s, x) => s + x[0], 0) * v.capPct / 100)), ex = knap(items, cap), gr = knapGreedy(items, cap);
      return { rows: [["Possible loads", fmtBig(pow(2, v.n))], ["Capacity", String(cap)], ["Best value (exact)", String(ex.value)], ["Greedy value", `${gr.value}${gr.value < ex.value ? ` (${ex.value - gr.value} short)` : " (matches the best)"}`]],
        viz: { type: "items", items: items.map((it, i) => ({ w: it[0], val: it[1], best: ex.pick.includes(i), greedy: gr.pick.includes(i) })) }, note: "Press the dice to try another random set of parcels. Sometimes greedy ties the best, sometimes it falls short." };
    },
    _knap: knap, _greedy: knapGreedy,
  });
  function assignExact(C) {
    const n = C.length; let best = Infinity, bp = null, count = 0;
    for (const p of permutations([...Array(n).keys()])) { count++; let s = 0; for (let i = 0; i < n; i++) s += C[i][p[i]]; if (s < best) { best = s; bp = p; } }
    return { best, perm: bp, count };
  }
  function assignGreedy(C) {
    const n = C.length, used = new Set(), p = []; let s = 0;
    for (let i = 0; i < n; i++) { let b = -1; for (let j = 0; j < n; j++) if (!used.has(j) && (b < 0 || C[i][j] < C[i][b])) b = j; used.add(b); p.push(b); s += C[i][b]; }
    return { total: s, perm: p };
  }
  task({
    id: "assignment", modality: "optimisation", title: "Matching workers to jobs",
    ask: "n workers and n jobs, each pairing has a cost. Which one-to-one matching is cheapest?",
    idea: "A matching is a permutation, so there are n! of them. The page checks all of them for small n. For large n, methods such as the Hungarian algorithm find the optimum in polynomial time, so brute force is never needed.",
    questions: [15, 16], repo: [["Permutations", REPO + "backtracking/permutations.js"]],
    controls: [range("n", "Workers and jobs", 3, 8, 6), seed(2)],
    compute(v) {
      const r = rng(v.seed * 15485863), C = Array.from({ length: v.n }, () => Array.from({ length: v.n }, () => 1 + Math.floor(r() * 20)));
      const ex = assignExact(C), gr = assignGreedy(C);
      return { rows: [["Possible matchings", fmtBig(fact(v.n))], ["Cheapest total (checked all)", String(ex.best)], ["Greedy total (each worker takes the cheapest free job)", `${gr.total}${gr.total > ex.best ? ` (${gr.total - ex.best} more)` : " (matches the best)"}`]],
        viz: { type: "matrix", cost: C, best: ex.perm, greedy: gr.perm }, note: "The green cells are the cheapest matching. An outlined cell is the greedy choice." };
    },
    _exact: assignExact, _greedy: assignGreedy,
  });

  /* ================================================================== FEASIBILITY */
  const GRAPHS = {
    pentagon: { name: "Five regions in a ring", n: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
    wheel: { name: "A hub with five neighbours around it", n: 6, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 1]].filter((e, i, a) => a.findIndex((x) => x[0] === e[0] && x[1] === e[1]) === i) },
    k4: { name: "Four regions that all touch", n: 4, edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]] },
    petersen: { name: "Petersen graph", n: 10, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [1, 6], [2, 7], [3, 8], [4, 9], [5, 7], [7, 9], [9, 6], [6, 8], [8, 5]] },
    grid: { name: "A grid of 3 × 4 regions", n: 12, edges: (() => { const e = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const i = r * 4 + c; if (c < 3) e.push([i, i + 1]); if (r < 2) e.push([i, i + 4]); } return e; })() },
  };
  function layout(key) {
    const g = GRAPHS[key]; const pos = [];
    if (key === "grid") for (let i = 0; i < 12; i++) pos.push([15 + (i % 4) * 23, 20 + Math.floor(i / 4) * 30]);
    else if (key === "wheel") { pos.push([50, 50]); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; pos.push([50 + 38 * Math.cos(a), 50 + 38 * Math.sin(a)]); } }
    else if (key === "petersen") { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; pos.push([50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a)]); } for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5; pos.push([50 + 18 * Math.cos(a), 50 + 18 * Math.sin(a)]); } }
    else for (let i = 0; i < g.n; i++) { const a = -Math.PI / 2 + (i * 2 * Math.PI) / g.n; pos.push([50 + 38 * Math.cos(a), 50 + 38 * Math.sin(a)]); }
    return pos;
  }
  function colourWith(g, k) {
    const adj = Array.from({ length: g.n }, () => []); for (const [a, b] of g.edges) { adj[a].push(b); adj[b].push(a); }
    const col = new Array(g.n).fill(-1);
    const go = (i) => { if (i === g.n) return true; for (let c = 0; c < k; c++) { if (adj[i].every((j) => col[j] !== c)) { col[i] = c; if (go(i + 1)) return true; col[i] = -1; } } return false; };
    return go(0) ? col : null;
  }
  function chromatic(key) { const g = GRAPHS[key]; for (let k = 1; k <= g.n; k++) { const c = colourWith(g, k); if (c) return { k, colouring: c }; } }
  task({
    id: "colouring", modality: "feasibility", title: "Colouring a map or a timetable",
    ask: "Neighbouring regions (or exams sharing a student) must get different colours (or time slots). How few colours are enough?",
    idea: "Try colouring one region at a time and back up when a clash appears (backtracking). The smallest number that works is the chromatic number. Two touching regions need 2 colours, a triangle needs 3, and four mutually touching regions need 4.",
    questions: [60, 82], repo: [["Graph colouring", REPO + "backtracking/graph-coloring.js"], ["Bipartite check", REPO + "graph/bipartite-check.js"]],
    controls: [select("g", "Layout", Object.entries(GRAPHS).map(([k, g]) => [k, g.name]), "wheel")],
    compute(v) {
      const g = GRAPHS[v.g], r = chromatic(v.g); const total = pow(r.k, g.n);
      return { rows: [["Regions and borders", `${g.n} regions, ${g.edges.length} borders`], ["Fewest colours that work", String(r.k)], ["Colourings tried without the rule (k^n)", fmtBig(total)]],
        viz: { type: "graph", n: g.n, edges: g.edges, pos: layout(v.g), colours: r.colouring }, note: "Any map drawn on a flat sheet can be done in 4 colours (the four colour theorem), but a particular map may need fewer." };
    },
    _chromatic: chromatic, _graphs: GRAPHS,
  });
  function latinCount(n) {
    const perms = [...permutations([...Array(n).keys()])]; let count = 0, first = null; const rows = [];
    const go = (r) => { if (r === n) { count++; if (!first) first = rows.map((x) => x.slice()); return; } for (const p of perms) { let ok = true; for (let q = 0; q < r && ok; q++) for (let c = 0; c < n; c++) if (rows[q][c] === p[c]) { ok = false; break; } if (ok) { rows[r] = p; go(r + 1); } } };
    go(0); return { count, first };
  }
  task({
    id: "latin", modality: "feasibility", title: "Sudoku, rotas and Latin squares",
    ask: "Fill an n × n grid so each symbol appears once in every row and column. How many ways?",
    idea: "A Latin square is the heart of Sudoku, of fair rota schedules and of experiment layouts where each treatment appears once per row and column. The page builds every one by backtracking, row by row, and counts them.",
    questions: [96], repo: [["Sudoku solver", REPO + "backtracking/sudoku-solver.js"], ["N-Queens", REPO + "backtracking/n-queens.js"]],
    controls: [range("n", "Grid size n", 1, 5, 4)],
    compute(v) {
      const r = latinCount(v.n);
      return { rows: [[`Latin squares of size ${v.n} × ${v.n}`, fmtBig(B(r.count))], ["Orderings of rows alone (n!)^n", fmtBig(fact(v.n) ** B(v.n))]], viz: { type: "grid", cells: r.first, title: "The first one found" },
        note: "The counts run 1, 2, 12, 576, 161,280 and then 812,851,200 for size 6. A full 9 × 9 Sudoku has the extra rule about 3 × 3 blocks, and there are about 6.67 × 10^21 solved grids." };
    },
    _latin: latinCount,
  });
  task({
    id: "roster", modality: "feasibility", title: "Shift rotas with rules",
    ask: "Over n days each person works Day or Night, but never two nights in a row. How many valid patterns are there?",
    idea: "Count patterns by their last day. Every valid pattern for n days ends in D (any valid n−1 pattern before it) or in ND (any valid n−2 pattern before it). That is the Fibonacci recurrence, so the count is F(n+2). This is also how many binary strings of length n have no two 1s in a row.",
    questions: [46, 50, 94], repo: [["Climbing stairs", REPO + "dynamic-programming/climbing-stairs.js"], ["Fibonacci", REPO + "dynamic-programming/fibonacci.js"]],
    controls: [range("n", "Days", 1, 40, 7)],
    compute(v) {
      const valid = fib(v.n + 2), all = pow(2, v.n); let list = null;
      if (v.n <= 5) { list = []; for (let m = 0; m < 1 << v.n; m++) { const s = [...Array(v.n)].map((_, i) => (m >> i) & 1 ? "N" : "D").join(""); if (!s.includes("NN")) list.push(s); } }
      return { rows: [["Valid patterns", fmtBig(valid)], ["All patterns (2^n)", fmtBig(all)], ["Share that are valid", pct(Number(valid) / Number(all))]],
        viz: list ? { type: "list", items: list, title: "Every valid pattern (D = day, N = night)" } : null, note: "Rules shrink the space a lot: over 40 days, fewer than one pattern in a thousand is valid." };
    },
    _valid: (n) => { let c = 0; for (let m = 0; m < 1 << n; m++) if ((m & (m >> 1)) === 0) c++; return c; },
  });

  /* ================================================================== COVERAGE AND DESIGN */
  function roundRobin(n) {
    const teams = [...Array(n).keys()]; if (n % 2) teams.push(-1);
    const m = teams.length, rounds = []; let arr = teams.slice();
    for (let r = 0; r < m - 1; r++) { const pairs = []; for (let i = 0; i < m / 2; i++) { const a = arr[i], b = arr[m - 1 - i]; if (a >= 0 && b >= 0) pairs.push([a, b]); } rounds.push(pairs); arr = [arr[0], arr[m - 1], ...arr.slice(1, m - 1)]; }
    return rounds;
  }
  task({
    id: "roundrobin", modality: "design", title: "A league where everyone plays everyone",
    ask: "n teams must each play every other team once. How many matches, how many rounds, and what is the schedule?",
    idea: "The number of matches is the number of pairs, C(n, 2) = n(n − 1)/2. The circle method fixes one team and rotates the rest, which puts every pair together exactly once and keeps every team busy each round.",
    questions: [31, 38, 63], repo: [["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [range("n", "Teams", 3, 16, 6)],
    compute(v) {
      const rounds = roundRobin(v.n);
      return { rows: [["Matches", fmtBig(comb(v.n, 2))], ["Rounds", String(rounds.length)], ["Matches per round", v.n % 2 ? `${(v.n - 1) / 2} (one team rests)` : String(v.n / 2)]],
        viz: { type: "schedule", rounds }, note: "The page checks that every pair meets exactly once and no team plays twice in a round." };
    },
    _roundRobin: roundRobin,
  });
  const H = {
    encode(d) { const [d1, d2, d3, d4] = d; const p1 = d1 ^ d2 ^ d4, p2 = d1 ^ d3 ^ d4, p3 = d2 ^ d3 ^ d4; return [p1, p2, d1, p3, d2, d3, d4]; },
    decode(r) { const s1 = r[0] ^ r[2] ^ r[4] ^ r[6], s2 = r[1] ^ r[2] ^ r[5] ^ r[6], s3 = r[3] ^ r[4] ^ r[5] ^ r[6], pos = s1 + 2 * s2 + 4 * s3; const c = r.slice(); if (pos) c[pos - 1] ^= 1; return { pos, fixed: c, data: [c[2], c[4], c[5], c[6]] }; },
  };
  task({
    id: "hamming", modality: "design", title: "A code that repairs a flipped bit",
    ask: "Four data bits are sent over a noisy line and one bit may flip. Can the receiver fix it without asking again?",
    idea: "Add three check bits so the 16 possible messages become 16 codewords among 128 seven-bit words. Each codeword plus its seven one-bit corruptions covers 8 words, and 16 × 8 = 128: every word the receiver can see is within one flip of exactly one codeword. That exact fit is called a perfect code.",
    questions: [], repo: [],
    controls: [{ key: "bits", label: "Data bits", type: "bits", value: [1, 0, 1, 1] }, select("flip", "Which of the 7 bits flips in transit", [[0, "none"], [1, "bit 1"], [2, "bit 2"], [3, "bit 3"], [4, "bit 4"], [5, "bit 5"], [6, "bit 6"], [7, "bit 7"]], 5)],
    compute(v) {
      const code = H.encode(v.bits), got = code.slice(); if (v.flip) got[v.flip - 1] ^= 1; const d = H.decode(got), ok = d.data.join("") === v.bits.join("");
      return { rows: [["Data sent", v.bits.join("")], ["Codeword sent (7 bits)", code.join("")], ["Received", got.join("")], ["Check bits point to position", d.pos ? String(d.pos) : "none (no error)"], ["Repaired data", d.data.join("")], ["Matches what was sent", ok ? "yes" : "no"], ["Codewords / all 7-bit words", "16 of 128; 16 × 8 = 128, a perfect fit"]],
        viz: { type: "bits", sent: code, got, flip: v.flip }, note: "One flipped bit is always repaired. Two flipped bits are mistaken for one and give wrong data, since the code only promises single-bit repair." };
    },
    _H: H,
  });
  function pairwise(p, v) {
    const all = []; const rec = (i, cur) => { if (i === p) { all.push(cur.slice()); return; } for (let x = 0; x < v; x++) { cur.push(x); rec(i + 1, cur); cur.pop(); } }; rec(0, []);
    const key = (a, x, b, y) => `${a},${x},${b},${y}`; const need = new Set();
    for (let a = 0; a < p; a++) for (let b = a + 1; b < p; b++) for (let x = 0; x < v; x++) for (let y = 0; y < v; y++) need.add(key(a, x, b, y));
    const tests = [], cover = (t) => { const s = []; for (let a = 0; a < p; a++) for (let b = a + 1; b < p; b++) s.push(key(a, t[a], b, t[b])); return s; };
    const left = new Set(need);
    while (left.size) { let best = null, bs = -1; for (const t of all) { const sc = cover(t).filter((k) => left.has(k)).length; if (sc > bs) { bs = sc; best = t; } } tests.push(best); cover(best).forEach((k) => left.delete(k)); }
    return { tests, pairs: need.size, covers: (list) => { const got = new Set(); list.forEach((t) => cover(t).forEach((k) => got.add(k))); return [...need].every((k) => got.has(k)); } };
  }
  task({
    id: "pairwise", modality: "design", title: "Testing software settings",
    ask: "A product has p settings with v values each. Testing every combination is v^p runs. How few runs still test every pair of values together?",
    idea: "Most bugs are triggered by one or two settings, so a test plan only has to make every pair of values meet at least once. A greedy search picks the run that covers the most new pairs each time. The number of runs grows far more slowly than v^p.",
    questions: [31], repo: [["Combination sum", REPO + "backtracking/combination-sum.js"]],
    controls: [range("p", "Settings", 3, 6, 4), range("v", "Values each", 2, 4, 3)],
    compute(v) {
      const r = pairwise(v.p, v.v), full = pow(v.v, v.p);
      return { rows: [["Every combination", fmtBig(full)], ["Runs in the pairwise plan", String(r.tests.length)], ["Value pairs to cover", String(r.pairs)], ["Every pair covered", r.covers(r.tests) ? "yes" : "no"], ["Runs saved", pct(1 - r.tests.length / Number(full))]],
        viz: { type: "table", head: Array.from({ length: v.p }, (_, i) => "Setting " + String.fromCharCode(65 + i)), rows: r.tests }, note: "Pairwise plans are common in software testing. They miss bugs that need three or more settings to line up, so they complement other tests." };
    },
    _pairwise: pairwise,
  });

  /* ================================================================== SAMPLING AND RANDOMNESS */
  task({
    id: "shuffle", modality: "sampling", title: "Shuffling a deck",
    ask: "How many different orders can n cards be in, and has every fair shuffle ever been different?",
    idea: "n cards have n! orders. 52! is about 8 × 10^67, so a well-shuffled deck is almost surely in an order that has never existed before. The chance that two shuffles ever repeated is roughly (number of shuffles)² ÷ (2 × n!) while that is small.",
    questions: [16, 21], repo: [["Permutations", REPO + "backtracking/permutations.js"]],
    controls: [range("n", "Cards", 2, 60, 52)],
    compute(v) {
      const orders = fact(v.n), seconds = 13.8e9 * 3.156e7, shuffles = 8e9 * seconds, repeat = Math.min(1, (shuffles * shuffles) / (2 * Number(orders)));
      return { rows: [["Different orders (n!)", fmtBig(orders)], ["Shuffles if all 8 billion people shuffled once a second since the universe began", fmtNum(shuffles)], ["Chance any two of them matched", repeat >= 1 ? "certain" : pct(repeat)]],
        note: "For 52 cards that chance is around 10^-13. With only 20 cards, repeats would have happened." };
    },
  });
  task({
    id: "survey", modality: "sampling", title: "Picking a survey sample",
    ask: "Choose k people at random from a population of N. How many different samples could result, and how likely is a given person to be in one?",
    idea: "A random sample of k from N is one of C(N, k) equally likely subsets. Every person is in exactly k/N of them, so each has the same chance of being asked, which is what makes the survey fair.",
    questions: [31, 33, 38], repo: [["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [select("N", "Population", [[50, "50"], [500, "500"], [5000, "5,000"], [50000, "50,000"]], 500), range("k", "Sample size", 1, 200, 20, { maxFor: (v) => Math.min(v.N, 200) })],
    compute(v) {
      const k = Math.min(v.k, v.N), c = comb(v.N, k);
      return { rows: [["Possible samples", fmtBig(c)], ["Digits in that number", String(c.toString().length)], ["Chance a given person is chosen", pct(k / v.N)]],
        note: "A bigger sample shrinks sampling error, but it is not the count of possible samples that matters. What matters is that selection is random and complete: a sample drawn only from people who answer is biased however large it is." };
    },
  });
  task({
    id: "bootstrap", modality: "sampling", title: "Resampling your own data (the bootstrap)",
    ask: "To judge how stable an average is, draw n values from your n data points with replacement, many times. How many different resamples exist?",
    idea: "Ordered draws number n^n. What matters is only how many times each data point appears, so the distinct resamples are multisets: C(2n − 1, n), the stars-and-bars count of ways to split n draws among n points.",
    questions: [61, 64, 67], repo: [["Combination sum", REPO + "backtracking/combination-sum.js"]],
    controls: [range("n", "Data points", 2, 30, 10)],
    compute(v) {
      const ordered = pow(v.n, v.n), distinct = comb(2 * v.n - 1, v.n);
      return { rows: [["Ordered draws (n^n)", fmtBig(ordered)], ["Distinct resamples C(2n − 1, n)", fmtBig(distinct)], ["Ordered draws per distinct resample, on average", fmtNum(Number(ordered) / Number(distinct), 1)]],
        note: "Distinct resamples are not equally likely (a sample using each point once is far more likely than one using a single point n times), so software draws randomly rather than listing them." };
    },
  });

  return { MODALITIES, TASKS: T, util: { fact, comb, perm, pow, fib, fmtBig, fmtNum, pct, human, rng, permutations, oneIn }, HANDS: HANDS.map((h) => [h[0], h[1]]), followers, CORPUS, birthday };
});
