
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, Payment } from '@/lib/plugin'

import { Client } from 'xrpl'

import axios from 'axios'
import { SetPrice } from '@/lib/prices/price'

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

    const client = new Client("wss://s1.ripple.com");
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

    const height = ledgerResult.ledger_index

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

  async validateAddress(address: string): Promise<boolean> {

    const client = new Client("wss://s1.ripple.com");
    await client.connect();

    const balance = await client.getXrpBalance(address)

    console.log({ balance })

    client.disconnect();

    return parseFloat(balance) > 0

  }

  async verifyPayment(param: any) {

    return false

  }

  async getPrice(): Promise<SetPrice> {

    const { data } = await axios.get(`https://data.gateapi.io/api2/1/ticker/xrp_usdt`)

    const value = parseFloat(data.last)

    return {
      value,
      base_currency: 'USD',
      currency: this.currency, 
      chain: this.chain, 
      source: 'gate.io',
      change_24hr: parseFloat(data.percentChange)
    }

  }

}

