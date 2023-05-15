require('dotenv').config()

import axios from 'axios'

export async function getTransaction(txid: string): Promise<string> {

  let { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`)

  return data

}

interface TransactionJSON {
  txid: string;
  hash: string;
  version: number;
  size: number;
  locktime: number;
  vin: any[]; 
  vout: any[]; 
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
  blockheight: number;
}

export async function getTransactionJSON(txid: string): Promise<TransactionJSON> {

  let { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}`)

  return data

}
