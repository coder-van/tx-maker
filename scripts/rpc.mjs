import axios from 'axios';

export async function estimateRIP7560TransactionGas(txdata, height) {
    let data = JSON.stringify({
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_estimateRIP7560TransactionGas",
        "params": [
            txdata, height
        ]
    })

    console.log(data)

    let config = {
        method: 'POST',
        // maxBodyLength: Infinity,
        url: 'http://localhost:8545',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return await axios.request(config)
        // .then((response) => {
        //     console.log(JSON.stringify(response.data));
        // })
        // .catch((error) => {
        //     console.log(error);
        // });
};

export async function sendRIP7560Tx(txdata) {
    let data = JSON.stringify({
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_sendTransaction",
        "params": [
            txdata
        ]
    })

    console.log(data)

    let config = {
        method: 'post',
        // maxBodyLength: Infinity,
        url: 'http://localhost:8545',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return await axios.request(config)
};


// SignatureHash
export async function signatureHash(txdata) {
    let data = JSON.stringify({
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_signatureHash",
        "params": [
            txdata
        ]
    })

    console.log(data)

    let config = {
        method: 'post',
        // maxBodyLength: Infinity,
        url: 'http://localhost:8545',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return await axios.request(config)
};