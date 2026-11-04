#!/usr/bin/env python3
"""Keep the numbers and the list of runnable pages in the root README.md current.

    python site/sync_root_readme.py            # rewrite the generated parts of README.md
    python site/sync_root_readme.py --check    # exit 1 if README.md is out of date (nothing is written)

The generated parts sit between <!-- generated:NAME --> and <!-- /generated:NAME --> markers. Everything else in the README is hand-written.
Inputs: `git ls-files` (file counts), site/page-types.json and site/demos.json (runnable pages, with each page's <title>), and the question-bank JSON files.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"
SITE = "https://kwabs22.github.io/myclaudecodeweb250test/"
GITHUB_SITE_README = "https://github.com/kwabs22/myclaudecodeweb250test/blob/main/site/README.md"   # site/ is not published on the website itself
AREAS = [
    ("game-development", "🎮 Game development", "Algorithm implementations, React Native games, ArUco marker games, engine analyses, modding and design guides"),
    ("ai-ml", "🤖 AI and machine learning", "Career roadmap and three quizzes, computer vision (pose, edges, alpha), MCP, marketing agents, NLP"),
    ("creative-media", "🎨 Creative media", "Memes, music theory and production, social media trends, story generation"),
    ("learning-resources", "📚 Learning resources", "Combinatorics, geometry, languages, chess calculator"),
    ("development-tools", "🛠️ Development tools", "Claude Code guides, API documents with an explorer and quiz, benchmarking, Gradio, git"),
    ("industry-research", "🏭 Industry research", "Drones, humanoid robots, vending machines, lead generation"),
]
TYPE_ORDER = ["Visualisation", "Playground", "Tool", "Quiz", "AR viewer", "Test page", "Web app", "Games"]


def git_files():
    out = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, check=True).stdout.splitlines()
    return [f for f in out if f]


def title_of(path):
    m = re.search(r"<title>(.*?)</title>", (ROOT / path).read_text(encoding="utf-8", errors="replace"), re.S | re.I)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else path


def count_questions():
    def n(rel):
        try:
            data = json.loads((ROOT / rel).read_text(encoding="utf-8"))
            return len(data["questions"] if isinstance(data, dict) else data)
        except (OSError, KeyError, ValueError):
            return 0
    rd = "ai-ml/careers/ai-engineer-roadmap/"
    return {"p1": n(rd + "phase1-question-bank-full.json"), "p2": n(rd + "phase2-question-bank.json"), "p3": n(rd + "phase3-question-bank.json"),
            "api": n("development-tools/apis/quiz/api-question-bank.json"), "comb": n("learning-resources/mathematics/quiz/questions.json")}


def pages_block():
    types = json.loads((ROOT / "site/page-types.json").read_text(encoding="utf-8"))
    rows = []
    for path, info in types.items():
        rows.append((TYPE_ORDER.index(info["type"]) if info["type"] in TYPE_ORDER else 99, title_of(path).lower(), title_of(path), info["type"], info.get("blurb", ""), SITE + path))
    for d in json.loads((ROOT / "site/demos.json").read_text(encoding="utf-8")):
        rows.append((TYPE_ORDER.index(d["type"]) if d["type"] in TYPE_ORDER else 99, d["title"].lower(), d["title"], d["type"], d["description"], SITE + d["url"]))
    rows.sort()
    lines = [f"{len(rows)} pages run in the browser on the [Session Atlas site]({SITE}). Open the live link, since on GitHub an `.html` file shows its source.", "", "| Page | Type | What it does |", "|---|---|---|"]
    for _, _, title, typ, blurb, url in rows:
        lines.append(f"| [{title}]({url}) | {typ} | {blurb} |")
    return "\n".join(lines)


def areas_block(files):
    q = count_questions()
    lines = ["| Area | Files | What is there |", "|---|---|---|"]
    for d, label, what in AREAS:
        lines.append(f"| [`{d}/`](./{d}/README.md) | {sum(1 for f in files if f.startswith(d + '/'))} | {label}: {what} |")
    lines.append(f"| [`site/`]({GITHUB_SITE_README}) | {sum(1 for f in files if f.startswith('site/'))} | 🌐 The generator for the Session Atlas website (3D map, page for every file, link checks) |")
    root = sum(1 for f in files if "/" not in f)
    lines += ["", f"{len(files)} files are tracked in all, including {root} at the top level (the merge documents and this README).", "",
              f"The quizzes hold {q['p1'] + q['p2'] + q['p3'] + q['api'] + q['comb']:,} questions: AI engineer roadmap Phase 1 {q['p1']:,}, Phase 2 {q['p2']:,}, Phase 3 {q['p3']:,}; API quiz {q['api']:,}; combinatorics {q['comb']:,}."]
    return "\n".join(lines)


def render(text):
    files = git_files()
    for name, body in (("pages", pages_block()), ("areas", areas_block(files))):
        pat = re.compile(rf"(<!-- generated:{name} -->)\n.*?(<!-- /generated:{name} -->)", re.S)
        if not pat.search(text):
            sys.exit(f"README.md has no <!-- generated:{name} --> block")
        text = pat.sub(lambda m: m.group(1) + "\n" + body + "\n" + m.group(2), text)
    return text


if __name__ == "__main__":
    old = README.read_text(encoding="utf-8"); new = render(old)
    if "--check" in sys.argv:
        if old != new:
            print("README.md is out of date: run python site/sync_root_readme.py"); sys.exit(1)
        print("README.md is up to date")
    else:
        README.write_text(new, encoding="utf-8"); print("README.md updated" if old != new else "README.md already up to date")
