import { Wallet } from 'ethers';

const wallet = Wallet.createRandom();

// 获取助记词
console.log('助记词:', wallet.mnemonic.phrase); 

// export MW='animal ghost found plastic bacon teach rural shield outside transfer uncover shoulder'
