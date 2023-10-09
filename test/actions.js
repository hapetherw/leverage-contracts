/* eslint-disable max-len */
const dfs = require('@defisaver/sdk');
const hre = require('hardhat');

const { getAssetInfo, ilks } = require('@defisaver/tokens');
const {
    getAddrFromRegistry,
    mineBlock,
    getGasUsed,
} = require('./utils');

const network = hre.network.config.name;

const executeAction = async (actionName, functionData, proxy, regAddr = addrs[network].REGISTRY_ADDR) => {
    const actionAddr = await getAddrFromRegistry(actionName, regAddr);
    let receipt;
    try {
        mineBlock();
        receipt = await proxy['execute(address,bytes)'](actionAddr, functionData, {
            gasLimit: 10000000,
        });
        const gasUsed = await getGasUsed(receipt);
        console.log(`Gas used by ${actionName} action; ${gasUsed}`);
        return receipt;
    } catch (error) {
        console.log(error);
        // const blockNum = await hre.ethers.provider.getBlockNumber();
        // const block = await hre.ethers.provider.getBlockWithTransactions(blockNum);
        // const txHash = block.transactions[0].hash;
        // await execShellCommand(`tenderly export ${txHash}`);
        throw error;
    }
};


module.exports = {
    executeAction,
};
