#!/bin/sh

docker run \
  -it \
  --rm \
  -p 3000:3000 \
  -v "$PWD":/app \
  -w /app \
  node:20.12.2 \
  npm run dev
