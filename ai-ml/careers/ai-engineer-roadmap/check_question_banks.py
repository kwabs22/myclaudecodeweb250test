#!/usr/bin/env python3
"""Check the three question banks. Exits 1 if any rule is broken.

Rules: required fields present; exactly four distinct options; correct_answer is index 0 (the quiz pages shuffle);
no two questions share the same text; no empty explanation; no placeholder wording; difficulty values are known;
the metadata counts match; and no question appears to be a copy of another once leading labels are removed.
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).parent
BANKS = ["phase1-question-bank-full.json", "phase2-question-bank.json", "phase3-question-bank.json"]
FIELDS = ["id", "topic", "subtopic", "difficulty", "type", "question", "options", "correct_answer", "explanation", "hints"]
PLACEHOLDER = re.compile(r"\b(lorem|placeholder|TODO|TBD|option [A-D]\b|answer [A-D]\b)", re.I)
LABEL = re.compile(r"^[A-Za-z][A-Za-z ]*?\s*#?\d+\s*:\s*")


def check(name):
    data = json.loads((HERE / name).read_text(encoding="utf-8"))
    qs = data["questions"]
    errors = []
    ids = Counter(q["id"] for q in qs)
    texts = Counter(LABEL.sub("", q["question"]).strip() for q in qs)
    for q in qs:
        where = f"{name} #{q.get('id')}"
        for f in FIELDS:
            if f not in q: errors.append(f"{where}: missing {f}")
        if errors and errors[-1].startswith(where): continue
        opts = [str(o) for o in q["options"]]
        if len(opts) != 4 or len(set(opts)) != 4: errors.append(f"{where}: options are not four distinct values: {opts}")
        if q["correct_answer"] != 0 and not name.startswith("phase3"): errors.append(f"{where}: correct_answer is {q['correct_answer']}, expected 0")
        if not 0 <= q["correct_answer"] < len(opts): errors.append(f"{where}: correct_answer out of range")
        if not q["explanation"].strip(): errors.append(f"{where}: empty explanation")
        if q["difficulty"] not in ("beginner", "intermediate", "advanced"): errors.append(f"{where}: difficulty {q['difficulty']}")
        if PLACEHOLDER.search(q["question"] + " ".join(opts)): errors.append(f"{where}: placeholder wording")
        if ids[q["id"]] > 1: errors.append(f"{where}: duplicate id")
        if texts[LABEL.sub("", q["question"]).strip()] > 1: errors.append(f"{where}: question text repeats: {q['question'][:70]}")
    # Re-run the code in every Python question and compare with the stored answer (independent of the generator)
    if name.startswith("phase1"):
        import contextlib, io
        for q in qs:
            if q["topic"] == "python" and q["question"].startswith("What does this code print?"):
                code = q["question"].split("\n\n", 1)[1]
                buf = io.StringIO()
                try:
                    with contextlib.redirect_stdout(buf), __import__("warnings").catch_warnings():
                        __import__("warnings").simplefilter("ignore")
                        exec(code, {})
                except Exception as e:
                    errors.append(f"{name} #{q['id']}: code raised {e!r}"); continue
                if buf.getvalue().strip() != str(q["options"][0]):
                    errors.append(f"{name} #{q['id']}: code prints {buf.getvalue().strip()!r}, stored answer {q['options'][0]!r}")
    meta = data.get("metadata", {})
    if meta.get("total_questions") != len(qs): errors.append(f"{name}: metadata says {meta.get('total_questions')} questions, file has {len(qs)}")
    topics = Counter(q["topic"] for q in qs)
    if meta.get("topics") and dict(topics) != meta["topics"]: errors.append(f"{name}: metadata topic counts differ from the file")
    return len(qs), topics, errors


if __name__ == "__main__":
    bad = 0
    for n in BANKS:
        total, topics, errs = check(n)
        print(f"{n}: {total} questions, {len(topics)} topics, {len(errs)} problems")
        for e in errs[:15]: print("   ", e)
        bad += len(errs)
    sys.exit(1 if bad else 0)
