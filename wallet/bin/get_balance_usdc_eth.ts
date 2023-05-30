require('dotenv').config()

import { Cards } from '../src'

async function main() {

  const card = new Cards.USDC_ETH({

    phrase: process.env.anypay_wallet_phrase

  })
  const balance = await card.getBalance()

  console.log({ balance })

}

main()

