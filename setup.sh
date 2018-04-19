#!/bin/bash

# clean setup at end of process
clean () {
    echo "Cleaning local ABIs"
    rm src/BTU/BTU.json
    rm src/BTU/BTUTokenSale.json
    rm src/RES/RES.json
    cp src/BTUsave/BTU.json src/BTU/BTU.json
    mv src/BTUsave/BTUTokenSale.json src/BTU/BTUTokenSale.json
    mv src/RESsave/RES.json src/RES/RES.json
    rm -r src/BTUsave/
    rm -r src/RESsave/
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

# install dependencies globally
echo "Installing global dependencies, could take a while..."
npm install
# then deploy dApp locally
cd demo-mvp
# launch a local blockchain context using customRPC
(ganache-cli -p 9545 -m 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat' >> customRPC.log 2>> customRPC_error.log) & customRPC=$!
# compile and deploy contracts
echo 'Wait for BTU compilation and migration, just few seconds'
./compile_contract.sh ../BTUToken/ & btuCompilation=$!
wait $btuCompilation
btuCompilResult=$?
echo 'Wait for RES compilation and migration, just few seconds'
./compile_contract.sh ../RES/ & resCompilation=$!
wait $resCompilation
resCompilResult=$?
if [ $btuCompilResult -ne 0 ] && [ $resCompilResult -ne 0 ]; then
    echo 'Contract compilation failed check logs for errors !'
    exit 1;
fi

# Save ropsten abi to avoid reset the local repo to switch context
mkdir src/BTUsave
mkdir src/RESsave
mv src/BTU/BTU.json src/BTUsave/BTU.json
mv src/BTU/BTUTokenSale.json src/BTUsave/BTUTokenSale.json
mv src/RES/RES.json src/RESsave/RES.json
echo "Ropsten ABIs saved"
cp -rf ../BTUToken/build/contracts/BTUTokenSale.json src/BTU/
cp -rf ../BTUToken/build/contracts/BTU.json src/BTU/
cp -rf ../RES/build/contracts/RES.json src/RES/
echo "Local ABIs copied in dApp"
echo "You can start the demo connecting your eth client to custom RPC localhost:9545"
wait $customRPC
