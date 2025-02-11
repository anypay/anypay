/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require('dotenv').config()
const btc = require('bitcore-lib')

import * as bitcoin from 'bitcoinjs-lib';

import { Address, Script } from '@cmdcode/tapscript'

import {
  blockchair,
  config,
  chain_so,
  nownodes
} from '@/lib'

import { BroadcastTxResult, BroadcastTx, Transaction, Payment, ValidateUnsignedTx } from '@/lib/plugin'

import * as bitcoind_rpc from '@/plugins/btc/bitcoind_rpc'

import oneSuccess from 'promise-one-success'

import UTXO_Plugin from '@/lib/plugins/utxo'
import { buildOutputs, verifyOutput } from '@/lib/pay';

export default class BTC extends UTXO_Plugin {

  currency = 'BTC'

  chain = 'BTC'

  decimals = 8;

  providerURL = String(config.get('GETBLOCK_BTC_URL'))

  get bitcore() {

    return btc

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  getTaprootAddressFromOutput(outputScript: Buffer): string | null {

    try {      

      console.log("getTaprootAddressFromOutput", outputScript)
      const script = Script.decode(outputScript)

      if (script[0] === 'OP_1') {
        const scriptPubKey = script[1]

        const address = Address.p2tr.fromPubKey(scriptPubKey)

        if (address) {
          return address.toString()
        }

        return null
      }

      console.log("getTaprootAddressFromOutput script", script)
      const address = Address.fromScriptPubKey(outputScript)

      if (address) {
        return address.toString()
      } else {
        return null
      }

    } catch(error) {

      console.error("getTaprootAddressFromOutput error", error)

      return null
    }

  }
  

  async parsePayments({txhex}: Transaction): Promise<Payment[]> {

    console.log("BTC Plugin parsePayments")

    const tx = bitcoin.Transaction.fromHex(txhex);
    
    const txOutputs = tx.outs.map((output) => {

      console.log("BTC Plugin parsePayments output", output)
      try {

        let address = this.getTaprootAddressFromOutput(output.script)
      
        // Get address from output script
        if (!address) {
          address = bitcoin.address.fromOutputScript(
            output.script,
            bitcoin.networks.bitcoin
          );
        }

        console.log("BTC Plugin parsePayments address", address)
  
        return {
          address: address.toString(),
          amount: output.value,
          currency: this.currency,
          chain: this.chain,
          txid: tx.getId()
        };
      } catch(error) {
        return null;
      }
    })
  
    return txOutputs.filter((n): n is Payment => n !== null);
  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = []

    if (config.get('BLOCKCHAIR_BROADCAST_PROVIDER_BTC_ENABLED')) {

      broadcastProviders.push(

        blockchair.publish('bitcoin', txhex)
      )

    }

    if (config.get('CHAIN_SO_BROADCAST_PROVIDER_ENABLED')) {

      broadcastProviders.push(chain_so.broadcastTx('BTC', txhex))

    }

    if (config.get('BITCOIND_RPC_HOST')) {

      broadcastProviders.push(

        bitcoind_rpc.broadcastTx(txhex)
      )
    }

    if (config.get('NOWNODES_ENABLED')) {

      broadcastProviders.push(

        nownodes.broadcastTx('BTC', txhex)
      )
    }

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string) {

    try {

      bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin)

      return true

    } catch(error) {

      return false

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    return { txhex: '' } //TODO
  }

  async validateUnsignedTx(params: ValidateUnsignedTx): Promise<boolean> {
    // Parse the transaction
    const tx = bitcoin.Transaction.fromHex(params.transactions[0].txhex);
    
    // Get outputs from transaction
    const txOutputs = tx.outs.map(output => {
      try {
        const address = bitcoin.address.fromOutputScript(
          output.script,
          bitcoin.networks.bitcoin
        );

        return {
          address,
          amount: output.value
        };
      } catch(error) {
        return null;
      }
    }).filter((n): n is { address: string, amount: number } => n !== null);

    // Build expected outputs
    const buildOutputsParams = {
      chain: params.paymentOption.chain as string,
      currency: params.paymentOption.currency,
      address: params.paymentOption.address as string,
      amount: Number(params.paymentOption.amount),
      fee: Number(params.paymentOption.fee),
      outputs: params.paymentOption.outputs as any[],
      invoice_uid: params.paymentOption.invoice_uid
    };

    const expectedOutputs = await buildOutputs(buildOutputsParams, 'JSONV2');

    // Verify each expected output exists in transaction
    for (const output of expectedOutputs) {
      const address = output.script ? 
        bitcoin.address.fromOutputScript(
          Buffer.from(output.script, 'hex'),
          bitcoin.networks.bitcoin
        ) : 
        output.address;

      verifyOutput(txOutputs, address, output.amount);
    }

    return true;
  }

}

