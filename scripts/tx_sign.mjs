import { ethers } from 'ethers';


function toBeHex(val) {
    if (val == "0x") { return val }
    return parseInt(val) === 0 ? "0x" : ethers.toBeHex(val)
}

function toBeAddress(val) {
    const ZeroAddress = "0x0000000000000000000000000000000000000000"
    if (!val || val == "0x") { return ZeroAddress }
    
    return val
}

export function encodeRlp(chainId, data) {
    // data.chainId = "0x138d7"
    // data.AccessList = []

    const rlp = ethers.encodeRlp([
        toBeHex(chainId),
        toBeHex(data.bigNonce), // data.nonce,
        toBeAddress(data.sender),
        toBeAddress(data.deployer),
        toBeHex(data.deployerData),
        toBeAddress(data.paymaster),
        toBeHex(data.paymasterData),
        toBeHex(data.data),
        toBeHex(data.builderFee),
        toBeHex(data.maxPriorityFeePerGas),
        toBeHex(data.maxFeePerGas),
        toBeHex(data.validationGas),
        toBeHex(data.paymasterGas),
        toBeHex(data.postOpGas),
        toBeHex(data.gas),
        data.AccessList || []
        // ethers.toBeHex(data.signature)
    ])

    // 0x04 || 0x01 || rlp([
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
    const prefixrlp = "0x0401" + rlp.substring(2)
    console.log(rlp)
    console.log(ethers.keccak256(prefixrlp))
    return { rlp, hash: ethers.keccak256(prefixrlp) }
}

export async function signMessage(hash, signer) {
    // const signer = new ethers.Wallet(privkey)
    const msg = ethers.getBytes(hash)
    return await signer.signMessage(msg)
};

// chainId = 2013
// const data = {"subType":"0x1","to":"0x0000000000000000000000000000000000007560","gasPrice":"0xf4247","maxFeePerGas":"0xf4247","maxPriorityFeePerGas":"0x0","data":"0xb61d27f60000000000000000000000003945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000","gas":"0x231c4","sender":"0x38F763BD07Bc42E0d1A331C0a89233C3E5567d07","paymaster":"0x0000000000000000000000000000000000000000","paymasterData":"0x","deployer":"0x18Df82C7E422A42D47345Ed86B0E935E9718eBda","deployerData":"0x5fbfb9cf000000000000000000000000f0359b80550c6cb1be3da8611f2396e3f2a9cc3c0000000000000000000000000000000000000000000000000000000000000000","builderFee":"0x0","validationGas":"0x1953d","paymasterGas":"0x3e8","callGas":"0x94b7","postOpGas":"0x3e8","signature":"0x0000000000000000000000000000000000000000000000000000000000000000","bigNonce":"0x10000000000000002"}
// const rlp = "f9014e8207dd890100000000000000029438f763bd07bc42e0d1a331c0a89233c3e5567d079418df82c7e422a42d47345ed86b0e935e9718ebdab8445fbfb9cf000000000000000000000000f0359b80550c6cb1be3da8611f2396e3f2a9cc3c000000000000000000000000000000000000000000000000000000000000000094000000000000000000000000000000000000000080b8a4b61d27f60000000000000000000000003945f611fe77a51c7f3e1f84709c1a2fdcdfac5b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b479000000000000000000000000000000000000000000000000000000008080830f42478301953d8203e88203e8830231c4c0"
// console.log(ethers.keccak256( "0x0401" + rlp.substring(2)))
// 0xbb680510a63ccaa24904f5a2d43c89de89a9eb85248d547b9b145af1c0778c0a √
// (function () {
//     const data = {"subType":"0x1","to":"0x0000000000000000000000000000000000007560","gasPrice":"0xf4247","maxFeePerGas":"0xf4247","maxPriorityFeePerGas":"0x0","data":"0xb61d27f60000000000000000000000003945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000","gas":"0x231c4","sender":"0x38F763BD07Bc42E0d1A331C0a89233C3E5567d07","paymaster":"0x0000000000000000000000000000000000000000","paymasterData":"0x","deployer":"0x18Df82C7E422A42D47345Ed86B0E935E9718eBda","deployerData":"0x5fbfb9cf000000000000000000000000f0359b80550c6cb1be3da8611f2396e3f2a9cc3c0000000000000000000000000000000000000000000000000000000000000000","builderFee":"0x0","validationGas":"0x1953d","paymasterGas":"0x3e8","callGas":"0x94b7","postOpGas":"0x3e8","signature":"0x0000000000000000000000000000000000000000000000000000000000000000","bigNonce":"0x10000000000000002"}
//     const chainId = 2013
//     const { rlp, hash } = encodeRlp(chainId, data)
//     console.log("rlp :\n", rlp)
//     console.log("hash :\n", hash)
// })()