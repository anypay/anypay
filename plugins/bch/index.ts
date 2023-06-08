
require('dotenv').config();

import * as blockchair from '../../lib/blockchair'

import { Plugin, Transaction, BroadcastTx, Confirmation, BroadcastTxResult, VerifyPayment, Payment, ValidateUnsignedTx } from '../../lib/plugin'

import { buildOutputs, verifyOutput } from '../../lib/pay'

import { log } from '../../lib';

const bch: any = require('bitcore-lib-cash');

var bchaddr: any = require('bchaddrjs');

import { oneSuccess } from 'promise-one-success'

//import { getDecodedTransaction } from '../../lib/blockchair'

//import * as moment from 'moment'

//TODO: FinalizePlugin

import axios from 'axios'


export default class BCH extends Plugin {

  currency: string = 'BCH'

  chain: string = 'BCH'

  decimals: number = 8;

  get bitcore() {

    return bch

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await getRawTransaction(txid)

    if (!transaction.blockhash) { return }

    const hash = transaction.blockhash

    const timestamp = new Date(transaction.blocktime * 1000)

    const depth = transaction.confirmations

    const block = await getBlock(hash)

    const height = block.height

    return {
      hash,
      height,
      depth,
      timestamp
    }
    
  }

  async validateUnsignedTx(params: ValidateUnsignedTx): Promise<boolean> { 

    log.info(`payment.verify`, params)

    let tx = new this.bitcore.Transaction(params.transactions[0].txhex);

    let txOutputs = tx.outputs.map(output => {

      try {

        let address = new this.bitcore.Address(output.script).toString()

        if (address.match(':')) {
          address = address.split(':')[1]
        }

        return {
          address,
          amount: output.satoshis
        }

      } catch(error) {

        log.error(`payment.verify.error`, error)

        return null

      }

    })
    .filter(n => n != null)

    console.log("payment.verify.txoutputs", txOutputs);

    let outputs = await buildOutputs(params.paymentOption, 'JSONV2');

    for (let output of outputs) {

      log.info('output', output)

      var address;

      if (output.script) {

        address = new this.bitcore.Address(output.script).toString()

      } else {

        address = output.address

      }

      if (address.match(':')) {
        address = output && output.address ? output.address.split(':')[1] : null
      }

      verifyOutput(txOutputs, address, output.amount);
    }

    return true

  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      blockchair.publish('bitcoin-cash', txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string) {

    try {

      new bch.HDPublicKey(address);

      log.debug('plugins.bch.hdpublickey.valid', address)

      return true;

    } catch(error) {

      log.debug('plugins.bch.hdpublickey.invalid', error)

    }

    try {

      var isCashAddress = bchaddr.isCashAddress

      let valid = isCashAddress(address)

      return valid;

    } catch(error) {

      return false;

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    return { txhex: '' }
  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return this.validateUnsignedTx({
      paymentOption: params.paymentOption,
      transactions: [params.transaction]
    })
  }

}

interface GetRawTransactionResult {
  txid: string;
  hash: string;
  version: number;
  size: number;
  locktime: number;
  vin: any[];
  vout: any[];
  hex: string;
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
}

async function getRawTransaction(txid: string): Promise<GetRawTransactionResult> {

  const { data } = await axios.post(process.env.getblock_bch_url, {
    method: 'getrawtransaction',
    params: [txid, true]
  })

  return data.result

}

interface GetBlockResult {
  hash: string;
  height: number;
  time: number; 
}

async function getBlock(hash: string): Promise<GetBlockResult> {

  const { data } = await axios.post(process.env.getblock_bch_url, {
    method: 'getblock',
    params: [hash, 1]
  })

  return data.result

}

