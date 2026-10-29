// Writes the real-world section of ../README.md from tasks.js, so the table and the counts there cannot drift from the page.
// Usage: node sync-readme.js          (rewrites ../README.md)
//        check.js calls build() and fails if the README is not already in this form.
const fs = require("fs"), path = require("path"); const R = require("./tasks.js");
const README = path.join(__dirname, "..", "README.md");
function section() {
  const n = R.TASKS.length, solo = R.TASKS.filter((t) => t.who === "solo").length, group = n - solo, hobby = R.TASKS.filter((t) => t.hobby).length;
  const cell = (m, w) => R.TASKS.filter((t) => t.modality === m.id && t.who === w).map((t) => t.title).join("; ");
  const rows = R.MODALITIES.map((m) => `| ${m.name} | ${m.ask} | ${cell(m, "solo")} | ${cell(m, "group")} |`).join("\n");
  const steps = R.HOBBY_STEPS.map(([id, why], i) => `${i + 1}. **${R.TASKS.find((t) => t.id === id).title}**: ${why}`).join("\n");
  return `## Combinatorics in the real world

The [real-world page](real-world/index.html) is a 3D map of ${n} everyday problems, grouped by the question each one asks. Prediction is one group: when outcomes are equally likely, a forecast is a count of what you care about divided by a count of everything that could happen.

Each problem is also marked **solo** (${solo} tasks: one person or system faces it alone, such as a ticket, a hand, a route or a data set) or **group** (${group} tasks: the answer depends on how several people or agents fit, meet, share or compete, such as a team, a league or a crowd). Solo tasks grow with the number of options; group tasks also grow with the number of people, usually much faster: pairs grow with n², sub-groups with 2ⁿ and line-ups with n!. Each task has live numbers; \`real-world/check.js\` tests them against brute force.

| Group | The question | Solo tasks | Group tasks |
|---|---|---|---|
${rows}

### Starting a hobby group

${hobby} of the tasks make up a path for starting a hobby group, in the order the questions usually come up. The page walks through it step by step, and its **Hobby groups** button highlights these tasks.

${steps}

`;
}
function build(md) {
  const i = md.indexOf("## Combinatorics in the real world"), j = md.indexOf("## Closest tasks in this repository");
  if (i < 0 || j < 0) throw new Error("README sections not found");
  let out = md.slice(0, i) + section() + md.slice(j);
  out = out.replace(/A 3D map of \d+ everyday problems/, `A 3D map of ${R.TASKS.length} everyday problems`);
  return out;
}
module.exports = { build, section };
if (require.main === module) { const md = fs.readFileSync(README, "utf8"); fs.writeFileSync(README, build(md)); console.log("README section written for " + R.TASKS.length + " tasks"); }
