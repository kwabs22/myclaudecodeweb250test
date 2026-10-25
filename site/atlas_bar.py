#!/usr/bin/env python3
"""Give every runnable page in _site/ a slim bar with a way back to the atlas.

Runs after build.py and again after build_demos.sh (it is safe to repeat). Pages that already link back
("Session Atlas" in the HTML) are left alone. The exported Expo games page also gets a scroll fix: Expo's
reset locks the page from scrolling, and the games are laid out for phone-height screens.
"""
import json
import re
import sys
from pathlib import Path

BAR_CSS = """<style data-atlas-bar>
#atlas-bar{position:fixed;top:0;left:0;right:0;height:34px;z-index:2147483647;display:flex;align-items:center;gap:10px;padding:0 12px;background:#0b0d14;border-bottom:1px solid #232a3d;font:600 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;color:#aab4cc}
#atlas-bar a{color:#9fb4ff;text-decoration:none;padding:8px 0;white-space:nowrap}
#atlas-bar a:hover{text-decoration:underline}
#atlas-bar span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
body{padding-top:34px!important;box-sizing:border-box!important}
.sticky{top:34px!important}
</style>
"""
EXPO_CSS = """<style data-atlas-expo>
body{overflow:auto!important}
#root{min-height:760px}
</style>
"""


def inject(page, root):
    text = page.read_text(encoding="utf-8", errors="replace")
    if "data-atlas-bar" in text or "Session Atlas" in text or "<body" not in text:
        return False
    depth = len(page.relative_to(root).parts) - 1
    prefix = "../" * depth if depth else "./"
    m = re.search(r"<title[^>]*>(.*?)</title>", text, re.S | re.I)
    title = re.sub(r"\s+", " ", m.group(1)).strip() if m else ""
    css = BAR_CSS + (EXPO_CSS if 'id="expo-reset"' in text else "")
    bar = f'<div id="atlas-bar" data-atlas-bar><a href="{prefix}index.html">&larr; Session Atlas</a><span>{title}</span></div>'
    if "/_next/" in text:
        # React hydrates the whole document, so markup added to the HTML would be reported as a mismatch (#418).
        # Add the bar from a script once the page has loaded instead.
        payload = json.dumps(css + bar).replace("</", "<\\/")
        script = ("<script data-atlas-bar>addEventListener('load',function(){setTimeout(function(){var t=document.createElement('div');"
                  "t.innerHTML=" + payload + ";while(t.firstChild)document.body.insertBefore(t.firstChild,document.body.firstChild)},50)})</script>")
        text = re.sub(r"</body>", lambda _: script + "</body>", text, count=1, flags=re.I)
        page.write_text(text, encoding="utf-8")
        return True
    text = re.sub(r"</head>", lambda _: css + "</head>", text, count=1, flags=re.I)
    text = re.sub(r"(<body[^>]*>)", lambda mm: mm.group(1) + bar, text, count=1, flags=re.I)
    page.write_text(text, encoding="utf-8")
    return True


def run(site):
    site = Path(site)
    tree = site / "data" / "tree.json"
    if not tree.exists():
        return 0
    done = 0
    for n in json.loads(tree.read_text(encoding="utf-8"))["nodes"]:
        if n["k"] != "app":
            continue
        page = site / n["u"]
        if page.is_dir():
            page = page / "index.html"
        if page.is_file() and inject(page, site):
            done += 1
    return done


if __name__ == "__main__":
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "_site"
    print(f"added the back bar to {run(root)} pages")
