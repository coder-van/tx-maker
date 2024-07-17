// const hre = require("hardhat");
import hre from "hardhat"
import * as ethers from 'ethers'
import { LuckyERC1155Token } from '../contract.mjs'
import { ADDRS } from '../config.mjs'

async function main() {
  const accounts = await hre.ethers.getSigners();
  const signer = accounts[0]

  // const amount = ethers.parseUnits('100', 18) 
  const lt1155 = new LuckyERC1155Token()
  await lt1155.init(ADDRS.LuckyERC1155Token, signer)

  // function safeBatchTransferFrom(
  //   address from,
  //   address to,
  //   uint256[] calldata ids,
  //   uint256[] calldata values,
  //   bytes calldata data
  // ) external;
  const txr = await lt1155.contract.safeBatchTransferFrom(
    signer, 
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    [666, 666], [1, 1],
    '0x'
  )
  console.log(txr)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});