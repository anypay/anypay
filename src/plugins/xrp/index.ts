import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, Payment } from '@/lib/plugin'

import axios from 'axios'
import { SetPrice } from '@/lib/prices/price'
import BigNumber from 'bignumber.js'
import { decode, BroadcastClient, Client } from 'xrpl'

//TODO: FinishPluginImplementation

export default class XRP extends Plugin {

  chain = 'XRP'

  currency = 'XRP'

  decimals = 6

  toSatoshis = (decimal: number) => {
    return parseInt(new BigNumber(decimal).times(10 ** this.decimals).toNumber().toFixed(0))
  }

  async parsePayments(transaction: Transaction): Promise<Payment[]> {
    if (!transaction.txhex) {
      throw new Error('Transaction hex required for parsing XRP payments')
    }

    const decoded = decode(transaction.txhex)
    
    // Only handle Payment type transactions
    if (decoded.TransactionType !== 'Payment') {
      return []
    }

    // Convert from drops to XRP (1 XRP = 1,000,000 drops)
    const amount = Number(decoded.Amount)

    return [{
      txid: decoded.TxnSignature as string,
      currency: this.currency,
      chain: this.chain,
      amount,
      address: decoded.Destination as string
    }]
  }

  async getPayments(txid: string): Promise<Payment[]> {

    console.log("XRP Plugin getPayments", txid)

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

    console.log("XRP Plugin broadcastTx", txhex)

    const broadcastClient = new BroadcastClient(['wss://s1.ripple.com'])

    await broadcastClient.connect()

    const broadcastResult = await broadcastClient.submit(txhex)

    console.log("XRP Plugin broadcastTx result", broadcastResult)

    if (broadcastResult.result.engine_result !== 'tesSUCCESS') {
      throw new Error('XRP broadcastTx consensus failed')
    }

    return {
      txid: broadcastResult!.result!.tx_json!.hash!,
      txhex,
      success: true,
      result: broadcastResult!.result!.tx_json!
    }

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

  async verifyPayment({ paymentOption, transaction }: { 
    paymentOption: any, 
    transaction: { txhex: string }
  }): Promise<boolean> {
    try {
      // Parse the actual payments from the transaction
      const payments = await this.parsePayments({
        txhex: transaction.txhex
      });

      console.log("XRP Plugin verifyPayment payments", payments)

      if (payments.length === 0) {
        return false;
      }

      // Get the expected output from payment option
      const expectedOutput = paymentOption.outputs[0];
      const payment = payments[0];

      // Verify destination address matches
      if (payment.address !== expectedOutput.address) {
        return false;
      }

      // Verify amount matches
      if (payment.amount !== expectedOutput.amount) {
        return false;
      }

      return true;

    } catch (error) {
      console.error('XRP verify payment error:', error);
      return false;
    }
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

