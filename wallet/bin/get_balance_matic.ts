require('dotenv').config()

import { Cards } from '../src'

async function main() {

  const card = new Cards.MATIC({

    phrase: process.env.anypay_wallet_phrase

  })
  const balance = await card.getBalance()

  console.log({ balance })

}

main()

