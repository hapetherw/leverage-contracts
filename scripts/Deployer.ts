import hre from "hardhat";

export class Deployer {
  constructor() {
    console.log(`Deployer is initialized`)
  }
  async deploy(
    contractName: string,
    args: any[]
  ): Promise<any> {
    const factory = await hre.ethers.getContractFactory(contractName);
    const [signer] = await hre.ethers.getSigners();
    const Contract = await factory.connect(signer).deploy(...args);
    await Contract.deployed();
    console.log(`Contract ${contractName} is deployed at: ${Contract.address}`);
    return Contract;
  }

  switchNetwork(network: string) {
    if (hre.network.name !== network) {
      hre.changeNetwork(network);
      console.log(`Deployer: switched on ${network}`);
    }
  }
}
