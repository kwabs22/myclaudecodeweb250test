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
  const seed = (value = 1) => ({ key: "seed", label: "Random example", type: "seed", value });
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


  /* ================================================================== SOLO AND GROUP */
  /* Solo: one person or system faces the problem alone (their ticket, hand, route, data).
     Group: the answer depends on how several people or agents fit, meet, share or compete. */
  const WHO = { passwords: "solo", plates: "solo", poker: "solo", birthday: "group", bayes: "solo", nextword: "solo", season: "group", lottery: "solo",
    kmers: "solo", gametree: "group", subsets: "solo", tsp: "solo", knapsack: "solo", assignment: "group", colouring: "group", latin: "solo", roster: "group",
    roundrobin: "group", hamming: "group", pairwise: "solo", shuffle: "solo", survey: "group", bootstrap: "solo" };
  T.forEach((t) => { t.who = WHO[t.id]; });

  /* --- helpers for the group tasks */
  function stirling2(n, k) {                 /* ways to split n people into k non-empty teams, teams unlabelled */
    const S = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0n)); S[0][0] = 1n;
    for (let i = 1; i <= n; i++) for (let j = 1; j <= Math.min(i, k); j++) S[i][j] = B(j) * S[i - 1][j] + S[i - 1][j - 1];
    return S[n][k];
  }
  function bell(n) { let t = 0n; for (let k = 0; k <= n; k++) t += stirling2(n, k); return t; }
  function derangements(n) { if (n === 0) return 1n; let a = 1n, b = 0n; for (let i = 2; i <= n; i++) [a, b] = [b, B(i - 1) * (a + b)]; return n === 1 ? 0n : b; }
  function pairings(n) { let r = 1n; for (let i = n - 1; i > 1; i -= 2) r *= B(i); return r; }   /* (n-1)!! for even n */

  task({
    id: "handshakes", modality: "counting", who: "group", title: "Handshakes and who talks to whom",
    ask: "In a group of n people, how many pairs can talk to each other, and how many different sub-groups could form?",
    idea: "Every pair is one link, so n people have C(n, 2) = n(n − 1)/2 links: doubling the group roughly quadruples them. Every person is in or out of a sub-group, so there are 2^n sub-groups, of which 2^n − n − 1 have two or more people. This is why big teams struggle to keep everyone in step.",
    questions: [31, 38, 63], repo: [["Combinations", REPO + "backtracking/combinations.js"], ["Subset generation", REPO + "backtracking/subset-generation.js"]],
    controls: [range("n", "People in the group", 2, 60, 10)],
    compute(v) {
      const links = comb(v.n, 2);
      return { rows: [["Pairs (handshakes, possible conversations)", fmtBig(links)], ["Messages if everyone tells everyone", fmtBig(B(v.n) * B(v.n - 1))], ["Possible sub-groups of two or more", fmtBig(pow(2, v.n) - B(v.n) - 1n)], ["Pairs after doubling the group", fmtBig(comb(2 * v.n, 2))]],
        note: "Five people have 10 pairs; ten people have 45. Adding people adds many more links than people." };
    },
  });
  task({
    id: "committee", modality: "counting", who: "group", title: "Picking a committee",
    ask: "From a group of n people, how many different committees of k can be chosen, and how do rules change the count?",
    idea: "A committee is a subset, so order does not matter: C(n, k). A rule changes the count by splitting the choice. Needing exactly m members from a sub-group of W means choosing m from the W and the rest from the others: C(W, m) × C(n − W, k − m). Naming a chair and a secretary adds ordered choices.",
    questions: [31, 33, 15, 14], repo: [["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [range("n", "People in the group", 4, 40, 12), range("k", "Committee size", 2, 40, 4, { maxFor: (v) => v.n }), range("W", "People in sub-group A", 0, 40, 5, { maxFor: (v) => v.n }), range("m", "Members needed from sub-group A", 0, 40, 2, { maxFor: (v) => Math.min(v.k, v.W) })],
    compute(v) {
      const n = v.n, k = Math.min(v.k, n), W = Math.min(v.W, n), m = Math.min(v.m, k, W);
      const rest = k - m <= n - W ? comb(W, m) * comb(n - W, k - m) : 0n;
      return { rows: [["All committees of " + k, fmtBig(comb(n, k))], [`Exactly ${m} from sub-group A (${W} people)`, fmtBig(rest)], ["…with a chair and a secretary named (two different members)", fmtBig(comb(n, k) * B(k) * B(k - 1))], ["Including at least one of two particular people", fmtBig(comb(n, k) - comb(n - 2, k))]],
        note: "The last row counts all committees and removes the ones that exclude both people: C(n, k) − C(n − 2, k)." };
    },
  });
  task({
    id: "seating", modality: "counting", who: "group", title: "Seating people round a table",
    ask: "n people sit at a round table. How many different seatings are there, and how many keep two friends together or apart?",
    idea: "Turning everyone one seat round gives the same seating, so fix one person and arrange the others: (n − 1)!. Treat two friends as one block that can face either way: 2 × (n − 2)! seatings keep them side by side. The rest, (n − 1)! − 2(n − 2)!, keep them apart.",
    questions: [24, 25, 58], repo: [["Permutations", REPO + "backtracking/permutations.js"]],
    controls: [range("n", "People", 3, 20, 8)],
    compute(v) {
      const all = fact(v.n - 1), together = 2n * fact(v.n - 2);
      return { rows: [["Different seatings", fmtBig(all)], ["Two particular friends side by side", fmtBig(together)], ["Those two apart", fmtBig(all - together)], ["Chance two friends end up side by side by luck", pct(2 / (v.n - 1))], ["If a seating and its mirror image count as one", v.n >= 3 ? fmtBig(all / 2n) : fmtBig(all)]],
        note: "At a table of 8, two friends are side by side in 2 of every 7 random seatings, and a table of 20 has about 1.2 × 10^17 seatings." };
    },
  });
  task({
    id: "teams", modality: "counting", who: "group", title: "Splitting people into teams",
    ask: "n people must be split into k teams, with nobody left out and no team empty. How many ways?",
    idea: "When teams have no names, the count is a Stirling number of the second kind S(n, k). Adding up S(n, k) over every k gives the Bell number: all the ways to split the group at all. If the teams must be equal size s, divide n! by (s!)^k and by k! so reordering people inside a team, or the teams themselves, is not counted twice.",
    questions: [63, 65, 66, 70], repo: [["Combination sum", REPO + "backtracking/combination-sum.js"], ["Subset generation", REPO + "backtracking/subset-generation.js"]],
    controls: [range("n", "People", 1, 25, 9), range("k", "Teams", 1, 25, 3, { maxFor: (v) => v.n })],
    compute(v) {
      const k = Math.min(v.k, v.n), s = v.n / k;
      const equal = Number.isInteger(s) ? fact(v.n) / (fact(s) ** B(k) * fact(k)) : null;
      return { rows: [[`Ways to split ${v.n} people into ${k} teams`, fmtBig(stirling2(v.n, k))], ["Ways to split them into any number of teams (Bell number)", fmtBig(bell(v.n))], [equal !== null ? `Ways if every team has exactly ${s} people` : "Equal-sized teams", equal !== null ? fmtBig(equal) : `not possible: ${v.n} people do not divide into ${k} equal teams`]],
        note: "Nine people into three teams of three can be done in 280 ways. Four people can be split in 15 ways in all." };
    },
  });
  task({
    id: "santa", modality: "feasibility", who: "group", title: "Secret Santa: nobody draws themselves",
    ask: "n people each draw one name from a hat. How many draws leave nobody holding their own name, and how likely is a random draw to be valid?",
    idea: "Draws are permutations (n! of them). Those with no fixed point are called derangements, counted by D(n) = (n − 1)(D(n − 1) + D(n − 2)). Surprisingly, D(n)/n! settles near 1/e = 36.8% however big the group is, so about one random draw in three is valid.",
    questions: [28, 30], repo: [["Permutations", REPO + "backtracking/permutations.js"]],
    controls: [range("n", "People", 2, 20, 6)],
    compute(v) {
      const all = fact(v.n), d = derangements(v.n);
      return { rows: [["All possible draws (n!)", fmtBig(all)], ["Draws where nobody has their own name", fmtBig(d)], ["Chance a random draw is valid", pct(Number(d) / Number(all))], ["Draws to expect before one works", fmtNum(Number(all) / Number(d), 2)]],
        note: "Four people have 9 valid draws out of 24. From about 6 people on, the chance is 36.8% to three figures." };
    },
  });
  /* ordered ballots of three candidates, and the majority cycle (Condorcet paradox) */
  const RANKINGS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const beats = RANKINGS.map((r) => { const pos = []; r.forEach((c, i) => (pos[c] = i)); return [pos[0] < pos[1], pos[1] < pos[2], pos[2] < pos[0]]; });
  function votingCycles(v) {
    let cyc = 0n; const total = pow(6, v), half = v / 2;
    const go = (i, left, counts) => {
      if (i === 5) { counts[5] = left; const m = [0, 0, 0]; for (let r = 0; r < 6; r++) for (let q = 0; q < 3; q++) if (beats[r][q]) m[q] += counts[r];
        const ab = m[0] > half, bc = m[1] > half, ca = m[2] > half; if ((ab && bc && ca) || (!ab && !bc && !ca)) { let ways = fact(v); for (const c of counts) ways /= fact(c); cyc += ways; } return; }
      for (let c = 0; c <= left; c++) { counts[i] = c; go(i + 1, left - c, counts); }
    };
    go(0, v, new Array(6).fill(0)); return { cycles: cyc, total };
  }
  task({
    id: "voting", modality: "prediction", who: "group", title: "Can a majority vote go in a circle?",
    ask: "Voters each rank three candidates. How often does majority rule give a cycle, where A beats B, B beats C and C beats A, so there is no clear winner?",
    idea: "Each voter can submit 6 different rankings, so v voters give 6^v possible sets of ballots. The page counts every set by how many voters chose each ranking (weighting by the number of ways to arrange the voters) and checks each for a cycle. The share is the chance of a cycle if every ranking were equally likely. It rises with the number of voters toward about 8.8%, so it is small but never goes away.",
    questions: [], repo: [],
    controls: [range("v", "Voters (odd numbers, so there are no ties)", 3, 15, 3, { step: 2 })],
    compute(v) {
      const n = v.v % 2 ? v.v : v.v + 1, r = votingCycles(n);
      return { rows: [["Possible sets of ballots (6^v)", fmtBig(r.total)], ["Sets with a majority cycle", fmtBig(r.cycles)], ["Chance of a cycle", pct(Number(r.cycles) / Number(r.total))], ["Limit with very many voters", "about 8.8%"]],
        note: "Three voters can produce a cycle in 5.6% of the sets. A cycle means any pairing of candidates is decided by a different majority, which is why rules like ranked choice or points exist." };
    },
    _cycles: votingCycles,
  });
  task({
    id: "scheduling", modality: "prediction", who: "group", title: "Finding a time everyone can meet",
    ask: "Each of n people is free for any given slot with some chance. How likely is it that at least one slot suits everyone?",
    idea: "One slot suits everyone with chance p^n, which falls fast as the group grows. With m independent slots the chance that none works is (1 − p^n)^m, so at least one working is 1 − (1 − p^n)^m. The number of slots that work is m × p^n on average.",
    questions: [], repo: [],
    controls: [range("n", "People", 2, 12, 5), range("m", "Slots on offer", 1, 60, 10), range("p", "Chance one person is free for a slot (%)", 10, 95, 60, { step: 5 })],
    compute(v) {
      const q = (v.p / 100) ** v.n, none = (1 - q) ** v.m, need = q >= 1 ? 1 : Math.ceil(Math.log(0.1) / Math.log(1 - q));
      return { rows: [["Chance a given slot suits everyone", pct(q)], ["Slots that suit everyone, on average", fmtNum(v.m * q, 2)], ["Chance at least one slot suits everyone", pct(1 - none)], ["Slots to offer for a 90% chance", fmtNum(need, 0)]],
        note: "This assumes people are free independently of each other. Real diaries are correlated (everyone avoids Friday evenings), so offer slots that differ in kind." };
    },
  });
  function bracketCount(n) {                 /* distinct knockout brackets, counted from the formula n! / 2^(n-1) */
    return fact(n) / pow(2, n - 1);
  }
  task({
    id: "bracket", modality: "design", who: "group", title: "A knockout tournament",
    ask: "n teams play a single-elimination bracket. How many matches, how many different brackets, and how likely are two teams to meet?",
    idea: "Every match removes one team, so n teams need n − 1 matches. Placing teams on the bracket gives n! orders, but swapping the two teams in any of the n − 1 matches changes nothing, leaving n!/2^(n−1) distinct brackets. If every team is equally good, two particular teams meet with chance 2/n, and in the final with chance 2/(n(n − 1)).",
    questions: [31, 38], repo: [["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [select("n", "Teams", [[2, "2"], [4, "4"], [8, "8"], [16, "16"], [32, "32"], [64, "64"]], 8)],
    compute(v) {
      return { rows: [["Matches", String(v.n - 1)], ["Rounds", String(Math.log2(v.n))], ["Distinct brackets", fmtBig(bracketCount(v.n))], ["Chance two given teams ever meet", pct(2 / v.n)], ["Chance they meet in the final", v.n > 2 ? pct(2 / (v.n * (v.n - 1))) : "certain (only one match)"]],
        note: "With equal teams the chance a given team wins is 1/n, and bigger brackets mean any two particular teams are less likely to meet." };
    },
    _bracket: bracketCount,
  });
  task({
    id: "groupgrowth", modality: "counting", who: "group", title: "How fast groups blow up",
    ask: "As a group of n people grows, how quickly do the numbers of pairs, sub-groups, line-ups, seatings, team splits and pairings grow?",
    idea: "Pairs grow like n², sub-groups like 2^n, and orderings like n!, which overtakes everything else. Splitting the group into teams (the Bell number) lies between 2^n and n!. This is the arithmetic behind why coordination gets harder with size, and why group problems need rules rather than checking every case.",
    questions: [16, 24, 63, 70], repo: [["Permutations", REPO + "backtracking/permutations.js"], ["Subset generation", REPO + "backtracking/subset-generation.js"]],
    controls: [range("n", "People in the group", 2, 30, 10)],
    compute(v) {
      const items = [["Pairs", comb(v.n, 2)], ["All sub-groups (2^n)", pow(2, v.n)], ["Ways to split into teams (Bell)", bell(v.n)], ["Seatings round a table", fact(v.n - 1)], ["Line-ups (n!)", fact(v.n)]];
      if (v.n % 2 === 0) items.splice(4, 0, ["Ways to pair everyone off", pairings(v.n)]);
      return { rows: items.map(([a, b]) => [a, fmtBig(b)]), viz: { type: "bars", items: items.map(([a, b]) => ({ label: a, value: Number(b), on: false })), log: true }, note: "Bars use a log scale. At 10 people there are only 45 pairs but 3,628,800 line-ups; at 30 people the line-ups number 2.65 × 10^32." };
    },
  });

  /* --- more solo tasks, so both sides of the comparison are filled */
  function coupon(n, t) {
    const p = new Array(n + 1).fill(0); p[0] = 1;
    for (let step = 0; step < t; step++) for (let k = n; k >= 0; k--) { p[k] = p[k] * (k / n) + (k > 0 ? p[k - 1] * ((n - (k - 1)) / n) : 0); }
    return p[n];
  }
  task({
    id: "coupon", modality: "prediction", who: "solo", title: "Collecting a complete set",
    ask: "There are n different cards in a collection and each pack gives one at random. How many packs does it take to get them all?",
    idea: "When you hold k cards, the next pack is new with chance (n − k)/n, so you wait n/(n − k) packs on average for it. Adding these up for k = 0 … n − 1 gives n × (1 + 1/2 + … + 1/n), about n ln n. The last few cards cost the most.",
    questions: [], repo: [],
    controls: [range("n", "Different cards", 2, 100, 20), range("t", "Packs bought", 1, 1000, 100)],
    compute(v) {
      let e = 0; for (let k = 0; k < v.n; k++) e += v.n / (v.n - k); const half = (() => { let t = v.n; while (coupon(v.n, t) < 0.5 && t < 5000) t++; return t; })();
      return { rows: [["Packs needed on average", fmtNum(e, 1)], ["Packs for an even chance of a full set", fmtNum(half, 0)], [`Chance of a full set after ${v.t} packs`, pct(coupon(v.n, v.t))], ["Rule of thumb n ln n + 0.58 n", fmtNum(v.n * Math.log(v.n) + 0.5772 * v.n, 1)]],
        note: "For 20 cards the average is about 72 packs, which is 3.6 packs per card, not one. Swapping with friends turns this into a group task and cuts the cost." };
    },
    _coupon: coupon,
  });
  function diceWays(d, sides = 6) { let w = { 0: 1n }; for (let i = 0; i < d; i++) { const nw = {}; for (const [s, c] of Object.entries(w)) for (let f = 1; f <= sides; f++) nw[+s + f] = (nw[+s + f] || 0n) + c; w = nw; } return w; }
  task({
    id: "dice", modality: "prediction", who: "solo", title: "What will the dice show?",
    ask: "Roll d six-sided dice. How many ways give a total of t, and which total is likeliest?",
    idea: "There are 6^d equally likely rolls. The number that give total t is built one die at a time: ways(t) = ways with one fewer die summed over the six faces. Totals near the middle have the most ways, which is why 7 is the commonest total of two dice.",
    questions: [31, 74, 75, 80], repo: [["Coin change (counting ways)", REPO + "dynamic-programming/coin-change.js"], ["Target sum", REPO + "dynamic-programming/target-sum.js"]],
    controls: [range("d", "Dice", 1, 10, 2), range("t", "Target total", 1, 60, 7, { minFor: (v) => v.d, maxFor: (v) => 6 * v.d })],
    compute(v) {
      const w = diceWays(v.d), t = Math.min(Math.max(v.t, v.d), 6 * v.d), total = pow(6, v.d); let best = v.d; for (const k of Object.keys(w)) if (w[k] > w[best]) best = +k;
      return { rows: [["Possible rolls (6^d)", fmtBig(total)], [`Rolls totalling ${t}`, fmtBig(w[t])], ["Chance", pct(Number(w[t]) / Number(total))], ["Likeliest total", `${best} (${fmtBig(w[best])} ways)`]],
        viz: { type: "bars", items: Object.keys(w).map((k) => ({ label: "total " + k, value: Number(w[k]), on: +k === t })), log: false }, note: "The counts here are the coefficients of (x + x² + … + x⁶)^d, the generating-function view of the same problem." };
    },
    _dice: diceWays,
  });
  function gridRoutes(a, b, blocked) {
    const W = Array.from({ length: a + 1 }, () => new Array(b + 1).fill(0n)); W[0][0] = 1n;
    for (let i = 0; i <= a; i++) for (let j = 0; j <= b; j++) { if (blocked && blocked[0] === i && blocked[1] === j) { W[i][j] = 0n; continue; } if (i || j) W[i][j] = (i ? W[i - 1][j] : 0n) + (j ? W[i][j - 1] : 0n); }
    return W[a][b];
  }
  task({
    id: "gridroutes", modality: "counting", who: "solo", title: "Counting routes across a city grid",
    ask: "Walk a blocks east and b blocks north, only moving east or north. How many routes are there, and how many if one crossing is closed?",
    idea: "A route is a sequence of a easts and b norths, so choosing which of the a + b steps are east gives C(a + b, a). With a closed crossing, count routes crossing by crossing: routes to a crossing are the routes to the one before it from the west plus from the south, and the closed crossing adds nothing.",
    questions: [52, 12], repo: [["Unique paths", REPO + "dynamic-programming/unique-paths.js"], ["Climbing stairs", REPO + "dynamic-programming/climbing-stairs.js"]],
    controls: [range("a", "Blocks east", 1, 25, 6), range("b", "Blocks north", 1, 25, 6), select("block", "A crossing is closed", [["none", "none"], ["mid", "the middle crossing"]], "none")],
    compute(v) {
      const mid = [Math.floor(v.a / 2), Math.floor(v.b / 2)], all = comb(v.a + v.b, v.a), closed = gridRoutes(v.a, v.b, v.block === "mid" ? mid : null), through = comb(mid[0] + mid[1], mid[0]) * comb(v.a + v.b - mid[0] - mid[1], v.a - mid[0]);
      return { rows: [["Routes with every crossing open", fmtBig(all)], ["Routes through the middle crossing", fmtBig(through)], [v.block === "mid" ? "Routes with the middle crossing closed" : "Routes avoiding the middle crossing", fmtBig(all - through)], ["Chance a random route uses the middle crossing", pct(Number(through) / Number(all))]],
        note: "Routes through a crossing multiply: routes to it times routes from it. Subtracting them from the total counts the routes that avoid it." };
    },
    _gridRoutes: gridRoutes,
  });

  /* ================================================================== HOBBY GROUPS */
  const LF = [0]; for (let i = 1; i <= 700; i++) LF[i] = LF[i - 1] + Math.log(i);
  const binomPmf = (n, k, p) => Math.exp(LF[n] - LF[k] - LF[n - k] + k * Math.log(p) + (n - k) * Math.log(1 - p));
  const binomAtLeast = (n, s, p) => { let t = 0; for (let k = s; k <= n; k++) t += binomPmf(n, k, p); return Math.min(1, t); };
  function shareChance(N, k, j) { return Number(comb(k, j) * comb(N - k, k - j)) / Number(comb(N, k)); }
  function popcount(x) { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; }

  task({
    id: "sharedhobby", modality: "prediction", who: "group", title: "Will anyone else share my hobby?",
    ask: "Each person picks k hobbies from a list of N. How likely is it that two people share at least one, and how many people must you meet to find a match?",
    idea: "Count the ways the second person can avoid every hobby you chose: they must pick all k from the N − k you did not, which is C(N − k, k) of the C(N, k) equally likely choices. The chance of sharing is one minus that. Meeting g independent people then gives 1 − (chance of missing)^g.",
    questions: [31, 33, 47], repo: [["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [range("N", "Hobbies to choose from", 10, 100, 30), range("k", "Hobbies each person picks", 1, 10, 4), range("g", "People you could meet", 1, 100, 20)],
    compute(v) {
      const k = Math.min(v.k, v.N), miss = Number(comb(v.N - k, k)) / Number(comb(v.N, k)), share = 1 - miss; let need = 1; while (need < 10000 && 1 - miss ** need < 0.5) need++;
      const rows = [["Chance two people share at least one hobby", pct(share)]];
      for (let j = 1; j <= Math.min(k, 3); j++) rows.push([`…share exactly ${j}`, pct(shareChance(v.N, k, j))]);
      rows.push(["Hobbies two people share, on average", fmtNum(k * k / v.N, 2)], [`Chance at least one of ${v.g} people shares one with you`, pct(1 - miss ** v.g)], ["People to meet for an even chance of a match", fmtNum(need, 0)]);
      return { rows, note: "This assumes everyone picks at random. Real hobbies cluster (people who like hiking often like camping), which makes matches more likely than this." };
    },
    _shareChance: shareChance,
  });
  function invitesFor(s, p, conf) { let n = s; while (n < 600 && binomAtLeast(n, s, p) < conf) n++; return n; }
  task({
    id: "invites", modality: "prediction", who: "group", title: "How many people to invite for a full session",
    ask: "You want s people to turn up and each invited person comes with chance p. How many invitations make a full session likely, and when do you have too many?",
    idea: "Each invitation is an independent yes or no, so the number who come follows a binomial distribution: the chance exactly k of n come is C(n, k) p^k (1 − p)^(n − k). Add those up for k ≥ s to get the chance of a full session, and for k > s to get the chance of turning people away.",
    questions: [12, 33], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"]],
    controls: [range("s", "People you want", 2, 30, 8), range("p", "Chance each invited person comes (%)", 20, 95, 60, { step: 5 }), select("conf", "How sure you want to be", [[0.8, "80%"], [0.9, "90%"], [0.95, "95%"], [0.99, "99%"]], 0.9)],
    compute(v) {
      const p = v.p / 100, n = invitesFor(v.s, p, v.conf), turned = binomAtLeast(n, v.s + 1, p);
      return { rows: [["Invitations to send", String(n)], ["Chance at least " + v.s + " come", pct(binomAtLeast(n, v.s, p))], ["Chance more than " + v.s + " come (someone is turned away)", pct(turned)], ["People expected to come", fmtNum(n * p, 1)], ["If you only invited " + v.s, `chance of a full session is ${pct(p ** v.s)}`]],
        note: "Being sure of a full session means inviting well over the number you want, so you will often have more people than seats. This treats every invitation as independent; friends tend to come together or not at all, so a small, committed core can work better than a long list." };
    },
    _invitesFor: invitesFor, _atLeast: binomAtLeast,
  });
  const ROLES = ["vocals", "guitar", "bass", "drums", "keys", "sound desk"];
  function roleCandidates(n, r, seedv) {
    const g = rng(seedv * 31337), c = Array.from({ length: n }, () => Array.from({ length: r }, () => g() < 0.25));
    for (let j = 0; j < r; j++) if (!c.some((x) => x[j])) c[Math.floor(g() * n)][j] = true;
    for (let i = 0; i < n; i++) if (!c[i].some(Boolean)) c[i][Math.floor(g() * r)] = true;
    return c;
  }
  function smallestCover(c, r) {
    const n = c.length, mask = c.map((x) => x.reduce((m, b, j) => (b ? m | (1 << j) : m), 0)), full = (1 << r) - 1; let best = n + 1, bestMasks = [];
    for (let m = 1; m < 1 << n; m++) { let size = 0, cov = 0; for (let i = 0; i < n; i++) if ((m >> i) & 1) { size++; cov |= mask[i]; } if (cov !== full) continue; if (size < best) { best = size; bestMasks = [m]; } else if (size === best) bestMasks.push(m); }
    let cov = 0; const greedy = []; while (cov !== full) { let bi = -1, bg = -1; for (let i = 0; i < n; i++) { const gain = popcount(mask[i] & ~cov); if (gain > bg) { bg = gain; bi = i; } } greedy.push(bi); cov |= mask[bi]; }
    return { size: best, count: bestMasks.length, first: bestMasks[0], greedy };
  }
  task({
    id: "roles", modality: "optimisation", who: "group", title: "Founding members who cover every role",
    ask: "A new group needs several roles filled (a band needs vocals, guitar, bass and so on). Each candidate can do some of them. What is the smallest founding group that covers every role?",
    idea: "Every subset of candidates is a possible group, so n candidates have 2^n − 1 groups to try. The page checks them all and also shows the greedy shortcut of repeatedly adding the person who covers the most uncovered roles, which is fast but can use more people than the best answer.",
    questions: [10, 12, 31], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"], ["Partition equal subset", REPO + "dynamic-programming/partition-equal-subset.js"]],
    controls: [range("n", "Candidates", 5, 14, 10), range("r", "Roles to cover", 3, 6, 5), seed(2)],
    compute(v) {
      const c = roleCandidates(v.n, v.r, v.seed), res = smallestCover(c, v.r), chosen = []; for (let i = 0; i < v.n; i++) if ((res.first >> i) & 1) chosen.push(i);
      return { rows: [["Groups to try (2^n − 1)", fmtBig(pow(2, v.n) - 1n)], ["Smallest group that covers every role", `${res.size} people (${res.count} different ways)`], ["One such group", chosen.map((i) => "person " + (i + 1)).join(", ")], ["Greedy shortcut", `${res.greedy.length} people${res.greedy.length > res.size ? ` (${res.greedy.length - res.size} more than needed)` : " (as few as possible)"}`]],
        viz: { type: "cover", roles: ROLES.slice(0, v.r), cand: c, chosen }, note: "A ✓ marks a role the person can fill; chosen people are highlighted. Press the dice for another set of candidates." };
    },
    _roleCandidates: roleCandidates, _smallestCover: smallestCover,
  });
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  function availability(n, q, seedv) { const g = rng(seedv * 7757); return Array.from({ length: n }, () => DAYS.map(() => g() < q)); }
  function bestDays(av, k) {
    let best = -1, bestSet = null; const combos = []; const go = (start, cur) => { if (cur.length === k) { combos.push(cur.slice()); return; } for (let d = start; d < 7; d++) { cur.push(d); go(d + 1, cur); cur.pop(); } }; go(0, []);
    let total = 0; for (const set of combos) { const c = av.filter((m) => set.some((d) => m[d])).length; total += c; if (c > best) { best = c; bestSet = set; } }
    return { best, set: bestSet, average: total / combos.length, options: combos.length };
  }
  task({
    id: "meetdays", modality: "optimisation", who: "group", title: "Which days should the group meet?",
    ask: "Each member is free on some weekdays. If the group meets on k days a week, which days let the most members take part?",
    idea: "There are C(7, k) ways to choose the days. For each, count the members free on at least one chosen day, and keep the best. The best pair of days is usually not the two days with the most free people, because those people overlap.",
    questions: [31, 38], repo: [["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [range("n", "Members", 6, 40, 16), range("q", "Chance a member is free on a given day (%)", 10, 80, 35, { step: 5 }), range("k", "Meeting days per week", 1, 3, 2), seed(4)],
    compute(v) {
      const av = availability(v.n, v.q / 100, v.seed), r = bestDays(av, v.k), single = bestDays(av, 1), per = DAYS.map((d, i) => av.filter((m) => m[i]).length);
      return { rows: [["Ways to choose the days", String(r.options)], ["Best days", r.set.map((d) => DAYS[d]).join(" + ")], ["Members who can come to at least one", `${r.best} of ${v.n} (${pct(r.best / v.n)})`], ["Best single day", `${single.best} of ${v.n}`], ["Average of all choices", fmtNum(r.average, 1)]],
        viz: { type: "bars", items: DAYS.map((d, i) => ({ label: d + (r.set.includes(i) ? " (chosen)" : ""), value: per[i], on: r.set.includes(i) })), log: false }, note: "Bars show how many members are free each day. Press the dice for another set of diaries." };
    },
    _availability: availability, _bestDays: bestDays,
  });
  task({
    id: "hosts", modality: "counting", who: "group", title: "Sharing the hosting",
    ask: "Each week one member hosts. How many rotas are there, and how many have nobody hosting two weeks in a row?",
    idea: "The first week has n choices. Each later week has n − 1 choices if the same person may not host twice running, so there are n × (n − 1)^(w − 1) such rotas out of n^w in all. A fully fair rota where everyone hosts once over n weeks is one of n! orders.",
    questions: [1, 2, 16], repo: [["Permutations", REPO + "backtracking/permutations.js"]],
    controls: [range("n", "Members", 2, 12, 5), range("w", "Weeks", 1, 12, 6)],
    compute(v) {
      const all = pow(v.n, v.w), ok = B(v.n) * pow(v.n - 1, v.w - 1);
      return { rows: [["All possible rotas (n^w)", fmtBig(all)], ["Nobody hosts two weeks in a row", fmtBig(ok)], ["Share of rotas that qualify", pct(Number(ok) / Number(all))], [`Orders in which all ${v.n} members host once each`, fmtBig(fact(v.n))]],
        note: "A random rota breaks the rule often for small groups: with 3 members and 6 weeks only 13.2% of rotas avoid back-to-back hosting." };
    },
  });
  function fairSplit(skills) {
    const n = skills.length, half = n / 2, total = skills.reduce((a, b) => a + b, 0); let best = Infinity, bestMask = 0, count = 0;
    for (let m = 0; m < 1 << n; m++) { if (!(m & 1) || popcount(m) !== half) continue; count++; let a = 0; for (let i = 0; i < n; i++) if ((m >> i) & 1) a += skills[i]; const d = Math.abs(total - 2 * a); if (d < best) { best = d; bestMask = m; } }
    const order = skills.map((x, i) => i).sort((a, b) => skills[b] - skills[a] || a - b); let sa = 0, sb = 0;
    order.forEach((pl, i) => { const round = Math.floor(i / 2), first = i % 2 === 0, toA = round % 2 === 0 ? first : !first; if (toA) sa += skills[pl]; else sb += skills[pl]; });
    return { count, best, bestMask, snake: Math.abs(sa - sb) };
  }
  task({
    id: "fairteams", modality: "optimisation", who: "group", title: "Fair teams for a pick-up game",
    ask: "Split n players of different skill into two equal teams so the totals are as close as possible. How many splits are there, and how well does a quick method do?",
    idea: "Fixing one player on team A, the other n/2 − 1 of team A can be chosen in C(n − 1, n/2 − 1) ways, and each choice fixes the other team. The page checks every split for the best balance, and compares it with a snake draft (strongest picked first, then pairs of picks in alternating order), which is quick and often very close.",
    questions: [31, 38, 65], repo: [["Partition equal subset", REPO + "dynamic-programming/partition-equal-subset.js"], ["Combinations", REPO + "backtracking/combinations.js"]],
    controls: [range("n", "Players (even number)", 4, 16, 10, { step: 2 }), seed(6)],
    compute(v) {
      const n = v.n % 2 ? v.n + 1 : v.n, g = rng(v.seed * 4177), skills = Array.from({ length: n }, () => 1 + Math.floor(g() * 10)), r = fairSplit(skills);
      const A = [], Bt = []; for (let i = 0; i < n; i++) ((r.bestMask >> i) & 1 ? A : Bt).push(i);
      return { rows: [["Ways to split into two equal teams", fmtBig(comb(n - 1, n / 2 - 1))], ["Splits checked by this page", fmtBig(B(r.count))], ["Best split: difference in total skill", String(r.best)], ["Snake draft: difference", `${r.snake}${r.snake > r.best ? ` (${r.snake - r.best} worse)` : " (as good as the best)"}`]],
        viz: { type: "teams", a: A.map((i) => skills[i]), b: Bt.map((i) => skills[i]) }, note: "Skills are random ratings from 1 to 10. Press the dice for another set of players." };
    },
    _fairSplit: fairSplit,
  });
  function rotate(n, s) {
    const met = Array.from({ length: n }, () => new Array(n).fill(false)); let unmet = n * (n - 1) / 2; const rounds = [];
    const need = (a, rem) => rem.filter((x) => x !== a && !met[a][x]).length;
    while (unmet > 0 && rounds.length < 400) {
      const rem = [...Array(n).keys()], tables = [];
      while (rem.length) {
        let u = rem[0], bu = -1; for (const x of rem) { const c = need(x, rem); if (c > bu) { bu = c; u = x; } }
        const table = [u]; rem.splice(rem.indexOf(u), 1);
        while (table.length < s && rem.length) { let w = rem[0], bw = -1; for (const x of rem) { const c = table.filter((t) => !met[t][x]).length; if (c > bw) { bw = c; w = x; } } table.push(w); rem.splice(rem.indexOf(w), 1); }
        tables.push(table);
      }
      for (const t of tables) for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) if (!met[t[i]][t[j]]) { met[t[i]][t[j]] = met[t[j]][t[i]] = true; unmet--; }
      rounds.push(tables);
    }
    return { rounds, lower: Math.ceil((n - 1) / (s - 1)) };
  }
  task({
    id: "rotation", modality: "design", who: "group", title: "Mixing the tables so everyone meets",
    ask: "At a game night, n players sit at tables of s. How many rounds until everyone has sat with everyone else at least once?",
    idea: "Each player meets s − 1 new people a round, and has n − 1 people to meet, so at least ⌈(n − 1)/(s − 1)⌉ rounds are needed. Whether that is reachable depends on the numbers (15 players at tables of 3 in 7 rounds is the classic schoolgirl puzzle). The page builds a schedule greedily, always seating each player with people they have not met, and checks that every pair meets.",
    questions: [31, 38], repo: [["Combinations", REPO + "backtracking/combinations.js"], ["Graph colouring", REPO + "backtracking/graph-coloring.js"]],
    controls: [range("n", "Players", 4, 24, 12), range("s", "Players per table", 2, 6, 4, { maxFor: (v) => Math.min(6, v.n) })],
    compute(v) {
      const s = Math.min(v.s, v.n), r = rotate(v.n, s);
      return { rows: [["Pairs that need to meet", fmtBig(comb(v.n, 2))], ["Pairs that can meet each round, at most", fmtBig(B(Math.floor(v.n / s)) * comb(s, 2))], ["Fewest rounds possible (lower bound)", String(r.lower)], ["Rounds this schedule uses", `${r.rounds.length}${r.rounds.length === r.lower ? " (meets the lower bound)" : ""}`]],
        viz: { type: "tables", rounds: r.rounds }, note: "The greedy plan is not always the shortest possible: the lower bound only says it cannot be shorter. Special numbers allow perfect designs." };
    },
    _rotate: rotate,
  });
  function clubSlots(m, seedv) { const g = rng(seedv * 9173); return Array.from({ length: m }, () => ({ day: Math.floor(g() * 4), start: 18 + Math.floor(g() * 4), len: 1 + Math.floor(g() * 3) })); }
  const clash = (a, b) => a.day === b.day && a.start < b.start + b.len && b.start < a.start + a.len;
  function clubPlans(clubs) {
    const m = clubs.length, bad = Array.from({ length: m }, () => 0);
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) if (i !== j && clash(clubs[i], clubs[j])) bad[i] |= 1 << j;
    let ok = 0, best = 0, bestCount = 0, bestMask = 0;
    for (let mask = 0; mask < 1 << m; mask++) { let good = true; for (let i = 0; i < m && good; i++) if (((mask >> i) & 1) && (bad[i] & mask)) good = false; if (!good) continue; ok++; const size = popcount(mask); if (size > best) { best = size; bestCount = 1; bestMask = mask; } else if (size === best) bestCount++; }
    const byDay = {}; clubs.forEach((c, i) => (byDay[c.day] = byDay[c.day] || []).push(i)); let greedy = 0;
    for (const list of Object.values(byDay)) { list.sort((a, b) => clubs[a].start + clubs[a].len - (clubs[b].start + clubs[b].len)); let end = -1; for (const i of list) if (clubs[i].start >= end) { greedy++; end = clubs[i].start + clubs[i].len; } }
    return { total: 2 ** m, ok, best, bestCount, bestMask, greedy };
  }
  task({
    id: "joinclubs", modality: "feasibility", who: "solo", title: "Fitting clubs into my own week",
    ask: "I could join m hobby clubs, each meeting once a week at a fixed time. Some clash. How many combinations of clubs fit without a clash, and what is the most I can join?",
    idea: "Every subset of clubs is a possible plan, so m clubs have 2^m plans, and a plan works if no two of its clubs overlap. The page tests every plan. The largest clash-free plan can also be found quickly by taking, day by day, the club that finishes earliest (the greedy rule for interval scheduling), and the page checks the two agree.",
    questions: [10, 12], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"], ["Graph colouring", REPO + "backtracking/graph-coloring.js"]],
    controls: [range("m", "Clubs", 5, 14, 10), seed(3)],
    compute(v) {
      const clubs = clubSlots(v.m, v.seed), r = clubPlans(clubs);
      return { rows: [["Plans to try (2^m)", fmtBig(B(r.total))], ["Plans with no clash", fmtBig(B(r.ok))], ["Most clubs I can join", String(r.best)], ["Different ways to join that many", String(r.bestCount)], ["Quick greedy rule gives", `${r.greedy} clubs${r.greedy === r.best ? " (the same)" : " (different!)"}`]],
        viz: { type: "timeline", clubs, laneH: [0, 0, 0, 0], chosen: clubs.map((c, i) => i).filter((i) => (r.bestMask >> i) & 1) }, note: "Clubs meet Monday to Thursday, starting between 18:00 and 21:00 and running one to three hours. Highlighted bars are one best plan. Press the dice for another set of clubs." };
    },
    _clubSlots: clubSlots, _clubPlans: clubPlans, _clash: clash,
  });

  /* --- choosing what the group does */
  const AREAS = ["Origami", "Chess", "Painting", "Coding", "Hiking", "Baking", "Music", "Board games", "Photography", "Gardening", "Film", "Robotics"];
  task({
    id: "areabundles", modality: "counting", who: "group", title: "Bundles of interests to choose from",
    ask: "One small activity (folding a single page) is not enough for a whole group. If the group can draw on k areas of interest, how many different bundles of r areas could it build a programme from?",
    idea: "Choosing r areas from k where the order does not matter is C(k, r). If the areas are done as phases, one after another, order matters and there are k!/(k − r)! programmes. Allowing a bundle of any size gives 2^k − 1 non-empty bundles. A modest list of areas already gives far more programmes than a group could ever discuss, which is why the next tasks narrow them down.",
    questions: [1, 3, 10], repo: [["Combinations", REPO + "backtracking/combinations.js"], ["Subset generation", REPO + "backtracking/subset-generation.js"]],
    controls: [range("k", "Areas of interest on the list", 3, 12, 8), range("r", "Areas in the programme", 1, 8, 3, { maxFor: (v) => Math.min(8, v.k) })],
    compute(v) {
      const r = Math.min(v.r, v.k);
      return { rows: [["Bundles of " + r + " (order does not matter)", fmtBig(comb(v.k, r))], ["Programmes if the areas run as phases in order", fmtBig(perm(v.k, r))], ["Bundles of any size, at least one area", fmtBig(pow(2, v.k) - 1n)], ["Areas on the list", AREAS.slice(0, v.k).join(", ")]],
        note: "With 8 areas there are 56 bundles of 3, but 336 ordered programmes. Fewer, larger bundles are easier to choose between." };
    },
  });
  function areaVotes(n, k, seedv) {
    const g = rng(seedv * 7919);
    return Array.from({ length: n }, () => { const likes = new Array(k).fill(false), howMany = 1 + Math.floor(g() * 3); for (let c = 0; c < howMany; c++) likes[Math.floor(g() * k)] = true; return likes; });
  }
  function bestAreas(votes, k, r) {
    const n = votes.length, mask = votes.map((row) => row.reduce((m, b, j) => (b ? m | (1 << j) : m), 0)); let best = -1, count = 0, bestMask = 0, all = 0;
    for (let m = 0; m < 1 << k; m++) { if (popcount(m) !== r) continue; all++; const covered = mask.filter((x) => x & m).length; if (covered > best) { best = covered; count = 1; bestMask = m; } else if (covered === best) count++; }
    let cov = 0, greedyMask = 0; for (let c = 0; c < r; c++) { let bj = -1, bg = -1; for (let j = 0; j < k; j++) { if ((greedyMask >> j) & 1) continue; const gain = mask.filter((x) => (x & (1 << j)) && !(x & greedyMask)).length; if (gain > bg) { bg = gain; bj = j; } } greedyMask |= 1 << bj; }
    cov = mask.filter((x) => x & greedyMask).length;
    return { all, best, count, bestMask, greedy: cov, greedyMask, n };
  }
  task({
    id: "areapick", modality: "optimisation", who: "group", title: "Picking areas that most members care about",
    ask: "Each member ticks the areas they would enjoy. If the group can only run r areas, which r leave the fewest members with nothing they like?",
    idea: "There are C(k, r) ways to choose r areas. The page tries them all and counts how many members like at least one chosen area. Adding, one at a time, the area that brings in the most uncovered members is a fast shortcut, but it can fall short of the best choice.",
    questions: [10, 12, 31], repo: [["Combinations", REPO + "backtracking/combinations.js"], ["Subset generation", REPO + "backtracking/subset-generation.js"]],
    controls: [range("n", "Members", 4, 20, 10), range("k", "Areas on the list", 4, 12, 8), range("r", "Areas the group can run", 1, 6, 3, { maxFor: (v) => Math.min(6, v.k) }), seed(4)],
    compute(v) {
      const r = Math.min(v.r, v.k), votes = areaVotes(v.n, v.k, v.seed), res = bestAreas(votes, v.k, r), names = (m) => AREAS.slice(0, v.k).filter((a, j) => (m >> j) & 1).join(", ");
      const mask = votes.map((row) => row.reduce((m, b, j) => (b ? m | (1 << j) : m), 0)), chosen = mask.map((x, i) => i).filter((i) => mask[i] & res.bestMask);
      return { rows: [["Choices of areas to try", fmtBig(comb(v.k, r))], ["Most members reached", `${res.best} of ${v.n} (${res.count} different ways)`], ["One best choice", names(res.bestMask)], ["Greedy shortcut reaches", `${res.greedy} of ${v.n}${res.greedy < res.best ? " (fewer than the best)" : " (as many as the best)"}`]],
        viz: { type: "cover", roles: AREAS.slice(0, v.k), cand: votes, chosen }, note: "A ✓ marks an area a member would enjoy; highlighted rows are the members reached by one best choice. Press the dice for another group." };
    },
    _areaVotes: areaVotes, _bestAreas: bestAreas,
  });
  function surjections(p, n) { return fact(n) * stirling2(p, n); }
  task({
    id: "projectsize", modality: "feasibility", who: "group", title: "Is the project big enough for the group?",
    ask: "A project has p separate parts and n members, and everyone should have at least one part. How many ways are there to hand the parts out so nobody is idle, and how big must the project be?",
    idea: "Handing each of p distinguishable parts to one of n members gives n^p ways. Those that leave nobody idle are the surjections, n! × S(p, n), where S is the Stirling number of the second kind. If p is below n the count is zero: the project is too small however it is shared. A single page to fold is one part, so it suits one person.",
    questions: [1, 16, 31], repo: [["Combinations", REPO + "backtracking/combinations.js"], ["Subset generation", REPO + "backtracking/subset-generation.js"]],
    controls: [range("p", "Parts in the project", 1, 14, 6), range("n", "Members", 2, 10, 4)],
    compute(v) {
      const all = pow(v.n, v.p), ok = surjections(v.p, v.n), enough = v.p >= v.n;
      return { rows: [["Ways to hand out the parts (n^p)", fmtBig(all)], ["Ways where nobody is idle", fmtBig(ok)], ["Share of hand-outs that keep everyone busy", pct(Number(ok) / Number(all))], ["Fewest parts that can keep everyone busy", String(v.n)], ["Verdict", enough ? `big enough: about ${(v.p / v.n).toFixed(1)} parts each` : `too small: ${v.n - v.p} member${v.n - v.p === 1 ? "" : "s"} would have nothing to do`]],
        note: "A random hand-out often leaves someone idle even when the project is big enough, so it is better to plan the split than to let people grab parts." };
    },
    _surjections: surjections,
  });

  /* --- relationships in general, and derivative works */
  const pairList = (n) => { const p = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) p.push([i, j]); return p; };
  function connectedNetworks(n) {              /* labelled connected graphs on n people */
    const g = (k) => pow(2, k * (k - 1) / 2), c = [0n, 1n];
    for (let m = 2; m <= n; m++) { let t = g(m); for (let k = 1; k < m; k++) t -= comb(m - 1, k - 1) * c[k] * g(m - k); c.push(t); }
    return c[n];
  }
  task({
    id: "networks", modality: "counting", who: "group", theme: "relationships", title: "How many friendship networks are there?",
    ask: "n people, and each pair either know each other or do not. How many different networks of acquaintance are possible, how many hold everyone together, and how many have exactly e friendships?",
    idea: "A group of n has C(n, 2) pairs, and each pair is in or out, so there are 2^C(n,2) networks. Exactly e friendships is a choice of e pairs from those C(n, 2). A network that holds everyone together (connected) is counted by taking all networks and removing those where the group of the first person is smaller than everyone: c(n) = 2^C(n,2) − Σ C(n−1, k−1) · c(k) · 2^C(n−k,2). Small groups already have more networks than anyone could draw.",
    questions: [1, 3, 10], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"], ["Graph colouring", REPO + "backtracking/graph-coloring.js"]],
    controls: [range("n", "People", 2, 12, 6), range("e", "Friendships", 0, 66, 7, { maxFor: (v) => v.n * (v.n - 1) / 2 })],
    compute(v) {
      const pairs = v.n * (v.n - 1) / 2, e = Math.min(v.e, pairs), all = pow(2, pairs), conn = connectedNetworks(v.n);
      return { rows: [["Pairs of people", fmtBig(B(pairs))], ["All possible networks (2^pairs)", fmtBig(all)], [`Networks with exactly ${e} friendships`, fmtBig(comb(pairs, e))], ["Networks where everyone is linked (connected)", fmtBig(conn)], ["Share of networks that are connected", pct(Number(conn) / Number(all))]],
        note: "With 5 people there are 1,024 networks and 728 of them are connected. With 12 people, almost every network is connected, but there are more of them than grains of sand on Earth." };
    },
    _connected: connectedNetworks,
  });
  function mutualTrio(n, maskFor) {
    const P = pairList(n), idx = {}; P.forEach(([a, b], i) => (idx[a * n + b] = i));
    const trios = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) trios.push([a, b, c, idx[a * n + b], idx[a * n + c], idx[b * n + c]]);
    const mono = (mask) => { for (const t of trios) { const x = (mask >> t[3]) & 1, y = (mask >> t[4]) & 1, z = (mask >> t[5]) & 1; if (x === y && y === z) return t; } return null; };
    let free = 0, firstFree = -1; const total = 1 << P.length;
    for (let m = 0; m < total; m++) if (!mono(m)) { free++; if (firstFree < 0) firstFree = m; }
    return { P, total, free, firstFree, mono, maskFor: maskFor || (() => 0) };
  }
  task({
    id: "mutualtrio", modality: "feasibility", who: "group", theme: "relationships", title: "Is a trio of friends or strangers unavoidable?",
    ask: "Among n people, every pair are either friends or strangers. Is there always a trio who are all friends with each other, or all strangers to each other, however the friendships fall?",
    idea: "The page lists every possible network of n people (2^C(n,2) of them) and looks for a trio with all three pairs the same. For 3, 4 and 5 people some networks avoid it (5 people in a ring where each knows only their two neighbours). For 6 people none do: every network has such a trio. This is the smallest case of Ramsey's theorem, and shows that large enough groups always contain some order.",
    questions: [1, 12, 38], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"], ["Graph colouring", REPO + "backtracking/graph-coloring.js"]],
    controls: [range("n", "People", 3, 6, 5), seed(2)],
    compute(v) {
      const r = mutualTrio(v.n), g = rng(v.seed * 8431); let mask = r.firstFree, mark = [];
      if (v.n === 6 || v.seed > 1) { mask = Math.floor(g() * r.total); const t = r.mono(mask); mark = t ? [t[0], t[1], t[2]] : []; }
      const edges = [], non = []; r.P.forEach(([a, b], i) => (((mask >> i) & 1 ? edges : non).push([a, b])));
      return { rows: [["Networks checked (2^pairs)", fmtBig(B(r.total))], ["Networks with no trio of all friends or all strangers", fmtBig(B(r.free))], ["Verdict", r.free === 0 ? "a trio is unavoidable" : "a trio can be avoided"]],
        viz: { type: "network", n: v.n, edges, non, mark }, note: mark.length ? "A random network; the highlighted trio are all friends or all strangers. Solid lines are friends, faint dashes are strangers. Press the dice for another." : "Solid lines are friends, faint dashes are strangers: this network has no trio of all one kind." };
    },
    _mutualTrio: mutualTrio,
  });
  const POPS = [[1e3, "a thousand"], [1e4, "ten thousand"], [1e6, "a million"], [1e8, "a hundred million"], [8e9, "eight billion"]];
  function reach(k, d) { let t = 1n; for (let i = 1; i <= d; i++) t += B(k) * pow(k - 1, i - 1); return t; }
  task({
    id: "separation", modality: "prediction", who: "solo", theme: "relationships", title: "How many steps away is everyone?",
    ask: "You know k people, each of them knows k others, and so on. How many steps of introduction does it take to reach a population of N?",
    idea: "At step 1 you reach k people. Each of those has k − 1 new contacts (one is whoever introduced them), so step d adds k × (k − 1)^(d − 1) people. This best case, where nobody is reached twice, grows geometrically, so a few steps cover even eight billion people. Real networks overlap (your friends know each other), so the true count of steps is somewhat larger.",
    questions: [1, 2, 16], repo: [["Graph colouring", REPO + "backtracking/graph-coloring.js"]],
    controls: [range("k", "People each person knows", 3, 200, 30), select("pop", "Population", POPS.map((p, i) => [i, p[1]]), 3)],
    compute(v) {
      const N = B(POPS[v.pop][0]); let d = 0; while (reach(v.k, d) < N && d < 80) d++;
      const shown = Math.min(Math.max(d, 3), 12);
      return { rows: [["People reached after 1 step", fmtBig(reach(v.k, 1) - 1n)], ["People reached after 3 steps, at most", fmtBig(reach(v.k, 3) - 1n)], [`Steps to reach ${POPS[v.pop][1]} people, best case`, String(d)]],
        viz: { type: "bars", items: Array.from({ length: shown }, (_, i) => ({ label: `${i + 1} step${i ? "s" : ""}`, value: Number(reach(v.k, i + 1) - 1n), on: i + 1 === d })), log: true },
        note: "Bars use a logarithmic scale. Overlapping friend groups make real networks slower than this best case, but experiments with chains of letters found about six steps." };
    },
    _reach: reach,
  });
  task({
    id: "ancestors", modality: "counting", who: "solo", theme: "relationships", title: "Your ancestors: more places than people",
    ask: "Going back g generations, you have 2^g ancestor slots. When does that exceed the number of people who were alive, and what does it mean?",
    idea: "Each person has two parents, so generation g back has 2^g slots, and 2^(g+1) − 2 slots over g generations. A population of P people cannot fill more than P distinct slots, so once 2^g exceeds P some people fill several slots: relatives had children together, far back. The number of generations where this must start is about log2 of the population.",
    questions: [1, 2, 16], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"]],
    controls: [range("g", "Generations back", 1, 40, 25), select("pop", "People alive back then", POPS.map((p, i) => [i, p[1]]), 3)],
    compute(v) {
      const slots = pow(2, v.g), P = B(POPS[v.pop][0]); let first = 0; while (pow(2, first) <= P) first++;
      return { rows: [["Ancestor slots in that generation (2^g)", fmtBig(slots)], ["Slots over all generations so far", fmtBig(pow(2, v.g + 1) - 2n)], ["People alive then", POPS[v.pop][1]], ["Slots per person alive", fmtNum(Number(slots) / Number(P), 2)], ["First generation with more slots than people", String(first)], ["Verdict", slots > P ? "some people must fill more than one slot" : "enough people for every slot to be different"]],
        note: "A generation is roughly 25 to 30 years, so 25 generations is about 700 years. Family trees stop looking like trees long before they run out of people." };
    },
  });
  task({
    id: "remix", modality: "counting", who: "solo", theme: "derivative", title: "Mashups from a pile of source works",
    ask: "You have n source works (songs, images, stories). A derivative work uses r of them, each in one of v versions. How many different derivative works could you make?",
    idea: "Choosing which r sources to use is C(n, r). Each chosen source can appear in v versions, so v^r. If the order or layering matters, multiply by r!. Allowing any number of sources gives 2^n − 1 selections. The number of ways to remix grows far faster than the number of sources, which is why a modest library supports a huge range of derivative works.",
    questions: [1, 3, 10], repo: [["Combinations", REPO + "backtracking/combinations.js"], ["Permutations", REPO + "backtracking/permutations.js"]],
    controls: [range("n", "Source works", 2, 30, 10), range("r", "Sources in one mashup", 1, 8, 3, { maxFor: (v) => Math.min(8, v.n) }), range("v", "Versions of each source", 1, 6, 2)],
    compute(v) {
      const r = Math.min(v.r, v.n), pick = comb(v.n, r), withV = pick * pow(v.v, r);
      return { rows: [[`Ways to choose ${r} sources`, fmtBig(pick)], ["…with a choice of version for each", fmtBig(withV)], ["…and in a chosen order or layering", fmtBig(withV * fact(r))], ["Selections of any size, at least one source", fmtBig(pow(2, v.n) - 1n)]],
        note: "With 10 sources, 3 in a mashup and 2 versions each: 120 selections, 960 with versions and 5,760 once order counts." };
    },
  });
  function lineages(n) {
    let single = 1n, noneOk = 1n; for (let i = 2; i <= n; i++) { single *= B(i - 1); noneOk *= pow(2, i - 1) - 1n; }
    return { single, anyBut: noneOk, any: pow(2, n * (n - 1) / 2) };
  }
  task({
    id: "lineages", modality: "counting", who: "group", theme: "derivative", title: "Who was derived from whom?",
    ask: "n works are made one after another. Each later work may be based on earlier ones. How many different derivation histories are possible, if each work has one parent, or any set of earlier works as sources?",
    idea: "The second work can derive from 1 earlier work, the third from 2, the fourth from 3, so single-parent histories number 1 × 2 × 3 × … × (n − 1) = (n − 1)!. If any set of earlier works may be sources, work i has 2^(i−1) choices, and these multiply to 2^C(n,2), the same count as friendship networks: a derivation history is a network of relationships with a direction in time. Insisting that every later work has at least one source gives the product of (2^(i−1) − 1).",
    questions: [1, 3, 16], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"], ["Permutations", REPO + "backtracking/permutations.js"]],
    controls: [range("n", "Works", 2, 12, 6), seed(3)],
    compute(v) {
      const r = lineages(v.n), g = rng(v.seed * 3571), edges = []; for (let i = 1; i < v.n; i++) edges.push([Math.floor(g() * i), i]);
      return { rows: [["Histories where each work has one earlier parent", fmtBig(r.single)], ["Histories where each later work has at least one source set", fmtBig(r.anyBut)], ["Histories with any set of sources, even none (2^pairs)", fmtBig(r.any)], ["Same count for friendship networks of this many people", fmtBig(pow(2, v.n * (v.n - 1) / 2))]],
        viz: { type: "network", n: v.n, edges, non: [], mark: [], labels: "W" }, note: "One random single-parent history is drawn: each work is joined to the earlier work it came from. Press the dice for another." };
    },
    _lineages: lineages,
  });
  function licenceMixes(m, p, seedv) {
    const g = rng(seedv * 6151), P = pairList(m), ok = Array.from({ length: m }, () => 0), edges = [], non = [];
    for (const [a, b] of P) { if (g() * 100 < p) { ok[a] |= 1 << b; ok[b] |= 1 << a; edges.push([a, b]); } else non.push([a, b]); }
    let legal = 0, best = 0, bestCount = 0, bestMask = 0;
    for (let mask = 0; mask < 1 << m; mask++) {
      let good = true; for (let i = 0; i < m && good; i++) if (((mask >> i) & 1) && ((mask & ~(1 << i)) & ~ok[i])) good = false;
      if (!good) continue; const size = popcount(mask); if (size >= 2) legal++; if (size > best) { best = size; bestCount = 1; bestMask = mask; } else if (size === best) bestCount++;
    }
    return { edges, non, legal, best, bestCount, bestMask, total: 2 ** m - m - 1 };
  }
  task({
    id: "licences", modality: "feasibility", who: "group", theme: "derivative", title: "Which sources can legally be combined?",
    ask: "Each source work has a licence, and some pairs of licences are compatible. How many combinations of two or more sources can be merged into one derivative, and what is the most sources in a single legal mix?",
    idea: "A combination can be merged only if every pair of its sources is compatible, so it is a set of works all linked to each other in the compatibility network (a clique). There are 2^m − m − 1 combinations of two or more, and the page tests each. Adding one more source with a single incompatible partner shrinks the legal combinations sharply.",
    questions: [10, 12, 31], repo: [["Subset generation", REPO + "backtracking/subset-generation.js"], ["Graph colouring", REPO + "backtracking/graph-coloring.js"]],
    controls: [range("m", "Source works", 3, 14, 9), range("p", "Chance two licences are compatible (%)", 20, 95, 60, { step: 5 }), seed(4)],
    compute(v) {
      const r = licenceMixes(v.m, v.p, v.seed), chosen = []; for (let i = 0; i < v.m; i++) if ((r.bestMask >> i) & 1) chosen.push(i);
      return { rows: [["Combinations of two or more sources", fmtBig(B(r.total))], ["Combinations where every pair is compatible", fmtBig(B(r.legal))], ["Most sources in one legal mix", `${r.best} (${r.bestCount === 1 ? "1 way" : r.bestCount + " different ways"})`], ["Share of combinations that are legal", pct(r.legal / r.total)]],
        viz: { type: "network", n: v.m, edges: r.edges, non: [], mark: chosen, labels: "S" }, note: "Lines join compatible licences; a highlighted set is one largest legal mix. Press the dice for another set of licences." };
    },
    _licenceMixes: licenceMixes,
  });
  { const hs = T.find((t) => t.id === "handshakes"); if (hs) hs.theme = "relationships"; }
  const THEMES = { relationships: "Relationships", derivative: "Derivative works" };

  /* the order a new hobby group usually meets its questions in */
  const HOBBY_STEPS = [
    ["joinclubs", "Before starting, check what fits into your own week."], ["sharedhobby", "Will anyone else share your hobby?"],
    ["areabundles", "A single small activity is too little for a group: see how many bundles of areas there are."], ["areapick", "Pick the areas that reach the most members."], ["projectsize", "Check the project is big enough to keep everyone busy."],
    ["invites", "Invite enough people for a full session."],
    ["meetdays", "Pick the meeting days that suit the most members."], ["scheduling", "Check the chance a given time suits everyone."], ["roles", "Make sure every role the hobby needs is covered."],
    ["committee", "Choose organisers."], ["hosts", "Share the hosting fairly."], ["fairteams", "Split into fair teams for games."],
    ["rotation", "Mix the tables so members meet each other."], ["roundrobin", "Run a league where everyone plays everyone."],
  ];
  HOBBY_STEPS.forEach(([id]) => { const t = T.find((x) => x.id === id); if (!t) throw new Error("hobby step " + id + " is not a task"); t.hobby = true; });

  T.forEach((t) => { if (t.who !== "solo" && t.who !== "group") throw new Error("task " + t.id + " has no solo or group tag"); });

  return { MODALITIES, TASKS: T, util: { fact, comb, perm, pow, fib, fmtBig, fmtNum, pct, human, rng, permutations, oneIn, stirling2, bell, derangements, pairings }, WHO_LABELS: { solo: "Solo", group: "Group" }, HOBBY_STEPS, THEMES, HANDS: HANDS.map((h) => [h[0], h[1]]), followers, CORPUS, birthday };
});
