
import { addresses, accounts, payment_options } from '@prisma/client'

import { Price } from './price'

export { Price }

import { PaymentOption } from './payment_option'

import { getPrice } from './prices/kraken'

import { BigNumber } from 'bignumber.js'

import { Confirmation } from './confirmations'

export { Confirmation }

import { buildOutputs, verifyOutput } from './pay'

abstract class AbstractPlugin {

  abstract readonly currency: string;

  abstract readonly chain: string;

  abstract readonly decimals: number;

  token: string;

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

  abstract getPrice(): Promise<Price>;

}

interface GetNewAddress {
  account: accounts;
  address: addresses;
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

  async buildSignedPayment({ paymentOption, mnemonic }: { paymentOption: payment_options, mnemonic: string}): Promise<Transaction> {

    throw new Error(`buildSignedPayment not implemented for ${this.currency} on ${this.chain}`)
  }

  async getNewAddress({address}: { account: accounts, address: addresses }): Promise<string> {

    return address.value

  }

  async getPrice(): Promise<Price> {

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

    let txOutputs = tx.outputs.map((output: any) => {

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
    .filter((n: any) => n != null)

    let outputs = await buildOutputs(params.paymentOption, 'JSONV2');

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

    let txOutputs = tx.outputs.map((output: any) => {

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
    .filter((n: any) => n != null)

    return txOutputs

  }

}

export interface BuildSignedPayment {
  paymentOption: payment_options;
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

