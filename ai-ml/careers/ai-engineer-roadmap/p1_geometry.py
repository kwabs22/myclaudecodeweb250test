"""Phase 1 questions on geometry: distances and angles, areas, orientation, segments, polygons, the convex hull,
transformation matrices, homographies and the pinhole camera (see learning-resources/mathematics/geometry).

Answers are computed with the standard library, fractions and numpy. When shapely is installed, the segment, point in
polygon and convex hull answers are also checked against it, so the stored answer agrees with a geometry library.
Every point set used for the hull has no three points in a line, so the answer cannot depend on how collinear points are counted."""
import itertools
import math
from fractions import Fraction

import numpy as np

from question_tools import num

G = "geometry"
try:
    from shapely.geometry import LineString, MultiPoint, Point, Polygon
except ImportError:  # the bank still builds; only the second check is skipped
    LineString = MultiPoint = Point = Polygon = None


def cross(o, a, b):
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])


def pt(p):
    return f"({p[0]}, {p[1]})"


def two(x):
    return f"{x:.2f}".rstrip("0").rstrip(".") if abs(x - round(x)) > 1e-9 else str(int(round(x)))


def shoelace(poly):
    return Fraction(sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly))), 2)


def no_three_collinear(pts):
    return all(cross(a, b, c) != 0 for a, b, c in itertools.combinations(pts, 3))


def classify(p1, p2, q1, q2):
    """Exact: 'cross' (one interior point shared), 'touch' (they meet only where an end lies on the other), 'overlap' or 'miss'."""
    d1, d2, d3, d4 = (cross(q1, q2, p1), cross(q1, q2, p2), cross(p1, p2, q1), cross(p1, p2, q2))
    sgn = lambda v: (v > 0) - (v < 0)
    if d1 == d2 == d3 == d4 == 0:   # all in one line: compare the ranges along it
        axis = 0 if p1[0] != p2[0] or q1[0] != q2[0] else 1
        a0, a1 = sorted((p1[axis], p2[axis])); b0, b1 = sorted((q1[axis], q2[axis]))
        lo, hi = max(a0, b0), min(a1, b1)
        return "miss" if lo > hi else ("touch" if lo == hi else "overlap")
    if sgn(d1) * sgn(d2) < 0 and sgn(d3) * sgn(d4) < 0:
        return "cross"
    on = lambda a, b, p, d: d == 0 and min(a[0], b[0]) <= p[0] <= max(a[0], b[0]) and min(a[1], b[1]) <= p[1] <= max(a[1], b[1])
    if on(q1, q2, p1, d1) or on(q1, q2, p2, d2) or on(p1, p2, q1, d3) or on(p1, p2, q2, d4):
        return "touch"
    return "miss"


