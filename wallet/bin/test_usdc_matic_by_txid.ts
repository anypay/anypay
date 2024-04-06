require('dotenv').config()

import { Cards, PaymentOption } from '../src'

import axios from 'axios'

async function main() {

  const chain = 'MATIC'

  const currency = 'USDC'

  const card = new Cards.USDC_MATIC({
    phrase: process.env.anypay_wallet_phrase
  })

  const amount = 0.01

  const base = 'http://localhost:8000'

  const { data } = await axios.post(`${base}/invoices`, {
    amount
  }, {
    auth: {
      username: process.env.ANYPAY_ACCESS_TOKEN,
      password: ''
    }
  })

  const uid = data.invoice.uid

  const url = `${base}/r/${uid}`

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

    const { instructions } = paymentOption

    console.log({ instructions })

    const { txhex, txid } = await card.buildSignedPayment(paymentOption)

    console.log({txhex, txid})

    // broadcast

    const broadcastResult = await card.broadcastSignedTransaction(txhex)

    const { data: paymentResult } = await axios.post(url, {
      chain,
      currency,
      transactions: [{ tx: txid }] //TODO switch txid back to txhex
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

