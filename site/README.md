# Session Atlas site generator

`build.py` turns this repository into a static website in `_site/`:

- every `.md` file becomes a page, with repo-relative links re-pointed at the generated pages
- every code or data file gets a highlighted viewer page
- every folder gets an index page
- `.html` files (the quiz apps, chess calculator, anatomy viewer) are copied unchanged
- `index.html` is a 3D map of the folder tree (`assets/hub.js`, three.js vendored in `assets/vendor/`)

```bash
pip install -r site/requirements.txt
python site/build.py
python -m http.server -d _site 8000   # then open http://localhost:8000
```

## Demos that need a build step

`site/demos.json` lists demos that are built at deploy time rather than tracked as files, and `build_demos.sh` builds them
into `_site/` (it needs Node). The Next.js trending-topics widget is the first: `STATIC_EXPORT=1 npm run build` exports it,
and `NEXT_BASE_PATH` sets the folder it is served from. `check_links.py` fails the build if a page links to something missing
(`known-broken-links.txt` lists accepted exceptions).

```bash
python site/build.py && bash site/build_demos.sh && python site/check_links.py
```

## Publishing

`.github/workflows/pages.yml` builds and deploys on every push to `main`.
One-time setup: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
