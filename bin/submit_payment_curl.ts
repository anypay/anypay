#!/usr/bin/env ts-node

require('dotenv').config()

const axios = require('axios')

;(async () => {


  try {

    const invoice_uid = process.argv[2]

    const currency = process.argv[3]

    const txhex = process.argv[4]

    const result = await axios.post(`https://api.anypayx.com/i/${invoice_uid}`, {
      currency,
      chain: currency,
      transactions: [{
        tx: txhex
      }]
    }, {
      headers: {
        'content-type': 'application/payment'
      }
    })

    console.log(result)

  } catch(error) {

    console.error(error.response.data)

  }

})();
