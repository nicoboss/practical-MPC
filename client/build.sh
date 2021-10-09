#!/bin/bash
npm install
rm -rf dist
mkdir dist
cp node_modules/jiff-mpc/lib/jiff-client.js dist
npx tsc app.ts
npx webpack
rm -f app.js
