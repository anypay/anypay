
# Anypay Simple Wallet

For building apps which control money and most importantly
for testing anypay in production.

## Installation

```
npm install --save anypay-simple-wallet
```

## Environment Variables

- BSV_PRIVATE_KEY
- BTC_PRIVATE_KEY
- BCH_PRIVATE_KEY
- DASH_PRIVATE_KEY
- LTC_PRIVATE_KEY
- DOGE_PRIVATE_KEY
- XRP_PRIVATE_KEY
- XMR_SIMPLE_WALLET_SEED

### Usage

The Wallet implements the JSON Payment Protocol V2 Spec
compatible with AnypayX.com and Bitpay.com


```
import { Wallet } from 'anypay-simple-wallet'

let wallet = Wallet.fromWIF(process.env.WIF)

let balance = await wallet.getBalance()

let transaction = await wallet.buildTransaction([{
  address: "1VxvyqNXXYdC8xHSW8VQTsHbrCdG2BBJ6",
  amount: 5000,
}, {
  address: "17du1ERGCG4Cwpm2N4GQHzKo8R3XVEJ33t",
  amount: 5000
}])

```

All protocol methods are defined and available using the
protocol client with built in validation.

```

import { Client, Wallet } from 'anypay-simple-wallet'

let client = new Client('https://anypayx.com/i/3kbn9ids')

let { paymentOptions } = await client.getPaymentOptions()

let paymentOption = paymentOptions.filter(option => option.currency === 'BSV')[0]

let paymentRequest = await client.selectPaymentOption(paymentOption)

let wallet = Wallet.fromWIF(process.env.WIF)

let payment = await client.sendPayment(wallet, paymentRequest)

```

To test a local implementation of the protocol within
a Hapi or Supertest-compatible webserver use TestClient as a
drop-in replacement for Client.

```
import { app } from '../'

import { TestClient } from 'anypay-simple-wallet'

import * as supertest from 'supertest'

const server = supertest(app)

const client = new TestClient(server, `/i/3kbn9ids`)

let { paymentOptions } = await client.getPaymentOptions()

```

