require('dotenv').config()

import { config } from '../../lib'
import { Cards } from '../src'

async function main() {

  const card = new Cards.AVAX({

    phrase: config.get('anypay_wallet_phrase')

  })
  const balance = await card.getBalance()

  console.log({ balance })

}

main()

