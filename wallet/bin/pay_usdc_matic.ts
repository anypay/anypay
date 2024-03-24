require('dotenv').config()

import { config } from '../../lib'
import { Cards, PaymentOption } from '../src'

import axios from 'axios'

async function main() {

  const url = process.argv[2]

  const chain = 'MATIC'

  const currency = 'USDC'

  const card = new Cards.USDC_MATIC({
    phrase: config.get('anypay_wallet_phrase')
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

    console.error(error.response.data)

    process.exit(1)

  }

}

main()

