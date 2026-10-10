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

## Publishing

`.github/workflows/pages.yml` builds and deploys on every push to `main`.
One-time setup: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
