'use strict';

const ethers = require("ethers");
const { ContractFactory } = require('ethers');


const deployContract = async (wallet, contractJson, args = [], options = {}) => {
    const factory = new ContractFactory(contractJson.abi, contractJson.bytecode, wallet);

    const contract = await factory.deploy(...args, { ...options });
    // await contract.deployed();
    return contract;
};


async function deploy() {
    const contractJson = require("../../artifacts/contracts/NicePaymaster.sol/NicePaymaster.json")

    const provider = new ethers.JsonRpcProvider("http://localhost:8545")

    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey, provider)
    const r = await deployContract(signer, contractJson)
    console.log(await r.getAddress())
}

deploy()

// 0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4