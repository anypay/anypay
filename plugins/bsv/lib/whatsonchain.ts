require('dotenv').config()

import axios from 'axios'

export async function getTransaction(txid: string): Promise<string> {

  let { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`)

  return data

}
