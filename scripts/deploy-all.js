/* eslint-disable import/no-extraneous-dependencies */

const hre = require('hardhat');
const fs = require('fs');
const { deployAsOwner } = require('./utils/deployer');
const { start } = require('./utils/starter');

const { changeConstantInFiles } = require('./utils/utils');

const { redeploy, OWNER_ACC } = require('../test/utils');

// const { addBotCaller } = require('../test/utils-strategies');

async function main() {

    // const signer = await hre.ethers.provider.getSigner(OWNER_ACC);

    const [signer] = await hre.ethers.getSigners();
    
    // Deploy Auth Contracts
    const adminVault = await deployAsOwner('AdminVault', signer);

    await changeConstantInFiles(
        './contracts',
        ['MainnetAuthAddresses'],
        'ADMIN_VAULT_ADDR',
        adminVault.address,
    );
    await run('compile');

    const adminAuth = await deployAsOwner('AdminAuth', signer);

    const proxyPermission = await deployAsOwner('ProxyPermission', signer);

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

    const strategyStorage = await deployAsOwner('StrategyStorage', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'STRATEGY_STORAGE_ADDR',
        strategyStorage.address,
    );
    await run('compile');

    const bundleStorage = await deployAsOwner('BundleStorage', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'BUNDLE_STORAGE_ADDR',
        bundleStorage.address,
    );
    await run('compile');

    const subStorage = await deployAsOwner('SubStorage', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'SUB_STORAGE_ADDR',
        subStorage.address,
    );
    await run('compile');

    const proxyAuth = await deployAsOwner('ProxyAuth', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'PROXY_AUTH_ADDR',
        proxyAuth.address,
    );
    await run('compile');
    
    const recipeExecutor = await deployAsOwner('RecipeExecutor', signer);
    await changeConstantInFiles(
        './contracts',
        ['MainnetCoreAddresses'],
        'RECIPE_EXECUTOR_ADDR',
        recipeExecutor.address,
    );
    await run('compile');
    
    const strategyExecutor = await deployAsOwner('StrategyExecutor', signer);

    const strategyProxy = await deployAsOwner('StrategyProxy', signer);
    const subProxy = await deployAsOwner('SubProxy', signer);
    const botAuth = await deployAsOwner('BotAuth', signer);

    // Deploy Action contracts and add them into DFSRegistry contract
    redeploy('CompBorrow', reg.address);
    redeploy('CompClaim', reg.address);
    redeploy('CompCollateralSwitch', reg.address);
    redeploy('CompGetDebt', reg.address);
    redeploy('CompPayback', reg.address);
    redeploy('CompSupply', reg.address);
    redeploy('CompWithdraw', reg.address);
    
    redeploy('FLAaveV2', reg.address);
    
    redeploy('UniSupply', reg.address);
    redeploy('UniWithdraw', reg.address);
    
    redeploy('ApproveToken', reg.address);
    redeploy('PullToken', reg.address);
    redeploy('SendToken', reg.address);
    redeploy('SendTokenAndUnwrap', reg.address);
    redeploy('SendTokens', reg.address);
    redeploy('SubInputs', reg.address);
    redeploy('SumInputs', reg.address);
    redeploy('TokenBalance', reg.address);
    redeploy('UnwrapEth', reg.address);
    redeploy('WrapEth', reg.address);

    process.exit(0);
}

start(main);
