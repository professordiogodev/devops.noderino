#!/usr/bin/env bash
BASE=${1:-main}
echo "== BRANCH =="; git branch --show-current
echo "== COMMITS =="; git log "$BASE"..HEAD --oneline
echo "== FILES =="; git diff "$BASE"...HEAD --stat
echo "== WARNINGS =="
git diff "$BASE"...HEAD --name-only | while read f; do
  case "$f" in
    *.env*)          echo "⚠️ $f looks like a secrets file" ;;
    package.json)    echo "⚠️ dependencies changed" ;;
    *.test.*|test/*) echo "ℹ️ tests touched: $f" ;;
  esac
done
echo "(end)"