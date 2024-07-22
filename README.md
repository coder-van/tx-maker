# Token Contracts

Token Contracts

```shell
npx hardhat compile
npx hardhat node
npx hardhat deploy:local {FILE_PATH}
npx hardhat run:local {SCRIPT_PATH}
```

## How to send a RIP7560 transaction

First step, deploy 3 contracts
```
yarn compile
node scripts/deploy/01_account_factory.js
node scripts/deploy/02_pay_master.js
node scripts/deploy/03_kick.js
```

Second step, transfer some native coin to paymaster account
```

node scripts/01_transfer.mjs
PK="" node scripts/02_aa_kick.mjs // PK is private key of your aa account owner
```
