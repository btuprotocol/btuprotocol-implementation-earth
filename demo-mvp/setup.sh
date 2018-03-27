#!/bin/bash

# clean setup at end of process
clean () {
    rm -r ../BTUToken/build
    rm -r ../RES/build
    rm src/BTU/BTU.json
    rm src/RES/RES.json
    if [ -n "$bc" ] && ps -p $bc > /dev/null; then
        kill -s 9 $bc
    fi
    if [ -n "$dApp" ] && ps -p $dApp > /dev/null; then
        kill -s 9 $dApp
    fi 
}
trap clean EXIT

# Check if truffle is installed
# if not, propose it
type truffle >/dev/null 2>&1 || { 
    echo >&2 "Truffle is required but not found.";
    read -n1 -p "Are you agree to install this package? [y,n]" agreement 
    case $agreement in
        y|Y) npm install -g truffle ;;
        n|N) "Ok."; exit 1 ;;
        *) "Ok."; exit 1 ;;
    esac
}
# compile and deploy BTU contract on local context
cd ../BTUToken/;
# install dependencies
npm install;
# compile BTU.sol
truffle compile;
# launch a local blockchain context using truffle 
(truffle develop ) &
bc=$!;
# migrate BTU contract to local context
truffle migrate;
# give to the dApp the good abi
# repeat process with RES contract
cd ../RES/;
npm install;
truffle compile;
truffle migrate;
# setup and install the dApp
cd ../demo-mvp/;
mkdir src/BTU/;
mkdir src/RES/;
cp ../BTUToken/build/contracts/BTU.json src/BTU/;
cp ../RES/build/contracts/RES.json src/RES/;
npm install;
npm run start;
dApp=$!;
wait $bc
