#!/usr/bin/env node
// Runs every *.test.js file here and fails if any of them reports a FAIL or throws.
// Usage: node tests/run.js   (no dependencies; Node 18 or newer)
const { spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
let failed = 0;
for (const f of fs.readdirSync(__dirname).filter((n) => n.endsWith(".test.js")).sort()) {
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { encoding: "utf8", timeout: 60000 });
  const text = (r.stdout || "") + (r.stderr || "");
  const bad = /FAIL|DIFFERS|ERROR|Error:/.test(text) || r.status !== 0;
  console.log((bad ? "FAIL " : "ok   ") + f);
  if (bad) { failed++; console.log(text.split("\n").filter((l) => /FAIL|DIFFERS|ERROR|Error/.test(l)).slice(0, 8).map((l) => "     " + l).join("\n")); }
}
console.log(failed ? failed + " test file(s) failed" : "all test files passed");
process.exit(failed ? 1 : 0);
