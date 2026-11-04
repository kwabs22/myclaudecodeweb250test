"""Reads the three API documents and writes apis.js for the explorer page: every API's name, docs link, auth type and category.
Endpoints to try live are in endpoints.json (written by hand: the documents hold search-term ideas, not URLs).
Run:  python3 build_data.py   (add --check to only report)"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
DOCS = ["development-tools/apis/popular-api-call-examples.md", "development-tools/apis/information-api-call-examples.md", "development-tools/apis/additional-popular-app-apis.md"]
HEAD = re.compile(r"^#{2,3}\s+(\d+)\.\s+(.+?)\s*$")
LINK = re.compile(r"\[([^\]]*)\]\(([^)]+)\)")
AUTH = re.compile(r'<span class="auth (auth-[a-z]+)"[^>]*>([^<]+)</span>')


def slug(title):   # the heading anchor the site's markdown pages use (GitHub style)
    s = re.sub(r"[^\w\- ]", "", title.lower()).strip().replace(" ", "-")
    return s


def parse(path):
    out, cur = [], None
    for ln in open(os.path.join(ROOT, path), encoding="utf-8").read().splitlines():
        h = HEAD.match(ln)
        if h:
            cur = {"name": h.group(2), "num": int(h.group(1)), "doc": path.replace(".md", ".html"), "anchor": slug(f"{h.group(1)}. {h.group(2)}")}
            out.append(cur)
            continue
        if cur is None:
            continue
        if ln.startswith("**Documentation:**"):
            m = LINK.search(ln)
            if m:
                cur["docsUrl"] = m.group(2)
        elif ln.startswith("**Auth:**"):
            m = AUTH.search(ln)
            if m:
                cur["auth"] = m.group(1).replace("auth-", ""); cur["authLabel"] = m.group(2)
            cur["freeTier"] = "Free tier" in ln
        elif ln.startswith("**Category:**"):
            cur["category"] = ln.split(":**", 1)[1].strip()
    return [c for c in out if "auth" in c]


def main():
    apis = []
    for d in DOCS:
        got = parse(d); print(f"{len(got):3d}  {d}"); apis += got
    eps = json.load(open(os.path.join(HERE, "endpoints.json"))) if os.path.exists(os.path.join(HERE, "endpoints.json")) else {}
    names = {a["name"] for a in apis}
    for k in eps:
        if k not in names:
            print("endpoints.json has a name that is not in the documents:", k)
    for a in apis:
        e = eps.get(a["name"])
        if e:
            a["endpoint"] = e
    print(len(apis), "APIs;", sum(1 for a in apis if a["auth"] == "none"), "with no auth;", sum(1 for a in apis if "endpoint" in a), "with an endpoint to try")
    if "--check" not in sys.argv:
        with open(os.path.join(HERE, "apis.js"), "w", encoding="utf-8") as f:
            f.write("window.APIS = " + json.dumps(apis, ensure_ascii=False, separators=(",", ":")) + ";\n")


if __name__ == "__main__":
    main()
