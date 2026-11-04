#!/usr/bin/env python3
"""Build the API quiz bank (api-question-bank.json) from the repository's API documents.

Computed from the documents: which sign-up each API needs, how many APIs need what, and the free-tier figures in
../api-authentication-analysis.md. Computed by the standard library: HTTP status phrases (http.HTTPStatus), percent-encoding and query
strings (urllib.parse), JSON paths (json), paging and rate-limit arithmetic. A short list of concept questions is written by hand.
Run `python generate_api_questions.py`, then `python ../../../ai-ml/careers/ai-engineer-roadmap/check_question_banks.py`.
Needs only the standard library. The output is deterministic (fixed seed).
"""
import http
import json
import math
import re
import sys
from pathlib import Path
from urllib.parse import quote, urlencode

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[2] / "ai-ml" / "careers" / "ai-engineer-roadmap"))   # Bank, finish, num
sys.path.insert(0, str(HERE.parent.parent / "api-explorer"))                                  # the parser for the API documents
from question_tools import Bank, finish, num   # noqa: E402
import build_data                                  # noqa: E402

TOPIC = "apis"
LABEL = {"none": "No auth", "key": "API key", "oauth": "OAuth 2.0", "keysecret": "Key + secret", "account": "Account login", "token": "Bot or JWT token", "optional": "Key optional", "partner": "Partner only"}
MEANING = {"none": "call it straight away", "key": "register and send a key", "oauth": "create an app and run an authorisation flow for each user", "keysecret": "keep two credentials, one of them secret",
           "account": "set up a full cloud or account login with permissions", "token": "create a bot or sign a token yourself", "optional": "call it without a key (a key raises the limit)", "partner": "get a partnership agreement (no self-serve sign-up)"}
WORDS = ["hobbit", "dune", "rock & roll", "café", "a/b test", "50% off", "new york", "q=1", "hello world", "C++ tips", "data+science", "100%"]


def load_apis():
    out, seen = [], set()
    for d in build_data.DOCS:
        for a in build_data.parse(d):
            if a["name"] not in seen and a["auth"] in LABEL:
                seen.add(a["name"]); out.append(a)
    return out


def free_tiers():
    """Rows of 'API | N calls a day/minute/month' from the analysis document's free-tier table."""
    rows = []
    for ln in (build_data.ROOT and open(Path(build_data.ROOT) / "development-tools/apis/api-authentication-analysis.md", encoding="utf-8").read().splitlines()):
        m = re.match(r"\|\s*([^|]+?)\s*\|\s*([\d,]+) calls a (day|minute|month)\s*\|", ln)
        if m:
            rows.append((m.group(1), int(m.group(2).replace(",", "")), m.group(3)))
    return rows


