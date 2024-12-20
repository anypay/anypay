
namespace Bitcore {
  export type Transaction = any
}

export type Bitcore = any;

import Transaction from '../transaction'

import PaymentOption from '../payment_option'

import { UTXOTransferInstruction } from '../instruction'

import Card from './_base'

import axios from 'axios'

import { getRawTx } from '../blockchair'
import BigNumber from 'bignumber.js';

export abstract class AbstractBitcoreCard extends Card {

  bitcore: Bitcore;

  abstract addInputs({tx, utxos}: { tx: Bitcore.Transaction, utxos: Utxo[] }): Promise<Bitcore.Transaction>

}

export default abstract class BitcoreCard extends AbstractBitcoreCard {

  get provider() { return 'https://api.bitcore.io/api' }

  getAddress() {

    return this.getPrivateKey().privateKey.toAddress().toString()

  }

  getPrivateKey() {
    
    return this.bitcore.HDPrivateKey.fromSeed(this.seed.toString('hex'))

  }

  async getBalance(): Promise<number> {

    const utxos: Utxo[] = await this.listUnspent()

    const result = utxos.reduce((sum, utxo) => {

        return sum + utxo.value

    }, 0)

    return result 

  }

  async listUnspent(): Promise<Utxo[]> {

    let address = this.getAddress()

    if (address.match(/:/)) {
        address = address.split(':')[1]
    }

    const url = `${this.provider}/${this.chain}/mainnet/address/${address}/?unspent=true`

    const { data } = await axios.get(url)

    const utxos: BitcoreIoUtxo[] = data

    return utxos.map(utxo => {
        return {
            scriptPubKey: utxo.script,
            value: utxo.value,
            txid: utxo.mintTxid,
            vout: utxo.mintIndex
        }
    })

  }

  async buildSignedPayment(paymentOption: PaymentOption): Promise<Transaction> {

    const tx = new this.bitcore.Transaction()

    const instruction: UTXOTransferInstruction = paymentOption.instructions[0]

    let totalOutput: BigNumber = new BigNumber(0)

    for (let output of instruction.outputs) {

      const address = this.bitcore.Address.fromString(output.address)

      const script = this.bitcore.Script.fromAddress(address)

      tx.addOutput(
        this.bitcore.Transaction.Output({
          satoshis: output.amount,
          script: script.toHex()
        })
      )

      totalOutput = totalOutput.plus(output.amount)

    }

    const utxos = await this.listUnspent()

    // Subclasses may override addInputs to implement chain-specific logic
    await this.addInputs({ tx, utxos })

    let totalInput: number = utxos.reduce((sum: BigNumber, input: Utxo) => {

      let satoshis = new BigNumber(input.value)

      var _sum = new BigNumber(sum)

      return _sum.plus(satoshis)

    }, new BigNumber(0)).toNumber()

    if (totalInput < totalOutput.toNumber()) {

      throw new Error(`Insufficient funds to pay invoice`)

    }

    // TODO: estimate and/or set mining fee and throw error if insufficient funds

    tx.change(this.getAddress())

    tx.sign(this.getPrivateKey().privateKey)

    const txhex = tx.serialize()

    const txid = tx.hash

    return { txhex, txid }

  }

  async addInputs({ tx, utxos }: { tx: Bitcore.Transaction, utxos: Utxo[] }): Promise<Bitcore.Transaction> {

    const unspent = await Promise.all(utxos.map(async utxo => {

      if (utxo.scriptPubKey) {
        return utxo
      }

      console.log("GET RAW TX", { txid: utxo.txid, chain: this.chain })

      const raw_transaction = await getRawTx(String(this.chain), utxo.txid)

      return Object.assign(utxo, {
        scriptPubKey: raw_transaction['vout'][utxo.vout].scriptPubKey.hex,
      })

    }))

    const coins = unspent.map(utxo => {

      const result = {
        txId: utxo.txid,
        outputIndex: utxo.vout,
        satoshis: utxo.value,
        scriptPubKey: utxo.scriptPubKey
      }

      return result
    })

    tx.from(coins)

    return tx

  }



}

export interface Utxo {
  scriptPubKey: string;
  value: number;
  txid: string;
  vout: number;
}

export interface BitcoreIoUtxo {
    _id: string;
    chain: string;
    network: string;
    coinbase: boolean;
    mintIndex: number;
    spentTxid: string;
    mintTxid: string;
    mintHeight: number;
    spentHeight: number;
    address: string;
    script: string;
    value: number;
    confirmations: number;
}
