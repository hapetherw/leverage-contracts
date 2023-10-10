import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
// import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";

import * as dotenv from "dotenv";
dotenv.config();

const chainIds = {
  // ethereum
  mainnet: 1,
  goerli: 5,
  sepolia: 11155111,
  // avalanche
  avalanche: 43114,
  fuji: 43113,
  // eclipse
  eclipseTestnet: 17172,
  // polygon
  polygon: 137,
  mumbai: 80001,
};

const PRIVATE_KEY = process.env.PK || "";

const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || "";

const GOERLI_ETH_RPC_URL = process.env.GOERLI_ETH_RPC_URL;
const MAIN_ETH_RPC_URL = process.env.MAIN_ETH_RPC_URL;

const config = {
  defaultNetwork: "hardhat",
  lightTesting: true,
  networks: {
    local: {
      url: 'http://127.0.0.1:8545',
      timeout: 1000000,
      gasPrice: 170000000000,
      name: 'mainnet',
    },
    hardhat: {
      forking: {
          url: process.env.MAIN_ETH_RPC_URL,
          timeout: 1000000,
          gasPrice: 50000000000,
          // blockNumber: 12068716
      },
      chainId: 1,
      name: 'mainnet',
    },
    mainnet: {
      url: MAIN_ETH_RPC_URL,
      chainId: chainIds.mainnet,
      accounts: [PRIVATE_KEY],
      gasMultiplier: 1.25,
      name: 'mainnet',
    },
    goerli: {
      url: GOERLI_ETH_RPC_URL,
      chainId: chainIds.goerli,
      accounts: [PRIVATE_KEY],
      // gasMultiplier: 1.25,
      name: 'goerli',
    }
  },
  etherscan: {
    apiKey: { 
      // ethereum
      mainnet: ETHERSCAN_KEY,
      goerli: ETHERSCAN_KEY,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 100000,
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD",
  // },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true
  }
};

export default config;
