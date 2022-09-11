#!/usr/bin/env bash

set -eu -o pipefail

readonly script_dir=$(cd "$(dirname "$0")" && pwd)
cd "$script_dir/.."

docker run -p 3000:3000 sisisin/gke-node:latest
