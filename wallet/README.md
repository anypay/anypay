
```
import { Card, Cards, Balance, Transaction, Confirmation } from '@anypay/wallet'

let card: Card = new Cards.USDC_MATIC() // auto-detects either 'browser' or 'nodejs'

// or be explicit about whether you are in the browser or nodejs
let card: Card = new Cards.USDC_MATIC({ provider: 'browser' })

let balance: Balance = await getBalance(wallet)

// a card may be loaded directly given the 12 word backup seed phrase as mnemonic
card = new cards.USDC_MATIC({ mnemonic: process.env.polygon_seed_phrase })

let transaction: Transaction = await card.buildSignedTransaction({
  data: {
    address: '',
    value:  
  }
})

console.log(`here you have the signed transaction in full detail: ${transaction.txhex}`)

await transaction.broadcast()

console.log(`view your transaction here: https://polygonscan.com/tx/${transaction.txid}`)

const confirmation: Confirmation = await transaction.confirm()

```
