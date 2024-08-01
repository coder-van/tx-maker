# rip7560js

contracts and scripts for RIP-7560 development

```shell
npx hardhat compile
npx hardhat node
```

## How to send a RIP7560 transaction

First step, deploy 3 contracts
```
yarn compile // compile contarcts
node scripts/deploy/01_account_factory.js
node scripts/deploy/02_pay_master.js
node scripts/deploy/03_kick.js
```


Second step, transfer some native coin to paymaster account
```
node scripts/01_transfer.mjs

OWNER_PRI_KEY="[replace your owner key]" node scripts/02_aa_kick.mjs // OWNER_PRI_KEY is private key of your aa account owner
```

## RPC APIs
call RPC APIs use axios in scripts/rpc.mjs

- eth_estimateRIP7560TransactionGas
```
{
    method: 'POST',
    url: 'http://localhost:8545',
    headers: {
        'Content-Type': 'application/json'
    },
    data: {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_estimateRIP7560TransactionGas",
        "params": [
            txdata, height
        ]
    }
}
```
txdata is transaction json, height is block height hex format string.
```
{
    "subType": "0x1",
    "to": "0x0000000000000000000000000000000000000000",
    "gasPrice": "0xf4247",
    "maxFeePerGas": "0xf4247",
    "maxPriorityFeePerGas": "0x0",
    "data": "0xb61d27f60000000000000000000000003945f611Fe77A51C7F3e1f84709C1a2fDcDfAC5B0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000047a67b47900000000000000000000000000000000000000000000000000000000",
    "gas": "0x4436d",
    "sender": "0x38F763BD07Bc42E0d1A331C0a89233C3E5567d07",
    "paymasterData": "0x459C653FaAE6E13b59cf8E005F5f709C7b2c2EB4",
    "deployerData": "0x18Df82C7E422A42D47345Ed86B0E935E9718eBda5fbfb9cf000000000000000000000000f0359b80550c6cb1be3da8611f2396e3f2a9cc3c0000000000000000000000000000000000000000000000000000000000000000",
    "builderFee": "0x0",
    "validationGas": "0x2d4b4",
    "paymasterGas": "0x763d",
    "callGas": "0x94b7",
    "postOpGas": "0x63c5",
    "signature": "0x2d55bc4feb4aafc452e9912743e9fd2d10ee78474677bd0f8bb494af70b579ba4361db42cd16b7ab3530d453b967c0fa4ee725a857cbbd20982fc2976c94731b1c",
    "bigNonce": "0x10000000000000003"
}
```

RPC responce
```
{
  jsonrpc: '2.0',
  id: 1,
  result: {
    baseGas: '0x3a98',
    nonceValidationGas: '0x7158',
    deploymentGas: '0x3e8',
    accountValidationGas: '0xe48b',
    paymasterValidationGas: '0x763d',
    callGas: '0x94b7',
    postOpGas: '0x63c5'
  }
}
```

- eth_sendTransaction

submit tx to node, gas limit use fields from eth_estimateRIP7560TransactionGas response, 
validationGas = baseGas + nonceValidationGas + deploymentGas + accountValidationGas.
```
{
    method: 'POST',
    url: 'http://localhost:8545',
    headers: {
        'Content-Type': 'application/json'
    },
    data: {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_sendTransaction",
        "params": txdata
    }
}
```

txdata is transaction json, same as txdata parameter in eth_estimateRIP7560TransactionGas

- eth_signatureHash
get signature hash for aa wallet sign, use keccak256(rlp(transaction_payload)).
```
{
    method: 'POST',
    url: 'http://localhost:8545',
    headers: {
        'Content-Type': 'application/json'
    },
    data: {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_signatureHash",
        "params": txdata
    }
}
```
txdata is transaction json, same as txdata parameter in eth_estimateRIP7560TransactionGas

## Tx Signature
There two method in scripts/tx_sign.mjs, encodeRlp and signMessage, encodeRlp encode transaction raw data with the fixed format to RLP bytes.

```
0x04 || 0x01 || rlp([
    chainId,
    nonce,
    sender,
    deployer, deployerData,
    paymaster, paymasterData,
    callData,
    builderFee,
    maxPriorityFeePerGas, maxFeePerGas,
    validationGasLimit, paymasterValidationGasLimit, paymasterPostOpGasLimit
    callGasLimit,
    accessList,
    signature // no this field
])
```

signMessage use AA wallet owner private key to sign the RLP bytes.