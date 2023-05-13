
import { Account } from './account'

import { Address } from './addresses'

import { findOne } from './orm'

abstract class AbstractPlugin {

  currency: string;

  chain: string;

  decimals: number;

  token: string;

  abstract verifyPayment(params: VerifyPayment): Promise<boolean>;

  abstract validateAddress(address: string): Promise<boolean>;

  abstract getTransaction(txid: string): Promise<Transaction>;

  abstract broadcastTx(txhex: string): Promise<BroadcastTxResult>;

  abstract getNewAddress(account: Account): Promise<string>;

  abstract transformAddress(address: string): Promise<string>;

}

export abstract class Plugin extends AbstractPlugin {

  async getNewAddress(account: Account): Promise<string> {

    let address = await findOne<Address>(Address, {
      where: {
        account_id: account.get('id'),
        currency: this.currency,
        chain: this.chain
      }
    })

    return address.get('value')

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
  payment_option: any;
  transaction: {
      tx: string;
  };
  protocol: string;
}

export interface BroadcastTxResult {
  txid: string;
  txhex: string;
  success: boolean;
  result: any;
}

export interface VerifyPayment {
  payment_option: any;
  transaction: {
      tx: string;
  };
  protocol: string;
}

export interface Transaction {
  hex: string
}

