const RES = artifacts.require('./RES.sol');
const btuABI = require('../../BTUToken/build/contracts/BTU');

module.exports = function(deployer) {

    console.log(btuABI.networks["4447"].address);
    const addr = btuABI.networks["4447"].address;
    return deployer.deploy(RES, addr);
};
