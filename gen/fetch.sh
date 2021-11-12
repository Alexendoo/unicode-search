#!/bin/bash

set -eux

dir="$(dirname "$0")/ucd-data"

cd "$dir"

curl -OL "https://www.unicode.org/Public/UCD/latest/ucd/UCD.zip"
unzip -o UCD.zip
