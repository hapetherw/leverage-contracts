/* eslint-disable max-len */
const dfs = require('@defisaver/sdk');
const hre = require('hardhat');

const { getAssetInfo, ilks } = require('@defisaver/tokens');
const {
    getAddrFromRegistry,
    mineBlock,
    getGasUsed,
    addrs
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
/*
  ______   ______   .___  ___. .______     ______    __    __  .__   __.  _______
 /      | /  __  \  |   \/   | |   _  \   /  __  \  |  |  |  | |  \ |  | |       \
|  ,----'|  |  |  | |  \  /  | |  |_)  | |  |  |  | |  |  |  | |   \|  | |  .--.  |
|  |     |  |  |  | |  |\/|  | |   ___/  |  |  |  | |  |  |  | |  . `  | |  |  |  |
|  `----.|  `--'  | |  |  |  | |  |      |  `--'  | |  `--'  | |  |\   | |  '--'  |
 \______| \______/  |__|  |__| | _|       \______/   \______/  |__| \__| |_______/
*/
const supplyComp = async (proxy, cTokenAddr, tokenAddr, amount, from) => {
    const compSupplyAction = new dfs.actions.compound.CompoundSupplyAction(
        cTokenAddr,
        amount,
        from,
        true,
    );

    const functionData = compSupplyAction.encodeForDsProxyCall()[1];

    const tx = await executeAction('CompSupply', functionData, proxy);
    return tx;
};
const withdrawComp = async (proxy, cTokenAddr, amount, to) => {
    const compWithdrawAction = new dfs.actions.compound.CompoundWithdrawAction(
        cTokenAddr,
        amount,
        to,
    );
    const functionData = compWithdrawAction.encodeForDsProxyCall()[1];

    const tx = await executeAction('CompWithdraw', functionData, proxy);
    return tx;
};

const borrowComp = async (proxy, cTokenAddr, amount, to) => {
    const compBorrowAction = new dfs.actions.compound.CompoundBorrowAction(cTokenAddr, amount, to);
    const functionData = compBorrowAction.encodeForDsProxyCall()[1];

    const tx = await executeAction('CompBorrow', functionData, proxy);
    return tx;
};

const paybackComp = async (proxy, cTokenAddr, amount, from) => {
    if (cTokenAddr.toLowerCase() === getAssetInfo('cETH').address.toLowerCase()) {
        const wethBalance = await balanceOf(WETH_ADDRESS, from);
        if (wethBalance.lt(amount)) {
            await depositToWeth(amount.toString());
        }
    }

    await approve(cTokenAddr, proxy.address);

    const compPaybackAction = new dfs.actions.compound.CompoundPaybackAction(
        cTokenAddr,
        amount,
        from,
    );
    const functionData = compPaybackAction.encodeForDsProxyCall()[1];
    const tx = await executeAction('CompPayback', functionData, proxy);
    return tx;
};
const claimComp = async (proxy, cSupplyAddresses, cBorrowAddresses, from, to) => {
    const claimCompAction = new dfs.actions.compound.CompoundClaimAction(
        cSupplyAddresses, cBorrowAddresses, from, to,
    );

    const functionData = claimCompAction.encodeForDsProxyCall()[1];
    const tx = await executeAction('CompClaim', functionData, proxy);
    return tx;
};

module.exports = {
    executeAction,

    supplyComp,
    withdrawComp,
    borrowComp,
    paybackComp,
    claimComp,
};
