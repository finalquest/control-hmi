#!/bin/bash
set -euo pipefail

IMAGE_NAME="harbor.finalq.xyz/tools/control-hmi"

TAG=""
PLATFORM="linux/amd64"
MODE="push"
NO_CACHE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --test|--local)
            MODE="load"
            shift
            ;;
        --no-cache)
            NO_CACHE="--no-cache"
            shift
            ;;
        *)
            if [ -z "$TAG" ]; then
                TAG="$1"
            else
                PLATFORM="$1"
            fi
            shift
            ;;
    esac
done

if [ -z "$TAG" ]; then
    TAG="$(date +%Y-%m-%d-%H%M%S)"
fi

if [ "$MODE" = "load" ]; then
    IMAGE_NAME="control-hmi"
fi

echo "🔨 Building ${IMAGE_NAME}:${TAG} (${PLATFORM}, ${MODE})"

TAG_ARGS=(-t "${IMAGE_NAME}:${TAG}")
if [ "$MODE" = "push" ]; then
    TAG_ARGS+=(-t "${IMAGE_NAME}:latest")
fi

docker buildx build \
  --platform "${PLATFORM}" \
  ${NO_CACHE} \
  "${TAG_ARGS[@]}" \
  $( [ "$MODE" = "push" ] && echo "--push" || echo "--load" ) \
  .

if [ "$MODE" = "push" ]; then
    echo "✅ Pushed ${IMAGE_NAME}:${TAG} (y :latest)"
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    DEPLOYMENT="${SCRIPT_DIR}/../argo-k8s-pods/control-hmi/deployment.yaml"
    if [ -f "${DEPLOYMENT}" ]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|image: harbor.finalq.xyz/tools/control-hmi:.*|image: harbor.finalq.xyz/tools/control-hmi:${TAG}|g" "${DEPLOYMENT}"
        else
            sed -i "s|image: harbor.finalq.xyz/tools/control-hmi:.*|image: harbor.finalq.xyz/tools/control-hmi:${TAG}|g" "${DEPLOYMENT}"
        fi
        echo "✅ deployment.yaml actualizado al tag ${TAG}"
    fi
fi
