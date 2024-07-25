import { ethers } from 'ethers';

// import { concat, encodeRlp } from '../lib/ethers.js/lib.esm/utils/index.js'
import { estimateRIP7560TransactionGas, sendRIP7560Tx, signatureHash } from "./rpc.mjs"

const rpcUrl = "http://localhost:8545"
const provider = new ethers.JsonRpcProvider(rpcUrl)


// ************************************************************************ //
// const GasPrice = 100000000
const GasLimit = 500000
const SmartAccountFactory = "0x18Df82C7E422A42D47345Ed86B0E935E9718eBda"
const PaymasterAddress = "0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4"
const NonceManagerAddress = "0x0000000000000000000000000000000000007712"
const KickAddress = "0x3945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B"
const OwnerPrivKey = process.env.OWNER_PRI_KEY
// ************************************************************************ //

function bigIntToHex(val) {
   return "0x" + (BigInt(val)).toString(16)
}

function FormatRIP7560Tx(tx) {
    return {
        subType: "0x1",
        to: "0x0000000000000000000000000000000000007560",
        gasPrice: tx.maxFeePerGas,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
        data: tx.callData,
        gas: tx.gas,  // >= validationGas + paymasterGas + callGas + postOpGas
        sender: tx.sender,
        // paymaster: tx.paymaster, // paymaster pleace in paymasterData[0:20]
        paymasterData: tx.paymasterData,
        // deployer: tx.deployer, // deployer pleace in deployerData[0:20]
        deployerData: tx.deployerData,
        builderFee: "0x0",
        validationGas: tx.validationGas,
        paymasterGas: tx.paymasterGas,
        callGas: tx.callGas,
        postOpGas: tx.postOpGas,
        signature: tx.signature,
        bigNonce: tx.nonce,
    }
}

async function signMessage(hash, signer) {
    // const signer = new ethers.Wallet(privkey)
    const msg = ethers.getBytes(hash)
    return await signer.signMessage(msg)
};

async function run() {
    const now = Date.now()

    const aaWalletOwnerSigner = new ethers.Wallet(OwnerPrivKey)
    const ownerAddress = aaWalletOwnerSigner.address

    const emptyHash = "0x0000000000000000000000000000000000000000000000000000000000000000"
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
    const sender = await smartAccountFactoryContract.getAddressCopy(ownerAddress, index);
    const abiCoder = new ethers.AbiCoder()

    console.log(`AA sender is[${sender}]`)

    const nonceManagerAbi = [
        "function getNonce(address sender, uint192 key) view returns (address nonce)",
        "function incNonce(address sender, uint192 key)"
    ]
    const contract = new ethers.Contract(NonceManagerAddress, nonceManagerAbi, signer)
    const nonce1 = await contract.getNonce(sender, 1)

    const feeData = await provider.getFeeData()
    const gasPrice = bigIntToHex(feeData.gasPrice)
    // callData call KickContract kick()
    const aaRip7560Transaction = {
        sender: sender,
        nonce: bigIntToHex(nonce1),
        validationGas: bigIntToHex(GasLimit),
        paymasterGas: bigIntToHex(GasLimit),
        postOpGas:bigIntToHex(GasLimit),
        callGas: bigIntToHex(GasLimit),
        gas: bigIntToHex(GasLimit * 4),
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: "0x0",
        paymasterData: PaymasterAddress,
        deployerData: SmartAccountFactory + "5fbfb9cf" + abiCoder.encode(["address", "uint256"], [ownerAddress, index]).substring(2),
        callData: "0xb61d27f6000000000000000000000000" + KickAddress.substring(2) + "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000",
        signature: emptyHash
    }

    const txRaw = FormatRIP7560Tx(aaRip7560Transaction)
    const height =  await provider.getBlockNumber()
    console.log(bigIntToHex(height))

    // call gas estimate RPC API
    txRaw.signature = await signMessage(emptyHash, aaWalletOwnerSigner) // 
    const estimatResdata = await estimateRIP7560TransactionGas(txRaw, bigIntToHex(height))
    console.log("estimate gas RPC response data \n", estimatResdata.data)

    const {
        baseGas,
        nonceValidationGas,
        deploymentGas,
        accountValidationGas,
        paymasterValidationGas,
        callGas,
        postOpGas
    } = estimatResdata.data.result
    // set gasLimit fields

    txRaw.validationGas = bigIntToHex(BigInt(baseGas) + 
        BigInt(nonceValidationGas) + 
        BigInt(deploymentGas) + 
        BigInt(accountValidationGas) - 
        BigInt(0))
    txRaw.paymasterGas = bigIntToHex(BigInt(paymasterValidationGas))
    txRaw.callGas = callGas
    txRaw.postOpGas = postOpGas
    // txRaw.gas = bigIntToHex(50000000) // test gas over block limit
    txRaw.gas = bigIntToHex(BigInt(txRaw.paymasterGas) + BigInt(txRaw.validationGas) + BigInt(txRaw.callGas) + BigInt(txRaw.postOpGas))
    // call RPC API get signature hash
    txRaw.signature = emptyHash
    const signatureHashResdata = await signatureHash(txRaw)
    console.log("signature hash RPC response data \n", signatureHashResdata.data)
    const { hash } = signatureHashResdata.data.result
    // compute signature
    txRaw.signature = await signMessage(hash, aaWalletOwnerSigner)
    console.log(txRaw.signature)
    const resdata = await sendRIP7560Tx(txRaw)
    console.log("sendRIP7560Tx RPC response data \n", resdata.data)
    // check transaction receipt
    const txid = resdata.data.result
    
    const inv = setInterval(async () => {
        const status = await provider.getTransactionReceipt(txid)
        if (!status) { 
            console.log('waiting tx receipt ...') 
            return
        }
        console.log(status)
        clearInterval(inv)
    }, 3000)
}

run()


// nonceValidation.UsedGas=45104
// deployment.UsedGas=227,399
// accountValidation.UsedGas=42495
// paymasterValidation.UsedGas=29257
// executionResult.UsedGas=54171
// paymasterPostOpResult.UsedGas=24541

// nonceValidation.UsedGas=45104
// deployment.UsedGas=227,399
// accountValidation.UsedGas=42831
// paymasterValidation.UsedGas=29593
// executionResult.UsedGas=54171
