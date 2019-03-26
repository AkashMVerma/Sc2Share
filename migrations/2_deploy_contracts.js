var CryptoContract = artifacts.require("./SmartContractCrypto.sol");
const EthCrypto = require('eth-crypto');
const Web3 = require('web3');
const ownerIdentity = EthCrypto.createIdentity();

module.exports = function(deployer) {
    deployer.deploy(CryptoContract, "0x11EeF84b150196FC27050719CFa1e98fD4026df8", {value: parseInt(web3.utils.toWei('5','ether'))});
};
