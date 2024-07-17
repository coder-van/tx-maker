import * as ethers from 'ethers'

let provider = new ethers.JsonRpcProvider("http://localhost:8545")

async function once(nonce) {
    const now = Date.now()
    
    
    const privkey = '0xfffdbb37105441e14b0ee6330d855d8504ff39e705c3afa8f859ac9865f99306'
    const signer = new ethers.Wallet(privkey, provider)

    const balance = await provider.getBalance(signer.address)
    console.log(`Account[${signer.address}] balance=${balance}`)
    const abi = [
      "function mintx(uint256 n)"
    ]
    const contract = new ethers.Contract("0x5793a71D3eF074f71dCC21216Dbfd5C0e780132c", abi, signer)

    const tx = await contract.mintx(1000, { nonce: nonce });
    // tx.nonce = nonce
      
    // Often you may wish to wait until the transaction is mined
    const receipt = await tx.wait();
    console.log('mintx receipt =>\n', receipt)
    console.log(`${new Date() } submit tx us ${Date.now() - now}ms`)
}

function main() {
  let nonce = 241
  let nonceLimit = 260
  setInterval(() => {
    nonce += 1
    if (nonce > nonceLimit) { return }
    console.log(nonce)
    try {
      once(nonce)
    } catch (e) {
      console.log(e)
    }
   
  }, 200);
}

main()
// .catch((error) => {
//   console.error(error);
//   // process.exitCode = 1;
// });