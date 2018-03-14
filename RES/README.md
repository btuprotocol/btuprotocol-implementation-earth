**General requirements :**

    -	Node.js server v8 or higher (build with v9.8.0) https://nodejs.org/en/download/
    -	Truffle v4.0.6 (npm install -g truffle)

**Install dependencies :**

    -	npm install
    -	deploy BTU locally and get the address (https://github.com/btuprotocol/BTUToken)
    OR 
    -	get the address of a deloyed BTU (testnet or main chain)
    -	in order to link RES contract with BTU token, you need to copy the deployed BTU address
     	in RES/migrations/2_deploy_contracts.js, replace "BTU.address".

**Run the context :**

    -	truffle develop
    -	migrate
    -	copy the deployed BTU.json file from BTUToken into RES/build/contracts 
    -	tests must pass

**Run tests :**

    -	truffle test
    (Note that you must have migrated the contract, copyied the deployed BTU.json and have a 
    valid BTU.sol in contracts folder in order to run the test, see BTUToken repository)

