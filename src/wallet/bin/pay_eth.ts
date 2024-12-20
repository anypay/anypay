require('dotenv').config()

import { Cards } from '@/wallet/src'

import axios from 'axios'

async function main() {

  const url = process.argv[2]

  const chain = 'ETH'

  const currency = 'ETH'

  const card = new Cards.ETH({
    phrase: String(process.env.anypay_wallet_phrase)
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

    console.error(error)

    process.exit(1)

  }

}

main()

