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
import { addresses as Address, prices as Price } from '@prisma/client'

export { Price }

import {
  payment_options as PaymentOption,
  accounts as Account
} from '@prisma/client'

import { getPrice } from '@/lib/prices/kraken'

import { BigNumber } from 'bignumber.js'

import { Confirmation } from '@/lib/confirmations'

export { Confirmation }

import { buildOutputs, verifyOutput } from '@/lib/pay'

import { SetPrice as UnsavedPrice } from '@/lib/prices/price'

abstract class AbstractPlugin {

  abstract readonly currency: string;

  abstract readonly chain: string;

  abstract readonly decimals: number;

  token?: string;

  abstract buildSignedPayment(params: BuildSignedPayment): Promise<Transaction>;

  abstract verifyPayment(params: VerifyPayment): Promise<boolean>;

  abstract validateAddress(address: string): Promise<boolean>;

  abstract getTransaction(txid: string): Promise<Transaction>;

  abstract broadcastTx(params: BroadcastTx): Promise<BroadcastTxResult>;

  abstract getNewAddress(params: GetNewAddress): Promise<string>;

  abstract transformAddress(address: string): Promise<string>;

  abstract getConfirmation(txid: string): Promise<Confirmation | null>;

  abstract getPayments(txid: string): Promise<Payment[]>;

  abstract parsePayments(transaction: Transaction): Promise<Payment[]>;

  abstract getPrice(): Promise<UnsavedPrice>;

}

interface GetNewAddress {
  account: Account;
  address: Address;
}

export interface BroadcastTx {
  txhex: string;
  txid?: string;
  txkey?: string;
}

export abstract class Plugin extends AbstractPlugin {

  get bitcore(): any {
    return {

    }
  }

  async getPayments(txid: string): Promise<Payment[]> {

    throw new Error('not implemented')

  }

  async buildSignedPayment({ paymentOption, mnemonic }: {
    paymentOption: PaymentOption;
    mnemonic: string;
  }): Promise<Transaction> {

    throw new Error(`buildSignedPayment not implemented for ${this.currency} on ${this.chain}`)
  }

  async getNewAddress({address}: { account: Account, address: Address }): Promise<string> {

    return address.value as string

  }

  async getPrice(): Promise<UnsavedPrice> {

    return getPrice(this.currency)

  }

  async transformAddress(address: string): Promise<string> {

    if (address.match(':')) {

      address = address.split(':')[1]

    }

    return address;

  }

  toSatoshis(decimal: number): number {

    return Math.trunc(new BigNumber(decimal).times(Math.pow(10, this.decimals)).toNumber())

  }

  fromSatoshis(integer: number): number {

    return new BigNumber(integer).dividedBy(Math.pow(10, this.decimals)).toNumber()

  }

  async validateUnsignedTx(params: ValidateUnsignedTx): Promise<boolean> { 

    let tx = new this.bitcore.Transaction(params.transactions[0].txhex);

    let txOutputs = tx.outputs.map((output: { script: any; satoshis: any }) => {

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

        return null

      }

    })
    .filter((n: null) => n != null)

    const buildOutputsParams = Object.assign(params.paymentOption, {
      
      chain: params.paymentOption.chain as string,
      currency: params.paymentOption.currency,
      address: params.paymentOption.address as string,
      amount: Number(params.paymentOption.amount),
      fee: Number(params.paymentOption.fee),
      outputs: params.paymentOption.outputs as any
    });

    let outputs = await buildOutputs(buildOutputsParams, 'JSONV2');

    for (let output of outputs) {

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

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return this.validateUnsignedTx({
      paymentOption: params.paymentOption,
      transactions: [params.transaction]
    })
  }

  async parsePayments({txhex}: Transaction): Promise<Payment[]> {

    let tx = new this.bitcore.Transaction(txhex);

    let txOutputs = tx.outputs.map((output: { script: any; satoshis: any }) => {

      try {

        let address = new this.bitcore.Address(output.script).toString()

        if (address.match(':')) {
          address = address.split(':')[1]
        }

        return {
          address,
          amount: output.satoshis,
          currency: this.currency,
          chain: this.chain,
          txid: tx.hash
        }

      } catch(error) {

        return null

      }

    })
    .filter((n: null) => n != null)

    return txOutputs

  }

}

export interface BuildSignedPayment {
  paymentOption: PaymentOption;
  mnemonic: string;
}

export interface BroadcastTxResult {
  txid: string;
  txhex: string;
  success: boolean;
  result: any;
}

export interface VerifyPayment {
  paymentOption: PaymentOption;
  transaction: Transaction;
  protocol?: string;
}

export interface Transaction {
  txhex: string;
  txid?: string;
  txkey?: string;
}

export interface Payment {
  chain: string;
  currency: string;
  address: string;
  amount: number;
  txid: string;
}

export interface ValidateUnsignedTx {
    paymentOption: PaymentOption;
    transactions: Transaction[];
}

export { PaymentOption }

