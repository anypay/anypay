require('dotenv').config()

import { config } from '@/lib/config'
import { Cards } from '@/wallet/src'

async function main() {

  const card = new Cards.BCH({

    phrase: config.get('anypay_wallet_phrase')

  })

  const address = await card.getAddress()

  console.log({ address })

  const balance = await card.getBalance()

  console.log({ balance })

}

main()

