require('dotenv').config()

import { Cards } from '@/wallet/src'

async function main() {

  const chain = process.argv[2]

  const currency = process.argv[3] || chain

  const Card = Cards.getCard({ chain, currency })

  const card = new Card({

    phrase: process.env.anypay_wallet_phrase

  })

  const address = await card.getAddress()

  console.log({ address })

  const balance = await card.getBalance()

  console.log({ balance })

}

main()

