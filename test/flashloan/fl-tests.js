/* eslint-disable no-mixed-operators */
const { getAssetInfo } = require('@defisaver/tokens');
const hre = require('hardhat');
const Dec = require('decimal.js');

const dfs = require('@leveragecom/sdk');

const {
    getAddrFromRegistry,
    getProxy,
    redeploy,
    send,
    approve,
    balanceOf,
    depositToWeth,
    nullAddress,
    UNISWAP_WRAPPER,
    AAVE_FL_FEE,
    WETH_ADDRESS,
    fetchAmountinUSDPrice,
    setBalance,
    Float2BN,
} = require('../utils');

const { executeAction } = require('../actions');

const AAVE_NO_DEBT_MODE = 0;
const aaveFlTest = async (generalisedFLFlag) => {
    describe('FL-AaveV2', function () {
        this.timeout(60000);

        let senderAcc; let proxy; let
            aaveFl;

        const FLASHLOAN_TOKENS = ['WETH', 'DAI', 'USDC', 'WBTC', 'USDT', 'YFI', 'LINK', 'MKR'];
        before(async () => {
            const flAaveAddr = await getAddrFromRegistry('FLAaveV2');
            aaveFl = await hre.ethers.getContractAt('FLAaveV2', flAaveAddr);

            senderAcc = (await hre.ethers.getSigners())[0];
            proxy = await getProxy(senderAcc.address);
        });

        for (let i = 0; i < FLASHLOAN_TOKENS.length; ++i) {
            const tokenSymbol = FLASHLOAN_TOKENS[i];

            it(`... should get an ${tokenSymbol} AaveV2 flash loan`, async () => {
                if (generalisedFLFlag) {
                    const flActionAddr = await getAddrFromRegistry('FLAction');
                    console.log(flActionAddr);
                    aaveFl = await hre.ethers.getContractAt('FLAction', flActionAddr);
                }
                const assetInfo = getAssetInfo(tokenSymbol);

                if (assetInfo.symbol === 'ETH') {
                    assetInfo.address = WETH_ADDRESS;
                }

                // test if balance will brick fl action
                await setBalance(assetInfo.address, aaveFl.address, Float2BN('1', 0));

                const amount = fetchAmountinUSDPrice(tokenSymbol, '5000');
                const loanAmount = hre.ethers.utils.parseUnits(
                    amount,
                    assetInfo.decimals,
                );
                const feeAmount = new Dec(amount)
                    .mul(AAVE_FL_FEE)
                    .mul(10 ** assetInfo.decimals)
                    .div(100)
                    .toFixed(0)
                    .toString();

                console.log(loanAmount.toString(), feeAmount.toString());

                await approve(assetInfo.address, proxy.address);
                let flAction = new dfs.actions.flashloan.AaveV2FlashLoanAction(
                    [assetInfo.address],
                    [loanAmount],
                    [AAVE_NO_DEBT_MODE],
                    nullAddress,
                    nullAddress,
                    [],
                );
                if (generalisedFLFlag) {
                    flAction = new dfs.actions.flashloan.FLAction(
                        flAction,
                    );
                }
                const basicFLRecipe = new dfs.Recipe('BasicFLRecipe', [
                    flAction,
                    new dfs.actions.basic.SendTokenAction(
                        assetInfo.address,
                        aaveFl.address,
                        '$1',
                    ),
                ]);

                const functionData = basicFLRecipe.encodeForDsProxyCall();

                if (tokenSymbol === 'WETH') {
                    await depositToWeth(feeAmount);
                } else {
                    // buy token so we have it for fee
                    const tokenBalance = await balanceOf(assetInfo.address, senderAcc.address);

                    if (tokenBalance.lt(feeAmount)) {
                        await setBalance(
                            assetInfo.address,
                            senderAcc.address,
                            hre.ethers.utils.parseUnits(feeAmount, 1),
                        );
                    }
                }
                await setBalance(assetInfo.address, proxy.address, hre.ethers.utils.parseUnits('0', 18));
                await send(assetInfo.address, proxy.address, feeAmount);
                await executeAction('RecipeExecutor', functionData[1], proxy);
            });
        }
    });
};

const deployFLContracts = async () => {
    await redeploy('SendToken');
    await redeploy('RecipeExecutor');
    await redeploy('FLAaveV2');
};

const fullFLTest = async () => {
    await deployFLContracts();
    await aaveFlTest();
};

module.exports = {
    fullFLTest,
    aaveFlTest,
};
