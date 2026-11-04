# API quiz

**[Open the quiz](./index.html)**: 168 multiple-choice questions on calling APIs, built from the repository's three API documents and from standard-library code. Filter by topic, with a hint, an explanation and a statistics panel at the end. The right answer is stored first and the page shuffles the options when it loads.

| Topic | Questions | Where the answers come from |
|---|---|---|
| Sign-up per API | 36 | The documents' own auth badges: "According to this repository's API documents, what does X need?" |
| Which one needs… | 16 | The same badges: which of four named APIs needs OAuth, a key, or nothing |
| Counts | 9 | Counted from the documents when the bank is built: how many need no sign-up (35 of 114), how many need OAuth, the share, and how many APIs each document describes |
| Rate limits | 15 | The free-tier table in [`api-authentication-analysis.md`](../api-authentication-analysis.md): calls per hour, days to reach 5,000 calls, minutes to make 120, 500 or 1,000 calls |
| HTTP statuses | 29 | `http.HTTPStatus` (what 404 or 429 means, and whether a code is success, redirection, client error or server error) |
| URLs | 8 | `urllib.parse`: percent-encoding a value and building a query string |
| Paging | 14 | Requests needed to fetch every item, and the offset for a given page |
| Retries | 8 | Exponential backoff: the wait before retry *n* |
| JSON | 16 | `json.loads` on a small reply, then a path such as `data['results'][0]['name']` |
| Concepts | 17 | Written by hand: OAuth, keys in browser code, 429, CORS, idempotent methods, free tiers, caching, Hugging Face Spaces |

## Regenerate and check

```bash
python development-tools/apis/quiz/generate_api_questions.py     # writes api-question-bank.json (the same every time)
python ai-ml/careers/ai-engineer-roadmap/check_question_banks.py  # validates all four question banks
```

It needs only the standard library. The generator reads the documents through the parser in [`../../api-explorer/build_data.py`](../../api-explorer/build_data.py) and borrows `Bank` from the roadmap's `question_tools.py`.

## Limits

- "According to this repository's API documents" is deliberate. Providers change their rules (a no-auth API may start to ask for a key), and the documents are a snapshot. The [Free API Explorer](../../api-explorer/index.html) shows which still answer.
- Counts and per-API answers are recomputed whenever the bank is rebuilt, so rebuild it after editing a document.
