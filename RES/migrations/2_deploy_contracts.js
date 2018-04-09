const RES = artifacts.require('./RES.sol');
const btuTokenSaleABI = require('../../BTUToken/build/contracts/BTUTokenSale');
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "impact stay fish oil hover solar excess monster output fence razor celery";
const provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/DYBja4A1RKCdnSP4DMYt");

const Web3 = require('web3');
let web3 = new Web3();
web3.setProvider(provider);

module.exports = function(deployer, networks, accounts) {

    console.log(networks);
    console.log("TokenSale address = " + btuTokenSaleABI.networks["3"].address);
    let btuTokenSale = new web3.eth.Contract(btuTokenSaleABI.abi, btuTokenSaleABI.networks["3"].address);
    btuTokenSale.methods.btuToken().call(function (err, btuAddress) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("BTU address = " + btuAddress);
        return deployer.deploy(RES, btuAddress);
    });
};
