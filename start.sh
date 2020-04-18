#!/bin/bash
/wait

cd /usr/src/app/
if [ ! -d "node_modules" ]; then
    npm install
fi

cd /usr/src/app/app/
if [ ! -d "node_modules" ]; then
    npm install
fi

chmod 777 -R /usr/src/app/node_modules
chmod 777 -R /usr/src/app/app/node_modules

cd /usr/src/app/app/
if [ ! -d "dist" ]; then
    npm run buildP
fi

cd /usr/src/app/ &&
  node index
