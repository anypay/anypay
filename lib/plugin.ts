
import { Address } from './addresses'

import { Account } from './account'

import { Price } from './price'

import { PaymentOption } from './payment_option'

import { getPrice } from './prices/kraken'

abstract class AbstractPlugin {

  abstract readonly currency: string;

  abstract readonly chain: string;

  abstract readonly decimals: number;

  token: string;

  abstract verifyPayment(params: VerifyPayment): Promise<boolean>;

  abstract validateAddress(address: string): Promise<boolean>;

  abstract getTransaction(txid: string): Promise<Transaction>;

  abstract broadcastTx(params: BroadcastTx): Promise<BroadcastTxResult>;

  abstract getNewAddress(params: GetNewAddress): Promise<string>;

  abstract transformAddress(address: string): Promise<string>;

  abstract getConfirmation(txid: string): Promise<Confirmation | null>;

  abstract getPayments(txid: string): Promise<Payment[]>;

  abstract parsePayments(txhex: string): Promise<Payment[]>;

  abstract getPrice({chain, currency, base}: {chain:string, currency: string, base: string}): Promise<Price>;

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

interface iConfirmation {
  hash: string;
  height: number;
  timestamp: Date;
  depth: number;
}

export type Confirmation = iConfirmation | null

export abstract class Plugin extends AbstractPlugin {

  get bitcore(): any {
    return {

    }
  }

  // should override if you want this to work properly
  async validateUnsignedTx(params: ValidateUnsignedTx): Promise<boolean> {

    return true
  }

  async getNewAddress({address}: { account: Account, address: Address }): Promise<string> {

    return address.get('value')

  }

  async getPrice({currency}: { chain: string, currency: string, base: string }): Promise<Price> {

    return getPrice(currency)

  }

  async transformAddress(address: string): Promise<string> {

    if (address.match(':')) {

      address = address.split(':')[1]

    }

    return address;

  }
  
}

export interface BroadcastTxResult {
  txid: string;
  txhex: string;
  success: boolean;
  result: any;
}

export interface VerifyPayment {
  payment_option: PaymentOption;
  transaction: Transaction;
  protocol: string;
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
    payment_option: PaymentOption;
    transactions: Transaction[];
}

export { PaymentOption }

