#!/bin/bash

if [ $# -ne 1 ] || [ ! -d "$1" ]; then
    echo 'Usage compile_contract.sh [contract dir]'
    exit 1
fi

cd "$1"
truffle compile
echo "Compilation ok"
truffle migrate --reset
echo "Migration ok"
cd -
