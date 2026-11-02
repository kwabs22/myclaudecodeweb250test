/* Edge detection on a greyscale image, written out in plain loops so each step can be read and checked.
   An image is { w, h, d } where d is a Float32Array of w*h values from 0 to 255, row by row. */
(function (root, factory) { if (typeof module === "object" && module.exports) module.exports = factory(); else root.Edges = factory(); })(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* Each method is a pair of kernels, one for change along x (columns) and one along y (rows).
     Sums run over a square window centred on the pixel (the 2x2 Roberts cross is anchored at the top-left pixel). */
  const KERNELS = {
    sobel:   { name: "Sobel",   size: 3, gx: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], gy: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]], scale: 4,
               note: "Smooths across the edge with weights 1-2-1, then takes the difference of the two sides. The centre row counts double." },
    prewitt: { name: "Prewitt", size: 3, gx: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], gy: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]], scale: 3,
               note: "Like Sobel but with equal weights, so it blurs less and reacts more to noise." },
    scharr:  { name: "Scharr",  size: 3, gx: [[-3, 0, 3], [-10, 0, 10], [-3, 0, 3]], gy: [[-3, -10, -3], [0, 0, 0], [3, 10, 3]], scale: 16,
               note: "Weights chosen so the edge direction is estimated more accurately than Sobel on diagonal edges." },
    roberts: { name: "Roberts cross", size: 2, gx: [[1, 0], [0, -1]], gy: [[0, 1], [-1, 0]], scale: 1,
               note: "Two tiny 2x2 kernels along the diagonals. Fast and sharp, but the most sensitive to noise." },
  };
  const LAPLACIAN = [[0, 1, 0], [1, -4, 1], [0, 1, 0]];

  const at = (img, x, y) => img.d[Math.min(img.h - 1, Math.max(0, y)) * img.w + Math.min(img.w - 1, Math.max(0, x))];   /* edges repeat the border pixel */

  function toGrey(rgba, w, h) {
    const d = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) d[i] = 0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2];
    return { w, h, d };
  }

  /* Slide a kernel over the image and add up kernel[j][i] * pixel. (This is correlation; true convolution flips the kernel, which only changes the sign for these kernels.) */
  function filter(img, kernel) {
    const k = kernel.length, lo = k === 2 ? 0 : -1, out = new Float32Array(img.w * img.h);
    for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
      let s = 0;
      for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) s += kernel[j][i] * at(img, x + lo + i, y + lo + j);
      out[y * img.w + x] = s;
    }
    return { w: img.w, h: img.h, d: out };
  }

  function gaussianKernel(sigma) {
    if (sigma <= 0) return [1];
    const r = Math.max(1, Math.ceil(sigma * 3)), k = []; let sum = 0;
    for (let i = -r; i <= r; i++) { const v = Math.exp(-(i * i) / (2 * sigma * sigma)); k.push(v); sum += v; }
    return k.map((v) => v / sum);
  }
  function blur(img, sigma) {
    if (sigma <= 0) return img;
    const k = gaussianKernel(sigma), r = (k.length - 1) / 2, tmp = new Float32Array(img.w * img.h), out = new Float32Array(img.w * img.h);
    for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) { let s = 0; for (let i = -r; i <= r; i++) s += k[i + r] * at(img, x + i, y); tmp[y * img.w + x] = s; }
    const mid = { w: img.w, h: img.h, d: tmp };
    for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) { let s = 0; for (let j = -r; j <= r; j++) s += k[j + r] * at(mid, x, y + j); out[y * img.w + x] = s; }
    return { w: img.w, h: img.h, d: out };
  }

  /* Gradient with a named method: x and y change, strength (magnitude) and direction (angle of the steepest rise, radians). */
  function gradient(img, method) {
    const K = KERNELS[method], gx = filter(img, K.gx), gy = filter(img, K.gy), n = img.w * img.h, mag = new Float32Array(n), dir = new Float32Array(n);
    for (let i = 0; i < n; i++) { mag[i] = Math.hypot(gx.d[i], gy.d[i]); dir[i] = Math.atan2(gy.d[i], gx.d[i]); }
    return { w: img.w, h: img.h, gx: gx.d, gy: gy.d, mag, dir, scale: K.scale };
  }

  /* Edge map from a gradient: pixels whose strength (per unit of brightness change) reaches the threshold. */
  function thresholdEdges(g, threshold) {
    const out = new Uint8Array(g.w * g.h);
    for (let i = 0; i < out.length; i++) out[i] = g.mag[i] / g.scale >= threshold ? 255 : 0;
    return out;
  }

  /* Laplacian: the second difference. Edges sit where it changes sign (zero crossings), so the map marks those where the jump is large enough. */
  function laplacianEdges(img, threshold) {
    const L = filter(img, LAPLACIAN), out = new Uint8Array(img.w * img.h), v = (x, y) => L.d[Math.min(img.h - 1, Math.max(0, y)) * img.w + Math.min(img.w - 1, Math.max(0, x))];
    for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
      const c = v(x, y);
      for (const [dx, dy] of [[1, 0], [0, 1]]) { const o = v(x + dx, y + dy); if (c * o < 0 && Math.abs(c - o) >= threshold) { out[y * img.w + x] = 255; break; } }
    }
    return { edges: out, response: L.d };
  }

  /* Canny: blur, Sobel gradient, thin the ridges to one pixel (non-maximum suppression), then keep strong edges plus the weak ones joined to them (hysteresis). */
  function canny(img, sigma, low, high) {
    const g = gradient(blur(img, sigma), "sobel"), { w, h } = g, mag = new Float32Array(w * h), thin = new Float32Array(w * h);
    for (let i = 0; i < mag.length; i++) mag[i] = g.mag[i] / g.scale;
    const m = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : mag[y * w + x]);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let a = Math.atan2(g.gy[y * w + x], g.gx[y * w + x]) * 180 / Math.PI; if (a < 0) a += 180;       /* direction across the edge, folded to 0..180 */
      let dx, dy; if (a < 22.5 || a >= 157.5) { dx = 1; dy = 0; } else if (a < 67.5) { dx = 1; dy = 1; } else if (a < 112.5) { dx = 0; dy = 1; } else { dx = -1; dy = 1; }
      const c = mag[y * w + x];
      if (c >= m(x + dx, y + dy) && c >= m(x - dx, y - dy)) thin[y * w + x] = c;
    }
    const out = new Uint8Array(w * h), stack = [];
    for (let i = 0; i < out.length; i++) if (thin[i] >= high) { out[i] = 255; stack.push(i); }
    while (stack.length) {
      const i = stack.pop(), x = i % w, y = (i - x) / w;
      for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
        const nx = x + k, ny = y + j; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx; if (!out[n] && thin[n] >= low) { out[n] = 255; stack.push(n); }
      }
    }
    return { edges: out, thin, mag, gx: g.gx, gy: g.gy };
  }

  return { KERNELS, LAPLACIAN, toGrey, filter, blur, gaussianKernel, gradient, thresholdEdges, laplacianEdges, canny, at };
});
