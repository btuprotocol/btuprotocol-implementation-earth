const RES = artifacts.require('./RES.sol')
console.log('check');
import BTUabstraction from 'BTUTOKEN/BTU.json'
import BTUTokenSaleabstraction from 'BTUTOKEN/BTUTokenSale.json'
const Web3 = require('web3')
var fs = require('fs')
web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'))

module.exports = function (deployer, networks, accounts) {

    const BTUTokenSale = await getContract(web3, BTUTokenSaleabstraction)
    const BTU = await getContract(web3, BTUabstraction)
    //console.log("TokenSale address = " + btuTokenSaleABI.networks[deployer.network_id].address)
    // let btuTokenSale = new web3.eth.Contract(btuTokenSaleABI.abi, "0x1ab498774cdfb7eb4df1c8c2634ea7d875b5374a" )
    /*btuTokenSale.methods.btuToken().call(function (err, btuAddress) {
        if (err) {
            console.log("Error: " + err)
            return
        }*/
        console.log("BTU address = " + BTU.address)
        return deployer.deploy(RES, BTU.address).then(() => {
            RESabi = require('build/contracts/RES.json')
            RESabi.networks[deployer.network_id] = {}
            RESabi.networks[deployer.network_id].address = RES.address
            fs.writeFileSync('build/contracts/RES.json', JSON.stringify(RESabi, null, 4))
            console.log("Newly migrated ABI: ", RES.address)
        });
};

