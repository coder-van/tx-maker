import { Wallet, HDNodeWallet } from 'ethers';

const MW = process.env.MW

export function addressFromMnemonic(i=0) {
  try {
    const mnemonic = MW; // 替换为你的助记词
    const wallet = Wallet.fromPhrase(mnemonic);
    const hdw = wallet.derivePath( `44'/60'/0'/0/${i}`)
    // const wallet = HDNodeWallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0")
    return hdw
    // const address = hdw.address;
    // console.log('地址:', address); 
  } catch (error) {
    console.error('生成地址失败:', error);
  }
}

