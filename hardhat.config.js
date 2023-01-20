require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

module.exports = {
  solidity: "0.8.17",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    signer: {
      default: 1,
    },
    luckyBoy: {
      default: 2,
    },
    luckyGirl: {
      default: 3,
    },
    badBoy: {
      default: 4,
    },
  },
};
