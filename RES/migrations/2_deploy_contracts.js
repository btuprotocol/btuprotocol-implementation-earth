const RES = artifacts.require('./RES.sol');
const btuTokenSaleABI = require('../../BTUToken/build/contracts/BTUTokenSale');
const Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));

module.exports = function(deployer, networks, accounts) {

    console.log("TokenSale address = " + btuTokenSaleABI.networks["4447"].address);
    let btuTokenSale = new web3.eth.Contract(btuTokenSaleABI.abi, btuTokenSaleABI.networks["4447"].address);
    btuTokenSale.methods.btuToken().call(function (err, btuAddress) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        console.log("BTU address = " + btuAddress);
        return deployer.deploy(RES, btuAddress);
    });
};
