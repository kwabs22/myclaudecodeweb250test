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
                }
                self.nodes.append(node)
                self.extras.append(node)

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
    md.use(anchors_plugin, min_level=2, max_level=4, slug_func=slugify, permalink=False)

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
    return md


def slugify(s):
    s = re.sub(r"[^\w\s-]", "", s.lower(), flags=re.UNICODE)
    return re.sub(r"[\s]+", "-", s.strip())


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
    <input id="q" type="search" placeholder="Search {len(repo.nodes)} files" autocomplete="off" spellcheck="false" aria-label="Search the atlas" role="combobox" aria-expanded="false" aria-controls="results">
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
        f'<span class="row-meta"><b class="kind {kind}">{KIND_LABEL[kind]}</b> {esc(posixpath.basename(node["p"]))} · {fmt_size(node["s"])}</span>'
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


def render_markdown(repo, md, path):
    out_path = path[:-3] + ".html"
    root = root_prefix(out_path)
    env = {"src": path}
    content = md.render(read_text(path), env)
    node = repo.meta[path]
    edit = f'<a class="src-link" href="{esc(REPO_URL)}/blob/main/{esc(path)}">View on GitHub</a>'
    body = f'<article class="prose">{content}</article><p class="src">{edit}</p>'
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

    apps = sorted((n for n in repo.nodes if n["k"] == "app"), key=lambda n: n["p"])
    app_cards = "".join(
        f'<li style="--dot:{CATEGORIES[n["c"]][1]}"><a href="{esc(n["u"])}"><span class="app-cat">{esc(CATEGORIES[n["c"]][0])}</span>'
        f'<span class="app-title">{esc(n["t"])}</span><span class="app-path">{esc(n["p"])}</span></a></li>'
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
    data = {"nodes": repo.nodes}
    inline = lambda obj: json.dumps(obj, separators=(",", ":")).replace("</", "<\\/")

    body = f"""
<section class="hero">
  <p class="eyebrow">{n_doc + n_app + n_code} files from 30 Claude Code sessions</p>
  <h1>{SITE_NAME}</h1>
  <p class="lede">A map of everything the sessions produced. Each point is a file, grouped by the folder it lives in. Diamonds are pages you can run in the browser.</p>
</section>
<section class="mapwrap" aria-label="3D map of the repository">
  <div class="chips" role="group" aria-label="Filter by area">{''.join(chips)}</div>
  <div class="stage" id="stage">
    <canvas id="map" role="img" aria-label="3D map of {len(repo.nodes)} files grouped by folder. The lists below hold the same content."></canvas>
    <div class="labels" id="labels" aria-hidden="true"></div>
    <div class="pin" id="pin" hidden></div>
    <div class="tip" id="tip" hidden></div>
    <p class="hint" aria-hidden="true">Drag to rotate · scroll or pinch to zoom · click a point</p>
    <p class="nogl" id="nogl" hidden>The 3D map needs WebGL, which this browser has turned off. The lists below cover the same files.</p>
    <aside class="card" id="card" aria-live="polite"></aside>
  </div>
</section>
<section class="block">
  <h2>Pages you can run</h2>
  <ul class="apps">{app_cards}</ul>
</section>
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
<script type="importmap">{{"imports":{{"three":"./assets/vendor/three.module.min.js"}}}}</script>
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
