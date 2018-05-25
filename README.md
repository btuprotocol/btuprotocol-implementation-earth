# summary

#### 1- [General requirements](#gr)
#### 2 - [Install](#is)
#### 3 - [Setup](#st)
* ##### [Local](#lo)
* ##### [Ethereum test network](#ro)
#### 3 - [Run dApp](#rd)
#### 4 - [Content](#co)

## <a name="gr"></a>General requirements

   -	Node.js server v8 or higher (build with v9.8.0) [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
   -	Metamask (ethereum client) [https://metamask.io/](https://metamask.io/)

## <a name="is"></a>Install

    git clone --recurse-submodules https://github.com/btuprotocol/btuprotocol-implementation-earth.git

## <a name="st"></a>Setup
#### On windows:
*****You need node-gyp and npm windows-build-tools to install the dApp:*****
*****From node-gyp github:***** [install node-gyp](https://github.com/nodejs/node-gyp)

    npm install -g node-gyp
    npm install --global --production windows-build-tools

#### Then

    cd btu-protocol-implementation-earth/

### <a name="lo"></a>Local

    ./setup.sh or npm run setup

This script will do several things:

   - If truffle and ganache-cli aren't already installed on your computer,
  it will offer you to install both of them. They are mandatory.
 [What is truffle?](https://nethereum.readthedocs.io/en/latest/ethereum-and-clients/ganache-cli/) / [What is ganache-cli?](https://nethereum.readthedocs.io/en/latest/ethereum-and-clients/ganache-cli/)
   - Run a ganache-cli local test blockchain.
   - Install, compile and migrate embedded versions of smart contracts.
   - Save and reset ropsten ABIs already in src/BTU and src/RES folder.
   - Install dApp dependencies throught npm.

### <a name="ro"></a>Ethereum test network

    npm install

### <a name="rd"></a>Run dApp

    npm run start

   *****dApp will run on [http://localhost:3000](http://localhost:3000)*****
   *****You will need an ethereum client (Metamask for example) to run the dApp*****
   *****See dApp tutorial to setup an ethereum client*****

## <a name="co"></a>Content

***There is two panels on the dApp:***

***A booker panel allow to consult and reserve resources***

![booker_panel](https://image.ibb.co/dSRnpH/booker_panel.png "Screenshot of the booker panel")

***A provider panel allow to add a resource to the BTU ecosystem***

![provider_panel](https://image.ibb.co/deWnpH/provider_panel.png "Screenshot of the provider panel")
