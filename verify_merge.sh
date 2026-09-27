#!/usr/bin/env bash
# Check that every file added on a claude/* branch exists (by content) in the current tree.
# Usage: ./verify_merge.sh [base-branch]   (base files shared by all branches are skipped)
set -euo pipefail
git fetch -q origin '+refs/heads/*:refs/remotes/origin/*'
BASE=${1:-origin/claude/easybpy-3d-gaming-docs-01NYaChUDoQK14BheVPXVPU2}
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
git ls-tree -r HEAD | awk '{print $3}' | sort -u > "$tmp/here"
git ls-tree -r "$BASE" | awk '{print $3}' | sort -u > "$tmp/base"
# Older versions intentionally replaced by newer ones from gradio-planning-interface.
superseded="c46fd9d0ac 3961fe2c04"
missing=0
for b in $(git for-each-ref --format='%(refname:short)' 'refs/remotes/origin/claude/' | grep -v -e plan-repo-merge -e repo-state-overview); do
  while read -r _ _ h p; do
    grep -qx "$h" "$tmp/base" && continue
    for s in $superseded; do [[ $h == $s* ]] && continue 2; done
    grep -qx "$h" "$tmp/here" || { echo "MISSING  ${b#origin/}  $p"; missing=$((missing+1)); }
  done < <(git ls-tree -r "$b")
done
echo "$missing file(s) not found in HEAD"
