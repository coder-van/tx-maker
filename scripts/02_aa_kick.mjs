import { ethers } from 'ethers';

import { formatNumber, formatAccessList } from '../lib/ethers.js/lib.esm/transaction/transaction.js'
// import { concat, encodeRlp } from '../lib/ethers.js/lib.esm/utils/index.js'

const rpcUrl = "http://localhost:8545"
const provider = new ethers.JsonRpcProvider(rpcUrl)


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
    return JSON.stringify({
        // formatNumber(tx.chainId, "chainId"),
        from: "0x0000000000000000000000000000000000007560",
        subType: "0x1",
        to: "0x0000000000000000000000000000000000000000",
        gasPrice: "0x1",
        maxFeePerGas: "0x1",
        maxPriorityFeePerGas: "0x1",
        data: tx.callData,
        sender: tx.sender,
        paymaster            : tx.paymasterAddress,
        paymasterData: tx.paymasterData,
        deployer             : tx.smartAccountFactory,
        deployerData: tx.deployerData,
        builderFee: "0x1",
        gas: "0x7A120",
        validationGas: "0x7A120",
        paymasterGas: "0x7A120",
        postOpGas: "0x7A120",
        signature: tx.signature,
        bigNonce: tx.nonce,
    });
}

async function run() {
    const now = Date.now()
    
    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey, provider)

    const balance = await provider.getBalance(signer.address)
    console.log(`Account[${signer.address}] balance=${balance}`)
    const nonce = await provider.getTransactionCount(signer.address)
    console.log(`Account[${signer.address}] nonce=${nonce}`)

    
    const smartAccountFactory = "0x18Df82C7E422A42D47345Ed86B0E935E9718eBda"
    const simpleAccountFactoryAbi = [
        "function getAddressCopy(address owner, uint256 salt) view returns (address)",
    ]
    const smartAccountFactoryContract = new ethers.Contract(smartAccountFactory, simpleAccountFactoryAbi, signer);

    const paymasterAddress = "0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4"

    const index = 0;
    const sender = await smartAccountFactoryContract.getAddressCopy('0xF0359B80550c6cb1Be3dA8611f2396e3F2a9Cc3C', index);
    const abiCoder = new ethers.AbiCoder()

    console.log(`${formatNumber(80087, "chainId")}`)
    console.log(`AA sender is[${sender}]`)
    
    // deployerData
    // 0x5fbfb9cf0000000000000000000000007dd7daf47558b655ac9c8d7c3b806f1ceebc26940000000000000000000000000000000000000000000000000000000000000000
    // call kick 2190018d88dC9a7D0c261e57277636f28Fd2294c
    // 0xb61d27f60000000000000000000000002190018d88dC9a7D0c261e57277636f28Fd2294c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000
    const aaRip7560Transaction = {
        sender               : sender,
        nonce                : "0x1",
        validationGasLimit   : "0x7A120",
        paymasterGasLimit    : "0x7A120",
        postOpGasLimit       : "0x7A120",
        callGasLimit         : "0x7A120",
        maxFeePerGas         : "0x20",
        maxPriorityFeePerGas : "0x20",
        builderFee           : 0,
        paymaster            : paymasterAddress,
        paymasterData        : paymasterAddress,
        deployer             : smartAccountFactory,
        deployerData         : smartAccountFactory + "5fbfb9cf" + abiCoder.encode(["address", "uint256"], ['0xF0359B80550c6cb1Be3dA8611f2396e3F2a9Cc3C', index]).substring(2),
        callData             : "0xb61d27f60000000000000000000000003945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000",
        signature            : "0x10"
    }

    const txRaw = serializeEip7560(aaRip7560Transaction)
    console.log(txRaw)
    // const r1 = await Axios.post(rpcUrl, {
    //     jsonrpc: "2.0",
    //     id: 1,
    //     // method: "eth_estimateUserOperationGas",
    //     method: "eth_sendRip7560TransactionsBundle",
    //     params: [
    //         [txRaw],
    //         "0x1",
    //         "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    //     ],
    // });

    // confirm.log(r1)
}

run()