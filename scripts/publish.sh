#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POSTS_DIR="$ROOT_DIR/posts"
DRAFTS_DIR="$ROOT_DIR/drafts"

if [ $# -ne 1 ]; then
  echo "Usage: $(basename "$0") YYYY-MM-DD"
  exit 1
fi

DATE="$1"
POST_MD="$POSTS_DIR/${DATE}.md"
DRAFT_MD="$DRAFTS_DIR/${DATE}.md"

if [ ! -f "$POST_MD" ]; then
  echo "Missing post: $POST_MD"
  exit 1
fi

if [ ! -f "$DRAFT_MD" ]; then
  echo "Missing draft: $DRAFT_MD"
  exit 1
fi

node "$ROOT_DIR/build.js"

git add "$POST_MD" "$DRAFT_MD" "$ROOT_DIR/index.html" "$POSTS_DIR/${DATE}.html"

git commit -m "Publish ${DATE} post" || true

git push
