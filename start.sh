#!/bin/bash
/wait
if [ ! -d "/usr/src/app/node_modules" ]; then
  cd /usr/src/app/ &&
    npm install
fi

if [ ! -d "/usr/src/app/app/node_modules" ]; then
  cd /usr/src/app/app &&
    npm install
fi

if [ ! -d "/usr/src/app/app/dist" ]; then
  cd /usr/src/app/app &&
    npm run buildP
fi

cd /usr/src/app/ &&
  npm start
