import {ethers} from 'ethers';

let provider = new ethers.JsonRpcProvider("http://localhost:8545")

const ContractAddress = "0x3945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B"

async function run() {
    const now = Date.now()
    
    
    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey, provider)

    const balance = await provider.getBalance(signer.address)
    console.log(`Account[${signer.address}] balance=${balance}`)
    const nonce = await provider.getTransactionCount(signer.address)
    console.log(`Account[${signer.address}] nonce=${nonce}`)

    const abi = [
        "function kick()",
        "function kicknum() public view returns (uint256)",
        "function kicknumOf(address sender) public view returns (uint256)"
    ]
    const contract = new ethers.Contract(ContractAddress, abi, signer)
    const tx = await contract.kick()
    const receipt = await tx.wait();
    console.log('kick receipt =>\n', receipt)

    const kicknum = await contract.kicknum()
    console.log("kicknum", kicknum)
    // 0x38F763BD07Bc42E0d1A331C0a89233C3E5567d07
    const kicknumOf = await contract.kicknumOf("0x38f763bd07bc42e0d1a331c0a89233c3e5567d07")
    console.log("kicknumOf sender[0x38f763bd07bc42e0d1a331c0a89233c3e5567d07]", kicknumOf)
}

run()