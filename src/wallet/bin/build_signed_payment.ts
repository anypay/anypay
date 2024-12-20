require('dotenv').config()

import { config } from '@/lib'
import { Cards, Transaction } from '@/wallet/src'

import axios from 'axios'

var argv = require('yargs/yargs')(process.argv.slice(2))
    .option('b', {
        alias: 'chain',
        required: true,
        type: 'string'
    })
    .option('c', {
        alias: 'currency',
        required: true,
        type: 'string'
    })
    .option('u', {
        alias: 'url',
        type: 'string'
    })
    .argv

async function main() {

  const url = argv.url || "https://ionia.anypayx.com/r/9XiGcT-SY"

  const chain = argv.chain || 'MATIC'

  const currency = argv.currency || 'USDC'

  const Card = Cards.getCard({ chain, currency })

  const card = new Card({

    phrase: config.get('anypay_wallet_phrase')

  })

  const address = await card.getAddress()

  console.log({ address })

  const balance = await card.getBalance()

  console.log({ balance })

  const { data: paymentOption } = await axios.post(url, {
    chain, currency
  }, {
    headers: {
      'content-type': 'application/payment-request'
    }
  })

  console.log(paymentOption)

  const transaction: Transaction = await card.buildSignedPayment(paymentOption)

  console.log(transaction)

}

main()

