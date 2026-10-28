#!/usr/bin/env python3
"""Build the Phase 1 question bank (phase1-question-bank-full.json).

Every numeric, code and SQL answer is computed while the bank is built, by numpy, sympy, sqlite3, the Python interpreter
or a reference algorithm, so the answers are not typed in by hand. The few "concepts" questions are written out in the
source files. Run `python generate_phase1_questions.py`, then `python check_question_banks.py` to validate the result.
Needs: numpy, sympy. The output is deterministic (fixed seed).
"""
import json
from pathlib import Path

import p1_code
import p1_math
from question_tools import Bank, finish

TOPICS = ["linear_algebra", "calculus", "probability_statistics", "python", "sql", "data_structures_algorithms"]


def build():
    b = Bank(seed=20251118)
    for fn in (p1_math.linear_algebra, p1_math.calculus, p1_math.pstat, p1_code.python, p1_code.sql, p1_code.dsa):
        fn(b)
    # Group by topic in a stable order, then number the questions
    order = {t: i for i, t in enumerate(TOPICS)}
    b.questions.sort(key=lambda q: (order[q["topic"]], q["id"]))
    for i, q in enumerate(b.questions, 1):
        q["id"] = i
    return finish(b, TOPICS, {
        "title": "AI Engineer Roadmap - Phase 1: Fundamentals Question Bank",
        "version": "2.0.0",
        "description": "Maths, Python, SQL and algorithm questions. Answers are computed by code when the bank is built.",
        "difficulty_levels": ["beginner", "intermediate", "advanced"],
        "question_types": ["multiple_choice"],
    })


if __name__ == "__main__":
    data = build()
    out = Path(__file__).with_name("phase1-question-bank-full.json")
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(data['questions'])} questions to {out.name}")
    for t, n in data["metadata"]["topics"].items():
        print(f"  {t}: {n}")
