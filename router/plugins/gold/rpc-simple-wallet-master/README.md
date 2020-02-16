
# RPC Simple Wallet

Uses a full node's wallet over RPC to send and receive. One wallet per address,
designed for a single program to own a single bitocin address;

## Configuration Environment Variables

Automatically checks for environment variables such as:

- BCH_RPC_HOST
- BCH_RPC_PORT
- BCH_RPC_USER
- BCH_RPC_PASSWORD

or

- DASH_RPC_HOST
- DASH_RPC_PORT
- DASH_RPC_USER
- DASH_RPC_PASSWORD

## Installation

`yarn add rpc-simple-wallet`

## USAGE

Your RPC node's wallet must maintain the private key to the address specified:

```
import { RPCSimpleWallet } from 'rpc-simple-wallet';

let account = 'Xxie51C2VsBC1bLUuWaCXKdJwEwtNzZPfU';

let wallet = new RPCSimpleWallet('DASH', account);

let balance = await wallet.getAddressUnspentBalance();

console.log('balance', balance);

```

```
import { RPCSimpleWallet } from 'rpc-simple-wallet';

let account = 'Xxie51C2VsBC1bLUuWaCXKdJwEwtNzZPfU'

let wallet = new RPCSimpleWallet('DASH', account);

let balance = await wallet.getAddressUnspentBalance();

let payment = await wallet.sendToAddress(destination, parseFloat(balance * 0.1));

console.log('payment', payment);

```
