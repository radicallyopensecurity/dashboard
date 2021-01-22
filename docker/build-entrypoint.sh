#!/bin/sh
git init .
git fetch /source $REV
git checkout FETCH_HEAD
rm -rf .git
npm install
npm run build
