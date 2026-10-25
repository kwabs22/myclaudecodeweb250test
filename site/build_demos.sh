#!/usr/bin/env bash
# Build the demos that need a toolchain and drop them into _site/. Run after build.py.
#   SITE_BASE=/repo-name bash site/build_demos.sh     # on GitHub Pages
#   bash site/build_demos.sh                          # local preview served from the root
set -euo pipefail
cd "$(dirname "$0")/.."
BASE="${SITE_BASE:-}"
[ -d _site ] || { echo "run python site/build.py first" >&2; exit 1; }

build_next() {   # <project dir inside the repo> <output folder name>
  local dir="$1" name="$2" work
  work="$(mktemp -d)"
  cp -r "$dir/." "$work/"
  ( cd "$work" && npm install --no-audit --no-fund --loglevel=error \
      && STATIC_EXPORT=1 NEXT_BASE_PATH="$BASE/$dir/$name" npm run build )
  mkdir -p "_site/$dir/$name"
  cp -r "$work/out/." "_site/$dir/$name/"
  rm -rf "$work"
  echo "built $dir/$name"
}

build_expo() {   # <project dir inside the repo> <output folder name>
  local dir="$1" name="$2" work
  work="$(mktemp -d)"
  cp -r "$dir/." "$work/"
  ( cd "$work" && npm install --no-audit --no-fund --loglevel=error \
      && EXPO_BASE_URL="$BASE/$dir/$name" CI=1 EXPO_NO_TELEMETRY=1 npx expo export --platform web )
  mkdir -p "_site/$dir/$name"
  cp -r "$work/dist/." "_site/$dir/$name/"
  rm -rf "$work"
  echo "built $dir/$name"
}

build_next creative-media/social-media/trending-topics-ui demo
build_expo game-development/react-native/react-native-games-expo/expo-games-demo web

python3 site/atlas_bar.py _site   # now that the built demos exist