def geometry(b):
    r = b.rng
    # --- distance
    for dx, dy in [(3, 4), (5, 12), (6, 8), (8, 15), (7, 24), (9, 12)]:
        p = (r.randint(-4, 4), r.randint(-4, 4)); q = (p[0] + dx * r.choice([-1, 1]), p[1] + dy * r.choice([-1, 1]))
        d = math.dist(p, q); assert d == int(d)
        b.add(G, "distance", "beginner", f"What is the straight-line distance between {pt(p)} and {pt(q)}?", int(d), [abs(dx) + abs(dy), int(d) + 1, int(d) - 1, dx * dx + dy * dy, max(abs(dx), abs(dy))],
              f"√({abs(dx)}² + {abs(dy)}²) = √{dx * dx + dy * dy} = {int(d)}. Adding the two differences gives the walking distance on a grid, not the straight line.")
    for _ in range(6):
        p = (r.randint(-6, 6), r.randint(-6, 6)); q = (r.randint(-6, 6), r.randint(-6, 6))
        if p == q or math.dist(p, q) == int(math.dist(p, q)): continue
        d = math.dist(p, q); dx, dy = abs(p[0] - q[0]), abs(p[1] - q[1])
        b.add(G, "distance", "beginner", f"What is the straight-line distance between {pt(p)} and {pt(q)}, to 2 decimal places?", two(d), [two(dx + dy), two(d * d), two(math.hypot(dx, dy) / 2), two(max(dx, dy)), two(d + 1)],
              f"√({dx}² + {dy}²) = √{dx * dx + dy * dy} ≈ {two(d)}.")
    # --- angle between vectors
    seen = 0
    while seen < 12:
        u = (r.randint(-5, 5), r.randint(-5, 5)); v = (r.randint(-5, 5), r.randint(-5, 5))
        if u == (0, 0) or v == (0, 0): continue
        cs = (u[0] * v[0] + u[1] * v[1]) / (math.hypot(*u) * math.hypot(*v)); ang = math.degrees(math.acos(max(-1, min(1, cs))))
        a = f"{ang:.1f}".rstrip("0").rstrip("."); alt = [f"{180 - ang:.1f}", f"{ang / 2:.1f}", f"{math.acos(max(-1, min(1, cs))):.1f}", f"{abs(90 - ang):.1f}", f"{math.degrees(math.atan2(u[1], u[0])):.1f}"]
        if b.add(G, "angles", "intermediate", f"What is the angle between the vectors {pt(u)} and {pt(v)}, in degrees (to one decimal)?", f"{ang:.1f}", alt,
                 f"cos θ = (u·v)/(|u||v|) = {u[0] * v[0] + u[1] * v[1]}/({two(math.hypot(*u))} × {two(math.hypot(*v))}) = {cs:.3f}, so θ = {ang:.1f}°. A result in radians would be {math.radians(ang):.2f}."):
            seen += 1
    # --- triangle area (shoelace) and orientation
    seen = 0
    while seen < 14:
        a, c, d = [(r.randint(-6, 8), r.randint(-6, 8)) for _ in range(3)]
        cr = cross(a, c, d)
        if cr == 0: continue
        area = Fraction(abs(cr), 2); got = num(area)
        if Polygon is not None: assert abs(Polygon([a, c, d]).area - float(area)) < 1e-9
        if b.add(G, "triangle_area", "intermediate", f"What is the area of the triangle with corners {pt(a)}, {pt(c)} and {pt(d)}?", got, [num(abs(cr)), num(area + 1), num(Fraction(abs(cr), 4)), num(area * 2 + 1), num(abs(a[0] * c[1] + c[0] * d[1] + d[0] * a[1]))],
                 f"Half the absolute cross product of two sides: ½ |({c[0] - a[0]})({d[1] - a[1]}) − ({c[1] - a[1]})({d[0] - a[0]})| = ½ × {abs(cr)} = {got}. Forgetting the ½ doubles it."):
            seen += 1
    seen = 0
    while seen < 10:
        a, c, d = [(r.randint(-5, 6), r.randint(-5, 6)) for _ in range(3)]
        if r.random() < 0.2:
            c = (a[0] + 2 * (d[0] - a[0]), a[1] + 2 * (d[1] - a[1]))   # put C on the line through A and D
        cr = cross(a, c, d); truth = "Anticlockwise" if cr > 0 else "Clockwise" if cr < 0 else "In a straight line"
        wrong = [x for x in ["Anticlockwise", "Clockwise", "In a straight line", "Cannot be told without the origin", "Always clockwise"] if x != truth]
        if b.add(G, "orientation", "intermediate", f"Going from {pt(a)} to {pt(c)} to {pt(d)} (with y pointing up), do the three points turn anticlockwise, clockwise, or lie in a line?", truth, wrong,
                 f"The cross product of (B − A) and (C − A) is {cr}: positive means anticlockwise, negative clockwise, zero in a line."):
            seen += 1
    # --- polygon area
    seen = 0
    while seen < 10:
        n = r.choice([4, 4, 5, 6]); ang = sorted(r.uniform(0, 2 * math.pi) for _ in range(n)); rad = [r.randint(2, 8) for _ in range(n)]
        poly = [(round(rad[i] * math.cos(ang[i])), round(rad[i] * math.sin(ang[i]))) for i in range(n)]
        if len(set(poly)) < n: continue
        if Polygon is not None and not Polygon(poly).is_valid: continue
        area = shoelace(poly)
        if area <= 0: continue
        if Polygon is not None: assert abs(Polygon(poly).area - float(area)) < 1e-9
        xs = [p[0] for p in poly]; ys = [p[1] for p in poly]; box = (max(xs) - min(xs)) * (max(ys) - min(ys))
        if b.add(G, "polygon_area", "advanced", f"What is the area of the polygon with corners, in order, {', '.join(pt(p) for p in poly)}?", num(area), [num(area * 2), num(Fraction(box)), num(area + Fraction(1, 2)), num(area - 1), num(-area + box)],
                 f"The shoelace formula: ½ |Σ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)| = ½ × {abs(area) * 2} = {num(area)}. The bounding box would be {box}."):
            seen += 1
    # --- two segments
    seen = 0; label = {"cross": "They cross at one point, inside both segments", "touch": "They meet at one point, an end of one lying on the other", "overlap": "They overlap along part of a line", "miss": "They do not meet"}
    quota = {"cross": 4, "miss": 4, "touch": 3, "overlap": 3}; made = {k: 0 for k in quota}
    while sum(made.values()) < sum(quota.values()):
        p1, p2, q1, q2 = [(r.randint(0, 6), r.randint(0, 6)) for _ in range(4)]
        if p1 == p2 or q1 == q2: continue
        kind = classify(p1, p2, q1, q2)
        if made[kind] >= quota[kind]: continue
        if LineString is not None:
            s1, s2 = LineString([p1, p2]), LineString([q1, q2]); inter = s1.intersection(s2)
            assert s1.intersects(s2) == (kind != "miss"), (p1, p2, q1, q2, kind)
            assert (inter.geom_type == "LineString" and not inter.is_empty) == (kind == "overlap")
        if b.add(G, "segments", "advanced", f"Segment A runs from {pt(p1)} to {pt(p2)} and segment B from {pt(q1)} to {pt(q2)}. Which describes them?", label[kind], [label[k] for k in label if k != kind],
                 f"Test each end against the line through the other segment with the cross product. Here the result is: {label[kind].lower()}. Segments stop at their ends, so their lines can cross where the segments do not."):
            made[kind] += 1
    # --- point in polygon
    shapes = [[(0, 0), (8, 0), (8, 6), (0, 6)], [(0, 0), (8, 0), (8, 3), (4, 3), (4, 8), (0, 8)], [(0, 0), (9, 0), (4, 7)], [(1, 0), (7, 1), (9, 6), (4, 9), (0, 5)], [(0, 0), (10, 0), (10, 10), (6, 10), (6, 4), (4, 4), (4, 10), (0, 10)]]
    seen = 0
    while seen < 12:
        poly = r.choice(shapes); p = (r.randint(-1, 10), r.randint(-1, 10)); p = (p[0] + 0.5, p[1] + 0.5)   # half-integer points never touch a corner or an edge
        xs = 0
        for i in range(len(poly)):
            a, c = poly[i], poly[(i + 1) % len(poly)]
            if (a[1] > p[1]) != (c[1] > p[1]) and a[0] + (p[1] - a[1]) * (c[0] - a[0]) / (c[1] - a[1]) > p[0]: xs += 1
        inside = xs % 2 == 1
        if Polygon is not None: assert Polygon(poly).contains(Point(p)) == inside
        if seen % 2 == 0:
            ok = b.add(G, "point_in_polygon", "advanced", f"A ray is shot to the right (in the +x direction) from the point ({p[0]}, {p[1]}). The polygon has corners {', '.join(pt(q) for q in poly)}. How many times does the ray cross the polygon's outline?", xs,
                       [xs + 1, max(xs - 1, 0), xs + 2, len(poly), 0 if xs else 1], f"Count the edges that straddle the height y = {p[1]} and lie to the right of x = {p[0]}: {xs}.")
        else:
            truth = "Inside" if inside else "Outside"
            ok = b.add(G, "point_in_polygon", "advanced", f"Is the point ({p[0]}, {p[1]}) inside the polygon with corners {', '.join(pt(q) for q in poly)}? (Use the rule: shoot a ray to the right and count crossings.)", truth,
                       [x for x in ["Inside", "Outside", "On the edge", "Cannot be decided"] if x != truth], f"The rightward ray crosses the outline {xs} times. An odd count means inside, an even count outside.")
        if ok: seen += 1
    # --- convex hull
    seen = 0
    while seen < 10:
        n = r.randint(7, 11); pts = list({(r.randint(0, 9), r.randint(0, 9)) for _ in range(n)})
        if len(pts) < 6 or not no_three_collinear(pts): continue
        k = sum(is_corner(pts, i) for i in range(len(pts)))
        if Polygon is not None:
            hull = MultiPoint(pts).convex_hull; assert k == len(hull.exterior.coords) - 1, (pts, k)
        pts.sort()
        if b.add(G, "convex_hull", "advanced", f"How many of these {len(pts)} points are corners of their convex hull (the smallest convex shape that holds them all)? {', '.join(pt(p) for p in pts)}", k,
                 [k + 1, max(k - 1, 3), len(pts), len(pts) - k, k + 2], f"The hull has {k} corners; the other {len(pts) - k} points lie inside it."):
            seen += 1
    # --- rotation and reflection of a point
    for (x, y) in [(3, 1), (2, 5), (4, -2), (-3, 2), (1, 6), (5, 5)]:
        for name, f, wrong in [("90° anticlockwise", lambda x, y: (-y, x), [(y, -x), (-x, -y), (y, x), (x, -y)]), ("180°", lambda x, y: (-x, -y), [(x, -y), (-x, y), (-y, x), (y, x)])]:
            if r.random() < 0.55 or name.startswith("90"):
                got = f(x, y)
                b.add(G, "rotation", "beginner", f"Turn the point ({x}, {y}) by {name} about the origin (y pointing up). Where does it end up?", pt(got), [pt(w) for w in wrong], f"{name}: " + ("(x, y) → (−y, x)" if name.startswith("90") else "(x, y) → (−x, −y)") + f" gives {pt(got)}. The other answers are a clockwise turn or a reflection.")
    for ang, L in [(60, 4), (30, 6), (45, 10), (120, 2), (60, 8), (150, 4)]:
        th = math.radians(ang); R = np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]]); q = R @ np.array([L, 0])
        got = f"({two(q[0])}, {two(q[1])})"
        b.add(G, "rotation", "intermediate", f"Rotate the point ({L}, 0) by {ang}° anticlockwise about the origin. Where is it, to 2 decimal places?", got,
              [f"({two(L * math.cos(th))}, {two(-L * math.sin(th))})", f"({two(L * math.sin(th))}, {two(L * math.cos(th))})", f"({two(L * math.cos(th))}, {two(L)})", f"({two(L * math.cos(math.radians(90 - ang)) )}, {two(L * math.cos(th))})"],
              f"R(θ)·(L, 0) = (L cos θ, L sin θ) = ({two(q[0])}, {two(q[1])}). A clockwise turn would give the opposite y.")
    # --- determinant as area scale
    seen = 0
    while seen < 12:
        M = [[r.randint(-3, 4), r.randint(-3, 4)], [r.randint(-3, 4), r.randint(-3, 4)]]; det = M[0][0] * M[1][1] - M[0][1] * M[1][0]
        if det == 0: continue
        if seen % 3 == 2:
            truth = "Yes: the determinant is negative" if det < 0 else "No: the determinant is positive"
            ok = b.add(G, "determinant_area", "intermediate", f"Does the matrix [[{M[0][0]}, {M[0][1]}], [{M[1][0]}, {M[1][1]}]] flip a shape over, as a mirror does?", truth,
                       [x for x in ["Yes: the determinant is negative", "No: the determinant is positive", "Yes: the matrix has a zero entry", "No: only rotations can change orientation"] if x != truth], f"The determinant is {det}. A negative determinant reverses orientation; its absolute value is the area scale.")
        else:
            A = r.choice([1, 2, 3, 5, 6]); ans = A * abs(det)
            ok = b.add(G, "determinant_area", "intermediate", f"A shape of area {A} is transformed by the matrix [[{M[0][0]}, {M[0][1]}], [{M[1][0]}, {M[1][1]}]]. What is the area of the result?", ans, [A * det if det < 0 else A + det, abs(det), A + abs(det), ans * 2, A * (abs(M[0][0]) + abs(M[1][1]))],
                       f"Areas scale by the absolute value of the determinant: |({M[0][0]})({M[1][1]}) − ({M[0][1]})({M[1][0]})| = {abs(det)}, so {A} × {abs(det)} = {ans}.")
        if ok: seen += 1
    # --- homography applied to a point
    seen = 0
    while seen < 8:
        a, bb, c = r.randint(1, 3), r.randint(-1, 1), r.randint(-4, 8); d, e, f = r.randint(-1, 1), r.randint(1, 3), r.randint(-4, 8); gh = r.choice([(0, 0), (0, 0), (Fraction(1, 10), 0), (0, Fraction(1, 10)), (Fraction(1, 10), Fraction(1, 10))])
        x, y = r.randint(0, 9), r.randint(0, 9); w = gh[0] * x + gh[1] * y + 1; X = Fraction(a * x + bb * y + c) / w; Y = Fraction(d * x + e * y + f) / w
        got = f"({two(float(X))}, {two(float(Y))})"
        wrong = [f"({two(float(a * x + bb * y + c))}, {two(float(d * x + e * y + f))})", f"({two(float(Y))}, {two(float(X))})", f"({two(float(X * w * w))}, {two(float(Y * w * w))})", f"({two(float(X) + 1)}, {two(float(Y) - 1)})"]
        if gh == (0, 0): wrong[0] = f"({two(float(a * x + bb * y))}, {two(float(d * x + e * y))})"
        if b.add(G, "homography", "advanced", f"A homography has matrix [[{a}, {bb}, {c}], [{d}, {e}, {f}], [{two(float(gh[0]))}, {two(float(gh[1]))}, 1]]. Where does it send the point ({x}, {y})? (Give the answer to 2 decimal places.)", got, wrong,
                 f"Multiply, then divide by the last component: w = {two(float(gh[0]))}·{x} + {two(float(gh[1]))}·{y} + 1 = {two(float(w))}; x' = {two(float(a * x + bb * y + c))}/{two(float(w))}, y' = {two(float(d * x + e * y + f))}/{two(float(w))}."):
            seen += 1
    # --- pinhole camera
    seen = 0
    while seen < 12:
        f, cx, X, Zd = r.choice([400, 500, 600, 800, 1000]), r.choice([320, 400, 640]), r.randint(-3, 3) / 2, r.choice([2, 4, 5, 8, 10])
        if X == 0: continue
        u = f * X / Zd + cx; got = two(u)
        if b.add(G, "pinhole", "intermediate", f"A pinhole camera has focal length {f} pixels and its image centre is at column {cx}. A point is {two(X)} m to the right of the camera's axis and {Zd} m in front of the camera. Using u = f·X/Z + cx, which pixel column does it land on?", got,
                 [two(f * X + cx), two(f * Zd / X + cx), two(f * X / Zd), two(cx - f * X / Zd), two(f * X / Zd + cx + 50)], f"u = {f} × {two(X)} / {Zd} + {cx} = {got}. Forgetting to divide by the distance gives {two(f * X + cx)}."):
            seen += 1
    for f, h, Zd in [(500, 1.8, 6), (800, 2, 10), (600, 0.5, 3), (1000, 1.6, 8), (400, 3, 12), (500, 1, 5)]:
        px = f * h / Zd
        b.add(G, "pinhole_size", "intermediate", f"A camera has focal length {f} pixels. An upright object {two(h)} m tall stands {Zd} m in front of it. How many pixels tall does it appear (size = f·h/Z)?", two(px), [two(f * h), two(f * Zd / h), two(px * 2), two(px / 2), two(h * Zd)],
              f"{f} × {two(h)} / {Zd} = {two(px)} pixels. Twice as far away halves it.")
    for Z0 in [4, 6, 9, 12]:
        for k in [2, 3]:
            b.add(G, "pinhole_size", "beginner", f"An object is {Z0} m from a pinhole camera and appears 120 pixels tall. If it moves to {Z0 * k} m (same camera), how tall does it appear?", two(120 / k), [two(120 * k), "120", two(120 / (k * k)), two(120 - Z0)],
                  f"Image size is proportional to 1/distance, so {k} times as far means 1/{k} of the size: 120/{k} = {two(120 / k)}.")


