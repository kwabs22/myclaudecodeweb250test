# Phase 1 quiz: maths and programming fundamentals

[Open the quiz](quiz-app.html). 1,148 multiple-choice questions on the maths and programming a machine learning engineer needs first. Every question is different: none is repeated with a new number in front.

| Topic | Questions | What it covers |
|---|---|---|
| Linear algebra | 224 | Dot products, norms, determinants, matrix products and shapes, inverses, eigenvalues, rank, linear systems, cosine similarity, and concepts |
| Calculus | 209 | Derivatives (power, product, quotient and chain rules), integrals, limits, partial derivatives, gradients, gradient descent steps, optimisation, derivatives used in machine learning |
| Probability and statistics | 220 | Counting, probability, Bayes' rule, expected value, binomial distribution, mean, median, variance, correlation, z-scores, and concepts |
| Python | 142 | Reading code and saying what it prints: slicing, comprehensions, dictionaries, strings, loops, mutability, functions, expressions, control flow |
| SQL | 178 | Reading a query against a small table and saying what it returns: filters, aggregates, group by, joins, nulls, subqueries, window functions |
| Data structures and algorithms | 175 | Complexity, binary search, trees, graph traversal, stacks and queues, sorting steps, recursion, dynamic programming |

Difficulty: 509 beginner, 528 intermediate, 111 advanced. The quiz page lets you filter by topic and difficulty, shows a hint and an explanation, and keeps a statistics panel.

## How the answers are made

Most questions are built by a script that picks random numbers, then **computes the answer by running code**:

- numbers: numpy and sympy (each derivative is also checked against a numerical estimate, and each integral against a numerical sum);
- Python questions: the snippet is executed and its real output is the answer;
- SQL questions: the query is run on a small SQLite database that is built fresh for each question;
- algorithm questions: a reference implementation runs on the question's input.

The wrong options are plausible mistakes (a sign error, the wrong rule, the neighbouring value), not random numbers. About 70 conceptual questions are written out by hand in `p1_math.py` and `p1_code.py`.

## Regenerate and check

```bash
pip install numpy sympy
python generate_phase1_questions.py     # writes phase1-question-bank-full.json (the output is the same every time)
python check_question_banks.py          # fails if any rule is broken
```

`check_question_banks.py` makes sure every question has four different options, the right answer is stored first (the quiz page shuffles them when it loads), no question text repeats, no explanation is empty, and the counts in the file match. It also runs the code in every Python question again and compares the result with the stored answer.

## Limits

- The numbers in a question come from a fixed random seed, so the same questions appear each time you regenerate.
- Short-answer and coding questions are not supported by the page: every question is multiple choice.
- Questions are practice, not a certified exam.
