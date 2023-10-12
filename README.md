# Leverage contracts
Leverage contracts


## Common commands

`yarn compile` -  will compile all the contracts

`yarn deploy [network] [deploy-script]` - will deploy to the specified network by calling the script from the `/scripts` folder

`yarn test [network] [test-file]` - will run a test to the specified network by calling the script from the `/test` folder

`yarn verify [network] [contract-name]` - will verify contract based on address and arguments from `/deployments` folder


## How to deploy all contracts
`yarn deploy local deploy-all`

## How to run tests

All of the tests are ran from the forked state of the mainnet. In the hardhat config you can change the block number the fork starts from. If it starts from an old state some tests might not work.

Before running tests from the latest fork block it's necessary to update the prices used in integrations tests.

`node scripts/utils/price-tracker.js`

1. Compile all contracts at start:

`npx hardhat compile`

2. You need to start a hardhat node from the forked mainnet with the following command:

`npx hardhat node --max-memory 8192  --fork MAIN_ETH_RPC_URL`
or
`npx hardhat node --max-memory 8192  --network hardhat`

3. After that you can run the tests, for example:
`yarn test local ./auth/full-test.js`
`yarn test local ./core/full-test.js`
`yarn test local ./compound/full-test.js`
`yarn test local ./uniswap/v2/full-test.js`
`yarn test local ./flashloan/full-test.js`