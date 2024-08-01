import {ethers} from 'ethers';

let provider = new ethers.JsonRpcProvider("http://localhost:8545")

async function run() {
    const now = Date.now()
    
    
    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey, provider)

    const balance = await provider.getBalance(signer.address)
    console.log(`Account[${signer.address}] balance=${balance}`)
    const nonce = await provider.getTransactionCount(signer.address)
    console.log(`Account[${signer.address}] nonce=${nonce}`)
    const to = "0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4" // addressFromMnemonic(0).address
    // const to = "0xDDdDE06b3853427883485bCA250188F1aDe8d9b8"
    // '0xF0359B80550c6cb1Be3dA8611f2396e3F2a9Cc3C'
    const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther("1.0")
    });
      
    // Often you may wish to wait until the transaction is mined
    const receipt = await tx.wait();
    console.log('transfer receipt =>\n', receipt)
    console.log(`${new Date() } submit tx us ${Date.now() - now}ms`)

    const acc1Balance = await provider.getBalance(to)
    console.log(`Account[${to}] balance now is ${ethers.formatUnits(acc1Balance.toString())}`, )
}

run()