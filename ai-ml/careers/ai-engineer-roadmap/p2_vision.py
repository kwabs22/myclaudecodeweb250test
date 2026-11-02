"""Phase 2 questions on image processing and edge detection (links to ../../computer-vision/edge-detection).
Numeric answers come from numpy. When OpenCV is installed, every Sobel, Prewitt-style and Laplacian answer is also
checked against cv2, so the stored answer agrees with the library people actually use."""
import math

import numpy as np

from question_tools import num

DL = "deep_learning"
SUB = "image_processing"

try:
    import cv2
except ImportError:  # the bank still builds; only the second check is skipped
    cv2 = None

SOBEL_X = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
SOBEL_Y = SOBEL_X.T
PREWITT_X = np.array([[-1, 0, 1]] * 3)
SCHARR_X = np.array([[-3, 0, 3], [-10, 0, 10], [-3, 0, 3]])
LAPLACE = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]])


def centre(patch, kernel):
    """The filter response at the middle of a 3x3 patch: sum of kernel x pixel (correlation, as cv2.filter2D does)."""
    return int((patch * kernel).sum())


def cv_centre(patch, kernel):
    if cv2 is None:
        return None
    out = cv2.filter2D(patch.astype(np.float32), cv2.CV_32F, kernel.astype(np.float32), borderType=cv2.BORDER_REPLICATE)
    return int(round(float(out[1, 1])))


def grid(patch):
    return "\n".join(" ".join(f"{v:3d}" for v in row) for row in patch)


