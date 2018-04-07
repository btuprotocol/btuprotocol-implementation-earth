var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "impact stay fish oil hover solar excess monster output fence razor celery";

module.exports = {
  networks: {
    /**
     *  development configuration is defined to work
     *  with truffle develop and ganache-cli
     */
     localhost: {
      host: "localhost",    // localhost for tests
      port: 9545,           // truffle develop port
      network_id: "*",      // Match any network id
      gas: 4712388          // Standard gas limit
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: "3"
    }
    metamask: {
        provider: function() {
            return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/DYBja4A1RKCdnSP4DMYt");
        },
        port: 443,
        network_id: "3",
        gas: 1471238          // Standard gas limit
    }
  }
};
