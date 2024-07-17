import { ethers } from 'ethers';
import { addressFromMnemonic } from './adresses.mjs';

let provider = new ethers.JsonRpcProvider("http://localhost:8545")

async function once(i, nonce) {
    const now = Date.now()


    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey, provider)

    const balance = await provider.getBalance(signer.address)
    console.log(`Account[${signer.address}] balance=${balance}`)
    // const nonce = await provider.getTransactionCount(signer.address)
    console.log(`Account[${signer.address}] nonce=${nonce}`)
    const to = addressFromMnemonic(i).address
    // '0xF0359B80550c6cb1Be3dA8611f2396e3F2a9Cc3C'
    const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther("1.0"),
        nonce
    });

    // Often you may wish to wait until the transaction is mined
    const receipt = await tx.wait();
    console.log('transfer receipt =>\n', receipt)
    console.log(`${new Date()} submit tx us ${Date.now() - now}ms`)

    const acc1Balance = await provider.getBalance(to)
    console.log(`Account[${to}] balance now is ${ethers.formatUnits(acc1Balance.toString())}`,)
}

function main() {
    let i = 0
    let nonce = 420
    let nonceLimit = nonce + 100
    setInterval(() => {
        i += 1
        nonce += 1
        if (nonce > nonceLimit) { return }
        console.log(nonce)
        try {
            once(i, nonce)
        } catch (e) {
            console.log(e)
        }

    }, 200);
}
main()