#!/usr/bin/env python3
"""Check every external http(s) link in the repo's tracked text files.

Run by the "Check external links" workflow (the build sandbox has no outside network). Prints a report and, on
GitHub Actions, writes it to the job summary. Placeholder hosts (example.com, localhost, company.com ...) are skipped.
Exit code is always 0: a dead link is a to-do, not a failed build. Use --strict to exit 1 if any are broken.
"""
import os
import re
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
TEXT = (".md", ".html", ".txt", ".json", ".py", ".js", ".jsx", ".yml", ".csv")
SKIP_FILES = ("package-lock.json", "questions.json", "question-bank.json", "model_catalog")
PLACEHOLDER = re.compile(r"(^|\.)(example\.(com|org|net)|company\.com|yourdomain\.com|your-[\w-]+\.\w+|test\.com|acmecorp\.com|competitor[ab]\.com|crm\.com|w3\.org|fonts\.googleapis\.com|fonts\.gstatic\.com)$|^localhost|^127\.|^0\.0\.0\.0|^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^[^.]+$|yourusername|\{|\}|<|>|\$")
# Sites that answer scripts with 403/429/999 even when the page is fine: reported as "unchecked", not broken
BOT_WALLED = ("reddit.com", "linkedin.com", "twitter.com", "x.com", "instagram.com", "facebook.com", "medium.com", "udemy.com", "coursera.org", "bestbuy.com", "amazon.com", "quora.com")
URL = re.compile(r"https?://[A-Za-z0-9._~:/?#@!$&*+,;=%\-\[\]]+")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 link-check"

limits = defaultdict(lambda: threading.Semaphore(3))


def collect():
    files = subprocess.check_output(["git", "ls-files"], cwd=ROOT, text=True).splitlines()
    where = defaultdict(list)
    for f in files:
        if not f.endswith(TEXT) or f.startswith(("site/", ".github/")) or any(s in f for s in SKIP_FILES):
            continue
        try:
            text = (ROOT / f).read_text(errors="ignore")
        except OSError:
            continue
        for u in URL.findall(text):
            u = u.rstrip(".,;:)*]'\"")
            if u.endswith("&amp"):
                u = u[:-4]
            host = urlparse(u).hostname or ""
            if not host or PLACEHOLDER.search(host) or PLACEHOLDER.search(u.split("//", 1)[1]):
                continue
            if f not in where[u]:
                where[u].append(f)
    return where


def check(url):
    host = urlparse(url).hostname or ""
    status, note = None, ""
    with limits[host]:
        for attempt in range(3):
            req = urllib.request.Request(url.split("#")[0], headers={"User-Agent": UA, "Accept": "text/html,*/*"})
            try:
                with urllib.request.urlopen(req, timeout=25) as r:
                    status = r.status
                    if r.geturl().rstrip("/") != url.split("#")[0].rstrip("/"):
                        note = "-> " + r.geturl()
                break
            except urllib.error.HTTPError as e:
                status = e.code
                if e.code in (429, 502, 503, 504) and attempt < 2:
                    time.sleep(3 * (attempt + 1))
                    continue
                break
            except Exception as e:  # DNS failure, TLS error, timeout
                status, note = None, type(e).__name__ + ": " + str(getattr(e, "reason", e))[:60]
                if host.endswith(BOT_WALLED) and "imed out" in note:
                    return url, "unchecked", None, note
                if attempt < 2:
                    time.sleep(2)
    if status and 200 <= status < 400:
        return url, "ok", status, note
    if status in (401, 403, 405, 429, 999) or (host.endswith(BOT_WALLED) and status):
        return url, "unchecked", status, note
    return url, "broken", status, note


def main():
    where = collect()
    urls = sorted(where)
    print(f"{len(urls)} distinct external links in {len({f for v in where.values() for f in v})} files", flush=True)
    with ThreadPoolExecutor(16) as ex:
        results = list(ex.map(check, urls))
    by = defaultdict(list)
    for r in results:
        by[r[1]].append(r)
    out = [f"## External link check\n", f"{len(urls)} links: {len(by['ok'])} ok, {len(by['unchecked'])} unchecked (site blocks scripts), {len(by['broken'])} broken\n"]
    for kind, title in (("broken", "Broken"), ("unchecked", "Unchecked (open these by hand)")):
        if by[kind]:
            out.append(f"\n### {title}\n\n| Status | URL | Found in |\n|---|---|---|")
            for u, _, st, note in by[kind]:
                files = ", ".join(f"`{f}`" for f in where[u][:3]) + (f" +{len(where[u]) - 3}" if len(where[u]) > 3 else "")
                out.append(f"| {st or note} | {u} | {files} |")
    redirects = [r for r in by["ok"] if r[3]]
    if redirects:
        out.append("\n### Redirected (still work; consider updating)\n\n| URL | Now at |\n|---|---|")
        out += [f"| {u} | {n[3:]} |" for u, _, _, n in redirects]
    report = "\n".join(out)
    print(report)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        Path(summary).write_text(report + "\n")
    return 1 if "--strict" in sys.argv and by["broken"] else 0


if __name__ == "__main__":
    sys.exit(main())
