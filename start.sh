#!/bin/bash
/wait &&
  if [ ! -d "./node_modules" ]; then
    npm install
  fi
  if [ ! -d "./app/node_modules" ]; then
    cd app &&
      npm install
  fi
  if [ ! -d "./app/dist" ]; then
    cd app &&
      npm run buildP
  fi
node index
