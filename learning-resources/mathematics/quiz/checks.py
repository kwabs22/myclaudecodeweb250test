"""Brute-force checks for the numeric answers in make_questions.py. Run: python3 checks.py"""
import itertools, math
from math import comb, factorial as f, perm

def fib(n):
    a, b = 0, 1
    for _ in range(n): a, b = b, a + b
    return a

C = {}
C[1] = 5 * 3
C[2] = len(list(itertools.permutations([1,2,3,4,5], 3)))
C[3] = 4 * 6 * 3
C[4] = 5 * 5
C[5] = len(set(itertools.permutations("MATH")))
C[6] = 10 ** 4
C[7] = sum(1 for p in itertools.permutations([1,2,3,4,5,6], 3) if p[2] % 2 == 0)
C[8] = 2 ** 5
C[9] = sum(1 for d in range(1, 73) if 72 % d == 0)
C[10] = comb(5, 3)
C[11] = 26 * 26 * 10 * 10
C[12] = sum(1 for s in itertools.product("01", repeat=6) if s.count("1") == 3)
C[13] = 2 ** 5
C[14] = sum(1 for n in range(1, 101) if n % 2 == 0 or n % 3 == 0 or n % 5 == 0)
C[15] = perm(8, 2)
C[16] = f(5)
C[17] = f(4)
C[18] = len(set(itertools.permutations("BANANA")))
C[19] = f(11) // (f(4) * f(4) * f(2))
C[20] = 2 * f(5)
C[21] = f(11) // 8
C[22] = 2 * f(5) * f(5)
C[23] = perm(10, 3)
C[24] = f(7)
C[25] = sum(1 for p in itertools.permutations(range(1, 6)) if True) - 0  # placeholder replaced below
# circular, 6 people, persons 0 and 1 not adjacent: fix person 0 in seat 0
C[25] = sum(1 for p in itertools.permutations(range(1, 6)) if not (p[0] == 1 or p[-1] == 1))
C[26] = sum(1 for p in itertools.permutations(range(1, 10), 4) if p[3] == 5)
C[27] = len(set(itertools.permutations("RRRBB")))
C[28] = sum(1 for p in itertools.permutations(range(4)) if all(p[i] != i for i in range(4)))
C[29] = 2 * f(9)
C[30] = sum(1 for p in itertools.permutations(range(1, 7)) if all(p[i - 1] != i for i in (2, 4, 6)))
C[31] = comb(7, 3)
C[32] = comb(8, 2)
C[33] = comb(4, 3) * comb(48, 2)
C[34] = comb(12, 5)
C[35] = 13 ** 4
C[36] = sum(comb(7, k) * comb(8, 6 - k) for k in range(3, 7))
C[37] = None
C[39] = comb(10, 3)
C[40] = comb(13, 3)
C[41] = sum(1 for x in itertools.product(range(11), repeat=4) if sum(x) == 10)
C[42] = 13 * comb(4, 2) * comb(12, 3) * 4 ** 3
C[43] = comb(10, 4)
C[44] = comb(49, 6) - comb(25, 6)
C[46] = sum(1 for s in itertools.product("01", repeat=10) if "111" in "".join(s))
C[48] = comb(10, 5)
C[49] = sum(1 for g in itertools.product(range(3), repeat=5) if len(set(g)) == 3)
C[50] = {n: fib(n + 1) for n in range(1, 8)}
C[51] = sum(1 for x in itertools.product(range(1, 21), repeat=2) if 20 - sum(x) >= 3 and x[1] >= 2) 
C[52] = comb(10, 5)
C[53] = comb(5, 2) * comb(5, 3)
C[54] = f(8)
C[55] = comb(8, 4) // 5
C[57] = sum(1 for c in itertools.combinations(range(1, 9), 3) if all(b - a > 1 for a, b in zip(c, c[1:])))
C[59] = None
# partitions of 10
def parts(n, m=None):
    m = m or n
    if n == 0: return 1
    return sum(parts(n - k, k) for k in range(1, min(n, m) + 1))
C[59] = parts(10)
C[60] = sum(1 for c in itertools.product(range(3), repeat=4) if all(c[i] != c[(i + 1) % 4] for i in range(4)))
C[61] = sum(1 for x in itertools.product(range(13), repeat=2) if 12 - sum(x) >= 0)
C[62] = 3 ** 12
def stirling(n, k):
    if n == k == 0: return 1
    if n == 0 or k == 0: return 0
    return k * stirling(n - 1, k) + stirling(n - 1, k - 1)
