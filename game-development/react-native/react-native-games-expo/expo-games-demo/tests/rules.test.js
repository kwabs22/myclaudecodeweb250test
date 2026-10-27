// Tests the pure rule helpers in the games, in plain Node. Run: node tests/rules.test.js
// The helpers are exported from the game files, which are JSX, so they are cut out of the source and evaluated here.
const fs = require("fs"), path = require("path"), assert = require("assert");
function helpers(file, names) {
  const src = fs.readFileSync(path.join(__dirname, "..", "games", file), "utf8");
  let code = "";
  for (const n of names) {
    const start = src.indexOf("export function " + n + "(");
    assert.ok(start >= 0, n + " not found in " + file);
    let depth = 0, i = src.indexOf("{", start);
    for (; i < src.length; i++) { if (src[i] === "{") depth++; else if (src[i] === "}" && --depth === 0) break; }
    code += src.slice(start, i + 1).replace("export ", "") + "\n";
  }
  return new Function(code + "return {" + names.join(",") + "};")();
}
const out = []; const T = (n, f) => { try { f(); out.push("ok   " + n); } catch (e) { out.push("FAIL " + n + " | " + e.message.split("\n")[0].slice(0, 150)); } };

const C = helpers("CheckersGame.js", ["jumpedSquare", "hasJump", "canStep", "hasAnyMove"]);
const empty = () => Array.from({ length: 8 }, () => Array(8).fill(null));
const P = (player, king = false) => ({ player, king });
T("checkers: a man steps one square forward only", () => { const b = empty(); b[2][1] = P(1); assert.ok(C.canStep(b, 2, 1, 3, 2, b[2][1])); assert.ok(!C.canStep(b, 2, 1, 1, 2, b[2][1])); assert.ok(!C.canStep(b, 2, 1, 3, 1, b[2][1])); });
T("checkers: a king steps both ways", () => { const b = empty(); b[4][3] = P(2, true); assert.ok(C.canStep(b, 4, 3, 5, 4, b[4][3])); assert.ok(C.canStep(b, 4, 3, 3, 2, b[4][3])); });
T("checkers: jumping over an opponent captures it", () => { const b = empty(); b[2][1] = P(1); b[3][2] = P(2); assert.deepStrictEqual(C.jumpedSquare(b, 2, 1, 4, 3, b[2][1]), { row: 3, col: 2 }); });
T("checkers: cannot jump your own piece, an empty square, or onto an occupied one", () => { const b = empty(); b[2][1] = P(1); b[3][2] = P(1); assert.strictEqual(C.jumpedSquare(b, 2, 1, 4, 3, b[2][1]), null); b[3][2] = null; assert.strictEqual(C.jumpedSquare(b, 2, 1, 4, 3, b[2][1]), null); b[3][2] = P(2); b[4][3] = P(2); assert.strictEqual(C.jumpedSquare(b, 2, 1, 4, 3, b[2][1]), null); });
T("checkers: a man cannot capture backwards, a king can", () => { const b = empty(); b[4][3] = P(1); b[3][2] = P(2); assert.strictEqual(C.jumpedSquare(b, 4, 3, 2, 1, b[4][3]), null); b[4][3] = P(1, true); assert.deepStrictEqual(C.jumpedSquare(b, 4, 3, 2, 1, b[4][3]), { row: 3, col: 2 }); });
T("checkers: hasJump sees a second jump in a chain", () => { const b = empty(); b[4][3] = P(1); b[5][4] = P(2); b[7][6] = null; assert.ok(C.hasJump(b, 4, 3, b[4][3])); b[5][4] = null; assert.ok(!C.hasJump(b, 4, 3, b[4][3])); });
T("checkers: the opening position has moves for both sides", () => { const b = empty(); for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 1) b[r][c] = P(1); for (let r = 5; r < 8; r++) for (let c = 0; c < 8; c++) if ((r + c) % 2 === 1) b[r][c] = P(2); assert.ok(C.hasAnyMove(b, 1)); assert.ok(C.hasAnyMove(b, 2)); });
T("checkers: a blocked player has no move", () => { const b = empty(); b[0][1] = P(1); b[1][0] = P(2); b[1][2] = P(2); b[2][3] = P(2); b[2][1] = P(2); assert.ok(!C.hasAnyMove(b, 1)); });

const K = helpers("ChessGame.js", ["isPathClear"]);
const cb = () => Array.from({ length: 8 }, () => Array(8).fill(null));
T("chess: a rook cannot slide through a piece", () => { const b = cb(); b[7][0] = "♖"; b[6][0] = "♙"; assert.ok(!K.isPathClear(b, 7, 0, 3, 0)); assert.ok(K.isPathClear(b, 7, 0, 7, 5)); });
T("chess: a bishop cannot jump along the diagonal", () => { const b = cb(); b[7][2] = "♗"; b[6][3] = "♙"; assert.ok(!K.isPathClear(b, 7, 2, 4, 5)); assert.ok(K.isPathClear(b, 7, 2, 6, 3)); });
T("chess: the target square itself does not block (it may be a capture)", () => { const b = cb(); b[0][0] = "♜"; b[0][4] = "♟"; assert.ok(K.isPathClear(b, 0, 0, 0, 4)); });
console.log(out.join("\n")); process.exit(out.some((l) => l.startsWith("FAIL")) ? 1 : 0);
