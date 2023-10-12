import { deployContract, verifyContract } from "./utils"
import { sleep } from "../utils/utils";

import * as dotenv from "dotenv";
dotenv.config();

async function main() {

    // const dsProxyFactoryContract = await deployContract("DSProxyFactory");
    // const dsGuardFactoryContract = await deployContract("DSGuardFactory");
    // sleep(3000);
    // await verifyContract("DSProxyFactory");
    // await verifyContract("DSGuardFactory");
    const strategyStorageContract = await deployContract("StrategyStorage");
    // const dsGuardFactoryContract = await deployContract("DSGuardFactory");
    sleep(5000);
    // await verifyContract("DSProxyFactory");
    await verifyContract("StrategyStorage");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});