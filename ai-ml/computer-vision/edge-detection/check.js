/* Checks for edges.js:  node check.js */
const assert = require("assert");
const E = require("./edges.js");
const tests = []; const test = (name, fn) => tests.push([name, fn]);
const prng = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
const make = (w, h, f) => { const d = new Float32Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) d[y * w + x] = f(x, y); return { w, h, d }; };
const near = (a, b, e = 1e-4) => Math.abs(a - b) <= e * Math.max(1, Math.abs(a), Math.abs(b));

test("each method gives the textbook kernels, and Sobel is a smoothing column times a difference row", () => {
  assert.deepStrictEqual(E.KERNELS.sobel.gx, [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]);
  assert.deepStrictEqual(E.KERNELS.prewitt.gx, [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]]);
  assert.deepStrictEqual(E.KERNELS.scharr.gx, [[-3, 0, 3], [-10, 0, 10], [-3, 0, 3]]);
  for (const m of ["sobel", "prewitt", "scharr"]) {                       /* gy is gx turned on its side */
    const k = E.KERNELS[m]; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) assert.strictEqual(k.gy[j][i], k.gx[i][j], m);
  }
  const smooth = [1, 2, 1], diff = [-1, 0, 1]; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) assert.strictEqual(E.KERNELS.sobel.gx[j][i], smooth[j] * diff[i]);
  const s = [3, 10, 3]; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) assert.strictEqual(E.KERNELS.scharr.gx[j][i], s[j] * diff[i]);
  for (const m of Object.keys(E.KERNELS)) { const k = E.KERNELS[m]; assert.strictEqual(k.gx.flat().reduce((a, b) => a + b, 0), 0, m + " kernels must sum to zero so flat areas give no edge"); }
});
test("filter matches a plain reference that pads the image by hand", () => {
  const g = prng(7); const img = make(11, 9, () => Math.floor(g() * 256));
  for (const m of ["sobel", "prewitt", "scharr", "roberts"]) {
    const K = E.KERNELS[m].gx, k = K.length, lo = k === 2 ? 0 : -1, pad = 2, W = img.w + 2 * pad, H = img.h + 2 * pad, P = [];
    for (let y = 0; y < H; y++) { P.push([]); for (let x = 0; x < W; x++) P[y].push(img.d[Math.min(img.h - 1, Math.max(0, y - pad)) * img.w + Math.min(img.w - 1, Math.max(0, x - pad))]); }
    const out = E.filter(img, K);
    for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) { let s = 0; for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) s += K[j][i] * P[y + pad + lo + j][x + pad + lo + i]; assert.ok(near(out.d[y * img.w + x], s), `${m} ${x},${y}`); }
  }
});
test("a flat image has no edges for any method", () => {
  const img = make(8, 8, () => 90);
  for (const m of Object.keys(E.KERNELS)) { const g = E.gradient(img, m); assert.ok(g.mag.every((v) => v === 0), m); }
  assert.ok(E.laplacianEdges(img, 1).edges.every((v) => v === 0)); assert.ok(E.canny(img, 1, 5, 15).edges.every((v) => v === 0));
});
test("a step of height h gives the known response: Sobel 4h, Prewitt 3h, Scharr 16h, Roberts h", () => {
  const h = 50, img = make(10, 10, (x) => (x < 5 ? 0 : h)), want = { sobel: 4 * h, prewitt: 3 * h, scharr: 16 * h, roberts: h };
  for (const m of Object.keys(want)) {
    const g = E.gradient(img, m), x = m === "roberts" ? 4 : 4;                       /* the pixel just left of the step (Roberts anchors on the top-left) */
    const x2 = m === "roberts" ? 4 : 5; let seen = 0;
    for (const xx of [x, x2]) for (let y = 2; y < 8; y++) seen = Math.max(seen, Math.abs(g.gx[y * 10 + xx]));
    assert.ok(near(seen, want[m]), m + " " + seen);
    for (let y = 2; y < 8; y++) assert.ok(Math.abs(g.gy[y * 10 + 2]) < 1e-3 && Math.abs(g.gy[y * 10 + 7]) < 1e-3, m + " gy is zero away from the step");
  }
});
test("on a ramp every method, once divided by its scale, reports the same slope", () => {
  const a = 3, img = make(12, 12, (x) => a * x);
  for (const m of ["sobel", "prewitt", "scharr"]) { const g = E.gradient(img, m); for (let y = 2; y < 10; y++) for (let x = 2; x < 10; x++) assert.ok(near(g.gx[y * 12 + x] / g.scale, 2 * a), m); }
});
test("turning the image on its side swaps the x and y responses", () => {
  const g = prng(3), img = make(9, 9, () => Math.floor(g() * 256)), T = make(9, 9, (x, y) => img.d[x * 9 + y]);
  for (const m of ["sobel", "prewitt", "scharr"]) { const a = E.gradient(img, m), b = E.gradient(T, m); for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) { assert.ok(near(a.gx[y * 9 + x], b.gy[x * 9 + y]), m); assert.ok(near(a.mag[y * 9 + x], b.mag[x * 9 + y]), m); } }
});
test("direction points across the edge", () => {
  const g = E.gradient(make(10, 10, (x) => (x < 5 ? 0 : 100)), "sobel"), i = 5 * 10 + 5;
  assert.ok(near(g.dir[i], 0), "brighter to the right means direction 0");
  const g2 = E.gradient(make(10, 10, (x, y) => (y < 5 ? 0 : 100)), "sobel"); assert.ok(near(g2.dir[5 * 10 + 5], Math.PI / 2));
});
test("Gaussian blur: weights sum to one, a flat image is unchanged and noise shrinks", () => {
  for (const s of [0.5, 1, 2, 3.3]) assert.ok(near(E.gaussianKernel(s).reduce((a, b) => a + b, 0), 1));
  assert.ok(E.blur(make(9, 9, () => 40), 2).d.every((v) => near(v, 40)));
  const g = prng(11), img = make(30, 30, () => Math.floor(g() * 256)), variance = (im) => { const m = im.d.reduce((a, b) => a + b, 0) / im.d.length; return im.d.reduce((a, b) => a + (b - m) ** 2, 0) / im.d.length; };
  assert.ok(variance(E.blur(img, 1.5)) < variance(img) / 4);
});
test("Laplacian is zero on a ramp and crosses zero at a step", () => {
  const L = E.filter(make(10, 10, (x) => 4 * x), E.LAPLACIAN); for (let y = 2; y < 8; y++) for (let x = 2; x < 8; x++) assert.ok(Math.abs(L.d[y * 10 + x]) < 1e-3);
  const r = E.laplacianEdges(make(12, 12, (x) => (x < 6 ? 0 : 100)), 20).edges; for (let y = 2; y < 10; y++) { const xs = []; for (let x = 0; x < 12; x++) if (r[y * 12 + x]) xs.push(x); assert.ok(xs.length >= 1 && xs.every((x) => x >= 4 && x <= 7), "crossing near the step: " + xs); }
});
test("Canny on a bright square draws a thin closed outline in the right place", () => {
  const img = make(40, 40, (x, y) => (x >= 10 && x < 30 && y >= 10 && y < 30 ? 200 : 20)), r = E.canny(img, 1, 20, 50), w = 40, e = r.edges;
  let count = 0; for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) if (e[y * w + x]) {
    count++; const dx = Math.min(Math.abs(x - 10), Math.abs(x - 30)), dy = Math.min(Math.abs(y - 10), Math.abs(y - 30)), inBox = x >= 8 && x <= 31 && y >= 8 && y <= 31;
    assert.ok(inBox && Math.min(dx, dy) <= 2, `stray edge at ${x},${y}`);
    if (x < 39 && y < 39) assert.ok(!(e[y * w + x + 1] && e[(y + 1) * w + x] && e[(y + 1) * w + x + 1]), "edge is more than one pixel thick at " + x + "," + y);
  }
  assert.ok(count >= 70 && count <= 100, "an outline of about 80 pixels, got " + count);
  for (const [x, y] of [[20, 10], [20, 29], [10, 20], [29, 20]]) { let near1 = false; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (e[(y + j) * w + x + i]) near1 = true; assert.ok(near1, `outline gap at ${x},${y}`); }
});
test("Canny: lowering the thresholds only adds edges, and hysteresis keeps weak edges only when joined to a strong one", () => {
  const g = prng(5), img = make(40, 40, (x, y) => (x + y > 40 ? 160 : 40) + Math.floor(g() * 20)), a = E.canny(img, 1, 20, 60).edges, b = E.canny(img, 1, 10, 30).edges;
  for (let i = 0; i < a.length; i++) if (a[i]) assert.ok(b[i], "edge lost when thresholds were lowered");
  const same = E.canny(img, 1, 40, 40).edges, c = E.canny(img, 1, 5, 40).edges; for (let i = 0; i < same.length; i++) if (same[i]) assert.ok(c[i]);
  const none = E.canny(img, 1, 5, 1e9).edges; assert.ok(none.every((v) => v === 0), "with no strong edge, nothing survives");
});
test("greyscale uses the standard luma weights", () => {
  const g = E.toGrey(new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255]), 4, 1);
  assert.ok(near(g.d[0], 76.245) && near(g.d[1], 149.685) && near(g.d[2], 29.07) && near(g.d[3], 255));
});

let failed = 0; for (const [name, fn] of tests) { try { fn(); } catch (e) { failed++; console.log("FAIL", name, "\n   ", e.message); } }
console.log(`${tests.length - failed} of ${tests.length} checks passed`); process.exit(failed ? 1 : 0);
