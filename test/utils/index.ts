import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumberish, Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils'

// Defaults to e18 using amount * 10^18
export function getBigNumber(amount:number | string, decimals = 18) {
  return parseUnits(amount.toString(), decimals);
}