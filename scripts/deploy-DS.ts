import { deployContract, sleep, verifyContract } from "./utils"

import * as dotenv from "dotenv";
dotenv.config();

async function main() {

    // const dsProxyFactoryContract = await deployContract("DSProxyFactory");
    // const dsGuardFactoryContract = await deployContract("DSGuardFactory");
    // sleep(3000);
    // await verifyContract("DSProxyFactory");
    // await verifyContract("DSGuardFactory");
    const strategyExecutorContract = await deployContract("StrategyExecutor");
    // const dsGuardFactoryContract = await deployContract("DSGuardFactory");
    sleep(3000);
    // await verifyContract("DSProxyFactory");
    await verifyContract("StrategyExecutor");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});