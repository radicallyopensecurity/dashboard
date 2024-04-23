#!/bin/sh

docker run \
  -it \
  --rm \
  -v "$PWD":/app \
  -w /app \
  node:20.12.2 \
  npm install
