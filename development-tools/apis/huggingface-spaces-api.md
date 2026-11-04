# Hugging Face Spaces as free APIs

A **Space** is a small app hosted on Hugging Face, often built with Gradio, that runs a model or a tool. A public Gradio Space can be called from code as well as used in a browser, which makes it a free API with a model behind it. This guide covers finding popular Spaces, calling one, and what "free" does and does not cover.

The [Free API Explorer](../api-explorer/index.html#spaces) has a live panel that asks the Hub for the Spaces that are trending or most liked right now, checks whether a Gradio Space answers, and shows the code to list its endpoints.

> **What was and was not checked.** `huggingface.co` was not reachable from the session that wrote this guide. The facts below come from Hugging Face's documentation pages, forum posts and third-party write-ups found by web search, and are marked where they come from secondary sources. Nothing here was run against the live Hub. Check the Space's own "Use via API" page before relying on a call.

## 1. Finding popular Spaces

| Way | What it gives |
|---|---|
| [`huggingface.co/spaces?sort=trending`](https://huggingface.co/spaces?sort=trending) | The Hub's own trending list (and `?sort=likes` for most liked) |
| `GET https://huggingface.co/api/spaces?sort=trendingScore&direction=-1&limit=12` | The same ranking as JSON, with no key. Secondary sources say `sort` accepts `likes` and `trendingScore` and that `limit` goes up to 100 |
| The explorer's panel | That API call, made from your browser, with a card per Space |

Popular does not mean suitable for everyone: the lists are unfiltered, and trending Spaces change weekly. A search-engine snapshot of the Hub taken around 2 November 2026 showed, among others, a video model (Wan2.2 14B Preview, running on ZeroGPU), a model that runs in the browser on WebGPU (LFM3 Omni 2B), a semantic search for 3D assets (SimReady Central) and a fast image editor (FIBO 2.0 Edit Turbo). Two other trending entries (a face-swap Space and an "uncensored" image generator) are left out here on purpose. Space ids were not verified, so use the live list.

## 2. Calling a Gradio Space

Every Gradio Space is available as an API endpoint, according to the Hub documentation. Each one has a **Use via API** link in its footer that shows the exact calls for that Space.

```python
from gradio_client import Client

client = Client("owner/space-name")
client.view_api()                      # lists the endpoints and what each takes
result = client.predict("hello", api_name="/predict")
```

```js
import { Client } from "@gradio/client";

const app = await Client.connect("owner/space-name");
console.log(await app.view_api());
const result = await app.predict("/predict", ["hello"]);
```

Over plain HTTP the pattern in recent Gradio versions is two steps: `POST https://<owner>-<space-name>.hf.space/gradio_api/call/<api_name>` with a body like `{"data": ["hello"]}` returns an event id, and `GET` on `.../gradio_api/call/<api_name>/<event_id>` streams the result. Older Gradio versions leave out `/gradio_api`. The Space's "Use via API" page shows which applies.

The address of a Space is its owner and name joined by a hyphen, lower-cased, with other characters turned into hyphens, then `.hf.space`. The Hub API often includes it as `subdomain`.

## 3. What "free" covers

| Caller | Cost and limits |
|---|---|
| Anyone, no token | Public Spaces can be opened and called. Spaces on shared GPUs (ZeroGPU) give anonymous callers only a small amount of GPU time. A forum user measured about 180 seconds; this is unofficial and may have changed |
| Free Hugging Face account, with a token | A larger ZeroGPU quota (the same forum user measured about 300 seconds). Pass the token to the client (`hf_token` in Python), and keep it on a server, never in a web page |
| PRO plan | The Hub documentation lists 40 minutes of daily GPU quota with higher queue priority, and a way to buy more with credits |

Calling a public Space does not bill the caller: the Space's owner pays for the hardware. With a token, ZeroGPU use counts against that account's quota. When one Space calls another on ZeroGPU, the documentation says to forward the end user's `x-ip-token` header so the call counts against that user and not a shared anonymous quota.

## 4. Risks to know before you depend on one

- **Privacy.** Whatever you send goes to the Space owner's server. Do not send personal or confidential data.
- **Changes and outages.** Owners can change inputs, rename endpoints, add a login, or remove a Space. A free CPU Space may be asleep when you call it and take time to wake.
- **Quotas and queues.** A popular GPU Space can have a long queue, and a call can fail when the quota runs out.
- **Terms.** Check the Space's licence and the model's licence before using results in a product.
- **Content.** Spaces are user-made. Review a Space before sending its output to your own users.
- **Browser limits.** A page calling a Space or the Hub API needs the server to send cross-origin permission. If the browser reports "blocked", the Explorer cannot say whether that, an outage or a sleeping Space is the cause.

## Related

- [API authentication at a glance](api-authentication-analysis.md) for the 114 other APIs
- [Free API Explorer](../api-explorer/index.html) and the [API quiz](quiz/index.html)
