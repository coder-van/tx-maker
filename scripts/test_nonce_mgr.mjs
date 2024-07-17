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

    const abi = [
        "function getNonce(address sender, uint192 key) view returns (address nonce)",
        "function incNonce(address sender, uint192 key)"
    ]
    const contract = new ethers.Contract("0x0000000000000000000000000000000000007712", abi, signer)
    const nonce1 = await contract.getNonce('0x38f763bd07bc42e0d1a331c0a89233c3e5567d07', 1)
    // await contract.incNonce(signer.address, 1)
    console.log("nonce1", nonce1)
}

run()