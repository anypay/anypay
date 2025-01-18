import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, Payment } from '@/lib/plugin'

import { Client, decode } from 'xrpl'

import axios from 'axios'
import { SetPrice } from '@/lib/prices/price'

//TODO: FinishPluginImplementation

export default class XRP extends Plugin {

  chain = 'XRP'

  currency = 'XRP'

  decimals = 0 //TODO

  async parsePayments(transaction: Transaction): Promise<Payment[]> {

    const decoded = decode(transaction.txhex)

    if (decoded.TransactionType !== 'Payment') {
      return []
    }

    return [{
      currency: this.currency,
      chain: 'XRP',
      amount: Number(decoded.Amount) / 1000000, // Convert from drops to XRP
      address: decoded.Destination as string,
      txid: transaction.txid || ''
    }]
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
    const client = new Client("wss://s1.ripple.com");
    await client.connect();

    try {
      const result = await client.submit(txhex);
      
      await client.disconnect();

      return {
        txid: result.result.tx_json.hash || '',
        txhex,
        success: result.result.engine_result === 'tesSUCCESS',
        result: result.result
      };
    } catch (error) {
      await client.disconnect();
      throw error;
    }
  }

  async getTransaction(txid: string): Promise<Transaction> {
    throw new Error() //TODO
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
      if (!transaction.txhex) {
        return false;
      }

      const decoded = decode(transaction.txhex);
      // Verify it's a payment transaction
      if (decoded.TransactionType !== 'Payment') {
        return false;
      }

      // Get the expected output from payment option
      const expectedOutput = paymentOption.outputs[0];

      // Verify destination address matches
      if (decoded.Destination !== expectedOutput.address) {
        return false;
      }

      // Convert drops to XRP for amount comparison
      const amount = Number(decoded.Amount);
      
      // Verify amount matches
      if (amount !== expectedOutput.amount) {
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

