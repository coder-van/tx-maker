import { ethers } from 'ethers';

export async function sign(hash, prikey) {
    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey)

    const msg = ethers.getBytes("0x95e53ba9656a868637387c490b89e864dcf2b8247fdc2f697c0e9f68f224d3cb")
    const result = await signer.signMessage(msg)
    console.log(result)
};

sign()