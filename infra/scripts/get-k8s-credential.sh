#!/usr/bin/env bash

set -eu -o pipefail

readonly script_dir=$(cd "$(dirname "$0")" && pwd)

export KUBECONFIG="$script_dir/../cred/config"
gcloud container clusters get-credentials gke-node-cluster \
    --region=us-central1
