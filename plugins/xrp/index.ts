
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, Payment } from '../../lib/plugin'

const xrpl =  require('xrpl')

//TODO: FinishPluginImplementation

export default class XRP extends Plugin {

  chain = 'XRP'

  currency = 'XRP'

  decimals = 0 //TODO

  async parsePayments(transaction: Transaction): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const client = new xrpl.Client("wss://s1.ripple.com");
    await client.connect();

    const { result } = await client.request({
      command: "tx",
      transaction: txid,
      binary: true
    });

    const { result: ledgerResult } = await client.request({
      command: "ledger",
      ledger_index: result.ledger_index
    })

    const hash = ledgerResult.ledger_hash

    const height = parseInt(ledgerResult.ledger_index)

    const timestamp = new Date(ledgerResult.ledger.close_time * 1000)

    const { result: latestResult } = await client.request({
      command: "ledger",
      ledger_index: 'validated'
    })

    const latest = parseInt(latestResult.ledger.ledger_index)

    client.disconnect();

    return {
      confirmation_hash: hash,
      confirmation_height: height,
      confirmation_date: timestamp,
      confirmations: latest - height + 1
    }

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

