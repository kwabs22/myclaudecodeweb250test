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

## Which session made which file

`provenance.json` records, for each file, the original Claude Code session that produced it. The map's **By session** mode and
the "From:" line on each file's card read it. `make_provenance.py` builds it from git history (same contents, then same path,
then same file name; the earliest session wins) using `provenance-sessions.json`, the session titles and dates. It needs the old
`claude/*` branches, so run it once while they exist and commit the result. Files not in the data count as the latest session.

## Page types and dates

`page-types.json` gives each runnable page a type (Quiz, Games, Playground, Visualisation, Tool, AR viewer, Web app, Test page)
and a one-line description. Demos built at deploy time set `type` and `dates_from` in `demos.json`. A page that is not listed gets a
type guessed from its title. Dates come from git: **Started** is the original session's date (commit dates only show when the files
were merged), or the first commit for files made after the merge; **Updated** is the last commit that modified the file. The deploy
checks out the full history (`fetch-depth: 0`) so these can be worked out; on a shallow clone Updated falls back to Started.

## Publishing

`.github/workflows/pages.yml` builds and deploys on every push to `main`.
One-time setup: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Back bar and overview map

- `atlas_bar.py` adds a slim "Session Atlas" bar to every runnable page (Next.js pages get it from a script after load so hydration is not disturbed), and unlocks scrolling on the Expo export.
- The home map opens in **Overview**: About this repo at the centre, areas around it, each edge labelled with its file count. Clicking an area or folder (or a filter chip) opens its structure. **All files** and **By session** are the other two views.
