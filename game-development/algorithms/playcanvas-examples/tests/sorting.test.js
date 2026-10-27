const { instance } = require("./harness");
const R = require("path").join(__dirname, "..", "sorting") + "/";
const names = ["bucket-sort","counting-sort","heap-sort","insertion-sort","merge-sort","quick-sort","radix-sort","selection-sort","shell-sort"];
for (const n of names) {
  let ok = 0, fail = null, steps = 0;
  for (let trial = 0; trial < 25 && !fail; trial++) {
    try {
      const { o } = instance(R + n + ".js"); o.initialize();
      const arr = o.array.slice();
      o.startSort();
      let i = 0;
      while (o.sorting !== false && i < 100000) { o.update(100); i++; }
      steps = i;
      const out = o.array || [];
      const exp = arr.slice().sort((a, b) => a - b);
      if (i >= 100000) throw new Error("did not finish");
      if (JSON.stringify(out.slice().map(Number)) !== JSON.stringify(exp)) throw new Error("not sorted: " + JSON.stringify(arr) + " -> " + JSON.stringify(out));
      ok++;
    } catch (e) { fail = e.message.slice(0, 200); }
  }
  console.log(n.padEnd(16), fail ? "FAIL " + fail : "ok x" + ok + " (" + steps + " steps)");
}
