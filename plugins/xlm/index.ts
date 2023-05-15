
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

import axios from 'axios'

export default class XLM extends Plugin {

  chain = 'XLM'

  currency = 'XLM'

  decimals = 0 //TODO

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await getTransaction(txid)

    console.log(transaction)

    console.log(getLedger)

    throw new Error() // TODO

  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    throw new Error()//TODO

  }

  async getTransaction(txid: string): Promise<Transaction> {

    throw new Error()

  }

  async validateAddress(address: string) {

    return false

  }

  async verifyPayment(params) {

    return false

  }

}

async function getTransaction(txid: string): Promise<any> {

  const { data } = await axios.get(`https://horizon.stellar.org/transactions/${txid}`)

  return data

}

async function getLedger(index: number): Promise<any> {

  const { data } = await axios.get(`https://horizon.stellar.org/ledgers/${index}`)

  return data

}

