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
*****You need node-gyp to install the dApp:*****
*****From node-gyp github:***** [install node-gyp](https://github.com/nodejs/node-gyp)

    npm install -g node-gyp
    npm install --global --production windows-build-tools

#### Then

    cd btu-protocol-implementation-earth/

### <a name="lo"></a>Setup demo ropsten

    ./setup.sh or npm run setup

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
