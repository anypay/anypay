require('dotenv').config()

import { Cards } from '../src'

async function main() {

  const card = new Cards.BTC({

    phrase: process.env.anypay_wallet_phrase

  })

  const address = await card.getAddress()

  console.log({ address })

  const balance = await card.getBalance()

  console.log({ balance })

}

main()

