import {ethers} from 'ethers';
import {addressFromMnemonic} from './tools/adresses.mjs';

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
        "function createAccount(address owner, uint256 salt) public returns (address)"
    ]
    const contract = new ethers.Contract("0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4", abi, signer)

    const tx = await contract.createAccount('0xF0359B80550c6cb1Be3dA8611f2396e3F2a9Cc3C', 0)

    const receipt = await tx.wait();
    console.log('transfer receipt =>\n', receipt)
}

run()