require('dotenv').config()

import { Cards, PaymentOption } from '../src'

import axios from 'axios'

async function main() {

  const chain = process.argv[2] || 'MATIC'

  const currency = process.argv[3] || 'USDC'

  const Card = Cards.getCard({ chain, currency })

  const card = new Card({
    phrase: process.env.anypay_wallet_phrase
  })

  const amount = process.argv[4] ? parseFloat(process.argv[4]) : 0.0001

  const base = 'https://develop.anypayx.com'

  const { data } = await axios.post(`${base}/invoices`, {
    amount
  }, {
    auth: {
      username: process.env.ANYPAY_ACCESS_TOKEN,
      password: ''
    }
  })

  console.log(data, 'invoice.created')

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

    console.log(error)

    console.error(error.response.data)

    process.exit(1)

  }

}

main()

