"""Phase 1 maths questions: linear algebra, calculus, probability and statistics. Answers come from numpy, sympy and the
standard library; the checks inside each block fail loudly if two independent ways of computing an answer disagree."""
import itertools
import math
import statistics
from fractions import Fraction

import numpy as np
import sympy as sp

from question_tools import num, near

LA, CA, PS = "linear_algebra", "calculus", "probability_statistics"


def mat_str(m):
    return "[" + ", ".join("[" + ", ".join(str(int(x)) for x in row) + "]" for row in m) + "]"


def vec_str(v):
    return "(" + ", ".join(str(int(x)) for x in v) + ")"


def linear_algebra(b):
    r = b.rng
    # --- dot products
    for i in range(22):
        n = r.choice([2, 3, 3, 4])
        u = [r.randint(-5, 6) for _ in range(n)]
        v = [r.randint(-5, 6) for _ in range(n)]
        d = int(np.dot(u, v)); assert d == sum(a * c for a, c in zip(u, v))
        wrong = near(r, d) + [sum(abs(a * c) for a, c in zip(u, v)), sum(a + c for a, c in zip(u, v))]
        b.add(LA, "dot_product", "beginner", f"What is the dot product of u = {vec_str(u)} and v = {vec_str(v)}?", d, wrong,
              f"Multiply matching components and add: {' + '.join(f'({a})({c})' for a, c in zip(u, v))} = {d}.")
    # --- norms
    for (a, c) in [(3, 4), (5, 12), (8, 15), (7, 24), (6, 8), (9, 12), (20, 21), (12, 16)]:
        n = math.hypot(a, c); assert n == int(n)
        b.add(LA, "vector_norm", "beginner", f"What is the Euclidean norm (length) of the vector ({a}, {c})?", int(n), near(r, int(n)),
              f"sqrt({a}² + {c}²) = sqrt({a*a + c*c}) = {int(n)}.")
    for v in [(1, 2, 2), (2, 3, 6), (1, 1, 1), (1, 2, 3), (2, 2, 1), (4, 4, 2), (0, 5, 12), (1, 0, 1), (3, 4, 12), (2, 1, 2)]:
        s = sum(x * x for x in v); n = math.sqrt(s)
        correct = str(int(n)) if n == int(n) else f"√{s}"
        wrong = [str(s), str(sum(v)), f"√{s + 1}", f"√{s - 1}" if s > 1 else "2", str(int(n) + 1) if n == int(n) else f"√{s + 2}"]
        b.add(LA, "vector_norm", "beginner", f"What is the L2 norm of the vector {vec_str(v)}?", correct, wrong,
              f"Add the squares ({' + '.join(str(x*x) for x in v)} = {s}) and take the square root.")
    for v in [(3, -4), (-5, 12), (1, -2, 2), (-1, 2, -3), (2, -6, 3, 0)]:
        l1 = sum(abs(x) for x in v)
        b.add(LA, "vector_norm", "beginner", f"What is the L1 norm of {vec_str(v)}?", l1, near(r, l1) + [sum(v)],
              f"The L1 norm adds absolute values: {' + '.join(str(abs(x)) for x in v)} = {l1}.")
    # --- determinants
    seen = 0
    while seen < 18:
        m = [[r.randint(-4, 6) for _ in range(2)] for _ in range(2)]
        d = m[0][0] * m[1][1] - m[0][1] * m[1][0]
        assert round(np.linalg.det(np.array(m))) == d
        wrong = near(r, d) + [m[0][0] * m[1][1] + m[0][1] * m[1][0], m[0][0] + m[1][1]]
        if b.add(LA, "determinant", "beginner", f"What is the determinant of {mat_str(m)}?", d, wrong,
                 f"For a 2×2 matrix, det = ad − bc = ({m[0][0]})({m[1][1]}) − ({m[0][1]})({m[1][0]}) = {d}."):
            seen += 1
    seen = 0
    while seen < 12:
        m = [[r.randint(-3, 4) for _ in range(3)] for _ in range(3)]
        d = int(round(np.linalg.det(np.array(m, dtype=float))))
        assert d == int(sp.Matrix(m).det())
        wrong = near(r, d) + [-d, sum(m[i][i] for i in range(3))]
        if b.add(LA, "determinant", "intermediate", f"What is the determinant of the 3×3 matrix {mat_str(m)}?", d, wrong,
                 "Expand along the first row (cofactor expansion) or use row operations; the result is " + str(d) + "."):
            seen += 1
    # --- matrix products
    seen = 0
    while seen < 16:
        A = [[r.randint(-3, 4) for _ in range(2)] for _ in range(2)]
        B = [[r.randint(-3, 4) for _ in range(2)] for _ in range(2)]
        P = np.array(A) @ np.array(B)
        i, j = r.randint(0, 1), r.randint(0, 1)
        val = int(P[i, j])
        row, col = A[i], [B[0][j], B[1][j]]
        wrong = near(r, val) + [int((np.array(B) @ np.array(A))[i, j]), A[i][0] * B[i][0] + A[i][1] * B[i][1]]
        if b.add(LA, "matrix_multiplication", "intermediate", f"For A = {mat_str(A)} and B = {mat_str(B)}, what is entry (row {i+1}, column {j+1}) of the product AB?", val, wrong,
                 f"Take row {i+1} of A {vec_str(row)} dotted with column {j+1} of B {vec_str(col)}: {val}."):
            seen += 1
    # --- shapes
    for _ in range(40):
        m, k, n = r.randint(2, 6), r.randint(2, 6), r.randint(2, 6)
        if k == m: continue
        b.add(LA, "matrix_shapes", "beginner", f"A has shape {m}×{k} and B has shape {k}×{n}. What is the shape of AB?", f"{m}×{n}",
              [f"{k}×{k}", f"{n}×{m}", f"{m}×{k}", f"{k}×{n}", f"{m}×{m}"], f"The inner sizes ({k}) match and drop out, leaving rows of A by columns of B: {m}×{n}.")
    for _ in range(14):
        m, k, n = r.randint(2, 7), r.randint(2, 7), r.randint(2, 7)
        if k == n: continue
        b.add(LA, "matrix_shapes", "beginner", f"A has shape {m}×{k} and B has shape {n}×{m}. Which product is defined?", "BA (shape %d×%d)" % (n, k),
              [f"AB (shape {m}×{m})", "Both AB and BA", "Neither", f"AB (shape {n}×{k})"], f"AB needs {k} = {n}, which is false. BA needs {m} = {m}, which holds, giving {n}×{k}.")
    # --- trace
    for _ in range(8):
        n = r.choice([2, 3, 3, 4]); m = [[r.randint(-5, 9) for _ in range(n)] for _ in range(n)]
        t = int(np.trace(np.array(m)))
        b.add(LA, "trace", "beginner", f"What is the trace of {mat_str(m)}?", t, near(r, t) + [sum(sum(row) for row in m)], f"Add the diagonal entries: {' + '.join(str(m[i][i]) for i in range(n))} = {t}.")
    # --- inverse
    seen = 0
    while seen < 12:
        m = [[r.randint(-3, 5) for _ in range(2)] for _ in range(2)]
        d = m[0][0] * m[1][1] - m[0][1] * m[1][0]
        if d == 0: continue
        inv = sp.Matrix(m).inv()
        i, j = r.randint(0, 1), r.randint(0, 1)
        val = Fraction(int(inv[i, j].p), int(inv[i, j].q))
        assert abs(float(val) - np.linalg.inv(np.array(m, dtype=float))[i, j]) < 1e-9
        adj = [[m[1][1], -m[0][1]], [-m[1][0], m[0][0]]]
        wrong = [num(Fraction(adj[i][j], 1)) if d != 1 else "0", num(-val), num(val + 1), num(Fraction(m[i][j], d)), num(Fraction(d, 1))]
        if b.add(LA, "inverse", "intermediate", f"The matrix {mat_str(m)} is invertible. What is entry (row {i+1}, column {j+1}) of its inverse?", num(val), wrong,
                 f"For 2×2, the inverse is (1/det)[[d, −b], [−c, a]] with det = {d}; this entry is {num(val)}."):
            seen += 1
    # --- eigenvalues
    pairs = [(1, 3), (2, 5), (-1, 4), (3, 3), (0, 6), (2, -2), (4, 7), (1, 2), (5, 9), (-3, 1)]
    for a, c in pairs:
        for form in ("diag", "tri"):
            if form == "diag":
                m = [[a, 0], [0, c]]
            else:
                m = [[a, r.randint(1, 5)], [0, c]]
            ev = sorted(np.linalg.eigvals(np.array(m, dtype=float)).real.round(6))
            assert ev == sorted([float(a), float(c)])
            correct = "{" + f"{a}, {c}" + "}" if a <= c else "{" + f"{c}, {a}" + "}"
            wrong = ["{" + f"{a + 1}, {c}" + "}", "{" + f"{a}, {c + 1}" + "}", "{" + f"{-a}, {-c}" + "}", "{" + f"{a + c}, {a * c}" + "}", "{" + f"{a}, {m[0][1]}" + "}" if form == "tri" else "{" + f"{a * c}, {a}" + "}"]
            b.add(LA, "eigenvalues", "intermediate", f"What are the eigenvalues of the {'diagonal' if form == 'diag' else 'upper-triangular'} matrix {mat_str(m)}?", correct, wrong,
                  "For a diagonal or triangular matrix, the eigenvalues are the diagonal entries.")
    for lam in [(2, 3), (1, 4), (3, 5), (-1, 2), (0, 3), (2, 6)]:
        # symmetric [[p, q],[q, p]] has eigenvalues p+q and p-q
        p, q = (lam[0] + lam[1]) / 2, (lam[1] - lam[0]) / 2
        if p != int(p): continue
        p, q = int(p), int(q); m = [[p, q], [q, p]]
        ev = sorted(np.linalg.eigvalsh(np.array(m, dtype=float)).round(6)); assert ev == sorted(map(float, lam))
        b.add(LA, "eigenvalues", "advanced", f"The symmetric matrix {mat_str(m)} has which eigenvalues?", "{" + f"{min(lam)}, {max(lam)}" + "}",
              ["{" + f"{p}, {q}" + "}", "{" + f"{p + q}, {p + q}" + "}", "{" + f"{p - 1}, {q + 1}" + "}", "{" + f"{p * p - q * q}, {p}" + "}"],
              f"For [[p, q], [q, p]] the eigenvalues are p + q = {p+q} and p − q = {p-q}.")
    # --- rank
    for _ in range(12):
        n = r.choice([2, 3, 3]); rank_target = r.randint(1, n)
        base = [[r.randint(-3, 4) for _ in range(n)] for _ in range(rank_target)]
        rows = list(base)
        while len(rows) < n:
            c1, c2 = r.randint(-2, 3), r.randint(-2, 3)
            comb = [c1 * base[0][k] + (c2 * base[-1][k]) for k in range(n)]
            rows.append(comb)
        m = rows[:]; r.shuffle(m)
        rk = int(np.linalg.matrix_rank(np.array(m, dtype=float))); assert rk == sp.Matrix(m).rank()
        b.add(LA, "rank", "intermediate", f"What is the rank of {mat_str(m)}?", rk, [x for x in range(0, n + 2) if x != rk] + [n + 2],
              f"Row-reduce the matrix: it has {rk} independent row(s), so the rank is {rk}.")
    # --- linear systems
    seen = 0
    while seen < 14:
        x, y = r.randint(-4, 5), r.randint(-4, 5)
        a1, b1, a2, b2 = [r.randint(-3, 4) for _ in range(4)]
        if a1 * b2 - a2 * b1 == 0: continue
        c1, c2 = a1 * x + b1 * y, a2 * x + b2 * y
        sol = np.linalg.solve(np.array([[a1, b1], [a2, b2]], dtype=float), np.array([c1, c2], dtype=float)); assert np.allclose(sol, [x, y])
        def eq(a, bb, c): return f"{a}x {'+' if bb >= 0 else '−'} {abs(bb)}y = {c}"
        if b.add(LA, "linear_systems", "intermediate", f"Solve the system {eq(a1, b1, c1)} and {eq(a2, b2, c2)}. What is (x, y)?", f"({x}, {y})",
                 [f"({y}, {x})", f"({-x}, {-y})", f"({x + 1}, {y})", f"({x}, {y + 1})", f"({x}, {-y})"], f"Substituting x = {x}, y = {y} satisfies both equations; elimination gives the same answer."):
            seen += 1
    # --- angles
    for u, v in [((1, 0), (0, 1)), ((1, 1), (1, -1)), ((2, 0), (5, 0)), ((1, 2), (-2, 1)), ((3, 4), (4, -3)), ((1, 0), (-3, 0)), ((2, 3), (3, -2)), ((1, 1, 0), (0, 0, 1))]:
        d = int(np.dot(u, v))
        kind = "perpendicular (orthogonal)" if d == 0 else ("pointing the same way" if all(a * c >= 0 for a, c in zip(u, v)) and np.cross(u + (0,) * (3 - len(u)), v + (0,) * (3 - len(v))).any() == False and d > 0 else ("pointing opposite ways" if d < 0 and not np.cross(u + (0,) * (3 - len(u)), v + (0,) * (3 - len(v))).any() else "neither"))
        if kind == "neither": continue
        b.add(LA, "orthogonality", "beginner", f"The vectors {vec_str(u)} and {vec_str(v)} are which of these?", kind,
              [k for k in ("perpendicular (orthogonal)", "pointing the same way", "pointing opposite ways", "neither") if k != kind] + ["parallel but different lengths"][:0],
              f"Their dot product is {d}. Zero means perpendicular; for parallel vectors a positive value means same direction and a negative value opposite.")
    for u, v, cos in [((1, 0), (1, 1), "1/√2 ≈ 0.707"), ((1, 0), (0, 5), "0"), ((2, 0), (-1, 0), "−1"), ((1, 1), (1, 1), "1"), ((0, 3), (3, 3), "1/√2 ≈ 0.707")]:
        wrong = [w for w in ("0", "1", "−1", "1/√2 ≈ 0.707", "0.5", "√2") if w != cos]
        b.add(LA, "cosine_similarity", "intermediate", f"What is the cosine similarity of {vec_str(u)} and {vec_str(v)}?", cos, wrong,
              "cos θ = (u·v)/(‖u‖‖v‖).")
    # --- concepts (hand-written)
    b.add_concepts(LA, "concepts", "beginner", [
        ("What is special about the identity matrix I?", "AI = IA = A for any matrix A of a compatible shape", ["It has all entries equal to 1", "Its determinant is 0", "It has no inverse", "It is the only symmetric matrix"], "I has ones on the diagonal and zeros elsewhere, and multiplying by it leaves a matrix unchanged."),
        ("A square matrix with determinant 0 is called what?", "Singular (not invertible)", ["Orthogonal", "Symmetric", "Positive definite", "Diagonal"], "det = 0 means the columns are linearly dependent and no inverse exists."),
        ("For a symmetric matrix A, which statement is always true?", "Aᵀ = A", ["A⁻¹ = A", "det(A) = 1", "All entries are positive", "A is diagonal"], "Symmetric means equal to its transpose."),
        ("What does it mean for the columns of Q to be orthonormal?", "QᵀQ = I", ["Q² = I", "det(Q) = 0", "All entries are 0 or 1", "Q = Qᵀ"], "Orthonormal columns have length 1 and are mutually perpendicular, which is exactly QᵀQ = I."),
        ("In machine learning, a data set of 1,000 examples with 20 features is usually stored as a matrix of which shape?", "1000×20", ["20×1000", "1000×1000", "20×20", "1×20000"], "Rows are examples and columns are features by convention."),
        ("What does the eigenvector equation Av = λv say?", "A only stretches v by a factor λ, without changing its direction", ["A rotates v by λ degrees", "A maps v to the zero vector", "A and v are perpendicular", "λ is the determinant of A"], "An eigenvector keeps its direction under A; the eigenvalue is the stretch factor."),
        ("What is (AB)ᵀ equal to?", "BᵀAᵀ", ["AᵀBᵀ", "ABᵀ", "AᵀB", "(BA)ᵀ"], "Transposing a product reverses the order."),
        ("Which operation is NOT generally commutative for matrices?", "Matrix multiplication (AB ≠ BA in general)", ["Matrix addition", "Scalar multiplication", "Taking the trace of a sum", "Adding the zero matrix"], "Addition commutes, but AB and BA usually differ."),
        ("The null space of A is the set of vectors x for which what holds?", "Ax = 0", ["Ax = x", "Aᵀx = x", "xᵀAx = 1", "A⁻¹x = 0"], "By definition, the null space is the solution set of Ax = 0."),
        ("PCA finds directions of maximum variance. Mathematically these are what?", "Eigenvectors of the covariance matrix", ["Rows of the data matrix", "The mean of each feature", "Solutions of Ax = b", "Diagonal entries of the data"], "The covariance matrix's eigenvectors, ordered by eigenvalue, are the principal components."),
        ("What is the rank of an n×n invertible matrix?", "n", ["0", "1", "n − 1", "n²"], "Invertible means full rank: n independent rows and columns."),
        ("Which is true of the determinant of a product?", "det(AB) = det(A)·det(B)", ["det(AB) = det(A) + det(B)", "det(AB) = det(A)/det(B)", "det(AB) = det(BA) + 1", "det(AB) = 0"], "The determinant is multiplicative."),
        ("Two vectors are linearly dependent when…", "One of them is a scalar multiple of the other (in 2D)", ["Their dot product is 0", "They have different lengths", "They have the same number of components", "Their cross product is non-zero"], "Dependent vectors lie along the same line (in 2D)."),
        ("Why is a matrix of shape m×n multiplied by a vector of length n?", "The vector must have as many entries as A has columns", ["The vector must have as many entries as A has rows", "The shapes can be anything", "The vector must be square", "n must equal m"], "Each output entry is a row of A dotted with the vector, so lengths must match."),
        ("What does the L2 norm of a weight vector measure in regularization?", "The vector's length; penalising it keeps weights small", ["The number of non-zero weights", "The largest weight", "The mean weight", "The sign of the weights"], "L2 regularization adds the squared length of the weights to the loss."),
    ])