C[63] = sum(stirling(4, k) for k in range(5))
C[64] = comb(9, 3)
C[65] = f(9) // (f(3) ** 3 * f(3))
C[66] = stirling(5, 3)
C[67] = comb(9, 4)
C[68] = 2 ** 6
C[69] = 2 ** 19
C[70] = C[63]
C[73] = sum(1 for d in range(11) for n in range(21) if 10 * d + 5 * n <= 100)
C[75] = comb(9, 4)
C[80] = sum(1 for e in itertools.product(range(4), repeat=4) if sum(e) == 8)
C[81] = comb(10, 2)
C[83] = 4 ** 2
C[85] = 5 ** 3
C[87] = sum(1 for c in itertools.product(range(3), repeat=3) if len(set(c)) == 3)
# non-isomorphic graphs on 4 vertices
edges = list(itertools.combinations(range(4), 2))
seen = set()
for mask in range(1 << 6):
    es = [edges[i] for i in range(6) if mask >> i & 1]
    best = min(tuple(sorted(tuple(sorted((p[a], p[b]))) for a, b in es)) for p in itertools.permutations(range(4)))
    seen.add(best)
C[88] = len(seen)
# Eulerian circuits of K5: count closed trails using every edge once, as cyclic sequences, directed
K5 = list(itertools.combinations(range(5), 2))
def trails():
    count = 0
    def go(v, used, n):
        nonlocal count
        if n == 10:
            if v == 0: count += 1
            return
        for e_i, (a, b) in enumerate(K5):
            if used >> e_i & 1: continue
            if v == a: go(b, used | 1 << e_i, n + 1)
            elif v == b: go(a, used | 1 << e_i, n + 1)
    go(0, 0, 0)
    return count
t = trails()
C[90] = t  # circuits starting and ending at vertex 0, edge sequences; each circuit appears 4 times per vertex... see answer
# standard Young tableaux 3x3
def syt(shape):
    n = sum(shape)
    cnt = 0
    for perm_ in itertools.permutations(range(n)):
        grid = [[perm_[sum(shape[:r]) + c] for c in range(shape[r])] for r in range(len(shape))]
        if all(grid[r][c] < grid[r][c + 1] for r in range(len(shape)) for c in range(shape[r] - 1)) and all(grid[r][c] < grid[r + 1][c] for r in range(len(shape) - 1) for c in range(shape[r + 1])):
            cnt += 1
    return cnt
C[91] = syt([3, 3, 3])
def couples(n):
    people = list(range(2 * n))
    cnt = 0
    for p in itertools.permutations(people[1:]):
        seat = (0,) + p
        ok = True
        for i in range(2 * n):
            a, b = seat[i], seat[(i + 1) % (2 * n)]
            if a // 2 == b // 2: ok = False; break
        cnt += ok
    return cnt
C[92] = {n: couples(n) for n in (2, 3, 4)}
formula = lambda n: sum((-1) ** k * comb(n, k) * 2 ** k * f(2 * n - k - 1) for k in range(n + 1))
assert all(formula(n) == C[92][n] for n in (2, 3, 4)), (formula(2), formula(3), formula(4), C[92])
C[94] = {n: sum(1 for s in itertools.product("01", repeat=n) if "11" not in "".join(s)) for n in range(1, 9)}
assert all(C[94][n] == fib(n + 2) for n in C[94])
# tilings of 3 x n by 1x3 tiles
def tilings(n):
    from functools import lru_cache
    @lru_cache(None)
    def go(cells):
        if not cells: return 1
        r, c = min(cells)
        s = set(cells)
        total = 0
        if {(r, c), (r, c + 1), (r, c + 2)} <= s: total += go(frozenset(s - {(r, c), (r, c + 1), (r, c + 2)}))
        if {(r, c), (r + 1, c), (r + 2, c)} <= s: total += go(frozenset(s - {(r, c), (r + 1, c), (r + 2, c)}))
        return total
    return go(frozenset((r, c) for r in range(3) for c in range(n)))
C[95] = {n: tilings(n) for n in range(1, 10)}
a = [1, 1, 1]
for n in range(3, 10): a.append(a[-1] + a[-3])
assert all(C[95][n] == a[n] for n in range(1, 10)), (C[95], a)
C[96] = None
# Latin squares of order 4
cnt = 0
rows = list(itertools.permutations(range(4)))
for r1 in rows:
    for r2 in rows:
        if any(a == b for a, b in zip(r1, r2)): continue
        for r3 in rows:
            if any(a == b or a == c for a, b, c in zip(r1, r2, r3)): continue
            for r4 in rows:
                if all(len({r1[i], r2[i], r3[i], r4[i]}) == 4 for i in range(4)): cnt += 1
C[96] = cnt
C[99] = {n: sum(comb(n, k) for k in range(n + 1)) for n in range(6)}

if __name__ == "__main__":
    for k in sorted(C): print(k, C[k])
