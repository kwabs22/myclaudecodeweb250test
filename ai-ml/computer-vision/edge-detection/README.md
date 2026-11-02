# Edge detection

An edge is a place where brightness changes quickly. Every method here measures how steeply brightness rises at each pixel, then decides which pixels count as edges.

- **[Try it in the browser](./index.html)**: Sobel, Prewitt, Scharr, Roberts cross, Laplacian and Canny on a sample, an uploaded image or a camera snapshot. Click a pixel to see the weighted sums for that spot.
- [`edges.js`](./edges.js): the methods in plain loops (no libraries), written to be read.
- [`check.js`](./check.js): `node check.js` runs 12 checks (kernels, a hand-padded reference, known step and ramp responses, Canny outline of a square).

## The idea in four steps

1. **Grey.** Edges are about brightness, so each pixel becomes `0.299 R + 0.587 G + 0.114 B`.
2. **Blur a little.** Noise looks like tiny edges everywhere. A Gaussian blur averages it away, at the cost of softening real edges.
3. **Measure the slope.** One kernel measures change left to right (Gx), another top to bottom (Gy). Strength is `sqrt(Gx² + Gy²)` and direction is `atan2(Gy, Gx)`.
4. **Decide what counts.** A threshold keeps strong pixels. Canny also thins ridges to one pixel and keeps weak edges only if they touch strong ones.

## The kernels

```
Sobel Gx           Prewitt Gx        Scharr Gx           Roberts (2x2)
-1  0  1           -1  0  1          -3   0   3          Gx:  1  0    Gy:  0  1
-2  0  2           -1  0  1         -10   0  10               0 -1         -1  0
-1  0  1           -1  0  1          -3   0   3
```

Gy is each Gx turned on its side. Every kernel sums to zero, so a flat region gives no response. Sobel is a column `[1, 2, 1]` (smooth along the edge) times a row `[-1, 0, 1]` (difference across it), which is why it resists noise better than a plain difference. A step of height `h` gives a response of `4h` (Sobel), `3h` (Prewitt) and `16h` (Scharr), so divide by those to compare methods; the page does.

## Comparison

| Method | Kernel | Good at | Weak at |
|---|---|---|---|
| Roberts cross | 2×2 | Speed, fine detail | Noise |
| Prewitt | 3×3 | Simple, even smoothing | Diagonal accuracy |
| Sobel | 3×3 | The standard first choice | Thick edges that need a threshold |
| Scharr | 3×3 | More accurate direction | Slightly more noise-sensitive |
| Laplacian | 3×3 | All directions at once (zero crossings of the second difference) | Very noisy without blurring, no direction |
| Canny | blur + Sobel | Thin, connected outlines | Three settings to tune |

## The same thing with OpenCV

```python
import cv2

img = cv2.imread("photo.jpg", cv2.IMREAD_GRAYSCALE)
img = cv2.GaussianBlur(img, (5, 5), 1.0)

gx = cv2.Sobel(img, cv2.CV_32F, 1, 0, ksize=3)       # change left to right
gy = cv2.Sobel(img, cv2.CV_32F, 0, 1, ksize=3)       # change top to bottom
magnitude = cv2.magnitude(gx, gy)
angle = cv2.phase(gx, gy, angleInDegrees=True)

scharr = cv2.Scharr(img, cv2.CV_32F, 1, 0)           # ksize=-1 in Sobel does the same
laplace = cv2.Laplacian(img, cv2.CV_32F)
canny = cv2.Canny(img, 50, 150)                      # low and high thresholds, on a 0-255 scale
```

Use a float output type (`CV_32F`). With the default 8-bit output, negative slopes are clipped to zero and half the edges disappear.

## Where this connects

- Convolution layers in a neural network are the same sliding sum, with kernels that are learned instead of chosen. After training, first-layer filters often look like oriented edge detectors.
- The ArUco marker detection used in the AR examples looks for square outlines, which starts from edges like these.
