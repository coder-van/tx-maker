import { ethers } from 'ethers';


function toBeHex(val) {
    if (val == "0x") { return val }
    return parseInt(val) === 0 ? "0x" : ethers.toBeHex(val)
}

export function encodeRlp(chainId, data) {
    // data.chainId = "0x138d7"
    // data.AccessList = []

    const rlp = ethers.encodeRlp([
        toBeHex(chainId),
        toBeHex(data.bigNonce), // data.nonce,
        toBeHex(data.sender),
        toBeHex(data.deployer),
        toBeHex(data.deployerData),
        toBeHex(data.paymaster),
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
// const data = {"subType":"0x1","to":"0x0000000000000000000000000000000000007560","gasPrice":"0xf4247","maxFeePerGas":"0xf4247","maxPriorityFeePerGas":"0x0","data":"0xb61d27f60000000000000000000000003945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000","gas":"0x30536","sender":"0x38F763BD07Bc42E0d1A331C0a89233C3E5567d07","paymaster":"0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4","paymasterData":"0x","deployer":"0x18Df82C7E422A42D47345Ed86B0E935E9718eBda","deployerData":"0x5fbfb9cf000000000000000000000000f0359b80550c6cb1be3da8611f2396e3f2a9cc3c0000000000000000000000000000000000000000000000000000000000000000","builderFee":"0x0","validationGas":"0x19621","paymasterGas":"0x7699","callGas":"0x94b7","postOpGas":"0x63c5","signature":"0x0000000000000000000000000000000000000000000000000000000000000000","bigNonce":"0x10000000000000003"}
// const rlp = "0xf9014c8207dd890100000000000000189438f763bd07bc42e0d1a331c0a89233c3e5567d07b85818df82c7e422a42d47345ed86b0e935e9718ebda5fbfb9cf000000000000000000000000f0359b80550c6cb1be3da8611f2396e3f2a9cc3c000000000000000000000000000000000000000000000000000000000000000094459c653faae6e13b59cf8e005f5f709c7b2c2eb4b8a4b61d27f60000000000000000000000003945f611fe77a51c7f3e1f84709c1a2fdcdfac5b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b479000000000000000000000000000000000000000000000000000000008080830f42478301946382763d8263c58303031cc0"
// console.log(ethers.keccak256( "0x0401" + rlp.substring(2)))
// 0xba5c0b7870775491edb8d98297df96dee1dba87c1e68571269e382d645091e91 √
(function () {
    const data = {"subType":"0x1","to":"0x0000000000000000000000000000000000007560","gasPrice":"0xf4247","maxFeePerGas":"0xf4247","maxPriorityFeePerGas":"0x0","data":"0xb61d27f60000000000000000000000003945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000","gas":"0x30536","sender":"0x38F763BD07Bc42E0d1A331C0a89233C3E5567d07","paymaster":"0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4","paymasterData":"0x","deployer":"0x18Df82C7E422A42D47345Ed86B0E935E9718eBda","deployerData":"0x5fbfb9cf000000000000000000000000f0359b80550c6cb1be3da8611f2396e3f2a9cc3c0000000000000000000000000000000000000000000000000000000000000000","builderFee":"0x0","validationGas":"0x19621","paymasterGas":"0x7699","callGas":"0x94b7","postOpGas":"0x63c5","signature":"0x0000000000000000000000000000000000000000000000000000000000000000","bigNonce":"0x10000000000000003"}
    const chainId = 2013
    const { rlp, hash } = encodeRlp(chainId, data)
    console.log("rlp :\n", rlp)
    console.log("hash :\n", hash)
})()