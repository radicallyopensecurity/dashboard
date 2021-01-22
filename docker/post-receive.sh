#!/bin/sh
GIT_BRANCH="$(git rev-parse --symbolic --abbrev-ref $1)"
TARGET_DIR="/var/www/html/$GIT_BRANCH"

echo "ROS Dashboard builder"

mkdir -p "$TARGET_DIR"

docker run --rm \
	-v "$(pwd):/source:ro" \
        -v "$TARGET_DIR:/target:rw" \
        -e REV="$1" \
        dashboard-builder
