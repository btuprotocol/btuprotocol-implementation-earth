const RES = artifacts.require('./RES.sol')
const btuTokenSaleABI = require('../../BTUToken/build/contracts/BTUTokenSale')
const Web3 = require('web3')
var fs = require('fs')
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'))

module.exports = function (deployer, networks, accounts) {

    console.log("TokenSale address = " + btuTokenSaleABI.networks[deployer.network_id].address)
    let btuTokenSale = new web3.eth.Contract(btuTokenSaleABI.abi, btuTokenSaleABI.networks[deployer.network_id].address)
    btuTokenSale.methods.btuToken().call(function (err, btuAddress) {
        if (err) {
            console.log("Error: " + err)
            return
        }
        console.log("BTU address = " + btuAddress)
        return deployer.deploy(RES, btuAddress).then(() => {
            RESabi = require('../build/contracts/RES.json')
            RESabi.networks[deployer.network_id] = {}
            RESabi.networks[deployer.network_id].address = RES.address
            fs.writeFileSync('../RES/build/contracts/RES.json', JSON.stringify(RESabi, null, 4))
            console.log("Newly migrated ABI: ", RES.address)
        });
    });
};