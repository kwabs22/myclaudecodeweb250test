# Combinatorics Repositories on GitHub

A curated list of repositories dealing with combinatorics mathematics, including permutations, combinations, partitions, and other combinatorial algorithms.

## Table of Contents
- [Multi-Language Libraries](#multi-language-libraries)
- [Python](#python)
- [C++](#c)
- [Java](#java)
- [Julia](#julia)
- [Clojure](#clojure)
- [PHP](#php)
- [Elm](#elm)
- [Educational Resources](#educational-resources)

---

## Multi-Language Libraries

### 1. **Discreture**
- **Repository:** https://github.com/mraggi/discreture
- **Language:** C++ (Header-only)
- **Description:** A modern C++ library for efficiently and easily iterating through common combinatorial objects
- **Features:**
  - Combinations
  - Permutations
  - Partitions
  - Set partitions
  - Dyck paths
  - Motzkin paths
- **Requirements:** C++14 or later, Boost dependency
- **Use Case:** High-performance combinatorial iteration in C++ applications

---

## Python

### 1. **xguse/Combinatorics**
- **Repository:** https://github.com/xguse/Combinatorics
- **Language:** Python
- **Description:** Basic combinatorics functions that supplement Python's itertools module
- **Features:**
  - `n_choose_m()` for calculating combinations
  - `m_way_ordered_combinations()` for multinomial combinations
  - `unlabeled_balls_in_labeled_boxes()` and related distribution functions
- **Use Case:** Extending Python's standard itertools with additional combinatorial operations

### 2. **slowcomb**
- **Repository:** https://github.com/mounaiban/slowcomb
- **Language:** Python
- **Description:** General-purpose combinatorics library featuring addressable Permutators and Combinators
- **Features:**
  - Works with container types where elements are addressable with integer indices
  - Implements permutations and combinations
- **Use Case:** Combinatorial operations requiring indexed access to elements

### 3. **discrete-math-python-scripts** ⭐ 413 stars
- **Repository:** https://github.com/alexanderskulikov/discrete-math-python-scripts
- **Language:** Jupyter Notebook, Python
- **Description:** Python code snippets from Discrete Mathematics for Computer Science specialization at Coursera
- **Last Updated:** July 20, 2025
- **Use Case:** Educational resource for learning discrete mathematics concepts with Python

---

## C++

### 1. **Discreture** (see Multi-Language section above)

### 2. **concurrent_permcomb**
- **Repository:** https://github.com/shaovoon/concurrent_permcomb
- **Language:** C++
- **Description:** Boost Concurrent Permutation and Combination
- **Features:**
  - `compute_all_perm` and `compute_all_comb` using parallel processing
  - Built on top of `next_permutation` and `next_combination`
- **Use Case:** Parallel computation of permutations and combinations for performance-critical applications

### 3. **Boost.Combinations**
- **Repository:** https://github.com/benbearchen/combinations
- **Language:** C++
- **Description:** Boost.Combinations library for combinations and permutations
- **Features:**
  - Works like C++ `std::next_permutation()`
  - Enumerates selections one by one
  - Supports combinations and partial permutations
- **Use Case:** STL-style iteration through combinatorial objects

### 4. **cppitertools**
- **Repository:** https://github.com/ryanhaining/cppitertools
- **Language:** C++17
- **Description:** Implementation of Python itertools and builtin iteration functions for C++
- **Use Case:** Bringing Python-style itertools functionality to C++

---

## Java

### 1. **combinatoricslib3** ⭐ 188 stars
- **Repository:** https://github.com/dpaukov/combinatoricslib3
- **Language:** Java
- **Description:** Combinatorial objects stream generators for Java
- **Last Updated:** February 20, 2024
- **Use Case:** Stream-based generation of combinatorial objects in Java applications

### 2. **uncommons-maths** ⭐ 160 stars
- **Repository:** https://github.com/dwdyer/uncommons-maths
- **Language:** Java
- **Description:** Random number generators, probability distributions, combinatorics and statistics for Java
- **Last Updated:** October 20, 2023
- **Use Case:** Comprehensive mathematics library including combinatorics for Java

---

## Julia

### 1. **Combinatorics.jl** ⭐ 226 stars
- **Repository:** https://github.com/JuliaMath/Combinatorics.jl
- **Language:** Julia
- **Description:** A combinatorics library for Julia
- **Last Updated:** November 13, 2025
- **Use Case:** Native Julia implementation of combinatorial algorithms

---

## Clojure

### 1. **math.combinatorics**
- **Repository:** https://github.com/clojure/math.combinatorics
- **Language:** Clojure/ClojureScript
- **Latest Version:** 0.3.0 (2024-02-19)
- **Description:** Official Clojure library with efficient, functional algorithms for generating lazy sequences
- **Features:**
  - Permutations: `permutations`, `count-permutations`, `nth-permutation`, `drop-permutations`
  - Combinations: `combinations`, `permuted-combinations`, `count-combinations`, `nth-combination`
  - Other operations: `selections`, `cartesian-product`, `partitions`, `subsets`
  - All functions return lazy sequences
  - ClojureScript support
- **Use Case:** Functional programming approach to combinatorics in Clojure

---

## PHP

### 1. **math-php** ⭐ 2.4k stars
- **Repository:** https://github.com/markrogoyski/math-php
- **Language:** PHP
- **Description:** Powerful modern math library for PHP
- **Features:**
  - Descriptive statistics and regressions
  - Continuous and discrete probability distributions
  - Combinatorics functions
- **Last Updated:** October 24, 2025
- **Use Case:** Comprehensive mathematics library for PHP applications including combinatorics

---

## Elm

### 1. **kite** ⭐ 561 stars
- **Repository:** https://github.com/erkal/kite
- **Language:** Elm
- **Description:** Interactive visualization tool designed for exploring graph theory concepts
- **Last Updated:** August 5, 2025
- **Use Case:** Visual exploration and learning of graph theory and combinatorics

---

## Educational Resources

### 1. **Combinatorics-Books**
- **Repository:** https://github.com/manjunath5496/Combinatorics-Books
- **Description:** Collection of combinatorics books and resources
- **Includes:**
  - "Matrices in Combinatorics and Graph Theory"
  - "Notes on Introductory Combinatorics"
  - "Combinatorial Optimization: Theory and Algorithms"
- **Use Case:** Reference material for studying combinatorics

### 2. **list-of-algorithms** ⭐ 29 stars
- **Repository:** https://github.com/realabbas/list-of-algorithms
- **Description:** A comprehensive curated list of algorithms
- **Includes:** General combinatorial algorithms, graph algorithms, sequence algorithms
- **Use Case:** Quick reference for various algorithmic approaches

---

## Specialized Applications

### 1. **knox** ⭐ 13 stars
- **Repository:** https://github.com/CIDARLAB/knox
- **Language:** JavaScript
- **Description:** Full stack application for creating, combining, and storing combinatorial genetic design spaces
- **Use Case:** Bioinformatics and genetic engineering applications

### 2. **Algorithm::Combinatorics** (Perl)
- **Repository:** https://github.com/fxn/algorithm-combinatorics
- **Language:** Perl
- **Description:** Efficient generation of combinatorial sequences
- **Features:**
  - Permutations, circular permutations, derangements
  - Variations, combinations, combinations with repetition
  - Partitions and subsets
- **Use Case:** Perl-based combinatorial computation

---

## GitHub Topics to Explore

For more repositories, explore these GitHub topics:
- [combinatorics](https://github.com/topics/combinatorics)
- [permutations](https://github.com/topics/permutations)
- [combinations](https://github.com/topics/combinations)
- [permutation-algorithms](https://github.com/topics/permutation-algorithms)
- [combinatorial-algorithms](https://github.com/topics/combinatorial-algorithms)
- [algebraic-combinatorics](https://github.com/topics/algebraic-combinatorics)
- [discrete-mathematics](https://github.com/topics/discrete-mathematics)

---

## Recommendations by Use Case

### For Learning Combinatorics:
1. **discrete-math-python-scripts** - Educational Python examples
2. **kite** - Visual graph theory tool
3. **Combinatorics-Books** - Theoretical references

### For Production Applications:
1. **C++:** Discreture (modern, header-only)
2. **Python:** Built-in itertools + xguse/Combinatorics for extensions
3. **Java:** combinatoricslib3 (stream-based)
4. **Julia:** Combinatorics.jl
5. **Clojure:** math.combinatorics (functional, lazy)

### For Research and Advanced Mathematics:
1. **Julia:** Combinatorics.jl (active development)
2. **PHP:** math-php (comprehensive)
3. **C++:** Discreture (high performance)

---

**Last Updated:** November 18, 2025
