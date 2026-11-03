/* Checks for geometry.js:  node check.js */
const assert = require("assert");
const G = require("./geometry.js");
const tests = []; const test = (name, fn) => tests.push([name, fn]);
const prng = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(a), Math.abs(b));
const nearM = (A, B, e = 1e-9) => A.every((r, i) => r.every((v, j) => near(v, B[i][j], e)));
const key = (p) => p[0] + "," + p[1];

test("triangle area three ways agree, and a 3-4-5 triangle has area 6 with a right angle", () => {
  const g = prng(1);
  for (let i = 0; i < 300; i++) {
    const [a, b, c] = [0, 1, 2].map(() => [g() * 20 - 10, g() * 20 - 10]);
    if (G.triArea(a, b, c) < 1e-3) continue;
    assert.ok(near(G.triArea(a, b, c), G.heron(a, b, c), 1e-6)); assert.ok(near(G.triArea(a, b, c), Math.abs(G.polyArea([a, b, c])), 1e-9));
    assert.ok(near(G.angleAt(b, a, c) + G.angleAt(a, b, c) + G.angleAt(a, c, b), Math.PI, 1e-9), "angles add to 180 degrees");
  }
  const t = [[0, 0], [4, 0], [0, 3]]; assert.strictEqual(G.triArea(...t), 6); assert.strictEqual(G.dist([4, 0], [0, 3]), 5); assert.ok(near(G.angleAt([4, 0], [0, 0], [0, 3]), Math.PI / 2));
  assert.ok(G.polyArea([[0, 0], [4, 0], [0, 3]]) > 0 && G.polyArea([[0, 0], [0, 3], [4, 0]]) < 0, "anticlockwise is positive");
});
test("orientation: in a line is zero, and swapping two points flips the sign", () => {
  assert.strictEqual(G.orient([0, 0], [1, 1], [2, 2]), 0); assert.ok(G.orient([0, 0], [1, 0], [0, 1]) > 0); assert.ok(G.orient([0, 0], [0, 1], [1, 0]) < 0);
  const g = prng(2); for (let i = 0; i < 100; i++) { const [a, b, c] = [0, 1, 2].map(() => [g(), g()]); assert.ok(near(G.orient(a, b, c), -G.orient(a, c, b))); }
});
test("segment intersection matches an exact reference on small integer segments, including touching and overlapping ones", () => {
  const ref = (p, p2, q, q2) => {
    const r = G.sub(p2, p), s = G.sub(q2, q), qp = G.sub(q, p), d = G.cross(r, s), tn = G.cross(qp, s), un = G.cross(qp, r);
    if (d !== 0) { const ok = (n) => (d > 0 ? n >= 0 && n <= d : n <= 0 && n >= d); return ok(tn) && ok(un); }
    if (un !== 0) return false;
    const rr = G.dot(r, r), t0 = G.dot(qp, r) / rr, t1 = t0 + G.dot(s, r) / rr; return Math.max(0, Math.min(t0, t1)) <= Math.min(1, Math.max(t0, t1));
  };
  const g = prng(3), pt = () => [Math.floor(g() * 7), Math.floor(g() * 7)]; let hits = 0, total = 0;
  while (total < 4000) {
    const [a, b, c, d] = [pt(), pt(), pt(), pt()]; if (key(a) === key(b) || key(c) === key(d)) continue;
    total++; const r = G.segmentIntersect(a, b, c, d); assert.strictEqual(r.hit, ref(a, b, c, d), JSON.stringify([a, b, c, d])); if (r.hit) hits++;
    if (r.point) { assert.ok(near(G.orient(a, b, r.point), 0, 1e-9) && near(G.orient(c, d, r.point), 0, 1e-9), "the point lies on both lines"); }
  }
  assert.ok(hits > 600 && hits < 3400, "the sample has both hits and misses: " + hits);
  assert.deepStrictEqual(G.segmentIntersect([0, 0], [4, 4], [0, 4], [4, 0]).point, [2, 2]);
  assert.ok(G.segmentIntersect([0, 0], [2, 0], [2, 0], [4, 0]).hit, "end to end in a line touches");
  assert.ok(!G.segmentIntersect([0, 0], [1, 0], [2, 0], [3, 0]).hit, "in a line but apart misses");
});
function starPolygon(g, n) { /* one vertex in each 1/n of the turn, so every angular gap is under 180 degrees and the polygon is simple */ const angles = Array.from({ length: n }, (_, i) => ((i + g() * 0.9) / n) * 2 * Math.PI); return angles.map((t) => { const r = 2 + g() * 6; return [r * Math.cos(t), r * Math.sin(t)]; }); }
test("point in polygon: ray casting and the winding number agree on star-shaped polygons, and the inside fraction matches the shoelace area", () => {
  const g = prng(4);
  for (let k = 0; k < 40; k++) {
    const poly = starPolygon(g, 5 + (k % 8)), xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    if (Math.abs(G.polyArea(poly)) < 5) continue;
    let inside = 0; const N = 6000;
    for (let i = 0; i < N; i++) { const p = [x0 + g() * (x1 - x0), y0 + g() * (y1 - y0)], r = G.pointInPolygon(p, poly); assert.strictEqual(r.ray, r.windingInside, "methods disagree"); if (r.ray) inside++; }
    const est = (inside / N) * (x1 - x0) * (y1 - y0), area = Math.abs(G.polyArea(poly)); assert.ok(Math.abs(est - area) < 0.06 * (x1 - x0) * (y1 - y0), `area ${area} vs sampled ${est}`);
  }
  const sq = [[0, 0], [4, 0], [4, 4], [0, 4]]; assert.ok(G.pointInPolygon([2, 2], sq).ray && !G.pointInPolygon([5, 2], sq).ray && G.pointInPolygon([4, 2], sq).onEdge);
  assert.strictEqual(G.pointInPolygon([2, 2], sq).crossings, 1); assert.strictEqual(G.pointInPolygon([-1, 2], sq).crossings, 2);
});
test("winding number counts turns: a point inside a figure-of-eight loop run twice has winding 2", () => {
  const tri = [[0, 0], [10, 0], [5, 8]]; const twice = tri.concat(tri); assert.strictEqual(G.pointInPolygon([5, 3], twice).winding, 2); assert.strictEqual(G.pointInPolygon([5, 3], tri.slice().reverse()).winding, -1);
});
test("convex hull equals the slow check on small integer sets (with duplicates and points in a line), and is convex and encloses every point", () => {
  const g = prng(5);
  for (let k = 0; k < 600; k++) {
    const n = 3 + Math.floor(g() * 8), pts = Array.from({ length: n }, () => [Math.floor(g() * 6), Math.floor(g() * 6)]);
    const hull = G.convexHull(pts), brute = G.hullBrute(pts), a = hull.map(key).sort().join(" "), b = brute.map(key).sort().join(" ");
    const distinct = new Set(pts.map(key)).size;
    if (distinct >= 3 && pts.some((p) => G.orient(pts[0], pts.find((q) => key(q) !== key(pts[0])), p) !== 0)) {
      assert.strictEqual(a, b, JSON.stringify(pts));
      for (let i = 0; i < hull.length; i++) { assert.ok(G.orient(hull[i], hull[(i + 1) % hull.length], hull[(i + 2) % hull.length]) > 0, "every turn is anticlockwise"); for (const p of pts) assert.ok(G.orient(hull[i], hull[(i + 1) % hull.length], p) >= 0, "all points are on the inner side of every edge"); }
    }
  }
  assert.deepStrictEqual(G.convexHull([[0, 0], [2, 0], [4, 0]]).map(key).sort(), ["0,0", "4,0"]);
});
test("hull area is at least the area of any triangle of the points and the hull of a polygon's corners has no smaller area than the polygon", () => {
  const g = prng(6);
  for (let k = 0; k < 100; k++) {
    const poly = starPolygon(g, 6 + (k % 6)), hull = G.convexHull(poly), A = G.polyArea(hull);
    assert.ok(A >= Math.abs(G.polyArea(poly)) - 1e-9); for (let i = 0; i < poly.length; i++) assert.ok(A >= G.triArea(poly[i], poly[(i + 3) % poly.length], poly[(i + 5) % poly.length]) - 1e-9);
    assert.ok(G.perimeter(hull) <= G.perimeter(poly) + 1e-9, "the hull is the shortest closed loop round the points");
  }
});
test("2D matrices: the determinant is the area scale, rotation undoes itself, and order matters", () => {
  const sq = [[0, 0], [1, 0], [1, 1], [0, 1]], g = prng(7);
  for (let i = 0; i < 100; i++) {
    const M = G.mat.mul(G.mat.rotation(g() * 6), G.mat.mul(G.mat.scale(0.5 + g() * 3, 0.5 + g() * 3), G.mat.shear(g() * 2 - 1))), area = G.polyArea(sq.map((p) => G.mat.apply(M, p)));
    assert.ok(near(area, G.mat.det(M), 1e-9) && near(G.mat.det(M), area));
  }
  assert.ok(nearM(G.mat.mul(G.mat.rotation(0.7), G.mat.rotation(-0.7)), G.mat.identity()));
  assert.ok(nearM(G.mat.mul(G.mat.rotation(0.3), G.mat.rotation(0.4)), G.mat.rotation(0.7)), "rotations add");
  assert.ok(!nearM(G.mat.mul(G.mat.rotation(0.5), G.mat.scale(2, 1)), G.mat.mul(G.mat.scale(2, 1), G.mat.rotation(0.5))), "rotate-then-scale differs from scale-then-rotate");
  assert.ok(nearM(G.mat.mul(G.mat.rotation(0.5), G.mat.scale(2, 2)), G.mat.mul(G.mat.scale(2, 2), G.mat.rotation(0.5))), "an even scale does commute with rotation");
  const p = G.mat.apply(G.mat.rotation(Math.PI / 2), [1, 0]); assert.ok(near(p[0], 0, 1e-12) && near(p[1], 1));
});
test("3D rotations: orthonormal with determinant 1, the axis-angle matrix equals the quaternion matrix, and a turn about Z equals rotZ", () => {
  const g = prng(8);
  for (let i = 0; i < 100; i++) {
    const R = G.euler(g() * 6, g() * 6, g() * 6), I = G.m3.mul(R, G.m3.transpose(R)); assert.ok(near(G.m3.det(R), 1, 1e-9)); assert.ok(nearM(I, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 1e-9));
    const axis = [g() - 0.5, g() - 0.5, g() - 0.5 + 0.3], t = g() * 6; assert.ok(nearM(G.axisAngle(axis, t), G.quatToMatrix(G.quatFromAxisAngle(axis, t)), 1e-9), "Rodrigues = quaternion");
    const p = [g(), g(), g()], q = G.m3.apply(R, p); assert.ok(near(Math.hypot(...p), Math.hypot(...q)), "rotation keeps length");
  }
  assert.ok(nearM(G.axisAngle([0, 0, 1], 0.9), G.rotZ(0.9))); assert.ok(nearM(G.axisAngle([1, 0, 0], 0.9), G.rotX(0.9))); assert.ok(nearM(G.axisAngle([0, 5, 0], 0.9), G.rotY(0.9)));
  assert.ok(!nearM(G.m3.mul(G.rotX(0.5), G.rotY(0.5)), G.m3.mul(G.rotY(0.5), G.rotX(0.5))), "3D rotations do not commute");
  const q = G.quatFromAxisAngle([0, 0, 1], Math.PI / 2); assert.ok(near(q[0], Math.SQRT1_2) && near(q[3], Math.SQRT1_2));
});
test("pinhole camera: the plain formula equals the matrix form, moving along a ray keeps the pixel, and doubling the focal length doubles the offset", () => {
  const g = prng(9);
  for (let i = 0; i < 200; i++) {
    const R = G.euler(g() - 0.5, g() - 0.5, g() - 0.5), t = [g() - 0.5, g() - 0.5, -(4 + g() * 3)], P = [g() * 2 - 1, g() * 2 - 1, g() * 2 - 1], f = 300 + g() * 500;
    const a = G.project(P, R, t, f, 320, 240), b = G.projectMatrix(P, R, t, f, 320, 240);
    assert.ok(a.visible); assert.ok(near(a.u, b.u, 1e-9) && near(a.v, b.v, 1e-9)); assert.ok(near(b.w, a.depth)); const a2 = G.project(P, R, t, 2 * f, 320, 240); assert.ok(near(a2.u - 320, 2 * (a.u - 320), 1e-9) && near(a2.v - 240, 2 * (a.v - 240), 1e-9));
  }
  const I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]], z = [0, 0, 0];
  for (const k of [1, 2, 7.5]) { const r = G.project([0.3 * k, -0.2 * k, -2 * k], I, z, 500, 320, 240); assert.ok(near(r.u, 320 + 500 * 0.15, 1e-9) && near(r.v, 240 + 500 * 0.1, 1e-9), "same pixel along a ray"); }
  assert.ok(!G.project([0, 0, 1], I, z, 500, 320, 240).visible, "behind the camera is not seen"); assert.ok(!G.project([0, 0, 0], I, z, 500, 320, 240).visible);
  const near1 = G.project([1, 0, -2], I, z, 500, 320, 240), far = G.project([1, 0, -4], I, z, 500, 320, 240); assert.ok(near1.u - 320 === 2 * (far.u - 320), "twice as far looks half as big");
  const up = G.project([0, 1, -2], I, z, 500, 320, 240); assert.ok(up.v < 240, "up in the world is up in the image (smaller v)"); const right = G.project([1, 0, -2], I, z, 500, 320, 240); assert.ok(right.u > 320, "right is right");
});
test("homography: four pairs fix it exactly, it recovers a known matrix, it ignores overall scale and has an inverse", () => {
  const g = prng(10);
  for (let i = 0; i < 300; i++) {
    const H0 = [[1 + g() * 0.6, g() * 0.4 - 0.2, g() * 40 - 20], [g() * 0.4 - 0.2, 1 + g() * 0.6, g() * 40 - 20], [g() * 0.004 - 0.002, g() * 0.004 - 0.002, 1]];
    const src = [0, 1, 2, 3].map(() => [g() * 100, g() * 100]); if (src.some((_, k) => G.triArea(src[k], src[(k + 1) % 4], src[(k + 2) % 4]) < 200)) continue;
    const dst = src.map((p) => G.applyH(H0, p)), H = G.homography(src, dst); assert.ok(H);
    src.forEach((p, k) => { const q = G.applyH(H, p); assert.ok(near(q[0], dst[k][0], 1e-7) && near(q[1], dst[k][1], 1e-7)); });
    assert.ok(nearM(H, H0, 1e-6), "recovers the matrix that made the points");
    const x = [g() * 100, g() * 100], a = G.applyH(H, x), b = G.applyH(H0, x); assert.ok(near(a[0], b[0], 1e-6) && near(a[1], b[1], 1e-6), "and agrees on other points");
    const k = 3.7, Hk = H.map((r) => r.map((v) => v * k)), c = G.applyH(Hk, x); assert.ok(near(c[0], a[0], 1e-9) && near(c[1], a[1], 1e-9), "scaling all nine entries changes nothing");
    assert.ok(nearM(G.m3.mul(H, G.inv3(H)), [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 1e-8));
  }
  assert.strictEqual(G.homography([[0, 0], [1, 1], [2, 2], [5, 0]], [[0, 0], [1, 0], [2, 0], [3, 1]]), null, "three points in a line have no unique homography");
  const pure = G.homography([[0, 0], [1, 0], [1, 1], [0, 1]], [[2, 3], [4, 3], [4, 5], [2, 5]]); assert.ok(nearM(pure, [[2, 0, 2], [0, 2, 3], [0, 0, 1]]), "a stretch and a shift is a homography with a bottom row of 0 0 1");
});
test("pose from a homography: the camera pose used to draw a square marker is recovered, and a random quadrilateral is flagged as not a view of a square", () => {
  const g = prng(11), M = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  for (let i = 0; i < 200; i++) {
    const R = G.euler((g() - 0.5) * 1.6, (g() - 0.5) * 1.6, (g() - 0.5) * 6), t = [g() * 1.5 - 0.75, g() * 1.5 - 0.75, -(3 + g() * 6)], f = 300 + g() * 500, cx = 320, cy = 240;
    const px = M.map((p) => { const r = G.project([p[0], p[1], 0], R, t, f, cx, cy); assert.ok(r.visible); return [r.u, r.v]; });
    const H = G.homography(M, px); if (!H) continue; const pose = G.poseFromHomography(H, f, cx, cy);
    if (R[2][2] < 0.12) continue;   /* a marker seen almost edge-on is badly conditioned */
    assert.ok(nearM(pose.R, R, 1e-5), "rotation recovered"); pose.t.forEach((v, k) => assert.ok(near(v, t[k], 1e-5), "translation recovered")); assert.ok(pose.orthoError < 1e-8, "a true view has no orthonormality error");
    assert.ok(near(G.m3.det(pose.R), 1, 1e-9) && pose.t[2] < 0);
    const back = M.map((p) => G.project([p[0], p[1], 0], pose.R, pose.t, f, cx, cy)); back.forEach((q, k) => assert.ok(near(q.u, px[k][0], 1e-5) && near(q.v, px[k][1], 1e-5)));
  }
  let flagged = 0, total = 0; for (let i = 0; i < 100; i++) { const quad = [0, 1, 2, 3].map((k) => [200 + (k % 3 === 0 ? -1 : 1) * (20 + g() * 100), 150 + (k < 2 ? -1 : 1) * (20 + g() * 100)]); const H = G.homography(M, quad); if (!H) continue; total++; if (G.poseFromHomography(H, 500, 320, 240).orthoError > 0.15) flagged++; }
  assert.ok(flagged > 0.8 * total, `${flagged} of ${total} arbitrary quadrilaterals flagged`);
  const R = G.euler(0.4, -0.3, 0.2), t = [0.2, 0.1, -6], f = 450, px = M.map((p) => { const r = G.project([p[0], p[1], 0], R, t, f, 320, 240); return [r.u, r.v]; });
  const a = G.poseFromHomography(G.homography(M, px), f, 320, 240), noisy = G.poseFromHomography(G.homography(M, px.map(([u, v], k) => [u + (k % 2 ? 1 : -1) * 0.8, v + (k < 2 ? 0.8 : -0.8)])), f, 320, 240);
  assert.ok(a.orthoError < 1e-9 && noisy.orthoError > 1e-6 && noisy.orthoError < 0.15, "a little pixel noise gives a small non-zero error: " + noisy.orthoError); assert.ok(Math.abs(noisy.t[2] - t[2]) < 0.3);
});

let failed = 0; for (const [name, fn] of tests) { try { fn(); } catch (e) { failed++; console.log("FAIL", name, "\n   ", e.message.slice(0, 300)); } }
console.log(`${tests.length - failed} of ${tests.length} checks passed`); process.exit(failed ? 1 : 0);
