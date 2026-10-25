#!/usr/bin/env python3
"""Turn the two 100-question music theory documents into questions.json for the quiz page.

Run from this folder:  python3 make_questions.py
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).parent
DECKS = {"guitar": HERE.parent / "guitar-music-theory-questions.md", "piano": HERE.parent / "piano-music-theory-questions.md"}

out = []
for deck, path in DECKS.items():
    section, q, a, lines = "", None, [], path.read_text(encoding="utf-8").split("\n")

    def flush():
        global q, a
        if q:
            text = " ".join(x.strip() for x in a if x.strip()).strip()
            if text:
                out.append({"deck": deck, "section": section, "q": q, "a": text})
        q, a = None, []

    for line in lines:
        h2 = re.match(r"^## (.+?)(?: \(Questions? [\d-]+\))?\s*$", line)
        h3 = re.match(r"^### \d+\.\s*(.+)$", line)
        if h2 and not h3:
            flush()
            section = h2.group(1).strip()
        elif h3:
            flush()
            q = h3.group(1).strip()
        elif q is not None:
            if line.startswith("---") or line.startswith("## "):
                flush()
            else:
                a.append(re.sub(r"^\*\*Answer:\*\*\s*", "", line))
    flush()

(HERE / "questions.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(out), "questions", {d: sum(1 for x in out if x["deck"] == d) for d in DECKS})
