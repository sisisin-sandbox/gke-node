#!/usr/bin/env bash

set -eu -o pipefail

readonly script_dir=$(cd "$(dirname "$0")" && pwd)
cd "$script_dir/.."

TIMESTAMP=$(TZ=JST-9 date "+%Y%m%d-%H%M%S")
IMAGE_ID=sisisin/gke-node:$TIMESTAMP

docker login
docker buildx build --platform linux/amd64,linux/arm64 --push -t $IMAGE_ID .

echo $IMAGE_ID
