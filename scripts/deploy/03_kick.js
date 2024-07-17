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
    const contractJson = require("../../artifacts/contracts/Kick.sol/Kick.json")

    const provider = new ethers.JsonRpcProvider("http://localhost:8545")

    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey, provider)
    const r = await deployContract(signer, contractJson)
    console.log(await r.getAddress())
}

deploy()