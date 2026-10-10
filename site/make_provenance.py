#!/usr/bin/env python3
"""Work out which original session produced each file in the repository.

Run it once while the old claude/* branches still exist (the merge commit keeps their history, but the
branch names live only in the remote) and commit the result:

    git fetch origin '+refs/heads/*:refs/remotes/origin/*'
    python site/make_provenance.py > site/provenance.json

Each file is matched against every branch's tree: same contents first (earliest session wins, so files all
branches inherited belong to the session that created them), then same path, then same file name.
Files that match nothing were written after the merge, in the session that organised it.
"""
import json
import posixpath
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
THIS_SESSION = "repo-state-overview"


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, check=True).stdout


def tree(ref):
    out = {}
    for line in git("ls-tree", "-r", ref).splitlines():
        meta, path = line.split("\t", 1)
        out[path] = meta.split()[2]
    return out


def slug(branch):
    return re.sub(r"-(0[0-9A-Za-z]{23}|[0-9A-Za-z]{5,6})$", "", branch.split("claude/", 1)[1])


sessions = json.loads((HERE / "provenance-sessions.json").read_text(encoding="utf-8"))
existing = set(git("for-each-ref", "--format=%(refname:short)", "refs/remotes/origin/claude/").split())
by_slug = {}
for s in sessions:
    s["slug"] = slug(s["branch"])
    s["ref"] = "origin/" + s["branch"]
    by_slug[s["slug"]] = s

blob_owners, path_owners, name_owners = {}, {}, {}
order = sorted((s for s in sessions if s["ref"] in existing and s["slug"] != THIS_SESSION), key=lambda s: s["created"])
for s in order:
    for path, blob in tree(s["ref"]).items():
        blob_owners.setdefault(blob, s["slug"])        # first (earliest) session wins
        path_owners.setdefault(path, s["slug"])
        name_owners.setdefault(posixpath.basename(path), s["slug"])

head = tree("HEAD")
files, how = {}, {"contents": 0, "path": 0, "name": 0, "after the merge": 0}
for path, blob in head.items():
    if path.split("/")[0] in ("site", ".github"):
        continue
    if blob in blob_owners:
        files[path] = blob_owners[blob]; how["contents"] += 1
    elif path in path_owners:
        files[path] = path_owners[path]; how["path"] += 1
    elif posixpath.basename(path) in name_owners and posixpath.basename(path).lower() not in ("readme.md", "index.html", "package.json", "requirements.txt", ".gitignore"):
        files[path] = name_owners[posixpath.basename(path)]; how["name"] += 1
    else:
        files[path] = THIS_SESSION; how["after the merge"] += 1

counts = {}
for slug_ in files.values():
    counts[slug_] = counts.get(slug_, 0) + 1
out_sessions = []
for s in sorted(sessions, key=lambda s: s["created"]):
    if counts.get(s["slug"]):
        out_sessions.append({"id": s["slug"], "title": s["title"], "date": s["created"][:10], "created": s["created"], "files": counts[s["slug"]]})

sys.stderr.write(f"matched by {how}\n")
json.dump({"sessions": out_sessions, "files": files}, sys.stdout, indent=None, separators=(",", ":"), ensure_ascii=False)
