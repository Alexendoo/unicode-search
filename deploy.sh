#!/usr/bin/env bash

set -eu

npm run gen
npm run wasm
npm run lint
npm run build

rsync -rtv --delete-after dist/ macleod.io:/var/www/macleod.io/unicode/
