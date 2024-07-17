import { ethers } from 'ethers';

import { formatNumber } from '../lib/ethers.js/lib.esm/transaction/transaction.js'
// import { concat, encodeRlp } from '../lib/ethers.js/lib.esm/utils/index.js'
import { estimateRIP7560TransactionGas, sendRIP7560Tx } from "./rpc.mjs"

const rpcUrl = "http://localhost:8545"
const provider = new ethers.JsonRpcProvider(rpcUrl)


// ************************************************************************ //
const GasPrice = 100000000
const GasLimit = 500000
const SmartAccountFactory = "0x18Df82C7E422A42D47345Ed86B0E935E9718eBda"
const PaymasterAddress = "0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4"
const NonceManagerAddress = "0x0000000000000000000000000000000000007712"
const KickAddress = "0x3945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B"
// ************************************************************************ //
// 0x04 || 0x00 || rlp([
//     chainId,
//     nonce,
//     sender,
//     deployer, deployerData,
//     paymaster, paymasterData,
//     callData,
//     builderFee,
//     maxPriorityFeePerGas, maxFeePerGas,
//     validationGasLimit, paymasterValidationGasLimit, paymasterPostOpGasLimit
//     callGasLimit,
//     accessList,
//     signature
// ])


function serializeEip7560(tx, sig) {
    // return encodeRlp(fields)
    return {
        // formatNumber(tx.chainId, "chainId"),
        from: "0x0000000000000000000000000000000000007560",
        subType: "0x1",
        to: "0x0000000000000000000000000000000000000000",
        gasPrice: tx.maxFeePerGas,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        data: tx.callData,
        sender: tx.sender,
        // paymaster: tx.paymaster,
        paymasterData: tx.paymasterData,
        // deployer: tx.deployer,
        deployerData: tx.deployerData,
        builderFee: "0x1",
        gas: "0x" + BigInt(GasLimit).toString(16),
        validationGas: tx.validationGas,
        paymasterGas: tx.paymasterGas,
        postOpGas: tx.postOpGas,
        signature: tx.signature,
        bigNonce: tx.nonce,
    }
}

async function run() {
    const now = Date.now()

    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey, provider)

    const balance = await provider.getBalance(signer.address)
    console.log(`Account[${signer.address}] balance=${balance}`)
    const nonce = await provider.getTransactionCount(signer.address)
    console.log(`Account[${signer.address}] nonce=${nonce}`)

    // const SmartAccountFactory = "0x18Df82C7E422A42D47345Ed86B0E935E9718eBda"
    const simpleAccountFactoryAbi = [
        "function getAddressCopy(address owner, uint256 salt) view returns (address)",
    ]
    const smartAccountFactoryContract = new ethers.Contract(SmartAccountFactory, simpleAccountFactoryAbi, signer);

    const index = 0;
    const sender = await smartAccountFactoryContract.getAddressCopy('0xF0359B80550c6cb1Be3dA8611f2396e3F2a9Cc3C', index);
    const abiCoder = new ethers.AbiCoder()

    // console.log(`${formatNumber(80087, "chainId")}`)
    console.log(`AA sender is[${sender}]`)

    const nonceManagerAbi = [
        "function getNonce(address sender, uint192 key) view returns (address nonce)",
        "function incNonce(address sender, uint192 key)"
    ]
    const contract = new ethers.Contract(NonceManagerAddress, nonceManagerAbi, signer)
    const nonce1 = await contract.getNonce(sender, 1)
    // console.log(BigInt(nonce1).toString(16))

    const feeData = await provider.getFeeData()
    // console.log(feeData)
    const gasPrice = "0x" + BigInt(feeData.gasPrice).toString(16)
    // console.log(feeData, gasPrice)
    // deployerData
    // 0x5fbfb9cf0000000000000000000000007dd7daf47558b655ac9c8d7c3b806f1ceebc26940000000000000000000000000000000000000000000000000000000000000000
    // call kick 2190018d88dC9a7D0c261e57277636f28Fd2294c
    // 0xb61d27f60000000000000000000000002190018d88dC9a7D0c261e57277636f28Fd2294c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000
    const aaRip7560Transaction = {
        sender: sender,
        nonce: "0x" + BigInt(nonce1).toString(16),
        validationGas: "0x" + BigInt(GasLimit).toString(16),
        paymasterGas: "0x" + BigInt(GasLimit).toString(16),
        postOpGas: "0x" + BigInt(GasLimit).toString(16),
        callGas: "0x" + BigInt(GasLimit).toString(16),
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: "0x" + BigInt(1).toString(16),
        builderFee: 0,
        // paymaster: PaymasterAddress,
        paymasterData: PaymasterAddress,
        // deployer: SmartAccountFactory,
        deployerData: SmartAccountFactory + "5fbfb9cf" + abiCoder.encode(["address", "uint256"], ['0xF0359B80550c6cb1Be3dA8611f2396e3F2a9Cc3C', index]).substring(2),
        callData: "0xb61d27f6000000000000000000000000" + KickAddress.substring(2) + "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000",
        signature: "0x10"
    }

    const txRaw = serializeEip7560(aaRip7560Transaction)
    // console.log(JSON.stringify(txRaw))

    const height =  await provider.getBlockNumber()
    console.log("0x" + BigInt(height).toString(16))

    await estimateRIP7560TransactionGas(txRaw, "0x" + BigInt(height).toString(16))

    const resdata = await sendRIP7560Tx(txRaw)

    console.log(resdata.data)
    const txid = resdata.data.result
    setTimeout(async () => {
        const status = await provider.getTransactionReceipt(txid)
        console.log(status)
    }, 3000)
}

run()