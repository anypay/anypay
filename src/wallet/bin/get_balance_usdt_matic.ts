require('dotenv').config()

import { Cards } from '@/wallet/src'

async function main() {

  const card = new Cards.USDT_MATIC({

    phrase: String(process.env.anypay_wallet_phrase)

  })
  const balance = await card.getBalance()

  console.log({ balance })

}

main()
