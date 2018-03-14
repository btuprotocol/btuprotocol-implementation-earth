*THIS PROJECT is a POC and must not be use in production mode*

**General requirements :**
    
    -	Node.js server v8 or higher (build with v9.8.0 ) https://nodejs.org/en/download/ 
    -	Truffle v4.0.6 (npm install -g truffle)
    -	Ganache (personal Ethereum blockchain) http://truffleframework.com/ganache/
        OR
    -	truffle develop (http://truffleframework.com/docs/getting_started/console)
    -	Metamask (ethereum client) https://metamask.io/ 
        OR
    -	truffle console 

**Change your port accordingly to your ethereum blockchain configuration :**

    -	/src/web3/Web3.js : 
            Const localProvider = `http://127.0.0.1 :7545`
    
    -	/src/truffle.js :
      	    networks.development.port = 7545

        (Ganache v1: 7545, v2: 8545, truffle develop: 9545)

**Install dependencies :**

    -	npm install
    -	run you local blockchain context as explain in RES folder
    -	copy builded contracts BTU.json and RES.json and in src/BTU and src/RES

**Run app :**  

    -   npm start

    dApp running on http://localhost:3000