def vision(b):
    r = b.rng
    # --- Sobel Gx and Gy on a 3x3 patch
    seen = 0
    while seen < 24:
        patch = np.array([[r.randint(0, 255) for _ in range(3)] for _ in range(3)])
        gx = centre(patch, SOBEL_X)
        assert cv_centre(patch, SOBEL_X) in (None, gx), "numpy and OpenCV disagree"
        wrong = [centre(patch, PREWITT_X), -gx, centre(patch, SOBEL_Y), int(patch[:, 2].sum() - patch[:, 0].sum()) * 2, centre(patch, SCHARR_X)]
        if b.add(DL, SUB, "intermediate", f"For this 3×3 patch of brightness values, what is the Sobel x-response (Gx) at the centre pixel? Use the kernel [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] without flipping it.\n\n{grid(patch)}", gx, wrong,
                 f"Multiply each pixel by its kernel weight and add: Gx = (right column weighted 1-2-1) − (left column weighted 1-2-1) = {gx}."):
            seen += 1
    seen = 0
    while seen < 12:
        patch = np.array([[r.randint(0, 255) for _ in range(3)] for _ in range(3)])
        gy = centre(patch, SOBEL_Y)
        assert cv_centre(patch, SOBEL_Y) in (None, gy)
        wrong = [centre(patch, SOBEL_X), -gy, centre(patch, PREWITT_X.T), int(patch[2].sum() - patch[0].sum()) * 2, centre(patch, SCHARR_X.T)]
        if b.add(DL, SUB, "intermediate", f"For this 3×3 patch, what is the Sobel y-response (Gy) at the centre pixel? Use the kernel [[-1, -2, -1], [0, 0, 0], [1, 2, 1]].\n\n{grid(patch)}", gy, wrong,
                 f"Gy = (bottom row weighted 1-2-1) − (top row weighted 1-2-1) = {gy}. Rows are down the page, so positive means brighter below."):
            seen += 1
    # --- Laplacian
    seen = 0
    while seen < 10:
        patch = np.array([[r.randint(0, 255) for _ in range(3)] for _ in range(3)])
        lap = centre(patch, LAPLACE)
        assert cv_centre(patch, LAPLACE) in (None, lap)
        wrong = [int(patch.sum() - 9 * patch[1, 1]), -lap, int(patch[1].sum() - 3 * patch[1, 1]), centre(patch, SOBEL_X), lap * 2]
        if b.add(DL, SUB, "intermediate", f"What is the response of the Laplacian kernel [[0, 1, 0], [1, -4, 1], [0, 1, 0]] at the centre of this 3×3 patch?\n\n{grid(patch)}", lap, wrong,
                 f"Add the four neighbours up, down, left and right, then subtract four times the centre: {lap}."):
            seen += 1
    # --- strength and direction
    for gx, gy in [(30, -40), (6, 8), (-5, 12), (9, 12), (-8, -15), (20, 21), (0, 25), (-24, 7)]:
        mag = math.hypot(gx, gy)
        b.add(DL, SUB, "beginner", f"A pixel has Gx = {gx} and Gy = {gy}. What is the edge strength √(Gx² + Gy²)?", num(mag), [num(abs(gx) + abs(gy)), num(max(abs(gx), abs(gy))), num(gx + gy), num(mag ** 2), num(abs(gx - gy))],
              f"√({gx}² + {gy}²) = √{gx * gx + gy * gy} = {num(mag)}. Adding the absolute values is a cheaper approximation that overstates it.")
    for gx, gy in [(10, 10), (-10, 10), (10, -10), (0, 5), (-7, 0), (5, 12), (-12, -5), (3, 3 * math.sqrt(3))]:
        ang = math.degrees(math.atan2(gy, gx))
        a = num(ang, 1)
        b.add(DL, SUB, "intermediate", f"A pixel has Gx = {num(gx)} and Gy = {num(gy, 2)}. What is the gradient direction atan2(Gy, Gx), in degrees (to one decimal)?", a,
              [num(math.degrees(math.atan2(gx, gy)), 1), num(math.degrees(math.atan(gy / gx)) if gx else 0.0, 1), num(-ang, 1), num((ang + 180) % 360 - 180 if ang < 0 else ang + 180, 1), num(ang / 2, 1)],
              f"atan2(Gy, Gx) = {a}°. This points to the brighter side, across the edge (the edge itself runs at right angles to it). atan(Gy/Gx) alone cannot tell opposite quadrants apart.")
    # --- step edges
    for lo, hi in [(0, 100), (20, 120), (50, 250), (10, 60), (100, 200), (0, 255)]:
        d = hi - lo
        for name, k, w in [("Sobel", SOBEL_X, 4), ("Prewitt", PREWITT_X, 3), ("Scharr", SCHARR_X, 16)]:
            patch = np.array([[lo, lo, hi]] * 3)
            val = centre(patch, k) // 1
            assert val == w * d
            assert cv_centre(patch, k) in (None, val)
            wrong = [d, 2 * d, 8 * d, 3 * d if w != 3 else 4 * d, 16 * d if w != 16 else 4 * d, d * 2]
            b.add(DL, SUB, "advanced", f"A vertical step edge has brightness {lo} on the left and {hi} on the right, with a flat edge on each side (a 3×3 patch with columns {lo}, {lo}, {hi}). What is the {name} Gx response at the centre?", val, wrong,
                  f"The kernel weights in a column add to {w}, so a step of {d} gives {w} × {d} = {val}.")
    # --- sizes
    for n, k in [(28, 3), (64, 3), (100, 5), (32, 3), (224, 7), (50, 3), (128, 5), (9, 3)]:
        out = n - k + 1
        b.add(DL, SUB, "beginner", f"An {n}×{n} image is filtered with a {k}×{k} kernel and no padding (a 'valid' filter). How wide is the result?", out, [n, n - k, n - k + 2, n - 2 * k, n + k - 1],
              f"The kernel fits in n − k + 1 positions across: {n} − {k} + 1 = {out}. With padding of {(k - 1) // 2} it would stay {n}.")
    for sigma in [0.5, 1, 1.5, 2, 3, 0.8, 2.5, 4]:
        rad = max(1, math.ceil(3 * sigma)); width = 2 * rad + 1
        b.add(DL, SUB, "intermediate", f"A Gaussian blur keeps weights out to 3σ on each side. For σ = {num(sigma)}, how wide is the kernel in pixels (an odd number)?", width, [width - 2, width + 2, int(6 * sigma), 3 * math.ceil(sigma), math.ceil(sigma) * 2 + 1 + 2],
              f"The radius is ⌈3σ⌉ = {rad}, so the width is 2 × {rad} + 1 = {width}. Beyond 3σ the weights are below 1% of the peak.")
    # --- hysteresis on a chain of ridge strengths
    seen = 0
    while seen < 10:
        n = r.randint(8, 11); vals = [r.randint(5, 90) for _ in range(n)]; low, high = r.choice([(20, 60), (25, 70), (30, 50), (15, 55)])
        keep = [v >= high for v in vals]; changed = True
        while changed:
            changed = False
            for i in range(n):
                if not keep[i] and vals[i] >= low and ((i > 0 and keep[i - 1]) or (i < n - 1 and keep[i + 1])):
                    keep[i] = True; changed = True
        k = sum(keep); strong = sum(v >= high for v in vals); both = sum(v >= low for v in vals)
        if strong == 0 or k == both:   # keep only cases where connectivity changes the answer
            continue
        if b.add(DL, SUB, "advanced", f"Canny's hysteresis step looks at a chain of neighbouring edge pixels with strengths {vals}. The low threshold is {low} and the high threshold is {high}. How many pixels are kept as edges? (Weak pixels count only if they connect, through other kept pixels, to a strong one.)", k,
                 [strong, both, k + 1, max(k - 1, 0), n - k], f"Strong pixels (≥ {high}): {strong}. Weak ones (≥ {low}) join them only when connected through kept neighbours. Final count: {k}; plain thresholding at {low} would keep {both}."):
            seen += 1


