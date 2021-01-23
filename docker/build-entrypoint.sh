#!/bin/sh
git init .
git fetch /source $REV
git reset --hard FETCH_HEAD
rm -rf .git
npm install
npm run build
