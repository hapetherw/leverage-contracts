import { verifyContract } from "./utils"

import * as dotenv from "dotenv";
dotenv.config();

async function main() {

    await verifyContract("DSProxyFactory");
    await verifyContract("DSGuardFactory");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});