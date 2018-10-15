#!/bin/bash

# install dependencies globally
root=$PWD
echo "Working Dir: $root"
echo "Installing global dependencies, could take a while..."
npm install
# then deploy dApp
cd demo-mvp
demomvp=$PWD
echo "demo-mvp path: $demomvp"
echo "Please launch npm run start to start the development build"