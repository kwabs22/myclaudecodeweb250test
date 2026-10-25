# Combinatorics: answers

Answers to the [100 combinatorics questions](combinatorics_learning_questions.md). Every numeric answer was checked by brute force; the working is a short outline, not a full write-up. You can also work through the questions as flashcards in the [Combinatorics Quiz](quiz/index.html).

## Table of Contents
- [Basic Counting Principles (Questions 1-15)](#basic-counting-principles-questions-1-15)
- [Permutations (Questions 16-30)](#permutations-questions-16-30)
- [Combinations (Questions 31-45)](#combinations-questions-31-45)
- [Advanced Counting (Questions 46-60)](#advanced-counting-questions-46-60)
- [Partitions and Distributions (Questions 61-70)](#partitions-and-distributions-questions-61-70)
- [Generating Functions (Questions 71-80)](#generating-functions-questions-71-80)
- [Graph Theory & Combinatorics (Questions 81-90)](#graph-theory--combinatorics-questions-81-90)
- [Challenge Problems (Questions 91-100)](#challenge-problems-questions-91-100)

---

## Basic Counting Principles

### 1. (Easy)

If you have 5 shirts and 3 pairs of pants, how many different outfits can you create?

**Answer:** 5 × 3 = 15 outfits (multiplication principle).

### 2. (Easy)

How many 3-digit numbers can be formed using the digits 1, 2, 3, 4, 5 without repetition?

**Answer:** 5 × 4 × 3 = 60.

### 3. (Easy)

A restaurant offers 4 appetizers, 6 main courses, and 3 desserts. How many different three-course meals can you order?

**Answer:** 4 × 6 × 3 = 72 meals.

### 4. (Easy)

How many different two-letter codes can be formed using the letters A, B, C, D, E if repetition is allowed?

**Answer:** 5 × 5 = 25 codes.

### 5. (Medium)

In how many ways can you arrange the letters in the word "MATH"?

**Answer:** 4! = 24.

### 6. (Medium)

A password must contain exactly 4 digits. How many different passwords are possible if digits can be repeated?

**Answer:** 10⁴ = 10,000 passwords.

### 7. (Medium)

How many even 3-digit numbers can be formed using the digits 1, 2, 3, 4, 5, 6 without repetition?

**Answer:** The last digit must be 2, 4 or 6 (3 choices), then 5 × 4 for the other two places: 3 × 5 × 4 = 60.

### 8. (Easy)

If you flip a coin 5 times, how many different sequences of heads and tails are possible?

**Answer:** 2⁵ = 32 sequences.

### 9. (Medium)

How many positive divisors does the number 72 have?

**Answer:** 72 = 2³ × 3², so (3 + 1)(2 + 1) = 12 divisors.

### 10. (Medium)

In how many ways can you distribute 3 identical candies to 5 children if each child can receive at most one candy?

**Answer:** Choose which 3 of the 5 children get a candy: C(5, 3) = 10.

### 11. (Easy)

How many different 4-character license plates can be made using 2 letters followed by 2 digits?

**Answer:** 26 × 26 × 10 × 10 = 67,600 (assuming letters and digits may repeat).

### 12. (Medium)

A binary string of length 6 must contain exactly three 1s. How many such strings exist?

**Answer:** Choose the positions of the three 1s: C(6, 3) = 20.

### 13. (Medium)

How many subsets does a set with 5 elements have?

**Answer:** 2⁵ = 32 (each element is in or out), including the empty set.

### 14. (Hard)

Using the inclusion-exclusion principle, find how many integers from 1 to 100 are divisible by 2, 3, or 5.

**Answer:** |A| = 50 (by 2), |B| = 33 (by 3), |C| = 20 (by 5); pairs 16, 10, 6; triple 3. Total 50 + 33 + 20 - 16 - 10 - 6 + 3 = 74.

### 15. (Medium)

In how many ways can you select 2 people from a group of 8 to be president and vice-president?

**Answer:** Order matters: P(8, 2) = 8 × 7 = 56.

## Permutations

### 16. (Easy)

Calculate 5! (5 factorial).

**Answer:** 5! = 5 × 4 × 3 × 2 × 1 = 120.

### 17. (Easy)

How many ways can 4 people stand in a line?

**Answer:** 4! = 24.

### 18. (Medium)

In how many ways can the letters of the word "BANANA" be arranged?

**Answer:** 6 letters with A three times and N twice: 6! / (3! 2!) = 60.

### 19. (Medium)

How many permutations of the letters in "MISSISSIPPI" are there?

**Answer:** 11 letters: I ×4, S ×4, P ×2, M ×1. 11! / (4! 4! 2!) = 34,650.

### 20. (Medium)

Find the number of ways to arrange 6 books on a shelf if 2 particular books must be next to each other.

**Answer:** Glue the two books into one block (2 internal orders): 5! × 2 = 240.

### 21. (Hard)

How many permutations of the word "MATHEMATICS" are there?

**Answer:** 11 letters with M, A and T each twice: 11! / (2! 2! 2!) = 4,989,600.

### 22. (Medium)

In how many ways can 5 men and 5 women stand in a line if men and women must alternate?

**Answer:** Two patterns (men first or women first), each with 5! × 5! arrangements: 2 × 120 × 120 = 28,800.

### 23. (Medium)

Calculate P(10, 3) - the number of 3-permutations of 10 objects.

**Answer:** P(10, 3) = 10 × 9 × 8 = 720.

### 24. (Hard)

How many ways can 8 people sit around a circular table?

**Answer:** Rotations count as the same seating: (8 - 1)! = 7! = 5,040.

### 25. (Hard)

How many ways can 6 people sit around a circular table if 2 specific people must not sit next to each other?

**Answer:** Fix one person; arrangements of the rest: 5! = 120. Subtract those where the two are adjacent: 2 × 4! = 48. Answer 120 - 48 = 72.

### 26. (Medium)

Find the number of 4-digit numbers that can be formed using digits 1-9 without repetition where the number must be divisible by 5.

**Answer:** The last digit must be 5, then 8 × 7 × 6 choices for the first three digits: 336.

### 27. (Easy)

How many different ways can you arrange 3 red balls and 2 blue balls in a row if balls of the same color are indistinguishable?

**Answer:** Choose the 2 positions for the blue balls: C(5, 2) = 10.

### 28. (Hard)

How many derangements are there of 4 objects? (A derangement is a permutation where no element appears in its original position)

**Answer:** D₄ = 4!(1 - 1 + 1/2 - 1/6 + 1/24) = 9.

### 29. (Medium)

In how many ways can 10 students be arranged in a row if the tallest student must be in the middle?

**Answer:** With 10 students there is no single middle seat. If the tallest takes either of the two middle seats (5th or 6th): 2 × 9! = 725,760. If a specific seat is named: 9! = 362,880.

### 30. (Hard)

Find the number of permutations of {1, 2, 3, 4, 5, 6} where no even number is in its natural position.

**Answer:** Inclusion-exclusion over the 3 even numbers sitting in their own place: 6! - 3·5! + 3·4! - 3! = 720 - 360 + 72 - 6 = 426.

## Combinations

### 31. (Easy)

Calculate C(7, 3) - the number of ways to choose 3 objects from 7.

**Answer:** C(7, 3) = 7·6·5 / 3! = 35.

### 32. (Easy)

How many ways can you select 2 toppings from a list of 8 toppings for your pizza?

**Answer:** C(8, 2) = 28.

### 33. (Medium)

From a standard deck of 52 cards, how many 5-card hands contain exactly 3 aces?

**Answer:** Choose 3 of the 4 aces and 2 of the other 48 cards: C(4, 3) × C(48, 2) = 4 × 1,128 = 4,512.

### 34. (Medium)

In how many ways can you select a committee of 5 people from 12 people?

**Answer:** C(12, 5) = 792.

### 35. (Medium)

How many ways can you choose 4 cards from a standard deck such that all 4 are of different suits?

**Answer:** One card from each suit: 13⁴ = 28,561.

### 36. (Hard)

From 8 men and 7 women, how many committees of 6 can be formed containing at least 3 women?

**Answer:** At least 3 women means 3, 4, 5 or 6: C(7,3)C(8,3) + C(7,4)C(8,2) + C(7,5)C(8,1) + C(7,6)C(8,0) = 1,960 + 980 + 168 + 7 = 3,115.

### 37. (Medium)

How many diagonals does a convex polygon with n sides have?

**Answer:** Choose any 2 vertices, minus the n sides: C(n, 2) - n = n(n - 3) / 2.

### 38. (Easy)

Verify that C(n, k) = C(n, n-k) for n=10 and k=3.

**Answer:** C(10, 3) = 120 and C(10, 7) = 120. In general choosing k to take is the same as choosing n - k to leave.

### 39. (Medium)

How many ways can you select 5 books from 12 different books if 2 particular books must be included?

**Answer:** The two books are fixed; choose the other 3 from 10: C(10, 3) = 120.

### 40. (Medium)

In how many ways can you distribute 10 identical balls into 4 distinct boxes?

**Answer:** Stars and bars: C(10 + 4 - 1, 4 - 1) = C(13, 3) = 286.

### 41. (Hard)

Find the number of non-negative integer solutions to x₁ + x₂ + x₃ + x₄ = 10.

**Answer:** Same count as Question 40: C(13, 3) = 286.

### 42. (Hard)

How many 5-card poker hands contain exactly one pair?

**Answer:** Choose the pair's rank (13), its 2 suits (C(4,2)), then 3 other different ranks (C(12,3)) with any suit (4³): 13 × 6 × 220 × 64 = 1,098,240.

### 43. (Medium)

From the digits 0-9, how many 4-digit combinations can be formed for a lock (where order doesn't matter and repetition is not allowed)?

**Answer:** C(10, 4) = 210.

### 44. (Hard)

In how many ways can you choose 6 numbers from 1 to 49 such that at least one number is even?

**Answer:** Subtract the all-odd choices (25 odd numbers): C(49, 6) - C(25, 6) = 13,983,816 - 177,100 = 13,806,716.

### 45. (Hard)

Prove Pascal's Identity: C(n, k) = C(n-1, k-1) + C(n-1, k)

**Answer:** Count the k-subsets of an n-set by whether they contain a fixed element x. Those that contain x: choose the other k - 1 from n - 1, so C(n-1, k-1). Those that do not: C(n-1, k). The two cases cover every subset exactly once.

## Advanced Counting

### 46. (Medium)

How many binary strings of length 10 contain at least 3 consecutive 1s?

**Answer:** Strings with no run of three 1s follow t(n) = t(n-1) + t(n-2) + t(n-3) with t(0..2) = 1, 2, 4, giving t(10) = 504. So 1,024 - 504 = 520.

### 47. (Hard)

Use the Pigeonhole Principle to prove that among any 13 people, at least 2 were born in the same month.

**Answer:** Put the 13 people into 12 boxes, one per month. With more people than boxes, some box holds at least 2 (pigeonhole principle).

### 48. (Hard)

Find the coefficient of x⁵ in the expansion of (1 + x)¹⁰.

**Answer:** C(10, 5) = 252.

### 49. (Hard)

How many surjective (onto) functions are there from a set of 5 elements to a set of 3 elements?

**Answer:** Inclusion-exclusion: 3⁵ - 3·2⁵ + 3·1⁵ = 243 - 96 + 3 = 150. (Also 3! × S(5, 3) = 6 × 25.)

### 50. (Medium)

How many ways can you tile a 2×n board with 1×2 dominoes?

**Answer:** Let T(n) be the count. Either the last column is a vertical domino, T(n-1), or the last two columns hold two horizontal dominoes, T(n-2). So T(n) = T(n-1) + T(n-2), with T(1) = 1, T(2) = 2: the Fibonacci numbers, T(n) = F(n+1).

### 51. (Hard)

Find the number of integer solutions to x₁ + x₂ + x₃ = 20 where x₁ ≥ 1, x₂ ≥ 2, x₃ ≥ 3.

**Answer:** Substitute y₁ = x₁ - 1, y₂ = x₂ - 2, y₃ = x₃ - 3 ≥ 0, so the sum is 14: C(14 + 2, 2) = C(16, 2) = 120.

### 52. (Medium)

How many paths are there from (0,0) to (5,5) on a grid if you can only move right or up?

**Answer:** 10 moves, 5 of them right: C(10, 5) = 252.

### 53. (Hard)

How many such paths from question 52 pass through the point (2,3)?

**Answer:** Paths to (2,3) times paths from (2,3) to (5,5): C(5, 2) × C(5, 3) = 10 × 10 = 100.

### 54. (Hard)

Find the number of ways to place 8 non-attacking rooks on a standard chessboard.

**Answer:** One rook per row, each in a different column: 8! = 40,320.

### 55. (Very Hard)

Using the Catalan numbers, find how many ways you can triangulate a convex hexagon.

**Answer:** The 4th Catalan number: C₄ = C(8, 4) / 5 = 14.

### 56. (Hard)

How many monotonic lattice paths are there from (0,0) to (m,n) that never go above the line y = x?

**Answer:** Ballot numbers: for m ≥ n it is (m - n + 1) / (m + 1) × C(m + n, n). For m = n this is the Catalan number C(2n, n) / (n + 1).

### 57. (Medium)

Find the number of ways to select 3 non-consecutive numbers from {1, 2, 3, 4, 5, 6, 7, 8}.

**Answer:** Choose 3 numbers from 6 after shifting to remove the gaps: C(8 - 3 + 1, 3) = C(6, 3) = 20.

### 58. (Hard)

How many ways can you arrange n distinct objects in a circle if reflections are considered the same?

**Answer:** (n - 1)! / 2 for n ≥ 3: rotations and reflections give the same arrangement.

### 59. (Very Hard)

Find the number of ways to partition the number 10 into positive integers (order doesn't matter).

**Answer:** p(10) = 42.

### 60. (Hard)

Calculate the number of ways to color the vertices of a square with 3 colors such that adjacent vertices have different colors.

**Answer:** Proper colourings of a 4-cycle with k colours: (k - 1)⁴ + (k - 1). For k = 3: 16 + 2 = 18.

## Partitions and Distributions

### 61. (Medium)

How many ways can you distribute 12 identical balls into 3 distinct boxes?

**Answer:** Stars and bars: C(12 + 2, 2) = C(14, 2) = 91.

### 62. (Hard)

How many ways can you distribute 12 distinct balls into 3 distinct boxes?

**Answer:** Each ball picks a box: 3¹² = 531,441.

### 63. (Hard)

Find the number of ways to partition a set of 4 elements.

**Answer:** The Bell number B(4) = 1 + 7 + 6 + 1 = 15.

### 64. (Medium)

How many ways can you distribute 10 identical candies to 4 children if each child must get at least one candy?

**Answer:** Give each child 1 first, leaving 6 to distribute freely: C(6 + 3, 3) = C(9, 3) = 84.

### 65. (Hard)

In how many ways can 9 people be divided into 3 groups of 3?

**Answer:** 9! / ((3!)³ × 3!) = 280, dividing by 3! because the groups are not labelled.

### 66. (Very Hard)

Find the Stirling number of the second kind S(5, 3) - the number of ways to partition 5 objects into 3 non-empty subsets.

**Answer:** S(5, 3) = 3 × S(4, 3) + S(4, 2) = 3 × 6 + 7 = 25, using S(n, k) = k·S(n-1, k) + S(n-1, k-1).

### 67. (Hard)

How many ways can you place 10 identical balls into 5 distinct boxes if no box can be empty?

**Answer:** Each box gets at least one, leaving 5 to distribute: C(5 + 4, 4) = C(9, 4) = 126.

### 68. (Medium)

How many compositions (ordered partitions) of 7 into positive integers are there?

**Answer:** A composition of n is a choice of cut points among the n - 1 gaps: 2⁶ = 64.

### 69. (Hard)

Find the number of ways to write 20 as an ordered sum of positive integers.

**Answer:** 2¹⁹ = 524,288.

### 70. (Very Hard)

Calculate the Bell number B(4) - the total number of partitions of a set with 4 elements.

**Answer:** B(4) = 15 (partitions into 1, 2, 3 and 4 blocks: 1 + 7 + 6 + 1).

## Generating Functions

### 71. (Medium)

Find the generating function for the sequence 1, 1, 1, 1, ... (infinitely many 1s).

**Answer:** 1 / (1 - x) = 1 + x + x² + x³ + ...

### 72. (Medium)

What sequence does the generating function 1/(1-x)² represent?

**Answer:** 1 / (1 - x)² = Σ (n + 1) xⁿ: the sequence 1, 2, 3, 4, ...

### 73. (Hard)

Use generating functions to find the number of ways to make change for $1 using pennies, nickels, and dimes.

**Answer:** The coefficient of x¹⁰⁰ in 1 / ((1 - x)(1 - x⁵)(1 - x¹⁰)) is 121.

### 74. (Hard)

Find the generating function for the number of solutions to x₁ + x₂ + x₃ = n where each xᵢ ≥ 0.

**Answer:** 1 / (1 - x)³, whose xⁿ coefficient is C(n + 2, 2).

### 75. (Hard)

What is the coefficient of x¹⁰ in (x + x² + x³ + ...)⁵?

**Answer:** Each factor is x / (1 - x), so we want the x¹⁰ coefficient of x⁵ / (1 - x)⁵, which is the x⁵ coefficient of (1 - x)⁻⁵: C(9, 4) = 126.

### 76. (Very Hard)

Derive the generating function for the Fibonacci sequence.

**Answer:** Let F(x) = Σ Fₙ xⁿ. The recurrence Fₙ = Fₙ₋₁ + Fₙ₋₂ gives F - x F - x² F = x, so F(x) = x / (1 - x - x²).

### 77. (Medium)

Find the ordinary generating function for the sequence aₙ = 2ⁿ.

**Answer:** Σ 2ⁿ xⁿ = 1 / (1 - 2x).

### 78. (Hard)

Use generating functions to solve the recurrence relation aₙ = aₙ₋₁ + aₙ₋₂ with a₀ = 0, a₁ = 1.

**Answer:** With A(x) = Σ aₙ xⁿ: A - xA - x²A = x, so A = x / (1 - x - x²). Partial fractions give aₙ = (φⁿ - ψⁿ) / √5 where φ = (1 + √5)/2 and ψ = (1 - √5)/2 (Binet's formula).

### 79. (Very Hard)

Find the exponential generating function for the number of permutations of n objects.

**Answer:** Σ n! xⁿ / n! = Σ xⁿ = 1 / (1 - x).

### 80. (Hard)

What is the coefficient of x⁸ in the expansion of (1 + x + x² + x³)⁴?

**Answer:** The x⁸ coefficient of (1 + x + x² + x³)⁴ is 31 (equivalently the number of ways to pick four exponents from 0 to 3 summing to 8).

## Graph Theory & Combinatorics

### 81. (Easy)

How many edges does a complete graph on 10 vertices have?

**Answer:** C(10, 2) = 45.

### 82. (Medium)

What is the chromatic number of a complete graph Kₙ?

**Answer:** Every vertex is adjacent to every other, so χ(Kₙ) = n.

### 83. (Medium)

How many spanning trees does the complete graph K₄ have? (Use Cayley's formula)

**Answer:** Cayley's formula nⁿ⁻²: 4² = 16.

### 84. (Hard)

Prove that in any graph, the sum of all vertex degrees equals twice the number of edges.

**Answer:** Each edge has two endpoints, so it adds exactly 1 to the degree of each. Summing degrees counts every edge twice: Σ deg(v) = 2|E|.

### 85. (Medium)

How many different labeled trees can be formed with 5 vertices?

**Answer:** Cayley: 5³ = 125.

### 86. (Hard)

What is the maximum number of edges in a bipartite graph with n vertices?

**Answer:** Split the n vertices into parts of sizes a and n - a; the most edges is a(n - a), maximised at a = n / 2: ⌊n² / 4⌋.

### 87. (Medium)

Find the number of ways to properly color the edges of K₃ using 3 colors.

**Answer:** The three edges of a triangle all share vertices, so they need different colours: 3! = 6.

### 88. (Hard)

How many non-isomorphic simple graphs are there with 4 vertices?

**Answer:** 11 non-isomorphic simple graphs on 4 vertices.

### 89. (Very Hard)

Prove that every tree with n vertices has exactly n-1 edges.

**Answer:** Induction on n. A tree with n ≥ 2 vertices has a leaf. Removing it leaves a tree with n - 1 vertices, which has n - 2 edges by hypothesis, so the original has n - 1. A single vertex has 0 edges.

### 90. (Hard)

How many Eulerian circuits does K₅ have?

**Answer:** 264 directed Eulerian circuits (132 if a circuit and its reverse count as one). K₅ is 4-regular, so Euler's theorem applies.

## Challenge Problems

### 91. (Very Hard)

How many ways can you arrange the numbers 1 through 9 in a 3×3 grid such that each row and column is increasing?

**Answer:** These are the standard Young tableaux of shape 3 × 3, counted by the hook length formula: 9! / (5·4·3·4·3·2·3·2·1) = 42.

### 92. (Very Hard)

Find the number of ways to seat n couples around a circular table such that no couple sits together.

**Answer:** Inclusion-exclusion over the couples seated together: Σₖ (-1)ᵏ C(n, k) 2ᵏ (2n - k - 1)!. Rotations are the same arrangement, reflections are different. n = 2: 2, n = 3: 32, n = 4: 1,488.

### 93. (Very Hard)

Prove the binomial theorem: (x + y)ⁿ = Σ C(n,k) xᵏ yⁿ⁻ᵏ for k=0 to n.

**Answer:** Expand (x + y)(x + y)...(x + y) with n factors. To get xᵏ yⁿ⁻ᵏ pick x from k of the factors: C(n, k) ways. Summing over k gives Σ C(n, k) xᵏ yⁿ⁻ᵏ. (Induction using Pascal's identity also works.)

### 94. (Very Hard)

How many binary sequences of length n have no two consecutive 1s?

**Answer:** Let a(n) be the count. If the string ends in 0 the rest is any valid string of length n - 1; if it ends in 01 the rest has length n - 2. So a(n) = a(n-1) + a(n-2) with a(1) = 2, a(2) = 3: a(n) = F(n + 2).

### 95. (Very Hard)

Find the number of ways to tile a 3×n rectangle with 1×3 tiles.

**Answer:** The first column is either one vertical tile, leaving 3 × (n-1), or the top-left cell starts a horizontal tile and forces three stacked horizontal tiles, leaving 3 × (n-3). So a(n) = a(n-1) + a(n-3): 1, 1, 1, 2, 3, 4, 6, 9, 13, 19 for n = 0 to 9.

### 96. (Expert)

Calculate the number of Latin squares of order 4.

**Answer:** 576 Latin squares of order 4 (4 of them reduced, with the first row and column in order: 4 × 4! × 3! = 576).

### 97. (Very Hard)

How many ways can you parenthesize a product of n+1 numbers? (This is the nth Catalan number)

**Answer:** The nth Catalan number Cₙ = C(2n, n) / (n + 1). Splitting at the last multiplication gives Cₙ = Σ Cᵢ Cₙ₋₁₋ᵢ, the Catalan recurrence.

### 98. (Expert)

Prove the inclusion-exclusion principle for n sets.

**Answer:** Take an element lying in exactly m ≥ 1 of the sets. The formula counts it Σₖ₌₁ᵐ (-1)ᵏ⁺¹ C(m, k) = 1 - (1 - 1)ᵐ = 1 times, so every element of the union is counted once and nothing else is.

### 99. (Expert)

Find a closed form for the sum: C(n,0) + C(n,1) + C(n,2) + ... + C(n,n).

**Answer:** 2ⁿ: set x = y = 1 in the binomial theorem, or note that each element is in or out of a subset.

### 100. (Expert)

Prove or disprove: The number of self-complementary graphs on n vertices is 2^(C(n,2)/2) when n ≡ 0 or 1 (mod 4).

**Answer:** Disproved. For n = 4 there is exactly one self-complementary graph up to isomorphism (the path on 4 vertices), but the formula gives 2^(C(4,2)/2) = 2³ = 8. Even counting labelled graphs (12 on 4 vertices) it does not give 8. Only the condition n ≡ 0 or 1 (mod 4) is true: self-complementary graphs exist exactly then.
