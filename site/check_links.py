#!/usr/bin/env python3
"""Check every relative link and src in the generated pages in _site/.

Exits 1 if a target is missing and not listed in site/known-broken-links.txt.
Built demos (listed in demos.json) are skipped: they carry their own absolute paths.
"""
import json
import posixpath
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote

HERE = Path(__file__).resolve().parent
SITE = HERE.parent / "_site"
skip = [d["url"].rstrip("/") + "/" for d in json.loads((HERE / "demos.json").read_text())] if (HERE / "demos.json").exists() else []
known = set()
kb = HERE / "known-broken-links.txt"
if kb.exists():
    known = {l.split("#")[0].strip() for l in kb.read_text().splitlines() if l.strip() and not l.startswith("#")}


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.found = []

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k in ("href", "src") and v and not v.startswith(("#", "//", "data:", "mailto:")) and ":" not in v.split("/")[0]:
                self.found.append(v)


missing, total = {}, 0
for page in SITE.rglob("*.html"):
    rel = page.relative_to(SITE).as_posix()
    if any(rel.startswith(s) for s in skip):
        continue
    parser = Links()
    parser.feed(page.read_text(encoding="utf-8", errors="replace"))
    for ref in parser.found:
        total += 1
        path = ref.split("#")[0].split("?")[0]
        if not path:
            continue
        target = posixpath.normpath(posixpath.join(posixpath.dirname(rel), unquote(path)))
        full = SITE / target
        if not (full.is_file() or (full / "index.html").is_file()):
            missing.setdefault(target, rel)

new = {t: s for t, s in missing.items() if t not in known}
print(f"{total} relative references checked, {len(missing)} missing ({len(missing) - len(new)} known)")
for t, s in sorted(new.items()):
    print(f"  NEW  {t}   <- {s}")
sys.exit(1 if new else 0)
