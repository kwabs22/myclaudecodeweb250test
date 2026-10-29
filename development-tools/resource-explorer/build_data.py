"""Reads the repository-list documents and writes resources.js for the explorer page.

Each list is a markdown file where an item is a heading followed by "Key: value" lines.
Run from anywhere:  python3 build_data.py   (add --check to only report what was found)
"""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SOURCES = [
    ("creative-media/music/50-music-production-repos.md", "Music production"),
    ("creative-media/music/MUSIC_THEORY_LIBRARIES.md", "Music theory"),
    ("learning-resources/languages/50-language-learning-repositories.md", "Language learning"),
    ("learning-resources/mathematics/combinatorics_repositories.md", "Combinatorics"),
    ("game-development/modding/TOP_20_MODDING_REPOSITORIES.md", "Game modding"),
    ("game-development/github-projects-to-learn-from.md", "Game development"),
    ("game-development/game-design/uml-and-system-design-repos.md", "System design"),
    ("game-development/game-design/mermaid-and-dependency-repos.md", "Diagrams"),
    ("industry-research/robotics/drone-tech-repositories.md", "Drones"),
]
KEYS = {"repository": "repo", "repo": "repo", "url": "repo", "website": "site", "stars": "stars", "language": "language", "languages": "language",
        "tech stack": "language", "description": "description", "license": "license", "last updated": "updated", "key features": "features",
        "features": "features", "what you'll learn": "learn", "use cases": "use", "installation": "install", "engine version": "engine"}
FIELD = re.compile(r"\*\*([A-Za-z' ]+?):?\*\*\s*:?\s*:?\s*(.*?)(?=\s*\|\s*\*\*[A-Za-z' ]+?\*\*|$)")
HEAD = re.compile(r"^(#{2,4})\s+(?:\d+\.\s*)?(?:\*\*)?(.*?)(?:\*\*)?(?:\s*[⭐].*)?\s*$")
GH = re.compile(r"github\.com/([\w.-]+/[\w.-]+)")
LINK = re.compile(r"\[([^\]]*)\]\(([^)]+)\)")


def clean(s):
    s = LINK.sub(lambda m: m.group(1) or m.group(2), s)
    return re.sub(r"[`*_]+", "", s).strip()


def stars_num(s):
    m = re.search(r"~?\s*([\d.,]+)\s*([kKmM]?)", s or "")
    if not m:
        return None
    try:
        n = float(m.group(1).replace(",", ""))
    except ValueError:
        return None
    return int(n * {"": 1, "k": 1000, "m": 1000000}[m.group(2).lower()])


def parse(path, topic):
    items, section, cur = [], "", None
    lines = open(os.path.join(ROOT, path), encoding="utf-8").read().splitlines()
    for ln in lines + ["## end"]:
        h = HEAD.match(ln)
        if h:
            if cur and (cur.get("repo") or cur.get("site")):
                cur.pop("_wait", None)
                items.append(cur)
            cur = None
            if len(h.group(1)) == 2:
                section = clean(h.group(2))
            else:
                cur = {"name": clean(h.group(2)), "section": section, "topic": topic, "doc": path}
            continue
        if cur is None:
            continue
        txt = re.sub(r"^\s*[-*]\s+", "", ln)
        if cur.get("_wait") and txt.strip() and not txt.lstrip().startswith("**"):
            cur[cur.pop("_wait")] = txt.strip()
            continue
        for m in FIELD.finditer(txt):
            k = KEYS.get(m.group(1).strip().lower())
            v = m.group(2).strip()
            if k and k not in cur:
                if v:
                    cur[k] = v
                elif k == "description":
                    cur["_wait"] = k
    out = []
    for it in items:
        raw = " ".join(str(it.get(k, "")) for k in ("repo", "site"))
        m = GH.search(raw)
        url = (LINK.search(it.get("repo", "")) or [None, None, None])[2] if LINK.search(it.get("repo", "")) else None
        if not url:
            u = re.search(r"https?://[^\s)\]]+", raw)
            url = u.group(0) if u else (("https://github.com/" + clean(it["repo"])) if re.fullmatch(r"[\w.-]+/[\w.-]+", clean(it.get("repo", ""))) else None)
        if not url and not it.get("repo"):
            continue
        rec = {"name": it["name"], "topic": topic, "section": it["section"], "url": (url or "").rstrip(".,"), "doc": path.replace(".md", ".html"),
               "repo": m.group(1) if m else "", "description": clean(it.get("description", "")), "language": clean(it.get("language", "")),
               "stars": stars_num(clean(it.get("stars", ""))), "license": clean(it.get("license", "")), "features": clean(it.get("features", ""))[:200]}
        out.append(rec)
    return out


GAMES_DOC = "game-development/modding/MOST_MODDED_GAMES.md"


def numbers(s):
    return [int(n.replace(",", "")) for n in re.findall(r"(\d[\d,]*)\+?", s or "") if n.replace(",", "")]


def parse_games():
    lines = open(os.path.join(ROOT, GAMES_DOC), encoding="utf-8").read().splitlines()
    games, cur, mode = [], None, ""
    for ln in lines:
        h = re.match(r"^###\s+(\d+)\.\s+\*\*(.*?)\*\*\s*(?:\((.*?)\))?", ln)
        if h:
            cur = {"rank": int(h.group(1)), "name": h.group(2), "year": h.group(3) or "", "highlights": []}
            games.append(cur); mode = ""
            continue
        if re.match(r"^##\s", ln):
            cur = None
        if cur is None:
            continue
        f = re.match(r"^\*\*(Platform|Engine|Total Mods|Active Modders)\*\*:\s*(.*)$", ln)
        if f:
            cur[{"Platform": "platform", "Engine": "engine", "Total Mods": "mods_text", "Active Modders": "modders_text"}[f.group(1)]] = clean(f.group(2))
            continue
        t = re.match(r"^\*\*(.*?)\*\*:?\s*$", ln)
        if t:
            mode = t.group(1).lower()
            continue
        b = re.match(r"^-\s+(.*)$", ln)
        if b and mode.startswith("why") and "why" not in cur:
            cur["why"] = clean(b.group(1))
        elif b and mode.startswith("modding highlights"):
            n = re.match(r"\*\*(.*?)\*\*", b.group(1))
            if n:
                cur["highlights"].append(clean(n.group(1)))
    for g in games:
        g["mods"] = sum(numbers(g.get("mods_text", "")))
        n = numbers(g.get("modders_text", ""))
        g["modders"] = n[0] if n else None
        g["doc"] = GAMES_DOC.replace(".md", ".html")
    return games


def main():
    allitems, seen = [], set()
    for path, topic in SOURCES:
        got = parse(path, topic)
        print(f"{len(got):3d}  {path}")
        for g in got:
            key = (g["url"].lower(), g["topic"])
            if key not in seen:
                seen.add(key)
                allitems.append(g)
    print(len(allitems), "items")
    games = parse_games()
    print(len(games), "games")
    if "--check" not in sys.argv:
        with open(os.path.join(os.path.dirname(__file__), "resources.js"), "w", encoding="utf-8") as f:
            f.write("window.RESOURCES = " + json.dumps(allitems, ensure_ascii=False, indent=0, separators=(",", ":")) + ";\n")
            f.write("window.GAMES = " + json.dumps(games, ensure_ascii=False, indent=0, separators=(",", ":")) + ";\n")


main()
