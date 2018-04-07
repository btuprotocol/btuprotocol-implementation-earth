#!/bin/bash

# clean setup at end of process
clean () {
    if [ -n "$customRPC" ] && ps -p $customRPC > /dev/null; then
        kill -s 9 $customRPC
    fi
}
trap clean EXIT

# Check if truffle is installed
# if not, propose it
type truffle >/dev/null 2>&1 || { 
    echo >&2 "Truffle is required but was not found.";
    read -n1 -p "Do you want install this package? [Y/n]" agreement 
    case $agreement in
        ''|y|Y) npm install -g truffle ;;
        n|N) exit 1 ;;
        *) exit 1 ;;
    esac
}

# Check if ganache-cli is installed
# if not, propose it
type ganache-cli >/dev/null 2>&1 || { 
    echo >&2 "Ganache is required but was not found.";
    read -n1 -p "Do you want install this package? [Y/n]" agreement 
    case $agreement in
        ''|y|Y) npm install -g ganache-cli ;;
        n|N) exit 1 ;;
        *) exit 1 ;;
    esac
}

# launch a local blockchain context using customRPC 
(ganache-cli -p 9545 -m 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat' >> customRPC.log 2>> customRPC_error.log) & customRPC=$!
# compile and deploy contracts
./compile_contract.sh ../BTUToken/ & btuCompilation=$!
wait $btuCompilation
btuCompilResult=$?
./compile_contract.sh ../RES/ & resCompilation=$!
wait $resCompilation
resCompilResult=$?
if [ $btuCompilResult -ne 0 ] && [ $resCompilResult -ne 0 ]; then
    echo 'Contract compilation failed check logs for errors !'
    exit 1;
fi

mkdir src/BTU/
mkdir src/RES/
cp ../BTUToken/build/contracts/BTU.json src/BTU/;
cp ../RES/build/contracts/RES.json src/RES/;

npm install;
echo 'DONE'
wait $customRPC
