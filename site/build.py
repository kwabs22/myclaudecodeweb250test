#!/usr/bin/env python3
"""Build the Session Atlas static site from the repository's tracked files into _site/.

    pip install -r site/requirements.txt
    python site/build.py            # writes _site/
    python -m http.server -d _site  # preview

Every Markdown file becomes a page, every code file gets a highlighted viewer, every
folder gets an index page, and runnable HTML files are copied untouched. The home page is
a 3D map laid out from the folder tree (see site/assets/hub.js).
"""
import datetime
import html
import json
import os
import posixpath
import re
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote

from markdown_it import MarkdownIt
from mdit_py_plugins.anchors import anchors_plugin
from pygments import highlight as pyg_highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import TextLexer, get_lexer_by_name, get_lexer_for_filename
from pygments.util import ClassNotFound

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
OUT = ROOT / "_site"
ASSETS = HERE / "assets"

REPO = os.environ.get("GITHUB_REPOSITORY", "kwabs22/myclaudecodeweb250test")
REPO_URL = f"https://github.com/{REPO}"
SITE_NAME = "Session Atlas"
EXCLUDE_TOP = {"site", ".github", "_site"}
EXCLUDE_FILES = {".gitignore"}  # root file only; site plumbing, not content
VIEWER_MAX_BYTES = 300_000
MERMAID_SRC = "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js"

# key -> (label, colour, description). Order is the order shown on the home page.
CATEGORIES = {
    "game-development": (
        "Game development",
        "#f2705e",
        "Engine breakdowns (GASShooter, PlayCanvas), 155 algorithm demos, 58 React Native games, Blender and modding guides.",
    ),
    "ai-ml": (
        "AI and machine learning",
        "#7c8dff",
        "The AI-engineer roadmap with quiz apps, OpenPose and AR pose tracking, MCP guides, marketing agents, NLP versus small LLMs.",
    ),
    "creative-media": (
        "Creative media",
        "#d868b8",
        "Memes, music-theory guides and a VST example, a trending-topics UI, story-generation research.",
    ),
    "learning-resources": (
        "Learning resources",
        "#2fb8a6",
        "A chess calculation app with GPU benchmarking tools, 50 language-learning repos, combinatorics.",
    ),
    "development-tools": (
        "Development tools",
        "#e8aa2c",
        "Claude Code subagent patterns, API examples, model benchmarking, Gradio GPU planning, a branch-merging checklist.",
    ),
    "industry-research": (
        "Industry research",
        "#82c45a",
        "Drone and humanoid-robot research, the vending-machine benchmark, lead generation.",
    ),
    "root": (
        "About this repo",
        "#8e99b0",
        "How the sessions were merged, the audit that checked the merge, and the cleanup checklist.",
    ),
}

