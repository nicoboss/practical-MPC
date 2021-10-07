rmdir /Q /S dist
mkdir dist
copy node_modules\\jiff-mpc\\lib\\jiff-client.js dist
npx tsc app.ts
npx webpack
del app.js
copy jiff-client.js dist
