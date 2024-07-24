import { ethers } from 'ethers';

export async function sign(hash, prikey) {
    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey)

    const msg = ethers.getBytes("0x95e53ba9656a868637387c490b89e864dcf2b8247fdc2f697c0e9f68f224d3cb")
    const result = await signer.signMessage(msg)
    console.log(result)
};

export async function encode() {
    const data = {"subType":"0x1","to":"0x0000000000000000000000000000000000000000","gasPrice":"0xf4247","maxFeePerGas":"0xf4247","maxPriorityFeePerGas":"0x0","data":"0xb61d27f60000000000000000000000003945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000","gas":"0x3031c","sender":"0x38F763BD07Bc42E0d1A331C0a89233C3E5567d07","paymasterData":"0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4","deployerData":"0x18Df82C7E422A42D47345Ed86B0E935E9718eBda5fbfb9cf000000000000000000000000f0359b80550c6cb1be3da8611f2396e3f2a9cc3c0000000000000000000000000000000000000000000000000000000000000000","builderFee":"0x0","validationGas":"0x19463","paymasterGas":"0x763d","callGas":"0x94b7","postOpGas":"0x63c5","signature":"0x0000000000000000000000000000000000000000000000000000000000000000","bigNonce":"0x10000000000000003"}
    // data.chainId = "0x138d7"
    // data.AccessList = []
    // ethers.toBeHex(4)
    const rlp = ethers.encodeRlp([
        ethers.toBeHex('0x138d7'),
        ethers.toBeHex(data.bigNonce), // data.nonce,
        ethers.toBeHex(data.sender),
        ethers.toBeHex(data.deployerData),
        ethers.toBeHex(data.paymasterData),
        ethers.toBeHex(data.data),
        ethers.toBeHex(data.builderFee),
        ethers.toBeHex(data.maxPriorityFeePerGas),
        ethers.toBeHex(data.maxFeePerGas),
        ethers.toBeHex(data.validationGas),
        ethers.toBeHex(data.paymasterGas),
        ethers.toBeHex(data.postOpGas),
        ethers.toBeHex(data.gas),
        []
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
    const prefixrlp = "0x04" + rlp.substring(2)
    console.log(rlp)
    console.log(ethers.keccak256(prefixrlp))

    const rlp1 = "0xf9014d830138d7890100000000000000039438f763bd07bc42e0d1a331c0a89233c3e5567d07b85818df82c7e422a42d47345ed86b0e935e9718ebda5fbfb9cf000000000000000000000000f0359b80550c6cb1be3da8611f2396e3f2a9cc3c000000000000000000000000000000000000000000000000000000000000000094459c653faae6e13b59cf8e005f5f709c7b2c2eb4b8a4b61d27f60000000000000000000000003945f611fe77a51c7f3e1f84709c1a2fdcdfac5b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b479000000000000000000000000000000000000000000000000000000008080830f42478301946382763d8263c58303031cc0"
    console.log(ethers.keccak256( "0x04" + rlp1.substring(2)))
    // 0x87f51932dd4962da8f15008c152f54dd08bd264a9ba5a28e6fd35ddc98a643b0 √
}

encode()