CODE_EXT = {
    ".py", ".js", ".mjs", ".jsx", ".ts", ".tsx", ".sh", ".cpp", ".h", ".hpp", ".c", ".css",
    ".json", ".csv", ".txt", ".yml", ".yaml", ".toml", ".ipynb", ".gitignore", ".env", ".example",
}
KIND_LABEL = {"doc": "Document", "app": "Runnable page", "code": "Code or data"}
TYPE_ORDER = ["Games", "Quiz", "Playground", "Visualisation", "Tool", "AR viewer", "Web app", "Test page"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def fmt_date(iso):
    y, m, d = iso.split("-")
    return f"{int(d)} {MONTHS[int(m) - 1]} {y}"


def stamp_text(node):
    if not node.get("ds"):
        return ""
    return f"Started {fmt_date(node['ds'])} · Updated {fmt_date(node['du'])}"


def git_history():
    """path -> {"A": [dates it was added], "M": [dates it was modified]}. Empty when the clone is shallow."""
    if subprocess.run(["git", "rev-parse", "--is-shallow-repository"], cwd=ROOT, capture_output=True, text=True).stdout.strip() == "true":
        print("warning: shallow clone, last-updated dates fall back to the session date", file=sys.stderr)
        return {}
    out = subprocess.run(["git", "log", "--no-merges", "--no-renames", "--name-status", "--format=@%cs"],
                         cwd=ROOT, capture_output=True, text=True, check=True).stdout
    hist, cur = {}, None
    for line in out.splitlines():
        if line.startswith("@"):
            cur = line[1:]
        elif line.strip():
            status, _, path = line.partition("\t")
            if status[:1] in ("A", "M"):
                hist.setdefault(path, {"A": [], "M": []})[status[0]].append(cur)
    return hist


def guess_type(node):
    t = node["t"].lower()
    return "Quiz" if "quiz" in t else "Test page" if "test" in t else "Games" if "game" in t else "Web app"


# ----------------------------------------------------------------------------- files


def git_files():
    out = subprocess.run(
        ["git", "ls-files", "-z"], cwd=ROOT, capture_output=True, check=True
    ).stdout.decode()
    files = [p for p in out.split("\0") if p]
    return sorted(p for p in files if p.split("/")[0] not in EXCLUDE_TOP and p not in EXCLUDE_FILES)


def category_of(path):
    top = path.split("/")[0] if "/" in path else ""
    return top if top in CATEGORIES else "root"


def read_text(path):
    return (ROOT / path).read_bytes().decode("utf-8", errors="replace")


def strip_md(text):
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[`*]", "", text)
    text = re.sub(r"(?<!\w)_+|_+(?!\w)", "", text)
    return re.sub(r"\s+", " ", text).strip()


def md_title_snippet(text, fallback):
    title, snippet = None, ""
    in_code = False
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        if title is None and s.startswith("# "):
            title = strip_md(s[2:])
            continue
        if title is None or snippet:
            continue
        if s.startswith(("#", "|", "- ", "* ", "> ", "<", "!", "---", "===", "1.")):
            continue
        plain = strip_md(s)
        if re.match(r"^[A-Z][\w ]{0,24}:\s", plain):
            continue  # "Date: ..." style metadata lines
        if len(plain) >= 50 and len(plain.split()) >= 8:
            snippet = plain
    snippet = snippet if len(snippet) <= 170 else snippet[:170].rsplit(" ", 1)[0] + "…"
    return title or fallback, snippet


def html_title_snippet(text, fallback):
    m = re.search(r"<title[^>]*>(.*?)</title>", text, re.S | re.I)
    title = html.unescape(re.sub(r"\s+", " ", m.group(1))).strip() if m else fallback
    m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)', text, re.I)
    snippet = html.unescape(m.group(1)).strip() if m else ""
    return title or fallback, snippet


def code_snippet(path, text):
    lines = text.count("\n") + (0 if text.endswith("\n") or not text else 1)
    ext = Path(path).suffix.lstrip(".") or Path(path).name
    return f"{ext} · {lines:,} lines"


class Repo:
    def __init__(self):
        self.files = git_files()
        self.fileset = set(self.files)
        self.dirs = {""}
        for f in self.files:
            d = posixpath.dirname(f)
            while d:
                self.dirs.add(d)
                d = posixpath.dirname(d)
        self._kids, self._count, self._nav = {}, {}, {}
        self.by_name = {}
        for f in self.files:
            self.by_name.setdefault(posixpath.basename(f), []).append(f)
        self.repaired = 0
        self.links = {}  # markdown source -> [links in total, links to other sites]
        self.nodes = []  # files shown on the map
        self.meta = {}
        self.has_viewer = set()
        self.broken = []

        for f in self.files:
            ext = Path(f).suffix.lower()
            name = Path(f).name
            if ext == ".md":
                kind = "doc"
            elif ext == ".html":
                kind = "app"
            elif ext in CODE_EXT or name in {".gitignore", ".env.example"}:
                kind = "code"
            else:
                continue
            size = (ROOT / f).stat().st_size
            text = read_text(f)
            if kind == "doc":
                title, snippet = md_title_snippet(text, name)
                url = f[:-3] + ".html"
            elif kind == "app":
                title, snippet = html_title_snippet(text, name)
                url = f
            else:
                title, snippet = name, code_snippet(f, text)
                if size <= VIEWER_MAX_BYTES:
                    url = f + ".html"
                    self.has_viewer.add(f)
                else:
                    url = f
            node = {
                "p": f, "u": url, "k": kind, "c": category_of(f), "d": posixpath.dirname(f),
                "s": size, "t": title, "x": snippet,
            }
            self.nodes.append(node)
            self.meta[f] = node

        # Demos that are built at deploy time (see build_demos.sh) rather than tracked as files.
        self.extras = []
        demos = HERE / "demos.json"
        if demos.exists():
            for d in json.loads(demos.read_text(encoding="utf-8")):
                p = d["url"].rstrip("/")
                node = {
                    "p": p, "u": d["url"], "k": "app", "c": category_of(p), "d": posixpath.dirname(p),
                    "s": d.get("size", 24000), "t": d["title"], "x": d.get("description", ""),
                    "ty": d.get("type", "Web app"), "_from": d.get("dates_from"),
                }
                self.nodes.append(node)
                self.extras.append(node)

        # Which original session produced each file (site/make_provenance.py). Unknown files belong to the last session.
        self.sessions = []
        prov = HERE / "provenance.json"
        if prov.exists():
            pd = json.loads(prov.read_text(encoding="utf-8"))
            ids = [x["id"] for x in pd["sessions"]]
            last = ids.index("repo-state-overview") if "repo-state-overview" in ids else len(ids) - 1
            for n in self.nodes:
                sid = pd["files"].get(n["p"])
                n["v"] = ids.index(sid) if sid in ids else last
            used = sorted({n["v"] for n in self.nodes})
            remap = {old: new for new, old in enumerate(used)}
            for n in self.nodes:
                n["v"] = remap[n["v"]]
            self.sessions = [
                {"id": pd["sessions"][old]["id"], "title": pd["sessions"][old]["title"], "date": pd["sessions"][old]["date"],
                 "files": sum(1 for n in self.nodes if n["v"] == remap[old])}
                for old in used
            ]

        # What kind of runnable page each one is, with a one-line description (site/page-types.json).
        types = json.loads((HERE / "page-types.json").read_text(encoding="utf-8")) if (HERE / "page-types.json").exists() else {}
        for n in self.nodes:
            if n["k"] != "app" or n in self.extras:
                continue
            info = types.get(n["p"], {})
            n["ty"] = info.get("type") or guess_type(n)
            if info.get("blurb"):
                n["x"] = info["blurb"]

        # Dates. Started: the original session's date (commit dates are the merge's, not the author's), or the first
        # commit for files made after the merge. Updated: the last commit that modified the file, else the start date.
        hist = git_history()
        for n in self.nodes:
            if n in self.extras:
                continue
            h = hist.get(n["p"], {"A": [], "M": []})
            sess = self.sessions[n["v"]] if self.sessions else None
            started = (min(h["A"]) if h["A"] else (sess["date"] if sess else None)) if (not sess or sess["id"] == "repo-state-overview") else sess["date"]
            if not started:
                continue
            mods = [d for d in h["M"] if d > started]
            n["ds"], n["du"] = started, (max(mods) if mods else started)
        for n in self.extras:
            src = n.pop("_from", None)
            if not src:
                continue
            under = [m for m in self.nodes if m not in self.extras and m["p"].startswith(src + "/") and m.get("ds")]
            if under:
                n["ds"], n["du"] = min(m["ds"] for m in under), max(m["du"] for m in under)

    def children(self, d):
        if d not in self._kids:
            prefix = d + "/" if d else ""
            subdirs, files = set(), []
            for p in self.files:
                if not p.startswith(prefix):
                    continue
                rest = p[len(prefix):]
                if "/" in rest:
                    subdirs.add(prefix + rest.split("/")[0])
                else:
                    files.append(p)
            self._kids[d] = (sorted(subdirs), files)
        return self._kids[d]

    def count_under(self, d):
        if d not in self._count:
            prefix = d + "/" if d else ""
            self._count[d] = sum(1 for n in self.nodes if n["p"].startswith(prefix))
        return self._count[d]


# ----------------------------------------------------------------------------- markdown


def make_markdown(repo):
    def highlight(code, lang, _attrs):
        try:
            lexer = get_lexer_by_name(lang) if lang else TextLexer()
        except ClassNotFound:
            lexer = TextLexer()
        return pyg_highlight(code, lexer, HtmlFormatter(nowrap=True))

    md = MarkdownIt("commonmark", {"highlight": highlight, "html": True}).enable(["table", "strikethrough"])
    md.use(anchors_plugin, min_level=1, max_level=6, slug_func=slugify, permalink=False)

    default_fence = md.renderer.rules["fence"]

    def fence(tokens, idx, options, env):
        tok = tokens[idx]
        lang = (tok.info or "").strip().split(" ")[0]
        if lang == "mermaid":
            env["mermaid"] = True
            return f'<pre class="mermaid">{html.escape(tok.content)}</pre>\n'
        body = highlight(tok.content, lang, None)
        cls = f' class="language-{html.escape(lang)}"' if lang else ""
        return f'<pre class="code"><code{cls}>{body}</code></pre>\n'

    md.add_render_rule("fence", lambda self, t, i, o, e: fence(t, i, o, e))

    def link_open(self, tokens, idx, options, env):
        tok = tokens[idx]
        href = tok.attrGet("href")
        if href:
            tally = repo.links.setdefault(env["src"], [0, 0])
            tally[0] += 1
            tally[1] += bool(re.match(r"^(https?:)?//", href))
            new, broken = rewrite_href(repo, href, env["src"])
            tok.attrSet("href", new)
            if broken:
                tok.attrSet("class", "broken")
                tok.attrSet("title", "This target is not in the repository")
                repo.broken.append((env["src"], href))
            elif re.match(r"^(https?:)?//", new):
                tok.attrSet("rel", "noopener")
        return self.renderToken(tokens, idx, options, env)

    md.add_render_rule("link_open", link_open)

    FILE_NAME = re.compile(r"^[\w][\w./-]*\.(?:html|md|py|js|jsx|tsx?|json|sh|txt|css)$")

    def link_file_mentions(state):
        """`quiz-app.html` or **quiz-app.html** in running text: link it when the file exists in the repository."""
        from markdown_it.token import Token
        src = state.env.get("src")
        if not src:
            return
        for block in state.tokens:
            if block.type != "inline" or not block.children:
                continue
            out, in_link, i, kids = [], 0, 0, block.children
            while i < len(kids):
                t = kids[i]
                if t.type == "link_open":
                    in_link += 1
                elif t.type == "link_close":
                    in_link -= 1
                target = None
                if not in_link and t.type == "code_inline" and FILE_NAME.match(t.content):
                    target = t.content
                    group = [t]
                elif (not in_link and t.type == "strong_open" and i + 2 < len(kids) and kids[i + 1].type == "text"
                      and kids[i + 2].type == "strong_close" and FILE_NAME.match(kids[i + 1].content)):
                    target = kids[i + 1].content
                    group = kids[i:i + 3]
                if target:
                    saved = repo.repaired
                    new, broken = rewrite_href(repo, target, src)
                    repo.repaired = saved
                    if not broken and not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", new):
                        a = Token("link_open", "a", 1)
                        a.attrSet("href", target)
                        a.attrSet("class", "mention")
                        out.append(a)
                        out.extend(group)
                        out.append(Token("link_close", "a", -1))
                        i += len(group)
                        continue
                out.append(t)
                i += 1
            block.children = out

    md.core.ruler.push("link_file_mentions", link_file_mentions)

    BARE_URL = re.compile(r"https?://[^\s<>\"'\]]+")

    def link_bare_urls(state):
        """Plain https:// addresses in running text become links (CommonMark leaves them as text)."""
        from markdown_it.token import Token
        for block in state.tokens:
            if block.type != "inline" or not block.children:
                continue
            out, in_link = [], 0
            for t in block.children:
                if t.type == "link_open":
                    in_link += 1
                elif t.type == "link_close":
                    in_link -= 1
                if in_link or t.type != "text" or "http" not in t.content:
                    out.append(t)
                    continue
                pos = 0
                for m in BARE_URL.finditer(t.content):
                    url = m.group(0)
                    while url and (url[-1] in ".,;:!?*" or (url[-1] == ")" and url.count("(") < url.count(")"))):
                        url = url[:-1]
                    if len(url) < 12:
                        continue
                    if m.start() > pos:
                        pre = Token("text", "", 0)
                        pre.content = t.content[pos:m.start()]
                        out.append(pre)
                    a = Token("link_open", "a", 1)
                    a.attrSet("href", url)
                    out.append(a)
                    label = Token("text", "", 0)
                    label.content = url
                    out.append(label)
                    out.append(Token("link_close", "a", -1))
                    pos = m.start() + len(url)
                if pos == 0:
                    out.append(t)
                    continue
                if pos < len(t.content):
                    post = Token("text", "", 0)
                    post.content = t.content[pos:]
                    out.append(post)
            block.children = out

    md.core.ruler.push("link_bare_urls", link_bare_urls)
    return md


def slugify(s):
    # GitHub's rule, which the documents' own contents lists were written against: drop punctuation and emoji, then
    # turn every space into a hyphen (so "A & B" becomes "a--b" and a trailing emoji leaves a trailing hyphen)
    s = re.sub(r"[^\w\s-]", "", s.strip().lower(), flags=re.UNICODE)
    return re.sub(r"\s", "-", s)


def rewrite_href(repo, href, src):
    """Point repo-relative links at the generated pages. Returns (href, is_broken)."""
    if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", href) or href.startswith(("#", "//")):
        return href, False
    path, sep, frag = href.partition("#")
    path, _, query = path.partition("?")
    if not path:
        return href, False
    target = posixpath.normpath(posixpath.join(posixpath.dirname(src), unquote(path)))
    if target == ".":
        target = ""
    if target.startswith(".."):
        return href, True
    tail = (sep + frag) if sep else ""
    if target in repo.fileset:
        if target.endswith(".md"):
            return path[:-3] + ".html" + tail, False
        if target in repo.has_viewer:
            return path + ".html" + tail, False
        return href, False
    if target in repo.dirs:
        return path.rstrip("/") + "/" + tail if path.strip("./") else path + tail, False
    # Links written before the files were reorganised: follow the file if its name is unique.
    matches = repo.by_name.get(posixpath.basename(target), [])
    if len(matches) == 1:
        repo.repaired += 1
        rel = posixpath.relpath(matches[0], posixpath.dirname(src) or ".")
        return rewrite_href(repo, rel + tail, src)
    return href, True


# ----------------------------------------------------------------------------- html


# Pages shown in the home page carousel, in order (path, heading); the blurb comes from page-types.json.
FEATURED = [
    ("learning-resources/mathematics/real-world/index.html", "Combinatorics in the real world"),
    ("development-tools/resource-explorer/index.html", "Resource Explorer"),
    ("ai-ml/careers/ai-engineer-roadmap/quiz-app.html", "AI engineer question bank"),
    ("game-development/algorithms/aruco-marker-games/simulator/index.html", "ArUco marker game simulator"),
    ("game-development/complexity-explorer/index.html", "Complexity explorer"),
    ("game-development/algorithms/playcanvas-examples/lab/index.html", "Algorithm lab"),
    ("development-tools/benchmarking/model-explorer/index.html", "Which model fits my GPU?"),
]


def esc(s):
    return html.escape(str(s), quote=True)


def root_prefix(out_path):
    depth = out_path.count("/")
    return "../" * depth if depth else ""


def pygments_css():
    light = HtmlFormatter(style="default").get_style_defs(".code")
    dark = HtmlFormatter(style="github-dark").get_style_defs(".code")
    scoped_media = HtmlFormatter(style="github-dark").get_style_defs(':root:not([data-theme="light"]) .code')
    scoped_attr = HtmlFormatter(style="github-dark").get_style_defs(':root[data-theme="dark"] .code')
    del dark
    return (
        f"/* generated by build.py */\n{light}\n"
        f"@media (prefers-color-scheme: dark) {{\n{scoped_media}\n}}\n{scoped_attr}\n"
    )


def nav_html(repo, root, current_dir):
    def render(d, depth):
        subdirs, _ = repo.children(d)
        items = []
        for sd in subdirs:
            label = sd.split("/")[-1]
            n = repo.count_under(sd)
            if n == 0:
                continue
            active = current_dir == sd or current_dir.startswith(sd + "/")
            cls = ' class="here"' if current_dir == sd else ""
            link = f'<a{cls} href="{esc(root + sd)}/">{esc(label)} <small>{n}</small></a>'
            kids, _ = repo.children(sd)
            if kids:
                items.append(
                    f'<li><details{" open" if active else ""}><summary>{link}</summary>{render(sd, depth + 1)}</details></li>'
                )
            else:
                items.append(f"<li>{link}</li>")
        return "<ul>" + "".join(items) + "</ul>" if items else ""

    return render("", 0)


def crumbs_html(root, path, is_dir):
    parts = [p for p in path.split("/") if p]
    out = [f'<a href="{root}index.html">Atlas</a>']
    acc = ""
    for i, part in enumerate(parts):
        acc = acc + ("/" if acc else "") + part
        last = i == len(parts) - 1
        if last and not is_dir:
            out.append(f"<span>{esc(part)}</span>")
        else:
            out.append(f'<a href="{esc(root + acc)}/">{esc(part)}</a>')
    return '<nav class="crumbs" aria-label="Breadcrumb">' + '<i aria-hidden="true">/</i>'.join(out) + "</nav>"


def page(repo, out_path, title, body, *, current_dir="", crumbs="", mermaid=False, hub=False, extra_head=""):
    root = root_prefix(out_path)
    if hub:
        nav = ""
    else:
        key = (root, current_dir)
        if key not in repo._nav:
            repo._nav[key] = nav_html(repo, root, current_dir)
        nav = repo._nav[key]
    sidebar = (
        f'<aside class="side" id="side"><p class="side-title">Folders</p>{nav}</aside>' if not hub else ""
    )
    shell_class = "shell hub" if hub else "shell"
    return f"""<!doctype html>
<html lang="en" data-root="{root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{esc(title)}</title>
<script>try{{var t=localStorage.getItem('atlas-theme');if(t)document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Ccircle cx=%275%27 cy=%2717%27 r=%272.4%27 fill=%27%23f2705e%27/%3E%3Ccircle cx=%2712%27 cy=%276%27 r=%272.8%27 fill=%27%237c8dff%27/%3E%3Ccircle cx=%2719%27 cy=%2714%27 r=%272.2%27 fill=%27%232fb8a6%27/%3E%3C/svg%3E">
<link rel="stylesheet" href="{root}assets/site.css">
<link rel="stylesheet" href="{root}assets/code.css">
{extra_head}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <a class="brand" href="{root}index.html"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><g fill="currentColor"><circle cx="5" cy="17" r="2"/><circle cx="12" cy="6" r="2.4"/><circle cx="19" cy="14" r="1.8"/><circle cx="14" cy="19" r="1.3"/></g><path d="M5 17 12 6l7 8-5 5Z" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"/></svg><span>{SITE_NAME}</span></a>
  <nav class="links" aria-label="Site">
    <a href="{root}index.html">Map</a>
    <a href="{root}README.html">About</a>
    <a href="{esc(REPO_URL)}">GitHub</a>
  </nav>
  <div class="search">
    <input id="q" type="search" placeholder="Search files" autocomplete="off" spellcheck="false" aria-label="Search the atlas" role="combobox" aria-expanded="false" aria-controls="results">
    <ul id="results" role="listbox" hidden></ul>
  </div>
  <button class="icon-btn" id="theme" type="button" aria-label="Switch colour theme"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor"/></svg></button>
  {'' if hub else '<button class="icon-btn side-toggle" id="side-toggle" type="button" aria-label="Show folders" aria-controls="side"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" fill="none"/></svg></button>'}
</header>
<div class="{shell_class}">
{sidebar}
<main id="main">
{crumbs}
{body}
</main>
</div>
<footer class="foot">Built from <a href="{esc(REPO_URL)}/commit/{BUILD['sha']}">{BUILD['short']}</a> on {BUILD['date']} · <a href="{esc(REPO_URL)}">Source on GitHub</a></footer>
<script src="{root}assets/site.js" defer></script>
{f'<script src="{MERMAID_SRC}" defer></script>' if mermaid else ''}
</body>
</html>
"""


def file_row(root, node):
    kind = node["k"]
    snip = f'<span class="row-snip">{esc(node["x"])}</span>' if node["x"] and kind != "code" else ""
    return (
        f'<li class="row" data-cat="{esc(node["c"])}"><a href="{esc(root + node["u"])}">'
        f'<span class="row-title">{esc(node["t"])}</span>'
        f'<span class="row-meta"><b class="kind {kind}">{esc(node.get("ty") or KIND_LABEL[kind])}</b> {esc(posixpath.basename(node["p"]))} · {fmt_size(node["s"])}{" · Updated " + fmt_date(node["du"]) if node.get("du") else ""}</span>'
        f"{snip}</a></li>"
    )


def plural(n, word):
    return f"{n} {word}{'' if n == 1 else 's'}"


def fmt_size(n):
    return f"{n} B" if n < 1024 else f"{n / 1024:.0f} KB" if n < 1024 * 1024 else f"{n / 1024 / 1024:.1f} MB"


def render_dir_index(repo, md, d):
    out_path = (d + "/" if d else "") + "index.html"
    root = root_prefix(out_path)
    subdirs, files = repo.children(d)
    readme = next((f for f in files if posixpath.basename(f).lower() == "readme.md"), None)
    body = []
    title = d.split("/")[-1] if d else SITE_NAME
    mermaid = False
    if readme:
        env = {"src": readme}
        body.append(f'<article class="prose">{md.render(read_text(readme), env)}</article>')
        mermaid = env.get("mermaid", False)
    else:
        label = CATEGORIES[d][0] if d in CATEGORIES else title
        body.append(f'<h1 class="page-title">{esc(label)}</h1>')
        if d in CATEGORIES:
            body.append(f'<p class="lede">{esc(CATEGORIES[d][2])}</p>')
    if subdirs:
        cards = "".join(
            f'<li><a href="{esc(root + sd)}/"><span class="folder-name">{esc(sd.split("/")[-1])}</span>'
            f'<span class="folder-n">{repo.count_under(sd)} files</span></a></li>'
            for sd in subdirs if repo.count_under(sd)
        )
        body.append(f'<section class="listing"><h2>Folders</h2><ul class="folders">{cards}</ul></section>')
    shown = [repo.meta[f] for f in files if f in repo.meta] + [n for n in repo.extras if n["d"] == d]
    order = {"doc": 0, "app": 1, "code": 2}
    shown.sort(key=lambda n: (order[n["k"]], n["p"]))
    if shown:
        rows = "".join(file_row(root, n) for n in shown)
        body.append(f'<section class="listing"><h2>Files</h2><ul class="rows">{rows}</ul></section>')
    write(out_path, page(repo, out_path, f"{title} · {SITE_NAME}", "\n".join(body),
                         current_dir=d, crumbs=crumbs_html(root, d, True), mermaid=mermaid))


# "**Repository**: owner/name" lines in the research lists name a GitHub project without linking to it
REPO_LINE = re.compile(r"^(\s*(?:[-*]\s*)?\*\*(?:Repository|Repo|GitHub)(?::\*\*|\*\*:?)\s*)`?([A-Za-z0-9][\w.-]*/[\w.-]+)`?[ \t]*$", re.M | re.I)


def render_markdown(repo, md, path):
    out_path = path[:-3] + ".html"
    root = root_prefix(out_path)
    env = {"src": path}
    source = REPO_LINE.sub(lambda m: f"{m.group(1)}[{m.group(2)}](https://github.com/{m.group(2)})", read_text(path))
    content = md.render(source, env)
    # A heading that ends in an emoji gets a trailing hyphen under GitHub's rule, but contents lists usually link
    # without it, so give those headings a second anchor.
    content = re.sub(r'(<h[1-6][^>]*\bid="([^"]*?)-+")', lambda m: f'<a id="{m.group(2)}"></a>' + m.group(1), content)
    node = repo.meta[path]
    edit = f'<a class="src-link" href="{esc(REPO_URL)}/blob/main/{esc(path)}">View on GitHub</a>'
    st = stamp_text(node)
    body = (f'<p class="stamp">{esc(st)}</p>' if st else "") + f'<article class="prose">{content}</article><p class="src">{edit}</p>'
    write(out_path, page(repo, out_path, f"{node['t']} · {SITE_NAME}", body,
                         current_dir=posixpath.dirname(path), crumbs=crumbs_html(root, path, False),
                         mermaid=env.get("mermaid", False)))


def render_code(repo, path):
    out_path = path + ".html"
    root = root_prefix(out_path)
    text = read_text(path)
    try:
        lexer = get_lexer_for_filename(path)
    except ClassNotFound:
        lexer = TextLexer()
    code = pyg_highlight(text, lexer, HtmlFormatter(nowrap=True))
    node = repo.meta[path]
    links = (
        f'<a href="{esc(posixpath.basename(path))}">Raw file</a> · '
        f'<a href="{esc(REPO_URL)}/blob/main/{esc(path)}">View on GitHub</a>'
    )
    body = (
        f'<h1 class="page-title mono">{esc(posixpath.basename(path))}</h1>'
        f'<p class="lede">{esc(node["x"])} · {fmt_size(node["s"])} · {links}</p>'
        f'<pre class="code viewer"><code>{code}</code></pre>'
    )
    write(out_path, page(repo, out_path, f"{posixpath.basename(path)} · {SITE_NAME}", body,
                         current_dir=posixpath.dirname(path), crumbs=crumbs_html(root, path, False)))


# ----------------------------------------------------------------------------- home


def render_home(repo):
    counts = {k: {"doc": 0, "app": 0, "code": 0} for k in CATEGORIES}
    for n in repo.nodes:
        counts[n["c"]][n["k"]] += 1
    n_doc = sum(c["doc"] for c in counts.values())
    n_app = sum(c["app"] for c in counts.values())
    n_code = sum(c["code"] for c in counts.values())

    chips = ['<button class="chip" type="button" data-cat="" aria-pressed="true">All areas</button>']
    for key, (label, color, _) in CATEGORIES.items():
        total = sum(counts[key].values())
        chips.append(
            f'<button class="chip" type="button" data-cat="{key}" aria-pressed="false" style="--dot:{color}">'
            f'<i></i>{esc(label)} <small>{total}</small></button>'
        )

    apps = sorted((n for n in repo.nodes if n["k"] == "app"),
                  key=lambda n: (TYPE_ORDER.index(n["ty"]) if n["ty"] in TYPE_ORDER else 99, n["t"].lower()))
    type_counts = {}
    for n in apps:
        type_counts[n["ty"]] = type_counts.get(n["ty"], 0) + 1
    type_chips = f'<button type="button" data-type="" aria-pressed="true">All <small>{len(apps)}</small></button>' + "".join(
        f'<button type="button" data-type="{esc(t)}" aria-pressed="false">{esc(t)} <small>{type_counts[t]}</small></button>'
        for t in TYPE_ORDER if t in type_counts
    )
    app_cards = "".join(
        f'<li data-type="{esc(n["ty"])}" style="--dot:{CATEGORIES[n["c"]][1]}"><a href="{esc(n["u"])}" title="{esc(n["p"])}">'
        f'<span class="app-top"><b class="ty">{esc(n["ty"])}</b><span class="app-cat">{esc(CATEGORIES[n["c"]][0])}</span></span>'
        f'<span class="app-title">{esc(n["t"])}</span><span class="app-blurb">{esc(n["x"])}</span>'
        f'<span class="app-dates">{"<span>Started " + fmt_date(n["ds"]) + "</span><span>Updated " + fmt_date(n["du"]) + "</span>" if n.get("ds") else ""}</span></a></li>'
        for n in apps
    )

    area_cards = []
    for key, (label, color, desc) in CATEGORIES.items():
        docs = [n for n in repo.nodes if n["c"] == key and n["k"] == "doc"]
        docs.sort(key=lambda n: (posixpath.basename(n["p"]).lower() != "readme.md", -n["s"]))
        top = "".join(f'<li><a href="{esc(n["u"])}">{esc(n["t"])}</a></li>' for n in docs[:4])
        c = counts[key]
        link = f'{key}/' if key != "root" else "README.html"
        area_cards.append(
            f'<li class="area" style="--dot:{color}"><h3><a href="{esc(link)}">{esc(label)}</a></h3>'
            f'<p>{esc(desc)}</p>'
            f'<p class="area-n">{plural(c["doc"], "document")} · {plural(c["app"], "page")} · {plural(c["code"], "code file")}</p>'
            f'{"<ul>" + top + "</ul>" if top else ""}</li>'
        )

    cats_json = {k: {"label": v[0], "color": v[1], "desc": v[2]} for k, v in CATEGORIES.items()}
    for n in repo.nodes:
        n["lk"], n["le"] = repo.links.get(n["p"], [0, 0])
    data = {"nodes": repo.nodes}
    has_prov = bool(repo.sessions)
    inline = lambda obj: json.dumps(obj, separators=(",", ":")).replace("</", "<\\/")

    by_path = {n["p"]: n for n in repo.nodes}
    slides = []
    for p, title in FEATURED:
        n = by_path.get(p)
        if n:
            slides.append(f'<li class="slide" role="group" aria-roledescription="slide"><a href="{esc(n["u"])}"><span class="ft-tag">{esc(n.get("ty", "Page"))}</span><span class="ft-title">{esc(title)}</span><span class="ft-text">{esc(n.get("x", ""))}</span><span class="ft-go">Open →</span></a></li>')
    carousel = (
        '<section class="carousel" aria-roledescription="carousel" aria-label="Featured pages"><p class="car-head">Featured · try it</p>'
        f'<ul class="track" id="track">{"".join(slides)}</ul>'
        '<div class="car-ctl"><button type="button" id="car-prev" aria-label="Previous">←</button><span class="dots" id="car-dots"></span><button type="button" id="car-next" aria-label="Next">→</button><button type="button" id="car-play" aria-label="Pause automatic change" aria-pressed="false">Pause</button></div></section>'
    ) if slides else ""

    body = f"""
<section class="hero">
  <p class="eyebrow">{n_doc + n_app + n_code} files from 30 Claude Code sessions</p>
  <h1>{SITE_NAME}</h1>
  <p class="lede">A map of everything the sessions produced. The <b>Overview</b> shows the areas around this repo's README; click one to open its folders. <b>All files</b> plots every file as a point. <b>Runnable pages</b> lights up the diamonds you can open in the browser, filtered by type. <b>By session</b> replays the build, one chat at a time.</p>
</section>
{carousel}
<section class="mapwrap" aria-label="3D map of the repository">
  <div class="chiprow">
    <div class="chips" role="group" aria-label="Filter by area">{''.join(chips)}</div>
    <div class="modes" role="group" aria-label="View"><button type="button" data-mode="overview" aria-pressed="true">Overview</button><button type="button" data-mode="folder" aria-pressed="false">All files</button><button type="button" data-mode="run" aria-pressed="false">Runnable pages</button>{'<button type="button" data-mode="session" aria-pressed="false">By session</button>' if has_prov else ''}</div>
  </div>
  <div class="metrics" id="metrics" role="group" aria-label="Mark folders by"><span>Mark folders with the most</span><button type="button" data-metric="files" aria-pressed="true">Files</button><button type="button" data-metric="pages" aria-pressed="false">Pages</button><button type="button" data-metric="links" aria-pressed="false">Links</button></div>
  <div class="typechips" id="typechips" role="group" aria-label="Filter runnable pages by type" hidden>{type_chips}</div>
  <div class="mapgrid">
  <div class="stage" id="stage">
    <canvas id="map" role="img" aria-label="3D map of {len(repo.nodes)} files grouped by folder. The lists below hold the same content."></canvas>
    <div class="labels" id="labels" aria-hidden="true"></div>
    <div class="pin" id="pin" hidden></div>
    <div class="tip" id="tip" hidden></div>
    <p class="hint" id="hint" aria-hidden="true">Drag to rotate · scroll or pinch to zoom · click a point</p>
    <p class="nogl" id="nogl" hidden>The 3D map needs WebGL, which this browser has turned off. The lists below cover the same files.</p>
  </div>
  <aside class="card" id="card" aria-live="polite"></aside>
  </div>
  {'<div class="timeline" id="timeline" hidden><div class="tl-head"><button type="button" id="tl-play" class="tl-btn">Play</button><input type="range" id="tl-range" min="0" max="' + str(len(repo.sessions) - 1) + '" value="' + str(len(repo.sessions) - 1) + '" aria-label="Session"><span class="tl-key"><i class="now"></i>this session<i class="past"></i>earlier<i class="later"></i>later</span></div><p class="tl-label" id="tl-label" aria-live="polite"></p><div class="tl-bars" id="tl-bars" role="group" aria-label="Files produced by each session, oldest first"></div></div>' if has_prov else ''}
</section>
<details class="block runfallback">
  <summary>Pages you can run, as a plain list</summary>
  <ul class="apps">{app_cards}</ul>
</details>
<section class="block">
  <h2>Areas</h2>
  <ul class="areas">{''.join(area_cards)}</ul>
</section>
<section class="block about">
  <h2>About this site</h2>
  <p>The files come from 30 Claude Code sessions run in Q4 2025 as part of a $250 credit test. Merging those branches, auditing the merge for lost files and building this site happened in one later session, which was part of a $100 free-credit test.</p>
  <p><a href="MERGE_COMPLETE.html">How the branches were merged</a> · <a href="BRANCH_CLEANUP_CHECKLIST.html">Branch and chat cleanup checklist</a> · <a href="README.html">Repository README</a></p>
</section>
<script type="application/json" id="tree-data">{inline(data)}</script>
<script type="application/json" id="cats-data">{inline(cats_json)}</script>
<script type="application/json" id="prov-data">{inline(repo.sessions)}</script>
<script type="importmap">{{"imports":{{"three":"./assets/vendor/three.module.min.js"}}}}</script>
<script src="assets/carousel.js"></script>
<script type="module" src="assets/hub.js"></script>
"""
    write("index.html", page(repo, "index.html", SITE_NAME, body, hub=True))
    return data


# ----------------------------------------------------------------------------- output


def write(rel, content):
    dest = OUT / rel
    if dest.exists():
        sys.exit(f"build collision: {rel} would be overwritten")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content, encoding="utf-8")


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    repo = Repo()
    md = make_markdown(repo)

    # Raw copies first, so apps keep working and the viewer pages can link to the originals.
    for f in repo.files:
        if f.endswith(".md"):
            continue
        dest = OUT / f
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / f, dest)

    for f in repo.files:
        if f.endswith(".md"):
            render_markdown(repo, md, f)
        elif f in repo.has_viewer:
            render_code(repo, f)

    for d in sorted(repo.dirs):
        if d and (OUT / d / "index.html").exists():
            continue  # the folder already has its own index.html (a runnable page)
        if not d:
            continue
        render_dir_index(repo, md, d)

    data = render_home(repo)
    (OUT / "data").mkdir(exist_ok=True)
    (OUT / "data" / "tree.json").write_text(
        json.dumps({"nodes": [{k: n[k] for k in ("p", "u", "k", "c", "t")} for n in data["nodes"]]},
                   separators=(",", ":")),
        encoding="utf-8",
    )
    shutil.copytree(ASSETS, OUT / "assets")
    (OUT / "assets" / "code.css").write_text(pygments_css(), encoding="utf-8")
    (OUT / ".nojekyll").write_text("")
    import atlas_bar
    print(f"back bar added to {atlas_bar.run(OUT)} runnable pages")

    pages = sum(1 for _ in OUT.rglob("*.html"))
    print(f"{len(repo.nodes)} files on the map, {pages} html pages, {len(repo.dirs) - 1} folders")
    seen = set()
    for src, href in repo.broken:
        if (src, href) not in seen:
            seen.add((src, href))
    print(f"{repo.repaired} links to moved files were re-pointed by filename")
    if seen:
        print(f"{len(seen)} links have no target in the repository (marked class=broken):")
        for src, href in sorted(seen)[:40]:
            print(f"  {src}: {href}")


def build_info():
    def git(*a):
        return subprocess.run(["git", *a], cwd=ROOT, capture_output=True, text=True).stdout.strip()

    sha = os.environ.get("GITHUB_SHA") or git("rev-parse", "HEAD") or "unknown"
    return {"sha": sha, "short": sha[:7], "date": datetime.date.today().isoformat()}


BUILD = build_info()

if __name__ == "__main__":
    main()
