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

import { BroadcastTxResult, BroadcastTx, Transaction, Payment, ValidateUnsignedTx, Confirmation } from '@/lib/plugin'

import oneSuccess from 'promise-one-success'

import UTXO_Plugin from '@/lib/plugins/utxo'
import { buildOutputs, verifyOutput } from '@/lib/pay';

import axios from 'axios';
import { log } from '@/lib/log';

import { SetPrice } from '@/lib/prices/price'

export default class FB extends UTXO_Plugin {

  currency = 'FB'

  chain = 'FB'

  decimals = 8;

  providerURL = "https://mempool.fractalbitcoin.io/api/v1"

  get bitcore() {

    return btc

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getPrice(): Promise<SetPrice> {
    try {
      // Fetch FB price from MEXC API
      const response = await axios.get('https://api.mexc.com/api/v3/trades?symbol=FBUSDT');
      
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        throw new Error('Invalid response from MEXC API');
      }
      
      // Get the most recent trade
      const latestTrade = response.data[0];
      const price = parseFloat(latestTrade.price);
      
      if (isNaN(price)) {
        throw new Error('Invalid price value from MEXC API');
      }
      
      return {
        base_currency: 'USD',
        currency: this.currency,
        chain: this.chain,
        value: price,
        source: 'mexc'
      };
    } catch (error) {
      console.error('Error fetching FB price from MEXC:', error);
      // Return a fallback price structure with zero value
      return {
        base_currency: 'USD',
        currency: this.currency,
        chain: this.chain,
        value: 0,
        source: 'mexc_fallback'
      };
    }
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

    console.log("FB Plugin parsePayments")

    const tx = bitcoin.Transaction.fromHex(txhex);
    
    const txOutputs = tx.outs.map((output) => {

      console.log("FB Plugin parsePayments output", output)
      try {

        let address = this.getTaprootAddressFromOutput(output.script)
      
        // Get address from output script
        if (!address) {
          address = bitcoin.address.fromOutputScript(
            output.script,
            bitcoin.networks.bitcoin
          );
        }

        console.log("FB Plugin parsePayments address", address)
  
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

    const api = `${this.providerURL}/tx`;
    const init: RequestInit = {
      method: "POST",
      body: txhex,
      headers: { "Content-Type": "text/plain" },
    };
    
    broadcastProviders.push(
      fetch(api, init).then(async (resp) => {
        if (!resp.ok) {
          console.log(resp.statusText);
          console.log(await resp.text());
          throw new Error("API_STATUS_ERROR");
        }
        const txid = await resp.text();
        return { 
          success: true, 
          txid, 
          txhex,
          result: txid 
        };
      }).catch(error => {
        console.error('FB broadcast error:', error);
        return { 
          success: false, 
          txid: '', 
          txhex,
          result: null,
          error: error.message 
        };
      })
    );

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
    // Get outputs from transaction
    const payments = await this.parsePayments({ txhex: params.transactions[0].txhex })

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

      verifyOutput(payments, address, output.amount);
    }

    return true;
  }

  async getConfirmation(txid: string): Promise<Confirmation | null> {
    try {
      const response = await axios.get(
        `https://mempool.space/api/tx/${txid}`
      );

      console.log("BTC Plugin getConfirmation response", response.data)

      const { status } = response.data;

      if (!status.confirmed) {
        log.info('Transaction not yet confirmed', { txid });
        return null;
      }

      return {
        confirmation_hash: status.block_hash,
        confirmation_height: status.block_height,
        confirmation_date: new Date(status.block_time * 1000), // Convert Unix timestamp to Date
        confirmations: 1 // Mempool API doesn't return confirmations count
      };

    } catch (error) {
      log.error('Error getting BTC confirmation', error);
      return null;
    }
  }

}
