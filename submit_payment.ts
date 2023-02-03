#!/usr/bin/env ts-node

require('dotenv').config()

//import { broadcastTx } from './plugins/btc'

import { submitPayment } from './lib/pay/json_v2/protocol'

;(async () => {

  const invoice_uid = process.argv[2]

  const currency = process.argv[3]

  const txhex = process.argv[4]

  try {

    const result = await submitPayment({
      currency,
      invoice_uid,
      transactions: [{
        tx: txhex
      }]
    })

    //const result = await broadcastTx(tx)

    console.log(result)

  } catch(error) {

    console.error(error)

  }

})();