def is_corner(pts, i):
    """A point is a hull corner unless it lies inside a triangle made by three other points (no three points are in a line)."""
    p = pts[i]; others = [q for j, q in enumerate(pts) if j != i]
    for a, c, d in itertools.combinations(others, 3):
        s = [cross(a, c, p), cross(c, d, p), cross(d, a, p)]
        if all(v > 0 for v in s) or all(v < 0 for v in s): return False
    return True


CONCEPTS = [
    ("beginner", "What does the sign of the 2D cross product of (B − A) and (C − A) tell you?", "Whether A, B, C turn anticlockwise (positive), clockwise (negative) or lie in a line (zero)", ["The length of the side BC", "The angle at A in degrees", "Whether the triangle is right-angled"], "The cross product is the signed area of the parallelogram on the two sides; its sign is the turn direction."),
    ("beginner", "Why is half the absolute cross product the area of a triangle?", "The cross product is the area of the parallelogram on two sides, and a triangle is half of it", ["A triangle has two sides", "The cross product measures perimeter", "Absolute value halves the number"], "The two sides span a parallelogram; the diagonal cuts it into two equal triangles."),
    ("intermediate", "Three points have a cross product of zero. What does that mean?", "They lie on one straight line (the triangle has zero area)", ["They form a right angle", "They are equally spaced", "They form an equilateral triangle"], "Zero signed area means no triangle: the points are collinear."),
    ("intermediate", "Two segments have their lines crossing at a point, but the segments themselves do not meet. How is that possible?", "Segments stop at their ends, and the crossing point of the lines lies beyond one or both ends", ["Lines can cross only once, so the segments must meet", "The cross product is wrong", "Segments have no ends"], "A segment is only part of its line, so the lines can cross somewhere the segments do not reach."),
    ("intermediate", "Two segments cross when…", "each segment's ends lie on opposite sides of the other segment's line", ["their midpoints are the same", "they have the same length", "their slopes are equal"], "This is the orientation test: the two cross products for each segment have opposite signs."),
    ("advanced", "How does the winding number differ from ray casting for deciding if a point is inside a shape?", "Winding counts how many times the outline goes round the point (inside if not zero); ray casting counts crossings (inside if odd). They can disagree when the outline crosses itself", ["The winding number needs a straight ray", "Ray casting works only on triangles", "They always give different answers"], "For simple outlines both agree; for a self-crossing outline some regions are wound twice, which is odd/even-outside but non-zero/inside."),
    ("beginner", "What is the convex hull of a set of points?", "The smallest convex shape that contains all the points, like a rubber band stretched round them", ["The shortest path through all the points", "The circle through the three most distant points", "The average of the points"], "Convex means any two points inside can be joined by a line that stays inside."),
    ("intermediate", "Every turn along the boundary of a convex polygon, going anticlockwise, is…", "a left turn (positive cross product)", ["a right turn", "alternately left and right", "zero"], "A polygon is convex exactly when all its turns go the same way."),
    ("intermediate", "What does the determinant of a 2×2 matrix tell you about the transformation it makes?", "The factor by which areas change, with a negative sign meaning the shape is flipped over", ["The angle of rotation", "The length of the first column", "Whether the matrix has an inverse in every case"], "|det| is the area scale; det < 0 reverses orientation; det = 0 squashes the plane to a line."),
    ("intermediate", "Why does the order of two transformations matter, for example rotating then stretching versus stretching then rotating?", "Matrix multiplication is not commutative, so AB and BA are usually different", ["Rotations change the stretch", "Stretching changes the angle", "Computers apply them in random order"], "An even stretch (same in both directions) is the exception: it commutes with rotation."),
    ("intermediate", "A rotation matrix R satisfies…", "its inverse is its transpose, and its determinant is 1", ["its determinant is 0", "its inverse is itself", "its entries are all positive"], "Rotations preserve lengths and angles, so R·Rᵀ = I and det R = 1."),
    ("advanced", "Why are 3D rotations about different axes not interchangeable (turning about X then Y differs from Y then X)?", "3D rotation matrices do not commute", ["Because X comes before Y", "Because rotations lose length", "They are interchangeable"], "Hold a book and turn it 90° about two different axes in both orders: it ends up in different orientations."),
    ("advanced", "What problem do quaternions avoid compared with turning a 3D object by three Euler angles?", "Gimbal lock, where two of the rotation axes line up and a degree of freedom is lost, and they interpolate smoothly", ["They need no multiplication", "They work only in 2D", "They make rotation commutative"], "Quaternions represent a rotation as one axis and angle without a fixed order of three turns."),
    ("intermediate", "In a pinhole camera, what happens to an object's size in the image if its distance doubles?", "It halves, since image size is proportional to 1/distance", ["It doubles", "It stays the same", "It quarters"], "u = f·X/Z, so the offset from the centre scales with 1/Z."),
    ("intermediate", "What does doubling the focal length of a pinhole camera do to the image?", "Every point moves twice as far from the image centre, which zooms in", ["It moves the camera back", "It rotates the image", "It halves the field of view"], "Focal length multiplies all offsets, and the field of view narrows."),
    ("advanced", "How many point correspondences are needed to find a homography between two views of a plane, and why?", "Four, because the matrix has 8 degrees of freedom (nine entries, defined only up to scale) and each correspondence gives 2 equations", ["Two, because it has two coordinates", "Nine, one per entry", "Three, like a triangle"], "Each point pair (x, y) → (x', y') gives two equations, so 4 pairs give the 8 needed (no three of the points may be in a line)."),
    ("advanced", "What does a homography describe?", "How points on one plane (such as a marker or a table) map to their positions in a camera image, or to another view of the same plane", ["How a camera lens bends light", "The rotation of a 3D object", "The depth of every pixel"], "A planar surface seen by a pinhole camera maps by a 3×3 matrix acting on homogeneous coordinates."),
    ("advanced", "Why must you divide by the last component after applying a homography to (x, y, 1)?", "The result is in homogeneous coordinates, and the real position is the first two entries divided by the third", ["To normalise the colours", "To convert degrees to radians", "To make the matrix invertible"], "The third component carries the perspective: it is what makes far things smaller."),
]


def concepts(b):
    for diff, q, c, w, e in CONCEPTS:
        b.add(G, "concepts", diff, q, c, w, e)
