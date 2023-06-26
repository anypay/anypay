

require('dotenv').config()

import { Cards, PaymentOption } from '../src'

import axios from 'axios'

async function main() {

  const chain = process.argv[2]

  const currency = process.argv[3]

  const uid = process.argv[4]

  const txid = process.argv[5]

  const Card = Cards.getCard({ chain, currency })

  const card = new Card({
    phrase: process.env.anypay_wallet_phrase
  })

  //const base = 'https://develop.anypayx.com'
  const base = 'http://localhost:5211'

  const url = `${base}/r/${uid}`

  try {

    const { data: paymentResult } = await axios.post(url, {
      chain,
      currency,
      transactions: [{ tx: txid }]
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