def build():
    b = Bank(seed=20251118)
    r = b.rng
    apis = load_apis()
    labels = list(LABEL.values())
    counts = {k: sum(1 for a in apis if a["auth"] == k) for k in LABEL}
    n = len(apis)

    # --- which sign-up does an API need (from the documents' own badges)
    picks = {k: [a for a in apis if a["auth"] == k] for k in LABEL}
    chosen = []
    for k, want in [("none", 9), ("key", 8), ("oauth", 10), ("keysecret", 2), ("account", 3), ("token", 2), ("optional", 1), ("partner", 1)]:
        pool = picks[k][:]; r.shuffle(pool); chosen += pool[:want]
    r.shuffle(chosen)
    for a in chosen:
        right = LABEL[a["auth"]]
        wrong = [l for l in labels if l != right]; r.shuffle(wrong)
        near = {"none": ["API key"], "key": ["No auth", "OAuth 2.0"], "oauth": ["API key", "Key + secret"]}.get(a["auth"], [])
        wrong = [w for w in near if w in wrong] + [w for w in wrong if w not in near]
        b.add(TOPIC, "auth_per_api", "beginner" if a["auth"] in ("none", "key", "oauth") else "intermediate",
              f"According to this repository's API documents, what does the {a['name']} need before you can call it?", right, wrong,
              f"The document marks it \"{right}\": to use it you {MEANING[a['auth']]}. Providers change their rules, so check the provider's own page before you depend on it.")
    # --- which of four needs X
    for k, qtext in [("none", "needs no sign-up at all"), ("oauth", "needs OAuth 2.0 (an authorisation flow for each user)"), ("key", "needs an API key"), ("none", "can be called with no key and no account")]:
        for _ in range(4):
            right = r.choice(picks[k]); others = [a for a in apis if a["auth"] != k and a["auth"] != "optional"]; r.shuffle(others)
            wrong = []
            for a in others:
                if a["name"] not in wrong and a["name"] != right["name"]: wrong.append(a["name"])
                if len(wrong) == 3: break
            cands = sorted([right["name"]] + wrong)
            b.add(TOPIC, "auth_which", "intermediate", f"According to this repository's API documents, which of these APIs {qtext}? ({', '.join(cands)})", right["name"], wrong,
                  f"{right['name']} is listed as \"{LABEL[right['auth']]}\"; the other three are listed with a different type.")
    # --- counts from the documents
    pct_none = round(100 * counts["none"] / n)
    for text, ans, wrong, why in [
        (f"The repository's three API documents list {n} APIs in all. How many need no sign-up at all?", counts["none"], [counts["none"] + 5, counts["none"] - 6, counts["key"], counts["oauth"]], f"{counts['none']} are marked No auth."),
        ("How many of the APIs in the documents need OAuth 2.0?", counts["oauth"], [counts["none"], counts["oauth"] - 6, counts["oauth"] + 8, counts["key"]], f"{counts['oauth']} are marked OAuth 2.0, the biggest group."),
        ("How many of the APIs in the documents need an API key (not OAuth, not key + secret)?", counts["key"], [counts["oauth"], counts["key"] + 7, counts["key"] - 5, counts["none"]], f"{counts['key']} are marked API key."),
        (f"What share of the {n} APIs need no sign-up, to the nearest whole percent?", f"{pct_none}%", [f"{pct_none + 10}%", f"{pct_none - 12}%", f"{round(100 * counts['oauth'] / n)}%", f"{100 - pct_none}%"], f"{counts['none']} / {n} = {100 * counts['none'] / n:.1f}%."),
        ("Which sign-up type is the most common among the APIs in the documents?", "OAuth 2.0", ["No auth", "API key", "Account login"], f"OAuth 2.0 has {counts['oauth']}, then No auth {counts['none']} and API key {counts['key']}."),
        ("How many of the APIs need something more demanding than a key or OAuth: an account login, a partnership, or a key plus a secret?", counts["account"] + counts["partner"] + counts["keysecret"], [counts["account"], counts["partner"] + counts["keysecret"], counts["account"] + counts["partner"] + counts["keysecret"] + 4, counts["token"] + counts["account"]],
         f"{counts['keysecret']} key + secret, {counts['account']} account login and {counts['partner']} partner only."),
    ]:
        b.add(TOPIC, "auth_counts", "intermediate", text, ans, wrong, why + " (Counted from the documents when this bank was built.)")
    for doc, label in [("popular-api-call-examples.md", "popular"), ("information-api-call-examples.md", "information"), ("additional-popular-app-apis.md", "additional")]:
        c = len([a for a in build_data.parse("development-tools/apis/" + doc)])
        b.add(TOPIC, "auth_counts", "beginner", f"How many APIs does the repository's {label} API document describe?", c, [c + 4, c - 3, c * 2, c + 10], f"The {label} document has {c} API entries.")
    # --- free-tier arithmetic (figures from the analysis document's table)
    tiers = free_tiers()
    for name, calls, per in tiers:
        unit = {"day": 24, "minute": 1 / 60, "month": 30}[per]
        if per == "day":
            avg = calls / 24
            b.add(TOPIC, "rate_limits", "intermediate", f"{name}'s free plan allows {calls:,} calls a day. Spread evenly, about how many calls is that per hour?", f"{avg:.1f}".rstrip("0").rstrip("."), [f"{calls / 60:.1f}", f"{calls / 12:.1f}", f"{calls * 24:,.0f}", f"{calls / 7:.1f}"], f"{calls:,} / 24 = {avg:.1f}.")
            days = math.ceil(5000 / calls)
            b.add(TOPIC, "rate_limits", "intermediate", f"With {name}'s free allowance of {calls:,} calls a day, how many days does it take to make 5,000 calls (counting a partly used day as a day)?", days, [days - 1, days + 1, 5000 // 60, days * 2], f"⌈5000 / {calls:,}⌉ = {days}.")
        elif per == "minute":
            for total in (120, 500, 1000):
                mins = math.ceil(total / calls)
                b.add(TOPIC, "rate_limits", "intermediate", f"{name}'s free plan allows {calls} calls a minute. At the limit, how many minutes do {total:,} calls take?", mins, [mins + 1, mins - 1, total * calls, total // 60], f"{total:,} / {calls} = {mins} minutes (waiting out the limit between batches).")
        else:
            b.add(TOPIC, "rate_limits", "intermediate", f"{name}'s free plan allows {calls} calls a month. About how many calls a day is that, in a 30-day month?", f"{calls / 30:.1f}".rstrip("0").rstrip("."), [f"{calls / 7:.1f}", f"{calls * 30:,}", f"{calls / 12:.1f}", f"{calls / 24:.1f}"], f"{calls} / 30 = {calls / 30:.1f}.")
    for per_min in (60, 100, 10):
        wait = 60 / per_min
        b.add(TOPIC, "rate_limits", "beginner", f"An API allows {per_min} requests a minute. What is the shortest average gap, in seconds, between requests if you stay exactly at the limit?", f"{wait:.1f}".rstrip("0").rstrip("."), [f"{per_min}", f"{wait * 2:.1f}", f"{wait / 2:.2f}", f"{3600 / per_min / 60:.1f} minutes"], f"60 seconds / {per_min} = {wait:.2f} seconds.")
    # --- HTTP status phrases, computed with http.HTTPStatus
    codes = [200, 201, 204, 301, 304, 400, 401, 403, 404, 405, 409, 410, 418, 422, 429, 500, 502, 503, 504]
    for c in codes:
        right = http.HTTPStatus(c).phrase
        pool = [http.HTTPStatus(x).phrase for x in codes if x != c]
        near = {401: ["Forbidden"], 403: ["Unauthorized"], 404: ["Gone"], 429: ["Too Many Requests"], 502: ["Bad Gateway"], 503: ["Service Unavailable"]}.get(c, [])
        r.shuffle(pool)
        b.add(TOPIC, "http_status", "beginner" if c in (200, 404, 500, 401, 429) else "intermediate", f"What does the HTTP status code {c} mean?", right, [p for p in pool if p != right][:3], f"{c} is \"{right}\" in the standard status list ({'success' if c < 300 else 'redirection' if c < 400 else 'client error' if c < 500 else 'server error'}).")
    for c in [200, 204, 301, 404, 429, 500, 503, 201, 401, 502]:
        klass = {2: "Success", 3: "Redirection", 4: "Client error", 5: "Server error"}[c // 100]
        b.add(TOPIC, "http_status", "beginner", f"Which kind of response is HTTP {c}?", klass, [k for k in ["Success", "Redirection", "Client error", "Server error"] if k != klass], f"Codes {c // 100}00 to {c // 100}99 are \"{klass}\".")
    # --- percent-encoding and query strings
    for w in WORDS:
        enc = quote(w, safe="")
        b.add(TOPIC, "urls", "intermediate", f"Percent-encode the text \"{w}\" for use in a URL query value (spaces as %20, nothing left unencoded except letters, digits and - . _ ~).", enc,
              [w.replace(" ", "+"), w.replace(" ", "%20"), quote(w, safe="/&="), quote(w.upper(), safe="")], f"quote(\"{w}\", safe=\"\") = {enc}. Characters like & = / % + and spaces have meanings in a URL, so they are encoded.")
    for base, params in [("https://openlibrary.org/search.json", {"q": "the hobbit", "limit": 1}), ("https://opentdb.com/api.php", {"amount": 5, "category": 9, "difficulty": "easy"}), ("https://api.artic.edu/api/v1/artworks", {"limit": 2, "page": 3}),
                         ("https://date.nager.at/api/v3/PublicHolidays/2026/US", {}), ("https://v2.jokeapi.dev/joke/Programming", {"safe-mode": "", "type": "single"})]:
        if not params: continue
        qs = urlencode(params)
        full = f"{base}?{qs}"
        alt = [f"{base}&{qs}", f"{base}?{qs.replace('&', ',')}", f"{base}/{qs.replace('=', '/').replace('&', '/')}", f"{base}?{qs.replace('&', '?')}"]
        b.add(TOPIC, "urls", "intermediate", f"Which URL calls {base} with these query parameters, in this order: " + ", ".join(f"{k}={v!r}" for k, v in params.items()) + "?", full, alt, f"The first parameter follows ?, the others are joined with &: {full}.")
    # --- paging arithmetic
    seen = 0
    while seen < 14:
        total, size = r.choice([234, 1000, 1234, 87, 5000, 460, 99]), r.choice([10, 20, 25, 50, 100])
        if seen % 2 == 0:
            ans = math.ceil(total / size)
            ok = b.add(TOPIC, "paging", "beginner", f"An API returns {size} items per page and holds {total:,} items. How many requests fetch them all?", ans, [total // size, ans + 1, ans - 1, total], f"⌈{total:,} / {size}⌉ = {ans}: the last page may be partly full.")
        else:
            page = r.randint(2, 9); off = (page - 1) * size
            ok = b.add(TOPIC, "paging", "beginner", f"An API pages with offset and limit. With limit={size}, which offset gives page {page} (counting pages from 1)?", off, [page * size, off + 1, off - size, page + size], f"The first page starts at offset 0, so page {page} starts at ({page} − 1) × {size} = {off}.")
        if ok: seen += 1
    # --- retries with exponential backoff
    for base, k in [(1, 4), (2, 3), (1, 6), (0.5, 5), (1, 5), (2, 4), (0.25, 6), (3, 3)]:
        wait = base * 2 ** (k - 1)
        total = base * (2 ** k - 1)
        b.add(TOPIC, "retries", "advanced" if k >= 5 else "intermediate", f"A client retries a failed call, waiting {num(base)} s before the first retry and doubling the wait each time. How long does it wait before retry number {k}?", f"{num(wait)} s", [f"{num(base * k)} s", f"{num(base * 2 ** k)} s", f"{num(total)} s", f"{num(wait / 2)} s"], f"{num(base)} × 2^({k} − 1) = {num(wait)} s. The total waited over all {k} retries is {num(total)} s.")
    # --- reading JSON replies
    docs = [({"count": 2, "results": [{"name": "Ada", "age": 36}, {"name": "Grace", "age": 85}]}, [("data['results'][1]['name']", "Grace"), ("data['results'][0]['age']", "36"), ("data['count']", "2"), ("len(data['results'])", "2")]),
            ({"status": "ok", "data": {"items": [{"id": 7, "tags": ["a", "b"]}, {"id": 9, "tags": []}]}}, [("data['data']['items'][0]['tags'][1]", "b"), ("data['data']['items'][1]['id']", "9"), ("len(data['data']['items'][1]['tags'])", "0"), ("data['status']", "ok")]),
            ({"fact": "Cats sleep a lot.", "length": 17}, [("data['fact']", "Cats sleep a lot."), ("data['length']", "17")]),
            ({"main": {"temp": 21.5, "humidity": 60}, "weather": [{"main": "Rain"}]}, [("data['main']['temp']", "21.5"), ("data['weather'][0]['main']", "Rain"), ("data['main']['humidity']", "60")]),
            ({"docs": [{"title": "Dune", "year": 1965}, {"title": "Emma", "year": 1815}, {"title": "Ulysses", "year": 1922}]}, [("data['docs'][2]['title']", "Ulysses"), ("data['docs'][1]['year']", "1815"), ("len(data['docs'])", "3")])]
    for obj, exprs in docs:
        text = json.dumps(obj)
        data = json.loads(text)
        for expr, expected in exprs:
            got = eval(expr, {"data": data, "len": len})
            assert str(got) == expected, (expr, got, expected)
            wrongs = {str(v) for v in re.findall(r'"([^"]+)"|(\d+\.?\d*)', text) for v in v if v} - {str(got)}
            wrongs = sorted(wrongs); r.shuffle(wrongs)
            b.add(TOPIC, "json", "intermediate", f"An API replies with this JSON:\n\n{text}\n\nWhat does {expr} give (Python style, indexes start at 0)?", str(got), wrongs[:6], f"Follow the path: {expr} = {got}.")
    # --- concepts (written by hand)
    for diff, q, c, w, e in CONCEPTS:
        b.add(TOPIC, "concepts", diff, q, c, w, e)
    return finish(b, [TOPIC], {"title": "API Quiz: authentication, free tiers and calling APIs", "version": "1.0.0", "description": "Questions computed from the repository's API documents and from standard-library code (HTTP statuses, URL encoding, JSON, paging and rate-limit arithmetic).",
                               "difficulty_levels": ["beginner", "intermediate", "advanced"], "question_types": ["multiple_choice"]})


CONCEPTS = [
    ("beginner", "Why is a no-auth API the easiest to start with?", "You can call it straight away, with no registration, key or approval", ["It has no rate limit", "It always returns more data", "It is always faster"], "No auth means no sign-up, not no limits: most open APIs still rate-limit by address."),
    ("intermediate", "What does OAuth 2.0 let a user do?", "Allow an app to act for them, with limited permissions, without giving the app their password", ["Skip the rate limit", "Use an API without any key", "Encrypt the reply"], "The user approves the app on the provider's page, and the app receives a token."),
    ("beginner", "Why must an API key never be put in code that runs in a visitor's browser?", "Anyone can read it there and use it, and you may be billed or blocked", ["Browsers cannot send keys", "Keys expire when the page loads", "Keys only work on servers in the same country"], "Browser code is public. Keep keys on a server you control, or use an API that needs none."),
    ("intermediate", "A call returns HTTP 429. What is the usual correct response?", "Wait (the Retry-After header often says how long) and try again more slowly", ["Retry immediately in a loop", "Switch to a different key every call", "Treat it as success"], "429 means too many requests. Back off, with a longer wait each time."),
    ("intermediate", "A browser page calls an API and the console says the request was blocked by CORS. What does that mean?", "The API did not send a header allowing pages from your site to read its reply", ["The API is down", "Your key is wrong", "The reply was too large"], "CORS is enforced by the browser. A server-side call is not affected, and the browser cannot tell you more than 'blocked'."),
    ("beginner", "Which HTTP method is meant for reading data without changing anything?", "GET", ["POST", "DELETE", "PUT"], "GET is safe and repeatable: calling it twice has the same effect as once."),
    ("intermediate", "Which HTTP methods are idempotent, meaning repeating the call has the same effect as making it once?", "GET, PUT and DELETE", ["POST only", "GET and POST", "None of them"], "POST usually creates something new each time, so repeating it is not harmless."),
    ("intermediate", "What does 'Free tier' mean in an API's pricing?", "A limited amount of use at no charge; going over it is blocked or billed", ["The API is open source", "No key is needed", "The provider cannot change it"], "Limits and terms can change, and some free tiers ask you to credit the data's source."),
    ("advanced", "Why is the API key sent in a header rather than in the URL, where possible?", "URLs are logged by servers, proxies and browsers, which could leak the key", ["Headers are faster", "URLs cannot carry keys", "Headers are always encrypted by the browser"], "Keys in query strings end up in logs and history."),
    ("beginner", "What does JSON look like?", "Text made of objects {\"key\": value}, lists [..], strings, numbers, true, false and null", ["Rows and columns separated by commas", "Tags like <name>text</name>", "Plain sentences"], "Most web APIs reply in JSON because every language can parse it."),
    ("intermediate", "Why do museum and data APIs often ask you to credit them?", "Their terms of use require attribution when you show their data", ["It makes the call faster", "It is how rate limits are counted", "It is required by HTTP"], "Always read the terms before using a free API in a product."),
    ("intermediate", "An API reply is cached for 15 minutes. What is the benefit for a free API with a rate limit?", "Repeated visitors cause no new calls during that time, so you stay under the limit", ["The data is always fresher", "The key is hidden", "The reply is smaller"], "Caching trades freshness for fewer calls."),
    ("beginner", "What is a Hugging Face Space?", "A small app hosted on Hugging Face, often built with Gradio, that runs a model or a tool", ["A paid cloud server you rent by the hour", "A dataset file format", "A private chat room for model authors"], "A public Gradio Space can also be called from code as an API."),
    ("intermediate", "Where can you find the exact code for calling a particular Gradio Space?", "On the Space's own 'Use via API' page, which shows the calls for that Space and its Gradio version", ["In the Hugging Face terms of service", "In the page's cookies", "Nowhere: you have to guess the endpoint names"], "Endpoint names and inputs differ from Space to Space, and `view_api()` in the client lists them too."),
    ("intermediate", "A shared-GPU (ZeroGPU) Space gives anonymous callers only a small amount of GPU time. How do you get more?", "Call it as a signed-in account with a token (a free account gets more, a paid plan gets more again), keeping the token on a server", ["Call it from many browser tabs", "Put your token in the web page's code so it is sent automatically", "Add ?quota=unlimited to the address"], "The quota follows who makes the request. A token in browser code would be public to every visitor."),
    ("advanced", "You call a public Hugging Face Space from your own code. Who pays for the computer that runs it?", "The Space's owner, within the limits of the quota given to callers", ["Always you, per call", "Always Hugging Face's customers at random", "Nobody: Spaces run for free without limits"], "Calling a public Space does not bill the caller, but quotas and queues apply, and with a token the usage counts against that account."),
    ("advanced", "Why might a 'No auth' entry in a document be out of date?", "Providers change their rules, for example by starting to require a key, so check the provider's own page", ["No auth entries never change", "Documents update themselves", "Auth rules are fixed by HTTP"], "This repository's documents are a snapshot; the API Explorer page is a way to test which still work."),
]


if __name__ == "__main__":
    data = build()
    out = HERE / "api-question-bank.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(data['questions'])} questions to {out.name}")
    for t, n in data["metadata"]["topics"].items():
        print(f"  {t}: {n}")
