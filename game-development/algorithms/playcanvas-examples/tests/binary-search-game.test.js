const { instance } = require("./harness");
const R = require("path").join(__dirname, "..") + "/";
let bad = [], max = 0;
for (let seed = 1; seed <= 200; seed++) {
  let s = seed; const M = Object.create(Math); M.random = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  const { o } = instance(R + "search/binary-search.js", { Math: M }); o.initialize(); o.startNewGame();
  let n = 0; while (o.gameActive && n < 30) { o.makeOptimalGuess(); n++; }
  max = Math.max(max, n); if (o.gameActive || n > o.optimalGuesses) bad.push([seed, n, o.optimalGuesses, o.targetNumber]);
}
console.log("200 games with optimal play: longest", max, "guesses; over the stated optimum or unfinished:", bad.length, bad.slice(0, 3));
