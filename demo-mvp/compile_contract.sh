#!/bin/bash

if [ $# -ne 1 ] || [ ! -d "$1" ]; then
    echo 'Usage compile_contract.sh [contract dir]'
    exit 1
fi

cd "$1"
# We could try to dry-run it to save time if already installed
# (or see upgrade but it does not seem to work well with web3)
npm install
truffle compile
truffle migrate --reset
