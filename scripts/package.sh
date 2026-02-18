#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

ZIP_NAME="range-picker-demo.zip"

zip -r "$ZIP_NAME" . -x '.git/*' 'node_modules/*' '*.zip'
echo "Created: $ROOT_DIR/$ZIP_NAME"
