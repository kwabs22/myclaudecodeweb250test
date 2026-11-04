# Free API Explorer

**[Open the page](./index.html)**: the 114 APIs from the three API documents, filterable by how much sign-up each needs (35 none, 1 key optional, 28 API key, 39 OAuth, and the rest tokens, key plus secret, account login or partner-only). For the free ones that have an endpoint, **Try** calls the API live from your own browser and shows the status, time, size and the start of the reply. **Try all callable APIs** runs them three at a time and counts how many work; **Download results** saves the list as JSON.

## Does it cost anything?

No. Each call goes from the visitor's browser to the API, with no key, no account and no server of ours. Keyed and OAuth APIs are never called, and no secret is stored anywhere. The only limits are each API's own rate limits, and the page makes one call per API.

## What the verdicts mean

| Verdict | Meaning |
|---|---|
| Works | The API answered with a 2xx status |
| Answered, but with an error | It answered, but with 4xx or 5xx (for example a key is now required) |
| Blocked or unreachable | The browser refused or could not connect. A browser reports a missing cross-origin permission, an offline service, a moved address and an `http` address on a secure page in the same way, so it cannot say which |
| Timed out | No answer in 12 seconds |

## Files

- `build_data.py` reads the three documents and writes `apis.js` (name, their docs link, auth type, category). Run it after editing the documents.
- `endpoints.json` holds the URL to try for each API. The documents contain search-term ideas, not URLs, so these were **written by hand from each API's own documentation and have not been run against the live services**; the page exists to find out which still work. Of the 35 no-auth entries, 30 (and Google Books) have one. Five have none because the document links only to a generic directory or to a service that may be gone (Zoo Animals, FishWatch, Bhagavad Gita, Wizard World, PunkAPI).
- CoinGecko and REST Countries appear in two documents, and Public Holidays and Nager.Date are the same service, so "Try all" makes 28 distinct calls for 31 entries.

## Known weak spots

- Several documents link to services that have changed: the Numbers API only serves plain `http`, OpenAQ and xeno-canto now ask for keys in their newer versions, and the Dog Facts link points at a different site from the working service. The notes on those rows say so.
