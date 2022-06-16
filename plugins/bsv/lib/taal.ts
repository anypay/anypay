require('dotenv').config()

import axios from 'axios'

export async function getTransaction(txid: string): Promise<string> {

  console.log(process.env.TAAL_API_KEY)

  let { data } = await axios.post(`https://api.taal.com/api/v1/bitcoin`, {
    "jsonrpc": "1.0",
    "id":"curltest",
    "method": "getrawtransaction",
    "params": [txid]
  }, {
    headers: {
      'Authorization': process.env.TAAL_API_KEY,
      'Content-Type': 'application/json'
    }
  })

  return data

}
