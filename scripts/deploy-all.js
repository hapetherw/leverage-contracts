/* eslint-disable import/no-extraneous-dependencies */

const hre = require('hardhat');
const fs = require('fs');
const { deployAsOwner } = require('./utils/deployer');
const { start } = require('./utils/starter');

const { changeConstantInFiles } = require('./utils/utils');

const { redeploy, resetForkToBlock, impersonateAccount, stopImpersonatingAccount, getOwnerAddr, setForkForTesting} = require('../test/utils');
const OWNER_ACC = getOwnerAddr();
async function main() {
    let signer;
    if (hre.network.name === "hardhat" || hre.network.name === "local") {   // mainnet forking
        signer = await hre.ethers.provider.getSigner(OWNER_ACC);
        // await resetForkToBlock();
        await setForkForTesting();
        await impersonateAccount(OWNER_ACC);
    } else { // mainnet or testnet
        signer = await hre.ethers.getSigners()[0];
    }

    // Deploy Auth Contracts
    const adminVault = await deployAsOwner('AdminVault', signer);

    await changeConstantInFiles(
        './contracts',
        ['MainnetAuthAddresses'],
        'ADMIN_VAULT_ADDR',
        adminVault.address,
    );
    await run('compile');

    // Deploy Defisaver Logger contract(utils contract)
    const defiSaverLogger = await deployAsOwner('DefisaverLogger', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'DEFISAVER_LOGGER',
        defiSaverLogger.address,
    );
    await run('compile');

    // Deploy Core Contracts
    const reg = await deployAsOwner('DFSRegistry', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetActionsUtilAddresses', 'MainnetCoreAddresses'],
        'REGISTRY_ADDR',
        reg.address,
    );
    await run('compile');

    await redeploy('AdminAuth', reg.address);
    await redeploy('ProxyPermission', reg.address);

    const strategyStorage = await redeploy('StrategyStorage', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'STRATEGY_STORAGE_ADDR',
        strategyStorage.address,
    );
    await run('compile');

    const bundleStorage = await redeploy('BundleStorage', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'BUNDLE_STORAGE_ADDR',
        bundleStorage.address,
    );
    await run('compile');

    const subStorage = await redeploy('SubStorage', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'SUB_STORAGE_ADDR',
        subStorage.address,
    );
    await run('compile');

    const proxyAuth = await redeploy('ProxyAuth', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'PROXY_AUTH_ADDR',
        proxyAuth.address,
    );
    await run('compile');
    
    const recipeExecutor = await redeploy('RecipeExecutor', reg.address);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'RECIPE_EXECUTOR_ADDR',
        recipeExecutor.address,
    );
    await run('compile');
    
    await redeploy('StrategyExecutor', reg.address);

    await redeploy('StrategyProxy', reg.address);
    await redeploy('SubProxy', reg.address);
    await redeploy('BotAuth', reg.address);

    // Deploy Action contracts and add them into DFSRegistry contract
    await redeploy('CompBorrow', reg.address);
    await redeploy('CompClaim', reg.address);
    await redeploy('CompCollateralSwitch', reg.address);
    await redeploy('CompGetDebt', reg.address);
    await redeploy('CompPayback', reg.address);
    await redeploy('CompSupply', reg.address);
    await redeploy('CompWithdraw', reg.address);
    
    await redeploy('FLAaveV2', reg.address);
    
    await redeploy('UniSupply', reg.address);
    await redeploy('UniWithdraw', reg.address);
    
    await redeploy('ApproveToken', reg.address);
    await redeploy('PullToken', reg.address);
    await redeploy('SendToken', reg.address);
    await redeploy('SendTokenAndUnwrap', reg.address);
    await redeploy('SendTokens', reg.address);
    await redeploy('SubInputs', reg.address);
    await redeploy('SumInputs', reg.address);
    await redeploy('TokenBalance', reg.address);
    await redeploy('UnwrapEth', reg.address);
    await redeploy('WrapEth', reg.address);
    
    if (hre.network.name === "hardhat" || hre.network.name === "local") {   // mainnet forking
        await stopImpersonatingAccount(OWNER_ACC);
    }
    process.exit(0);
}

start(main);
