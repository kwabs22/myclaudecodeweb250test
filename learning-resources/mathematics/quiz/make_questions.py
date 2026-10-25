#!/usr/bin/env python3
"""Build questions.json (for the quiz page) and ../combinatorics_answers.md from the question document plus the answers below.

The source document has questions only. Every numeric answer here was checked by brute force in checks.py.
Run from this folder:  python3 make_questions.py
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).parent
SRC = HERE.parent / "combinatorics_learning_questions.md"

A = {
1: "5 × 3 = 15 outfits (multiplication principle).",
2: "5 × 4 × 3 = 60.",
3: "4 × 6 × 3 = 72 meals.",
4: "5 × 5 = 25 codes.",
5: "4! = 24.",
6: "10⁴ = 10,000 passwords.",
7: "The last digit must be 2, 4 or 6 (3 choices), then 5 × 4 for the other two places: 3 × 5 × 4 = 60.",
8: "2⁵ = 32 sequences.",
9: "72 = 2³ × 3², so (3 + 1)(2 + 1) = 12 divisors.",
10: "Choose which 3 of the 5 children get a candy: C(5, 3) = 10.",
11: "26 × 26 × 10 × 10 = 67,600 (assuming letters and digits may repeat).",
12: "Choose the positions of the three 1s: C(6, 3) = 20.",
13: "2⁵ = 32 (each element is in or out), including the empty set.",
14: "|A| = 50 (by 2), |B| = 33 (by 3), |C| = 20 (by 5); pairs 16, 10, 6; triple 3. Total 50 + 33 + 20 - 16 - 10 - 6 + 3 = 74.",
15: "Order matters: P(8, 2) = 8 × 7 = 56.",
16: "5! = 5 × 4 × 3 × 2 × 1 = 120.",
17: "4! = 24.",
18: "6 letters with A three times and N twice: 6! / (3! 2!) = 60.",
19: "11 letters: I ×4, S ×4, P ×2, M ×1. 11! / (4! 4! 2!) = 34,650.",
20: "Glue the two books into one block (2 internal orders): 5! × 2 = 240.",
21: "11 letters with M, A and T each twice: 11! / (2! 2! 2!) = 4,989,600.",
22: "Two patterns (men first or women first), each with 5! × 5! arrangements: 2 × 120 × 120 = 28,800.",
23: "P(10, 3) = 10 × 9 × 8 = 720.",
24: "Rotations count as the same seating: (8 - 1)! = 7! = 5,040.",
25: "Fix one person; arrangements of the rest: 5! = 120. Subtract those where the two are adjacent: 2 × 4! = 48. Answer 120 - 48 = 72.",
26: "The last digit must be 5, then 8 × 7 × 6 choices for the first three digits: 336.",
27: "Choose the 2 positions for the blue balls: C(5, 2) = 10.",
28: "D₄ = 4!(1 - 1 + 1/2 - 1/6 + 1/24) = 9.",
29: "With 10 students there is no single middle seat. If the tallest takes either of the two middle seats (5th or 6th): 2 × 9! = 725,760. If a specific seat is named: 9! = 362,880.",
30: "Inclusion-exclusion over the 3 even numbers sitting in their own place: 6! - 3·5! + 3·4! - 3! = 720 - 360 + 72 - 6 = 426.",
31: "C(7, 3) = 7·6·5 / 3! = 35.",
32: "C(8, 2) = 28.",
33: "Choose 3 of the 4 aces and 2 of the other 48 cards: C(4, 3) × C(48, 2) = 4 × 1,128 = 4,512.",
34: "C(12, 5) = 792.",
35: "One card from each suit: 13⁴ = 28,561.",
36: "At least 3 women means 3, 4, 5 or 6: C(7,3)C(8,3) + C(7,4)C(8,2) + C(7,5)C(8,1) + C(7,6)C(8,0) = 1,960 + 980 + 168 + 7 = 3,115.",
37: "Choose any 2 vertices, minus the n sides: C(n, 2) - n = n(n - 3) / 2.",
38: "C(10, 3) = 120 and C(10, 7) = 120. In general choosing k to take is the same as choosing n - k to leave.",
39: "The two books are fixed; choose the other 3 from 10: C(10, 3) = 120.",
40: "Stars and bars: C(10 + 4 - 1, 4 - 1) = C(13, 3) = 286.",
41: "Same count as Question 40: C(13, 3) = 286.",
42: "Choose the pair's rank (13), its 2 suits (C(4,2)), then 3 other different ranks (C(12,3)) with any suit (4³): 13 × 6 × 220 × 64 = 1,098,240.",
43: "C(10, 4) = 210.",
44: "Subtract the all-odd choices (25 odd numbers): C(49, 6) - C(25, 6) = 13,983,816 - 177,100 = 13,806,716.",
45: "Count the k-subsets of an n-set by whether they contain a fixed element x. Those that contain x: choose the other k - 1 from n - 1, so C(n-1, k-1). Those that do not: C(n-1, k). The two cases cover every subset exactly once.",
46: "Strings with no run of three 1s follow t(n) = t(n-1) + t(n-2) + t(n-3) with t(0..2) = 1, 2, 4, giving t(10) = 504. So 1,024 - 504 = 520.",
47: "Put the 13 people into 12 boxes, one per month. With more people than boxes, some box holds at least 2 (pigeonhole principle).",
48: "C(10, 5) = 252.",
49: "Inclusion-exclusion: 3⁵ - 3·2⁵ + 3·1⁵ = 243 - 96 + 3 = 150. (Also 3! × S(5, 3) = 6 × 25.)",
50: "Let T(n) be the count. Either the last column is a vertical domino, T(n-1), or the last two columns hold two horizontal dominoes, T(n-2). So T(n) = T(n-1) + T(n-2), with T(1) = 1, T(2) = 2: the Fibonacci numbers, T(n) = F(n+1).",
51: "Substitute y₁ = x₁ - 1, y₂ = x₂ - 2, y₃ = x₃ - 3 ≥ 0, so the sum is 14: C(14 + 2, 2) = C(16, 2) = 120.",
52: "10 moves, 5 of them right: C(10, 5) = 252.",
53: "Paths to (2,3) times paths from (2,3) to (5,5): C(5, 2) × C(5, 3) = 10 × 10 = 100.",
54: "One rook per row, each in a different column: 8! = 40,320.",
55: "The 4th Catalan number: C₄ = C(8, 4) / 5 = 14.",
56: "Ballot numbers: for m ≥ n it is (m - n + 1) / (m + 1) × C(m + n, n). For m = n this is the Catalan number C(2n, n) / (n + 1).",
57: "Choose 3 numbers from 6 after shifting to remove the gaps: C(8 - 3 + 1, 3) = C(6, 3) = 20.",
58: "(n - 1)! / 2 for n ≥ 3: rotations and reflections give the same arrangement.",
59: "p(10) = 42.",
60: "Proper colourings of a 4-cycle with k colours: (k - 1)⁴ + (k - 1). For k = 3: 16 + 2 = 18.",
61: "Stars and bars: C(12 + 2, 2) = C(14, 2) = 91.",
62: "Each ball picks a box: 3¹² = 531,441.",
63: "The Bell number B(4) = 1 + 7 + 6 + 1 = 15.",
64: "Give each child 1 first, leaving 6 to distribute freely: C(6 + 3, 3) = C(9, 3) = 84.",
65: "9! / ((3!)³ × 3!) = 280, dividing by 3! because the groups are not labelled.",
66: "S(5, 3) = 3 × S(4, 3) + S(4, 2) = 3 × 6 + 7 = 25, using S(n, k) = k·S(n-1, k) + S(n-1, k-1).",
67: "Each box gets at least one, leaving 5 to distribute: C(5 + 4, 4) = C(9, 4) = 126.",
68: "A composition of n is a choice of cut points among the n - 1 gaps: 2⁶ = 64.",
69: "2¹⁹ = 524,288.",
70: "B(4) = 15 (partitions into 1, 2, 3 and 4 blocks: 1 + 7 + 6 + 1).",
71: "1 / (1 - x) = 1 + x + x² + x³ + ...",
72: "1 / (1 - x)² = Σ (n + 1) xⁿ: the sequence 1, 2, 3, 4, ...",
73: "The coefficient of x¹⁰⁰ in 1 / ((1 - x)(1 - x⁵)(1 - x¹⁰)) is 121.",
74: "1 / (1 - x)³, whose xⁿ coefficient is C(n + 2, 2).",
75: "Each factor is x / (1 - x), so we want the x¹⁰ coefficient of x⁵ / (1 - x)⁵, which is the x⁵ coefficient of (1 - x)⁻⁵: C(9, 4) = 126.",
76: "Let F(x) = Σ Fₙ xⁿ. The recurrence Fₙ = Fₙ₋₁ + Fₙ₋₂ gives F - x F - x² F = x, so F(x) = x / (1 - x - x²).",
77: "Σ 2ⁿ xⁿ = 1 / (1 - 2x).",
78: "With A(x) = Σ aₙ xⁿ: A - xA - x²A = x, so A = x / (1 - x - x²). Partial fractions give aₙ = (φⁿ - ψⁿ) / √5 where φ = (1 + √5)/2 and ψ = (1 - √5)/2 (Binet's formula).",
79: "Σ n! xⁿ / n! = Σ xⁿ = 1 / (1 - x).",
80: "The x⁸ coefficient of (1 + x + x² + x³)⁴ is 31 (equivalently the number of ways to pick four exponents from 0 to 3 summing to 8).",
81: "C(10, 2) = 45.",
82: "Every vertex is adjacent to every other, so χ(Kₙ) = n.",
83: "Cayley's formula nⁿ⁻²: 4² = 16.",
84: "Each edge has two endpoints, so it adds exactly 1 to the degree of each. Summing degrees counts every edge twice: Σ deg(v) = 2|E|.",
85: "Cayley: 5³ = 125.",
86: "Split the n vertices into parts of sizes a and n - a; the most edges is a(n - a), maximised at a = n / 2: ⌊n² / 4⌋.",
87: "The three edges of a triangle all share vertices, so they need different colours: 3! = 6.",
88: "11 non-isomorphic simple graphs on 4 vertices.",
89: "Induction on n. A tree with n ≥ 2 vertices has a leaf. Removing it leaves a tree with n - 1 vertices, which has n - 2 edges by hypothesis, so the original has n - 1. A single vertex has 0 edges.",
90: "264 directed Eulerian circuits (132 if a circuit and its reverse count as one). K₅ is 4-regular, so Euler's theorem applies.",
91: "These are the standard Young tableaux of shape 3 × 3, counted by the hook length formula: 9! / (5·4·3·4·3·2·3·2·1) = 42.",
92: "Inclusion-exclusion over the couples seated together: Σₖ (-1)ᵏ C(n, k) 2ᵏ (2n - k - 1)!. Rotations are the same arrangement, reflections are different. n = 2: 2, n = 3: 32, n = 4: 1,488.",
93: "Expand (x + y)(x + y)...(x + y) with n factors. To get xᵏ yⁿ⁻ᵏ pick x from k of the factors: C(n, k) ways. Summing over k gives Σ C(n, k) xᵏ yⁿ⁻ᵏ. (Induction using Pascal's identity also works.)",
94: "Let a(n) be the count. If the string ends in 0 the rest is any valid string of length n - 1; if it ends in 01 the rest has length n - 2. So a(n) = a(n-1) + a(n-2) with a(1) = 2, a(2) = 3: a(n) = F(n + 2).",
95: "The first column is either one vertical tile, leaving 3 × (n-1), or the top-left cell starts a horizontal tile and forces three stacked horizontal tiles, leaving 3 × (n-3). So a(n) = a(n-1) + a(n-3): 1, 1, 1, 2, 3, 4, 6, 9, 13, 19 for n = 0 to 9.",
96: "576 Latin squares of order 4 (4 of them reduced, with the first row and column in order: 4 × 4! × 3! = 576).",
97: "The nth Catalan number Cₙ = C(2n, n) / (n + 1). Splitting at the last multiplication gives Cₙ = Σ Cᵢ Cₙ₋₁₋ᵢ, the Catalan recurrence.",
98: "Take an element lying in exactly m ≥ 1 of the sets. The formula counts it Σₖ₌₁ᵐ (-1)ᵏ⁺¹ C(m, k) = 1 - (1 - 1)ᵐ = 1 times, so every element of the union is counted once and nothing else is.",
99: "2ⁿ: set x = y = 1 in the binomial theorem, or note that each element is in or out of a subset.",
100: "Disproved. For n = 4 there is exactly one self-complementary graph up to isomorphism (the path on 4 vertices), but the formula gives 2^(C(4,2)/2) = 2³ = 8. Even counting labelled graphs (12 on 4 vertices) it does not give 8. Only the condition n ≡ 0 or 1 (mod 4) is true: self-complementary graphs exist exactly then.",
}

text = SRC.read_text(encoding="utf-8")
section = ""
out = []
for line in text.split("\n"):
    h2 = re.match(r"^## (.+?) \(Questions? [\d-]+\)\s*$", line)
    if h2:
        section = h2.group(1)
for m in re.finditer(r"^## (.+?) \(Questions? [\d-]+\)\s*$|^### Question (\d+) \(([^)]+)\)\n(.+?)(?=\n### |\n## |\Z)", text, re.M | re.S):
    if m.group(1):
        section = m.group(1)
        continue
    n = int(m.group(2))
    q = " ".join(m.group(4).replace("---", "").split())
    out.append({"n": n, "section": section, "level": m.group(3), "q": q, "a": A[n]})

assert [x["n"] for x in out] == list(range(1, 101)), [x["n"] for x in out][:5]
(HERE / "questions.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

md = ["# Combinatorics: answers", "",
      "Answers to the [100 combinatorics questions](combinatorics_learning_questions.md). Every numeric answer was checked by brute force; the working is a short outline, not a full write-up. You can also work through the questions as flashcards in the [Combinatorics Quiz](quiz/index.html).", ""]
cur = None
for x in out:
    if x["section"] != cur:
        cur = x["section"]
        md += [f"## {cur}", ""]
    md += [f"### {x['n']}. ({x['level']})", "", x["q"], "", f"**Answer:** {x['a']}", ""]
(HERE.parent / "combinatorics_answers.md").write_text("\n".join(md), encoding="utf-8")
print(len(out), "questions;", len(set(x["section"] for x in out)), "sections")
