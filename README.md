##General requirements
*THIS PROJECT is a POC and must not be use in production mode*

   -	Node.js server v8 or higher (build with v9.8.0 ) [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
   -	Metamask (ethereum client) [https://metamask.io/](https://metamask.io/)

##Setup

###Local

    ./setup.sh or npm run setup

This script will do several things:

   - If truffle and ganache-cli aren't already installed on your computer,
  it will propose to you (mandatory to locally run the app).
 [What is truffle?](https://nethereum.readthedocs.io/en/latest/ethereum-and-clients/ganache-cli/) / [What is ganache-cli?]
 (https://nethereum.readthedocs.io/en/latest/ethereum-and-clients/ganache-cli/)
   - It will run a ganache-cli local test blockchain.
   - Install, compile and migrate embedded versions of smart contracts.
   - Save and reset ropsten ABIs already in src/BTU and src/RES folder.
   - Install dApp dependencies (npm install)
   - The process will wait for the ganache-cli blockchain to stop then reset
      ropsten ABIs.

###Ropsten

    npm install

###Run dApp

    npm run start

   *****dApp will run on [http://localhost:3000](http://localhost:3000)*****
   *****See dApp tutorial to setup an ethereum client*****

## Content


***A booker panel allow to consult and reserve resources***

![booker panel](https://preview.ibb.co/nxLFzn/demo_book.png "Booker panel")

***A provider panel allow to add a resource to the BTU ecosystem***

![provider panel](https://preview.ibb.co/dBGKs7/demo_screen.png "Provider panel")
