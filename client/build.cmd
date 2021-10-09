call npm install
rmdir /Q /S dist
mkdir dist
copy node_modules\\jiff-mpc\\lib\\jiff-client.js dist
call npx tsc app.ts
call npx webpack
del app.js
