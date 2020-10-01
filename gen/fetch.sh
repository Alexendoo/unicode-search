#!/bin/bash

set -eux

dir="$(dirname "$0")/ucd-data"
[[ -e "$dir" ]] && exit

mkdir "$dir"
cd "$dir"

curl -OL "https://www.unicode.org/Public/13.0.0/ucd/UCD.zip"
unzip UCD.zip
