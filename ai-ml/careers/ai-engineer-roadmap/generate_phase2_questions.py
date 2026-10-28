#!/usr/bin/env python3
"""Build the Phase 2 question bank (phase2-question-bank.json).

Numeric answers are computed with numpy or the standard library while the bank is built. The conceptual questions are
written out in p2_ml.py. Run `python generate_phase2_questions.py`, then `python check_question_banks.py`.
Needs: numpy. The output is deterministic (fixed seed).
"""
import json
from pathlib import Path

import p2_ml
from question_tools import Bank, finish

TOPICS = ["classical_ml", "deep_learning", "prompt_engineering"]


def build():
    b = Bank(seed=20251118)
    for fn in (p2_ml.classical, p2_ml.deep, p2_ml.prompts):
        fn(b)
    order = {t: i for i, t in enumerate(TOPICS)}
    b.questions.sort(key=lambda q: (order[q["topic"]], q["id"]))
    for i, q in enumerate(b.questions, 1):
        q["id"] = i
    return finish(b, TOPICS, {
        "title": "AI Engineer Roadmap - Phase 2: Machine Learning Question Bank",
        "version": "2.0.0",
        "description": "Classical ML, deep learning and prompt engineering. Numeric answers are computed by code when the bank is built.",
        "difficulty_levels": ["beginner", "intermediate", "advanced"],
        "question_types": ["multiple_choice"],
    })


if __name__ == "__main__":
    data = build()
    out = Path(__file__).with_name("phase2-question-bank.json")
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(data['questions'])} questions to {out.name}")
    for t, n in data["metadata"]["topics"].items():
        print(f"  {t}: {n}")
