#!/bin/bash

# Script to analyze all branches
for branch in $(git branch -r | grep 'origin/claude' | sed 's/origin\///'); do
    echo "=== $branch ==="
    echo "Files:"
    git ls-tree -r --name-only "origin/$branch" | head -15
    echo ""
    echo "File count: $(git ls-tree -r --name-only origin/$branch | wc -l)"
    echo ""
    echo "---"
    echo ""
done