CONCEPTS = [
    ("beginner", "What does an edge detector respond to?", "Rapid changes in brightness between neighbouring pixels", ["Bright regions", "Large flat areas of one colour", "The total number of pixels"], "Edges are where intensity changes quickly; flat areas, bright or dark, give no response."),
    ("beginner", "Why do edge-detection kernels such as Sobel have entries that add up to zero?", "So a flat region gives zero response", ["So the image gets brighter", "So the kernel can be flipped", "So the output has fewer pixels"], "A flat area has equal pixel values, and weights summing to zero make the weighted sum zero."),
    ("intermediate", "Why is the Sobel x-kernel described as a smoothing column [1, 2, 1] times a difference row [−1, 0, 1]?", "It averages along the edge to resist noise, then takes the difference across it", ["It blurs first and sharpens after", "It adds the image to its edges", "It uses two different images"], "The outer product of the two vectors is exactly the Sobel kernel."),
    ("intermediate", "How does Prewitt differ from Sobel?", "Prewitt weights the three rows equally (1-1-1); Sobel counts the centre row double", ["Prewitt uses 5×5 kernels", "Prewitt finds only diagonal edges", "Prewitt needs no threshold"], "Equal weights blur less along the edge than 1-2-1, and make Prewitt slightly more noise-sensitive."),
    ("intermediate", "Why was the Scharr kernel designed?", "To estimate gradient direction more accurately than Sobel, especially on diagonal edges", ["To detect colour edges", "To run on 1×1 images", "To avoid needing a threshold"], "Its weights (3, 10, 3) give more rotation-consistent results than Sobel's 1-2-1."),
    ("intermediate", "Why blur an image slightly before detecting edges?", "Noise creates many small false edges, and blurring averages them away at the cost of softening real edges", ["Blurring makes edges thicker so they are easier to see", "Blurring removes colour", "Edge detectors cannot read sharp images"], "Derivative filters amplify noise, so smoothing first is a standard trade-off."),
    ("intermediate", "In OpenCV, why compute Sobel with cv2.CV_32F rather than the default 8-bit output?", "Negative slopes would otherwise be clipped to zero, losing the edges that go from bright to dark", ["8-bit output is too slow", "CV_32F is the only type Sobel accepts", "It makes the image brighter"], "A dark-to-bright step gives a positive response and bright-to-dark a negative one; unsigned 8-bit drops the negatives."),
    ("intermediate", "What is the gradient direction at an edge pixel relative to the edge itself?", "It is perpendicular to the edge, pointing toward the brighter side", ["It runs along the edge", "It is always 45 degrees", "It is undefined"], "Brightness changes fastest across an edge, not along it."),
    ("advanced", "What does non-maximum suppression do in Canny edge detection?", "It thins each ridge of strong gradient to one pixel by keeping only the local maximum across the edge", ["It removes all weak edges", "It blurs the gradient", "It merges neighbouring edges"], "Without it, a Sobel edge is several pixels thick."),
    ("advanced", "What is the purpose of the two thresholds in Canny's hysteresis step?", "Strong pixels are kept for certain; weak pixels are kept only if connected to a strong one, which keeps real edges whole and drops isolated noise", ["The low one removes dark pixels and the high one removes bright pixels", "They set the blur size", "They choose between horizontal and vertical edges"], "Hysteresis uses connectivity to separate faint real edges from isolated noise."),
    ("advanced", "Why is the Laplacian more sensitive to noise than the Sobel gradient?", "It is a second difference, which amplifies noise more than a first difference, and it has no built-in smoothing across the edge", ["It uses larger kernels", "It works only on colour images", "It ignores edges"], "Second derivatives magnify high-frequency noise; Laplacian of Gaussian blurs first to compensate."),
    ("advanced", "Where does a Laplacian-based detector place an edge?", "At zero crossings, where the second difference changes sign", ["At the maximum of the second difference", "Wherever the response is positive", "At the minimum of the original image"], "At the steepest point of a step, the first derivative peaks and the second derivative crosses zero."),
    ("intermediate", "How is a Sobel filter related to a convolution layer in a neural network?", "Both slide a small kernel over the image and add weighted neighbours; the network learns its kernels instead of fixing them", ["A network layer cannot use 3×3 kernels", "Sobel uses learned weights", "They work on different data types"], "After training, first-layer filters often look like oriented edge detectors."),
    ("intermediate", "A Sobel edge map and a segmentation mask of the same object differ in what way?", "The edge map marks places where brightness changes, with no notion of which object they belong to; the mask labels every pixel as inside or outside a chosen object", ["They are the same output", "An edge map is always more accurate", "A mask has only boundary pixels"], "Edges are local brightness changes; a segmentation assigns pixels to objects, which needs knowledge beyond local brightness."),
    ("advanced", "What task does SAM 3 (Segment Anything Model 3, released by Meta in November 2025) add compared with SAM and SAM 2?", "Promptable concept segmentation: given a short noun phrase or example image, it finds and segments every instance of that concept", ["Edge detection with a Sobel kernel", "Segmenting only one object per click", "Converting masks to vector drawings"], "SAM and SAM 2 segment one object per visual prompt; SAM 3 takes a concept (for example 'yellow school bus') and returns masks for all matching instances."),
    ("advanced", "Which statement best contrasts classical edge detection with a promptable segmentation model such as SAM 3?", "Edge detection applies a fixed formula to local brightness with no training; the segmentation model is a trained network that returns object masks for a prompt", ["Both are fixed formulas", "Both need a text prompt", "Edge detection returns object names"], "Sobel and Canny have no learned parameters and no notion of objects; SAM-style models learn from data what objects look like."),
]


def concepts(b):
    for diff, q, c, w, e in CONCEPTS:
        b.add(DL, SUB, diff, q, c, w, e)