# ----------------------------------------------------------------------------------------------------------------- calculus
x, y, w = sp.symbols("x y w")


def pretty(e):
    s = sp.sstr(e).replace("**", "^").replace("*", "·")
    return s.replace("exp(", "e^(").replace("log(", "ln(")


def calculus(b):
    r = b.rng
    # --- derivatives of polynomials
    seen = 0
    while seen < 26:
        deg = r.randint(2, 5)
        f = sum(r.randint(-5, 6) * x ** k for k in range(deg, -1, -1) if r.random() < 0.8) or x ** 2
        f = sp.expand(f)
        if f.is_number or sp.degree(f, x) < 2: continue
        d = sp.diff(f, x)
        # wrong: forgot to reduce power, kept constant, integrated instead
        wrong = [pretty(sp.expand(f)), pretty(sp.integrate(f, x)), pretty(sp.diff(f, x, 2)), pretty(sp.expand(d + 1)), pretty(sp.expand(d + x))]
        if b.add(CA, "derivatives", "beginner", f"What is d/dx of {pretty(f)}?", pretty(d), wrong, f"Apply the power rule term by term: d/dx[a·xⁿ] = n·a·xⁿ⁻¹, giving {pretty(d)}."):
            seen += 1
    # --- derivative values at a point
    seen = 0
    while seen < 16:
        a, c, k = r.randint(1, 5), r.randint(-4, 5), r.randint(-6, 6)
        f = a * x ** 3 + c * x ** 2 + k * x; p = r.randint(-3, 3)
        val = int(sp.diff(f, x).subs(x, p)); fval = int(f.subs(x, p))
        if b.add(CA, "derivatives", "intermediate", f"If f(x) = {pretty(f)}, what is f′({p})?", val, near(r, val) + [fval], f"f′(x) = {pretty(sp.diff(f, x))}; at x = {p} this is {val}."):
            seen += 1
    # --- product, quotient, chain with sympy
    fam = [
        (lambda a, c: sp.sin(a * x), "chain_rule", "intermediate"),
        (lambda a, c: sp.exp(a * x), "chain_rule", "intermediate"),
        (lambda a, c: (x ** 2 + c) ** a, "chain_rule", "intermediate"),
        (lambda a, c: sp.log(x ** 2 + c), "chain_rule", "intermediate"),
        (lambda a, c: x ** a * sp.exp(x), "product_rule", "intermediate"),
        (lambda a, c: x * sp.sin(a * x), "product_rule", "intermediate"),
        (lambda a, c: x ** a * sp.log(x), "product_rule", "intermediate"),
        (lambda a, c: sp.sin(x) * sp.cos(a * x), "product_rule", "advanced"),
        (lambda a, c: x / (x ** 2 + c), "quotient_rule", "advanced"),
        (lambda a, c: sp.exp(x) / (x + c), "quotient_rule", "advanced"),
        (lambda a, c: sp.cos(x ** a), "chain_rule", "advanced"),
        (lambda a, c: sp.exp(-a * x ** 2), "chain_rule", "advanced"),
    ]
    for f_fn, sub, diff_lvl in fam:
        for _ in range(4):
            a, c = r.randint(2, 5), r.randint(1, 5)
            f = f_fn(a, c); d = sp.diff(f, x)
            num_check = (f.subs(x, 1.3 + 1e-6) - f.subs(x, 1.3 - 1e-6)) / 2e-6
            assert abs(float(num_check) - float(d.subs(x, 1.3))) < 1e-4, (f, d)
            wrongs = []
            for alt in (sp.integrate(f, x), sp.diff(f, x, 2), d.subs(x, x + 1) if False else sp.simplify(d + f), sp.simplify(d / (a if a else 1)), -d):
                wrongs.append(pretty(alt))
            b.add(CA, sub, diff_lvl, f"Differentiate f(x) = {pretty(f)}.", pretty(d), wrongs, f"Use the {sub.replace('_', ' ')}. The result is {pretty(d)}.")
    # --- integrals
    seen = 0
    while seen < 20:
        a, c = r.randint(1, 4), r.randint(0, 5); lo, hi = r.randint(0, 2), r.randint(3, 4)
        f = a * x ** 2 + c; val = sp.integrate(f, (x, lo, hi))
        assert abs(float(val) - float(sum(f.subs(x, lo + (hi - lo) * (k + 0.5) / 4000) for k in range(4000)) * (hi - lo) / 4000)) < 1e-3
        v = Fraction(int(val.p), int(val.q))
        wrong = [num(v + 1), num(Fraction(int(sp.diff(f, x).subs(x, hi)), 1)), num(v * 2), num(Fraction(int(f.subs(x, hi) - f.subs(x, lo)), 1)), num(v - Fraction(1, 3))]
        if b.add(CA, "integrals", "intermediate", f"Evaluate the definite integral of {pretty(f)} from x = {lo} to x = {hi}.", num(v), wrong, f"The antiderivative is {pretty(sp.integrate(f, x))}; evaluate at {hi} and subtract the value at {lo}: {num(v)}."):
            seen += 1
    for f, F in [(x ** 3, "x^4/4 + C"), (sp.cos(x), "sin(x) + C"), (sp.exp(x), "e^x + C"), (1 / x, "ln|x| + C"), (sp.sin(x), "−cos(x) + C"), (x ** 5, "x^6/6 + C"), (sp.Integer(7), "7x + C"), (x ** -2, "−1/x + C")]:
        wrong = [w for w in ["x^4/4", "sin(x) + C", "−sin(x) + C", "cos(x) + C", "e^x/x + C", "x^2 + C", "1/x + C", "ln(x)·x + C"] if w != F]
        b.add(CA, "integrals", "beginner", f"Which is an antiderivative of {pretty(f)}?", F, wrong, f"Differentiating {F} gives back {pretty(f)}.")
    # --- limits
    limits = [(sp.sin(x) / x, 0, "1"), ((x ** 2 - 1) / (x - 1), 1, "2"), ((x ** 2 - 9) / (x - 3), 3, "6"), ((1 - sp.cos(x)) / x, 0, "0"), ((sp.exp(x) - 1) / x, 0, "1"), ((x ** 3 - 8) / (x - 2), 2, "12"), ((x ** 2 + 3 * x) / x, 0, "3"), (sp.sin(3 * x) / x, 0, "3"), ((x ** 2 - 4) / (x ** 2 - 2 * x), 2, "2"), ((sp.sqrt(x + 4) - 2) / x, 0, "1/4")]
    for f, pt, ans in limits:
        assert str(sp.limit(f, x, pt)) == ans or sp.nsimplify(sp.limit(f, x, pt)) == sp.nsimplify(ans), (f, sp.limit(f, x, pt))
        b.add(CA, "limits", "intermediate", f"What is the limit of {pretty(f)} as x → {pt}?", ans, [w for w in ("0", "1", "2", "3", "4", "6", "12", "1/2", "1/4", "does not exist") if w != ans], f"Simplify or use a standard limit; the value is {ans}.")
    for f, ans in [(sp.Integer(1) / x, "0"), (x / (x + 1), "1"), ((3 * x ** 2 + 1) / (x ** 2 - 5), "3"), (sp.exp(-x), "0"), ((2 * x + 1) / (x ** 2 + 1), "0")]:
        assert str(sp.limit(f, x, sp.oo)) == ans
        b.add(CA, "limits", "intermediate", f"What is the limit of {pretty(f)} as x → ∞?", ans, [w for w in ("0", "1", "2", "3", "∞", "−1") if w != ans], f"Compare the growth of the numerator and denominator; the limit is {ans}.")
    # --- partial derivatives & gradients
    seen = 0
    while seen < 18:
        f = r.randint(1, 4) * x ** 2 * y + r.randint(-3, 4) * x * y ** 2 + r.randint(-2, 5) * y
        px, py = r.randint(-2, 3), r.randint(-2, 3)
        which = r.choice([x, y]); d = sp.diff(f, which); val = int(d.subs({x: px, y: py}))
        other = sp.diff(f, y if which == x else x); oval = int(other.subs({x: px, y: py}))
        if b.add(CA, "partial_derivatives", "advanced", f"For f(x, y) = {pretty(f)}, what is ∂f/∂{which} at the point ({px}, {py})?", val, near(r, val) + [oval], f"Differentiate with respect to {which}, treating the other variable as a constant: {pretty(d)}; at ({px}, {py}) this is {val}."):
            seen += 1
    seen = 0
    while seen < 12:
        a, c = r.randint(1, 4), r.randint(1, 4); px, py = r.randint(-2, 3), r.randint(-2, 3)
        f = a * x ** 2 + c * y ** 2; g = (int(sp.diff(f, x).subs({x: px, y: py})), int(sp.diff(f, y).subs({x: px, y: py})))
        wrong = [f"({g[1]}, {g[0]})", f"({-g[0]}, {-g[1]})", f"({g[0] + 1}, {g[1]})", f"({px}, {py})", f"({g[0]}, {g[1] + 2})"]
        if b.add(CA, "gradients", "advanced", f"What is the gradient of f(x, y) = {pretty(f)} at ({px}, {py})?", f"({g[0]}, {g[1]})", wrong, f"∇f = (∂f/∂x, ∂f/∂y) = ({pretty(sp.diff(f, x))}, {pretty(sp.diff(f, y))}); at ({px}, {py}) this is {g}."):
            seen += 1
    seen = 0
    while seen < 12:
        a, c = r.randint(1, 4), r.randint(1, 5); w0 = r.randint(1, 5); lr = r.choice([0.1, 0.2, 0.5])
        f = a * (w - c) ** 2; g = float(sp.diff(f, w).subs(w, w0)); new = round(w0 - lr * g, 6)
        wrong = [num(w0 + lr * g), num(w0 - g), num(w0 - lr * g / 2), num(g), num(w0 * lr)]
        if b.add(CA, "gradient_descent", "intermediate", f"One gradient descent step on f(w) = {pretty(f)} starts at w = {w0} with learning rate {lr}. What is the new w?", num(new), wrong, f"f′(w) = {pretty(sp.diff(f, w))}, which is {num(g)} at w = {w0}, so w ← {w0} − {lr}×({num(g)}) = {num(new)}."):
            seen += 1
    # --- optimisation
    seen = 0
    while seen < 12:
        a, h, k = r.randint(1, 4), r.randint(-4, 5), r.randint(-6, 7)
        f = sp.expand(a * (x - h) ** 2 + k)
        crit = sp.solve(sp.diff(f, x), x)[0]; assert crit == h
        if b.add(CA, "optimization", "intermediate", f"At which x does f(x) = {pretty(f)} reach its minimum value?", h, near(r, h) + [k], f"Set f′(x) = {pretty(sp.diff(f, x))} = 0, so x = {h}; f″ = {2 * a} > 0, so it is a minimum."):
            seen += 1
    seen = 0
    while seen < 10:
        a, h, k = r.randint(1, 4), r.randint(-4, 5), r.randint(-6, 7)
        f = sp.expand(-a * (x - h) ** 2 + k)
        if b.add(CA, "optimization", "intermediate", f"What is the maximum value of f(x) = {pretty(f)}?", k, near(r, k) + [h], f"The vertex is at x = {h}, where f = {k}; the parabola opens downward so this is the maximum."):
            seen += 1
    # --- ML calculus
    sig = lambda z: 1 / (1 + math.exp(-z))
    for z in [0, 1, -1, 2, -2, 3]:
        s = sig(z); d = s * (1 - s)
        b.add(CA, "ml_derivatives", "advanced", f"The sigmoid is σ(z) = 1/(1 + e^(−z)). Using σ′(z) = σ(z)(1 − σ(z)), what is σ′({z}) to 3 decimal places?", f"{d:.3f}", [f"{s:.3f}", f"{1 - s:.3f}", f"{2 * d:.3f}", f"{d / 2:.3f}", f"{s * s:.3f}"], f"σ({z}) = {s:.3f}, so σ′ = {s:.3f} × {1 - s:.3f} = {d:.3f}.")
    for z in [-2, -0.5, 0, 0.5, 3]:
        b.add(CA, "ml_derivatives", "beginner", f"What is the derivative of ReLU(z) = max(0, z) at z = {z}?", "1" if z > 0 else ("0" if z < 0 else "not defined (the usual convention is 0)"), [w for w in ("0", "1", "z", "−1", "not defined (the usual convention is 0)") if w != ("1" if z > 0 else ("0" if z < 0 else "not defined (the usual convention is 0)"))], "ReLU has slope 1 for positive inputs, 0 for negative inputs, and a kink at 0.")
    for w_, xx, yy in [(2, 3, 5), (1, 4, 2), (3, 2, 9), (0, 5, 5), (2, 1, 0), (-1, 2, 1)]:
        grad = 2 * (w_ * xx - yy) * xx
        b.add(CA, "ml_derivatives", "advanced", f"For the squared error L(w) = (w·x − y)² with x = {xx}, y = {yy}, what is dL/dw at w = {w_}?", grad, near(r, grad) + [2 * (w_ * xx - yy), (w_ * xx - yy) * xx], f"dL/dw = 2(wx − y)·x = 2({w_ * xx} − {yy})·{xx} = {grad}.")
    b.add_concepts(CA, "concepts", "beginner", [
        ("What does the derivative of a function at a point measure?", "The instantaneous rate of change, i.e. the slope of the tangent line", ["The area under the curve", "The average value of the function", "The maximum of the function", "The distance from the origin"], "The derivative is the slope of the tangent at that point."),
        ("Why does gradient descent move opposite to the gradient?", "The gradient points toward the steepest increase, so the opposite way reduces the loss fastest", ["The gradient always points to the minimum", "Moving along the gradient would overfit", "The gradient is always negative", "It avoids dividing by zero"], "The gradient is the direction of steepest ascent."),
        ("A learning rate that is too large in gradient descent typically causes what?", "The loss to overshoot, oscillate or diverge", ["Training to finish faster with no downside", "The gradient to become zero", "The model to overfit", "Weights to stay the same"], "Large steps jump over the minimum."),
        ("What condition on f′ and f″ identifies a local maximum at x = c?", "f′(c) = 0 and f″(c) < 0", ["f′(c) = 0 and f″(c) > 0", "f′(c) > 0", "f″(c) = 0 only", "f(c) = 0"], "Zero slope with downward curvature is a peak."),
        ("What does the chain rule let you do?", "Differentiate a composition such as f(g(x))", ["Differentiate a sum", "Integrate a product", "Find limits at infinity", "Solve equations"], "d/dx f(g(x)) = f′(g(x))·g′(x), and it is the basis of backpropagation."),
        ("Backpropagation is an efficient application of which rule?", "The chain rule", ["The power rule", "The quotient rule", "L'Hôpital's rule", "The mean value theorem"], "It applies the chain rule layer by layer from the loss backwards."),
        ("The gradient of a function of several variables is…", "The vector of its partial derivatives", ["The sum of its partial derivatives", "Its largest partial derivative", "Its second derivative", "Its integral"], "∇f = (∂f/∂x₁, …, ∂f/∂xₙ)."),
        ("What is ∫ f′(x) dx from a to b equal to?", "f(b) − f(a)", ["f′(b) − f′(a)", "f(a) − f(b)", "f(b)·f(a)", "0"], "The fundamental theorem of calculus."),
        ("A function that is not differentiable at a point could be which of these?", "|x| at x = 0", ["x² at x = 0", "sin(x) at x = 0", "eˣ at x = 0", "x³ at x = 0"], "|x| has a sharp corner at 0, so no single tangent exists."),
        ("What is a saddle point?", "A point with zero gradient that is neither a local minimum nor a local maximum", ["A point where the function is zero", "The global minimum", "A point where the gradient is largest", "A discontinuity"], "In some directions the function curves up, in others down."),
    ])


