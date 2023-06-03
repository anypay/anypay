require('dotenv').config()

import { Cards, PaymentOption } from '../src'

import Card from '../src/cards/doge'

import axios from 'axios'

async function main() {

  const url = process.argv[2]

  const currency = process.argv[3]

  const chain = process.argv[4] || currency

  const card = new Card({
    phrase: process.env.anypay_wallet_phrase
  })

  try {

    const { data: paymentOption } = await axios.post(url, {
      chain,
      currency
    }, {
      headers: {
        'content-type': 'application/payment-request'
      }
    })

    console.log({ paymentOption })

    const address = card.getAddress()

    console.log({ address })

    const balance = await card.getBalance()

    console.log({ balance })

    const { txhex, txid } = await card.buildSignedPayment(paymentOption)

    console.log({txhex, txid})

    const { data: paymentResult } = await axios.post(url, {
      chain,
      currency,
      transactions: [{ tx: txhex }]
    }, {
      headers: {
        'content-type': 'application/payment'
      }
    })

    console.log({ paymentResult })

    process.exit()

  } catch(error) {

    if (error && error.response && error.response.data) {

      console.error(error.response.data)

    } else {

      console.error(error.response)

    }

    process.exit(1)

  }

}

main()

