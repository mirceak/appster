#!/bin/bash
/wait

cd /usr/src/app/
if [ ! -d "node_modules" ]; then
  mkdir /usr/src/app/node_modules &&
    chmod 777 -R /usr/src/app/node_modules &&
    npm install
fi

cd /usr/src/app/app/
if [ ! -d "node_modules" ]; then
  mkdir /usr/src/app/app/node_modules &&
    chmod 777 -R /usr/src/app/app/node_modules &&
    npm install
fi

cd /usr/src/app/app/
if [ ! -d "dist" ]; then
  npm run buildP
fi

cd /usr/src/app/ &&
  node index