# --------------------------------------------------------------------------------------------------- probability and stats
def pstat(b):
    r = b.rng
    P = PS
    # --- counting
    for n, k in [(5, 2), (6, 3), (8, 2), (10, 3), (7, 4), (9, 2), (12, 2), (10, 5), (6, 2), (8, 3), (7, 3), (9, 4)]:
        c = math.comb(n, k); assert c == len(list(itertools.combinations(range(n), k)))
        b.add(P, "combinatorics", "beginner", f"How many ways can you choose {k} items from {n} when order does not matter?", c, near(r, c) + [math.perm(n, k)], f"C({n}, {k}) = {n}! / ({k}!·{n - k}!) = {c}.")
    for n, k in [(5, 2), (6, 3), (8, 2), (10, 3), (7, 4), (9, 2), (6, 2), (8, 3), (5, 5), (7, 2)]:
        p = math.perm(n, k); assert p == len(list(itertools.permutations(range(n), k)))
        b.add(P, "combinatorics", "beginner", f"How many ordered arrangements of {k} items can be made from {n} different items?", p, near(r, p) + [math.comb(n, k)], f"P({n}, {k}) = {n}!/({n - k})! = {p}.")
    for n in [4, 5, 6, 7, 8]:
        b.add(P, "combinatorics", "beginner", f"In how many different orders can {n} distinct books be placed on a shelf?", math.factorial(n), near(r, math.factorial(n)) + [n * n], f"{n}! = {math.factorial(n)}.")
    for word in ["ALPHA", "LEVEL", "BANANA", "SEVEN", "MOON", "TOOTH", "DATA"]:
        from collections import Counter
        ways = math.factorial(len(word)) // math.prod(math.factorial(v) for v in Counter(word).values())
        b.add(P, "combinatorics", "intermediate", f"How many distinct arrangements of the letters of {word} are there?", ways, near(r, ways) + [math.factorial(len(word))], "Divide the factorial of the length by the factorial of each repeated letter's count.")
    # --- simple probabilities with Fractions
    for sides, target in [(6, 7), (6, 8), (6, 9), (6, 5), (6, 10), (6, 6), (6, 4), (6, 11)]:
        ways = sum(1 for a in range(1, sides + 1) for c in range(1, sides + 1) if a + c == target); f = Fraction(ways, sides * sides)
        b.add(P, "probability", "beginner", f"Two fair six-sided dice are rolled. What is the probability that the sum is {target}?", num(f), [num(Fraction(ways + 1, 36)), num(Fraction(ways, 12)), num(Fraction(ways, 6)), num(Fraction(max(ways - 1, 0), 36)), num(Fraction(1, 6))], f"{ways} of the 36 equally likely outcomes give a sum of {target}: {num(f)}.")
    for n, k in [(3, 2), (4, 2), (4, 3), (5, 2), (5, 3), (3, 1), (4, 1), (5, 4)]:
        f = Fraction(math.comb(n, k), 2 ** n)
        b.add(P, "probability", "intermediate", f"A fair coin is flipped {n} times. What is the probability of exactly {k} heads?", num(f), [num(Fraction(1, 2 ** n)), num(Fraction(k, n)), num(Fraction(math.comb(n, k), 2 ** (n - 1))), num(Fraction(math.comb(n, k + 1) if k + 1 <= n else 1, 2 ** n)), num(Fraction(1, 2))], f"C({n}, {k}) = {math.comb(n, k)} favourable sequences out of 2^{n} = {2 ** n}.")
    for red, blue in [(3, 5), (4, 4), (2, 6), (5, 5), (6, 4), (3, 3), (7, 3)]:
        tot = red + blue; f = Fraction(red, tot) * Fraction(red - 1, tot - 1)
        b.add(P, "probability", "intermediate", f"A bag has {red} red and {blue} blue balls. Two are drawn without replacement. What is the probability both are red?", num(f), [num(Fraction(red, tot) ** 2), num(Fraction(red, tot)), num(Fraction(red * 2, tot * (tot - 1))), num(Fraction(red, tot) * Fraction(blue, tot - 1)), num(1 - f)], f"({red}/{tot}) × ({red - 1}/{tot - 1}) = {num(f)}.")
    for pa, pb in [(0.5, 0.4), (0.3, 0.2), (0.6, 0.5), (0.25, 0.4), (0.7, 0.1), (0.2, 0.2)]:
        ind = pa * pb; union = pa + pb - ind
        b.add(P, "probability", "intermediate", f"Events A and B are independent with P(A) = {pa} and P(B) = {pb}. What is P(A or B)?", num(union), [num(pa + pb), num(ind), num(1 - ind), num(abs(pa - pb)), num(max(pa, pb))], f"P(A∪B) = P(A) + P(B) − P(A)P(B) = {pa} + {pb} − {num(ind)} = {num(union)}.")
        b.add(P, "probability", "beginner", f"Events A and B are independent with P(A) = {pa} and P(B) = {pb}. What is P(A and B)?", num(ind), [num(pa + pb), num(union), num(pa / pb), num(abs(pa - pb)), num(1 - ind)], f"For independent events, P(A∩B) = P(A)·P(B) = {num(ind)}.")
    # --- Bayes
    for prev, sens, spec in [(0.01, 0.9, 0.95), (0.05, 0.8, 0.9), (0.02, 0.99, 0.97), (0.1, 0.9, 0.9), (0.005, 0.95, 0.98), (0.2, 0.7, 0.8), (0.03, 0.85, 0.92), (0.15, 0.6, 0.95)]:
        pos = prev * sens + (1 - prev) * (1 - spec); post = prev * sens / pos
        b.add(P, "bayes", "advanced", f"A condition affects {num(prev * 100)}% of people. A test has sensitivity {num(sens * 100)}% and specificity {num(spec * 100)}%. Given a positive result, what is the probability of having the condition?", f"{post * 100:.1f}%", [f"{sens * 100:.1f}%", f"{(1 - spec) * 100:.1f}%", f"{prev * 100:.1f}%", f"{min(post * 200, 99.9):.1f}%", f"{(1 - post) * 100:.1f}%"], f"P(positive) = {prev}·{sens} + {num(1 - prev)}·{num(1 - spec)} = {pos:.4f}. Bayes: {prev}·{sens}/{pos:.4f} = {post:.3f}.")
    for pa_b, pb_, pa_ in [(0.8, 0.3, 0.5), (0.6, 0.4, 0.2), (0.9, 0.5, 0.25), (0.7, 0.35, 0.5)]:
        res = pa_b * pb_ / pa_
        if res > 1: continue
        b.add(P, "bayes", "intermediate", f"Given P(A|B) = {pa_b}, P(B) = {pb_} and P(A) = {pa_}, what is P(B|A)?", num(res), [num(pa_b), num(pa_b * pa_ / pb_), num(pb_), num(pa_b * pb_), num(1 - res)], f"Bayes' rule: P(B|A) = P(A|B)P(B)/P(A) = {pa_b}×{pb_}/{pa_} = {num(res)}.")
    # --- expectation
    seen = 0
    while seen < 14:
        vals = sorted(r.sample(range(-3, 12), 3)); w = r.choice([(1, 2, 1), (2, 1, 1), (1, 1, 2), (3, 2, 5), (1, 3, 1), (2, 2, 1)]); s = sum(w)
        ev = Fraction(sum(v * c for v, c in zip(vals, w)), s)
        table = ", ".join(f"{v} with probability {c}/{s}" for v, c in zip(vals, w))
        wrong = [num(Fraction(sum(vals), 3)), num(ev + 1), num(Fraction(vals[1], 1)), num(ev - 1), num(Fraction(sum(v * v * c for v, c in zip(vals, w)), s))]
        if b.add(P, "expected_value", "intermediate", f"A random variable takes the value {table}. What is its expected value?", num(ev), wrong, f"E[X] = Σ x·p(x) = {num(ev)}."):
            seen += 1
    for n, p in [(10, 0.5), (20, 0.3), (100, 0.1), (50, 0.2), (8, 0.25), (30, 0.4)]:
        b.add(P, "expected_value", "beginner", f"A Binomial({n}, {p}) variable counts successes. What is its mean?", num(n * p), [num(n * p * (1 - p)), num(n), num(p), num(n / p), num(math.sqrt(n * p * (1 - p)))], f"The mean of a binomial is n·p = {n}×{p} = {num(n * p)}.")
        b.add(P, "variance", "intermediate", f"A Binomial({n}, {p}) variable has what variance?", num(n * p * (1 - p)), [num(n * p), num(n * p * p), num(math.sqrt(n * p * (1 - p))), num(n * (1 - p)), num(p * (1 - p))], f"Variance = n·p·(1 − p) = {n}×{p}×{num(1 - p)} = {num(n * p * (1 - p))}.")
    for n, k, p in [(5, 2, 0.5), (4, 1, 0.3), (6, 3, 0.5), (3, 3, 0.6), (5, 0, 0.2), (4, 2, 0.25), (6, 1, 0.1), (3, 2, 0.4)]:
        v = math.comb(n, k) * p ** k * (1 - p) ** (n - k)
        b.add(P, "distributions", "advanced", f"For a Binomial(n = {n}, p = {p}) variable, what is P(X = {k}) to 4 decimal places?", f"{v:.4f}", [f"{p ** k:.4f}", f"{math.comb(n, k) * p ** k:.4f}", f"{(1 - p) ** (n - k):.4f}", f"{min(v * 2, 0.9999):.4f}", f"{1 - v:.4f}"], f"C({n},{k})·p^{k}·(1−p)^{n-k} = {v:.4f}.")
    # --- descriptive statistics
    seen = 0
    while seen < 22:
        n = r.choice([5, 6, 7, 8, 9]); data = [r.randint(1, 20) for _ in range(n)]
        mean = statistics.mean(data); med = statistics.median(data)
        wrong_m = [num(med), num(max(data)), num(min(data)), num(mean + 1), num(sum(data))]
        ok = b.add(P, "descriptive_statistics", "beginner", f"What is the mean of {data}?", num(mean), wrong_m, f"Sum = {sum(data)}, divided by {n} gives {num(mean)}.")
        if ok:
            seen += 1
            b.add(P, "descriptive_statistics", "beginner", f"What is the median of {data}?", num(med), [num(mean), num(max(data)), num(min(data)), num(data[len(data) // 2]), num(med + 1)], f"Sort the data {sorted(data)} and take the middle value (or the average of the two middle values): {num(med)}.")
    seen = 0
    while seen < 14:
        data = [r.randint(1, 15) for _ in range(r.choice([4, 5, 6]))]
        mu = statistics.mean(data); var = statistics.pvariance(data); sd = statistics.pstdev(data)
        assert abs(var - float(np.var(data))) < 1e-9
        if b.add(P, "variance", "intermediate", f"What is the population variance of {data}?", num(var, 3), [num(statistics.variance(data), 3), num(sd, 3), num(var + 1, 3), num(mu, 3), num(var * 2, 3)], f"Mean = {num(mu)}; average the squared deviations: {num(var, 3)}."):
            seen += 1
            b.add(P, "variance", "intermediate", f"What is the population standard deviation of {data}, to 2 decimal places?", f"{sd:.2f}", [f"{var:.2f}", f"{statistics.stdev(data):.2f}", f"{sd + 1:.2f}", f"{mu:.2f}", f"{sd / 2:.2f}"], f"σ = √{num(var, 3)} = {sd:.2f}.")
    for data in ([2, 3, 3, 5, 7], [1, 1, 2, 2, 2, 9], [4, 4, 5, 6, 6, 6], [10, 20, 20, 30], [7, 8, 8, 9, 9, 9, 10]):
        mode = statistics.mode(data)
        b.add(P, "descriptive_statistics", "beginner", f"What is the mode of {data}?", mode, [statistics.mean(data).__round__(1), statistics.median(data), max(data), min(data) if min(data) != mode else max(data) + 1], "The mode is the value that appears most often.")
    for data in ([3, 9, 4, 20, 6], [100, 2, 7, 15], [5, 5, 12, 40, 1], [8, 16, 2, 30]):
        b.add(P, "descriptive_statistics", "beginner", f"What is the range of {data}?", max(data) - min(data), [max(data), min(data), sum(data) / len(data), max(data) + min(data)], "Range = maximum − minimum.")
    for xs, ys, kind in [([1, 2, 3, 4, 5], [2, 4, 6, 8, 10], "+1 (perfect positive)"), ([1, 2, 3, 4], [8, 6, 4, 2], "−1 (perfect negative)"), ([1, 2, 3, 4], [5, 5, 5, 5], "undefined (no variation in y)")]:
        wrong = [w for w in ("+1 (perfect positive)", "−1 (perfect negative)", "0 (no correlation)", "undefined (no variation in y)") if w != kind]
        b.add(P, "correlation", "intermediate", f"What is the Pearson correlation between x = {xs} and y = {ys}?", kind, wrong, "Perfectly linear data gives ±1; a constant variable has zero variance, so the correlation is undefined.")
    # --- normal distribution
    for mu, sd, xv in [(100, 15, 130), (50, 10, 35), (70, 5, 80), (0, 1, 2), (500, 100, 650), (20, 4, 12), (65, 8, 73), (1000, 50, 900)]:
        z = (xv - mu) / sd
        b.add(P, "normal_distribution", "intermediate", f"A variable has mean {mu} and standard deviation {sd}. What is the z-score of {xv}?", num(z), [num(-z), num(xv - mu), num(z * 2), num(sd / (xv - mu)), num(z + 1)], f"z = (x − μ)/σ = ({xv} − {mu})/{sd} = {num(z)}.")
    for z, share in [(1, "about 68%"), (2, "about 95%"), (3, "about 99.7%")]:
        b.add(P, "normal_distribution", "beginner", f"In a normal distribution, roughly what share of values lie within {z} standard deviation{'s' if z > 1 else ''} of the mean?", share, [w for w in ("about 50%", "about 68%", "about 95%", "about 99.7%", "about 34%") if w != share], "The 68-95-99.7 rule.")
    # --- concepts
    b.add_concepts(P, "concepts", "beginner", [
        ("Which statistic is least affected by extreme outliers?", "The median", ["The mean", "The range", "The variance", "The standard deviation"], "The median depends only on the middle of the sorted data."),
        ("Two events are independent when…", "P(A and B) = P(A)·P(B)", ["P(A and B) = 0", "P(A or B) = 1", "They cannot happen at the same time", "P(A) = P(B)"], "Knowing one happened does not change the probability of the other."),
        ("Mutually exclusive events with non-zero probability are…", "Never independent", ["Always independent", "Independent only when P(A) = P(B)", "Independent when their union is 1", "Always equally likely"], "If A happens, B cannot, so knowing A changes P(B) to 0."),
        ("The law of large numbers says that…", "The sample mean approaches the true mean as the sample size grows", ["Every sample has the same mean", "The sample variance is always 1", "Large samples are always normal", "Outliers disappear"], "More data gives a more stable estimate of the population mean."),
        ("What does the central limit theorem say about sample means?", "They are approximately normally distributed for large samples, whatever the original distribution", ["They are always exactly uniform", "They equal the population mean", "They are always skewed", "They have zero variance"], "Averages of many independent samples tend toward a normal distribution."),
        ("Why does the sample variance divide by n − 1 rather than n?", "To correct the bias from estimating the mean from the same data", ["To make the answer larger for no reason", "Because n − 1 is always an integer", "To remove outliers", "Because the mean is unknown to the computer"], "Bessel's correction makes the estimator unbiased."),
        ("A p-value is…", "The probability of data at least this extreme if the null hypothesis were true", ["The probability the null hypothesis is true", "The probability the alternative is true", "The size of the effect", "The sample size"], "It is a statement about the data given the null, not about the hypothesis itself."),
        ("What does correlation not tell you?", "Whether one variable causes the other", ["Whether the variables move together", "The direction of a linear relationship", "The strength of a linear relationship", "Whether the relationship is positive"], "Correlation is not causation."),
        ("What is a 95% confidence interval?", "A range built by a method that captures the true value in 95% of repeated samples", ["A range that contains 95% of the data", "A 95% chance the true value is inside this particular range", "The range from the 5th to the 95th percentile", "The margin of error squared"], "The 95% describes the procedure, not any single interval."),
        ("Maximum likelihood estimation chooses the parameters that…", "Make the observed data most probable", ["Minimise the number of parameters", "Maximise the prior", "Make the data uniform", "Set the mean to zero"], "It maximises P(data | parameters)."),
        ("A model predicts the class with probability 0.9 and is right 60% of the time at that confidence. The model is…", "Overconfident (poorly calibrated)", ["Well calibrated", "Underconfident", "Perfectly accurate", "Unbiased"], "Calibration means stated confidence matches observed frequency."),
        ("The standard deviation is measured in…", "The same units as the data", ["Squared units of the data", "Percent", "No units", "The inverse of the data's units"], "Variance has squared units; the standard deviation takes the square root to return to the data's units."),
    ])
