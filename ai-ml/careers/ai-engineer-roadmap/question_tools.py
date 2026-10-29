"""Shared helpers for the Phase 1 and Phase 2 question generators.

Every question made here has a correct answer that was computed by running code (numpy, sympy, sqlite3 or the Python
interpreter itself), never typed in by hand, except in the clearly marked "concept" lists, which are written out in full.
The quiz pages expect the right answer first (index 0) and shuffle the options when they load.
"""
import random
from fractions import Fraction


# Sub-topics whose answers are counts, sizes or positions: a negative wrong answer would be an obvious giveaway
NONNEG = {"combinatorics", "binary_search", "trees", "graphs", "algorithms", "dynamic_programming", "validation", "network_size", "cnn",
          "rnn", "embeddings", "normalization", "training", "rank", "matrix_shapes", "stacks_queues", "sorting", "complexity",
          "regularization", "attention", "model_evaluation", "activations"}


class Bank:
    def __init__(self, seed):
        self.rng = random.Random(seed)
        self.questions = []
        self.seen = set()
        self.next_id = 1

    def add(self, topic, subtopic, difficulty, question, correct, wrong, explanation, hint=None, qtype="multiple_choice"):
        """Add one question. `wrong` is a list of plausible wrong answers; three are kept. Returns False if skipped."""
        correct = str(correct)
        if question in self.seen:
            return False
        pool = []
        nonneg = subtopic in NONNEG and correct.lstrip("0123456789.").strip() == "" and not correct.startswith("-")
        for w in wrong:
            w = str(w)
            if nonneg and w.startswith("-"):
                continue
            if w != correct and w not in pool:
                pool.append(w)
        if len(pool) < 3:
            return False
        self.rng.shuffle(pool)
        self.seen.add(question)
        self.questions.append({
            "id": self.next_id,
            "topic": topic,
            "subtopic": subtopic,
            "difficulty": difficulty,
            "type": qtype,
            "question": question,
            "options": [correct] + pool[:3],
            "correct_answer": 0,
            "explanation": explanation,
            "hints": [hint or f"Work through the {subtopic.replace('_', ' ')} step by step."],
        })
        self.next_id += 1
        return True

    def add_concepts(self, topic, subtopic, difficulty, items):
        """items: (question, correct, [three or more wrong], explanation). Written by hand, so each is reviewed text."""
        for q, c, w, e in items:
            self.add(topic, subtopic, difficulty, q, c, w, e)

    def count(self, topic):
        return sum(1 for q in self.questions if q["topic"] == topic)


def num(x, digits=4):
    """Format a number without trailing zeros: 3.0 -> '3', 0.25 -> '0.25'."""
    if isinstance(x, Fraction):
        return str(x.numerator) if x.denominator == 1 else f"{x.numerator}/{x.denominator}"
    if isinstance(x, int):
        return str(x)
    r = round(float(x), digits)
    if r == int(r):
        return str(int(r))
    return f"{r:.{digits}f}".rstrip("0").rstrip(".")


def near(rng, value, n=6, step=None):
    """Plausible wrong numbers around a value: neighbours, sign flip, double, half."""
    if isinstance(value, Fraction):
        cands = [value + Fraction(k, max(value.denominator, 1)) for k in (-2, -1, 1, 2)] + [-value, value * 2]
        return [num(c) for c in cands if c != value]
    if isinstance(value, int):
        cands = [value + d for d in (-3, -2, -1, 1, 2, 3)] + [-value, value * 2, value + 10]
        return [str(c) for c in cands if c != value]
    cands = [value * 2, value / 2, -value, value + 1, value - 1, value + 0.5, value * 10, value / 10]
    return [num(c) for c in cands if abs(c - value) > 1e-9]


def finish(bank, topics, meta):
    import json
    out = {"metadata": dict(meta, total_questions=len(bank.questions), topics={t: bank.count(t) for t in topics}), "questions": bank.questions}
    return out
