# Edges, depth and segmentation: three different questions

Edge detection, monocular depth estimation (Depth Anything) and promptable segmentation (SAM 3) all take one image and return one value per pixel, but they answer different questions. This note records how they differ and which of them can run inside a web page.

| | Edge detection (Sobel, Canny) | Depth Anything (Small) | SAM 3 |
|---|---|---|---|
| Question | Where does brightness change quickly? | How far away is each pixel, compared with the others? | Which pixels belong to this concept? |
| Output | A map of edge pixels | A depth map: one distance-like value per pixel | A mask per matching object, each with an identity (kept across video frames) |
| Knows about objects or 3D? | No: only a 3×3 neighbourhood | Learns 3D structure from one picture, from patterns in its training data | Learns what objects look like, from a noun phrase or example image |
| Learned parameters | None (a few kernel numbers) | 24.8 million (V2 Small) | Far more; the exact count was not confirmed for this note |
| Needs training data | No | Yes | Yes |
| Typical failure | Shadows and texture become edges; outlines have gaps | Depth is relative, not metres, unless a metric version is used; glass and mirrors confuse it | Misses or mislabels a concept; needs a large model |
| Licence | Not applicable | V2 Small: Apache-2.0 (the larger V2 sizes are CC-BY-NC-4.0) | Meta's own licence; access to the official checkpoint requires an approved request |

"Depth" here means depth *estimation*: a model that guesses distance from a single photograph. It is a separate idea from the *depth* of a model (its number of layers), and from the depth channel of a depth camera.

## Depth Anything Small versus SAM 3

- **Size.** Depth Anything V2 Small has [24.8M parameters](https://github.com/DepthAnything/Depth-Anything-V2) and an Apache-2.0 licence. The newer Depth Anything 3 Small is listed at about [0.08 billion](https://huggingface.co/depth-anything/da3-small) (also Apache-2.0). SAM 3 is a much larger system: a detector and a tracker sharing one vision encoder ([paper](https://arxiv.org/pdf/2511.16719), [Meta](https://ai.meta.com/research/sam3/)).
- **What you give it.** Depth Anything needs only the image. SAM 3 needs a prompt (a noun phrase such as "yellow school bus", an example image, or clicks).
- **What you get back.** Depth Anything gives a smooth field with no object boundaries. SAM 3 gives sharp masks with no distances. They complement each other: a mask picks the object, a depth map says how far it is.
- **Relative versus metric.** The default Depth Anything V2 output is relative depth (nearer or farther), not metres.

## Can they work in a page?

| Tool | In a page? | Advice |
|---|---|---|
| Edge detection | Yes, and it already does | See [`edge-detection/index.html`](./edge-detection/index.html): plain JavaScript, no download. |
| Depth Anything V2 Small | Realistic | [Transformers.js](https://huggingface.co/docs/transformers.js/guides/webgpu) can run models in the browser (WebGPU where available, otherwise slower WebAssembly), and the official Depth Anything repository links to a Transformers.js demo. Expect a model download of tens of megabytes on first use. The Apache-2.0 licence allows shipping it. A good fit for a 3D page: turn the depth map into a displaced mesh or point cloud in three.js. |
| SAM 3 | Not as a bundled demo | Transformers.js release notes list SAM 3 support, but the model is far larger than the depth model and the official checkpoint is gated behind Meta's licence, so a static site should not host the weights. Use a hosted service for it, or link to Meta's own demos, and teach the idea with a small classical stand-in (click a pixel, flood-fill similar colour, stop at edges) that runs anywhere. |

## What was not verified

- `huggingface.co` could not be reached from the session that wrote this note, so the exact download size of the Depth Anything V2 Small web build, SAM 3's parameter count and its licence text were not checked against the model cards. Check those before relying on them.
- Nothing here was run in a browser: the in-browser claims come from the Transformers.js documentation and release notes, not from a test.
