require('dotenv').config()

import { Cards, PaymentOption } from '../src'

import { polygon } from 'usdc'

import axios from 'axios'

async function main() {

  const url = process.argv[2]

  const chain = 'ETH'

  const currency = 'USDC'

  const card = new Cards.USDC_ETH({
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

    if (error.response) {

      console.error(error.response.data)

    } else {

      console.error(error)

    }

    process.exit(1)

  }

}

main()

