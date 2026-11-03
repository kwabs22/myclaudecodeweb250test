/* Plane and space geometry in plain functions, so each idea can be read and checked.
   Points are [x, y] (or [x, y, z]); in the plane, y points up unless a function says otherwise. */
(function (root, factory) { if (typeof module === "object" && module.exports) module.exports = factory(); else root.Geo = factory(); })(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0];                          /* the 2D cross product: a number, the signed area of the parallelogram */
  const len = (a) => Math.hypot(a[0], a[1]), dist = (a, b) => len(sub(a, b));
  const orient = (a, b, c) => cross(sub(b, a), sub(c, a));                      /* > 0 anticlockwise, < 0 clockwise, 0 in a line */

  /* Angle at b between the rays to a and c, in radians: atan2 of cross and dot never loses accuracy near 0 or 180 degrees */
  const angleAt = (a, b, c) => { const u = sub(a, b), v = sub(c, b); return Math.atan2(Math.abs(cross(u, v)), dot(u, v)); };

  const triArea = (a, b, c) => Math.abs(orient(a, b, c)) / 2;
  const heron = (a, b, c) => { const x = dist(b, c), y = dist(a, c), z = dist(a, b), s = (x + y + z) / 2; return Math.sqrt(Math.max(0, s * (s - x) * (s - y) * (s - z))); };
  const polyArea = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) s += cross(pts[i], pts[(i + 1) % pts.length]); return s / 2; };   /* shoelace; positive when anticlockwise */
  const perimeter = (pts) => pts.reduce((s, p, i) => s + dist(p, pts[(i + 1) % pts.length]), 0);

  const onSegment = (a, b, p) => orient(a, b, p) === 0 && Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]);

  /* Do segments p1-p2 and p3-p4 meet? Uses only the sign of orient(), then handles the touching and in-a-line cases.
     Returns { hit, point } where point is the single crossing point, or null when they overlap along a line or miss. */
  function segmentIntersect(p1, p2, p3, p4) {
    const d1 = Math.sign(orient(p3, p4, p1)), d2 = Math.sign(orient(p3, p4, p2)), d3 = Math.sign(orient(p1, p2, p3)), d4 = Math.sign(orient(p1, p2, p4));
    let hit = d1 * d2 < 0 && d3 * d4 < 0;
    if (!hit) hit = (d1 === 0 && onSegment(p3, p4, p1)) || (d2 === 0 && onSegment(p3, p4, p2)) || (d3 === 0 && onSegment(p1, p2, p3)) || (d4 === 0 && onSegment(p1, p2, p4));
    let point = null;
    if (hit) { const r = sub(p2, p1), s = sub(p4, p3), den = cross(r, s); if (den !== 0) { const t = cross(sub(p3, p1), s) / den; point = [p1[0] + t * r[0], p1[1] + t * r[1]]; } }
    return { hit, point };
  }

  /* Point in polygon two ways. Ray casting counts how many edges a rightward ray crosses (odd = inside).
     The winding number adds up how many times the polygon goes round the point (non-zero = inside). For simple polygons they agree. */
  function pointInPolygon(p, poly) {
    let crossings = 0, winding = 0, onEdge = false;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      if (onSegment(a, b, p)) onEdge = true;
      if ((a[1] > p[1]) !== (b[1] > p[1])) { const x = a[0] + ((p[1] - a[1]) * (b[0] - a[0])) / (b[1] - a[1]); if (x > p[0]) crossings++; }
      if (a[1] <= p[1]) { if (b[1] > p[1] && orient(a, b, p) > 0) winding++; } else if (b[1] <= p[1] && orient(a, b, p) < 0) winding--;
    }
    return { ray: crossings % 2 === 1, crossings, winding, windingInside: winding !== 0, onEdge };
  }

  /* Convex hull by Andrew's monotone chain: sort left to right, build the lower and upper chains, dropping any point that turns the wrong way. */
  function convexHull(points) {
    const P = points.map((p) => p.slice(0, 2)).sort((a, b) => a[0] - b[0] || a[1] - b[1]).filter((p, i, a) => !i || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
    if (P.length < 3) return P;
    const chain = (list) => { const h = []; for (const p of list) { while (h.length >= 2 && orient(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop(); h.push(p); } h.pop(); return h; };
    return chain(P).concat(chain(P.slice().reverse()));                         /* anticlockwise, no repeated or in-line points */
  }
  /* The slow way, for checking: a point is a corner of the hull unless it lies inside, or on the edge of, a triangle (or segment) made by other points. */
  function hullBrute(points) {
    const P = points.filter((p, i, a) => a.findIndex((q) => q[0] === p[0] && q[1] === p[1]) === i), out = [];
    P.forEach((p, i) => {
      const others = P.filter((_, j) => j !== i); let corner = true;
      for (let a = 0; a < others.length && corner; a++) { for (let b = a + 1; b < others.length && corner; b++) {
        if (onSegment(others[a], others[b], p)) corner = false;
        for (let c = b + 1; c < others.length && corner; c++) {
          const A = others[a], B = others[b], C = others[c], s1 = Math.sign(orient(A, B, p)), s2 = Math.sign(orient(B, C, p)), s3 = Math.sign(orient(C, A, p));
          if (Math.sign(orient(A, B, C)) !== 0 && !(s1 * s2 < 0 || s2 * s3 < 0 || s1 * s3 < 0)) corner = false;
        } } }
      if (corner) out.push(p);
    });
    return out;
  }

  /* 2x2 matrices as [[a, b], [c, d]], acting on column vectors */
  const mat = { identity: () => [[1, 0], [0, 1]], rotation: (t) => [[Math.cos(t), -Math.sin(t)], [Math.sin(t), Math.cos(t)]], scale: (sx, sy) => [[sx, 0], [0, sy]], shear: (k) => [[1, k], [0, 1]],
    mul: (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]],
    apply: (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]], det: (M) => M[0][0] * M[1][1] - M[0][1] * M[1][0] };

  /* 3x3 rotations, written as arrays of rows */
  const m3 = { mul: (A, B) => A.map((r) => [0, 1, 2].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j])), apply: (M, p) => M.map((r) => r[0] * p[0] + r[1] * p[1] + r[2] * p[2]),
    det: (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]), transpose: (M) => [0, 1, 2].map((i) => [0, 1, 2].map((j) => M[j][i])) };
  const rotX = (t) => [[1, 0, 0], [0, Math.cos(t), -Math.sin(t)], [0, Math.sin(t), Math.cos(t)]];
  const rotY = (t) => [[Math.cos(t), 0, Math.sin(t)], [0, 1, 0], [-Math.sin(t), 0, Math.cos(t)]];
  const rotZ = (t) => [[Math.cos(t), -Math.sin(t), 0], [Math.sin(t), Math.cos(t), 0], [0, 0, 1]];
  const euler = (yaw, pitch, roll) => m3.mul(rotY(yaw), m3.mul(rotX(pitch), rotZ(roll)));        /* turn about Y, then X, then Z (applied to the object right to left) */
  function axisAngle(axis, t) {                                                                      /* Rodrigues' rotation formula */
    const n = Math.hypot(...axis), [x, y, z] = axis.map((v) => v / n), c = Math.cos(t), s = Math.sin(t), k = 1 - c;
    return [[c + x * x * k, x * y * k - z * s, x * z * k + y * s], [y * x * k + z * s, c + y * y * k, y * z * k - x * s], [z * x * k - y * s, z * y * k + x * s, c + z * z * k]];
  }
  function quatFromAxisAngle(axis, t) { const n = Math.hypot(...axis), s = Math.sin(t / 2) / n; return [Math.cos(t / 2), axis[0] * s, axis[1] * s, axis[2] * s]; }   /* [w, x, y, z] */
  function quatToMatrix(q) { const [w, x, y, z] = q; return [[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)], [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)], [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]]; }

  /* Pinhole camera at the origin looking down -Z (the OpenGL and three.js convention: X right, Y up, Z towards you).
     A point at depth d = -Z in front of the camera lands at u = f X / d + cx, v = cy - f Y / d (pixels, v counted downwards). Points with d <= 0 are behind the camera and not seen. */
  function project(P, R, t, f, cx, cy) {
    const C = m3.apply(R, P).map((v, i) => v + t[i]), d = -C[2], visible = d > 1e-9;
    return { cam: C, depth: d, visible, u: visible ? (f * C[0]) / d + cx : NaN, v: visible ? cy - (f * C[1]) / d : NaN };
  }
  /* The same thing as one matrix product followed by a division, written the way camera textbooks do */
  function projectMatrix(P, R, t, f, cx, cy) {
    const K = [[f, 0, -cx], [0, -f, -cy], [0, 0, -1]], Rt = [0, 1, 2].map((i) => [R[i][0], R[i][1], R[i][2], t[i]]), h = [P[0], P[1], P[2], 1];
    const c = Rt.map((r) => r[0] * h[0] + r[1] * h[1] + r[2] * h[2] + r[3] * h[3]), s = K.map((r) => r[0] * c[0] + r[1] * c[1] + r[2] * c[2]);
    return { u: s[0] / s[2], v: s[1] / s[2], w: s[2] };
  }

  /* Solve A x = b by Gaussian elimination with partial pivoting; returns null when the system is singular. */
  function solveLinear(A, b) {
    const n = b.length, M = A.map((r, i) => r.concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      if (Math.abs(M[p][c]) < 1e-12) return null;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = 0; r < n; r++) if (r !== c) { const k = M[r][c] / M[c][c]; for (let j = c; j <= n; j++) M[r][j] -= k * M[c][j]; }
    }
    return M.map((r, i) => r[n] / r[i]);
  }
  const inv3 = (M) => {
    const d = m3.det(M); if (Math.abs(d) < 1e-14) return null;
    const c = (i, j) => { const r = [0, 1, 2].filter((x) => x !== i), s = [0, 1, 2].filter((x) => x !== j); return ((i + j) % 2 ? -1 : 1) * (M[r[0]][s[0]] * M[r[1]][s[1]] - M[r[0]][s[1]] * M[r[1]][s[0]]); };
    return [0, 1, 2].map((i) => [0, 1, 2].map((j) => c(j, i) / d));
  };

  /* Homography: the 3x3 matrix H that sends four points of one plane to four points of another, (x, y) -> (u, v) with
     u = (h11 x + h12 y + h13) / (h31 x + h32 y + 1) and v likewise. Each pair gives two equations; eight unknowns need four pairs.
     Returns null if three of the points are in a line (no unique answer). */
  function homography(src, dst) {
    const A = [], b = [];
    for (let i = 0; i < 4; i++) { const [x, y] = src[i], [u, v] = dst[i]; A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); }
    const h = solveLinear(A, b); return h ? [[h[0], h[1], h[2]], [h[3], h[4], h[5]], [h[6], h[7], 1]] : null;
  }
  const applyH = (H, p) => { const w = H[2][0] * p[0] + H[2][1] * p[1] + H[2][2]; return [(H[0][0] * p[0] + H[0][1] * p[1] + H[0][2]) / w, (H[1][0] * p[0] + H[1][1] * p[1] + H[1][2]) / w]; };

  /* Camera pose from a homography of a flat marker (the marker's plane is Z = 0, its corners given as (x, y)).
     For points on that plane the camera maps (X, Y, 1) by K [r1 r2 t], so K^-1 H = scale * [r1 r2 t]. The scale comes from r1 and r2 having length 1.
     Returns the rotation R (columns r1, r2, r3 = r1 x r2), the translation t, and orthoError: how far r1 and r2 were from perpendicular unit vectors
     (zero for a true view of a flat marker with the right focal length). */
  function poseFromHomography(H, f, cx, cy) {
    const Ki = inv3([[f, 0, -cx], [0, -f, -cy], [0, 0, -1]]), M = m3.mul(Ki, H), col = (j) => [M[0][j], M[1][j], M[2][j]];
    const n = (v) => Math.hypot(...v), dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    let c1 = col(0), c2 = col(1), c3 = col(2); const lam0 = 1 / Math.sqrt(n(c1) * n(c2)), sign = c3[2] * lam0 > 0 ? -1 : 1, lam = sign * lam0;   /* the marker must be in front of the camera: t_z < 0 */
    c1 = c1.map((v) => v * lam); c2 = c2.map((v) => v * lam); const t = c3.map((v) => v * lam);
    const orthoError = Math.abs(dot3(c1, c2)) / (n(c1) * n(c2)) + Math.abs(n(c1) - n(c2)) / Math.max(n(c1), n(c2));
    const r1 = c1.map((v) => v / n(c1)); let r2 = c2.map((v, i) => v - dot3(c2, r1) * r1[i]); r2 = r2.map((v) => v / n(r2)); const r3 = cr(r1, r2);
    return { R: [0, 1, 2].map((i) => [r1[i], r2[i], r3[i]]), t, scale: lam, orthoError };
  }

  return { sub, add, dot, cross, len, dist, orient, angleAt, triArea, heron, polyArea, perimeter, onSegment, segmentIntersect, pointInPolygon, convexHull, hullBrute, mat, m3, rotX, rotY, rotZ, euler, axisAngle, quatFromAxisAngle, quatToMatrix, project, projectMatrix, solveLinear, inv3, homography, applyH, poseFromHomography };
});
