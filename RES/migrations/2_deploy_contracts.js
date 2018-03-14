const RES = artifacts.require('./RES.sol');

module.exports = function(deployer) {
    return deployer.deploy(RES, "BTU.address");
};
