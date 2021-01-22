#!/bin/sh
git init .
git fetch /source $REV
git checkout -f FETCH_HEAD
rm -rf .git
npm install
npm run build
