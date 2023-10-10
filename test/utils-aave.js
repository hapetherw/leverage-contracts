const hre = require('hardhat');
const {
    addrs, 
    getNetwork
} = require('./utils');

const aaveV2assetsDefaultMarket = [
    'ETH', 'DAI', 'SUSD', 'USDC', 'USDT', 'WBTC',
    'CRV', 'AAVE',
];

const AAVE_MARKET_DATA_ADDR = addrs[getNetwork()].AAVE_MARKET_DATA_ADDR;

const STABLE_RATE = 1;
const VARIABLE_RATE = 2;

const getAaveDataProvider = async () => {
    const dataProvider = await hre.ethers.getContractAt('IAaveProtocolDataProviderV2', AAVE_MARKET_DATA_ADDR);
    return dataProvider;
};

const getAaveTokenInfo = async (dataProvider, tokenAddr) => {
    const tokens = await dataProvider.getReserveTokensAddresses(tokenAddr);
    return tokens;
};

const getAaveReserveInfo = async (dataProvider, tokenAddr) => {
    const tokens = await dataProvider.getReserveConfigurationData(tokenAddr);
    return tokens;
};

const getAaveReserveData = async (dataProvider, tokenAddr) => {
    const tokens = await dataProvider.getReserveData(tokenAddr);
    return tokens;
};

module.exports = {
    getAaveDataProvider,
    getAaveTokenInfo,
    getAaveReserveInfo,
    getAaveReserveData,
    aaveV2assetsDefaultMarket,
    STABLE_RATE,
    VARIABLE_RATE,
};
